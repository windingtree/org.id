const { TestHelper } = require('@openzeppelin/cli');
const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');

const {
    assertRevert,
    assertEvent
} = require('./helpers/assertions');

const {
    zeroAddress,
    zeroHash,
    mockOrgJsonUri,
    mockOrgJsonHash
} = require('./helpers/constants');

const {
    generateHashHelper,
    createOrganizationHelper,
    createUnitHelper
} = require('./helpers/orgid');

let gasLimit = 8000000; // Ropsten gas limit
if (process.env.SOLIDITY_COVERAGE) {
    gasLimit = 0xfffffffffff;
    Contracts.setLocalBuildDir('./.coverage_artifacts/contracts');
}
// workaround for https://github.com/zeppelinos/zos/issues/704
Contracts.setArtifactsDefaults({
    gas: gasLimit,
});

ZWeb3.initialize(web3.currentProvider);

const OrgIdContract = Contracts.getFromLocal('OrgId');
const OrgIdUpgradeabilityContract = Contracts.getFromLocal('OrgIdUpgradeability');

require('chai')
    .use(require('bn-chai')(web3.utils.BN))
    .should();

contract('ORG.ID', accounts => {
    const orgIdContractOwner = accounts[0];
    const organizationOwner = accounts[1];
    const randomAddress = accounts[2];
    const randomAddressTwo = accounts[3];

    let project;
    let orgIdContract;

    beforeEach(async () => {
        project = await TestHelper({
            from: orgIdContractOwner
        });
        orgIdContract = await project.createProxy(OrgIdContract, {
            initMethod: 'initialize',
            initArgs: [
                orgIdContractOwner
            ]
        });
    });

    describe('Upgradeability', () => {
        it('should upgrade proxy and reveal a new function and interface', async () => {
            orgIdContract = await project.upgradeProxy(
                orgIdContract.address,
                OrgIdUpgradeabilityContract,
                {
                    initMethod: 'initialize',
                    initArgs: []
                }
            );
            orgIdContract = await OrgIdUpgradeabilityContract.at(orgIdContract.address);
            await orgIdContract.methods['setupNewStorage(uint256)']('100')
                .send({
                    from: orgIdContractOwner
                });
            (await orgIdContract.methods['newfunction ()']()
                .call()).should.equal('100');
            (
                await orgIdContract
                    .methods['supportsInterface(bytes4)']('0x1b28d63e')
                    .call()
            ).should.be.true;
        });
    });

    describe('Ownable', () => {
        describe('#transferOwnership(address)', () => {
            it('should fail if called by non-owner', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['transferOwnership(address)'](randomAddress)
                        .send({
                            from: randomAddress
                        }),
                    'Ownable: caller is not the owner' // defined in @openzeppelin Ownable.sol
                );
            });

            it('should fail if new owner has zero address', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['transferOwnership(address)'](zeroAddress)
                        .send({
                            from: orgIdContractOwner
                        }),
                    'Ownable: new owner is the zero address' // defined in @openzeppelin Ownable.sol
                );
            });

            it('should transfer contract ownership', async () => {
                const result = await orgIdContract
                    .methods['transferOwnership(address)'](randomAddress)
                    .send({
                        from: orgIdContractOwner
                    });
                assertEvent(result, 'OwnershipTransferred', [
                    [ 'previousOwner', p => (p).should.equal(orgIdContractOwner) ],
                    [ 'newOwner', p => (p).should.equal(randomAddress) ],
                ]);
            });
        });

        describe('#owner()', () => {
            it('should return contract owner', async () => {
                (await orgIdContract.methods['owner()']().call())
                    .should.equal(orgIdContractOwner);
            });
        });
    });

    describe('ERC165 interfaces', () => {
        it('should support IERC165 interface', async () => {
            (await orgIdContract
                .methods['supportsInterface(bytes4)']('0x01ffc9a7')
                .call()
            ).should.be.true;
        });

        it('should support ownable interface', async () => {
            (await orgIdContract
                .methods['supportsInterface(bytes4)']('0x7f5828d0')
                .call()
            ).should.be.true;
        });

        it('should support hierarchy interface', async () => {
            (await orgIdContract
                .methods['supportsInterface(bytes4)']('0xfd95e493')
                .call()
            ).should.be.true;
        });

        it('should support ORG.ID interface', async () => {
            (await orgIdContract
                .methods['supportsInterface(bytes4)']('0x81ba1516')
                .call()
            ).should.be.true;
        });
    });

    describe('ORG.ID methods', () => {
        describe('#createOrganization(bytes32,string,bytes32)', () => {
            it('should create an organization', async () => {
                const ownerAddress = randomAddress;
                const result = await createOrganizationHelper(
                    orgIdContract,
                    ownerAddress,
                    [mockOrgJsonUri, mockOrgJsonHash]
                );

                let newOrgIdHash;
                assertEvent(result, 'OrganizationCreated', [
                    [ 'orgId', p => newOrgIdHash = p ],
                    [ 'owner', p => (p).should.equal(ownerAddress) ]
                ]);

                const newOrgId = await orgIdContract
                    .methods['getOrganization(bytes32)'](newOrgIdHash)
                    .call();

                (newOrgId.orgId).should.equal(newOrgIdHash);
                (newOrgId.orgJsonUri).should.equal(mockOrgJsonUri);
                (newOrgId.orgJsonHash).should.equal(mockOrgJsonHash);
                (newOrgId.parentOrgId).should.equal(zeroHash);
                (newOrgId.owner).should.equal(ownerAddress);
                (newOrgId.director).should.equal(zeroAddress);
                (newOrgId.isActive).should.be.true;
                (newOrgId.isDirectorshipAccepted).should.be.false;
            });
        });

        describe('#toggleActiveState(bytes32)', () => {
            let testOrgIdHash;

            beforeEach(async () => {
                const call = await createOrganizationHelper(
                    orgIdContract,
                    organizationOwner,
                    [mockOrgJsonUri, mockOrgJsonHash]
                );
                testOrgIdHash = call.events.OrganizationCreated.returnValues.orgId;
            });

            it('should fail if organization not found', async () => {
                const randomOrgIdHash = generateHashHelper();
                await assertRevert(
                    orgIdContract
                        .methods['toggleActiveState(bytes32)'](randomOrgIdHash)
                        .send({ from: organizationOwner }),
                    'ORG.ID: Organization not found'
                );
            });

            it('should fail if called by non-owner', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['toggleActiveState(bytes32)'](testOrgIdHash)
                        .send({ from: randomAddress }),
                    'ORG.ID: action not authorized (must be owner)'
                );
            });

            it('should toggle organization isActive state', async () => {
                await orgIdContract.methods['toggleActiveState(bytes32)'](testOrgIdHash)
                    .send({ from: organizationOwner });
                let org = await orgIdContract.methods['getOrganization(bytes32)'](testOrgIdHash)
                    .call();
                (org.isActive).should.be.false;
                await orgIdContract.methods['toggleActiveState(bytes32)'](testOrgIdHash)
                    .send({ from: organizationOwner });
                org = await orgIdContract.methods['getOrganization(bytes32)'](testOrgIdHash)
                    .call();
                (org.isActive).should.be.true;
                // TODO: no assertions for OrganizationActiveStateChanged event
            });
        });

        describe('#transferOrganizationOwnership(bytes32,address)', () => {
            let testOrgIdHash;

            beforeEach(async () => {
                const call = await createOrganizationHelper(
                    orgIdContract,
                    organizationOwner,
                    [mockOrgJsonUri, mockOrgJsonHash]
                );
                testOrgIdHash = call.events.OrganizationCreated.returnValues.orgId;
            });

            it('should fail if organization not found', async () => {
                const randomOrgIdHash = generateHashHelper();
                await assertRevert(
                    orgIdContract
                        .methods['transferOrganizationOwnership(bytes32,address)'](
                            randomOrgIdHash,
                            randomAddress
                        )
                        .send({ from: organizationOwner }),
                    'ORG.ID: Organization not found'
                );
            });

            it('should fail if called by non-owner', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['transferOrganizationOwnership(bytes32,address)'](
                            testOrgIdHash,
                            randomAddress
                        )
                        .send({ from: randomAddress }),
                    'ORG.ID: action not authorized (must be owner)'
                );
            });

            it('should fail if new owner has zero address', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['transferOrganizationOwnership(bytes32,address)'](
                            testOrgIdHash,
                            zeroAddress
                        )
                        .send({ from: organizationOwner }),
                    'ORG.ID: Invalid owner address'
                );
            });

            it('should transfer organization ownership', async () => {
                const result = await orgIdContract
                    .methods['transferOrganizationOwnership(bytes32,address)'](
                        testOrgIdHash,
                        randomAddress
                    )
                    .send({ from: organizationOwner });

                assertEvent(result, 'OrganizationOwnershipTransferred', [
                    [ 'orgId', p => (p).should.equal(testOrgIdHash) ],
                    [ 'previousOwner', p => (p).should.equal(organizationOwner) ],
                    [ 'newOwner', p => (p).should.equal(randomAddress) ]
                ]);
            });
        });

        describe('#setOrgJson(bytes32,string,bytes32)', () => {
            let testOrgIdHash;
            const testOrgIdOwner = accounts[5];
            let newOrgJsonUri = mockOrgJsonUri + '/some/random/path/org.json';
            let newOrgJsonHash = generateHashHelper();

            beforeEach(async () => {
                const call = await createOrganizationHelper(
                    orgIdContract,
                    testOrgIdOwner,
                    [mockOrgJsonUri, mockOrgJsonHash]
                );
                testOrgIdHash = call.events.OrganizationCreated.returnValues.orgId;
            });

            it('should fail if organization not found', async () => {
                const randomOrgIdHash = generateHashHelper();
                await assertRevert(
                    orgIdContract
                        .methods['setOrgJson(bytes32,string,bytes32)'](
                            randomOrgIdHash,
                            newOrgJsonUri,
                            newOrgJsonHash
                        )
                        .send({ from: testOrgIdOwner }),
                    'ORG.ID: Organization not found'
                );
            });

            it('should fail if called by non-owner', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['setOrgJson(bytes32,string,bytes32)'](
                            testOrgIdHash,
                            newOrgJsonUri,
                            newOrgJsonHash
                        )
                        .send({ from: randomAddress }),
                    'ORG.ID: action not authorized (must be owner or director)'
                );
            });

            it('should fail if URI is an empty string', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['setOrgJson(bytes32,string,bytes32)'](
                            testOrgIdHash,
                            '',
                            newOrgJsonHash
                        )
                        .send({ from: testOrgIdOwner }),
                    'ORG.ID: ORG.JSON URI cannot be empty'
                );
            });

            it('should fail if hash is all zeroes', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['setOrgJson(bytes32,string,bytes32)'](
                            testOrgIdHash,
                            newOrgJsonUri,
                            zeroHash
                        )
                        .send({ from: testOrgIdOwner }),
                    'ORG.ID: ORG.JSON hash cannot be zero'
                );
            });

            it('should fail if hash is an empty string', async () => {
                assert.throws(() => {
                    orgIdContract
                        .methods['setOrgJson(bytes32,string,bytes32)'](
                            testOrgIdHash,
                            newOrgJsonUri,
                            ''
                        )
                        .send({ from: testOrgIdOwner });
                }, /invalid bytes32 value/);
            });

            it('should change ORG.JSON URI and hash', async () => {
                const result = await orgIdContract
                    .methods['setOrgJson(bytes32,string,bytes32)'](
                        testOrgIdHash,
                        newOrgJsonUri,
                        newOrgJsonHash
                    )
                    .send({ from: testOrgIdOwner });

                assertEvent(result, 'OrgJsonChanged', [
                    [ 'orgId', p => (p).should.equal(testOrgIdHash) ],
                    [ 'previousOrgJsonUri', p => (p).should.equal(mockOrgJsonUri) ],
                    [ 'newOrgJsonUri', p => (p).should.equal(newOrgJsonUri) ],
                    [ 'previousOrgJsonHash', p => (p).should.equal(mockOrgJsonHash) ],
                    [ 'newOrgJsonHash', p => (p).should.equal(newOrgJsonHash) ]
                ]);
            });

            describe('Changing ORG.JSON URI and hash by unit director', () => {
                const unitDirector = accounts[6];
                let testUnitOrgIdHash;

                beforeEach(async () => {
                    const call = await createUnitHelper(
                        orgIdContract,
                        testOrgIdOwner,
                        [
                            testOrgIdHash,
                            unitDirector,
                            mockOrgJsonUri,
                            mockOrgJsonHash
                        ]
                    );
                    testUnitOrgIdHash = call.events.UnitCreated.returnValues.unitOrgId;
                });

                it('should fail if called by non-owner or non-director', async () => {
                    await assertRevert(
                        orgIdContract
                            .methods['setOrgJson(bytes32,string,bytes32)'](
                                testUnitOrgIdHash,
                                newOrgJsonUri,
                                newOrgJsonHash
                            )
                            .send({ from: randomAddress }),
                        'ORG.ID: action not authorized (must be owner or director)'
                    );
                });

                // TODO: it should not matter if director is confirmed or not (next test is about that)
                it('should succeed if called by confirmed director', async () => {
                    await orgIdContract
                        .methods['acceptDirectorship(bytes32)'](testUnitOrgIdHash)
                        .send({ from: unitDirector });
                    const result = await orgIdContract
                        .methods['setOrgJson(bytes32,string,bytes32)'](
                            testUnitOrgIdHash,
                            newOrgJsonUri,
                            newOrgJsonHash
                        )
                        .send({ from: unitDirector });

                    assertEvent(result, 'OrgJsonChanged', [
                        [ 'orgId', p => (p).should.equal(testUnitOrgIdHash) ],
                        [ 'previousOrgJsonUri', p => (p).should.equal(mockOrgJsonUri) ],
                        [ 'newOrgJsonUri', p => (p).should.equal(newOrgJsonUri) ],
                        [ 'previousOrgJsonHash', p => (p).should.equal(mockOrgJsonHash) ],
                        [ 'newOrgJsonHash', p => (p).should.equal(newOrgJsonHash) ]
                    ]);
                });

                it('should change ORG.JSON URI and hash if called by non-confirmed director', async () => {
                    const result = await orgIdContract
                        .methods['setOrgJson(bytes32,string,bytes32)'](
                            testUnitOrgIdHash,
                            newOrgJsonUri,
                            newOrgJsonHash
                        )
                        .send({ from: unitDirector });

                    assertEvent(result, 'DirectorshipAccepted', [
                        [ 'orgId', p => (p).should.equal(testUnitOrgIdHash) ],
                        [ 'director', p => (p).should.equal(unitDirector) ]
                    ]);

                    assertEvent(result, 'OrgJsonChanged', [
                        [ 'orgId', p => (p).should.equal(testUnitOrgIdHash) ],
                        [ 'previousOrgJsonUri', p => (p).should.equal(mockOrgJsonUri) ],
                        [ 'newOrgJsonUri', p => (p).should.equal(newOrgJsonUri) ],
                        [ 'previousOrgJsonHash', p => (p).should.equal(mockOrgJsonHash) ],
                        [ 'newOrgJsonHash', p => (p).should.equal(newOrgJsonHash) ]
                    ]);
                });
            });
        });

        describe('#getOrganizations(bool)', () => {
            it('should return empty array if registry is empty', async () => {
                const orgs = await orgIdContract
                    .methods['getOrganizations(bool)'](false)
                    .call();
                (orgs).should.to.be.an('array');
                (orgs.length).should.equal(0);
            });

            describe('with incative organizations', () => {
                let orgId1;
                let orgId2;

                beforeEach(async () => {
                    const call1 = await createOrganizationHelper(
                        orgIdContract,
                        randomAddress,
                        [mockOrgJsonUri, mockOrgJsonHash]
                    );
                    orgId1 = call1.events.OrganizationCreated.returnValues.orgId;
                    const call2 = await createOrganizationHelper(
                        orgIdContract,
                        randomAddressTwo,
                        [mockOrgJsonUri, mockOrgJsonHash]
                    );
                    orgId2 = call2.events.OrganizationCreated.returnValues.orgId;
                    await orgIdContract.methods['toggleActiveState(bytes32)'](orgId1)
                        .send({ from: randomAddress });
                    await orgIdContract.methods['toggleActiveState(bytes32)'](orgId2)
                        .send({ from: randomAddressTwo });
                });

                it('should return empty array if registry contains only inactive organizations', async () => {
                    const orgs = await orgIdContract
                        .methods['getOrganizations(bool)'](false)
                        .call();
                    (orgs).should.to.be.an('array');
                    (orgs.length).should.equal(0);
                });

                it('should return array which includes inactive organizations', async () => {
                    const orgs = await orgIdContract
                        .methods['getOrganizations(bool)'](true)
                        .call();
                    (orgs).should.to.be.an('array');
                    (orgs.length).should.equal(2);
                });
            });

            it('should return an array of organizations', async () => {
                const call1 = await createOrganizationHelper(
                    orgIdContract,
                    randomAddress,
                    [mockOrgJsonUri, mockOrgJsonHash]
                );
                const orgId1 = call1.events.OrganizationCreated.returnValues.orgId;
                const call2 = await createOrganizationHelper(
                    orgIdContract,
                    randomAddressTwo,
                    [mockOrgJsonUri, mockOrgJsonHash]
                );
                const orgId2 = call2.events.OrganizationCreated.returnValues.orgId;

                const orgs = await orgIdContract
                    .methods['getOrganizations(bool)'](false)
                    .call();
                (orgs).should.to.be.an('array').that.include.members([
                    orgId1,
                    orgId2
                ]);
            });
        });

        describe('#getOrganization(bytes32)', () => {
            let testOrgIdHash;
            const testOrgIdOwner = accounts[5];

            beforeEach(async () => {
                const call = await createOrganizationHelper(
                    orgIdContract,
                    testOrgIdOwner,
                    [mockOrgJsonUri, mockOrgJsonHash]
                );
                testOrgIdHash = call.events.OrganizationCreated.returnValues.orgId;
            });

            it('should return exists=false if organization not found', async () => {
                const randomOrgIdHash = generateHashHelper();
                const orgId = await orgIdContract
                    .methods['getOrganization(bytes32)'](randomOrgIdHash)
                    .call();

                (orgId).should.has.property('exists').to.false;
            });

            it('should return an organization', async () => {
                const orgId = await orgIdContract
                    .methods['getOrganization(bytes32)'](testOrgIdHash)
                    .call();

                (orgId).should.has.property('exists').to.true;
                (orgId).should.has.property('orgId').to.equal(testOrgIdHash);
                (orgId).should.has.property('orgJsonUri').to.equal(mockOrgJsonUri);
                (orgId).should.has.property('orgJsonHash').to.equal(mockOrgJsonHash);
                (orgId).should.has.property('parentOrgId').to.equal(zeroHash);
                (orgId).should.has.property('owner').to.equal(testOrgIdOwner);
                (orgId).should.has.property('director').to.equal(zeroAddress);
                (orgId).should.has.property('isActive').to.be.true;
                (orgId).should.has.property('isDirectorshipAccepted').to.be.false;
            });
        });
    });

    describe('ORG.ID hierarchy', () => {
        let parentOrgIdHash;
        const unitOwner = accounts[5];
        const testOrgIdOwner = unitOwner;
        const unitDirector = accounts[6];
        const nonOwnerOrDirector = accounts[7];

        beforeEach(async () => {
            const call = await createOrganizationHelper(
                orgIdContract,
                testOrgIdOwner,
                [mockOrgJsonUri, mockOrgJsonHash]
            );
            parentOrgIdHash = call.events.OrganizationCreated.returnValues.orgId;
        });

        describe('#createUnit(bytes32,address,string,bytes32)', () => {
            it('should fail if called by non-owner', async () => {
                await assertRevert(
                    createUnitHelper(
                        orgIdContract,
                        nonOwnerOrDirector,
                        [
                            parentOrgIdHash,
                            unitDirector,
                            mockOrgJsonUri,
                            mockOrgJsonHash
                        ]
                    ),
                    'ORG.ID: action not authorized (must be owner)'
                );
            });

            it('should fail if parent organization not found', async () => {
                const nonExistingOrgIdHash = generateHashHelper();
                await assertRevert(
                    createUnitHelper(
                        orgIdContract,
                        testOrgIdOwner,
                        [
                            nonExistingOrgIdHash,
                            unitDirector,
                            mockOrgJsonUri,
                            mockOrgJsonHash
                        ]
                    ),
                    'ORG.ID: Organization not found'
                );
            });

            it('should create a unit', async () => {
                const call = await createUnitHelper(
                    orgIdContract,
                    testOrgIdOwner,
                    [
                        parentOrgIdHash,
                        unitDirector,
                        mockOrgJsonUri,
                        mockOrgJsonHash
                    ]
                );

                let newUnitOrgIdHash;
                assertEvent(call, 'UnitCreated', [
                    [ 'parentOrgId', p => (p).should.equal(parentOrgIdHash) ],
                    [ 'unitOrgId', p => newUnitOrgIdHash = p ],
                    [ 'director', p => (p).should.equal(unitDirector) ]
                ]);

                const unit = await orgIdContract
                    .methods['getOrganization(bytes32)'](newUnitOrgIdHash)
                    .call();

                (unit.orgId).should.equal(newUnitOrgIdHash);
                (unit.orgJsonUri).should.equal(mockOrgJsonUri);
                (unit.orgJsonHash).should.equal(mockOrgJsonHash);
                (unit.parentOrgId).should.equal(parentOrgIdHash);
                (unit.owner).should.equal(testOrgIdOwner);
                (unit.director).should.equal(unitDirector);
                (unit.isActive).should.be.true;
                (unit.isDirectorshipAccepted).should.be.false;
            });

            it('directorship should be automatically accepted if director address = owner address', async () => {
                const call = await createUnitHelper(
                    orgIdContract,
                    testOrgIdOwner,
                    [
                        parentOrgIdHash,
                        testOrgIdOwner, // director address
                        mockOrgJsonUri,
                        mockOrgJsonHash
                    ]
                );
                const newUnitOrgIdHash = call.events.UnitCreated.returnValues.unitOrgId;

                assertEvent(call, 'DirectorshipAccepted', [
                    [ 'orgId', p => (p).should.equal(newUnitOrgIdHash) ],
                    [ 'director', p => (p).should.equal(testOrgIdOwner) ]
                ]);

                const unit = await orgIdContract
                    .methods['getOrganization(bytes32)'](newUnitOrgIdHash)
                    .call();

                (unit.isDirectorshipAccepted).should.be.true;
            });

            // TODO: confirming zero address doesn't make sense
            it('directorship should be automatically accepted if director address = zero address', async () => {
                const call = await createUnitHelper(
                    orgIdContract,
                    testOrgIdOwner,
                    [
                        parentOrgIdHash,
                        zeroAddress, // director address
                        mockOrgJsonUri,
                        mockOrgJsonHash
                    ]
                );
                const newUnitOrgIdHash = call.events.UnitCreated.returnValues.unitOrgId;

                assertEvent(call, 'DirectorshipAccepted', [
                    [ 'orgId', p => (p).should.equal(newUnitOrgIdHash) ],
                    [ 'director', p => (p).should.equal(zeroAddress) ]
                ]);

                const unit = await orgIdContract
                    .methods['getOrganization(bytes32)'](newUnitOrgIdHash)
                    .call();

                (unit.isDirectorshipAccepted).should.be.true;
            });
        });

        // TODO: if nominated director calls any director-specific methods,
        // directorship is automatically accepted

        describe('#acceptDirectorship(bytes32)', () => {
            let testUnitOrgIdHash;

            beforeEach(async () => {
                const call = await createUnitHelper(
                    orgIdContract,
                    testOrgIdOwner,
                    [
                        parentOrgIdHash,
                        unitDirector,
                        mockOrgJsonUri,
                        mockOrgJsonHash
                    ]
                );
                testUnitOrgIdHash = call.events.UnitCreated.returnValues.unitOrgId;
            });

            it('should fail if organization not found', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['acceptDirectorship(bytes32)'](zeroHash)
                        .send({ from: unitDirector }),
                    'ORG.ID: Organization not found'
                );
            });

            it('should fail if not called by director', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['acceptDirectorship(bytes32)'](testUnitOrgIdHash)
                        .send({ from: randomAddress }),
                    'ORG.ID: action not authorized (must be director)'
                );
            });

            it('should accept directorship', async () => {
                const result = await orgIdContract
                    .methods['acceptDirectorship(bytes32)'](testUnitOrgIdHash)
                    .send({ from: unitDirector });

                assertEvent(result, 'DirectorshipAccepted', [
                    [ 'orgId', p => (p).should.equal(testUnitOrgIdHash) ],
                    [ 'director', p => (p).should.equal(unitDirector) ]
                ]);
            });
        });

        describe('#transferDirectorship(bytes32,address)', () => {
            let testUnitOrgIdHash;
            const newDirector = accounts[10];

            beforeEach(async () => {
                const call = await createUnitHelper(
                    orgIdContract,
                    testOrgIdOwner,
                    [
                        parentOrgIdHash,
                        unitDirector,
                        mockOrgJsonUri,
                        mockOrgJsonHash
                    ]
                );
                testUnitOrgIdHash = call.events.UnitCreated.returnValues.unitOrgId;

                await orgIdContract
                    .methods['acceptDirectorship(bytes32)'](testUnitOrgIdHash)
                    .send({ from: unitDirector });
            });

            it('should fail if organization not found', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['transferDirectorship(bytes32,address)'](
                            generateHashHelper(),
                            newDirector
                        )
                        .send({ from: organizationOwner }),
                    'ORG.ID: Organization not found'
                );
            });

            it('should fail if called by non-owner (e.g. director)', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['transferDirectorship(bytes32,address)'](
                            testUnitOrgIdHash,
                            newDirector
                        )
                        .send({ from: nonOwnerOrDirector }),
                    'ORG.ID: action not authorized (must be owner)'
                );
            });

            it('should transfer directorship', async () => {
                const result = await orgIdContract
                    .methods['transferDirectorship(bytes32,address)'](
                        testUnitOrgIdHash,
                        newDirector
                    )
                    .send({ from: unitOwner });

                assertEvent(result, 'DirectorshipTransferred', [
                    [ 'orgId', p => (p).should.equal(testUnitOrgIdHash) ],
                    [ 'previousDirector', p => (p).should.equal(unitDirector) ],
                    [ 'newDirector', p => (p).should.equal(newDirector) ]
                ]);
                let org = await orgIdContract
                    .methods['getOrganization(bytes32)'](testUnitOrgIdHash)
                    .call();
                (org.isDirectorshipAccepted).should.be.false;
            });

            it('should automatically accept directorship if transferred to owner', async () => {
                const result = await orgIdContract
                    .methods['transferDirectorship(bytes32,address)'](
                        testUnitOrgIdHash,
                        unitOwner
                    )
                    .send({ from: unitOwner });

                assertEvent(result, 'DirectorshipTransferred', [
                    [ 'orgId', p => (p).should.equal(testUnitOrgIdHash) ],
                    [ 'previousDirector', p => (p).should.equal(unitDirector) ],
                    [ 'newDirector', p => (p).should.equal(unitOwner) ]
                ]);
                assertEvent(result, 'DirectorshipAccepted', [
                    [ 'orgId', p => (p).should.equal(testUnitOrgIdHash) ],
                    [ 'director', p => (p).should.equal(unitOwner) ]
                ]);

                let org = await orgIdContract
                    .methods['getOrganization(bytes32)'](testUnitOrgIdHash)
                    .call();
                (org.isDirectorshipAccepted).should.be.true;
            });
        });

        describe('#renounceDirectorship(bytes32)', () => {
            let testUnitOrgIdHash;
            const unitDirector = accounts[10];

            beforeEach(async () => {
                const call = await createUnitHelper(
                    orgIdContract,
                    testOrgIdOwner,
                    [
                        parentOrgIdHash,
                        unitDirector,
                        mockOrgJsonUri,
                        mockOrgJsonHash
                    ]
                );
                testUnitOrgIdHash = call.events.UnitCreated.returnValues.unitOrgId;
                await orgIdContract
                    .methods['acceptDirectorship(bytes32)'](testUnitOrgIdHash)
                    .send({ from: unitDirector });
            });

            it('should fail if organization not found', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['renounceDirectorship(bytes32)'](
                            generateHashHelper()
                        )
                        .send({ from: organizationOwner }),
                    'ORG.ID: Organization not found'
                );
            });

            it('should fail if called by non-owner (e.g. director)', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['renounceDirectorship(bytes32)'](
                            testUnitOrgIdHash
                        )
                        .send({ from: nonOwnerOrDirector }),
                    'ORG.ID: action not authorized (must be owner or director)'
                );
            });

            it('should renounce directorship owner', async () => {
                const result = await orgIdContract
                    .methods['renounceDirectorship(bytes32)'](
                        testUnitOrgIdHash
                    )
                    .send({ from: unitOwner });

                assertEvent(result, 'DirectorshipTransferred', [
                    [ 'orgId', p => (p).should.equal(testUnitOrgIdHash) ],
                    [ 'previousDirector', p => (p).should.equal(unitDirector) ],
                    [ 'newDirector', p => (p).should.equal(zeroAddress) ]
                ]);
            });

            it('should renounce directorship director', async () => {
                const result = await orgIdContract
                    .methods['renounceDirectorship(bytes32)'](
                        testUnitOrgIdHash
                    )
                    .send({ from: unitDirector });

                assertEvent(result, 'DirectorshipTransferred', [
                    [ 'orgId', p => (p).should.equal(testUnitOrgIdHash) ],
                    [ 'previousDirector', p => (p).should.equal(unitDirector) ],
                    [ 'newDirector', p => (p).should.equal(zeroAddress) ]
                ]);
            });
        });

        describe('#getUnits(bytes32,bool)', function () {
            let o;
            let parentOrgIdHash;
            const parentOrgIdOwner = accounts[5];
            const testOrgIdOwner = accounts[5];
            const unitDirector = accounts[6];

            before(async function () {
                o = await project.createProxy(OrgIdContract, {
                    initMethod: 'initialize',
                    initArgs: [
                        orgIdContractOwner
                    ]
                });

                const call = await createOrganizationHelper(
                    o,
                    testOrgIdOwner,
                    [mockOrgJsonUri, mockOrgJsonHash]
                );
                parentOrgIdHash = call.events.OrganizationCreated.returnValues.orgId;
            });

            it('should fail if organization not found', async function () {
                const nonExistingOrgIdHash = generateHashHelper();
                await assertRevert(
                    o
                        .methods['getUnits(bytes32,bool)'](
                            nonExistingOrgIdHash,
                            false
                        )
                        .call(),
                    'ORG.ID: Organization not found'
                );
            });

            it('should return empty array if organization has no units', async function () {
                const units = await o
                    .methods['getUnits(bytes32,bool)'](parentOrgIdHash, true)
                    .call();

                (units).should.to.be.an('array');
                (units.length).should.equal(0);
            });

            describe('counting and getting units', function () {
                let allUnitHashes = [];
                let activeUnitHashes = [];

                before(async function () {
                    for (let i = 0; i < 7; i++) {
                        const call = await createUnitHelper(
                            o,
                            parentOrgIdOwner,
                            [
                                parentOrgIdHash,
                                unitDirector,
                                mockOrgJsonUri,
                                mockOrgJsonHash
                            ]
                        );
                        const h = call.events.UnitCreated.returnValues.unitOrgId;

                        allUnitHashes.push(h);
                        if (i % 2 === 0) {
                            // units are active by default
                            activeUnitHashes.push(h);
                        } else {
                            // deactivate unit
                            await o.methods['toggleActiveState(bytes32)'](h)
                                .send({ from: parentOrgIdOwner });
                        }
                    }
                });

                it('should return an array of ACTIVE units only, if "includeInactive" flag set to "false"', async function () {
                    const units = await o
                        .methods['getUnits(bytes32,bool)'](parentOrgIdHash, false)
                        .call();

                    (units).should.to.be.an('array');
                    (units.length).should.equal(activeUnitHashes.length);
                });

                it('should return an array of ALL units, if "includeInactive" flag set to "true"', async function () {
                    const units = await o
                        .methods['getUnits(bytes32,bool)'](parentOrgIdHash, true)
                        .call();

                    (units).should.to.be.an('array');
                    (units.length).should.equal(allUnitHashes.length);
                });
            });
        });
    });
});

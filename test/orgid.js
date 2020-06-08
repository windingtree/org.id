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

    const getRandomAccount = () => {
        return accounts[Math.floor(Math.random() * accounts.length)];
    };

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
            await orgIdContract.methods['setupNewStorage(uint256)']('100').send({
                from: orgIdContractOwner
            });
            (await orgIdContract.methods['newFunction()']().call()).should.equal('100');
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
                .methods['supportsInterface(bytes4)']('0x3a3bc250')
                .call()
            ).should.be.true;
        });

        it('should support ORG.ID interface', async () => {
            (await orgIdContract
                .methods['supportsInterface(bytes4)']('0x36b78f0f')
                .call()
            ).should.be.true;
        });
    });

    describe('ORG.ID methods', () => {
        describe('#createOrganization(bytes32,string,bytes32)', () => {
            it('should create an organization', async () => {
                const ownerAddress = getRandomAccount();
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
                testOrgIdHash = call.events['OrganizationCreated'].returnValues.orgId;
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
                let org = await orgIdContract.methods['getOrganization(bytes32)'](testOrgIdHash).call();
                (org.isActive).should.be.false;
                await orgIdContract.methods['toggleActiveState(bytes32)'](testOrgIdHash)
                    .send({ from: organizationOwner });
                org = await orgIdContract.methods['getOrganization(bytes32)'](testOrgIdHash).call();
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
                testOrgIdHash = call.events['OrganizationCreated'].returnValues.orgId;
            });

            it('should fail if organization not found', async () => {
                const randomOrgIdHash = generateHashHelper();
                await assertRevert(
                    orgIdContract
                        .methods['transferOrganizationOwnership(bytes32,address)'](randomOrgIdHash, randomAddress)
                        .send({ from: organizationOwner }),
                    'ORG.ID: Organization not found'
                );
            });

            it('should fail if called by non-owner', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['transferOrganizationOwnership(bytes32,address)'](testOrgIdHash, randomAddress)
                        .send({ from: randomAddress }),
                    'ORG.ID: action not authorized (must be owner)'
                );
            });

            it('should fail if new owner has zero address', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['transferOrganizationOwnership(bytes32,address)'](testOrgIdHash, zeroAddress)
                        .send({ from: organizationOwner }),
                    'ORG.ID: Invalid owner address'
                );
            });

            it('should transfer organization ownership', async () => {
                const result = await orgIdContract
                    .methods['transferOrganizationOwnership(bytes32,address)'](testOrgIdHash, randomAddress)
                    .send({ from: organizationOwner });

                assertEvent(result, 'OrganizationOwnershipTransferred', [
                    [ 'orgId', p => (p).should.equal(testOrgIdHash) ],
                    [ 'previousOwner', p => (p).should.equal(organizationOwner) ],
                    [ 'newOwner', p => (p).should.equal(randomAddress) ]
                ]);
            });
        });

        describe('#changeOrgJsonUri(bytes32,string)', () => {
            let testOrgIdHash;
            const testOrgIdOwner = accounts[5];
            let newOrgJsonUri = mockOrgJsonUri + '/some/random/path/org.json';

            beforeEach(async () => {
                const call = await createOrganizationHelper(
                    orgIdContract,
                    testOrgIdOwner,
                    [mockOrgJsonUri, mockOrgJsonHash]
                );
                testOrgIdHash = call.events['OrganizationCreated'].returnValues.orgId;
            });

            it('should fail if organization not found', async () => {
                const randomOrgIdHash = generateHashHelper();
                await assertRevert(
                    orgIdContract
                        .methods['changeOrgJsonUri(bytes32,string)'](randomOrgIdHash, newOrgJsonUri)
                        .send({ from: testOrgIdOwner }),
                    'ORG.ID: Organization not found'
                );
            });

            it('should fail if called by non-owner', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['changeOrgJsonUri(bytes32,string)'](testOrgIdHash, newOrgJsonUri)
                        .send({ from: randomAddress }),
                    'ORG.ID: action not authorized (must be owner or director)'
                );
            });

            it('should fail if empty string provided', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['changeOrgJsonUri(bytes32,string)'](testOrgIdHash, '')
                        .send({ from: testOrgIdOwner }),
                    'ORG.ID: ORG.JSON URI cannot be empty'
                );
            });

            it('should change ORG.JSON URI', async () => {
                const result = await orgIdContract
                    .methods['changeOrgJsonUri(bytes32,string)'](testOrgIdHash, newOrgJsonUri)
                    .send({ from: testOrgIdOwner });

                assertEvent(result, 'OrgJsonUriChanged', [
                    [ 'orgId', p => (p).should.equal(testOrgIdHash) ],
                    [ 'previousOrgJsonUri', p => (p).should.equal(mockOrgJsonUri) ],
                    [ 'newOrgJsonUri', p => (p).should.equal(newOrgJsonUri) ]
                ]);
            });

            it('should change unit ORG.JSON URI requested by director', async () => {
                const parentOrgIdOwner = testOrgIdOwner;
                const parentOrgIdHash = testOrgIdHash;
                const unitDirector = randomAddressTwo;
                const call = await createUnitHelper(
                    orgIdContract,
                    parentOrgIdOwner,
                    [parentOrgIdHash, unitDirector, mockOrgJsonUri, mockOrgJsonHash]
                );
                const testUnitOrgIdHash = call.events['UnitCreated'].returnValues.unitOrgId;

                const result = await orgIdContract
                    .methods['changeOrgJsonUri(bytes32,string)'](testUnitOrgIdHash, newOrgJsonUri)
                    .send({ from: unitDirector });

                assertEvent(result, 'OrgJsonUriChanged', [
                    [ 'orgId', p => (p).should.equal(testUnitOrgIdHash) ],
                    [ 'previousOrgJsonUri', p => (p).should.equal(mockOrgJsonUri) ],
                    [ 'newOrgJsonUri', p => (p).should.equal(newOrgJsonUri) ]
                ]);
            });
        });

        describe('#changeOrgJsonHash(bytes32,bytes32)', () => {
            let testOrgIdHash;
            const testOrgIdOwner = accounts[5];
            let newOrgJsonHash = generateHashHelper();

            beforeEach(async () => {
                const call = await createOrganizationHelper(
                    orgIdContract,
                    testOrgIdOwner,
                    [mockOrgJsonUri, mockOrgJsonHash]
                );
                testOrgIdHash = call.events['OrganizationCreated'].returnValues.orgId;
            });

            it('should fail if organization not found', async () => {
                const randomOrgIdHash = generateHashHelper();
                await assertRevert(
                    orgIdContract
                        .methods['changeOrgJsonHash(bytes32,bytes32)'](randomOrgIdHash, newOrgJsonHash)
                        .send({ from: testOrgIdOwner }),
                    'ORG.ID: Organization not found'
                );
            });

            it('should fail if called by non-owner', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['changeOrgJsonHash(bytes32,bytes32)'](testOrgIdHash, newOrgJsonHash)
                        .send({ from: randomAddress }),
                    'ORG.ID: action not authorized (must be owner or director)'
                );
            });

            it('should fail if hash is all zeroes', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['changeOrgJsonHash(bytes32,bytes32)'](testOrgIdHash, zeroHash)
                        .send({ from: testOrgIdOwner }),
                    'ORG.ID: ORG.JSON hash cannot be zero'
                );
            });

            it('should fail if hash is an empty string', async () => {
                assert.throws(() => {
                    orgIdContract
                        .methods['changeOrgJsonHash(bytes32,bytes32)'](testOrgIdHash, '')
                        .send({ from: testOrgIdOwner });
                }, /invalid bytes32 value/);
            });

            it('should change ORG.JSON hash', async () => {
                const result = await orgIdContract
                    .methods['changeOrgJsonHash(bytes32,bytes32)'](testOrgIdHash, newOrgJsonHash)
                    .send({ from: testOrgIdOwner });

                assertEvent(result, 'OrgJsonHashChanged', [
                    [ 'orgId', p => (p).should.equal(testOrgIdHash) ],
                    [ 'previousOrgJsonHash', p => (p).should.equal(mockOrgJsonHash) ],
                    [ 'newOrgJsonHash', p => (p).should.equal(newOrgJsonHash) ]
                ]);
            });

            it('should change unit ORG.JSON hash requested by director', async () => {
                const parentOrgIdOwner = testOrgIdOwner;
                const parentOrgIdHash = testOrgIdHash;
                const unitDirector = randomAddressTwo;
                const call = await createUnitHelper(
                    orgIdContract,
                    parentOrgIdOwner,
                    [parentOrgIdHash, unitDirector, mockOrgJsonUri, mockOrgJsonHash]
                );
                const testUnitOrgIdHash = call.events['UnitCreated'].returnValues.unitOrgId;

                const result = await orgIdContract
                    .methods['changeOrgJsonHash(bytes32,bytes32)'](testUnitOrgIdHash, newOrgJsonHash)
                    .send({ from: unitDirector });

                assertEvent(result, 'OrgJsonHashChanged', [
                    [ 'orgId', p => (p).should.equal(testUnitOrgIdHash) ],
                    [ 'previousOrgJsonHash', p => (p).should.equal(mockOrgJsonHash) ],
                    [ 'newOrgJsonHash', p => (p).should.equal(newOrgJsonHash) ]
                ]);
            });
        });

        describe('#changeOrgJsonUriAndHash(bytes32,string,bytes32)', () => {
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
                testOrgIdHash = call.events['OrganizationCreated'].returnValues.orgId;
            });

            it('should fail if organization not found', async () => {
                const randomOrgIdHash = generateHashHelper();
                await assertRevert(
                    orgIdContract
                        .methods['changeOrgJsonUriAndHash(bytes32,string,bytes32)'](randomOrgIdHash, newOrgJsonUri, newOrgJsonHash)
                        .send({ from: testOrgIdOwner }),
                    'ORG.ID: Organization not found'
                );
            });

            it('should fail if called by non-owner', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['changeOrgJsonUriAndHash(bytes32,string,bytes32)'](testOrgIdHash, newOrgJsonUri, newOrgJsonHash)
                        .send({ from: randomAddress }),
                    'ORG.ID: action not authorized (must be owner or director)'
                );
            });

            it('should fail if URI is an empty string', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['changeOrgJsonUriAndHash(bytes32,string,bytes32)'](testOrgIdHash, '', newOrgJsonHash)
                        .send({ from: testOrgIdOwner }),
                    'ORG.ID: ORG.JSON URI cannot be empty'
                );
            });

            it('should fail if hash is all zeroes', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['changeOrgJsonUriAndHash(bytes32,string,bytes32)'](testOrgIdHash, newOrgJsonUri, zeroHash)
                        .send({ from: testOrgIdOwner }),
                    'ORG.ID: ORG.JSON hash cannot be zero'
                );
            });

            it('should fail if hash is an empty string', async () => {
                assert.throws(() => {
                    orgIdContract
                        .methods['changeOrgJsonUriAndHash(bytes32,string,bytes32)'](testOrgIdHash, newOrgJsonUri, '')
                        .send({ from: testOrgIdOwner });
                }, /invalid bytes32 value/);
            });

            it('should change ORG.JSON URI and hash', async () => {
                const result = await orgIdContract
                    .methods['changeOrgJsonUriAndHash(bytes32,string,bytes32)'](testOrgIdHash, newOrgJsonUri, newOrgJsonHash)
                    .send({ from: testOrgIdOwner });

                assertEvent(result, 'OrgJsonHashChanged', [
                    [ 'orgId', p => (p).should.equal(testOrgIdHash) ],
                    [ 'previousOrgJsonHash', p => (p).should.equal(mockOrgJsonHash) ],
                    [ 'newOrgJsonHash', p => (p).should.equal(newOrgJsonHash) ]
                ]);
                assertEvent(result, 'OrgJsonUriChanged', [
                    [ 'orgId', p => (p).should.equal(testOrgIdHash) ],
                    [ 'previousOrgJsonUri', p => (p).should.equal(mockOrgJsonUri) ],
                    [ 'newOrgJsonUri', p => (p).should.equal(newOrgJsonUri) ]
                ]);
            });

            it('should change unit ORG.JSON URI requested by director', async () => {
                const parentOrgIdOwner = testOrgIdOwner;
                const parentOrgIdHash = testOrgIdHash;
                const unitDirector = randomAddressTwo;
                const call = await createUnitHelper(
                    orgIdContract,
                    parentOrgIdOwner,
                    [parentOrgIdHash, unitDirector, mockOrgJsonUri, mockOrgJsonHash]
                );
                const testUnitOrgIdHash = call.events['UnitCreated'].returnValues.unitOrgId;

                const result = await orgIdContract
                    .methods['changeOrgJsonUriAndHash(bytes32,string,bytes32)'](testUnitOrgIdHash, newOrgJsonUri, newOrgJsonHash)
                    .send({ from: unitDirector });

                assertEvent(result, 'OrgJsonHashChanged', [
                    [ 'orgId', p => (p).should.equal(testUnitOrgIdHash) ],
                    [ 'previousOrgJsonHash', p => (p).should.equal(mockOrgJsonHash) ],
                    [ 'newOrgJsonHash', p => (p).should.equal(newOrgJsonHash) ]
                ]);
                assertEvent(result, 'OrgJsonUriChanged', [
                    [ 'orgId', p => (p).should.equal(testUnitOrgIdHash) ],
                    [ 'previousOrgJsonUri', p => (p).should.equal(mockOrgJsonUri) ],
                    [ 'newOrgJsonUri', p => (p).should.equal(newOrgJsonUri) ]
                ]);
            });
        });

        describe('#getOrganizations()', () => {
            it('should return empty array if registry is empty', async () => {
                const orgs = await orgIdContract
                    .methods['getOrganizations()']()
                    .call();
                (orgs).should.to.be.an('array');
                (orgs.length).should.equal(0);
            });

            it('should return empty array if registry contains only inactive organizations', async () => {
                const call1 = await createOrganizationHelper(
                    orgIdContract,
                    randomAddress,
                    [mockOrgJsonUri, mockOrgJsonHash]
                );
                const orgId1 = call1.events['OrganizationCreated'].returnValues.orgId;
                const call2 = await createOrganizationHelper(
                    orgIdContract,
                    randomAddressTwo,
                    [mockOrgJsonUri, mockOrgJsonHash]
                );
                const orgId2 = call2.events['OrganizationCreated'].returnValues.orgId;

                await orgIdContract.methods['toggleActiveState(bytes32)'](orgId1)
                    .send({ from: randomAddress });
                await orgIdContract.methods['toggleActiveState(bytes32)'](orgId2)
                    .send({ from: randomAddressTwo });
                const orgs = await orgIdContract
                    .methods['getOrganizations()']()
                    .call();

                (orgs).should.to.be.an('array');
                (orgs.length).should.equal(0);
            });

            it('should return an array of organizations', async () => {
                const call1 = await createOrganizationHelper(
                    orgIdContract,
                    randomAddress,
                    [mockOrgJsonUri, mockOrgJsonHash]
                );
                const orgId1 = call1.events['OrganizationCreated'].returnValues.orgId;
                const call2 = await createOrganizationHelper(
                    orgIdContract,
                    randomAddressTwo,
                    [mockOrgJsonUri, mockOrgJsonHash]
                );
                const orgId2 = call2.events['OrganizationCreated'].returnValues.orgId;

                const orgs = await orgIdContract
                    .methods['getOrganizations()']()
                    .call();
                (orgs).should.to.be.an('array').that.include.members([orgId1, orgId2]);
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
                testOrgIdHash = call.events['OrganizationCreated'].returnValues.orgId;
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
            parentOrgIdHash = call.events['OrganizationCreated'].returnValues.orgId;
        });

        describe('#createUnit(bytes32,address,string,bytes32)', () => {
            it('should fail if called by non-owner', async () => {
                await assertRevert(
                    createUnitHelper(
                        orgIdContract,
                        nonOwnerOrDirector,
                        [parentOrgIdHash, unitDirector, mockOrgJsonUri, mockOrgJsonHash]
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
                        [nonExistingOrgIdHash, unitDirector, mockOrgJsonUri, mockOrgJsonHash]
                    ),
                    'ORG.ID: Organization not found'
                );
            });

            // TODO: This should NOT fail. Director address could be assigned later
            it('should fail if director address is zero', async () => {
                const invalidDirectorAddress = zeroAddress;
                await assertRevert(
                    createUnitHelper(
                        orgIdContract,
                        testOrgIdOwner,
                        [parentOrgIdHash, invalidDirectorAddress, mockOrgJsonUri, mockOrgJsonHash]
                    ),
                    'ORG.ID: Invalid director address'
                );
            });

            it('should create a unit', async () => {
                const call = await createUnitHelper(
                    orgIdContract,
                    testOrgIdOwner,
                    [parentOrgIdHash, unitDirector, mockOrgJsonUri, mockOrgJsonHash]
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
                    [parentOrgIdHash, testOrgIdOwner, mockOrgJsonUri, mockOrgJsonHash]
                );
                const newUnitOrgIdHash = call.events['UnitCreated'].returnValues.unitOrgId;

                assertEvent(call, 'DirectorshipAccepted', [
                    [ 'orgId', p => (p).should.equal(newUnitOrgIdHash) ],
                    [ 'director', p => (p).should.equal(testOrgIdOwner) ]
                ]);
            });
        });

        // TODO: if unconfirmed director calls any director-specific methods,
        // directorship is automatically accepted
        // OR: unconfirmed director should not be able to call director-specific methods

        describe('#acceptDirectorship(bytes32)', () => {
            let testUnitOrgIdHash;

            beforeEach(async () => {
                const call = await createUnitHelper(
                    orgIdContract,
                    testOrgIdOwner,
                    [parentOrgIdHash, unitDirector, mockOrgJsonUri, mockOrgJsonHash]
                );
                testUnitOrgIdHash = call.events['UnitCreated'].returnValues.unitOrgId;
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
                    [parentOrgIdHash, unitDirector, mockOrgJsonUri, mockOrgJsonHash]
                );
                testUnitOrgIdHash = call.events['UnitCreated'].returnValues.unitOrgId;

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
                        .send({ from: unitDirector }),
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

        describe('#getUnits(bytes32)', () => {
            let parentOrgIdHash;
            const parentOrgIdOwner = accounts[5];
            const testOrgIdOwner = accounts[5];
            const unitDirector = accounts[6];

            beforeEach(async () => {
                const call = await createOrganizationHelper(
                    orgIdContract,
                    testOrgIdOwner,
                    [mockOrgJsonUri, mockOrgJsonHash]
                );
                parentOrgIdHash = call.events['OrganizationCreated'].returnValues.orgId;
            });

            it('should fail if organization not found', async () => {
                const nonExistingOrgIdHash = generateHashHelper();
                await assertRevert(
                    orgIdContract
                        .methods['getUnits(bytes32)'](nonExistingOrgIdHash)
                        .call(),
                    'ORG.ID: Organization not found'
                );
            });

            it('should return empty array if organization has no units', async () => {
                const subs = await orgIdContract
                    .methods['getUnits(bytes32)'](parentOrgIdHash)
                    .call();
                (subs).should.to.be.an('array');
                (subs.length).should.equal(0);
            });

            // TODO: I should be able to see organizations and units that are inactive or don't have directors
            // TODO: this is a wrong assumption. Organization unit may function without director just fine.
            it('should return an empty array if organization unit directorship is not accepted', async () => {
                await createUnitHelper(
                    orgIdContract,
                    parentOrgIdOwner,
                    [parentOrgIdHash, unitDirector, mockOrgJsonUri, mockOrgJsonHash]
                );
                const subs = await orgIdContract
                    .methods['getUnits(bytes32)'](parentOrgIdHash)
                    .call();
                (subs).should.to.be.an('array');
                (subs.length).should.equal(0);
            });

            it('should return array of units', async () => {
                const call = await createUnitHelper(
                    orgIdContract,
                    parentOrgIdOwner,
                    [parentOrgIdHash, unitDirector, mockOrgJsonUri, mockOrgJsonHash]
                );
                const testUnitOrgIdHash = call.events['UnitCreated'].returnValues.unitOrgId;
                await orgIdContract
                    .methods['acceptDirectorship(bytes32)'](testUnitOrgIdHash)
                    .send({ from: unitDirector });
                const subs = await orgIdContract
                    .methods['getUnits(bytes32)'](parentOrgIdHash)
                    .call();
                (subs).should.to.be.an('array');
                (subs).should.to.be.an('array').that.include(testUnitOrgIdHash);
            });
        });
    });
});

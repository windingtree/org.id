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

contract('ORG.ID', function (accounts) {
    const orgIdContractOwner = accounts[0];
    const randomAddress = accounts[18]; // isn't it funny?
    const randomAddressTwo = accounts[19];

    async function setUpProject() {
        const project = await TestHelper({
            from: orgIdContractOwner
        });
        return project;
    }

    async function deployNewOrgIdContract(project) {
        const instance = await project.createProxy(OrgIdContract, {
            initMethod: 'initialize',
            initArgs: [ orgIdContractOwner ]
        });
        return instance;
    }

    let project, orgIdContractInstance;
    before(async function () {
        project = await setUpProject();
        orgIdContractInstance = await deployNewOrgIdContract(project);
    });

    describe('ORG.ID upgradeability', function () {
        it('should upgrade proxy and reveal a new function and interface', async function () {
            let newProxy = await project.upgradeProxy(
                orgIdContractInstance.address,
                OrgIdUpgradeabilityContract,
                {
                    initMethod: 'initialize',
                    initArgs: []
                }
            );
            let upgradeabilityInstance = await OrgIdUpgradeabilityContract.at(newProxy.address);

            await upgradeabilityInstance
                .methods['setupNewStorage(uint256)']('100')
                .send({ from: orgIdContractOwner });
            (await upgradeabilityInstance.methods['newFunction()']()
                .call()).should.equal('100');
            (await upgradeabilityInstance
                .methods['supportsInterface(bytes4)']('0x1b28d63e')
                .call()
            ).should.be.true;
        });
    });

    describe('ORG.ID ownable interface', function () {
        const newOrgIdContractOwner = accounts[7];

        describe('#transferOwnership(address)', function () {
            it('should fail if called by non-owner', async function () {
                await assertRevert(
                    orgIdContractInstance
                        .methods['transferOwnership(address)'](randomAddress)
                        .send({ from: randomAddress }),
                    // This error message defined in @openzeppelin Ownable.sol
                    'Ownable: caller is not the owner'
                );
            });

            it('should fail if new owner has zero address', async function () {
                await assertRevert(
                    orgIdContractInstance
                        .methods['transferOwnership(address)'](zeroAddress)
                        .send({ from: orgIdContractOwner }),
                    // This error message defined in @openzeppelin Ownable.sol
                    'Ownable: new owner is the zero address'
                );
            });

            it('should transfer contract ownership', async function () {
                const result = await orgIdContractInstance
                    .methods['transferOwnership(address)'](newOrgIdContractOwner)
                    .send({ from: orgIdContractOwner });

                assertEvent(result, 'OwnershipTransferred', [
                    [ 'previousOwner', p => (p).should.equal(orgIdContractOwner) ],
                    [ 'newOwner', p => (p).should.equal(newOrgIdContractOwner) ],
                ]);
            });
        });

        describe('#owner()', async function () {
            it('should return contract owner (changed in previous test)', async function () {
                (await orgIdContractInstance.methods['owner()']().call())
                    .should.equal(newOrgIdContractOwner);
            });
        });
    });

    describe('ERC165 interfaces', function () {
        it('should support IERC165 interface', async function () {
            (await orgIdContractInstance
                .methods['supportsInterface(bytes4)']('0x01ffc9a7')
                .call()
            ).should.be.true;
        });

        it('should support ownable interface', async function () {
            (await orgIdContractInstance
                .methods['supportsInterface(bytes4)']('0x7f5828d0')
                .call()
            ).should.be.true;
        });

        it('should support hierarchy interface', async function () {
            (await orgIdContractInstance
                .methods['supportsInterface(bytes4)']('0xfd95e493')
                .call()
            ).should.be.true;
        });

        it('should support ORG.ID interface', async function () {
            (await orgIdContractInstance
                .methods['supportsInterface(bytes4)']('0x81ba1516')
                .call()
            ).should.be.true;
        });
    });

    describe('ORG.ID methods', function () {
        const testOrgIdOwner = accounts[1];
        const randomOrgIdHash = generateHashHelper();

        let orgCreationResult, testOrgIdHash;
        async function newOrg() {
            orgCreationResult = await createOrganizationHelper(
                orgIdContractInstance,
                testOrgIdOwner,
                [mockOrgJsonUri, mockOrgJsonHash]
            );
            testOrgIdHash = orgCreationResult.events.OrganizationCreated.returnValues.orgId;
        }

        before(async function () {
            await newOrg();
        });

        describe('#createOrganization(bytes32,string,bytes32)', function () {
            it('TODO: test for #createOrganization fails and errors');

            it('should create an organization with correct properties', async function () {
                assertEvent(orgCreationResult, 'OrganizationCreated', [
                    [ 'orgId', p => (p).should.equal(testOrgIdHash) ],
                    [ 'owner', p => (p).should.equal(testOrgIdOwner) ]
                ]);

                const testOrgId = await orgIdContractInstance
                    .methods['getOrganization(bytes32)'](testOrgIdHash)
                    .call();

                (testOrgId).should.have.property('exists').to.be.true;
                (testOrgId).should.have.property('orgId').to.equal(testOrgIdHash);
                (testOrgId).should.have.property('orgJsonUri').to.equal(mockOrgJsonUri);
                (testOrgId).should.have.property('orgJsonHash').to.equal(mockOrgJsonHash);
                (testOrgId).should.have.property('parentOrgId').to.equal(zeroHash);
                (testOrgId).should.have.property('owner').to.equal(testOrgIdOwner);
                (testOrgId).should.have.property('director').to.equal(zeroAddress);
                (testOrgId).should.have.property('isActive').to.be.true;
                (testOrgId).should.have.property('isDirectorshipAccepted').to.be.false;
            });
        });

        describe('#toggleActiveState(bytes32)', function () {
            it('should fail if organization not found', async function () {
                await assertRevert(
                    orgIdContractInstance
                        .methods['toggleActiveState(bytes32)'](randomOrgIdHash)
                        .send({ from: testOrgIdOwner }),
                    'ORG.ID: Organization not found'
                );
            });

            it('should fail if called by non-owner', async function () {
                await assertRevert(
                    orgIdContractInstance
                        .methods['toggleActiveState(bytes32)'](testOrgIdHash)
                        .send({ from: randomAddress }),
                    'ORG.ID: action not authorized (must be owner)'
                );
            });

            it('should toggle organization isActive state', async function () {
                let testOrgId;

                // Deactivate
                const result1 = await orgIdContractInstance
                    .methods['toggleActiveState(bytes32)'](testOrgIdHash)
                    .send({ from: testOrgIdOwner });
                testOrgId = await orgIdContractInstance
                    .methods['getOrganization(bytes32)'](testOrgIdHash)
                    .call();

                assertEvent(result1, 'OrganizationActiveStateChanged', [
                    [ 'orgId', p => (p).should.equal(testOrgIdHash) ],
                    [ 'previousState', p => (p).should.be.true ],
                    [ 'newState', p => (p).should.be.false ]
                ]);
                (testOrgId.isActive).should.be.false;

                // Activate again
                const result2 = await orgIdContractInstance
                    .methods['toggleActiveState(bytes32)'](testOrgIdHash)
                    .send({ from: testOrgIdOwner });
                testOrgId = await orgIdContractInstance
                    .methods['getOrganization(bytes32)'](testOrgIdHash)
                    .call();

                assertEvent(result2, 'OrganizationActiveStateChanged', [
                    [ 'orgId', p => (p).should.equal(testOrgIdHash) ],
                    [ 'previousState', p => (p).should.be.false ],
                    [ 'newState', p => (p).should.be.true ]
                ]);
                (testOrgId.isActive).should.be.true;
            });
        });

        describe('#transferOrganizationOwnership(bytes32,address)', function () {
            it('should fail if organization not found', async function () {
                await assertRevert(
                    orgIdContractInstance
                        .methods['transferOrganizationOwnership(bytes32,address)'](
                            randomOrgIdHash,
                            randomAddress
                        )
                        .send({ from: testOrgIdOwner }),
                    'ORG.ID: Organization not found'
                );
            });

            it('should fail if called by non-owner', async function () {
                await assertRevert(
                    orgIdContractInstance
                        .methods['transferOrganizationOwnership(bytes32,address)'](
                            testOrgIdHash,
                            randomAddress
                        )
                        .send({ from: randomAddress }),
                    'ORG.ID: action not authorized (must be owner)'
                );
            });

            it('should fail if new owner has zero address', async function () {
                await assertRevert(
                    orgIdContractInstance
                        .methods['transferOrganizationOwnership(bytes32,address)'](
                            testOrgIdHash,
                            zeroAddress
                        )
                        .send({ from: testOrgIdOwner }),
                    'ORG.ID: Invalid owner address'
                );
            });

            it('should transfer organization ownership', async function () {
                const newOrgIdOwner = accounts[2];
                const result = await orgIdContractInstance
                    .methods['transferOrganizationOwnership(bytes32,address)'](
                        testOrgIdHash,
                        newOrgIdOwner
                    )
                    .send({ from: testOrgIdOwner });

                assertEvent(result, 'OrganizationOwnershipTransferred', [
                    [ 'orgId', p => (p).should.equal(testOrgIdHash) ],
                    [ 'previousOwner', p => (p).should.equal(testOrgIdOwner) ],
                    [ 'newOwner', p => (p).should.equal(newOrgIdOwner) ]
                ]);
            });

            after(async function () {
                await newOrg();
            });
        });

        describe('#setOrgJson(bytes32,string,bytes32)', function () {
            let newOrgJsonUri = mockOrgJsonUri + '/some/random/path/org.json';
            let newOrgJsonHash = generateHashHelper();

            it('should fail if organization not found', async function () {
                await assertRevert(
                    orgIdContractInstance
                        .methods['setOrgJson(bytes32,string,bytes32)'](
                            randomOrgIdHash,
                            newOrgJsonUri,
                            newOrgJsonHash
                        )
                        .send({ from: testOrgIdOwner }),
                    'ORG.ID: Organization not found'
                );
            });

            it('should fail if called by non-owner', async function () {
                await assertRevert(
                    orgIdContractInstance
                        .methods['setOrgJson(bytes32,string,bytes32)'](
                            testOrgIdHash,
                            newOrgJsonUri,
                            newOrgJsonHash
                        )
                        .send({ from: randomAddress }),
                    'ORG.ID: action not authorized (must be owner or director)'
                );
            });

            it('should fail if URI is an empty string', async function () {
                await assertRevert(
                    orgIdContractInstance
                        .methods['setOrgJson(bytes32,string,bytes32)'](
                            testOrgIdHash,
                            '',
                            newOrgJsonHash
                        )
                        .send({ from: testOrgIdOwner }),
                    'ORG.ID: ORG.JSON URI cannot be empty'
                );
            });

            it('should fail if hash is all zeroes', async function () {
                await assertRevert(
                    orgIdContractInstance
                        .methods['setOrgJson(bytes32,string,bytes32)'](
                            testOrgIdHash,
                            newOrgJsonUri,
                            zeroHash
                        )
                        .send({ from: testOrgIdOwner }),
                    'ORG.ID: ORG.JSON hash cannot be zero'
                );
            });

            it('should fail if hash is an empty string', async function () {
                assert.throws(function () {
                    orgIdContractInstance
                        .methods['setOrgJson(bytes32,string,bytes32)'](
                            testOrgIdHash,
                            newOrgJsonUri,
                            ''
                        )
                        .send({ from: testOrgIdOwner });
                }, /invalid bytes32 value/);
            });

            it('should change ORG.JSON URI and hash', async function () {
                const result = await orgIdContractInstance
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
        });

        describe('#getOrganizations(bool)', function () {
            let newOrgIdContractInstance;
            before(async function () {
                newOrgIdContractInstance = await deployNewOrgIdContract(project);
            });

            it('should return empty array if registry is empty', async function () {
                const orgs = await newOrgIdContractInstance
                    .methods['getOrganizations(bool)'](false)
                    .call();

                (orgs).should.to.be.an('array');
                (orgs.length).should.equal(0);
            });

            describe('getting organizations from registry', function () {
                let allOrgs = [],
                    activeOrgs = [];

                before(async function () {
                    for (let i = 0; i < 10; i++) {
                        const call = await createOrganizationHelper(
                            newOrgIdContractInstance,
                            randomAddress,
                            [
                                mockOrgJsonUri,
                                mockOrgJsonHash
                            ]
                        );
                        const hash = call.events.OrganizationCreated.returnValues.orgId;

                        allOrgs.push(hash);
                        if (i % 2 === 0) {
                            // Organizations are active by default
                            activeOrgs.push(hash);
                        } else {
                            // Deactivate "odd" organizations
                            await newOrgIdContractInstance
                                .methods['toggleActiveState(bytes32)'](hash)
                                .send({ from: randomAddress });
                        }
                    }
                });

                it('should return correct number of ALL organizations', async function () {
                    const orgs = await newOrgIdContractInstance
                         // "true" means include ALL organizations, even inactive ones
                        .methods['getOrganizations(bool)'](true)
                        .call();

                    (orgs).should.to.be.an('array').that.include.members(allOrgs);
                    (orgs.length).should.equal(allOrgs.length);
                });

                it('should return correct number of ACTIVE organizations', async function () {
                    const orgs = await newOrgIdContractInstance
                        .methods['getOrganizations(bool)'](false)
                        .call();

                    (orgs).should.to.be.an('array').that.include.members(activeOrgs);
                    (orgs.length).should.equal(activeOrgs.length);
                });
            });
        });

        describe('#getOrganization(bytes32)', function () {
            it('should return exists=false if organization not found', async function () {
                const orgId = await orgIdContractInstance
                    .methods['getOrganization(bytes32)'](randomOrgIdHash)
                    .call();

                (orgId).should.has.property('exists').to.be.false;
            });

            it('should return an organization', function () {
                // This is tested extensively in previous tests
                assert(true);
            });
        });

        describe('Organizational Units (or simply "units")', function () {
            const parentOrgIdHash = testOrgIdHash;
            const unitDirector = accounts[5];

            describe('#createUnit(bytes32,address,string,bytes32)', function () {
                it('should fail if called by non-owner', async function () {
                    await assertRevert(
                        createUnitHelper(
                            orgIdContractInstance,
                            randomAddress, // caller is non-owner
                            [
                                testOrgIdHash,
                                unitDirector,
                                mockOrgJsonUri,
                                mockOrgJsonHash
                            ]
                        ),
                        'ORG.ID: action not authorized (must be owner)'
                    );
                });

                it('should fail if parent organization not found', async function () {
                    const nonExistingOrgIdHash = generateHashHelper();
                    await assertRevert(
                        createUnitHelper(
                            orgIdContractInstance,
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

                it('should automatically set isDirectorshipAccepted to `true` if director is unit owner', async function () {
                    const call = await createUnitHelper(
                        orgIdContractInstance,
                        testOrgIdOwner,
                        [
                            testOrgIdHash,
                            testOrgIdOwner, // director = owner
                            mockOrgJsonUri,
                            mockOrgJsonHash
                        ]
                    );
                    const testUnitHash = call.events.UnitCreated.returnValues.unitOrgId;

                    assertEvent(call, 'DirectorshipAccepted', [
                        [ 'orgId', p => (p).should.equal(testUnitHash) ],
                        [ 'director', p => (p).should.equal(testOrgIdOwner) ]
                    ]);

                    const unit = await orgIdContractInstance
                        .methods['getOrganization(bytes32)'](testUnitHash)
                        .call();

                    (unit.isDirectorshipAccepted).should.be.true;
                });

                // TODO: confirming zero address doesn't make sense
                it('should automatically set isDirectorshipAccepted to `true` if director is zero', async function () {
                    const call = await createUnitHelper(
                        orgIdContractInstance,
                        testOrgIdOwner,
                        [
                            testOrgIdHash,
                            zeroAddress, // director = zero
                            mockOrgJsonUri,
                            mockOrgJsonHash
                        ]
                    );
                    const testUnitHash = call.events.UnitCreated.returnValues.unitOrgId;

                    assertEvent(call, 'DirectorshipAccepted', [
                        [ 'orgId', p => (p).should.equal(testUnitHash) ],
                        [ 'director', p => (p).should.equal(zeroAddress) ]
                    ]);

                    const unit = await orgIdContractInstance
                        .methods['getOrganization(bytes32)'](testUnitHash)
                        .call();

                    (unit.isDirectorshipAccepted).should.be.true;
                });

                describe('unit created successfully...', function () {
                    let unitCreationResult, testUnitHash;
                    async function newUnit() {
                        unitCreationResult = await createUnitHelper(
                            orgIdContractInstance,
                            testOrgIdOwner,
                            [
                                testOrgIdHash,
                                unitDirector,
                                mockOrgJsonUri,
                                mockOrgJsonHash
                            ]
                        );
                        testUnitHash = unitCreationResult.events.UnitCreated.returnValues.unitOrgId;
                    }

                    before(async function () {
                        await newUnit();
                    });

                    it('should create a unit with correct properties', async function () {
                        assertEvent(unitCreationResult, 'UnitCreated', [
                            [ 'parentOrgId', p => (p).should.equal(testOrgIdHash) ],
                            [ 'unitOrgId', p => (p).should.equal(testUnitHash) ],
                            [ 'director', p => (p).should.equal(unitDirector) ]
                        ]);

                        const unit = await orgIdContractInstance
                            .methods['getOrganization(bytes32)'](testUnitHash)
                            .call();

                        (unit).should.have.property('exists').to.be.true;
                        (unit).should.have.property('orgId').to.equal(testUnitHash);
                        (unit).should.have.property('orgJsonUri').to.equal(mockOrgJsonUri);
                        (unit).should.have.property('orgJsonHash').to.equal(mockOrgJsonHash);
                        (unit).should.have.property('parentOrgId').to.equal(testOrgIdHash);
                        (unit).should.have.property('owner').to.equal(testOrgIdOwner);
                        (unit).should.have.property('director').to.equal(unitDirector);
                        (unit).should.have.property('isActive').to.be.true;
                        (unit).should.have.property('isDirectorshipAccepted').to.be.false;
                    });

                    describe('#acceptDirectorship(bytes32)', function () {
                        it('should fail if organization not found', async function () {
                            await assertRevert(
                                orgIdContractInstance
                                    .methods['acceptDirectorship(bytes32)'](randomOrgIdHash)
                                    .send({ from: unitDirector }),
                                'ORG.ID: Organization not found'
                            );
                        });

                        it('should fail if not called by director', async function () {
                            await assertRevert(
                                orgIdContractInstance
                                    .methods['acceptDirectorship(bytes32)'](testUnitHash)
                                    .send({ from: randomAddress }),
                                'ORG.ID: action not authorized (must be director)'
                            );
                        });

                        it('should accept directorship', async function () {
                            const result = await orgIdContractInstance
                                .methods['acceptDirectorship(bytes32)'](testUnitHash)
                                .send({ from: unitDirector });

                            assertEvent(result, 'DirectorshipAccepted', [
                                [ 'orgId', p => (p).should.equal(testUnitHash) ],
                                [ 'director', p => (p).should.equal(unitDirector) ]
                            ]);

                            const unit = await orgIdContractInstance
                                .methods['getOrganization(bytes32)'](testUnitHash)
                                .call();

                            (unit).should.have.property('isDirectorshipAccepted').to.be.true;
                        });
                    });

                    describe('#transferDirectorship(bytes32,address)', function () {
                        const newDirector = accounts[9];

                        it('should fail if organization not found', async function () {
                            await assertRevert(
                                orgIdContractInstance
                                    .methods['transferDirectorship(bytes32,address)'](
                                        randomOrgIdHash,
                                        newDirector
                                    )
                                    .send({ from: testOrgIdOwner }),
                                'ORG.ID: Organization not found'
                            );
                        });

                        it('should fail if called by non-owner (e.g. director)', async function () {
                            await assertRevert(
                                orgIdContractInstance
                                    .methods['transferDirectorship(bytes32,address)'](
                                        testUnitHash,
                                        newDirector
                                    )
                                    .send({ from: randomAddress }),
                                'ORG.ID: action not authorized (must be owner)'
                            );
                        });

                        it('should transfer directorship', async function () {
                            const result = await orgIdContractInstance
                                .methods['transferDirectorship(bytes32,address)'](
                                    testUnitHash,
                                    newDirector
                                )
                                .send({ from: testOrgIdOwner });

                            assertEvent(result, 'DirectorshipTransferred', [
                                [ 'orgId', p => (p).should.equal(testUnitHash) ],
                                [ 'previousDirector', p => (p).should.equal(unitDirector) ],
                                [ 'newDirector', p => (p).should.equal(newDirector) ]
                            ]);

                            let org = await orgIdContractInstance
                                .methods['getOrganization(bytes32)'](testUnitHash)
                                .call();

                            (org.isDirectorshipAccepted).should.be.false;
                        });

                        it('should automatically accept directorship if transferred to owner', async function () {
                            const result = await orgIdContractInstance
                                .methods['transferDirectorship(bytes32,address)'](
                                    testUnitHash,
                                    testOrgIdOwner
                                )
                                .send({ from: testOrgIdOwner });

                            assertEvent(result, 'DirectorshipAccepted', [
                                [ 'orgId', p => (p).should.equal(testUnitHash) ],
                                [ 'director', p => (p).should.equal(testOrgIdOwner) ]
                            ]);

                            const unit = await orgIdContractInstance
                                .methods['getOrganization(bytes32)'](testUnitHash)
                                .call();

                            (unit.isDirectorshipAccepted).should.be.true;
                        });
                    });

                    describe('#renounceDirectorship(bytes32)', function () {
                        it('should fail if organization not found', async function () {
                            await assertRevert(
                                orgIdContractInstance
                                    .methods['renounceDirectorship(bytes32)'](
                                        randomOrgIdHash
                                    )
                                    .send({ from: testOrgIdOwner }),
                                'ORG.ID: Organization not found'
                            );
                        });

                        it('should fail if called by non-owner or non-director)', async function () {
                            await assertRevert(
                                orgIdContractInstance
                                    .methods['renounceDirectorship(bytes32)'](
                                        testUnitHash
                                    )
                                    .send({ from: randomAddress }),
                                'ORG.ID: action not authorized (must be owner or director)'
                            );
                        });

                        it('TODO: Maybe owner being a director makes no sense at all!');

                        it('should set director address to zero if unit OWNER renounces their directorship', async function () {
                            const result = await orgIdContractInstance
                                .methods['renounceDirectorship(bytes32)'](
                                    testUnitHash
                                )
                                .send({ from: testOrgIdOwner });

                            assertEvent(result, 'DirectorshipTransferred', [
                                [ 'orgId', p => (p).should.equal(testUnitHash) ],
                                [ 'previousDirector', p => (p).should.equal(testOrgIdOwner) ],
                                [ 'newDirector', p => (p).should.equal(zeroAddress) ]
                            ]);
                        });

                        it('should set director address to zero if unit DIRECTOR renounces their directorship', async function () {
                            await orgIdContractInstance
                                .methods['transferDirectorship(bytes32,address)'](
                                    testUnitHash,
                                    unitDirector
                                )
                                .send({ from: testOrgIdOwner });

                            await orgIdContractInstance
                                .methods['acceptDirectorship(bytes32)'](testUnitHash)
                                .send({ from: unitDirector });

                            const result = await orgIdContractInstance
                                .methods['renounceDirectorship(bytes32)'](
                                    testUnitHash
                                )
                                .send({ from: unitDirector });

                            assertEvent(result, 'DirectorshipTransferred', [
                                [ 'orgId', p => (p).should.equal(testUnitHash) ],
                                [ 'previousDirector', p => (p).should.equal(unitDirector) ],
                                [ 'newDirector', p => (p).should.equal(zeroAddress) ]
                            ]);
                        });
                    });

                    describe('Changing ORG.JSON URI and hash by unit director', function () {
                        before(async function () {
                            await orgIdContractInstance
                                .methods['transferDirectorship(bytes32,address)'](
                                    testUnitHash,
                                    unitDirector
                                )
                                .send({ from: testOrgIdOwner });
                        });

                        it('should fail if unit not found');

                        it('should fail if called by non-owner or non-director', async function () {
                            await assertRevert(
                                orgIdContractInstance
                                    .methods['setOrgJson(bytes32,string,bytes32)'](
                                        testUnitHash,
                                        mockOrgJsonUri,
                                        mockOrgJsonHash
                                    )
                                    .send({ from: randomAddress }),
                                'ORG.ID: action not authorized (must be owner or director)'
                            );
                        });

                        it('should change ORG.JSON URI and hash if called by nominated director; it means automatic acceptance of their role', async function () {
                            let unit = await orgIdContractInstance
                                .methods['getOrganization(bytes32)'](testUnitHash)
                                .call();
                            (unit.director).should.equal(unitDirector);
                            (unit.isDirectorshipAccepted).should.be.false;

                            const randomOrgJsonHash = generateHashHelper();
                            const result = await orgIdContractInstance
                                .methods['setOrgJson(bytes32,string,bytes32)'](
                                    testUnitHash,
                                    mockOrgJsonUri + 'new',
                                    randomOrgJsonHash
                                )
                                .send({ from: unitDirector });

                            assertEvent(result, 'OrgJsonChanged', [
                                [ 'orgId', p => (p).should.equal(testUnitHash) ],
                                [ 'previousOrgJsonUri', p => (p).should.equal(mockOrgJsonUri) ],
                                [ 'newOrgJsonUri', p => (p).should.equal(mockOrgJsonUri + 'new') ],
                                [ 'previousOrgJsonHash', p => (p).should.equal(mockOrgJsonHash) ],
                                [ 'newOrgJsonHash', p => (p).should.equal(randomOrgJsonHash) ]
                            ]);

                            assertEvent(result, 'DirectorshipAccepted', [
                                [ 'orgId', p => (p).should.equal(testUnitHash) ],
                                [ 'director', p => (p).should.equal(unitDirector) ]
                            ]);

                            unit = await orgIdContractInstance
                                .methods['getOrganization(bytes32)'](testUnitHash)
                                .call();
                            (unit.isDirectorshipAccepted).should.be.true;
                        });

                        it('should succeed if called by confirmed director', async function () {
                            const randomOrgJsonHash = generateHashHelper();
                            const result = await orgIdContractInstance
                                .methods['setOrgJson(bytes32,string,bytes32)'](
                                    testUnitHash,
                                    mockOrgJsonUri + 'newer',
                                    randomOrgJsonHash
                                )
                                .send({ from: unitDirector });

                            assertEvent(result, 'OrgJsonChanged', [
                                [ 'orgId', p => (p).should.equal(testUnitHash) ],
                                [ 'previousOrgJsonUri', p => (p).should.equal(mockOrgJsonUri + 'new') ],
                                [ 'newOrgJsonUri', p => (p).should.equal(mockOrgJsonUri + 'newer') ],
                                [ 'previousOrgJsonHash', () => {} ], // well, we don't have the previous random hash
                                [ 'newOrgJsonHash', p => (p).should.equal(randomOrgJsonHash) ]
                            ]);
                        });
                    });

                    describe('#getUnits(bytes32,bool)', function () {
                        before(async function () {
                            await newOrg();
                        });

                        it('should fail if organization not found', async function () {
                            await assertRevert(
                                orgIdContractInstance
                                    .methods['getUnits(bytes32,bool)'](
                                        randomOrgIdHash,
                                        false
                                    )
                                    .call(),
                                'ORG.ID: Organization not found'
                            );
                        });

                        it('should return empty array if organization has no units', async function () {
                            const units = await orgIdContractInstance
                                .methods['getUnits(bytes32,bool)'](testOrgIdHash, true)
                                .call();

                            (units).should.to.be.an('array');
                            (units.length).should.equal(0);
                        });

                        describe('counting and getting units', function () {
                            let allUnitHashes = [];
                            let activeUnitHashes = [];

                            before(async function () {
                                for (let i = 0; i < 10; i++) {
                                    const call = await createUnitHelper(
                                        orgIdContractInstance,
                                        testOrgIdOwner,
                                        [
                                            testOrgIdHash,
                                            unitDirector,
                                            mockOrgJsonUri,
                                            mockOrgJsonHash
                                        ]
                                    );
                                    const h = call.events.UnitCreated.returnValues.unitOrgId;

                                    allUnitHashes.push(h);
                                    if (i % 2 === 0) {
                                        // units are active by default
                                        activeUnitHashes.push(h)
                                    } else {
                                        // deactivate unit
                                        await orgIdContractInstance
                                            .methods['toggleActiveState(bytes32)'](h)
                                            .send({ from: testOrgIdOwner });
                                    }
                                }
                            });

                            it('should return an array of ACTIVE units only, if "includeInactive" flag set to "false"', async function () {
                                const units = await orgIdContractInstance
                                    .methods['getUnits(bytes32,bool)'](testOrgIdHash, false)
                                    .call();

                                (units).should.to.be.an('array');
                                (units.length).should.equal(activeUnitHashes.length);
                                (units).should.have.members(activeUnitHashes);
                            });

                            it('should return an array of ALL units, if "includeInactive" flag set to "true"', async function () {
                                const units = await orgIdContractInstance
                                    .methods['getUnits(bytes32,bool)'](testOrgIdHash, true)
                                    .call();

                                (units).should.to.be.an('array');
                                (units.length).should.equal(allUnitHashes.length);
                                (units).should.have.members(allUnitHashes);
                            });
                        });
                    });
                });
            });
        });
    });
});

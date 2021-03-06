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
    mockOrgJsonUriBackup1,
    mockOrgJsonUriBackup2,
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

contract('OrgId', accounts => {
    const orgIdContractOwner = accounts[0];
    const randomAddress = accounts[18]; // isn't it funny?
    const randomAddressTwo = accounts[19];

    const setUpProject = async () => {
        const project = await TestHelper({
            from: orgIdContractOwner
        });
        return project;
    };

    const deployNewOrgIdContract = async project => {
        const instance = await project.createProxy(OrgIdContract, {
            initMethod: 'initialize',
            initArgs: []
        });
        return instance;
    };

    let project;
    let orgIdContractInstance;

    before(async () => {
        project = await setUpProject();
    });

    describe('OrgId upgradeability', () => {
        let orgIdHash;

        before(async () => {
            orgIdContractInstance = await deployNewOrgIdContract(project);
            const randomSalt = generateHashHelper();
            const orgCreationResult = await createOrganizationHelper(
                orgIdContractInstance,
                randomAddressTwo,
                [
                    randomSalt,
                    mockOrgJsonHash,
                    mockOrgJsonUri,
                    mockOrgJsonUriBackup1,
                    mockOrgJsonUriBackup2
                ]
            );
            orgIdHash = orgCreationResult
                .events.OrganizationCreated.returnValues.orgId;
        });

        after(async () => {
            project = await setUpProject();
        });

        it('should upgrade proxy and reveal a new function and interface', async () => {
            const newProxy = await project.upgradeProxy(
                orgIdContractInstance.address,
                OrgIdUpgradeabilityContract,
                {
                    initMethod: 'initializeNew',
                    initArgs: []
                }
            );
            const upgradeabilityInstance = OrgIdUpgradeabilityContract.at(newProxy.address);

            (await orgIdContractInstance
                .methods['getOrganization(bytes32)'](orgIdHash)
                .call())
                .should.be.an('object')
                .to.have.property('exists').to.be.true;
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

    describe('ERC165 interfaces', () => {
        it('should support IERC165 interface', async () => {
            (await orgIdContractInstance
                .methods['supportsInterface(bytes4)']('0x01ffc9a7')
                .call()
            ).should.be.true;
        });

        it('should support hierarchy interface', async () => {
            (await orgIdContractInstance
                .methods['supportsInterface(bytes4)']('0x6af2fb27')
                .call()
            ).should.be.true;
        });

        it('should support OrgId interface', async () => {
            (await orgIdContractInstance
                .methods['supportsInterface(bytes4)']('0x0f4893ef')
                .call()
            ).should.be.true;
        });
    });

    describe('OrgId methods', () => {
        const testOrgIdOwner = accounts[1];
        const randomOrgIdHash = generateHashHelper();
        let orgCreationResult;
        let testOrgIdHash;

        const newOrg = async (saltOverride = null) => {
            const randomSalt = generateHashHelper();
            orgCreationResult = await createOrganizationHelper(
                orgIdContractInstance,
                testOrgIdOwner,
                [
                    saltOverride || randomSalt,
                    mockOrgJsonHash,
                    mockOrgJsonUri,
                    mockOrgJsonUriBackup1,
                    mockOrgJsonUriBackup2
                ]
            );
            testOrgIdHash = orgCreationResult
                .events.OrganizationCreated.returnValues.orgId;

            return {
                randomSalt,
                mockOrgJsonHash,
                mockOrgJsonUri,
                mockOrgJsonUriBackup1,
                mockOrgJsonUriBackup2
            };
        };

        before(async () => {
            await newOrg();
        });

        describe('#createOrganization(bytes32,bytes32,string,string,string)', () => {
            it('should create an organization with correct properties', async () => {
                assertEvent(orgCreationResult, 'OrganizationCreated', [
                    [ 'orgId', p => (p).should.equal(testOrgIdHash) ],
                    [ 'owner', p => (p).should.equal(testOrgIdOwner) ]
                ]);

                const testOrgId = await orgIdContractInstance
                    .methods['getOrganization(bytes32)'](testOrgIdHash)
                    .call();

                (testOrgId).should.have.property('exists').to.be.true;
                (testOrgId).should.have.property('orgId').to.equal(testOrgIdHash);
                (testOrgId).should.have.property('orgJsonHash').to.equal(mockOrgJsonHash);
                (testOrgId).should.have.property('orgJsonUri').to.equal(mockOrgJsonUri);
                (testOrgId).should.have.property('orgJsonUriBackup1').to.equal(mockOrgJsonUriBackup1);
                (testOrgId).should.have.property('orgJsonUriBackup2').to.equal(mockOrgJsonUriBackup2);
                (testOrgId).should.have.property('parentOrgId').to.equal(zeroHash);
                (testOrgId).should.have.property('owner').to.equal(testOrgIdOwner);
                (testOrgId).should.have.property('director').to.equal(zeroAddress);
                (testOrgId).should.have.property('isActive').to.be.true;
                (testOrgId).should.have.property('isDirectorshipAccepted').to.be.false;
            });

            it('should fail if sent already used salt', async () => {
                const { randomSalt } = await newOrg();
                await assertRevert(
                    newOrg(randomSalt),
                    'OrgId: Organization already exists'
                );
            });
        });

        describe('#toggleActiveState(bytes32)', () => {
            it('should fail if organization not found', async () => {
                await assertRevert(
                    orgIdContractInstance
                        .methods['toggleActiveState(bytes32)'](randomOrgIdHash)
                        .send({ from: testOrgIdOwner }),
                    'OrgId: Organization not found'
                );
            });

            it('should fail if called by non-owner', async () => {
                await assertRevert(
                    orgIdContractInstance
                        .methods['toggleActiveState(bytes32)'](testOrgIdHash)
                        .send({ from: randomAddress }),
                    'OrgId: action not authorized (must be owner)'
                );
            });

            it('should toggle organization isActive state', async () => {
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

        describe('#transferOrganizationOwnership(bytes32,address)', () => {
            it('should fail if organization not found', async () => {
                await assertRevert(
                    orgIdContractInstance
                        .methods['transferOrganizationOwnership(bytes32,address)'](
                            randomOrgIdHash,
                            randomAddress
                        )
                        .send({ from: testOrgIdOwner }),
                    'OrgId: Organization not found'
                );
            });

            it('should fail if called by non-owner', async () => {
                await assertRevert(
                    orgIdContractInstance
                        .methods['transferOrganizationOwnership(bytes32,address)'](
                            testOrgIdHash,
                            randomAddress
                        )
                        .send({ from: randomAddress }),
                    'OrgId: action not authorized (must be owner)'
                );
            });

            it('should fail if new owner has zero address', async () => {
                await assertRevert(
                    orgIdContractInstance
                        .methods['transferOrganizationOwnership(bytes32,address)'](
                            testOrgIdHash,
                            zeroAddress
                        )
                        .send({ from: testOrgIdOwner }),
                    'OrgId: Invalid owner address'
                );
            });

            it('should transfer organization ownership', async () => {
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

            after(async () => {
                await newOrg();
            });
        });

        describe('#setOrgJson(bytes32,bytes32,string,string,string)', () => {
            const newOrgJsonUri = mockOrgJsonUri + '/some/random/path/org.json';
            const newOrgJsonUriBackup1 = mockOrgJsonUri + '/another/random/path/org.json';
            const newOrgJsonUriBackup2 = '';
            const newOrgJsonHash = generateHashHelper();

            it('should fail if organization not found', async () => {
                await assertRevert(
                    orgIdContractInstance
                        .methods['setOrgJson(bytes32,bytes32,string,string,string)'](
                            randomOrgIdHash,
                            newOrgJsonHash,
                            newOrgJsonUri,
                            newOrgJsonUriBackup1,
                            newOrgJsonUriBackup2
                        )
                        .send({ from: testOrgIdOwner }),
                    'OrgId: Organization not found'
                );
            });

            it('should fail if called by non-owner', async () => {
                await assertRevert(
                    orgIdContractInstance
                        .methods['setOrgJson(bytes32,bytes32,string,string,string)'](
                            testOrgIdHash,
                            newOrgJsonHash,
                            newOrgJsonUri,
                            newOrgJsonUriBackup1,
                            newOrgJsonUriBackup2
                        )
                        .send({ from: randomAddress }),
                    'OrgId: action not authorized (must be owner or director)'
                );
            });

            it('should fail if URI is an empty string', async () => {
                await assertRevert(
                    orgIdContractInstance
                        .methods['setOrgJson(bytes32,bytes32,string,string,string)'](
                            testOrgIdHash,
                            newOrgJsonHash,
                            '',
                            newOrgJsonUriBackup1,
                            newOrgJsonUriBackup2
                        )
                        .send({ from: testOrgIdOwner }),
                    'OrgId: ORG.JSON URI cannot be empty'
                );
            });

            it('should fail if hash is all zeroes', async () => {
                await assertRevert(
                    orgIdContractInstance
                        .methods['setOrgJson(bytes32,bytes32,string,string,string)'](
                            testOrgIdHash,
                            zeroHash,
                            newOrgJsonUri,
                            newOrgJsonUriBackup1,
                            newOrgJsonUriBackup2
                        )
                        .send({ from: testOrgIdOwner }),
                    'OrgId: ORG.JSON hash cannot be zero'
                );
            });

            it('should fail if hash is an empty string', async () => {
                assert.throws(() => {
                    orgIdContractInstance
                        .methods['setOrgJson(bytes32,bytes32,string,string,string)'](
                            testOrgIdHash,
                            '',
                            newOrgJsonUri,
                            newOrgJsonUriBackup1,
                            newOrgJsonUriBackup2
                        )
                        .send({ from: testOrgIdOwner });
                }, /invalid bytes32 value/);
            });

            it('should change ORG.JSON URI and hash', async () => {
                const result = await orgIdContractInstance
                    .methods['setOrgJson(bytes32,bytes32,string,string,string)'](
                        testOrgIdHash,
                        newOrgJsonHash,
                        newOrgJsonUri,
                        newOrgJsonUriBackup1,
                        newOrgJsonUriBackup2
                    )
                    .send({ from: testOrgIdOwner });

                assertEvent(result, 'OrgJsonChanged', [
                    [ 'orgId', p => (p).should.equal(testOrgIdHash) ],
                    [ 'previousOrgJsonHash', p => (p).should.equal(mockOrgJsonHash) ],
                    [ 'previousOrgJsonUri', p => (p).should.equal(mockOrgJsonUri) ],
                    [ 'previousOrgJsonUriBackup1', p => (p).should.equal(mockOrgJsonUriBackup1) ],
                    [ 'previousOrgJsonUriBackup2', p => (p).should.equal(mockOrgJsonUriBackup2) ],
                    [ 'newOrgJsonHash', p => (p).should.equal(newOrgJsonHash) ],
                    [ 'newOrgJsonUri', p => (p).should.equal(newOrgJsonUri) ],
                    [ 'newOrgJsonUriBackup1', p => (p).should.equal(newOrgJsonUriBackup1) ],
                    [ 'newOrgJsonUriBackup2', p => (p).should.equal(newOrgJsonUriBackup2) ]
                ]);
            });
        });

        describe('#getOrganizations(bool)', () => {
            let newOrgIdContractInstance;

            before(async () => {
                newOrgIdContractInstance = await deployNewOrgIdContract(project);
            });

            it('should return empty array if registry is empty', async () => {
                const orgs = await newOrgIdContractInstance
                    .methods['getOrganizations(bool)'](false)
                    .call();

                (orgs).should.to.be.an('array');
                (orgs.length).should.equal(0);
            });

            describe('getting organizations from registry', () => {
                let allOrgs = [];
                let activeOrgs = [];

                before(async () => {
                    for (let i = 0; i < 10; i++) {
                        const randomSalt = generateHashHelper();
                        const call = await createOrganizationHelper(
                            newOrgIdContractInstance,
                            randomAddress,
                            [
                                randomSalt,
                                mockOrgJsonHash,
                                mockOrgJsonUri,
                                mockOrgJsonUriBackup1,
                                mockOrgJsonUriBackup2
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

                it('should return correct number of ALL organizations', async () => {
                    const orgs = await newOrgIdContractInstance
                        // "true" means include ALL organizations, even inactive ones
                        .methods['getOrganizations(bool)'](true)
                        .call();

                    (orgs).should.to.be.an('array').that.include.members(allOrgs);
                    (orgs.length).should.equal(allOrgs.length);
                });

                it('should return correct number of ACTIVE organizations', async () => {
                    const orgs = await newOrgIdContractInstance
                        .methods['getOrganizations(bool)'](false)
                        .call();

                    (orgs).should.to.be.an('array').that.include.members(activeOrgs);
                    (orgs.length).should.equal(activeOrgs.length);
                });
            });
        });

        describe('#getOrganization(bytes32)', () => {
            it('should return exists=false if organization not found', async () => {
                const orgId = await orgIdContractInstance
                    .methods['getOrganization(bytes32)'](randomOrgIdHash)
                    .call();

                (orgId).should.has.property('exists').to.be.false;
            });

            it('should return an organization', () => {
                // This is tested extensively in previous tests
                // #createOrganization(bytes32,bytes32,string,string,string) ->
                // "should create an organization with correct properties"
                assert(true);
            });
        });

        describe('Organizational Units (or simply "units")', () => {
            const unitDirector = accounts[5];

            describe('#createUnit(bytes32,bytes32,address,bytes32,string,string,string)', () => {
                it('should fail if called by non-owner', async () => {
                    const randomSalt = generateHashHelper();
                    await assertRevert(
                        createUnitHelper(
                            orgIdContractInstance,
                            randomAddress, // caller is non-owner
                            [
                                randomSalt,
                                testOrgIdHash,
                                unitDirector,
                                mockOrgJsonHash,
                                mockOrgJsonUri,
                                mockOrgJsonUriBackup1,
                                mockOrgJsonUriBackup2
                            ]
                        ),
                        'OrgId: action not authorized (must be owner)'
                    );
                });

                it('should fail if parent organization not found', async () => {
                    const nonExistingOrgIdHash = generateHashHelper();
                    const randomSalt = generateHashHelper();
                    await assertRevert(
                        createUnitHelper(
                            orgIdContractInstance,
                            testOrgIdOwner,
                            [
                                randomSalt,
                                nonExistingOrgIdHash,
                                unitDirector,
                                mockOrgJsonHash,
                                mockOrgJsonUri,
                                mockOrgJsonUriBackup1,
                                mockOrgJsonUriBackup2
                            ]
                        ),
                        'OrgId: Organization not found'
                    );
                });

                it('should fail if sent already used salt', async () => {
                    const randomSalt = generateHashHelper();
                    await createUnitHelper(
                        orgIdContractInstance,
                        testOrgIdOwner,
                        [
                            randomSalt,
                            testOrgIdHash,
                            unitDirector,
                            mockOrgJsonHash,
                            mockOrgJsonUri,
                            mockOrgJsonUriBackup1,
                            mockOrgJsonUriBackup2
                        ]
                    );
                    await assertRevert(
                        createUnitHelper(
                            orgIdContractInstance,
                            testOrgIdOwner,
                            [
                                randomSalt, // used
                                testOrgIdHash,
                                unitDirector,
                                mockOrgJsonHash,
                                mockOrgJsonUri,
                                mockOrgJsonUriBackup1,
                                mockOrgJsonUriBackup2
                            ]
                        ),
                        'OrgId: Organization already exists'
                    );
                });

                it('should automatically set isDirectorshipAccepted to `true` if director is unit owner', async () => {
                    const randomSalt = generateHashHelper();
                    const call = await createUnitHelper(
                        orgIdContractInstance,
                        testOrgIdOwner,
                        [
                            randomSalt,
                            testOrgIdHash,
                            testOrgIdOwner, // director = owner
                            mockOrgJsonHash,
                            mockOrgJsonUri,
                            mockOrgJsonUriBackup1,
                            mockOrgJsonUriBackup2
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

                describe('unit created successfully...', () => {
                    let unitCreationResult;
                    let testUnitHash;

                    const newUnit = async () => {
                        const randomSalt = generateHashHelper();
                        unitCreationResult = await createUnitHelper(
                            orgIdContractInstance,
                            testOrgIdOwner,
                            [
                                randomSalt,
                                testOrgIdHash,
                                unitDirector,
                                mockOrgJsonHash,
                                mockOrgJsonUri,
                                mockOrgJsonUriBackup1,
                                mockOrgJsonUriBackup2
                            ]
                        );
                        testUnitHash = unitCreationResult.events.UnitCreated.returnValues.unitOrgId;
                    };

                    before(async () => {
                        await newUnit();
                    });

                    it('should create a unit with correct properties', async () => {
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
                        (unit).should.have.property('orgJsonHash').to.equal(mockOrgJsonHash);
                        (unit).should.have.property('orgJsonUri').to.equal(mockOrgJsonUri);
                        (unit).should.have.property('orgJsonUriBackup1').to.equal(mockOrgJsonUriBackup1);
                        (unit).should.have.property('orgJsonUriBackup2').to.equal(mockOrgJsonUriBackup2);
                        (unit).should.have.property('parentOrgId').to.equal(testOrgIdHash);
                        (unit).should.have.property('owner').to.equal(testOrgIdOwner);
                        (unit).should.have.property('director').to.equal(unitDirector);
                        (unit).should.have.property('isActive').to.be.true;
                        (unit).should.have.property('isDirectorshipAccepted').to.be.false;
                    });

                    describe('#acceptDirectorship(bytes32)', () => {
                        it('should fail if organization not found', async () => {
                            await assertRevert(
                                orgIdContractInstance
                                    .methods['acceptDirectorship(bytes32)'](randomOrgIdHash)
                                    .send({ from: unitDirector }),
                                'OrgId: Organization not found'
                            );
                        });

                        it('should fail if not called by director', async () => {
                            await assertRevert(
                                orgIdContractInstance
                                    .methods['acceptDirectorship(bytes32)'](testUnitHash)
                                    .send({ from: randomAddress }),
                                'OrgId: action not authorized (must be director)'
                            );
                        });

                        it('should accept directorship', async () => {
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

                    describe('#transferDirectorship(bytes32,address)', () => {
                        const newDirector = accounts[9];

                        it('should fail if organization not found', async () => {
                            await assertRevert(
                                orgIdContractInstance
                                    .methods['transferDirectorship(bytes32,address)'](
                                        randomOrgIdHash,
                                        newDirector
                                    )
                                    .send({ from: testOrgIdOwner }),
                                'OrgId: Organization not found'
                            );
                        });

                        it('should fail if called by non-owner (e.g. director)', async () => {
                            await assertRevert(
                                orgIdContractInstance
                                    .methods['transferDirectorship(bytes32,address)'](
                                        testUnitHash,
                                        newDirector
                                    )
                                    .send({ from: randomAddress }),
                                'OrgId: action not authorized (must be owner)'
                            );
                        });

                        it('should transfer directorship', async () => {
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

                            const org = await orgIdContractInstance
                                .methods['getOrganization(bytes32)'](testUnitHash)
                                .call();

                            (org.isDirectorshipAccepted).should.be.false;
                        });

                        it('should automatically accept directorship if transferred to owner', async () => {
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

                    describe('#renounceDirectorship(bytes32)', () => {
                        it('should fail if organization not found', async () => {
                            await assertRevert(
                                orgIdContractInstance
                                    .methods['renounceDirectorship(bytes32)'](
                                        randomOrgIdHash
                                    )
                                    .send({ from: testOrgIdOwner }),
                                'OrgId: Organization not found'
                            );
                        });

                        it('should fail if called by non-owner or non-director)', async () => {
                            await assertRevert(
                                orgIdContractInstance
                                    .methods['renounceDirectorship(bytes32)'](
                                        testUnitHash
                                    )
                                    .send({ from: randomAddress }),
                                'OrgId: action not authorized (must be owner or director)'
                            );
                        });

                        it('should set director address to zero if unit OWNER renounces their directorship', async () => {
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

                            const org = await orgIdContractInstance
                                .methods['getOrganization(bytes32)'](testUnitHash)
                                .call();

                            (org.isDirectorshipAccepted).should.be.false;
                        });

                        it('should set director address to zero if unit DIRECTOR renounces their directorship', async () => {
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

                            const org = await orgIdContractInstance
                                .methods['getOrganization(bytes32)'](testUnitHash)
                                .call();

                            (org.isDirectorshipAccepted).should.be.false;
                        });
                    });

                    describe('Changing ORG.JSON URI and hash by unit director', () => {
                        before(async () => {
                            await orgIdContractInstance
                                .methods['transferDirectorship(bytes32,address)'](
                                    testUnitHash,
                                    unitDirector
                                )
                                .send({ from: testOrgIdOwner });
                        });

                        it('should fail if unit not found', async () => {
                            const unknownUnitId = generateHashHelper();
                            await assertRevert(
                                orgIdContractInstance
                                    .methods['setOrgJson(bytes32,bytes32,string,string,string)'](
                                        unknownUnitId,
                                        mockOrgJsonHash,
                                        mockOrgJsonUri,
                                        mockOrgJsonUriBackup1,
                                        mockOrgJsonUriBackup2
                                    )
                                    .send({ from: unitDirector }),
                                'OrgId: Organization not found'
                            );
                        });

                        it('should fail if called by non-owner or non-director', async () => {
                            await assertRevert(
                                orgIdContractInstance
                                    .methods['setOrgJson(bytes32,bytes32,string,string,string)'](
                                        testUnitHash,
                                        mockOrgJsonHash,
                                        mockOrgJsonUri,
                                        mockOrgJsonUriBackup1,
                                        mockOrgJsonUriBackup2
                                    )
                                    .send({ from: randomAddress }),
                                'OrgId: action not authorized (must be owner or director)'
                            );
                        });

                        it('should change ORG.JSON URI and hash if called by nominated director; it means automatic acceptance of their role', async () => {
                            let unit = await orgIdContractInstance
                                .methods['getOrganization(bytes32)'](testUnitHash)
                                .call();
                            (unit.director).should.equal(unitDirector);
                            (unit.isDirectorshipAccepted).should.be.false;

                            const randomOrgJsonHash = generateHashHelper();
                            const newJsonUri = mockOrgJsonUri + 'new';
                            const newJsonUriBackup1 = mockOrgJsonUriBackup1 + 'new';
                            const newJsonUriBackup2 = mockOrgJsonUriBackup2 + '/new';
                            const result = await orgIdContractInstance
                                .methods['setOrgJson(bytes32,bytes32,string,string,string)'](
                                    testUnitHash,
                                    randomOrgJsonHash,
                                    newJsonUri,
                                    newJsonUriBackup1,
                                    newJsonUriBackup2
                                )
                                .send({ from: unitDirector });

                            assertEvent(result, 'OrgJsonChanged', [
                                [ 'orgId', p => (p).should.equal(testUnitHash) ],
                                [ 'previousOrgJsonHash', p => (p).should.equal(mockOrgJsonHash) ],
                                [ 'previousOrgJsonUri', p => (p).should.equal(mockOrgJsonUri) ],
                                [ 'previousOrgJsonUriBackup1', p => (p).should.equal(mockOrgJsonUriBackup1) ],
                                [ 'previousOrgJsonUriBackup2', p => (p).should.equal(mockOrgJsonUriBackup2) ],
                                [ 'newOrgJsonHash', p => (p).should.equal(randomOrgJsonHash) ],
                                [ 'newOrgJsonUri', p => (p).should.equal(newJsonUri) ],
                                [ 'newOrgJsonUriBackup1', p => (p).should.equal(newJsonUriBackup1) ],
                                [ 'newOrgJsonUriBackup2', p => (p).should.equal(newJsonUriBackup2) ]
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

                        it('should succeed if called by confirmed director', async () => {
                            const initialState = await orgIdContractInstance
                                .methods['getOrganization(bytes32)'](testUnitHash)
                                .call();

                            const randomOrgJsonHash = generateHashHelper();
                            const newJsonUri = mockOrgJsonUri + 'newer';
                            const newJsonUriBackup1 = mockOrgJsonUriBackup1 + 'newer';
                            const newJsonUriBackup2 = mockOrgJsonUriBackup2 + '/newer';
                            const result = await orgIdContractInstance
                                .methods['setOrgJson(bytes32,bytes32,string,string,string)'](
                                    testUnitHash,
                                    randomOrgJsonHash,
                                    newJsonUri,
                                    newJsonUriBackup1,
                                    newJsonUriBackup2
                                )
                                .send({ from: unitDirector });

                            assertEvent(result, 'OrgJsonChanged', [
                                [ 'orgId', p => (p).should.equal(testUnitHash) ],
                                [ 'previousOrgJsonHash', p => (p).should.equal(initialState.orgJsonHash) ],
                                [ 'previousOrgJsonUri', p => (p).should.equal(initialState.orgJsonUri) ],
                                [ 'previousOrgJsonUriBackup1', p => (p).should.equal(initialState.orgJsonUriBackup1) ],
                                [ 'previousOrgJsonUriBackup2', p => (p).should.equal(initialState.orgJsonUriBackup2) ],
                                [ 'newOrgJsonHash', p => (p).should.equal(randomOrgJsonHash) ],
                                [ 'newOrgJsonUri', p => (p).should.equal(newJsonUri) ],
                                [ 'newOrgJsonUriBackup1', p => (p).should.equal(newJsonUriBackup1) ],
                                [ 'newOrgJsonUriBackup2', p => (p).should.equal(newJsonUriBackup2) ]
                            ]);
                        });
                    });

                    describe('#getUnits(bytes32,bool)', () => {
                        before(async () => {
                            await newOrg();
                        });

                        it('should fail if organization not found', async () => {
                            await assertRevert(
                                orgIdContractInstance
                                    .methods['getUnits(bytes32,bool)'](
                                        randomOrgIdHash,
                                        false
                                    )
                                    .call(),
                                'OrgId: Organization not found'
                            );
                        });

                        it('should return empty array if organization has no units', async () => {
                            const units = await orgIdContractInstance
                                .methods['getUnits(bytes32,bool)'](testOrgIdHash, true)
                                .call();

                            (units).should.to.be.an('array');
                            (units.length).should.equal(0);
                        });

                        describe('counting and getting units', () => {
                            const allUnitHashes = [];
                            const activeUnitHashes = [];

                            before(async () => {
                                for (let i = 0; i < 10; i++) {
                                    const randomSalt = generateHashHelper();
                                    const call = await createUnitHelper(
                                        orgIdContractInstance,
                                        testOrgIdOwner,
                                        [
                                            randomSalt,
                                            testOrgIdHash,
                                            unitDirector,
                                            mockOrgJsonHash,
                                            mockOrgJsonUri,
                                            mockOrgJsonUriBackup1,
                                            mockOrgJsonUriBackup2
                                        ]
                                    );
                                    const h = call.events.UnitCreated.returnValues.unitOrgId;

                                    allUnitHashes.push(h);
                                    if (i % 2 === 0) {
                                        // units are active by default
                                        activeUnitHashes.push(h);
                                    } else {
                                        // deactivate unit
                                        await orgIdContractInstance
                                            .methods['toggleActiveState(bytes32)'](h)
                                            .send({ from: testOrgIdOwner });
                                    }
                                }
                            });

                            it('should return an array of ACTIVE units only, if "includeInactive" flag set to "false"', async () => {
                                const units = await orgIdContractInstance
                                    .methods['getUnits(bytes32,bool)'](testOrgIdHash, false)
                                    .call();

                                (units).should.to.be.an('array');
                                (units.length).should.equal(activeUnitHashes.length);
                                (units).should.have.members(activeUnitHashes);
                            });

                            it('should return an array of ALL units, if "includeInactive" flag set to "true"', async () => {
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

const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');
const {
    setUpProject,
    deployContract
} = require('./helpers/setup');

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
    createOrganizationHelper
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

const OldOrgIdContract = Contracts.getFromLocal('OrgId_1_1_5');
const OrgIdContract = Contracts.getFromLocal('OrgId');

require('chai')
    .use(require('bn-chai')(web3.utils.BN))
    .should();

contract('OrgId_2_0_0', accounts => {
    const orgIdContractOwner = accounts[0];
    const randomAddress = accounts[16];
    const randomAddress1 = accounts[17];
    const randomAddress2 = accounts[18];

    // Helper: ORGiD creation
    const createOrgId = (contractInstance, salt, orgJsonUri, from) => contractInstance
        .methods['createOrgId(bytes32,string)'](
            salt,
            orgJsonUri
        )
        .send({
            from
        });

    // Helper: ORGiD ownership transfer
    const transferOrgId = (contractInstance, orgId, newOrgId, from) => contractInstance
        .methods['transferOrgIdOwnership(bytes32,address)'](
            orgId,
            newOrgId
        )
        .send({
            from
        });

    // Helper: setting of orgJsonUri for a ORGiD
    const setOrgJson = (contractInstance, orgId, orgJsonUri, from) => contractInstance
        .methods['setOrgJson(bytes32,string)'](
            orgId,
            orgJsonUri
        )
        .send({
            from
        });

    describe('OrgId upgradeability', () => {
        const orgIdOwners = [randomAddress, randomAddress1, randomAddress2];
        let project;
        let orgIdInstance;
        let orgIdHashes;

        before(async () => {
            project = await setUpProject(orgIdContractOwner);
            orgIdInstance = await deployContract(project, OldOrgIdContract);
            const randomSalt = generateHashHelper();
            orgIdHashes = await Promise.all(
                orgIdOwners.map(
                    async addr => {
                        const orgCreationResult = await createOrganizationHelper(
                            orgIdInstance,
                            addr,
                            [
                                randomSalt,
                                mockOrgJsonHash,
                                mockOrgJsonUri,
                                mockOrgJsonUriBackup1,
                                mockOrgJsonUriBackup2
                            ]
                        );
                        return orgCreationResult
                            .events.OrganizationCreated.returnValues.orgId;
                    }
                )
            );
            // Old OrgId must be valid and functional
            await Promise.all(
                orgIdHashes.map(
                    async (orgIdHash, i) => {
                        const orgIdResult = await orgIdInstance
                            .methods['getOrganization(bytes32)'](orgIdHash)
                            .call();

                        (orgIdResult).should.have.property('exists').to.be.true;
                        (orgIdResult).should.have.property('orgId').to.equal(orgIdHash);
                        (orgIdResult).should.have.property('orgJsonHash').to.equal(mockOrgJsonHash);
                        (orgIdResult).should.have.property('orgJsonUri').to.equal(mockOrgJsonUri);
                        (orgIdResult).should.have.property('orgJsonUriBackup1').to.equal(mockOrgJsonUriBackup1);
                        (orgIdResult).should.have.property('orgJsonUriBackup2').to.equal(mockOrgJsonUriBackup2);
                        (orgIdResult).should.have.property('parentOrgId').to.equal(zeroHash);
                        (orgIdResult).should.have.property('owner').to.equal(orgIdOwners[i]);
                        (orgIdResult).should.have.property('director').to.equal(zeroAddress);
                        (orgIdResult).should.have.property('isActive').to.be.true;
                        (orgIdResult).should.have.property('isDirectorshipAccepted').to.be.false;
                    }
                )
            );

            // Contract has to support OLD OrgId interface
            (await orgIdInstance
                .methods['supportsInterface(bytes4)']('0x0f4893ef')
                .call()
            ).should.be.true;
        });

        it('should upgrade proxy', async () => {
            // Upgrade to the new version
            const newProxy = await project.upgradeProxy(
                orgIdInstance.address,
                OrgIdContract,
                {
                    initMethod: 'initializeUpgrade_2_0_0',
                    initArgs: []
                }
            );
            const newOrgIdInstance = OrgIdContract.at(newProxy.address);

            // Upgraded contract has to support new OrgId interface
            (await newOrgIdInstance
                .methods['supportsInterface(bytes4)']('0xafaa40a0')
                .call()
            )
                .should.be.true;

            // New methods should be available
            await Promise.all(
                orgIdHashes.map(
                    async (orgIdHash, i) => {
                        const orgIdResult = await newOrgIdInstance
                            .methods['getOrgId(bytes32)'](orgIdHash)
                            .call();

                        (orgIdResult).should.be.an('object')
                            .to.have.property('exists').to.be.true;
                        (orgIdResult).should.be.an('object')
                            .to.have.property('owner').to.equal(orgIdOwners[i]);
                    }
                )
            );
        });
    });

    describe('OrgId functions', () => {
        let project;
        let orgIdInstance;
        let orgIdCreationResult;
        let testOrgIdHash;

        // Helper: setup upgraded OrgId instance
        const setupUpgradedOrgId = async () => {
            project = await setUpProject(orgIdContractOwner);
            orgIdInstance = await deployContract(project, OldOrgIdContract);
            const newProxy = await project.upgradeProxy(
                orgIdInstance.address,
                OrgIdContract,
                {
                    initMethod: 'initializeUpgrade_2_0_0',
                    initArgs: []
                }
            );
            orgIdInstance = OrgIdContract.at(newProxy.address);
        };

        before(async () => {
            project = await setUpProject(orgIdContractOwner);
            orgIdInstance = await deployContract(project, OldOrgIdContract);
            const newProxy = await project.upgradeProxy(
                orgIdInstance.address,
                OrgIdContract,
                {
                    initMethod: 'initializeUpgrade_2_0_0',
                    initArgs: []
                }
            );
            orgIdInstance = OrgIdContract.at(newProxy.address);
            const randomSalt = generateHashHelper();
            orgIdCreationResult = await createOrgId(
                orgIdInstance,
                randomSalt,
                mockOrgJsonUri,
                randomAddress
            );
            testOrgIdHash = orgIdCreationResult
                .events.OrgIdCreated.returnValues.orgId;
        });

        describe('Initializer', () => {

            it('should fail', async () => {
                await assertRevert(
                    orgIdInstance
                        .methods['initializeUpgrade_2_0_0()']()
                        .send({
                            from: randomAddress
                        }),
                    'OrgId: has already been initialized'
                );
            });
        });

        describe('ERC165 interfaces', () => {

            it('should support IERC165 interface', async () => {
                (await orgIdInstance
                    .methods['supportsInterface(bytes4)']('0x01ffc9a7')
                    .call()
                ).should.be.true;
            });

            it('should NOT support OLD OrgId interface', async () => {
                (await orgIdInstance
                    .methods['supportsInterface(bytes4)']('0x0f4893ef')
                    .call()
                ).should.be.false;
            });

            it('should support NEW OrgId interface', async () => {
                (await orgIdInstance
                    .methods['supportsInterface(bytes4)']('0xafaa40a0')
                    .call()
                ).should.be.true;
            });
        });

        describe('#createOrgId(bytes32,string)', () => {

            it('should create an orgId', async () => {
                // Check OrgIdCreated event
                assertEvent(
                    orgIdCreationResult,
                    'OrgIdCreated',
                    [
                        [ 'orgId', p => (p).should.equal(testOrgIdHash) ],
                        [ 'owner', p => (p).should.equal(randomAddress) ]
                    ]
                );

                const testOrgId = await orgIdInstance
                    .methods['getOrgId(bytes32)'](testOrgIdHash)
                    .call();

                (testOrgId).should.have.property('exists').to.be.true;
                (testOrgId).should.have.property('owner').to.equal(randomAddress);
            });

            it('should fail if an empty orgJsonUri provided', async () => {
                await assertRevert(
                    createOrgId(
                        orgIdInstance,
                        generateHashHelper(),
                        '',
                        randomAddress
                    ),
                    'OrgId: orgJsonUri cannot be empty'
                );
            });
        });

        describe('#transferOrgIdOwnership(bytes32,address)', () => {

            beforeEach(async () => {
                const randomSalt = generateHashHelper();
                orgIdCreationResult = await createOrgId(
                    orgIdInstance,
                    randomSalt,
                    mockOrgJsonUri,
                    randomAddress
                );
                testOrgIdHash = orgIdCreationResult
                    .events.OrgIdCreated.returnValues.orgId;
            });

            it('should transfer ORGiD ownership', async () => {
                const transferResult = await transferOrgId(
                    orgIdInstance,
                    testOrgIdHash,
                    randomAddress1,
                    randomAddress
                );

                // Check OrgIdOwnershipTransferred event
                assertEvent(
                    transferResult,
                    'OrgIdOwnershipTransferred',
                    [
                        [ 'orgId', p => (p).should.equal(testOrgIdHash) ],
                        [ 'previousOwner', p => (p).should.equal(randomAddress) ],
                        [ 'newOwner', p => (p).should.equal(randomAddress1) ]
                    ]
                );

                const testOrgId = await orgIdInstance
                    .methods['getOrgId(bytes32)'](testOrgIdHash)
                    .call();

                (testOrgId).should.have.property('owner').to.equal(randomAddress1);
            });

            it('should fail if unknown ORGiD provided', async () => {
                await assertRevert(
                    transferOrgId(
                        orgIdInstance,
                        generateHashHelper(), // Unknown ORGiD
                        randomAddress1,
                        randomAddress
                    ),
                    'OrgId: ORGiD not found'
                );
            });

            it('should fail if zero provided as new owner', async () => {
                await assertRevert(
                    transferOrgId(
                        orgIdInstance,
                        testOrgIdHash,
                        zeroAddress, // Invalid address
                        randomAddress
                    ),
                    'OrgId: Invalid owner address'
                );
            });

            it('should fail if called not by an owner', async () => {
                await assertRevert(
                    transferOrgId(
                        orgIdInstance,
                        testOrgIdHash,
                        randomAddress1,
                        randomAddress1 // Not an owner
                    ),
                    'OrgId: called not by an owner'
                );
            });
        });

        describe('#setOrgJson(bytes32,string)', () => {

            before(async () => {
                const randomSalt = generateHashHelper();
                orgIdCreationResult = await createOrgId(
                    orgIdInstance,
                    randomSalt,
                    mockOrgJsonUri,
                    randomAddress
                );
                testOrgIdHash = orgIdCreationResult
                    .events.OrgIdCreated.returnValues.orgId;
            });

            it('should emit a proper event', async () => {
                const orgJsonResult = await setOrgJson(
                    orgIdInstance,
                    testOrgIdHash,
                    mockOrgJsonUri,
                    randomAddress
                );

                // Check OrgJsonUriChanged event
                assertEvent(
                    orgJsonResult,
                    'OrgJsonUriChanged',
                    [
                        [ 'orgId', p => (p).should.equal(testOrgIdHash) ],
                        [ 'orgJsonUri', p => (p).should.equal(mockOrgJsonUri) ]
                    ]
                );
            });

            it('should fail if unknown ORGiD provided', async () => {
                await assertRevert(
                    setOrgJson(
                        orgIdInstance,
                        generateHashHelper(), // Unknown ORGiD
                        mockOrgJsonUri,
                        randomAddress
                    ),
                    'OrgId: ORGiD not found'
                );
            });

            it('should fail is called not by an owner', async () => {
                await assertRevert(
                    setOrgJson(
                        orgIdInstance,
                        testOrgIdHash,
                        mockOrgJsonUri,
                        randomAddress1
                    ),
                    'OrgId: called not by an owner'
                );
            });

            it('should fail if empty orgJsonUri provided', async () => {
                await assertRevert(
                    setOrgJson(
                        orgIdInstance,
                        testOrgIdHash,
                        '',
                        randomAddress
                    ),
                    'OrgId: orgJsonUri cannot be empty'
                );
            });
        });

        describe('#getOrgId(bytes32)', () => {

            before(async () => {
                const randomSalt = generateHashHelper();
                orgIdCreationResult = await createOrgId(
                    orgIdInstance,
                    randomSalt,
                    mockOrgJsonUri,
                    randomAddress
                );
                testOrgIdHash = orgIdCreationResult
                    .events.OrgIdCreated.returnValues.orgId;
            });

            it('should return existed orgId', async () => {
                const testOrgId = await orgIdInstance
                    .methods['getOrgId(bytes32)'](testOrgIdHash)
                    .call();

                (testOrgId).should.have.property('exists').to.be.true;
                (testOrgId).should.have.property('owner').to.equal(randomAddress);
            });

            it('should return `exist=false` if unknown ORGiD provided', async () => {
                const testOrgId = await orgIdInstance
                    .methods['getOrgId(bytes32)'](generateHashHelper())
                    .call();

                (testOrgId).should.have.property('exists').to.be.false;
                (testOrgId).should.have.property('owner').to.equal(zeroAddress);
            });
        });

        describe('Getters', () => {
            const orgIdOwners = [
                randomAddress,
                randomAddress1,
                randomAddress2
            ];
            let orgIdHashes;

            before(async () => {
                await setupUpgradedOrgId();
                orgIdHashes = await Promise.all(
                    orgIdOwners.map(
                        async addr => {
                            const orgCreationResult = await createOrgId(
                                orgIdInstance,
                                generateHashHelper(),
                                mockOrgJsonUri,
                                addr
                            );
                            return orgCreationResult
                                .events.OrgIdCreated.returnValues.orgId;
                        }
                    )
                );
            });

            describe('#getOrgIdsCount()', () => {

                it('should return orgIds count', async () => {
                    const count = await orgIdInstance
                        .methods['getOrgIdsCount()']()
                        .call();
                    (Number(count)).should.to.equal(orgIdHashes.length);
                });
            });

            describe('#getOrgIds()', () => {

                it('should return full list of orgIds', async () => {
                    const orgIds = await orgIdInstance
                        .methods['getOrgIds()']()
                        .call();
                    (orgIds).should.to.deep.equal(orgIdHashes);
                });
            });

            describe('#getOrgIds(uint256,uint256)', () => {

                it('should return page of orgIds', async () => {
                    // #1
                    let orgIds = await orgIdInstance
                        .methods['getOrgIds(uint256,uint256)'](0, 1)
                        .call();
                    (orgIds).should.to.deep.equal(orgIdHashes.slice(0, 1));

                    // #2
                    orgIds = await orgIdInstance
                        .methods['getOrgIds(uint256,uint256)'](1, 1)
                        .call();
                    (orgIds).should.to.deep.equal(orgIdHashes.slice(1, 2));

                    // #3
                    orgIds = await orgIdInstance
                        .methods['getOrgIds(uint256,uint256)'](2, 1)
                        .call();
                    (orgIds).should.to.deep.equal(orgIdHashes.slice(2, 3));

                    // out of pages
                    orgIds = await orgIdInstance
                        .methods['getOrgIds(uint256,uint256)'](3, 1)
                        .call();
                    (orgIds).should.to.deep.equal([]);
                });
            });
        });
    });
});

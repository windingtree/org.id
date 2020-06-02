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
    createSubsidiaryHelper
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
    const unitDirector = accounts[2];
    const randomAddress = accounts[3];
    const randomAddressTwo = accounts[4];

    const getRandomAccount = () => {
      return accounts[Math.floor(Math.random() * accounts.length)];
    }

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
                    [
                        'previousOwner',
                        p => (p).should.equal(orgIdContractOwner)
                    ],
                    [
                        'newOwner',
                        p => (p).should.equal(randomAddress)
                    ],
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
            it('should fail if requested ORG.ID hash is not unique', async () => {
                const requestedOrgIdHash = generateHashHelper();

                // Create an org with `requestedId`
                await createOrganizationHelper(
                    orgIdContract,
                    randomAddress,
                    [requestedOrgIdHash, mockOrgJsonUri, mockOrgJsonHash]
                );

                // Try to create another org with the same id (`requestedId`)
                await assertRevert(
                    createOrganizationHelper(
                        orgIdContract,
                        randomAddressTwo,
                        [requestedOrgIdHash, mockOrgJsonUri, mockOrgJsonHash]
                    ),
                    'ORG.ID: requested ORG.ID hash already exists'
                );
            });

            it('should create organization with requested ORG.ID hash', async () => {
                const requestedOrgIdHash = generateHashHelper();
                await createOrganizationHelper(
                    orgIdContract,
                    getRandomAccount(),
                    [requestedOrgIdHash, mockOrgJsonUri, mockOrgJsonHash]
                );
            });

            it('should create organization with random new ORG.ID hash (zeroHash should be sent as requested hash in this case)', async () => {
                const requestedOrgIdHash = zeroHash;
                await createOrganizationHelper(
                    orgIdContract,
                    getRandomAccount(),
                    [zeroHash, mockOrgJsonUri, mockOrgJsonHash]
                );
            });
        });

        describe('#toggleOrganization(bytes32)', () => {
            let testOrgIdHash;

            beforeEach(async () => {
                const requestedOrgIdHash = zeroHash;
                testOrgIdHash = await createOrganizationHelper(
                    orgIdContract,
                    organizationOwner,
                    [requestedOrgIdHash, mockOrgJsonUri, mockOrgJsonHash]
                );
            });

            it('should fail if organization not found', async () => {
                const randomOrgIdHash = generateHashHelper();
                await assertRevert(
                    orgIdContract
                        .methods['toggleOrganization(bytes32)'](randomOrgIdHash)
                        .send({ from: organizationOwner }),
                    'ORG.ID: Organization not found'
                );
            });

            it('should fail if called by non-owner', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['toggleOrganization(bytes32)'](testOrgIdHash)
                        .send({ from: randomAddress }),
                    'ORG.ID: action not authorized (must be owner)'
                );
            });

            it('should toggle organization state', async () => {
                await orgIdContract.methods['toggleOrganization(bytes32)'](testOrgIdHash)
                    .send({ from: organizationOwner });
                let org = await orgIdContract.methods['getOrganization(bytes32)'](testOrgIdHash).call();
                (org.state).should.be.false;
                await orgIdContract.methods['toggleOrganization(bytes32)'](testOrgIdHash)
                    .send({ from: organizationOwner });
                org = await orgIdContract.methods['getOrganization(bytes32)'](testOrgIdHash).call();
                (org.state).should.be.true;
            });
        });

        describe('#transferOrganizationOwnership(bytes32,address)', () => {
            let testOrgIdHash;

            beforeEach(async () => {
                const requestedOrgIdHash = zeroHash;
                testOrgIdHash = await createOrganizationHelper(
                    orgIdContract,
                    organizationOwner,
                    [requestedOrgIdHash, mockOrgJsonUri, mockOrgJsonHash]
                );
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
                    [
                        'orgId',
                        p => (p).should.equal(testOrgIdHash)
                    ],
                    [
                        'previousOwner',
                        p => (p).should.equal(organizationOwner)
                    ],
                    [
                        'newOwner',
                        p => (p).should.equal(randomAddress)
                    ]
                ]);
            });
        });

        describe('#changeOrgJsonUri(bytes32,string)', () => {
            let testOrgIdHash;
            const testOrgIdOwner = accounts[5];
            const requestedOrgIdHash = zeroHash;
            let newOrgJsonUri = mockOrgJsonUri + '/some/random/path/org.json';

            beforeEach(async () => {
                testOrgIdHash = await createOrganizationHelper(
                    orgIdContract,
                    testOrgIdOwner,
                    [requestedOrgIdHash, mockOrgJsonUri, mockOrgJsonHash]
                );
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
                    [
                        'orgId',
                        p => (p).should.equal(testOrgIdHash)
                    ],
                    [
                        'previousOrgJsonUri',
                        p => (p).should.equal(mockOrgJsonUri)
                    ],
                    [
                        'newOrgJsonUri',
                        p => (p).should.equal(newOrgJsonUri)
                    ]
                ]);
            });

            it('should change unit ORG.JSON URI requested by director', async () => {
              const parentOrgIdOwner = unitOwner = testOrgIdOwner;
              const parentOrgIdHash = testOrgIdHash;
              const requestedUnitOrgIdHash = zeroHash;
              const unitDirector = randomAddressTwo;
              const testUnitOrgIdHash = await createSubsidiaryHelper(
                  orgIdContract,
                  parentOrgIdOwner,
                  [parentOrgIdHash, requestedUnitOrgIdHash, unitDirector, mockOrgJsonUri, mockOrgJsonHash]
              );

              const result = await orgIdContract
                  .methods['changeOrgJsonUri(bytes32,string)'](testUnitOrgIdHash, newOrgJsonUri)
                  .send({ from: unitDirector });

              assertEvent(result, 'OrgJsonUriChanged', [
                  [
                      'orgId',
                      p => (p).should.equal(testUnitOrgIdHash)
                  ],
                  [
                      'previousOrgJsonUri',
                      p => (p).should.equal(mockOrgJsonUri)
                  ],
                  [
                      'newOrgJsonUri',
                      p => (p).should.equal(newOrgJsonUri)
                  ]
              ]);
            });
        });

        describe('#changeOrgJsonHash(bytes32,bytes32)', () => {
            let testOrgIdHash;
            const testOrgIdOwner = accounts[5];
            let newOrgJsonHash = generateHashHelper();

            beforeEach(async () => {
                const requestedOrgIdHash = zeroHash;
                testOrgIdHash = await createOrganizationHelper(
                    orgIdContract,
                    testOrgIdOwner,
                    [requestedOrgIdHash, mockOrgJsonUri, mockOrgJsonHash]
                );
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
                    [
                        'orgId',
                        p => (p).should.equal(testOrgIdHash)
                    ],
                    [
                        'previousOrgJsonHash',
                        p => (p).should.equal(mockOrgJsonHash)
                    ],
                    [
                        'newOrgJsonHash',
                        p => (p).should.equal(newOrgJsonHash)
                    ]
                ]);
            });

            it('should change unit ORG.JSON hash requested by director', async () => {
              const parentOrgIdOwner = unitOwner = testOrgIdOwner;
              const parentOrgIdHash = testOrgIdHash;
              const requestedUnitOrgIdHash = zeroHash;
              const unitDirector = randomAddressTwo;
              const testUnitOrgIdHash = await createSubsidiaryHelper(
                  orgIdContract,
                  parentOrgIdOwner,
                  [parentOrgIdHash, requestedUnitOrgIdHash, unitDirector, mockOrgJsonUri, mockOrgJsonHash]
              );

              const result = await orgIdContract
                  .methods['changeOrgJsonHash(bytes32,bytes32)'](testUnitOrgIdHash, newOrgJsonHash)
                  .send({ from: unitDirector });

              assertEvent(result, 'OrgJsonHashChanged', [
                  [
                      'orgId',
                      p => (p).should.equal(testUnitOrgIdHash)
                  ],
                  [
                      'previousOrgJsonHash',
                      p => (p).should.equal(mockOrgJsonHash)
                  ],
                  [
                      'newOrgJsonHash',
                      p => (p).should.equal(newOrgJsonHash)
                  ]
              ]);
            });
        });

        describe('#changeOrgJsonUriAndHash(bytes32,string,bytes32)', () => {
            let testOrgIdHash;
            const testOrgIdOwner = accounts[5];
            let newOrgJsonUri = mockOrgJsonUri + '/some/random/path/org.json';
            let newOrgJsonHash = generateHashHelper();

            beforeEach(async () => {
                const requestedOrgIdHash = zeroHash;
                testOrgIdHash = await createOrganizationHelper(
                    orgIdContract,
                    testOrgIdOwner,
                    [requestedOrgIdHash, mockOrgJsonUri, mockOrgJsonHash]
                );
            });

            it('should fail if organization not found', async () => {
                const randomOrgIdHash = generateHashHelper();
                await assertRevert(
                    orgIdContract
                        .methods['changeOrgJsonUriAndHash(bytes32,string,bytes32)']
                        (randomOrgIdHash, newOrgJsonUri, newOrgJsonHash)
                        .send({ from: testOrgIdOwner }),
                    'ORG.ID: Organization not found'
                );
            });

            it('should fail if called by non-owner', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['changeOrgJsonUriAndHash(bytes32,string,bytes32)']
                        (testOrgIdHash, newOrgJsonUri, newOrgJsonHash)
                        .send({ from: randomAddress }),
                    'ORG.ID: action not authorized (must be owner or director)'
                );
            });

            it('should fail if URI is an empty string', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['changeOrgJsonUriAndHash(bytes32,string,bytes32)']
                        (testOrgIdHash, '', newOrgJsonHash)
                        .send({ from: testOrgIdOwner }),
                    'ORG.ID: ORG.JSON URI cannot be empty'
                );
            });

            it('should fail if hash is all zeroes', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['changeOrgJsonUriAndHash(bytes32,string,bytes32)']
                        (testOrgIdHash, newOrgJsonUri, zeroHash)
                        .send({ from: testOrgIdOwner }),
                    'ORG.ID: ORG.JSON hash cannot be zero'
                );
            });

            it('should fail if hash is an empty string', async () => {
                assert.throws(() => {
                    orgIdContract
                        .methods['changeOrgJsonUriAndHash(bytes32,string,bytes32)']
                        (testOrgIdHash, newOrgJsonUri, '')
                        .send({ from: testOrgIdOwner });
                }, /invalid bytes32 value/);
            });

            it('should change ORG.JSON URI and hash', async () => {
                const result = await orgIdContract
                    .methods['changeOrgJsonUriAndHash(bytes32,string,bytes32)']
                    (testOrgIdHash, newOrgJsonUri, newOrgJsonHash)
                    .send({ from: testOrgIdOwner });

                assertEvent(result, 'OrgJsonHashChanged', [
                    [
                        'orgId',
                        p => (p).should.equal(testOrgIdHash)
                    ],
                    [
                        'previousOrgJsonHash',
                        p => (p).should.equal(mockOrgJsonHash)
                    ],
                    [
                        'newOrgJsonHash',
                        p => (p).should.equal(newOrgJsonHash)
                    ]
                ]);
                assertEvent(result, 'OrgJsonUriChanged', [
                    [
                        'orgId',
                        p => (p).should.equal(testOrgIdHash)
                    ],
                    [
                        'previousOrgJsonUri',
                        p => (p).should.equal(mockOrgJsonUri)
                    ],
                    [
                        'newOrgJsonUri',
                        p => (p).should.equal(newOrgJsonUri)
                    ]
                ]);
            });

            it('should change unit ORG.JSON URI requested by director', async () => {
              const parentOrgIdOwner = unitOwner = testOrgIdOwner;
              const parentOrgIdHash = testOrgIdHash;
              const requestedUnitOrgIdHash = zeroHash;
              const unitDirector = randomAddressTwo;
              const testUnitOrgIdHash = await createSubsidiaryHelper(
                  orgIdContract,
                  parentOrgIdOwner,
                  [parentOrgIdHash, requestedUnitOrgIdHash, unitDirector, mockOrgJsonUri, mockOrgJsonHash]
              );

              const result = await orgIdContract
                  .methods['changeOrgJsonUriAndHash(bytes32,string,bytes32)']
                  (testUnitOrgIdHash, newOrgJsonUri, newOrgJsonHash)
                  .send({ from: unitDirector });

                  assertEvent(result, 'OrgJsonHashChanged', [
                      [
                          'orgId',
                          p => (p).should.equal(testUnitOrgIdHash)
                      ],
                      [
                          'previousOrgJsonHash',
                          p => (p).should.equal(mockOrgJsonHash)
                      ],
                      [
                          'newOrgJsonHash',
                          p => (p).should.equal(newOrgJsonHash)
                      ]
                  ]);
                  assertEvent(result, 'OrgJsonUriChanged', [
                      [
                          'orgId',
                          p => (p).should.equal(testUnitOrgIdHash)
                      ],
                      [
                          'previousOrgJsonUri',
                          p => (p).should.equal(mockOrgJsonUri)
                      ],
                      [
                          'newOrgJsonUri',
                          p => (p).should.equal(newOrgJsonUri)
                      ]
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
                const orgId1 = await createOrganizationHelper(
                    orgIdContract,
                    randomAddress,
                    [zeroHash, mockOrgJsonUri, mockOrgJsonHash]
                );
                const orgId2 = await createOrganizationHelper(
                    orgIdContract,
                    randomAddressTwo,
                    [zeroHash, mockOrgJsonUri, mockOrgJsonHash]
                );
                await orgIdContract.methods['toggleOrganization(bytes32)'](orgId1)
                    .send({ from: randomAddress });
                await orgIdContract.methods['toggleOrganization(bytes32)'](orgId2)
                    .send({ from: randomAddressTwo });
                const orgs = await orgIdContract
                    .methods['getOrganizations()']()
                    .call();
                (orgs).should.to.be.an('array');
                (orgs.length).should.equal(0);
            });

            it('should return an array of organizations', async () => {
                const orgId1 = await createOrganizationHelper(
                    orgIdContract,
                    randomAddress,
                    [zeroHash, mockOrgJsonUri, mockOrgJsonHash]
                );
                const orgId2 = await createOrganizationHelper(
                    orgIdContract,
                    randomAddressTwo,
                    [zeroHash, mockOrgJsonUri, mockOrgJsonHash]
                );
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
                const requestedOrgIdHash = zeroHash;
                testOrgIdHash = await createOrganizationHelper(
                    orgIdContract,
                    testOrgIdOwner,
                    [requestedOrgIdHash, mockOrgJsonUri, mockOrgJsonHash]
                );
            });

            it('should return exist=false if organization not found', async () => {
                const randomOrgIdHash = generateHashHelper();
                (
                    await orgIdContract
                        .methods['getOrganization(bytes32)'](randomOrgIdHash)
                        .call()
                ).should.has.property('exist').to.false;
            });

            it('should return an organization', async () => {
                const org = await orgIdContract
                    .methods['getOrganization(bytes32)'](testOrgIdHash)
                    .call();

                (org).should.has.property('exist').to.true;
                (org).should.has.property('orgId').to.equal(testOrgIdHash);
                (org).should.has.property('orgJsonUri').to.equal(mockOrgJsonUri);
                (org).should.has.property('orgJsonHash').to.equal(mockOrgJsonHash);
                (org).should.has.property('parentEntity').to.equal(zeroHash);
                (org).should.has.property('owner').to.equal(testOrgIdOwner);
                (org).should.has.property('director').to.equal(zeroAddress);
                (org).should.has.property('state').to.be.true;
                (org).should.has.property('directorConfirmed').to.be.false;
            });
        });
    });

    describe('ORG.ID hierarchy', () => {
        let testOrgIdHash, parentOrgIdHash;
        const parentOrgIdOwner = unitOwner = testOrgIdOwner = accounts[5];
        const unitDirector = accounts[6];
        const nonOwnerOrDirector = accounts[7];
        const requestedOrgIdHash = zeroHash;
        const requestedUnitOrgIdHash = zeroHash;

        beforeEach(async () => {
            parentOrgIdHash = testOrgIdHash = await createOrganizationHelper(
                orgIdContract,
                testOrgIdOwner,
                [requestedOrgIdHash, mockOrgJsonUri, mockOrgJsonHash]
            );
        });

        describe('#createSubsidiary(bytes32,bytes32,address,string,bytes32)', () => {
            it('should fail if called by non-owner', async () => {
                await assertRevert(
                    createSubsidiaryHelper(
                        orgIdContract,
                        nonOwnerOrDirector,
                        [parentOrgIdHash, requestedUnitOrgIdHash, unitDirector, mockOrgJsonUri, mockOrgJsonHash]
                    ),
                    'ORG.ID: action not authorized (must be owner)'
                );
            });

            it('should fail if parent organization not found', async () => {
                const nonExistingOrgIdHash = generateHashHelper();
                await assertRevert(
                    createSubsidiaryHelper(
                        orgIdContract,
                        testOrgIdOwner,
                        [nonExistingOrgIdHash, requestedUnitOrgIdHash, unitDirector, mockOrgJsonUri, mockOrgJsonHash]
                    ),
                    'ORG.ID: Organization not found'
                );
            });

            // TODO: This should NOT fail. Director address could be assigned later
            it('should fail if director address is zero', async () => {
                const invalidDirectorAddress = zeroAddress;
                await assertRevert(
                    createSubsidiaryHelper(
                        orgIdContract,
                        testOrgIdOwner,
                        [parentOrgIdHash, requestedUnitOrgIdHash, invalidDirectorAddress, mockOrgJsonUri, mockOrgJsonHash]
                    ),
                    'ORG.ID: Invalid director address'
                );
            });

            it('should create a subsidiary', async () => {
                // Director is different from the organization owner
                await createSubsidiaryHelper(
                    orgIdContract,
                    testOrgIdOwner,
                    [parentOrgIdHash, requestedUnitOrgIdHash, unitDirector, mockOrgJsonUri, mockOrgJsonHash]
                );

                // Director is the same as the organization owner
                await createSubsidiaryHelper(
                    orgIdContract,
                    testOrgIdOwner,
                    [parentOrgIdHash, requestedUnitOrgIdHash, testOrgIdOwner, mockOrgJsonUri, mockOrgJsonHash]
                );

                // TODO: assertions are missing!!!
            });
        });

        // TODO: if unconfirmed director calls any director-specific methods,
        // directorship is automatically confirmed
        // OR: unconfirmed director should not be able to call director-specific methods

        describe('#confirmDirectorOwnership(bytes32)', () => {
            let unitOrgIdHash;

            beforeEach(async () => {
                unitOrgIdHash = await createSubsidiaryHelper(
                    orgIdContract,
                    testOrgIdOwner,
                    [parentOrgIdHash, requestedUnitOrgIdHash, unitDirector, mockOrgJsonUri, mockOrgJsonHash]
                );
            });

            it('should fail if organization not found', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['confirmDirectorOwnership(bytes32)'](zeroHash)
                        .send({ from: unitDirector }),
                    'ORG.ID: Organization not found'
                );
            });

            it('should fail if not called by director', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['confirmDirectorOwnership(bytes32)'](unitOrgIdHash)
                        .send({ from: randomAddress }),
                    'ORG.ID: action not authorized (must be director)'
                );
            });

            it('should confirm directorship', async () => {
                const result = await orgIdContract
                    .methods['confirmDirectorOwnership(bytes32)'](unitOrgIdHash)
                    .send({ from: unitDirector });

                assertEvent(result, 'DirectorOwnershipConfirmed', [
                    [
                        'orgId',
                        p => (p).should.equal(unitOrgIdHash)
                    ],
                    [
                        'director',
                        p => (p).should.equal(unitDirector)
                    ]
                ]);
            });
        });

        describe('#transferDirectorOwnership(bytes32,address)', () => {
            let unitOrgIdHash;
            const newDirector = accounts[10];

            beforeEach(async () => {
                unitOrgIdHash = await createSubsidiaryHelper(
                    orgIdContract,
                    testOrgIdOwner,
                    [parentOrgIdHash, requestedUnitOrgIdHash, unitDirector, mockOrgJsonUri, mockOrgJsonHash]
                );
                await orgIdContract
                    .methods['confirmDirectorOwnership(bytes32)'](unitOrgIdHash)
                    .send({ from: unitDirector });
            });

            it('should fail if organization not found', async () => {
                await assertRevert(
                    orgIdContract
                        .methods['transferDirectorOwnership(bytes32,address)'](
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
                        .methods['transferDirectorOwnership(bytes32,address)'](
                            unitOrgIdHash,
                            newDirector
                        )
                        .send({ from: unitDirector }),
                    'ORG.ID: action not authorized (must be owner)'
                );
            });

            it('should transfer directorship', async () => {
                const result = await orgIdContract
                    .methods['transferDirectorOwnership(bytes32,address)'](
                        unitOrgIdHash,
                        newDirector
                    )
                    .send({ from: unitOwner });

                assertEvent(result, 'DirectorOwnershipTransferred', [
                    [
                        'orgId',
                        p => (p).should.equal(unitOrgIdHash)
                    ],
                    [
                        'previousDirector',
                        p => (p).should.equal(unitDirector)
                    ],
                    [
                        'newDirector',
                        p => (p).should.equal(newDirector)
                    ]
                ]);
                let org = await orgIdContract
                    .methods['getOrganization(bytes32)'](unitOrgIdHash)
                    .call();
                (org.directorConfirmed).should.be.false;
            });

            it('should automatically confirm directorship if transferred to owner', async () => {
                const result = await orgIdContract
                    .methods['transferDirectorOwnership(bytes32,address)'](
                        unitOrgIdHash,
                        unitOwner
                    )
                    .send({ from: unitOwner });

                assertEvent(result, 'DirectorOwnershipTransferred', [
                    [
                        'orgId',
                        p => (p).should.equal(unitOrgIdHash)
                    ],
                    [
                        'previousDirector',
                        p => (p).should.equal(unitDirector)
                    ],
                    [
                        'newDirector',
                        p => (p).should.equal(unitOwner)
                    ]
                ]);
                assertEvent(result, 'DirectorOwnershipConfirmed', [
                    [
                        'orgId',
                        p => (p).should.equal(unitOrgIdHash)
                    ],
                    [
                        'director',
                        p => (p).should.equal(unitOwner)
                    ]
                ]);
                let org = await orgIdContract
                    .methods['getOrganization(bytes32)'](unitOrgIdHash)
                    .call();
                (org.directorConfirmed).should.be.true;
            });
        });


//
// TODO
//


        describe('#getSubsidiaries(bytes32)', () => {
            let testOrgIdHash, parentOrgIdHash;
            const parentOrgIdOwner = unitOwner = testOrgIdOwner = accounts[5];
            const unitDirector = accounts[6];
            const nonOwnerOrDirector = accounts[7];
            const requestedOrgIdHash = zeroHash;
            const requestedUnitOrgIdHash = zeroHash;

            beforeEach(async () => {
                parentOrgIdHash = testOrgIdHash = await createOrganizationHelper(
                    orgIdContract,
                    testOrgIdOwner,
                    [requestedOrgIdHash, mockOrgJsonUri, mockOrgJsonHash]
                );
            });

            it('should fail if organization not found', async () => {
                const nonExistingOrgIdHash = generateHashHelper();
                await assertRevert(
                    orgIdContract
                        .methods['getSubsidiaries(bytes32)'](nonExistingOrgIdHash)
                        .call(),
                    'ORG.ID: Organization not found'
                );
            });

            it('should return empty array if organization has no units', async () => {
                const subs = await orgIdContract
                    .methods['getSubsidiaries(bytes32)'](parentOrgIdHash)
                    .call();
                (subs).should.to.be.an('array');
                (subs.length).should.equal(0);
            });

            // TODO: I should be able to see organizations and units that are inactive or don't have directors
            // TODO: this is a wrong assumption. Organization unit may function without director just fine.
            it('should return an empty array if organization unit directorship is not confirmed', async () => {
                await createSubsidiaryHelper(
                    orgIdContract,
                    parentOrgIdOwner,
                    [parentOrgIdHash, requestedUnitOrgIdHash, unitDirector, mockOrgJsonUri, mockOrgJsonHash]
                );
                const subs = await orgIdContract
                    .methods['getSubsidiaries(bytes32)'](parentOrgIdHash)
                    .call();
                (subs).should.to.be.an('array');
                (subs.length).should.equal(0);
            });

            it('should return array of units', async () => {
                const unitOrgIdHash = await createSubsidiaryHelper(
                    orgIdContract,
                    parentOrgIdOwner,
                    [parentOrgIdHash, requestedUnitOrgIdHash, unitDirector, mockOrgJsonUri, mockOrgJsonHash]
                );
                await orgIdContract
                    .methods['confirmDirectorOwnership(bytes32)'](unitOrgIdHash)
                    .send({ from: unitDirector });
                const subs = await orgIdContract
                    .methods['getSubsidiaries(bytes32)'](parentOrgIdHash)
                    .call();
                (subs).should.to.be.an('array');
                (subs).should.to.be.an('array').that.include(unitOrgIdHash);
            });
        });
    });
});

const { TestHelper } = require('@openzeppelin/cli');
const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');

const {
    assertRevert,
    assertEvent
} = require('./helpers/assertions');
const {
    zeroAddress,
    zeroBytes,
    organizationUri,
    organizationHash
} = require('./helpers/constants');
const {
    generateId,
    createOrganization
} = require('./helpers/orgid');

let gasLimit = 8000000; // Like actual to the Ropsten

if (process.env.SOLIDITY_COVERAGE) {
    gasLimit = 0xfffffffffff;
    Contracts.setLocalBuildDir('./.coverage_artifacts/contracts');
}

// workaround for https://github.com/zeppelinos/zos/issues/704
Contracts.setArtifactsDefaults({
    gas: gasLimit,
});

ZWeb3.initialize(web3.currentProvider);

const OrgId = Contracts.getFromLocal('OrgId');
const OrgIdInterface = Contracts.getFromLocal('OrgIdInterface');
const OrgIdUpgradeability = Contracts.getFromLocal('OrgIdUpgradeability');

require('chai').should();

contract('OrgId', accounts => {

    const nonOwner = accounts[1];
    const orgIdOwner = accounts[2];
    const organizationOwner = accounts[3];
    const entityDirector = accounts[4];

    let project;
    let orgId;
    
    beforeEach(async () => {
        project = await TestHelper({
            from: orgIdOwner
        });
        orgId = await project.createProxy(OrgId, {
            initMethod: 'initialize',
            initArgs: [
                orgIdOwner
            ]
        });
    });
    
    describe('Upgradeability behaviour', () => {

        it('should upgrade proxy and reveal a new function and interface', async () => {
            orgId = await project.upgradeProxy(
                orgId.address,
                OrgIdUpgradeability,
                {
                    initMethod: 'initialize',
                    initArgs: []
                }
            );
            orgId = await OrgIdUpgradeability.at(orgId.address);
            await orgId.methods['setupNewStorage(uint256)']('100').send({
                from: orgIdOwner
            });
            (await orgId.methods['newFunction()']().call()).should.equal('100');
            (
                await orgId
                    .methods['supportsInterface(bytes4)']('0x1b28d63e')
                    .call()
            ).should.be.true;
        });
    });

    describe('Ownable behaviour', () => {

        describe('#transferOwnership(address)', () => {

            it('should fail if called by not an owner', async () => {
                await assertRevert(
                    orgId
                        .methods['transferOwnership(address)'](nonOwner)
                        .send({
                            from: nonOwner
                        }),
                    'Ownable: caller is not the owner'
                );
            });
    
            it('should fail if new owner has zero address', async () => {
                await assertRevert(
                    orgId
                        .methods['transferOwnership(address)'](zeroAddress)
                        .send({
                            from: orgIdOwner
                        }),
                    'Ownable: new owner is the zero address'
                );
            });

            it('should transfer contract ownership', async () => {
                const result = await orgId
                    .methods['transferOwnership(address)'](nonOwner)
                    .send({
                        from: orgIdOwner
                    });
                await assertEvent(result, 'OwnershipTransferred', [
                    [
                        'previousOwner',
                        p => (p).should.equal(orgIdOwner)
                    ],
                    [
                        'newOwner',
                        p => (p).should.equal(nonOwner)
                    ],
                ]);
            });
        });

        describe('#owner()', () => {

            it('should return contract owner', async () => {
                (await orgId.methods['owner()']().call())
                    .should.equal(orgIdOwner);
            });
        });
    });

    describe('ERC165 interfaces', () => {

        it('should support IERC165 interface', async () => {
            (
                await orgId
                    .methods['supportsInterface(bytes4)']('0x01ffc9a7')
                    .call()
            ).should.be.true;
        });

        it('should support ownable interface', async () => {
            (
                await orgId
                    .methods['supportsInterface(bytes4)']('0x7f5828d0')
                    .call()
            ).should.be.true;
        });

        it('should support hierarchy interface', async () => {
            (
                await orgId
                    .methods['supportsInterface(bytes4)']('0x2c8667d8')
                    .call()
            ).should.be.true;
        });

        it('should support ORG.ID interface', async () => {
            (
                await orgId
                    .methods['supportsInterface(bytes4)']('0x36b78f0f')
                    .call()
            ).should.be.true;
        });
    });

    describe('OrgId methods', () => {

        describe('#createOrganization(bytes32,string,bytes32)', () => {

            it('should fail if existed orgId provided', async () => {
                const id = generateId(orgIdOwner);
                await createOrganization(
                    orgId,
                    orgIdOwner,
                    id,
                    organizationUri,
                    organizationHash
                );
                await assertRevert(
                    createOrganization(
                        orgId,
                        orgIdOwner,
                        id,
                        organizationUri,
                        organizationHash
                    ),
                    'OrgId: An organization with given orgId already exists'
                );
            });

            it('should create a new orgId with provided Id', async () => {
                await createOrganization(
                    orgId,
                    orgIdOwner,
                    generateId(orgIdOwner),
                    organizationUri,
                    organizationHash
                );
            });

            it('should create a new orgId if provided default zero address', async () => {
                await createOrganization(
                    orgId,
                    orgIdOwner,
                    zeroBytes,
                    organizationUri,
                    organizationHash
                );
            });
        });

        describe('#toggleOrganization(bytes32)', () => {
            let id;

            beforeEach(async () => {
                id = await createOrganization(
                    orgId,
                    orgIdOwner,
                    zeroBytes,
                    organizationUri,
                    organizationHash
                );
            });

            it('should fail if provided orgId not existed', async () => {
                await assertRevert(
                    orgId
                        .methods['toggleOrganization(bytes32)'](zeroBytes)
                        .send({ from: orgIdOwner }),
                    'OrgId: Organization with given orgId not found'
                );
            });

            it('should fail if called by not an owner', async () => {
                await assertRevert(
                    orgId
                        .methods['toggleOrganization(bytes32)'](id)
                        .send({ from: nonOwner }),
                    'OrgId: Only organization owner can call this method'
                );
            });

            it('should toggle organization state', async () => {
                await orgId.methods['toggleOrganization(bytes32)'](id)
                    .send({ from: orgIdOwner });
                let org = await orgId.methods['getOrganization(bytes32)'](id).call();
                (org.state).should.be.false;
                await orgId.methods['toggleOrganization(bytes32)'](id)
                    .send({ from: orgIdOwner });
                org = await orgId.methods['getOrganization(bytes32)'](id).call();
                (org.state).should.be.true;
            });
        });

        describe('#transferOrganizationOwnership(bytes32,address)', () => {
            let id;

            beforeEach(async () => {
                id = await createOrganization(
                    orgId,
                    orgIdOwner,
                    zeroBytes,
                    organizationUri,
                    organizationHash
                );
            });

            it('should fail if provided orgId not existed', async () => {
                await assertRevert(
                    orgId
                        .methods['transferOrganizationOwnership(bytes32,address)'](zeroBytes, nonOwner)
                        .send({ from: orgIdOwner }),
                    'OrgId: Organization with given orgId not found'
                );
            });

            it('should fail if called by not an owner', async () => {
                await assertRevert(
                    orgId
                        .methods['transferOrganizationOwnership(bytes32,address)'](id, nonOwner)
                        .send({ from: nonOwner }),
                    'OrgId: Only organization owner can call this method'
                );
            });

            it('should fail if zero address provided as new owner', async () => {
                await assertRevert(
                    orgId
                        .methods['transferOrganizationOwnership(bytes32,address)'](id, zeroAddress)
                        .send({ from: orgIdOwner }),
                    'OrgId: Invalid owner address'
                );
            });

            it('should transfer organization ownership', async () => {
                const result = await orgId
                    .methods['transferOrganizationOwnership(bytes32,address)'](id, nonOwner)
                    .send({ from: orgIdOwner });
                assertEvent(result, 'OrganizationOwnershipTransferred', [
                    [
                        'orgId',
                        p => (p).should.equal(id)
                    ],
                    [
                        'previousOwner',
                        p => (p).should.equal(orgIdOwner)
                    ],
                    [
                        'newOwner',
                        p => (p).should.equal(nonOwner)
                    ]
                ]);
            });
        });

        describe.skip('#changeOrgJsonUri(bytes32,string)', () => {

            it('should fail if provided orgId not existed', async () => {});

            it('should fail if called by not an owner or director', async () => {});

            it('should fail if empty uri provided', async () => {});

            it('should change json uri', async () => {});
        });

        describe.skip('#changeOrgJsonHash(bytes32,bytes32)', () => {

            it('should fail if provided orgId not existed', async () => {});

            it('should fail if called by not an owner or director', async () => {});

            it('should fail if empty hash provided', async () => {});

            it('should change json hash', async () => {});
        });

        describe.skip('#changeOrgJsonUriAndHash(bytes32,string,bytes32)', () => {

            it('should fail if provided orgId not existed', async () => {});

            it('should fail if called by not an owner or director', async () => {});

            it('should fail if empty uri or hash provided', async () => {});

            it('should change json uri and hash', async () => {});
        });
        
        describe.skip('#getOrganizations()', () => {

            it('should return an empty array if no organizations has been added before', async () => {});

            it('should return an empty array if previously added organizations had been disabled', async () => {});

            it('should return an array of organizations', async () => {});
        });

        describe.skip('#getOrganization()', () => {

            it('should fail if organization not found', async () => {});

            it('should return an organization', async () => {});
        });
    });

    describe.skip('OrgId hierarchy methods', () => {

        describe('#createSubsidiary(bytes32,bytes32,string,bytes32,address)', () => {

            it('should fail if called not by owner or director', async () => {});

            it('should fail if provided subsidiary id already existed', async () => {});

            it('should fail if parent organization not found', async () => {});

            it('should fail if director address not been provided', async () => {});

            it('should create a subsidiary', async () => {});
        });

        describe('#confirmDirectorOwnership(bytes32)', () => {

            it('should fail if provided orgId not found', async () => {});

            it('should fail if called not by director', async () => {});

            it('should confirm director ownership', async () => {});
        });

        describe('#transferDirectorOwnership(bytes32,address)', () => {

            it('should fail if provided orgId not found', async () => {});

            it('should fail if called not by owner', async () => {});

            it('should transfer director ownership', async () => {});
        });

        describe('#getSubsidiaries(bytes32)', () => {

            it('should fail if provided orgId not found', async () => {});

            it('should return an empty array if no subsidiaries has been added before', async () => {});

            it('shoudl return an empty array if some subsidiaries had been added but director ownership not been confirmed', async () => {});

            it('should return an array of subsidiaries', async () => {});
        });
    });
});

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
const { toWeiEther } = require('./helpers/common');
const {
    generateId,
    createOrganization,
    createSubsidiary
} = require('./helpers/orgid');
const {
    setupLifToken,
    distributeLifTokens
} = require('./helpers/lif');
const {
    addDeposit,
    submitWithdrawalRequest,
    withdrawDeposit
} = require('./helpers/deposit');

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

const OrgId = Contracts.getFromLocal('OrgIdTimeMachine');
const OrgIdUpgradeability = Contracts.getFromLocal('OrgIdUpgradeability');

require('chai')
    .use(require('bn-chai')(web3.utils.BN))
    .should();

contract('OrgId', accounts => {

    const lifOwner = accounts[1];
    const nonOwner = accounts[2];
    const orgIdOwner = accounts[3];
    const organizationOwner = accounts[4];
    const entityDirector = accounts[5];

    const defaultWithdrawalDelay = '60000';

    let lifToken;
    let project;
    let orgId;
    
    beforeEach(async () => {
        lifToken = await setupLifToken(lifOwner);
        await distributeLifTokens(lifToken, lifOwner, '10000', [
            organizationOwner,
            entityDirector
        ]);
        project = await TestHelper({
            from: orgIdOwner
        });
        orgId = await project.createProxy(OrgId, {
            initMethod: 'initialize',
            initArgs: [
                orgIdOwner,
                lifToken.address
            ]
        });
        await orgId
            .methods['setWithdrawDelay(uint256)'](defaultWithdrawalDelay)
            .send({ from: orgIdOwner });
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
                    .methods['supportsInterface(bytes4)']('0x3a3bc250')
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
                const id = generateId(organizationOwner);
                await createOrganization(
                    orgId,
                    organizationOwner,
                    id,
                    organizationUri,
                    organizationHash
                );
                await assertRevert(
                    createOrganization(
                        orgId,
                        organizationOwner,
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
                    organizationOwner,
                    generateId(organizationOwner),
                    organizationUri,
                    organizationHash
                );
            });

            it('should create a new orgId if provided default zero address', async () => {
                await createOrganization(
                    orgId,
                    organizationOwner,
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
                    organizationOwner,
                    zeroBytes,
                    organizationUri,
                    organizationHash
                );
            });

            it('should fail if not existed orgId been provided', async () => {
                await assertRevert(
                    orgId
                        .methods['toggleOrganization(bytes32)'](zeroBytes)
                        .send({ from: organizationOwner }),
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
                    .send({ from: organizationOwner });
                let org = await orgId.methods['getOrganization(bytes32)'](id).call();
                (org.state).should.be.false;
                await orgId.methods['toggleOrganization(bytes32)'](id)
                    .send({ from: organizationOwner });
                org = await orgId.methods['getOrganization(bytes32)'](id).call();
                (org.state).should.be.true;
            });
        });

        describe('#transferOrganizationOwnership(bytes32,address)', () => {
            let id;

            beforeEach(async () => {
                id = await createOrganization(
                    orgId,
                    organizationOwner,
                    zeroBytes,
                    organizationUri,
                    organizationHash
                );
            });

            it('should fail if not existed orgId been provided', async () => {
                await assertRevert(
                    orgId
                        .methods['transferOrganizationOwnership(bytes32,address)'](zeroBytes, nonOwner)
                        .send({ from: organizationOwner }),
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
                        .send({ from: organizationOwner }),
                    'OrgId: Invalid owner address'
                );
            });

            it('should transfer organization ownership', async () => {
                const result = await orgId
                    .methods['transferOrganizationOwnership(bytes32,address)'](id, nonOwner)
                    .send({ from: organizationOwner });
                assertEvent(result, 'OrganizationOwnershipTransferred', [
                    [
                        'orgId',
                        p => (p).should.equal(id)
                    ],
                    [
                        'previousOwner',
                        p => (p).should.equal(organizationOwner)
                    ],
                    [
                        'newOwner',
                        p => (p).should.equal(nonOwner)
                    ]
                ]);
            });
        });

        describe('#changeOrgJsonUri(bytes32,string)', () => {
            let id;

            beforeEach(async () => {
                id = await createOrganization(
                    orgId,
                    organizationOwner,
                    zeroBytes,
                    organizationUri,
                    organizationHash
                );
            });

            it('should fail if not existed orgId been provided', async () => {
                await assertRevert(
                    orgId
                        .methods['changeOrgJsonUri(bytes32,string)'](zeroBytes, organizationUri)
                        .send({ from: organizationOwner }),
                    'OrgId: Organization with given orgId not found'
                );
            });

            it('should fail if called by not an owner or director', async () => {
                await assertRevert(
                    orgId
                        .methods['changeOrgJsonUri(bytes32,string)'](id, organizationUri)
                        .send({ from: nonOwner }),
                    'OrgId: Only organization owner or entity director can call this method'
                );
            });

            it('should fail if empty uri provided', async () => {
                await assertRevert(
                    orgId
                        .methods['changeOrgJsonUri(bytes32,string)'](id, '')
                        .send({ from: organizationOwner }),
                    'OrgId: orgJsonUri cannot be an empty string'
                );
            });

            it('should change json uri', async () => {
                const result = await orgId
                    .methods['changeOrgJsonUri(bytes32,string)'](id, organizationUri)
                    .send({ from: organizationOwner });
                assertEvent(result, 'OrgJsonUriChanged', [
                    [
                        'orgId',
                        p => (p).should.equal(id)
                    ],
                    [
                        'previousOrgJsonUri',
                        p => (p).should.equal(organizationUri)
                    ],
                    [
                        'newOrgJsonUri',
                        p => (p).should.equal(organizationUri)
                    ]
                ]);
            });
        });

        describe('#changeOrgJsonHash(bytes32,bytes32)', () => {
            let id;

            beforeEach(async () => {
                id = await createOrganization(
                    orgId,
                    organizationOwner,
                    zeroBytes,
                    organizationUri,
                    organizationHash
                );
            });

            it('should fail if not existed orgId been provided', async () => {
                await assertRevert(
                    orgId
                        .methods['changeOrgJsonHash(bytes32,bytes32)'](zeroBytes, organizationHash)
                        .send({ from: organizationOwner }),
                    'OrgId: Organization with given orgId not found'
                );
            });

            it('should fail if called by not an owner or director', async () => {
                await assertRevert(
                    orgId
                        .methods['changeOrgJsonHash(bytes32,bytes32)'](id, organizationHash)
                        .send({ from: nonOwner }),
                    'OrgId: Only organization owner or entity director can call this method'
                );
            });

            it('should fail if empty hash provided', async () => {
                await assertRevert(
                    orgId
                        .methods['changeOrgJsonHash(bytes32,bytes32)'](id, zeroBytes)
                        .send({ from: organizationOwner }),
                    'OrgId: orgJsonHash cannot be an empty'
                );
            });

            it('should change json hash', async () => {
                const result = await orgId
                    .methods['changeOrgJsonHash(bytes32,bytes32)'](id, organizationHash)
                    .send({ from: organizationOwner });
                assertEvent(result, 'OrgJsonHashChanged', [
                    [
                        'orgId',
                        p => (p).should.equal(id)
                    ],
                    [
                        'previousOrgJsonHash',
                        p => (p).should.equal(organizationHash)
                    ],
                    [
                        'newOrgJsonHash',
                        p => (p).should.equal(organizationHash)
                    ]
                ]);
            });
        });

        describe('#changeOrgJsonUriAndHash(bytes32,string,bytes32)', () => {
            let id;

            beforeEach(async () => {
                id = await createOrganization(
                    orgId,
                    organizationOwner,
                    zeroBytes,
                    organizationUri,
                    organizationHash
                );
            });

            it('should fail if not existed orgId been provided', async () => {
                await assertRevert(
                    orgId
                        .methods['changeOrgJsonUriAndHash(bytes32,string,bytes32)'](
                            zeroBytes,
                            organizationUri,
                            organizationHash
                        )
                        .send({ from: organizationOwner }),
                    'OrgId: Organization with given orgId not found'
                );
            });

            it('should fail if called by not an owner or director', async () => {
                await assertRevert(
                    orgId
                        .methods['changeOrgJsonUriAndHash(bytes32,string,bytes32)'](
                            id,
                            organizationUri,
                            organizationHash
                        )
                        .send({ from: nonOwner }),
                    'OrgId: Only organization owner or entity director can call this method'
                );
            });

            it('should fail if empty hash provided', async () => {
                await assertRevert(
                    orgId
                        .methods['changeOrgJsonUriAndHash(bytes32,string,bytes32)'](
                            id,
                            organizationUri,
                            zeroBytes
                        )
                        .send({ from: organizationOwner }),
                    'OrgId: orgJsonHash cannot be an empty'
                );
                await assertRevert(
                    orgId
                        .methods['changeOrgJsonUriAndHash(bytes32,string,bytes32)'](
                            id,
                            '',
                            organizationHash
                        )
                        .send({ from: organizationOwner }),
                    'OrgId: orgJsonUri cannot be an empty string'
                );
            });

            it('should change json uri and hash', async () => {
                const result = await orgId
                    .methods['changeOrgJsonUriAndHash(bytes32,string,bytes32)'](
                        id,
                        organizationUri,
                        organizationHash
                    )
                    .send({ from: organizationOwner });
                assertEvent(result, 'OrgJsonHashChanged', [
                    [
                        'orgId',
                        p => (p).should.equal(id)
                    ],
                    [
                        'previousOrgJsonHash',
                        p => (p).should.equal(organizationHash)
                    ],
                    [
                        'newOrgJsonHash',
                        p => (p).should.equal(organizationHash)
                    ]
                ]);
                assertEvent(result, 'OrgJsonUriChanged', [
                    [
                        'orgId',
                        p => (p).should.equal(id)
                    ],
                    [
                        'previousOrgJsonUri',
                        p => (p).should.equal(organizationUri)
                    ],
                    [
                        'newOrgJsonUri',
                        p => (p).should.equal(organizationUri)
                    ]
                ]);
            });
        });
        
        describe('#getOrganizations()', () => {

            it('should return an empty array if no organizations has been added before', async () => {
                const orgs = await orgId
                    .methods['getOrganizations()']()
                    .call();
                (orgs).should.to.be.an('array');
                (orgs.length).should.equal(0);
            });

            it('should return an empty array if previously added organizations had been disabled', async () => {
                const id1 = await createOrganization(
                    orgId,
                    organizationOwner,
                    zeroBytes,
                    organizationUri,
                    organizationHash
                );
                const id2 = await createOrganization(
                    orgId,
                    organizationOwner,
                    zeroBytes,
                    organizationUri,
                    organizationHash
                );
                await orgId.methods['toggleOrganization(bytes32)'](id1)
                    .send({ from: organizationOwner });
                await orgId.methods['toggleOrganization(bytes32)'](id2)
                    .send({ from: organizationOwner });
                const orgs = await orgId
                    .methods['getOrganizations()']()
                    .call();
                (orgs).should.to.be.an('array');
                (orgs.length).should.equal(0);
            });

            it('should return an array of organizations', async () => {
                const id1 = await createOrganization(
                    orgId,
                    organizationOwner,
                    zeroBytes,
                    organizationUri,
                    organizationHash
                );
                const id2 = await createOrganization(
                    orgId,
                    organizationOwner,
                    zeroBytes,
                    organizationUri,
                    organizationHash
                );
                const orgs = await orgId
                    .methods['getOrganizations()']()
                    .call();
                (orgs).should.to.be.an('array').that.include(id1);
                (orgs).should.to.be.an('array').that.include(id2);
            });
        });

        describe('#getOrganization(bytes32)', () => {
            let id;

            beforeEach(async () => {
                id = await createOrganization(
                    orgId,
                    organizationOwner,
                    zeroBytes,
                    organizationUri,
                    organizationHash
                );
            });

            it('should fail if organization not found', async () => {
                await assertRevert(
                    orgId
                        .methods['getOrganization(bytes32)'](zeroBytes)
                        .call(),
                    'OrgId: Organization with given orgId not found'
                );
            });

            it('should return an organization', async () => {
                const org = await orgId
                    .methods['getOrganization(bytes32)'](id)
                    .call();
                (org.orgId).should.equal(id);
                (org.orgJsonUri).should.equal(organizationUri);
                (org.orgJsonHash).should.equal(organizationHash);
                (org.parentEntity).should.equal(zeroBytes);
                (org.owner).should.equal(organizationOwner);
                (org.director).should.equal(zeroAddress);
                (org.state).should.be.true;
                (org.directorConfirmed).should.be.false;
            });
        });
    });

    describe('OrgId hierarchy methods', () => {
        let id;

        beforeEach(async () => {
            id = await createOrganization(
                orgId,
                organizationOwner,
                zeroBytes,
                organizationUri,
                organizationHash
            );
        });

        describe('#createSubsidiary(bytes32,bytes32,address,string,bytes32)', () => {

            it('should fail if called not by owner or director', async () => {
                await assertRevert(
                    createSubsidiary(
                        orgId,
                        nonOwner,
                        id,
                        generateId(organizationOwner),
                        entityDirector,
                        organizationUri,
                        organizationHash
                    ),
                    'OrgId: Only organization owner or entity director can call this method'
                );
            });

            it('should fail if provided subsidiary id already existed', async () => {
                await assertRevert(
                    createSubsidiary(
                        orgId,
                        organizationOwner,
                        id,
                        id,
                        entityDirector,
                        organizationUri,
                        organizationHash
                    ),
                    'OrgId: An organization with given orgId already exists'
                );
            });

            it('should fail if parent organization not found', async () => {
                await assertRevert(
                    createSubsidiary(
                        orgId,
                        organizationOwner,
                        zeroBytes,
                        generateId(organizationOwner),
                        entityDirector,
                        organizationUri,
                        organizationHash
                    ),
                    'OrgId: Organization with given orgId not found'
                );
            });

            it('should fail if director address not been provided', async () => {
                await assertRevert(
                    createSubsidiary(
                        orgId,
                        organizationOwner,
                        id,
                        generateId(organizationOwner),
                        zeroAddress,
                        organizationUri,
                        organizationHash
                    ),
                    'OrgId: Invalid subsidiary director address'
                );
            });

            it('should create a subsidiary', async () => {
                // Director is different from the organization owner
                await createSubsidiary(
                    orgId,
                    organizationOwner,
                    id,
                    generateId(organizationOwner),
                    entityDirector,
                    organizationUri,
                    organizationHash
                );
                
                // Director is the same as the organization owner
                await createSubsidiary(
                    orgId,
                    organizationOwner,
                    id,
                    generateId(organizationOwner),
                    organizationOwner,
                    organizationUri,
                    organizationHash
                );
            });
        });

        describe('#confirmDirectorOwnership(bytes32)', () => {
            let subId;

            beforeEach(async () => {
                subId = await createSubsidiary(
                    orgId,
                    organizationOwner,
                    id,
                    generateId(organizationOwner),
                    entityDirector,
                    organizationUri,
                    organizationHash
                );
            });

            it('should fail if provided orgId not found', async () => {
                await assertRevert(
                    orgId
                        .methods['confirmDirectorOwnership(bytes32)'](zeroBytes)
                        .send({ from: entityDirector }),
                    'OrgId: Organization with given orgId not found'
                );
            });

            it('should fail if called not by director', async () => {
                await assertRevert(
                    orgId
                        .methods['confirmDirectorOwnership(bytes32)'](subId)
                        .send({ from: nonOwner }),
                    'OrgId: Only subsidiary director can call this method'
                );
            });

            it('should confirm director ownership', async () => {
                const result = await orgId
                    .methods['confirmDirectorOwnership(bytes32)'](subId)
                    .send({ from: entityDirector });
                assertEvent(result, 'DirectorOwnershipConfirmed', [
                    [
                        'orgId',
                        p => (p).should.equal(subId)
                    ],
                    [
                        'director',
                        p => (p).should.equal(entityDirector)
                    ]
                ]);
            });
        });

        describe('#transferDirectorOwnership(bytes32,address)', () => {
            let subId;

            beforeEach(async () => {
                subId = await createSubsidiary(
                    orgId,
                    organizationOwner,
                    id,
                    generateId(organizationOwner),
                    entityDirector,
                    organizationUri,
                    organizationHash
                );
                await orgId
                    .methods['confirmDirectorOwnership(bytes32)'](subId)
                    .send({ from: entityDirector });
            });

            it('should fail if provided orgId not found', async () => {
                await assertRevert(
                    orgId
                        .methods['transferDirectorOwnership(bytes32,address)'](
                            zeroBytes,
                            nonOwner
                        )
                        .send({ from: organizationOwner }),
                    'OrgId: Organization with given orgId not found'
                );
            });

            it('should fail if called not by owner', async () => {
                await assertRevert(
                    orgId
                        .methods['transferDirectorOwnership(bytes32,address)'](
                            subId,
                            nonOwner
                        )
                        .send({ from: nonOwner }),
                    'OrgId: Only organization owner can call this method'
                );
            });

            it('should transfer director ownership to not an owner', async () => {
                const result = await orgId
                    .methods['transferDirectorOwnership(bytes32,address)'](
                        subId,
                        nonOwner
                    )
                    .send({ from: organizationOwner });
                assertEvent(result, 'DirectorOwnershipTransferred', [
                    [
                        'orgId',
                        p => (p).should.equal(subId)
                    ],
                    [
                        'previousDirector',
                        p => (p).should.equal(entityDirector)
                    ],
                    [
                        'newDirector',
                        p => (p).should.equal(nonOwner)
                    ]
                ]);
                let org = await orgId
                    .methods['getOrganization(bytes32)'](subId)
                    .call();
                (org.directorConfirmed).should.be.false;
            });

            it('should transfer director ownership to not the owner', async () => {
                const result = await orgId
                    .methods['transferDirectorOwnership(bytes32,address)'](
                        subId,
                        organizationOwner
                    )
                    .send({ from: organizationOwner });
                assertEvent(result, 'DirectorOwnershipTransferred', [
                    [
                        'orgId',
                        p => (p).should.equal(subId)
                    ],
                    [
                        'previousDirector',
                        p => (p).should.equal(entityDirector)
                    ],
                    [
                        'newDirector',
                        p => (p).should.equal(organizationOwner)
                    ]
                ]);
                assertEvent(result, 'DirectorOwnershipConfirmed', [
                    [
                        'orgId',
                        p => (p).should.equal(subId)
                    ],
                    [
                        'director',
                        p => (p).should.equal(organizationOwner)
                    ]
                ]);
                let org = await orgId
                    .methods['getOrganization(bytes32)'](subId)
                    .call();
                (org.directorConfirmed).should.be.true;
            });
        });

        describe('#getSubsidiaries(bytes32)', () => {
            let id;

            beforeEach(async () => {
                id = await createOrganization(
                    orgId,
                    organizationOwner,
                    zeroBytes,
                    organizationUri,
                    organizationHash
                );
            });

            it('should fail if provided orgId not found', async () => {
                await assertRevert(
                    orgId
                        .methods['getSubsidiaries(bytes32)'](zeroBytes)
                        .call(),
                    'OrgId: Organization with given orgId not found'
                );
            });

            it('should return an empty array if no subsidiaries has been added before', async () => {
                const subs = await orgId
                    .methods['getSubsidiaries(bytes32)'](id)
                    .call();
                (subs).should.to.be.an('array');
                (subs.length).should.equal(0);
            });

            it('shoudl return an empty array if some subsidiaries had been added but director ownership not been confirmed', async () => {
                await createSubsidiary(
                    orgId,
                    organizationOwner,
                    id,
                    generateId(organizationOwner),
                    entityDirector,
                    organizationUri,
                    organizationHash
                );
                const subs = await orgId
                    .methods['getSubsidiaries(bytes32)'](id)
                    .call();
                (subs).should.to.be.an('array');
                (subs.length).should.equal(0);
            });

            it('should return an array of subsidiaries', async () => {
                const subId = await createSubsidiary(
                    orgId,
                    organizationOwner,
                    id,
                    generateId(organizationOwner),
                    entityDirector,
                    organizationUri,
                    organizationHash
                );
                await orgId
                    .methods['confirmDirectorOwnership(bytes32)'](subId)
                    .send({ from: entityDirector });
                const subs = await orgId
                    .methods['getSubsidiaries(bytes32)'](id)
                    .call();
                (subs).should.to.be.an('array');
                (subs).should.to.be.an('array').that.include(subId);
            });
        });
    });

    describe('Lif deposit', () => {
        let organizationId;

        beforeEach(async () => {
            organizationId = generateId(organizationOwner);
            await createOrganization(
                orgId,
                organizationOwner,
                organizationId,
                organizationUri,
                organizationHash
            );
        });

        describe('#getLifTokenAddress()', () => {

            it('should return Lif token address', async () => {
                (
                    await orgId.methods['getLifTokenAddress()']().call()
                ).should.equal(lifToken.address);
            });
        });

        describe('#addDeposit(bytes32,uint256)', () => {

            it('should fail if organization not found', async () => {
                await assertRevert(
                    addDeposit(
                        orgId,
                        organizationOwner,
                        zeroBytes,
                        toWeiEther('1000'),
                        lifToken
                    ),
                    'OrgId: Organization with given orgId not found'
                );
            });

            it('should fail if called not by an organization owner ot director', async () => {
                await assertRevert(
                    addDeposit(
                        orgId,
                        nonOwner,
                        organizationId,
                        toWeiEther('1000'),
                        lifToken
                    ),
                    'OrgId: Only organization owner or entity director can call this method'
                );
            });

            it('should fail if zero value provided', async () => {
                await assertRevert(
                    addDeposit(
                        orgId,
                        organizationOwner,
                        organizationId,
                        '0',
                        lifToken
                    ),
                    'OrgId: Invalid deposit value'
                );
            });

            it('should fail if Lif token allowance not sufficient', async () => {
                await assertRevert(
                    addDeposit(
                        orgId,
                        organizationOwner,
                        organizationId,
                        toWeiEther('1000')
                    ),
                    'SafeERC20: low-level call failed'
                );
            });

            it('should add deposit', async () => {
                await addDeposit(
                    orgId,
                    organizationOwner,
                    organizationId,
                    toWeiEther('1000'),
                    lifToken
                );
            });
        });

        describe('#setWithdrawDelay(uint256)', () => {

            it('should fail if called not by an owner', async () => {
                await assertRevert(
                    orgId
                        .methods['setWithdrawDelay(uint256)']('6000')
                        .send({ from: nonOwner }),
                    'Ownable: caller is not the owner'
                );
            });

            it('should change withdrawal delay', async () => {
                const delay = '6000';
                const result = await orgId
                    .methods['setWithdrawDelay(uint256)'](delay)
                    .send({ from: orgIdOwner });
                assertEvent(result, 'WithdrawDelayChanged', [
                    [
                        'previousWithdrawDelay',
                        p => (p).should.equal(defaultWithdrawalDelay)
                    ],
                    [
                        'newWithdrawDelay',
                        p => (p).should.equal(delay)
                    ]
                ]);
            });
        });

        describe('#getWithdrawDelay()', () => {

            it('should return withdrawDelay', async () => {
                (
                    await orgId.methods['getWithdrawDelay()']().call()
                ).should.equal(defaultWithdrawalDelay);
                const delay = '6000';
                await orgId
                    .methods['setWithdrawDelay(uint256)'](delay)
                    .send({ from: orgIdOwner });
                (
                    await orgId.methods['getWithdrawDelay()']().call()
                ).should.equal(delay);
            });
        });

        describe('#submitWithdrawalRequest(bytes32,uint256)', () => {
            const depositValue = toWeiEther('1000');
            const extraDepositValue = toWeiEther('1001');

            beforeEach(async () => {
                await addDeposit(
                    orgId,
                    organizationOwner,
                    organizationId,
                    depositValue,
                    lifToken
                );
            });

            it('should fail if organization not found', async () => {
                await assertRevert(
                    submitWithdrawalRequest(
                        orgId,
                        organizationOwner,
                        orgIdOwner,
                        zeroBytes,
                        depositValue
                    ),
                    'OrgId: Organization with given orgId not found'
                );
            });

            it('should fail if called not by an organization owner or director', async () => {
                await assertRevert(
                    submitWithdrawalRequest(
                        orgId,
                        nonOwner,
                        orgIdOwner,
                        organizationId,
                        depositValue
                    ),
                    'OrgId: Only organization owner or entity director can call this method'
                );
            });

            it('should fail if zero withdrawal value has been sent', async () => {
                await assertRevert(
                    submitWithdrawalRequest(
                        orgId,
                        organizationOwner,
                        orgIdOwner,
                        organizationId,
                        '0'
                    ),
                    'OrgId: Invalid withdrawal value'
                );
            });

            it('should fail if deposit balance is insufficient to withdraw', async () => {
                await assertRevert(
                    submitWithdrawalRequest(
                        orgId,
                        organizationOwner,
                        orgIdOwner,
                        organizationId,
                        extraDepositValue
                    ),
                    'OrgId: Insufficient balance'
                );
            });

            it('should submit withdrawal request', async () => {
                await submitWithdrawalRequest(
                    orgId,
                    organizationOwner,
                    orgIdOwner,
                    organizationId,
                    depositValue
                );
            });
        });

        describe('#getWithdrawalRequest(bytes32)', () => {
            const depositValue = toWeiEther('1000');
            let organizationId;
            let organizationIdNoRequest;
            let withdrawalRequest;

            beforeEach(async () => {
                organizationId = generateId(organizationOwner);
                organizationIdNoRequest = generateId(organizationOwner);
                await createOrganization(
                    orgId,
                    organizationOwner,
                    organizationId,
                    organizationUri,
                    organizationHash
                );
                await createOrganization(
                    orgId,
                    organizationOwner,
                    organizationIdNoRequest,
                    organizationUri,
                    organizationHash
                );
                await addDeposit(
                    orgId,
                    organizationOwner,
                    organizationId,
                    depositValue,
                    lifToken
                );
                await addDeposit(
                    orgId,
                    organizationOwner,
                    organizationIdNoRequest,
                    depositValue,
                    lifToken
                );
                withdrawalRequest = await submitWithdrawalRequest(
                    orgId,
                    organizationOwner,
                    orgIdOwner,
                    organizationId,
                    depositValue
                );
            });

            it('should fail if organization not found', async () => {
                await assertRevert(
                    orgId
                        .methods['getWithdrawalRequest(bytes32)'](zeroBytes)
                        .call(),
                    'OrgId: Organization with given orgId not found'
                );
            });

            it('should fail if withdrawal request not found', async () => {
                await assertRevert(
                    orgId
                        .methods['getWithdrawalRequest(bytes32)'](organizationIdNoRequest)
                        .call(),
                    'OrgId: Withdrawal request not found'
                );
            });

            it('should return withrdawal request info', async () => {
                const request = await orgId
                    .methods['getWithdrawalRequest(bytes32)'](organizationId)
                    .call();
                (request).should.be.an('object')
                    .that.has.property('value')
                    .to.equal(depositValue);
                (request).should.be.an('object')
                    .that.has.property('withdrawTime')
                    .to.equal(withdrawalRequest.withdrawTime);
            });
        });

        describe('#withdrawDeposit(bytes32)', () => {
            const depositValue = toWeiEther('1000');
            let organizationId;

            beforeEach(async () => {
                organizationId = generateId(organizationOwner);
                await createOrganization(
                    orgId,
                    organizationOwner,
                    organizationId,
                    organizationUri,
                    organizationHash
                );
                await addDeposit(
                    orgId,
                    organizationOwner,
                    organizationId,
                    depositValue,
                    lifToken
                );
                await submitWithdrawalRequest(
                    orgId,
                    organizationOwner,
                    orgIdOwner,
                    organizationId,
                    depositValue
                );
            });

            it('should fail if orgainzation not found', async () => {
                await assertRevert(
                    withdrawDeposit(
                        orgId,
                        organizationOwner,
                        orgIdOwner,
                        zeroBytes
                    ),
                    'OrgId: Organization with given orgId not found'
                );
            });

            it('should fail if called not by organization owner or director', async () => {
                await assertRevert(
                    withdrawDeposit(
                        orgId,
                        nonOwner,
                        orgIdOwner,
                        organizationId
                    ),
                    'OrgId: Only organization owner or entity director can call this method'
                );
            });

            it('should fail if withdrawal request not found', async () => {
                const organizationId = generateId(organizationOwner);
                await createOrganization(
                    orgId,
                    organizationOwner,
                    organizationId,
                    organizationUri,
                    organizationHash
                );
                await addDeposit(
                    orgId,
                    organizationOwner,
                    organizationId,
                    depositValue,
                    lifToken
                );
                await assertRevert(
                    withdrawDeposit(
                        orgId,
                        organizationOwner,
                        orgIdOwner,
                        organizationId
                    ),
                    'OrgId: Withdrawal request not found'
                );
            });

            it('should fail if withdrawal request delay period not passed', async () => {
                await assertRevert(
                    withdrawDeposit(
                        orgId,
                        organizationOwner,
                        orgIdOwner,
                        organizationId
                    ),
                    'OrgId: Withdrawal request delay period not passed'
                );
            });

            it('should withdraw deposit', async () => {
                await withdrawDeposit(
                    orgId,
                    organizationOwner,
                    orgIdOwner,
                    organizationId,
                    true
                );
            });
        });
    });
});

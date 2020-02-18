const { TestHelper } = require('@openzeppelin/cli');
const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');

const {
    assertRevert,
    assertEvent
} = require('./helpers/assertions');
const {
    zeroAddress,
    organizationUri,
    organizationHash
} = require('./helpers/constants');

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

    describe('OrgId methods', () => {});

    describe('OrgId hierarchy methods', () => {});
});

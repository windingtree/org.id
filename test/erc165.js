const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');

const {
    assertRevert
} = require('./helpers/assertions');

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

require('chai').should();

const ERC165Test = Contracts.getFromLocal('ERC165Test');

contract('ERC165', () => {

    const deployErc165 = async () => {
        return await ERC165Test.new();
    };

    const registerInterface = async (contract, interfaceId) => {
        return contract.methods.register(interfaceId).send();
    };

    const removeInterface = async (contract, interfaceId) => {
        return contract.methods.remove(interfaceId).send();
    };

    describe('Register interface', () => {
        let erc165;

        before(async () => {
            erc165 = await deployErc165();
        });

        it('should fail if invalid interface has been provided', async () => {
            await assertRevert(
                registerInterface(erc165, '0xffffffff'),
                'ERC165: invalid interface id'
            );
        });

        it('should register interface', async () => {
            await registerInterface(erc165, '0x7f5828d0');
            const result = await erc165.methods.supportsInterface('0x7f5828d0').call();
            (result).should.be.true;
        });
    });

    describe('Remove interface', () => {
        let erc165;

        before(async () => {
            erc165 = await deployErc165();
            await registerInterface(erc165, '0x7f5828d0');
        });

        it('should remove registered interface', async () => {
            await removeInterface(erc165, '0x7f5828d0');
            const result = await erc165.methods.supportsInterface('0x7f5828d0').call();
            (result).should.be.false;
        });
    });
});

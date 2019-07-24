/**
 * This cannot be implemented in OrganizationFactory smart contract
 * due to the fact that proxy admin is the owner account of the OrganizationFactory
 * and we cannot call BaseAdminUpgradeabilityProxy from OrganizationFactory on behalf
 * of its owner.
 */
const ethjswallet = require('ethereumjs-wallet');
const HDWalletProvider = require('truffle-hdwallet-provider');
const TruffleContract = require('truffle-contract');
const Web3Accounts = require('web3-eth-accounts');
const Web3Eth = require('web3-eth');

const OrganizationFactoryMetadata = require('../build/contracts/OrganizationFactory.json');
const OrganizationMetadata = require('../build/contracts/Organization.json');
const BaseAdminUpgradeabilityProxyMetadata = require('zos-lib/build/contracts/BaseAdminUpgradeabilityProxy.json');

function getInfuraNodeAddress (networkName, projectid) {
  return `https://${networkName}.infura.io/v3/${projectid}`;
}

function getWeb3Account (provider, keyFile) {
  const accounts = new Web3Accounts(provider);
  const hdWalletProvider = new HDWalletProvider(keyFile.mnemonic, provider);
  const wallet = ethjswallet.fromPrivateKey(hdWalletProvider.wallets[hdWalletProvider.addresses[0]].getPrivateKey());
  const password = 'temp-password';
  const keystore = wallet.toV3(password);
  return accounts.decrypt(keystore, password);
}

function getContractWithProvider (metadata, provider) {
  const contract = TruffleContract(metadata);
  contract.setProvider(provider);
  return contract;
};

// we start at 1 because zero index is always zero address
async function upgradeOrganizations (provider, account, factoryAddress, newImplementationAddress, startIndex = 1, limit = 3) {
  console.log(`Running under ${account.address} account for factory on ${factoryAddress}. Setting ORG implementation to ${newImplementationAddress}.`);
  const web3Eth = new Web3Eth(provider);
  const factory = await (getContractWithProvider(OrganizationFactoryMetadata, provider)).at(factoryAddress);
  const adminProxy = getContractWithProvider(BaseAdminUpgradeabilityProxyMetadata, provider);
  const factoryOwner = await factory.owner();
  const orgLength = await factory.getCreatedOrganizationsLength();
  // 0. test that the running account is the owner of the organization factory
  if (factoryOwner !== account.address) {
    throw new Error(`Cannot work on OrganizationFactory owned by ${factoryOwner}`);
  }
  for (let index = startIndex; index < Math.min(startIndex + limit, orgLength); index++) {
    const orgAddress = await factory.createdOrganizations(index);
    // 1. filter out everything we don't need or can't to update
    if (orgAddress === '0x0000000000000000000000000000000000000000') {
      console.log(`Cannot change admin of ${orgAddress}: No code`);
      continue;
    }
    const orgProxy = await adminProxy.at(orgAddress);
    try {
      const realAdmin = await orgProxy.contract.methods.admin().call({
        from: factoryOwner,
      });
      if (realAdmin !== factoryOwner) {
        throw new Error(`Cannot work on proxy with admin ${realAdmin}`);
      }
    } catch (e) {
      console.log(`Cannot change admin of ${orgAddress}: ${e.message}`);
      continue;
    }

    // check if organization is not already upgraded
    const origImplementation = await orgProxy.contract.methods.implementation().call({
      from: factoryOwner,
    });
    console.log(`Upgrading ${orgAddress} from ${origImplementation} to ${newImplementationAddress}`);
    if (origImplementation === newImplementationAddress) {
      console.log(`  ${orgAddress} already upgraded, skipping...`);
      continue;
    }

    // 2. call upgrade on all remaining organizations
    const org = await (getContractWithProvider(OrganizationMetadata, provider)).at(orgAddress);
    const setInterfacesCall = await org.contract.methods.setInterfaces().encodeABI({
      from: factoryOwner,
    });
    const txData = await orgProxy.contract.methods.upgradeToAndCall(newImplementationAddress, setInterfacesCall);
    const txOpts = {
      nonce: web3Eth.getTransactionCount(factoryOwner),
      data: await txData.encodeABI({ from: factoryOwner }),
      from: factoryOwner,
      to: orgAddress,
      gas: await txData.estimateGas({ from: factoryOwner }),
    };

    const signedTx = await account.signTransaction(txOpts);
    // we need to wait here to not create nonce gaps
    await new Promise((resolve, reject) => {
      return web3Eth.sendSignedTransaction(signedTx.rawTransaction)
        .on('transactionHash', (hash) => {
          console.log(`  Upgrading ${orgAddress} in tx ${hash}`);
        }).on('receipt', (receipt) => {
          console.log(`  Receipt for ${orgAddress} arrived`);
          resolve(receipt);
        }).on('error', (err) => {
          reject(err);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  // 3. report next starting index
  if (orgLength >= startIndex + limit) {
    console.log(`Next starting index should be ${startIndex + limit}`);
  }
}

module.exports = {
  upgradeOrganizations,
};

if (require.main === module) {
  (async () => {
    try {
      const keyFile = require('../keys.json');
      const provider = getInfuraNodeAddress('ropsten', keyFile.infura_projectid); // 'http://localhost:8545';
      await upgradeOrganizations(
        provider, // web3 provider
        getWeb3Account(provider, keyFile), // web3 account
        '0x78D1548E03660093B51159De0E615ea8F6B9eaF9', // factory address
        '0x1AF488913899D05293a678dc84a7096aE4F1b316', // new implementation address
        1, // starting index in createdOrganizations in factory
        1 // how many organizations should be upgraded
      );
      process.exit(0);
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  })();
}

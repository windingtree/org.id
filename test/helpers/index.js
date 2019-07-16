const TruffleContract = require('truffle-contract');
const Web3 = require('web3');
const LifTokenTest = require('@windingtree/lif-token/build/contracts/LifTokenTest.json');
const ENS = require('@ensdomains/ens/build/contracts/ENSRegistry.json');
const PublicResolver = require('@ensdomains/resolver/build/contracts/PublicResolver.json');
const TestRegistrar = require('@ensdomains/ens/build/contracts/TestRegistrar.json');
const namehash = require('eth-ens-namehash');

const misc = require('./misc');

const provider = new Web3.providers.HttpProvider(`http://localhost:${process.env.SOLIDITY_COVERAGE ? 8555 : 8545}`);
const web3 = new Web3(provider);

function getContractWithProvider (metadata) {
  const contract = TruffleContract(metadata);
  contract.setProvider(provider);
  return contract;
};

async function deployEnsRegistry () {
  const ensContract = getContractWithProvider(ENS);
  const accounts = await web3.eth.getAccounts();
  const ens = await ensContract.new({
    from: accounts[0],
    gas: 4700000,
  });
  return ens;
};

async function setupEnsRegistry (ensContract, tokenContract) {
  const resolverContract = getContractWithProvider(PublicResolver);
  const registrarContract = getContractWithProvider(TestRegistrar);
  const accounts = await web3.eth.getAccounts();
  const txOptions = {
    from: accounts[0],
    gas: 4700000,
  };

  const publicResolver = await resolverContract.new(ensContract.address, txOptions);
  await ensContract.setSubnodeOwner('0x0', web3.utils.sha3('eth'), accounts[0], txOptions);
  await ensContract.setResolver(namehash.hash('eth'), publicResolver.address, txOptions);
  const testRegistrar = await registrarContract.new(ensContract.address, namehash.hash('eth'), {
    from: accounts[0],
    gas: 4700000,
  });
  await ensContract.setSubnodeOwner('0x0', web3.utils.sha3('eth'), testRegistrar.address, txOptions);
  await testRegistrar.register(web3.utils.sha3('windingtree'), accounts[0], txOptions);
  await ensContract.setSubnodeOwner(namehash.hash('windingtree.eth'), web3.utils.sha3('token'), accounts[0], txOptions);
  await ensContract.setResolver(namehash.hash('token.windingtree.eth'), publicResolver.address, txOptions);
  await publicResolver.setAddr(namehash.hash('token.windingtree.eth'), tokenContract.address, txOptions);
};

async function deployLifToken () {
  const accounts = await web3.eth.getAccounts();
  const contract = getContractWithProvider(LifTokenTest);
  const tokenContract = await contract.new({
    from: accounts[0],
    gas: 6000000,
  });

  return tokenContract;
};

async function getOrganizationInfo (wtOrganization) {
  // Airline Info
  const orgJsonUri = await wtOrganization.methods.getOrgJsonUri().call();
  const owner = await wtOrganization.methods.owner().call();

  return {
    orgJsonUri: misc.isZeroString(orgJsonUri) ? null : orgJsonUri,
    owner: misc.isZeroAddress(owner) ? null : owner,
  };
}

module.exports = {
  // Hotel
  getOrganizationInfo,

  // Misc
  zeroAddress: misc.zeroAddress,
  isZeroAddress: misc.isZeroAddress,
  isInvalidOpcodeEx: misc.isInvalidOpcodeEx,
  filterZeroAddresses: misc.filterZeroAddresses,
  jsArrayFromSolidityArray: misc.jsArrayFromSolidityArray,
  promisify: misc.promisify,
  determineAddress: misc.determineAddress,
  deployLifToken,
  deployEnsRegistry,
  setupEnsRegistry,
};

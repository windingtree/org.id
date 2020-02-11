const TruffleContract = require('truffle-contract');
const Web3 = require('web3');
const LifTokenTest = require('@windingtree/lif-token/build/contracts/LifTokenTest.json');

const misc = require('./misc');

const provider = new Web3.providers.HttpProvider(`http://localhost:${process.env.SOLIDITY_COVERAGE ? 8555 : 8545}`);
const web3 = new Web3(provider);

function getContractWithProvider (metadata) {
  const contract = TruffleContract(metadata);
  contract.setProvider(provider);
  return contract;
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
  const orgJsonHash = await wtOrganization.methods.getOrgJsonHash().call();
  const owner = await wtOrganization.methods.owner().call();
  return {
    orgJsonUri: misc.isZeroString(orgJsonUri) ? null : orgJsonUri,
    orgJsonHash: misc.isZeroBytes(orgJsonHash) ? null : orgJsonHash,
    owner: misc.isZeroAddress(owner) ? null : owner,
  };
}

module.exports = {
  // Hotel
  getOrganizationInfo,

  // Misc
  zeroAddress: misc.zeroAddress,
  notExistedAddress: misc.notExistedAddress,
  isZeroAddress: misc.isZeroAddress,
  isInvalidOpcodeEx: misc.isInvalidOpcodeEx,
  filterZeroAddresses: misc.filterZeroAddresses,
  jsArrayFromSolidityArray: misc.jsArrayFromSolidityArray,
  promisify: misc.promisify,
  determineAddress: misc.determineAddress,
  deployLifToken
};

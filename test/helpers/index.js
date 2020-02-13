const TruffleContract = require('@truffle/contract');
const Web3 = require('web3');
const misc = require('./misc');

const provider = new Web3.providers.HttpProvider(
    `http://localhost:${process.env.SOLIDITY_COVERAGE ? 8555 : 8545}`
);

/**
 * Create contract instance with provider
 * @param {Object} metadata Contract ABI schema
 * @returns {Object}
 */
const getContractWithProvider = (metadata) => {
    const contract = TruffleContract(metadata);
    contract.setProvider(provider);
    return contract;
};

/**
 * Get organization info from the contract
 * @param {Object} wtOrganization Organization instance
 * @returns {Promise<{Object}>}
 */
const getOrganizationInfo = async (wtOrganization) => {
    // Airline Info
    const orgJsonUri = await wtOrganization.methods.getOrgJsonUri().call();
    const orgJsonHash = await wtOrganization.methods.getOrgJsonHash().call();
    const owner = await wtOrganization.methods.owner().call();
    return {
        orgJsonUri: misc.isZeroString(orgJsonUri) ? null : orgJsonUri,
        orgJsonHash: misc.isZeroBytes(orgJsonHash) ? null : orgJsonHash,
        owner: misc.isZeroAddress(owner) ? null : owner,
    };
};

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
    getContractWithProvider
};

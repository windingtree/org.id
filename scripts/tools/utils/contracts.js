const contract = require('@truffle/contract');

/**
 * Create contract instance from the ABI schema
 * @param {Object} schema
 * @returns {Object}
 */
module.exports.createContract = schema => {
    const instance = contract(schema);
    instance.setProvider(web3.currentProvider);
    return instance;
};

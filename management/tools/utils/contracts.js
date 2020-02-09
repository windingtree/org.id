const contract = require('@truffle/contract');

module.exports.createContract = schema => {
    const instance = contract(schema);
    instance.setProvider(web3.currentProvider);
    return instance;
};
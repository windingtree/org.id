const OrgIdContract = require('./artifacts/contracts/OrgId.sol/OrgId.json');
const OrgIdContractInterface = require('./artifacts/contracts/IOrgIdRegistry.sol/IOrgIdRegistry.json');

module.exports = {
    OrgIdContract: OrgIdContract,
    OrgIdAbi: OrgIdContract.abi,
    OrgIdContractInterface: OrgIdContractInterface
};

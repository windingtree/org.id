
const OrgIdContract = require('./build/contracts/OrgId.json');
const OrgIdInterfaceContract = require('./build/contracts/OrgIdInterface.json');
const mainConfig = require('./.openzeppelin/main-OrgId.json');
const ropstenConfig = require('./.openzeppelin/ropsten-OrgId.json');
const v115Config = require('./.openzeppelin/v115-ropsten-OrgId.json');

module.exports = {
    OrgIdContract: OrgIdContract,
    OrgIdInterfaceContract: OrgIdInterfaceContract,
    addresses: {
        main: mainConfig.contract.proxy,
        ropsten: ropstenConfig.contract.proxy,
        v115: v115Config.contract.proxy,
    }
};


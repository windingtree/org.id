const ganache = require('ganache-cli');

module.exports = {
    skipFiles: [
        'test',
        'OrgIdInterface'
    ],
    client: ganache,
    providerOptions: {
        'port': 8555,
        'total_accounts': 20,
        'default_balance_ether': 1000000,
        'gasPrice': '0x77359400', //2 gwei
        'gasLimit': '0x7a1200' //8000000 like in the Ropsten
    }
};

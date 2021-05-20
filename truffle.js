const HDWalletProvider = require('@truffle/hdwallet-provider');

// Netowrk configuration factory
const getInfuraConfig = (networkName, networkId) => {
    var keys = {};

    try {
        keys = require('./keys2.json');

        if (keys.MYTHX_API_KEY) {
            process.env.MYTHX_API_KEY = keys.MYTHX_API_KEY;
        }
    } catch (err) {
        console.log('could not find keys');
    }

    return {
        network_id: networkId, // eslint-disable-line camelcase
        provider: () => {
            return new HDWalletProvider(
                keys.keys,
                `https://${networkName}.infura.io/v3/` + keys.infura_projectid,
                0,
                10
            );
        },
        gas: 4000000,
        gasPrice: 70000000000
    };
};

module.exports = {
    plugins: [
        'solidity-coverage',
        'truffle-plugin-verify'
    ],

    api_keys: {
        etherscan: ''
    },

    networks: {
        development: {
            host: 'localhost',
            port: 8545,
            network_id: '*', // eslint-disable-line camelcase
            gas: 8000000,
            gasPrice: 80000000000
        },
        main: getInfuraConfig('mainnet', 1),
        ropsten: getInfuraConfig('ropsten', 3)
    },

    compilers: {
        solc: {
            version: '0.5.17',
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200
                }
            }
        }
    }
};

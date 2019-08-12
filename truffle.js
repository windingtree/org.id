require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
      gas: 0xfffffffffff,
      gasPrice: 0x01
    },
    coverage: {
      host: "localhost",
      network_id: "*",
      port: 8555,
      gas: 0xfffffffffff,
      gasPrice: 0x01
    },
    mainnet: getInfuraConfig('mainnet', 1),
    ropsten: getInfuraConfig('ropsten', 3)
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  compilers: {
    solc: {
      version: "0.5.6"
    }
  }
};

function getInfuraConfig (networkName, networkId) {
  var HDWalletProvider = require('truffle-hdwallet-provider')
  var keys = {}
  try {
    keys = require('./keys.json')
  } catch (err) {
    console.log('could not find ./keys.json')
  }

  return {
    network_id: networkId,
    provider: () => {
      return new HDWalletProvider(keys.mnemonic, `https://${networkName}.infura.io/v3/` + keys.infura_projectid, 0, 10)
    },
    gas: 4600000,
    gasPrice: 10000000000
  }
}

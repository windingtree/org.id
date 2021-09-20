import type { HardhatUserConfig } from 'hardhat/types';

import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import "@nomiclabs/hardhat-etherscan";
import "@eth-optimism/hardhat-ovm";
import '@openzeppelin/hardhat-upgrades';
import '@typechain/hardhat';
import 'solidity-coverage';
import './scripts/tasks';

export interface CustomHardhatConfig extends HardhatUserConfig {
  etherscan: {
    apiKey: string;
  }
}

let customNetworksConfig = {};

if (process.env.NETWORK_RPC_URL && process.env.ACCOUNT_KEY) {
  customNetworksConfig = {
    optimismKovan: {
      url: 'https://kovan.optimism.io',
      accounts: [
        process.env.ACCOUNT_KEY as string
      ],
      gasPrice: 'auto',
      ovm: true
    },
    ropsten: {
      url: process.env.NETWORK_RPC_URL,
      accounts: [
        process.env.ACCOUNT_KEY as string
      ]
    },
    rinkeby: {
      url: process.env.NETWORK_RPC_URL,
      accounts: [
        process.env.ACCOUNT_KEY as string
      ],
      gasPrice: 'auto',
    },
  };
}

// Hardhat config
const config: CustomHardhatConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.7',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  ovm: {
    solcVersion: '0.8.7',
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      "chainId": 1337,
      "initialBaseFeePerGas": 0
    },
    optimismLocalhost: {
      url: 'http://127.0.0.1:8545',
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk'
      },
      ovm: true
    },
    ...customNetworksConfig
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY as string
  } ,
  mocha: {
    timeout: 20000
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
    alwaysGenerateOverloads: true,
  }
};

export default config;

import type { NetworkUserConfig, HardhatUserConfig } from 'hardhat/types';

import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import "@nomiclabs/hardhat-etherscan";
import "@eth-optimism/hardhat-ovm";
import '@openzeppelin/hardhat-upgrades';
import '@typechain/hardhat';
import 'hardhat-contract-sizer';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import './scripts/tasks';

export interface CustomHardhatConfig extends HardhatUserConfig {
  etherscan: {
    apiKey: string;
  }
}

export interface CustomNetworksConfig {
  [networkName: string]: NetworkUserConfig;
}

let customNetworksConfig: CustomNetworksConfig = {};

if (process.env.NETWORK_RPC_URL && process.env.ACCOUNT_KEY) {
  customNetworksConfig = {
    localhost: {
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk'
      },
      hardfork: 'london'
    },
    optKovan: {
      url: process.env.NETWORK_RPC_URL,
      accounts: [
        process.env.ACCOUNT_KEY as string
      ],
      gasPrice: 15000000,
      ovm: true
    },
    arbRinkeby: {
      url: process.env.NETWORK_RPC_URL,
      accounts: [
        process.env.ACCOUNT_KEY as string
      ],
      gasPrice: 'auto',
    },
    ropsten: {
      url: process.env.NETWORK_RPC_URL,
      accounts: [
        process.env.ACCOUNT_KEY as string
      ],
      gasPrice: 'auto',
    },
    rinkeby: {
      url: process.env.NETWORK_RPC_URL,
      accounts: [
        process.env.ACCOUNT_KEY as string
      ],
      gasPrice: 'auto',
    },
    optMainnet: {
      url: process.env.NETWORK_RPC_URL,
      accounts: [
        process.env.ACCOUNT_KEY as string
      ],
      gasPrice: 'auto',
    },
    arbMainnet: {
      url: process.env.NETWORK_RPC_URL,
      accounts: [
        process.env.ACCOUNT_KEY as string
      ],
      gasPrice: 'auto',
    },
    goerli: {
      url: process.env.NETWORK_RPC_URL,
      accounts: [
        process.env.ACCOUNT_KEY as string
      ],
      gasPrice: 'auto',
    },
    sokol: {
      url: process.env.NETWORK_RPC_URL,
      accounts: [
        process.env.ACCOUNT_KEY as string
      ],
      gasPrice: 40000000000,
    },
    gnosis: {
      url: process.env.NETWORK_RPC_URL,
      accounts: [
        process.env.ACCOUNT_KEY as string
      ],
      gasPrice: 'auto',
    },
    polygon: {
      url: process.env.NETWORK_RPC_URL,
      accounts: [
        process.env.ACCOUNT_KEY as string
      ],
      gasPrice: 'auto',
    }
  };
}

// Hardhat config
const config: CustomHardhatConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.17',
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
    solcVersion: '0.8.17',
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 1337,
      initialBaseFeePerGas: 0
    },
    optLocalhost: {
      url: 'http://127.0.0.1:8545',
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk'
      },
      ovm: true
    },
    arbLocalhost: {
      url: 'http://127.0.0.1:7545',
      accounts: {
        mnemonic: 'jar deny prosper gasp flush glass core corn alarm treat leg smart'
      },
      gasPrice: 0
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
    outDir: 'types',
    target: 'ethers-v5',
    alwaysGenerateOverloads: true,
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true
  },
  gasReporter: {
    enabled: (process.env.REPORT_GAS) ? true : false,
    currency: 'USD',
    coinmarketcap: process.env.COIN_MARKET_CAP_KEY,
    gasPrice: 100
  }
};

export default config;

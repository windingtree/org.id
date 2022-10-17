[![Build Status](https://travis-ci.org/windingtree/org.id.svg?branch=master)](https://travis-ci.org/windingtree/org.id)
[![Coverage Status](https://coveralls.io/repos/github/windingtree/org.id/badge.svg?branch=orgid-nft)](https://coveralls.io/github/windingtree/org.id?branch=orgid-nft&v=3.0)

# ORGiD smart contract

## Documentation

- [ORGiD smart contract documentation](docs/index.md)
- [ORGiD SDK documentation](https://windingtree.github.io/org.id-sdk/)

## Deployments

- Gnosis Chain (100): [0xb63d48e9d1e51305a17F4d95aCa3637BBC181b44](https://blockscout.com/xdai/mainnet/address/0xb63d48e9d1e51305a17F4d95aCa3637BBC181b44/read-proxy#address-tabs)
- Polygon (137): [0x8a093Cb94663994d19a778c7EA9161352a434c64](https://polygonscan.com/address/0x8a093Cb94663994d19a778c7EA9161352a434c64#readProxyContract)
- Goerli (5): [0xe02dF24d8dFdd37B21690DB30F4813cf6c4D9D93](https://goerli.etherscan.io/address/0xe02dF24d8dFdd37B21690DB30F4813cf6c4D9D93#readProxyContract)
- Sokol (77): [0xDd1231c0FD9083DA42eDd2BD4f041d0a54EF7BeE](https://blockscout.com/poa/sokol/address/0xDd1231c0FD9083DA42eDd2BD4f041d0a54EF7BeE/read-proxy#address-tabs)


### Deprecated deployments

- Rinkeby (4): 0x877c5532B2a76148334CBfA32779A0b9ee414FBE
- Ropsten (3): 0x405005a015EA0E24889D6963447Bb0D646D91C83

## Setup

```bash
yarn install
```

## Compile contract

```bash
yarn compile
```

## Linting & Testing

```bash
yarn lint
yarn test
```

## Contracts size information

```bash
yarn size
```

## Maintenance

> To run the code you will need to initialize the following environment variables:

```
NETWORK_RPC_URL=https://<NETWORK_NAME>.infura.io/v3/<YOUR_INFURA_PROJECT_ID>
ACCOUNT_KEY=<PRIVATE_KEY_OF_THE_DEPLOYER_ACCOUNT>
ETHERSCAN_KEY=<YOUR_ETHERSCAN_API_KEY>
```

> It is highly recommended not to store environment variables in raw files. Instead of this, you can use our `senv` CLI tool (package: [@windingtree/secure-env-cli](https://github.com/windingtree/secure-env-cli)) that allowing to encrypt an environment file. To initialize environment using encrypted variables you will have to run the command `npx senv ./path/to/encrypted.senv "<COMMAND_OR_SCRIPT_TO_START>"`. The `senv` CLI tool will prompt you for a password and then start the command or script in the initialized environment.

> After each deployment, upgrade or transfer please commit the repository changes. This is required for the normal operation of the management scripts in future. The management scripts are saving information about the transactions sent and addresses of deployed contracts instances.

### Deployment

It is required to compile contract before the deployment.

```bash
npx hardhat --network <NETWORK_NAME> deploy
```

using `senv` tool:

```bash
npx senv ./<PATH_TO_ENCRYPTED>.senv "npx hardhat --network <NETWORK_NAME> deploy"
```

The contract instance as well as the address of the proxy contract deployed will be saved in the file:
`./openzeppelin/<NETWORK_NAME>.json`

### The proxy admin ownership transfer

This operation will be required if you want to transfer an ability to make upgrades of a token to a multisig wallet or DAO.

```bash
npx hardhat --network <NETWORK_NAME> transfer --address <ACCOUNT_ADDRESS>
```

using `senv` tool:

```bash
npx senv ./<PATH_TO_ENCRYPTED>.senv "npx hardhat --network <NETWORK_NAME> transfer --address <ACCOUNT_ADDRESS>"
```

### Upgrade

```bash
npx hardhat --network <NETWORK_NAME> upgrade --name <NAME_OF_THE_NEW_CONTRACT> --proxy <PROXY_ADDRESS_TO_UPGRADE>
```

using `senv` tool:

```bash
npx senv ./<PATH_TO_ENCRYPTED>.senv "npx hardhat --network <NETWORK_NAME> upgrade --name <NAME_OF_THE_NEW_CONTRACT> --proxy <PROXY_ADDRESS_TO_UPGRADE>"
```

### Prepare an upgrade

This operation will be required if you want to just deploy a new instance. As result, you will get an address of the deployed contract instance which can be used in the multisig wallet or DAO for initialization of an upgrade.

```bash
npx hardhat --network <NETWORK_NAME> prepare --name <NAME_OF_THE_NEW_CONTRACT> --proxy <PROXY_ADDRESS_TO_UPGRADE>
```

using `senv` tool:

```bash
npx senv ./<PATH_TO_ENCRYPTED>.senv "npx hardhat --network <NETWORK_NAME> prepare --name <NAME_OF_THE_NEW_CONTRACT> --proxy <PROXY_ADDRESS_TO_UPGRADE>"
```

A result will look like:

```text
ORGiD instance deployed at: 0x8626f6940E2...F49B2d1F2C9C1199
```

### Etherscan verification

```bash
npx senv ./<PATH_TO_ENCRYPTED>.senv "npx hardhat verify --network <NETWORK_NAME> <CONTRACT_ADDRESS_TO_VERIFY>"
```

## L2 Chains

### Optimism

> Before testing you must setup an Optimism Ethereum node according to [these guidelines](./OPTIMISM.md)

> Currently, testing and deployment with Optimism is not supported because of OVM solidity compiler version limitations.
> We expecting that [in the middle of Oct 2021 version 0.8.7 will be supported by OVM](https://community.optimism.io/docs/developers/l2/future.html)

```bash
yarn node:opt
yarn test:opt
```

Before the deployment to the Optimism Mainnet the contract must be approved by the Optimism team via [this form](https://docs.google.com/forms/d/e/1FAIpQLSdKyXpXY1C4caWD3baQBK1dPjEboOJ9dpj9flc-ursqq8KU0w/viewform)

### Arbitrum

The ORGiD contract is deployable to the Arbitrum Testnet and Mainnet in the same way as described for the Ethereum network with same compiler parameters.


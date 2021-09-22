[![Build Status](https://travis-ci.org/windingtree/org.id.svg?branch=master)](https://travis-ci.org/windingtree/org.id)
[![Coverage Status](https://coveralls.io/repos/github/windingtree/org.id/badge.svg?branch=orgid-nft)](https://coveralls.io/github/windingtree/org.id?branch=orgid-nft&v=3.0)

## ORGiD Registry

ORGiD Registry is the core smart contract of the [ORGiD Ecosystem](https://orgid.tech). It is a database of all organizations and their organizational units. Its interface allows to retrieve information about all and any organization or unit, as well as create and change them.

### Supported interfaces

ORGiD is ERC165 compatible smart contract that supports the following interfaces:

- ERC165 interface: `0x01ffc9a7`
- ORGiD interface: `0xd9d4c2b6`
- ERC721Metadata interface: `0x5b5e139f`
- ERC721 interface: `0x80ac58cd`
- ERC721Enumerable interface: `0x780e9d63`

## Management

> To run the code you will need to initialize the following environment variables:

```
NETWORK_RPC_URL=https://<NETWORK_NAME>.infura.io/v3/<YOUR_INFURA_PROJECT_ID>
ACCOUNT_KEY=<PRIVATE_KEY_OF_THE_DEPLOYER_ACCOUNT>
ETHERSCAN_KEY=<YOUR_ETHERSCAN_API_KEY>
```

> It is highly recommended not to store environment variables in raw files. Instead of this, you can use our `senv` CLI tool (package: [@windingtree/secure-env-cli](https://github.com/windingtree/secure-env-cli)) that allowing to encrypt an environment file. To initialize environment using encrypted variables you will have to run the command `npx senv ./path/to/encrypted.senv "<COMMAND_OR_SCRIPT_TO_START>"`. The `senv` CLI tool will prompt you for a password and then start the command or script in the initialized environment.

> After each deployment, upgrade or transfer please commit the repository changes. This is required for the normal operation of the management scripts in future. The management scripts are saving information about the transactions sent and addresses of deployed contracts instances.

### Compile contract

```bash
yarn compile
```

### Linting & Testing

```bash
yarn lint
yarn test
```

### Testing on the OPtimism Ethereum node

> Before testing you must setup an Optimism Ethereum node according to [these guidelines](./OPTIMISM.md)

```bash
yarn node:opt
yarn test:opt
```

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

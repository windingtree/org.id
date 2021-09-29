[![Build Status](https://travis-ci.org/windingtree/org.id.svg?branch=master)](https://travis-ci.org/windingtree/org.id)
[![Coverage Status](https://coveralls.io/repos/github/windingtree/org.id/badge.svg?branch=orgid-nft)](https://coveralls.io/github/windingtree/org.id?branch=orgid-nft&v=3.0)

# ORGiD Registry

**OrgId** is the core smart contract of the ORGiD protocol. It is a decentralized registry of unique identifiers used for the creation and managing of network-specific [DID](https://www.w3.org/TR/did-core)s'. The main idea of the ORGiD protocol is providing of the providing a Self Sovereign Identity (SSI) for every organization or person.

The ORGiD smart contract supports [ERC721](https://eips.ethereum.org/EIPS/eip-721) interface, so every entity represented by the unique Id is recognizable as NFT.

## Identifier metadata

Every identifier is represented by the following metadata:

- `tokenId` - NFT Id, a unique entity index, integer number which enumeration starts from the `1`;
- `orgId` - unique organization hash;
- `owner` - an entity owner, the Ethereum address that has exceptional right to manage metadata changes and transfer ownership of the identifier;
- `orgJsonUri` - HTTP or IPFS/IPNS link to an off-chain JSON file with data related to identifier composed in accordance to [ORG.JSON schema](https://github.com/windingtree/org.json-schema).

## ORGiD contract metadata (ERC721)

- `name` - NFT name is `ORGiD`
- `symbol` - NFT symbol is `ORGiD`
- `tokenURI` - link to a NFT metadata, the same as `orgJsonUri`

# ORGiD contract core features

## Identifier creation

A function `createOrgId(bytes32,string)` is allowing to create an unique identifier in predictable way.

> The identifier is generating as a keccak256 hash of Ethereum address of the function caller and of a unique bytes32 hash salt that generated (off-chain).

The function caller is able to reproduce the generation algorithm off-chain before the function will be called.

During the `orgId` creation, also the `tokenId` is assigning that is the next-available token Id in the storage. These two unique identifiers are cross-referenced in the contract storage.

Requirements:

- `orgJsonUri` parameter cannot be empty string;
- `salt` parameter cannot be used twice by the same function caller.

## Identifiers lookup

Identifiers can be looked up by these functions:

- `getOrgIds()` getting of the complete list of all registered `orgId`'s
- `getOrgIds(uint256,uint256)` getting of paginated list of `orgId`'s
- `getTokenId(bytes32)` getting of the `tokenId` by given `orgId`
- `getOrgId(uint256)` getting of the whole metadata set by given `tokenId`

The ORGiD metadata set that returns `getOrgId(uint256)` consists of:

- `exists` boolean flag (helper) of an `orgId` existence
- `orgId` unique organization hash
- `orgJsonUri` link to off-chain JSON data file
- `owner` an owner Ethereum address

## `orgJsonUri` update

A function `setOrgJson(bytes32,string)` allows to change a value of the `orgJsonUri` linked to the `orgId`.

Requirements:

- `orgId` must exists
- `orgJson` must not be empty string
- Function must be called by the ORGiD owner

## Ownership management

An ownership management in the smart contract is represented by the set functions that is a part of the ERC721 interface that imported from the [OpenZeppelins' implementation](https://docs.openzeppelin.com/contracts/4.x/erc721).

- `approve(address,uint256)` gives permission to `to` to transfer `tokenId` token to another account
- `getApproved(uint256)` returns the account approved for `tokenId` token
- `setApprovalForAll(address,bool)` approve or remove `operator` as an operator for the caller.
- `isApprovedForAll(address,address)` Returns if the `operator` is allowed to manage all of the assets of `owner`.
- `safeTransferFrom(address,address,uint256)` Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients are aware of the ERC721 protocol to prevent tokens from being forever locked.
- `transferFrom(address,address,uint256)` Transfers `tokenId` token from `from` to `to`.

## Supported interfaces (ERC165)

ORGiD is ERC165 compatible smart contract that supports the following interfaces that can be verified by calling the `supportsInterface(bytes4)` function:

- ERC165 interface: `0x01ffc9a7`
- ORGiD interface: `0x8bf1ed02`
- ERC721Metadata interface: `0x5b5e139f`
- ERC721 interface: `0x80ac58cd`
- ERC721Enumerable interface: `0x780e9d63`

# Development

> To run the code you will need to initialize the following environment variables:

```
NETWORK_RPC_URL=https://<NETWORK_NAME>.infura.io/v3/<YOUR_INFURA_PROJECT_ID>
ACCOUNT_KEY=<PRIVATE_KEY_OF_THE_DEPLOYER_ACCOUNT>
ETHERSCAN_KEY=<YOUR_ETHERSCAN_API_KEY>
```

> It is highly recommended not to store environment variables in raw files. Instead of this, you can use our `senv` CLI tool (package: [@windingtree/secure-env-cli](https://github.com/windingtree/secure-env-cli)) that allowing to encrypt an environment file. To initialize environment using encrypted variables you will have to run the command `npx senv ./path/to/encrypted.senv "<COMMAND_OR_SCRIPT_TO_START>"`. The `senv` CLI tool will prompt you for a password and then start the command or script in the initialized environment.

> After each deployment, upgrade or transfer please commit the repository changes. This is required for the normal operation of the management scripts in future. The management scripts are saving information about the transactions sent and addresses of deployed contracts instances.

## Compile contract

```bash
yarn compile
```

## Contracts size information

```bash
yarn size
```

## Linting & Testing

```bash
yarn lint
yarn test
```

## Deployment

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

## The proxy admin ownership transfer

This operation will be required if you want to transfer an ability to make upgrades of a token to a multisig wallet or DAO.

```bash
npx hardhat --network <NETWORK_NAME> transfer --address <ACCOUNT_ADDRESS>
```

using `senv` tool:

```bash
npx senv ./<PATH_TO_ENCRYPTED>.senv "npx hardhat --network <NETWORK_NAME> transfer --address <ACCOUNT_ADDRESS>"
```

## Upgrade

```bash
npx hardhat --network <NETWORK_NAME> upgrade --name <NAME_OF_THE_NEW_CONTRACT> --proxy <PROXY_ADDRESS_TO_UPGRADE>
```

using `senv` tool:

```bash
npx senv ./<PATH_TO_ENCRYPTED>.senv "npx hardhat --network <NETWORK_NAME> upgrade --name <NAME_OF_THE_NEW_CONTRACT> --proxy <PROXY_ADDRESS_TO_UPGRADE>"
```

## Prepare an upgrade

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

## Etherscan verification

```bash
npx senv ./<PATH_TO_ENCRYPTED>.senv "npx hardhat verify --network <NETWORK_NAME> <CONTRACT_ADDRESS_TO_VERIFY>"
```

# L2 Chains

## Optimism

> Before testing you must setup an Optimism Ethereum node according to [these guidelines](./OPTIMISM.md)

> Currently, testing and deployment with Optimism is not supported because of OVM solidity compiler version limitations.
> We expecting that [in the middle of Oct 2021 version 0.8.7 will be supported by OVM](https://community.optimism.io/docs/developers/l2/future.html)

```bash
yarn node:opt
yarn test:opt
```

Before the deployment to the Optimism Mainnet the contract must be approved by the Optimism team via [this form](https://docs.google.com/forms/d/e/1FAIpQLSdKyXpXY1C4caWD3baQBK1dPjEboOJ9dpj9flc-ursqq8KU0w/viewform)

## Arbitrum

The ORGiD contract is deployable to the Arbitrum Testnet and Mainnet in the same way as described for the Ethereum network with same compiler parameters.


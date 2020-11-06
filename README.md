[![Build Status](https://travis-ci.org/windingtree/org.id.svg?branch=master)](https://travis-ci.org/windingtree/org.id)
[![Coverage Status](https://coveralls.io/repos/github/windingtree/org.id/badge.svg?branch=master)](https://coveralls.io/github/windingtree/org.id?branch=master&v=2.0)

<a href="https://orgid.tech"><img src="https://github.com/windingtree/branding/raw/master/org.id/svg/org.id-logo.svg" height="50" alt="ORGiD"></a>

## ORGiD Registry

ORGiD Registry is the core smart contract of the [ORGiD Ecosystem](https://orgid.tech). It is a database of all organizations and their organizational units. Its interface allows to retrieve information about all and any organization or unit, as well as create and change them.

### Mainnet

`0x6434DEC2f4548C2aA9D88E8Ff821f387be3D7F0D` [full config](./.openzeppelin/main-OrgId.json) v1.0.1

### Ropsten

`0x2cb8dCf26830B969555E04C2EDe3fc1D1BaD504E` [full config](./.openzeppelin/ropsten-OrgId.json) v1.1.0

### ORGiD Sandbox

```sh
docker run --rm -it -p 8545:8545 -p 8546:8546 -p 30303:30303 --name org.id-sandbox windingtree/org.id-sandbox
```

[ORGiD Sandbox docker container](https://hub.docker.com/r/windingtree/org.id-sandbox) is the easiest way to start developing applications for the ORGiD ecosystem.

## Usage

```sh
npm i @windingtree/org.id
```
```javascript
// ABI
const { OrgIdContract, OrgIdInterfaceContract, addresses } = require('@windingtree/org.id');
// Contract addresses
const { mainnet, ropsten } = addresses;
```

## Concept

The core idea behind ORGiD is to assign unique IDs to real world organizations (legal entities) and their individual business units. This goal is achieved via the ORGiD Registry smart contract, where we have two types of records: legal entities and units.

While "legal entity" is self-explanatory and strictly defined, the concept of the "unit" is intentionally left open to interpretation. A unit can represent a department (legal, sales, accounting), or a separate business that the legal entity operates (Acme Anvils, Acme Explosives, Acme Whistles).

There is a clear two-level hierarchy: units (second level) can't exist on their own, they must belong to a parent legal entity record (first level). Legal entity may have an unlimited number of units.

Storing data on Ethereum is impractical, therefore ORGiD Record data is stored off the chain, in specially formatted JSON files we call ORG.JSON. Each ORGiD Record must have its own ORG.JSON file, which, therefore, must either describe a legal entity or a unit (not both together). ORG.JSON integrity is ensured by storing its hash in the registry.

Each ORGiD Record has an owner (Ethereum address) that may execute all the functions exposed by the smart contract interface. Think of it as of the owner of the company or an manager that is authorized to control their company's ORGiD Record.

In case of a unit, it can also be controlled by a director, an Ethereum addresses explicitly assigned by the unit owner. Directorship must be accepted explicitly (via calling `acceptDirectorship`) or implicitly (via calling any other function available to director). Only a subset of owner functionality is available to directors. Think of this as a department director, or a store manager, who can control certain aspects of their units.

ORGiD Records are never removed from the registry, they are deactivated instead.

### Example

#### Step 1: Legal Entity Record

Acme, Inc. manager (ethereum addresss `0x111AAA`) creates a record for their company, with registry-assigned ID `0x3bEf0a`.

ID | Parent ID | Owner | Director | Directorship Accepted | ORG.JSON URI | ORG.JSON Hash |
--- | --- | --- | --- | --- | --- | ---
`0x3bEf0a` | `null` | `0x111AAA` | `0x000000` | `false` | `http://` | `0x123456`

#### Step 2: Units

`0x111AAA` may now add business units to their company: Acme Anvils, Acme Whistles, and Acme Explosives. They also specified that Acme Explosives' director will be `0x222bbb`.

ID | Parent ID | Owner | Director | Directorship Accepted | ORG.JSON URI | ORG.JSON Hash |
--- | --- | --- | --- | --- | --- | ---
`0x3bEf0a` | `null` | `0x111AAA` | `0x000000` | `false` | `http://111111` | `0x111111`
`0x0c9e31` | `0x3bEf0a` | `0x111AAA` | `0x000000` | `false` | `http://222222` | `0x222222`
`0x081600` | `0x3bEf0a` | `0x111AAA` | `0x000000` | `false` | `http://333333` | `0x333333`
`0x631D68` | `0x3bEf0a` | `0x111AAA` | `0x222bbb` | `false` | `ipfs://444444` | `0x444444`

#### Step 3: Directors

`0x111AAA` may assign or remove unit directors at any time. Every time a new director is appointed, they have to accept their role. After `0x222bbb` does that, the result is

ID | Parent ID | Owner | Director | Directorship Accepted | ORG.JSON URI | ORG.JSON Hash |
--- | --- | --- | --- | --- | --- | ---
`0x631D68` | `0x3bEf0a` | `0x111AAA` | `0x222bbb` | `true` | `ipfs://444444` | `0x444444`

#### Step 4: Changing ORG.JSON

Both owner and director may change ORG.JSON files, in which case they will have to update its hash.

ID | Parent ID | Owner | Director | Directorship Accepted | ORG.JSON URI | ORG.JSON Hash |
--- | --- | --- | --- | --- | --- | ---
`0x631D68` | `0x3bEf0a` | `0x111AAA` | `0x222bbb` | `true` | `ipfs://567890` | `0x567890`

## Interface

[Auto-generated docs](./docs/OrgId.md).

## ORGiD Record Structure

Both organization and unit records have:

| **Name** | **Type** | **Description** |
|-|-|-|
| `orgId` | `bytes32` | Unique Organization ID |
| `isActive` | `bool` | Indicates whether ORGiD is active |
| `owner` | `address` | Account (or smart contract) currently authorized to manage ORGiD |
| `orgJsonUri` | `string` | URI of a [ORG.JSON-compliant](https://github.com/windingtree/org.json-schema) datasheet ([example](https://gist.githubusercontent.com/kvakes/0f728d60add6561f18d173c01f87a5bd/raw/9ba3c6fd08c29daaff9809ffa04be09a66196900/glider.json)) |
| `orgJsonHash` | `bytes32` | ORG.JSON keccak256 hash |

Additionally, unit's ORGiD may contain:

| **Name** | **Type** | **Description** |
|-|-|-|
| `parentOrgId` | `bytes32` | Unit parent's ORGiD |
| `director` | `address` | Director may change unit's ORG.JSON and its hash |
| `isDirectorshipAccepted` | `bool` | Director must accept their role explicitly, in which case this flag is set to `true` |

## Use Cases

[Use Cases and implementations](./USECASES.md)

## Development

### Setup

```sh
npm i
npm link
```

### Test

```sh
npm run test
npm run test ./<path_to_test_file>.js
```

### Test coverage

```sh
npm run coverage
```

### Lint

```sh
npm run lint

```

## Deployment and upgrade

For for bulk deployment, upgrade and interaction with smart contracts is recommended to use [Smart contracts tools](https://github.com/windingtree/smart-contracts-tools) package.

## Contribution Guide

We welcome all contributions to the ORGiD Ecosystem. It doesn't have to be code, you may work on [documentation](https://github.com/windingtree/orgid.tech/), [branding](https://github.com/windingtree/branding), or simply participate in community discussions on our [forum](https://forum.windingtree.com) and in [Telegram](https://t.me/windingtree).

If you would like to participate in development of any of our [codebases](https://github.com/windingtree/), please try to stick to the following guidelines.

### In doubt? Create an Issue!

If you want to request a feature or report a bug, or if you're not sure how to fix something, please create an issue in a relevant GitHub repository.

### Pull Request

Let's follow the standard [Pull Request flow](https://gist.github.com/Chaser324/ce0505fbed06b947d962).

Thank you for your time and code!

## ORGiD Ecosystem

![ORGiD Ecosystem](https://raw.githubusercontent.com/windingtree/org.id/develop/assets/org.id-ecosystem.png)

- **[Winding Tree DAO](https://dao.windingtree.com)** ([repo](https://github.com/windingtree/dao)) controls ORGiD Registry smart contract and some Directories
- **[ORGiD Website](https://orgid.tech)** ([repo](https://github.com/windingtree/orgid.tech/))
- **ORGiD Registry** ([repo](https://github.com/windingtree/org.id/)) is the main smart contract, a database of organizations and their business units
- **ORG.JSON Schema** ([repo](https://github.com/windingtree/org.json-schema)) is a data format for describing organizations
- **ORGiD Resolver** ([repo](https://github.com/windingtree/org.id-resolver)) is an utility for fetching organization data in [W3C DID](https://w3c.github.io/did-core/) format
- **Arbor** ([fe](https://github.com/windingtree/arbor-frontend) [be](https://github.com/windingtree/arbor-backend)) is the application behind **[Winding Tree Marketplace](https://marketplace.windingtree.com).** It can be used to look up an ORGiD, and also to create and manage your own ORGiD.
- **[ORGiD Directories](https://marketplace.windingtree.com)** ([repo](https://github.com/windingtree/org.id-directories)) are curated lists of organizations
- **[Smart contract tools](https://github.com/windingtree/smart-contracts-tools)** ([repo](https://github.com/windingtree/smart-contracts-tools)) Tools for bulk deployment, upgrade and interaction with smart contracts
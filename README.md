<a href="https://orgid.tech"><img src="https://github.com/windingtree/branding/raw/master/org.id/svg/org.id-logo.svg" height="50px" alt="ORG.ID">

[![Build Status](https://travis-ci.org/windingtree/org.id.svg?branch=master)](https://travis-ci.org/windingtree/org.id)
[![Coverage Status](https://coveralls.io/repos/github/windingtree/org.id/badge.svg?branch=master)](https://coveralls.io/github/windingtree/org.id?branch=master&v=2.0)

# ORG.ID Ethereum Smart Contract

ORG.ID is the the core smart contract of the [ORG.ID ecosystem](https://orgid.tech). [Arbor](https://arbor.fm) is the easiest way to interact with mainnet and ropsten versions of ORG.ID.

### Mainnet

`0xC1A0A8b02351F7E3e2ebD9B5b6a80fF7cdAF93D1` [full config](./.openzeppelin/main-OrgId.json)

**Warning: ownership should be transferred to [DAO](https://github.com/windingtree/dao).**

### Ropsten

`0xc8fD300bE7e4613bCa573ad820a6F1f0b915CfcA` [full config](./.openzeppelin/ropsten-OrgId.json)

### ORG.ID Sandbox

```sh
docker run --rm -it -p 8545:8545 -p 8546:8546 -p 30303:30303 --name org.id-sandbox windingtree/org.id-sandbox
```

This official [sandbox docker container](https://hub.docker.com/r/windingtree/org.id-sandbox) is the easiest way to start developing applications for the ORG.ID ecosystem.

## Usage

```sh
npm i @windingtree/org.id
```
```javascript
// ABI
const { OrgIdContract, OrgIdInterfaceContract, addresses } = require('@windingtree/org.id');
// Contract addresses
const { mainnet, ropsten, rinkeby } = addresses;
```

## Interface

Check out the [auto-generated docs](./docs/OrgId.md).

## ORG.ID Ecosystem

![ORG.ID Ecosystem](./assets/orgid-ecosystem.png)

### ORG.ID Functionality

ORG.ID Smart Contract is a list of all organizations in the ecosystem. Its interface allows anyone to retrieve information about all and any organization, as well as create and change organizations and its organizational units.

#### What is an organization?

We use the word "organization" to emphasize that any kind of entity, commercial firm, non-profit, NGO, and even entities that aren't officially incorporated ([W3C, for example](https://www.w3.org/Consortium/facts.html)), may create an ORG.ID.

#### Organizations and organizational units

Organizations may have complicated internal structure, and even in simple cases there is hierarchy. Here's a few examples, where first level are *organizations* and second level are the *organizational units* or simply *units.*

- Best Sell, LLC
  - Best Sell Store Paris
  - Best Sell Store Berlin
  - Best Sell Store Prague
- Acme, Corp.
  - Acme Toys Department
  - Acme Guns Department
  - Acme Foods Department
  - Accounting Department
  - Legal Department

#### ORG.ID Record

Both organization and unit records have:

| **Name** | **Type** | **Description** |
|-|-|-|
| `orgId` | `address` | Unique Organization ID |
| `state` | `bool` | Indicates whether this ORG.ID is active |
| `owner` | `address` | Account (or smart contract) currently authorized to manage this ORG.ID |
| `orgJsonUri` | `string` | URI of a [ORG.JSON-compliant](https://github.com/windingtree/org.json-schema) datasheet ([example](https://gist.githubusercontent.com/kvakes/0f728d60add6561f18d173c01f87a5bd/raw/9ba3c6fd08c29daaff9809ffa04be09a66196900/glider.json)) |
| `orgJsonHash` | `bytes32` | ORG.JSON keccak256 hash |

Additionally, unit's ORG.ID may contain:

| **Name** | **Type** | **Description** |
|-|-|-|
| `parentEntity` | `address` | Unit parent's ORG.ID |
| `director` | `address` | Director may change unit's ORG.JSON and its hash |
| `directorConfirmed` | `bool` | Director must accept their role explicitly, in which case this flag is set to `true` |

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

### Linting

```sh
npm run lint

```

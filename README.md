# WT Smart Contracts

Smart contracts of the Winding Tree platform.

The smart contracts in the [hotel folder](https://github.com/windingtree/wt-contracts/tree/master/contracts/hotel) are designed to upload inventory and interact with it in the WT platform.

[![Build Status](https://travis-ci.org/windingtree/wt-contracts.svg?branch=master)](https://travis-ci.org/windingtree/wt-contracts)
[![Coverage Status](https://coveralls.io/repos/github/windingtree/wt-contracts/badge.svg?branch=master)](https://coveralls.io/github/windingtree/wt-contracts?branch=master&v=2.0)

## Requirements

LTS Node 10.3.0 is required for running the tests.

## Install

```sh
git clone https://github.com/windingtree/wt-contracts
npm install
```

## Deploy

keys.json example:
```
{
  "mnemonic": SEED_PHRASE,
  "infura_apikey": API_KEY
}
```

```sh
npm run deploy-NETWORK
```

## Test

* To run all tests: `npm test`

* To run a specific test: `npm test -- test/WTHotel.js`

* To generate coverage report: `npm run coverage`

## Documentation

[Here](https://github.com/windingtree/wt-contracts/tree/master/docs)

## Deployed Implementations

[WTIndex - Ropsten](https://ropsten.etherscan.io/address/0x8a28895feec6cec757a0b8a8206125ca445f036f)

## License

Winding Tree contracts are open source and distributed under the GPL v3 license.

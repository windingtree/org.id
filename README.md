# WT Smart Contracts

Smart contracts of the Winding Tree platform.

The smart contracts in the [hotel folder](https://github.com/windingtree/wt-contracts/tree/master/contracts/hotel) are designed to upload inventory and interact with it in the WT platform.

## Requirements

Node v7.6 or higher (versions before 7.6 do not support async/await that is used in the LifToken tests)

## Install

```sh
git clone https://github.com/windingtree/wt-contracts --recursive
npm install
```

## Test

* To run all tests: `npm test`

* To run a specific test: `npm test -- test/WTHotel.js`

* To generate coverage report: `npm run coverage`

## Documentation

[Here](https://github.com/windingtree/wt-contracts/tree/master/docs)

## License

WT-Contracts is open source and distributed under the Apache License v2.0



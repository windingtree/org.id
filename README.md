[![Build Status](https://travis-ci.org/windingtree/org.id.svg?branch=master)](https://travis-ci.org/windingtree/org.id)
[![Coverage Status](https://coveralls.io/repos/github/windingtree/org.id/badge.svg?branch=master)](https://coveralls.io/github/windingtree/org.id?branch=master&v=2.0) 

# ORG.ID Smart Contract

Smart contract of the Winding Tree ORG.ID protocol

## Initial setup  

```bash
npm i
```

## Tests

```bash
npm run test
npm run test ./<path_to_test_file>.js
``` 

## Tests coverage  

```bash
npm run coverage
``` 

## Linting

```bash
npm run lint

```

## Generated docs
[OrgId](./docs/OrgId.md)

## Contract deployment

All deployments, upgrades, transactions and calls can be hadled using our [command line tools](./management/tools/README.md): 

```bash
$ ./management/tools/index.js --network development cmd=contract name=OrgId initMethod=initialize initArgs=0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1 from=0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1
```

The result will look like:

```bash
WindingTree Command Line Interface  
Version:  0.10.0
Contract name:  OrgId
Actual version:  0.10.0
Last known version:  0.10.0
App address:  0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab
Proxy admin:  0xD833215cBcc3f914bD1C9ece3EE7BF8B14f841bb
Contract implementation:  0x9561C133DD8580860B6b7E504bC5Aa500f0f06a7
New deployment  
Contract proxy:  0x59d3631c86BbE35EF041872d502F218A39FBa150
```

Auto-generated deployment configuration will be saved on the `./openzeppelin` repository folder and will look like:

```json
{
  "version": "0.10.0",
  "contract": {
    "name": "OrgId",
    "implementation": "0x9561C133DD8580860B6b7E504bC5Aa500f0f06a7",
    "proxy": "0x59d3631c86BbE35EF041872d502F218A39FBa150"
  },
  "owner": "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
  "app": "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab",
  "proxyAdmin": "0xD833215cBcc3f914bD1C9ece3EE7BF8B14f841bb",
  "implementationDirectory": "0xCfEB869F69431e42cdB54A4F4f105C19C080A601",
  "package": "0x5b1869D9A4C187F2EAa108f3062412ecf0526b24",
  "blockNumber": 9
}
```

The filename of the configuration file is formed according to mask:   
`./[NETWORK_NAME]-[CONTRACT_NAME].json`

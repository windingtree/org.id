# ORG.ID Tools

Deployments, upgrades, and many other tasks may be performed using [orgid-tools](./management/tools/README.md).

```sh
orgid-tools --network ropsten cmd=deploy name=OrgId from=<0xCONTRACT_OWNER> initMethod=initialize initArgs=<0xCONTRACT_OWNER>
Deployment of the contract:  OrgId
Version:  1.0.0
Owner address:  <0xCONTRACT_OWNER>
Initializing method:  initialize
Initializing arguments:  [ '<0xCONTRACT_OWNER>' ]
Contract deployed at address:  <0xORGID_CONTRACT_ADDRESS>
```

Auto-generated deployment configuration will be saved in `./openzeppelin/<NETWORK_NAME>-<CONTRACT_NAME>.json`, e.g.:

```json
{
  "version": "1.0.0",
  "contract": {
    "name": "OrgId",
    "implementation": "0x67D560DCA7156ae683AE533313e231AC50bd3CC5",
    "proxy": "0x595815C6E25268073cb7b5D8D9b23e62F7EdABcb"
  },
  "owner": "0xA0B74BFE28223c9e08d6DBFa74B5bf4Da763f959",
  "proxyAdmin": "0x7C29c5B93ccbA63DBB0eDAA7D8676465051F0996",
  "blockNumber": 8159389
}
```

## Contract upgrade

In order to upgrade the contract, the above configuration file must be present in `.openzeppelin` directory, and contract `version` must differ from previously deployed.

```sh
orgid-tools --network ropsten cmd=upgrade name=OrgId from=<0xCONTRACT_OWNER> initMethod=setInterfaces
Upgrading of the contract:  OrgId
Version:  1.0.0
Owner address:  <0xCONTRACT_OWNER>
Initializing method:  setInterfaces
Contract upgraded at address:  0xc8fD300bE7e4613bCa573ad820a6F1f0b915CfcA
```

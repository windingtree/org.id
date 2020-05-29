# ORG.ID Tools

Deployments, upgrades, and many other tasks may be performed using [orgid-tools](./management/tools/README.md).

```sh
orgid-tools --network ropsten cmd=deploy name=OrgId from=<0xCONTRACT_OWNER> initMethod=initialize initArgs=<0xCONTRACT_OWNER>
Deployment of the contract:  OrgId
Version:  0.11.4
Owner address:  <0xCONTRACT_OWNER>
Initializing method:  initialize
Initializing arguments:  [ '<0xCONTRACT_OWNER>' ]
Contract deployed at address:  <0xORGID_CONTRACT_ADDRESS>
```

Auto-generated deployment configuration will be saved in `./openzeppelin/<NETWORK_NAME>-<CONTRACT_NAME>.json`, e.g.:

```json
{
  "version": "0.11.4",
  "contract": {
    "name": "OrgId",
    "implementation": "0xd863861E680B4C881A91fC92C36bAB1d09F8cd3A",
    "proxy": "0xc8fD300bE7e4613bCa573ad820a6F1f0b915CfcA"
  },
  "owner": "<0xCONTRACT_OWNER>",
  "proxyAdmin": null,
  "blockNumber": 7455603
}
```

## Contract upgrade

In order to upgrade the contract, the above configuration file must be present in `.openzeppelin` directory, and contract `version` must differ from previously deployed.

```sh
orgid-tools --network ropsten cmd=upgrade name=OrgId from=<0xCONTRACT_OWNER> initMethod=setInterfaces
Upgrading of the contract:  OrgId
Version:  0.11.5
Owner address:  <0xCONTRACT_OWNER>
Initializing method:  setInterfaces
Contract upgraded at address:  0xc8fD300bE7e4613bCa573ad820a6F1f0b915CfcA
```

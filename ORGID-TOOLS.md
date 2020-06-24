# ORGiD Tools

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
  "version": "1.0.1",
  "contract": {
    "name": "OrgId",
    "implementation": "0xd83b0E72616D00649D22Da7B49718fd3264837Bc",
    "proxy": "0x2cb8dCf26830B969555E04C2EDe3fc1D1BaD504E"
  },
  "owner": "0xA0B74BFE28223c9e08d6DBFa74B5bf4Da763f959",
  "proxyAdmin": "0x77941f25B85Ab5e299285C173475572a1B21518E",
  "blockNumber": 8160736
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

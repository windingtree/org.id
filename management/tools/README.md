# WindingTree Contracts Management CLI tools
This CLI is dedicated to the deployment of the new contracts instances, managing upgrades, sending transactions and calling of the contracts functions.  

> All commands are require proper network configuration in the `truffle.js` file

## Commands    
  - [version](#version)
  - [makehash](#makehash)
  - [contract](#contract)
  - [tx](#tx)
  - [call](#call)
  - [task](#task)

Usage: `./management/index.js --network [NETWORK_NAME] cmd=[COMMAND] [PARAMETERS]`

## version

Usage: `cmd=version`

Prints the current package version.  

## makehash

Usage: `cmd=makehash [PROPERTIES]`  

Generates a hash of the given json file using keccak method from solidity. This hash should be used as ORG.ID JSON validation parameter.  

Parameters: 
- `file=[PATH_TO_JSON]`
  Relative path to the ORG.ID json file. 

## contract

Usage: `cmd=contract [PROPERTIES]`  

Manages contracts deployments and upgrades.

Parameters: 
- `name=[CONTRACT_NAME]`  
  Contract name to deploy or upgrade  
  
- `from=[SENDER_ACCOUNT_ADDRESS]`  
  Account address that should be used to signing transactions   

- `initMethod=[INITIALIZER_METHOD_NAME]`  
  Name of the contract initializer method name. Optional. Default value: "initialize"  

- `initArgs=[INITIALIZER_ARGUMENTS]`
  Initializer arguments separated by comma. Optional.  

- `upgradeMethod=[UPGRADE_INITIALIZER_METHOD_NAME]`  
  Contract upgrade method name. Optional. Will be ignored in case of initial deployment. Default value: "initialize"

- `upgradeArgs=[UPGRADE_INITIALIZER_ARGUMENTS]`  
  Initializer arguments separated by coma. Optional.  

- `upgradeProxies=[PROXIES_ADDRESSES_LIST_TO_UPGRADE]`  
  A comma-separated list of the proxies address to be upgraded (except of root contract proxy).

- `dao=[DAO_ADDRESS]`  
  Reserved parameter.

In the `initArgs` or `upgradeArgs` there are can be used special template such as `[APP]` and [PROXY_ADMIN]. These templates will be replaced with values obtained at run time by their values. `APP` and `PROXY_ADMIN` are the addresses of contracts instances from the OpenZeppelin upgradeability framework used in this solution.

As result of initial deployment of the contract will created a project confiruration file with following content:  

```json
{
  "version": "0.9.0",
  "contract": {
    "name": "Organization",
    "implementation": "0x9561C133DD8580860B6b7E504bC5Aa500f0f06a7",
    "proxy": "0x59d3631c86BbE35EF041872d502F218A39FBa150"
  },
  "owner": "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1",
  "app": "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab",
  "proxyAdmin": "0xD833215cBcc3f914bD1C9ece3EE7BF8B14f841bb",
  "implementationDirectory": "0xCfEB869F69431e42cdB54A4F4f105C19C080A601",
  "package": "0x5b1869D9A4C187F2EAa108f3062412ecf0526b24",
  "blockNumber": 9
}
```
The name of this file is forming by the following template:  
`[NETWORK_TYPE]-[CONTRACT_NAME].json`

If this file will be detected on the utility start the whole following process will go by the upgrade workflow.  

## tx

Usage: `cmd=tx [PROPERTIES]`  

Sending transactions to the contract instances. 

Properties:  
- `name=[CONTRACT_NAME]`  
  Contract name to transaction sending  
  
- `from=[SENDER_ACCOUNT_ADDRESS]`  
  Account address that should be used to signing transactions   

- `address=[CONTRACT_PROXY_ADDRESS]`  
  Address of the deployed contract (proxy) on the network

- `method=[CONTRACT_METHOD_NAME]`  
  Transaction method

- `args=[ARGUMENTS]`  
  Transactio arguments

## call

Usage: `cmd=call [PROPERTIES]`  

Sending transactions to the contract instances. 

Properties:  
- `name=[CONTRACT_NAME]`  
  Contract name  
  
- `address=[CONTRACT_PROXY_ADDRESS]`  
  Address of the deployed contract (proxy) on the network

- `method=[CONTRACT_METHOD_NAME]`  
  Contract method to call

- `args=[ARGUMENTS]`  
  Contract method arguments  

## task

Usage: `cmd=task [PROPERTIES]`  

Running the series of predefined commands

Properties:
- `file=[PATH_TO_FILE]`
  Relative path to the file that contains a configuration of the task. 

Configuration of the task it is a list of objects with options for each command. All commands are running in the common data scope. Result of each command execution is saved in this common scope and can be used by the next coming command as source for options. To use a result of the execution of the previous command is possible by using a special template for the parameter.  
For example: `[TASK:2:contract.proxy]` where:
- `2` is the order number of the command in the list, and
- `contract.proxy` a path to the property value in the resulting object

Here the example of possible task configuration:

```json
[
    {
        "command": "version"
    },
    {
        "command": "makehash",
        "parameters": {
            "file": "./assets/orgid-legal.json"
        }
    },
    {
        "command": "contract",
        "parameters": {
            "name": "Organization",
            "from": "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1",
            "initArgs": [
                "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1",
                "https://gist.githubusercontent.com/[username]/3bde88a0e8248c73c68c1aed2ca4b9be/raw/5df8c96ceff4d0fa99a32d1da63b061ad4b27ccd/ORG.ID",
                "[TASK:1:hash]",
                "[APP]",
                "[PROXY_ADMIN]",
                "0x0000000000000000000000000000000000000000",
                "0x0000000000000000000000000000000000000000"
            ]
        }
    },
    {
        "command": "makehash",
        "parameters": {
            "file": "./assets/orgid-unit.json"
        }
    },
    {
        "command": "tx",
        "parameters": {
            "name": "Organization",
            "address": "[TASK:2:contract.proxy]",
            "from": "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1",
            "method": "createSubsidiary(string,bytes32,address,string,string)",
            "args": [
                "https://gist.githubusercontent.com/[username]/3b680e83da367b68c6e84407e5f2d44/raw/569ce8f321499a8249bec31fd09f6c618bcf52cd/Subsidiary%2520ORG.ID",
                "[TASK:3:hash]",
                "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1",
                "",
                ""
            ]
        }
    }
]
```  

The explanation of this task:
- Running of `version` command
- Running `makehash` command
- Running of `contract` command. Option value `[TASK:1:hash]` will be replaced with result of running previous step
- Running `makehash` command for another file
- Running `tx` command. Option value `[TASK:2:contract.proxy]` will be replaced with the value from the result of command running on step 2  
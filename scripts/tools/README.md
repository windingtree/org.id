# WindingTree Contracts Management CLI tools
This CLI is dedicated to the deployment of the new contracts instances, managing upgrades, sending transactions and calling of the contracts functions.  

> All commands are require proper network configuration in the `truffle.js` file

## Get Starting

Before the first use of the CLI run this command  

```bash
npm link
```

## Commands    
  - [version](#version)
  - [makehash](#makehash)
  - [deploy](#deploy)
  - [upgrade](#upgrade)
  - [tx](#tx)
  - [call](#call)
  - [task](#task)

Usage: `orgid-tools --network <NETWORK_NAME> cmd=<COMMAND> <PARAMETERS>`

## version

Usage: `cmd=version`

Prints the current package version.  

## makehash

Usage: `cmd=makehash <PROPERTIES>`  

Generates a hash of the given json file using keccak method from solidity. This hash should be used as ORG.ID JSON validation parameter.  

Parameters:
- `file=<PATH_TO_JSON>`
  Relative path to the ORG.ID json file.

## deploy

Usage: `cmd=deploy <PROPERTIES>`  

Manages contracts deployments.

Parameters:
- `name=<CONTRACT_NAME>`  
  Contract name to deploy or upgrade  

- `from=<SENDER_ACCOUNT_ADDRESS>`  
  Account address that should be used to signing transactions   

- `initMethod=<INITIALIZER_METHOD_NAME>`  
  Name of the contract initializer method name. Optional. Default value: "initialize"  

- `initArgs=<INITIALIZER_ARGUMENTS>`
  Initializer arguments separated by comma. Optional.

In the `initArgs` or `upgradeArgs` there are can be used special template such as `[OWNER]` and [PROXY_ADMIN]. These templates will be replaced with values obtained at run time by their values. `OWNER` and `PROXY_ADMIN` are the addresses of contracts instances from the OpenZeppelin upgradeability framework used in this solution.

As result of initial deployment of the contract will created a project confiruration file with following content:  

```json
{
  "version": "0.11.3",
  "contract": {
    "name": "OrgId",
    "implementation": "0x11Ff015b28E0Fb1897a8D84439C7B8390aF71dA3",
    "proxy": "0xA2Fc2108FB7DFADCb637e1cd636521AeEdE8BE6c"
  },
  "owner": "0xf9fb2fac0781b6c2b57d44b1890bcaec20a1cb38",
  "proxyAdmin": "0x73eb34Fe7b24918fF8366C4d15e57887998C2747",
  "blockNumber": 18
}
```
The name of this file is forming by the following template:  
`<NETWORK_TYPE>-<CONTRACT_NAME>.json`

If this file will be detected on the utility start the whole following process will go by the upgrade workflow.  

## upgrade

Usage: `cmd=upgrade <PROPERTIES>`  

Manages contracts upgrades.

Parameters:
- `name=<CONTRACT_NAME>`  
  Contract name to deploy or upgrade  

- `from=<SENDER_ACCOUNT_ADDRESS>`  
  Account address that should be used to signing transactions   

- `initMethod=<INITIALIZER_METHOD_NAME>`  
  Name of the contract initializer method name. Optional.

- `initArgs=<INITIALIZER_ARGUMENTS>`
  Initializer arguments separated by comma. Optional.

## tx

Usage: `cmd=tx <PROPERTIES>`  

Sending transactions to the contract instances.

Properties:  
- `name=<CONTRACT_NAME>`  
  Contract name to transaction sending  

- `from=<SENDER_ACCOUNT_ADDRESS>`  
  Account address that should be used to signing transactions   

- `address=<CONTRACT_PROXY_ADDRESS>`  
  Address of the deployed contract (proxy) on the network

- `method=<CONTRACT_METHOD_NAME>`  
  Transaction method

- `args=<ARGUMENTS>`  
  Transactio arguments

## call

Usage: `cmd=call <PROPERTIES>`  

Sending transactions to the contract instances.

Properties:  
- `name=<CONTRACT_NAME>`  
  Contract name  

- `address=<CONTRACT_PROXY_ADDRESS>`  
  Address of the deployed contract (proxy) on the network

- `method=<CONTRACT_METHOD_NAME>`  
  Contract method to call

- `args=<ARGUMENTS>`  
  Contract method arguments  

## task

Usage: `cmd=task <PROPERTIES>`  

Running the series of predefined commands

Properties:
- `file=<PATH_TO_FILE>`
  Relative path to the file that contains a configuration of the task.
- `params=FROM:<addr>,HOLDER1:<addr>,HOLDER2:<addr>`
  Parameters that can be used as in-script commands parameters replacements.

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
        "command": "deploy",
        "parameters": {
            "name": "OrgId",
            "from": "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1",
            "initMethod": "initialize",
            "initArgs": [
                "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1",
                "0x8060F19e1b19923ad4b9D54Ce64151Ed403f9168"
            ]
        }
    },
    {
        "command": "makehash",
        "parameters": {
            "file": "./assets/orgid-legal.json"
        }
    },
    {
        "command": "tx",
        "parameters": {
            "name": "OrgId",
            "address": "[TASK:2:contract.proxy]",
            "from": "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1",
            "method": "createOrganization(string,bytes32)",
            "args": [
                "https://gist.githubusercontent.com/[username]/3bde88a0e8248c73c68c1aed2ca4b9be/raw/5df8c96ceff4d0fa99a32d1da63b061ad4b27ccd/ORG.ID",
                "[TASK:2:hash]"
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
            "name": "OrgId",
            "address": "[TASK:2:contract.proxy]",
            "from": "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1",
            "method": "createUnit(bytes32,address,string,bytes32)",
            "args": [
                "0x31f5e1745a65fd8a2dd556c8b27d8d585ed184876126779e1323c6a1f06c68f0",
                "0xa284D6724Ab7D8194b0D894C74C34318c1319391",
                "https://gist.githubusercontent.com/[username]/3b680e83da367b68c6e84407e5f2d44/raw/569ce8f321499a8249bec31fd09f6c618bcf52cd/Subsidiary%2520ORG.ID",
                "[TASK:4:hash]"
            ]
        }
    }
]
```  

The explanation of this task:
- Running of `version` command
- Running of `deploy` command. Initial OrgId deployment
- Running `makehash` command for file `./assets/orgid-legal.json`
- Running of `tx` command. Creation of an Organization record. The hash is obtained from previous step
- Running `makehash` command for file `./assets/orgid-unit.json`
- Running of `tx` command. Creation of a new organizational unit record. The hash is obtained from previous step

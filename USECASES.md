# ORGiD Registry User Stories

## Actors

- ORGiD Registry owner
- Owner of an organization
- Director of an organizational unit
- An external smart contract developer
- Customer of an organization

## ORGiD Registry Owner

### Deployment

In order to deploy an instance of the ORGiD Registry, we use [ORGiD Tools](scripts/tools/README.md) (based on [@openzeppelin/upgrades](https://docs.openzeppelin.com/upgrades/2.8/) library).

Deployment command

```sh
./scripts/tools/index.js --network <ethereum_network> cmd=deploy name=OrgId from=<owner_address> initMethod=initialize initArgs=<owner_address>
```

After a successful run, a configuration file will be saved in `.openzeppelin` directory. Example:


```json
{
  "version": "1.0.1",
  "contract": {
    "name": "OrgId",
    "implementation": "0x0F789cDF1f4eC9BC50b353c045C048492274Ab21",
    "proxy": "0x6434DEC2f4548C2aA9D88E8Ff821f387be3D7F0D"
  },
  "owner": "0xeAD12C6EE973E03D2d630D81eFa57F393CB9117f",
  "proxyAdmin": "0x7B9061e98bf7c42aE2131920C88A39DE933fDb6c",
  "blockNumber": 10362794
}
```

Three smart contracts are deployed as a result:

- implementation
- proxy
- proxyadmin

### As ORGiD owner, I want to upgrade it to a newer version

ORGiD uses OpenZeppelin's [proxy upgrade pattern](https://docs.openzeppelin.com/upgrades/2.8/proxies).

The easiest way to do this is via [ORGiD Tools](scripts/tools/README.md):

```sh
./scripts/tools/index.js --network <ethereum_network> cmd=upgrade name=OrgId from=<owner_address> initMethod=<initializer_function> initArgs=<initializer_function_args>
```

The existing configuration file will be overriden by the new configuration.

### As ORGiD owner, I want to transfer ORGiD control to another Ethereum address

ORGiD uses OpenZeppelin's [Ownable](https://docs.openzeppelin.com/contracts/2.x/api/ownership) as its access control mechanism.

The `transferOwnership`, which requires a single `address` parameter (the new owner's address), of the smart contract should be executed.

Upon a successful completion of the transaction, an `OwnershipTransferred` event will be emitted, and the ownership transferred.





> As ORGiD owner, I want to move smart contract upgradeability ownership to another owner

The ProxyAdmin smart contract instance which is a part of the OpenZeppelin upgradeability schema also uses known `Ownable` behaviour so for the transferring of the ProxyAdmin ownership, a current owner should send a transaction as same as described earlier.
This step is required in case of the OrgId ownership changing because of ProxyAdmin is a part which able to change proxy implementation and also should be owned by the new owner.  

## Organization owner's cases

> As an organization owner, I want to create a unique, not changeable and ownable identifier (ORGiD) which can calculated using pre-defined salt value and owner ethereum address

An ORGiD indentifier can be calculated as `keccak256(<sender_address>,<bytes32_salt>)` before it will be created and saved to the smart contract storage.   
This feature allows users to save org.json URI and hash in one transaction aside with the ORGiD creation (one transaction instead of two).  
After the ORGiD is created and saved to the OrgId smart contract storage this identifier cannot be changed. The creator of the ORGiD becomes its owner and able to change associated data, create and update organizational units and transfer ORGiD ownership.  
The sender cannot use `salt` twice for different ORGiD creation transaction because of an ORGiD must be unique. The second ORGiD creation transaction will results with failure and returns a error `OrgId: Organizarion already exists`.

For the creation of an ORGiD a transaction should be sent:

- function: `createOrganization(bytes32,bytes32,string,string,string)`
- arguments:
    - `salt - bytes32 hash`
    - `org.json keccak256 hash`
    - `org.json primary URI`
    - `org.json backup URI #1`
    - `org.json backup URI #2`

As a result of this transaction will be updated related organization's storage and the `OrganizationCreated` event will be emitted.  

> As an organization owner, I want to `save` and `change` associated with ORGiD the following information:
>  - org.json permanent URI
>  - org.json permanent backup URI #1
>  - org.json permanent backup URI #2
>  - org.json ketchak256 hash

Initially, associated information is saved during the ORGiD creation. To change this information an owner should sent a transaction:

- function: `setOrgJson(bytes32,bytes32,string,string,string)`
- arguments:
    - `ORGiD`
    - `org.json keccak256 hash`
    - `org.json primary URI`
    - `org.json backup URI #1`
    - `org.json backup URI #2`

As a result of this transaction the `OrgJsonChanged` event will be emitted.  

> As an organization owner, I want to create an organizational unit where I will be a director

This case can be implemented by the sending of the transaction:

- function: `createUnit(bytes32,bytes32,address,bytes32,string,string,string)`
- arguments:
    - `salt`
    - `parent ORGiD`
    - `parent ORGiD owner address`
    - `unit org.json primary URI`
    - `unit org.json backup URI #1`
    - `unit org.json backup URI #2`

As a result of this transaction the `UnitCreated` event will be emitted.

> As an organization owner, I want to create an organizational unit where will be a separate director

This case can be implemented by the sending of the transaction:

- function: `createUnit(bytes32,bytes32,address,bytes32,string,string,string)`
- arguments:
    - `salt`
    - `parent ORGiD`
    - `unit director address`
    - `unit org.json primary URI`
    - `unit org.json backup URI #1`
    - `unit org.json backup URI #2`

As a result of this transaction the `UnitCreated` event will be emitted.  

> As an organization owner, I want to transfer own organizational unit to the another director

This case can be implemented by the sending of the transaction (only allowed for the ORGiD owner):

- function: `transferDirectorship(bytes32,address)`
- arguments:
    - `ORGiD`
    - `new unit director address`

As a result of this transaction the `DirectorshipTransferred` event will be emitted.

> As an organization owner, I want to renounce directorship of the own organizational unit

This case can be implemented by the sending of the transaction (only allowed for the ORGiD owner and unit director as well):

- function: `renounceDirectorship(bytes32)`
- arguments:
    - `ORGiD`

As a result of this transaction an unit director will be set to zero address value (`0x0`) and the `DirectorshipTransferred` event will be emitted.  

> As an organization owner, I want to transfer ORGiD ownership to the another owner  

This case can be implemented by the sending of the transaction (only allowed for the ORGiD owner):

- function: `transferOrganizationOwnership(bytes32,address)`
- arguments:
    - `ORGiD`
    - `new organization owner address`

As a result of this transaction an ownership of ORGiD will be transferred the new owner and the `OrganizationOwnershipTransferred` event will be emitted.

> As an organization owner, I want to get a list of all own organizational units  

This case can be implemented by the calling of the public function:

- function: `getOrganizations(bool)`
- arguments:
    - `boolean flag that means: include inactive organizations`

The inactive organization is an organization with active status set to `false` value.  

> As an organization owner, I want to change active status of the own organization

This case can be implemented by the sending of the transaction:

- function: `toggleActiveState(bytes32)`
- arguments:
    - `ORGiD`

As a result of this transaction will be inverted previous active state value and the `OrganizationActiveStateChanged` event will be emitted.

> As an organization owner, I want to monitor all ORGiD changes

This case can be implemented by `listening` of the OrgId smart contracts events.
The whole list of events is:

- `OrganizationCreated`
- `UnitCreated`
- `OrganizationActiveStateChanged`
- `DirectorshipAccepted`
- `DirectorshipTransferred`
- `OrganizationOwnershipTransferred`
- `OrgJsonChanged`

## Organizational Unit director's cases

> As an organizational unit director, I want to confirm my directorship
>  - automatically by starting using of available smart-contract functions
>  - directly by sending a special transaction

Initially, a directorship acceptance status is set to `false` value. This status will be automatically changed to `true` in case of director will sends `setOrgJson(bytes32,bytes32,string,string,string)` transaction.
Also, this status can be changed by sending of the transaction (allowed for the unit director only):

- function: `acceptDirectorship(bytes32)`
- arguments:
    - `ORGiD`

An event `DirectorshipAccepted` will be emitted if directorship acceptance status will be set to the `true` value.  

> As an organizational unit director, I want to `change` associated with ORGiD the following information:
>  - org.json permanent URI
>  - org.json permanent backup URI #1
>  - org.json permanent backup URI #2
>  - org.json ketchak256 hash

> As an organizational unit director, I want to monitor all ORGiD changes

For the unit director is available all events that emitted during transactions (see the events list in the organization owner cases section).  

## External smart contract's cases

> As an external smart contract, I want to have an OrgId interface

The OrgId repository contains special contract `OrgIdInterface` which implements a standard OrgId smart contract interface.  

> As an external smart contract, I want to have an ability to validate deployed OrgId smart contract instance by its interface

The OrgId smart contact supports `ERC165` standard which allowing interfaces validataion.  
Here the whole list of interfaces that can be checked on the OrgId smart contract by the external smart contracts:  

- ERC165 interface: `0x01ffc9a7`
- Ownable interface: `0x7f5828d0`
- ORGiD interface: `0x0f4893ef`
- Hierarchy (organizational units) interface: `0x6af2fb27`

> As an external smart contract, I want to get a list of existed ORGiDs of organizations and organizational units  

This case can be implemented by calling of the following functions:  

- `getOrganizations(bool)` with boolean (includeInactive) value as argument  
- `getUnits(bytes32,bool)` with ORGiD and boolean (includeInactive) value as arguments  

## Organization (and organizational unit) Client's cases

> As an organization client, I want to get an organization information by its ORGiD

This case can be implemented by the calling of the public function:

- function: `getOrganization(bytes32)`
- arguments:
    - `ORGiD`

As a result of calling this function the following tuple will be returned:  

- bool `exists`,
- bytes32 `orgId`,
- bytes32 `orgJsonHash`,
- string `orgJsonUri`,
- string `orgJsonUriBackup1`,
- string `orgJsonUriBackup2`,
- bytes32 `parentOrgId`,
- address `owner`,
- address `director`,
- bool `isActive`,
- bool `isDirectorshipAccepted`

In the case of non-existent organization `exists` value will be set to the `false` value.  

> As an organization client, I want to get an actual organization (or organizational unit) org.json URI and hash

This case can be implemented by calling the function `getOrganization(bytes32)` as described in the previous case.  

> As an organization client, I want to get a current active status of the organization

This case can be implemented by calling the function `getOrganization(bytes32)` as described in the previous case.

> As an organizational unit client, I want to get information about the directorship and its acceptance status

This case can be implemented by calling the function `getOrganization(bytes32)` as described in the previous case.

> As an organizational unit client, I want to get an ORGiD of the parent organization

This case can be implemented by calling the function `getOrganization(bytes32)` as described in the previous case.

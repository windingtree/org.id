# ORGiD Registry User Stories

## Actors

- ORGiD Registry owner
- ORGiD Registry user
- Organization owner
- Unit director
- External smart contract developer

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

### As ORGiD owner, I want to transfer smart contract upgradeability ownership to another Ethereum account

See OpenZeppelin's [Ownable](https://docs.openzeppelin.com/contracts/2.x/api/ownership).

## ORGiD Registry user

### I want to get a list of all organizations in the registry

- function: `getOrganizations(bool)`
- arguments:
    - `bool setting to true will include inactive organizations`

### I want to get a list of all units of a particular ORGiD

- function: `_getOrganizations(bytes32,bool)`
- arguments:
    - `bytes32 ORGiD`
    - `bool setting to true will include inactive units`

### I want to get data of a certain ORGiD

- function: `getOrganization(bytes32)`
- arguments:
    - `ORGiD`

The following data will be returned:

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

In case requested `ORGiD` does not exist, the `exists` parameter will be `false`.

### I want to know when new organizations are added to the registry and when they information is updated

Monitor these events:

- `OrganizationCreated`
- `UnitCreated`
- `OrganizationActiveStateChanged`
- `DirectorshipAccepted`
- `DirectorshipTransferred`
- `OrganizationOwnershipTransferred`
- `OrgJsonChanged`

The inactive organization is an organization with active status set to `false` value.  

## Organization Owner

### Before I send a transaction to create a new organization, I'd like to calculate its ID.

Organization and unit identifiers are calculated via `keccak256(<sender_address>,<bytes32_salt>)`. This allows users to create ORG.JSON files beforehand, otherwise they would have needed two transactions, since ORG.JSON schema requires the ID to be present.

The sender cannot use the same `salt` twice, since it will generated the same identifier, and in this case the smart contract will refuse to create a new record.

### I want to create a new organization

- function: `createOrganization(bytes32,bytes32,string,string,string)`
- arguments:
    - `salt - bytes32 hash`
    - `org.json keccak256 hash`
    - `org.json primary URI`
    - `org.json backup URI #1`
    - `org.json backup URI #2`

Event: `OrganizationCreated`

### I want to change ORG.JSON URIs and hash

- function: `setOrgJson(bytes32,bytes32,string,string,string)`
- arguments:
    - `ORGiD`
    - `org.json keccak256 hash`
    - `org.json primary URI`
    - `org.json backup URI #1`
    - `org.json backup URI #2`

Event: `OrgJsonChanged`

### I want to add a unit to my organization

- function: `createUnit(bytes32,bytes32,address,bytes32,string,string,string)`
- arguments:
    - `salt`
    - `Parent ORGiD`
    - `unit director address`
    - `unit org.json primary URI`
    - `unit org.json backup URI #1`
    - `unit org.json backup URI #2`

Event: `UnitCreated`

### I want to assign someone as director of a unit

- function: `transferDirectorship(bytes32,address)`
- arguments:
    - `Unit ORGiD`
    - `new unit director address`

Event: `DirectorshipTransferred`

### I want to transfer an ORGiD ownership to another Ethereum account

- function: `transferOrganizationOwnership(bytes32,address)`
- arguments:
    - `ORGiD`
    - `new organization owner address`

Event: `OrganizationOwnershipTransferred`

### I want to deactivate an ORGiD

- function: `toggleActiveState(bytes32)`
- arguments:
    - `ORGiD`

Event: `OrganizationActiveStateChanged`

## Unit director

### As a newly assigned director, I want to confirm my role explicitly

- function: `acceptDirectorship(bytes32)`
- arguments:
    - `ORGiD`

Event: `DirectorshipAccepted`

### I want to change ORG.JSON data of my unit

- function: `setOrgJson(bytes32,bytes32,string,string,string)`
- arguments:
    - `ORGiD`
    - `org.json keccak256 hash`
    - `org.json primary URI`
    - `org.json backup URI #1`
    - `org.json backup URI #2`

Event: `OrgJsonChanged`

In case directorship status was not accepted, using this function will automatically accept the role, and `DirectorshipAccepted` will be emitted.

### I want to renounce my directorship

- function: `renounceDirectorship(bytes32)`
- arguments:
    - `ORGiD`

Event: `DirectorshipTransferred`

## External smart contract developer

### I would like my new smart contract to have an ORGiD interface.

Please have a look at `OrgIdInterface.sol`.

### How do I validate ORGiD deployment using its interface?

ORGiD supports `ERC165` standard which allows interface validataion. ORGiD implements the following interfaces:

- ERC165: `0x01ffc9a7`
- Ownable: `0x7f5828d0`
- ORGiD: `0x0f4893ef`
- Hierarchy (units): `0x6af2fb27`

* [WTContracts](#wtcontracts)
  * [register](#function-register)
  * [getByAddr](#function-getbyaddr)
  * [total](#function-total)
  * [version](#function-version)
  * [getContract](#function-getcontract)
  * [owner](#function-owner)
  * [getByName](#function-getbyname)
  * [edit](#function-edit)
  * [contractType](#function-contracttype)
  * [transferOwnership](#function-transferownership)
  * [OwnershipTransferred](#event-ownershiptransferred)

# WTContracts


## *function* register

WTContracts.register(_name, _addr, _version) `nonpayable` `0578dd1c`

> `register` allows the owner to register a new contract

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _name | The name of the contract to be registered |
| *address* | _addr | The contract's address |
| *string* | _version | The contract's version |


## *function* getByAddr

WTContracts.getByAddr(_addr) `view` `259a1a34`

> `getByAddr` get the info of a registered contract by address

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _addr | The registered contract's address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _name | Contract name or empty string |
| *address* | _address | Contract address or zero address |
| *string* | _version | Contract version or empty string |

## *function* total

WTContracts.total() `view` `2ddbd13a`





## *function* version

WTContracts.version() `view` `54fd4d50`





## *function* getContract

WTContracts.getContract(_pos) `view` `6ebc8c86`

> `getContract` get the info of a registered contract by index

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | _pos | The registered contract's index returns {name, address, url, version} The contract's information |


## *function* owner

WTContracts.owner() `view` `8da5cb5b`





## *function* getByName

WTContracts.getByName(_name) `view` `b336ad83`

> `getByName` get the info of a registered contract by name

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _name | The registered contract's name |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _contractName | Contract name or empty string |
| *address* | _address | Contract address or zero address |
| *string* | _version | Contract version or empty string |

## *function* edit

WTContracts.edit(_name, _addr, _version) `nonpayable` `c362e82d`

> `edit` allows an owner to edit a registered contract

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _name | The name of the contract to edit |
| *address* | _addr | The contract's new address |
| *string* | _version | The contract's new version |


## *function* contractType

WTContracts.contractType() `view` `cb2ef6f7`





## *function* transferOwnership

WTContracts.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |

## *event* OwnershipTransferred

WTContracts.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
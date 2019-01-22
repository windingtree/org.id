* [WTAirlineIndexUpgradeabilityTest](#wtairlineindexupgradeabilitytest)
  * [deleteAirline](#function-deleteairline)
  * [getAirlines](#function-getairlines)
  * [newFunction](#function-newfunction)
  * [registerAirline](#function-registerairline)
  * [airlinesByManager](#function-airlinesbymanager)
  * [callAirline](#function-callairline)
  * [airlines](#function-airlines)
  * [LifToken](#function-liftoken)
  * [airlinesByManagerIndex](#function-airlinesbymanagerindex)
  * [renounceOwnership](#function-renounceownership)
  * [getAirlinesByManager](#function-getairlinesbymanager)
  * [owner](#function-owner)
  * [getAirlinesLength](#function-getairlineslength)
  * [initialize](#function-initialize)
  * [airlinesIndex](#function-airlinesindex)
  * [transferAirline](#function-transferairline)
  * [setLifToken](#function-setliftoken)
  * [transferOwnership](#function-transferownership)
  * [AirlineRegistered](#event-airlineregistered)
  * [AirlineDeleted](#event-airlinedeleted)
  * [AirlineCalled](#event-airlinecalled)
  * [AirlineTransferred](#event-airlinetransferred)
  * [OwnershipRenounced](#event-ownershiprenounced)
  * [OwnershipTransferred](#event-ownershiptransferred)

# WTAirlineIndexUpgradeabilityTest


## *function* deleteAirline

WTAirlineIndexUpgradeabilityTest.deleteAirline(airline) `nonpayable` `0b5ba03a`

> `deleteAirline` Allows a manager to delete a airline, i. e. call destroy on the target Airline contract. Emits `AirlineDeleted` on success.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | Airline's address |


## *function* getAirlines

WTAirlineIndexUpgradeabilityTest.getAirlines() `view` `0d5dc054`

> `getAirlines` get `airlines` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* newFunction

WTAirlineIndexUpgradeabilityTest.newFunction() `pure` `1b28d63e`





## *function* registerAirline

WTAirlineIndexUpgradeabilityTest.registerAirline(dataUri) `nonpayable` `25205210`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | undefined |


## *function* airlinesByManager

WTAirlineIndexUpgradeabilityTest.airlinesByManager(, ) `view` `2cc042b5`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |
| *uint256* |  | undefined |


## *function* callAirline

WTAirlineIndexUpgradeabilityTest.callAirline(airline, data) `nonpayable` `346ab715`

> `callAirline` Call airline in the index, the airline can only be called by its manager. Effectively proxies a airline call. Emits AirlineCalled on success.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | Airline's address |
| *bytes* | data | Encoded method call to be done on Airline contract. |


## *function* airlines

WTAirlineIndexUpgradeabilityTest.airlines() `view` `3a9a77ca`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* LifToken

WTAirlineIndexUpgradeabilityTest.LifToken() `view` `554d8b37`





## *function* airlinesByManagerIndex

WTAirlineIndexUpgradeabilityTest.airlinesByManagerIndex() `view` `6f76b348`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* renounceOwnership

WTAirlineIndexUpgradeabilityTest.renounceOwnership() `nonpayable` `715018a6`

**Renouncing to ownership will leave the contract without an owner. It will not be possible to call the functions with the `onlyOwner` modifier anymore.**

> Allows the current owner to relinquish control of the contract.




## *function* getAirlinesByManager

WTAirlineIndexUpgradeabilityTest.getAirlinesByManager(manager) `view` `7ea6d3c1`

> `getAirlinesByManager` get all the airlines belonging to one manager

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | manager | Manager address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* owner

WTAirlineIndexUpgradeabilityTest.owner() `view` `8da5cb5b`





## *function* getAirlinesLength

WTAirlineIndexUpgradeabilityTest.getAirlinesLength() `view` `98696eb5`

> `getAirlinesLength` get the length of the `airlines` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* initialize

WTAirlineIndexUpgradeabilityTest.initialize(_owner) `nonpayable` `c4d66de8`

> Initializer for upgradeable contracts.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _owner | The address of the contract owner |


## *function* airlinesIndex

WTAirlineIndexUpgradeabilityTest.airlinesIndex() `view` `c73f2bfb`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* transferAirline

WTAirlineIndexUpgradeabilityTest.transferAirline(airline, newManager) `nonpayable` `e6b999af`

> `transferAirline` Allows to change ownership of the airline contract. Emits AirlineTransferred on success.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | Airline's address |
| *address* | newManager | Address to which the airline will belong after transfer. |


## *function* setLifToken

WTAirlineIndexUpgradeabilityTest.setLifToken(_lifToken) `nonpayable` `f2f0967b`

> `setLifToken` allows the owner of the contract to change the address of the LifToken contract

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _lifToken | The new contract address |


## *function* transferOwnership

WTAirlineIndexUpgradeabilityTest.transferOwnership(_newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _newOwner | The address to transfer ownership to. |

## *event* AirlineRegistered

WTAirlineIndexUpgradeabilityTest.AirlineRegistered(airline, managerIndex, allIndex) `107b5845`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | not indexed |
| *uint256* | managerIndex | not indexed |
| *uint256* | allIndex | not indexed |

## *event* AirlineDeleted

WTAirlineIndexUpgradeabilityTest.AirlineDeleted(airline, managerIndex, allIndex) `b0ea7807`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | not indexed |
| *uint256* | managerIndex | not indexed |
| *uint256* | allIndex | not indexed |

## *event* AirlineCalled

WTAirlineIndexUpgradeabilityTest.AirlineCalled(airline) `11e711e5`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | not indexed |

## *event* AirlineTransferred

WTAirlineIndexUpgradeabilityTest.AirlineTransferred(airline, previousManager, newManager) `aa7e2fed`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | not indexed |
| *address* | previousManager | not indexed |
| *address* | newManager | not indexed |

## *event* OwnershipRenounced

WTAirlineIndexUpgradeabilityTest.OwnershipRenounced(previousOwner) `f8df3114`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |

## *event* OwnershipTransferred

WTAirlineIndexUpgradeabilityTest.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
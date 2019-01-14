* [WTAirlineIndex](#wtairlineindex)
  * [deleteAirline](#function-deleteairline)
  * [getAirlines](#function-getairlines)
  * [registerAirline](#function-registerairline)
  * [airlinesByManager](#function-airlinesbymanager)
  * [callAirline](#function-callairline)
  * [airlines](#function-airlines)
  * [version](#function-version)
  * [LifToken](#function-liftoken)
  * [airlinesByManagerIndex](#function-airlinesbymanagerindex)
  * [renounceOwnership](#function-renounceownership)
  * [getAirlinesByManager](#function-getairlinesbymanager)
  * [owner](#function-owner)
  * [getAirlinesLength](#function-getairlineslength)
  * [airlinesIndex](#function-airlinesindex)
  * [contractType](#function-contracttype)
  * [transferAirline](#function-transferairline)
  * [setLifToken](#function-setliftoken)
  * [transferOwnership](#function-transferownership)
  * [AirlineRegistered](#event-airlineregistered)
  * [AirlineDeleted](#event-airlinedeleted)
  * [AirlineCalled](#event-airlinecalled)
  * [AirlineTransferred](#event-airlinetransferred)
  * [OwnershipRenounced](#event-ownershiprenounced)
  * [OwnershipTransferred](#event-ownershiptransferred)

# WTAirlineIndex


## *function* deleteAirline

WTAirlineIndex.deleteAirline(airline) `nonpayable` `0b5ba03a`

> `deleteAirline` Allows a manager to delete a airline, i. e. call destroy on the target Airline contract. Emits `AirlineDeleted` on success.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | Airline's address |


## *function* getAirlines

WTAirlineIndex.getAirlines() `view` `0d5dc054`

> `getAirlines` get `airlines` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* registerAirline

WTAirlineIndex.registerAirline(dataUri) `nonpayable` `25205210`

> `registerAirline` Register new airline in the index. Emits `AirlineRegistered` on success.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | Airline's data pointer |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* airlinesByManager

WTAirlineIndex.airlinesByManager(, ) `view` `2cc042b5`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |
| *uint256* |  | undefined |


## *function* callAirline

WTAirlineIndex.callAirline(airline, data) `nonpayable` `346ab715`

> `callAirline` Call airline in the index, the airline can only be called by its manager. Effectively proxies a airline call. Emits AirlineCalled on success.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | Airline's address |
| *bytes* | data | Encoded method call to be done on Airline contract. |


## *function* airlines

WTAirlineIndex.airlines() `view` `3a9a77ca`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* version

WTAirlineIndex.version() `view` `54fd4d50`





## *function* LifToken

WTAirlineIndex.LifToken() `view` `554d8b37`





## *function* airlinesByManagerIndex

WTAirlineIndex.airlinesByManagerIndex() `view` `6f76b348`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* renounceOwnership

WTAirlineIndex.renounceOwnership() `nonpayable` `715018a6`

**Renouncing to ownership will leave the contract without an owner. It will not be possible to call the functions with the `onlyOwner` modifier anymore.**

> Allows the current owner to relinquish control of the contract.




## *function* getAirlinesByManager

WTAirlineIndex.getAirlinesByManager(manager) `view` `7ea6d3c1`

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

WTAirlineIndex.owner() `view` `8da5cb5b`





## *function* getAirlinesLength

WTAirlineIndex.getAirlinesLength() `view` `98696eb5`

> `getAirlinesLength` get the length of the `airlines` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* airlinesIndex

WTAirlineIndex.airlinesIndex() `view` `c73f2bfb`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* contractType

WTAirlineIndex.contractType() `view` `cb2ef6f7`





## *function* transferAirline

WTAirlineIndex.transferAirline(airline, newManager) `nonpayable` `e6b999af`

> `transferAirline` Allows to change ownership of the airline contract. Emits AirlineTransferred on success.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | Airline's address |
| *address* | newManager | Address to which the airline will belong after transfer. |


## *function* setLifToken

WTAirlineIndex.setLifToken(_lifToken) `nonpayable` `f2f0967b`

> `setLifToken` allows the owner of the contract to change the address of the LifToken contract

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _lifToken | The new contract address |


## *function* transferOwnership

WTAirlineIndex.transferOwnership(_newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _newOwner | The address to transfer ownership to. |


## *event* AirlineRegistered

WTAirlineIndex.AirlineRegistered(airline, managerIndex, allIndex) `107b5845`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | not indexed |
| *uint256* | managerIndex | not indexed |
| *uint256* | allIndex | not indexed |

## *event* AirlineDeleted

WTAirlineIndex.AirlineDeleted(airline, managerIndex, allIndex) `b0ea7807`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | not indexed |
| *uint256* | managerIndex | not indexed |
| *uint256* | allIndex | not indexed |

## *event* AirlineCalled

WTAirlineIndex.AirlineCalled(airline) `11e711e5`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | not indexed |

## *event* AirlineTransferred

WTAirlineIndex.AirlineTransferred(airline, previousManager, newManager) `aa7e2fed`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | not indexed |
| *address* | previousManager | not indexed |
| *address* | newManager | not indexed |

## *event* OwnershipRenounced

WTAirlineIndex.OwnershipRenounced(previousOwner) `f8df3114`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |

## *event* OwnershipTransferred

WTAirlineIndex.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
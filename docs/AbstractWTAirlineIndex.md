* [AbstractWTAirlineIndex](#abstractwtairlineindex)
  * [deleteAirline](#function-deleteairline)
  * [getAirlines](#function-getairlines)
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
  * [airlinesIndex](#function-airlinesindex)
  * [transferAirline](#function-transferairline)
  * [transferOwnership](#function-transferownership)
  * [AirlineRegistered](#event-airlineregistered)
  * [AirlineDeleted](#event-airlinedeleted)
  * [AirlineCalled](#event-airlinecalled)
  * [AirlineTransferred](#event-airlinetransferred)
  * [OwnershipRenounced](#event-ownershiprenounced)
  * [OwnershipTransferred](#event-ownershiptransferred)

# AbstractWTAirlineIndex


## *function* deleteAirline

AbstractWTAirlineIndex.deleteAirline(airline) `nonpayable` `0b5ba03a`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | undefined |


## *function* getAirlines

AbstractWTAirlineIndex.getAirlines() `view` `0d5dc054`





## *function* registerAirline

AbstractWTAirlineIndex.registerAirline(dataUri) `nonpayable` `25205210`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | undefined |


## *function* airlinesByManager

AbstractWTAirlineIndex.airlinesByManager(, ) `view` `2cc042b5`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |
| *uint256* |  | undefined |


## *function* callAirline

AbstractWTAirlineIndex.callAirline(airline, data) `nonpayable` `346ab715`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | undefined |
| *bytes* | data | undefined |


## *function* airlines

AbstractWTAirlineIndex.airlines() `view` `3a9a77ca`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* LifToken

AbstractWTAirlineIndex.LifToken() `view` `554d8b37`





## *function* airlinesByManagerIndex

AbstractWTAirlineIndex.airlinesByManagerIndex() `view` `6f76b348`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* renounceOwnership

AbstractWTAirlineIndex.renounceOwnership() `nonpayable` `715018a6`

**Renouncing to ownership will leave the contract without an owner. It will not be possible to call the functions with the `onlyOwner` modifier anymore.**

> Allows the current owner to relinquish control of the contract.




## *function* getAirlinesByManager

AbstractWTAirlineIndex.getAirlinesByManager(manager) `view` `7ea6d3c1`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | manager | undefined |


## *function* owner

AbstractWTAirlineIndex.owner() `view` `8da5cb5b`





## *function* getAirlinesLength

AbstractWTAirlineIndex.getAirlinesLength() `view` `98696eb5`





## *function* airlinesIndex

AbstractWTAirlineIndex.airlinesIndex() `view` `c73f2bfb`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* transferAirline

AbstractWTAirlineIndex.transferAirline(airline, newManager) `nonpayable` `e6b999af`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | undefined |
| *address* | newManager | undefined |


## *function* transferOwnership

AbstractWTAirlineIndex.transferOwnership(_newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _newOwner | The address to transfer ownership to. |

## *event* AirlineRegistered

AbstractWTAirlineIndex.AirlineRegistered(airline, managerIndex, allIndex) `107b5845`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | not indexed |
| *uint256* | managerIndex | not indexed |
| *uint256* | allIndex | not indexed |

## *event* AirlineDeleted

AbstractWTAirlineIndex.AirlineDeleted(airline, managerIndex, allIndex) `b0ea7807`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | not indexed |
| *uint256* | managerIndex | not indexed |
| *uint256* | allIndex | not indexed |

## *event* AirlineCalled

AbstractWTAirlineIndex.AirlineCalled(airline) `11e711e5`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | not indexed |

## *event* AirlineTransferred

AbstractWTAirlineIndex.AirlineTransferred(airline, previousManager, newManager) `aa7e2fed`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | not indexed |
| *address* | previousManager | not indexed |
| *address* | newManager | not indexed |

## *event* OwnershipRenounced

AbstractWTAirlineIndex.OwnershipRenounced(previousOwner) `f8df3114`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |

## *event* OwnershipTransferred

AbstractWTAirlineIndex.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
* [WTHotelIndexUpgradeabilityTest](#wthotelindexupgradeabilitytest)
  * [getHotels](#function-gethotels)
  * [callHotel](#function-callhotel)
  * [hotelsByManagerIndex](#function-hotelsbymanagerindex)
  * [newFunction](#function-newfunction)
  * [transferHotel](#function-transferhotel)
  * [initialize](#function-initialize)
  * [LifToken](#function-liftoken)
  * [hotelsByManager](#function-hotelsbymanager)
  * [hotelsIndex](#function-hotelsindex)
  * [getHotelsByManager](#function-gethotelsbymanager)
  * [getHotelsLength](#function-gethotelslength)
  * [hotels](#function-hotels)
  * [setLifToken](#function-setliftoken)
  * [transferOwnership](#function-transferownership)
  * [registerHotel](#function-registerhotel)
  * [deleteHotel](#function-deletehotel)
  * [HotelRegistered](#event-hotelregistered)
  * [HotelDeleted](#event-hoteldeleted)
  * [HotelCalled](#event-hotelcalled)
  * [HotelTransferred](#event-hoteltransferred)
  * [OwnershipTransferred](#event-ownershiptransferred)

# WTHotelIndexUpgradeabilityTest


## *function* getHotels

WTHotelIndexUpgradeabilityTest.getHotels() `view` `0d2e677a`

> `getHotels` get `hotels` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* callHotel

WTHotelIndexUpgradeabilityTest.callHotel(hotel, data) `nonpayable` `154d56db`

> `callHotel` Call hotel in the index, the hotel can only be called by its manager. Effectively proxies a hotel call. Emits HotelCalled on success.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | Hotel's address |
| *bytes* | data | Encoded method call to be done on Hotel contract. |


## *function* hotelsByManagerIndex

WTHotelIndexUpgradeabilityTest.hotelsByManagerIndex() `view` `189f6aef`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* newFunction

WTHotelIndexUpgradeabilityTest.newFunction() `pure` `1b28d63e`





## *function* transferHotel

WTHotelIndexUpgradeabilityTest.transferHotel(hotel, newManager) `nonpayable` `292d64e0`

> `transferHotel` Allows to change ownership of the hotel contract. Emits HotelTransferred on success.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | Hotel's address |
| *address* | newManager | Address to which the hotel will belong after transfer. |


## *function* initialize

WTHotelIndexUpgradeabilityTest.initialize(__owner, _lifToken) `nonpayable` `485cc955`

> Initializer for upgradeable contracts.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | __owner | The address of the contract owner |
| *address* | _lifToken | The new contract address |


## *function* LifToken

WTHotelIndexUpgradeabilityTest.LifToken() `view` `554d8b37`





## *function* hotelsByManager

WTHotelIndexUpgradeabilityTest.hotelsByManager(, ) `view` `7cf2dfae`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |
| *uint256* |  | undefined |


## *function* hotelsIndex

WTHotelIndexUpgradeabilityTest.hotelsIndex() `view` `9f9bfeb8`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* getHotelsByManager

WTHotelIndexUpgradeabilityTest.getHotelsByManager(manager) `view` `bb979c3d`

> `getHotelsByManager` get all the hotels belonging to one manager

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | manager | Manager address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* getHotelsLength

WTHotelIndexUpgradeabilityTest.getHotelsLength() `view` `ca63a55b`

> `getHotelsLength` get the length of the `hotels` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* hotels

WTHotelIndexUpgradeabilityTest.hotels() `view` `cd338265`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* setLifToken

WTHotelIndexUpgradeabilityTest.setLifToken(_lifToken) `nonpayable` `f2f0967b`

> `setLifToken` allows the owner of the contract to change the address of the LifToken contract

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _lifToken | The new contract address |


## *function* transferOwnership

WTHotelIndexUpgradeabilityTest.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |


## *function* registerHotel

WTHotelIndexUpgradeabilityTest.registerHotel(dataUri) `nonpayable` `f88a067f`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | undefined |


## *function* deleteHotel

WTHotelIndexUpgradeabilityTest.deleteHotel(hotel) `nonpayable` `fb6f6875`

> `deleteHotel` Allows a manager to delete a hotel, i. e. call destroy on the target Hotel contract. Emits `HotelDeleted` on success.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | Hotel's address |

## *event* HotelRegistered

WTHotelIndexUpgradeabilityTest.HotelRegistered(hotel, managerIndex, allIndex) `48ef5bfc`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | not indexed |
| *uint256* | managerIndex | not indexed |
| *uint256* | allIndex | not indexed |

## *event* HotelDeleted

WTHotelIndexUpgradeabilityTest.HotelDeleted(hotel, managerIndex, allIndex) `54f58abd`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | not indexed |
| *uint256* | managerIndex | not indexed |
| *uint256* | allIndex | not indexed |

## *event* HotelCalled

WTHotelIndexUpgradeabilityTest.HotelCalled(hotel) `e09d7761`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | not indexed |

## *event* HotelTransferred

WTHotelIndexUpgradeabilityTest.HotelTransferred(hotel, previousManager, newManager) `04dd8111`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | not indexed |
| *address* | previousManager | not indexed |
| *address* | newManager | not indexed |

## *event* OwnershipTransferred

WTHotelIndexUpgradeabilityTest.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
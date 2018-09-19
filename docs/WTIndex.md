* [WTIndex](#wtindex)
  * [getHotels](#function-gethotels)
  * [callHotel](#function-callhotel)
  * [hotelsByManagerIndex](#function-hotelsbymanagerindex)
  * [transferHotel](#function-transferhotel)
  * [version](#function-version)
  * [LifToken](#function-liftoken)
  * [renounceOwnership](#function-renounceownership)
  * [hotelsByManager](#function-hotelsbymanager)
  * [owner](#function-owner)
  * [hotelsIndex](#function-hotelsindex)
  * [getHotelsByManager](#function-gethotelsbymanager)
  * [getHotelsLength](#function-gethotelslength)
  * [contractType](#function-contracttype)
  * [hotels](#function-hotels)
  * [setLifToken](#function-setliftoken)
  * [transferOwnership](#function-transferownership)
  * [registerHotel](#function-registerhotel)
  * [deleteHotel](#function-deletehotel)
  * [HotelRegistered](#event-hotelregistered)
  * [HotelDeleted](#event-hoteldeleted)
  * [HotelCalled](#event-hotelcalled)
  * [HotelTransferred](#event-hoteltransferred)
  * [OwnershipRenounced](#event-ownershiprenounced)
  * [OwnershipTransferred](#event-ownershiptransferred)

# WTIndex


## *function* getHotels

WTIndex.getHotels() `view` `0d2e677a`

> `getHotels` get `hotels` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* callHotel

WTIndex.callHotel(hotel, data) `nonpayable` `154d56db`

> `callHotel` Call hotel in the index, the hotel can only be called by its manager. Effectively proxies a hotel call. Emits HotelCalled on success.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | Hotel's address |
| *bytes* | data | Encoded method call to be done on Hotel contract. |


## *function* hotelsByManagerIndex

WTIndex.hotelsByManagerIndex() `view` `189f6aef`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* transferHotel

WTIndex.transferHotel(hotel, newManager) `nonpayable` `292d64e0`

> `transferHotel` Allows to change ownership of the hotel contract. Emits HotelTransferred on success.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | Hotel's address |
| *address* | newManager | Address to which the hotel will belong after transfer. |


## *function* version

WTIndex.version() `view` `54fd4d50`





## *function* LifToken

WTIndex.LifToken() `view` `554d8b37`





## *function* renounceOwnership

WTIndex.renounceOwnership() `nonpayable` `715018a6`

**Renouncing to ownership will leave the contract without an owner. It will not be possible to call the functions with the `onlyOwner` modifier anymore.**

> Allows the current owner to relinquish control of the contract.




## *function* hotelsByManager

WTIndex.hotelsByManager(, ) `view` `7cf2dfae`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |
| *uint256* |  | undefined |


## *function* owner

WTIndex.owner() `view` `8da5cb5b`





## *function* hotelsIndex

WTIndex.hotelsIndex() `view` `9f9bfeb8`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* getHotelsByManager

WTIndex.getHotelsByManager(manager) `view` `bb979c3d`

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

WTIndex.getHotelsLength() `view` `ca63a55b`

> `getHotelsLength` get the length of the `hotels` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* contractType

WTIndex.contractType() `view` `cb2ef6f7`





## *function* hotels

WTIndex.hotels() `view` `cd338265`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* setLifToken

WTIndex.setLifToken(_lifToken) `nonpayable` `f2f0967b`

> `setLifToken` allows the owner of the contract to change the address of the LifToken contract

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _lifToken | The new contract address |


## *function* transferOwnership

WTIndex.transferOwnership(_newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _newOwner | The address to transfer ownership to. |


## *function* registerHotel

WTIndex.registerHotel(dataUri) `nonpayable` `f88a067f`

> `registerHotel` Register new hotel in the index. Emits `HotelRegistered` on success.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | Hotel's data pointer |


## *function* deleteHotel

WTIndex.deleteHotel(hotel) `nonpayable` `fb6f6875`

> `deleteHotel` Allows a manager to delete a hotel, i. e. call destroy on the target Hotel contract. Emits `HotelDeleted` on success.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | Hotel's address |


## *event* HotelRegistered

WTIndex.HotelRegistered(hotel, managerIndex, allIndex) `48ef5bfc`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | not indexed |
| *uint256* | managerIndex | not indexed |
| *uint256* | allIndex | not indexed |

## *event* HotelDeleted

WTIndex.HotelDeleted(hotel, managerIndex, allIndex) `54f58abd`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | not indexed |
| *uint256* | managerIndex | not indexed |
| *uint256* | allIndex | not indexed |

## *event* HotelCalled

WTIndex.HotelCalled(hotel) `e09d7761`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | not indexed |

## *event* HotelTransferred

WTIndex.HotelTransferred(hotel, previousManager, newManager) `04dd8111`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | not indexed |
| *address* | previousManager | not indexed |
| *address* | newManager | not indexed |

## *event* OwnershipRenounced

WTIndex.OwnershipRenounced(previousOwner) `f8df3114`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |

## *event* OwnershipTransferred

WTIndex.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
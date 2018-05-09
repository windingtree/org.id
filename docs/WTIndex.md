* [WTIndex](#wtindex)
  * [getHotels](#function-gethotels)
  * [version](#function-version)
  * [LifToken](#function-liftoken)
  * [hotelsByManager](#function-hotelsbymanager)
  * [deleteHotel](#function-deletehotel)
  * [owner](#function-owner)
  * [DAO](#function-dao)
  * [hotelsIndex](#function-hotelsindex)
  * [getHotelsByManager](#function-gethotelsbymanager)
  * [getHotelsLength](#function-gethotelslength)
  * [contractType](#function-contracttype)
  * [hotels](#function-hotels)
  * [registerHotel](#function-registerhotel)
  * [callHotel](#function-callhotel)
  * [setDAO](#function-setdao)
  * [setLifToken](#function-setliftoken)
  * [transferOwnership](#function-transferownership)
  * [log](#event-log)
  * [OwnershipTransferred](#event-ownershiptransferred)

# WTIndex


## *function* getHotels

WTIndex.getHotels() `view` `0d2e677a`

> `getHotels` get `hotels` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* | _hotels | The addresses of all `Hotel` contracts |

## *function* version

WTIndex.version() `view` `54fd4d50`





## *function* LifToken

WTIndex.LifToken() `view` `554d8b37`





## *function* hotelsByManager

WTIndex.hotelsByManager(, ) `view` `7cf2dfae`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |
| *uint256* |  | undefined |


## *function* deleteHotel

WTIndex.deleteHotel(index) `nonpayable` `80254127`

> `deleteHotel` Allows a manager to delete a hotel, along with its Units and UnitTypes

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | index | The hotel's index |


## *function* owner

WTIndex.owner() `view` `8da5cb5b`





## *function* DAO

WTIndex.DAO() `view` `98fabd3a`





## *function* hotelsIndex

WTIndex.hotelsIndex() `view` `9f9bfeb8`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* getHotelsByManager

WTIndex.getHotelsByManager(owner) `view` `bb979c3d`

> `getHotelsByManager` get all the hotels belonging to one manager

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | owner | undefined |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* | _hotels | The addresses of `Hotel` contracts that belong to one manager |

## *function* getHotelsLength

WTIndex.getHotelsLength() `view` `ca63a55b`

> `getHotelsLength` get the length of the `hotels` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | _length | Length of the `hotels` array |

## *function* contractType

WTIndex.contractType() `view` `cb2ef6f7`





## *function* hotels

WTIndex.hotels() `view` `cd338265`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* registerHotel

WTIndex.registerHotel(name, description) `nonpayable` `dc52ab73`

> `registerHotel` Register new hotel in the index

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | name | The name of the hotel |
| *string* | description | The description of the hotel |


## *function* callHotel

WTIndex.callHotel(index, data) `nonpayable` `deb749a9`

> `callHotel` Call hotel in the index, the hotel can only be called by its manager

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | index | The index position of the hotel |
| *bytes* | data | The data to be executed in the hotel contract |


## *function* setDAO

WTIndex.setDAO(_DAO) `nonpayable` `e73a914c`

> `setDAO` allows the owner of the contract to change the address of the DAO contract

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _DAO | The new contract address |


## *function* setLifToken

WTIndex.setLifToken(_LifToken) `nonpayable` `f2f0967b`

> `setLifToken` allows the owner of the contract to change the address of the LifToken contract

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _LifToken | The new contract address |


## *function* transferOwnership

WTIndex.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |


## *event* log

WTIndex.log() `51973ec9`



## *event* OwnershipTransferred

WTIndex.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
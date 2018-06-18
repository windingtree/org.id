* [WTIndex_Interface](#wtindex_interface)
  * [getHotels](#function-gethotels)
  * [callHotel](#function-callhotel)
  * [hotelsByManagerIndex](#function-hotelsbymanagerindex)
  * [version](#function-version)
  * [LifToken](#function-liftoken)
  * [hotelsByManager](#function-hotelsbymanager)
  * [hotelsIndex](#function-hotelsindex)
  * [getHotelsByManager](#function-gethotelsbymanager)
  * [getHotelsLength](#function-gethotelslength)
  * [contractType](#function-contracttype)
  * [hotels](#function-hotels)
  * [registerHotel](#function-registerhotel)
  * [deleteHotel](#function-deletehotel)
  * [HotelRegistered](#event-hotelregistered)
  * [HotelDeleted](#event-hoteldeleted)
  * [HotelCalled](#event-hotelcalled)

# WTIndex_Interface


## *function* getHotels

WTIndex_Interface.getHotels() `view` `0d2e677a`





## *function* callHotel

WTIndex_Interface.callHotel(hotel, data) `nonpayable` `154d56db`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | undefined |
| *bytes* | data | undefined |


## *function* hotelsByManagerIndex

WTIndex_Interface.hotelsByManagerIndex() `view` `189f6aef`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* version

WTIndex_Interface.version() `view` `54fd4d50`





## *function* LifToken

WTIndex_Interface.LifToken() `view` `554d8b37`





## *function* hotelsByManager

WTIndex_Interface.hotelsByManager(, ) `view` `7cf2dfae`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |
| *uint256* |  | undefined |


## *function* hotelsIndex

WTIndex_Interface.hotelsIndex() `view` `9f9bfeb8`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* getHotelsByManager

WTIndex_Interface.getHotelsByManager(manager) `view` `bb979c3d`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | manager | undefined |


## *function* getHotelsLength

WTIndex_Interface.getHotelsLength() `view` `ca63a55b`





## *function* contractType

WTIndex_Interface.contractType() `view` `cb2ef6f7`





## *function* hotels

WTIndex_Interface.hotels() `view` `cd338265`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* registerHotel

WTIndex_Interface.registerHotel(url) `nonpayable` `f88a067f`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | url | undefined |


## *function* deleteHotel

WTIndex_Interface.deleteHotel(hotel) `nonpayable` `fb6f6875`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | undefined |

## *event* HotelRegistered

WTIndex_Interface.HotelRegistered(hotel, managerIndex, allIndex) `48ef5bfc`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | not indexed |
| *uint256* | managerIndex | not indexed |
| *uint256* | allIndex | not indexed |

## *event* HotelDeleted

WTIndex_Interface.HotelDeleted(hotel, managerIndex, allIndex) `54f58abd`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | not indexed |
| *uint256* | managerIndex | not indexed |
| *uint256* | allIndex | not indexed |

## *event* HotelCalled

WTIndex_Interface.HotelCalled(hotel) `e09d7761`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | not indexed |


---
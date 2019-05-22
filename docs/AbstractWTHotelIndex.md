* [AbstractWTHotelIndex](#abstractwthotelindex)
  * [getHotels](#function-gethotels)
  * [createHotel](#function-createhotel)
  * [deregisterHotel](#function-deregisterhotel)
  * [hotelsIndex](#function-hotelsindex)
  * [getHotelsByManager](#function-gethotelsbymanager)
  * [getHotelsLength](#function-gethotelslength)
  * [hotels](#function-hotels)
  * [createAndRegisterHotel](#function-createandregisterhotel)
  * [registerHotel](#function-registerhotel)
  * [OrganizationCreated](#event-organizationcreated)
  * [OrganizationRegistered](#event-organizationregistered)
  * [OrganizationDeregistered](#event-organizationderegistered)
  * [OwnershipTransferred](#event-ownershiptransferred)

# AbstractWTHotelIndex


## *function* getHotels

AbstractWTHotelIndex.getHotels() `view` `0d2e677a`





## *function* createHotel

AbstractWTHotelIndex.createHotel(dataUri) `nonpayable` `6e36f8b0`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | undefined |


## *function* deregisterHotel

AbstractWTHotelIndex.deregisterHotel(hotel) `nonpayable` `7dd2eea0`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | undefined |


## *function* hotelsIndex

AbstractWTHotelIndex.hotelsIndex(hotel) `view` `9f9bfeb8`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | undefined |


## *function* getHotelsByManager

AbstractWTHotelIndex.getHotelsByManager(manager) `view` `bb979c3d`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | manager | undefined |


## *function* getHotelsLength

AbstractWTHotelIndex.getHotelsLength() `view` `ca63a55b`





## *function* hotels

AbstractWTHotelIndex.hotels(index) `view` `cd338265`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | index | undefined |


## *function* createAndRegisterHotel

AbstractWTHotelIndex.createAndRegisterHotel(dataUri) `nonpayable` `d5b3f23f`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | undefined |


## *function* registerHotel

AbstractWTHotelIndex.registerHotel(hotel) `nonpayable` `dcd003fb`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | undefined |

## *event* OrganizationCreated

AbstractWTHotelIndex.OrganizationCreated(organization) `47b68893`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OrganizationRegistered

AbstractWTHotelIndex.OrganizationRegistered(organization, managerIndex, allIndex) `0896224a`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |
| *uint256* | managerIndex | not indexed |
| *uint256* | allIndex | not indexed |

## *event* OrganizationDeregistered

AbstractWTHotelIndex.OrganizationDeregistered(organization) `2ef6503b`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OwnershipTransferred

AbstractWTHotelIndex.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
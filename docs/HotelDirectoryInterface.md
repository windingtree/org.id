* [HotelDirectoryInterface](#hoteldirectoryinterface)
  * [getHotels](#function-gethotels)
  * [createHotel](#function-createhotel)
  * [deregisterHotel](#function-deregisterhotel)
  * [hotelsIndex](#function-hotelsindex)
  * [getHotelsLength](#function-gethotelslength)
  * [hotels](#function-hotels)
  * [createAndRegisterHotel](#function-createandregisterhotel)
  * [registerHotel](#function-registerhotel)
  * [OrganizationCreated](#event-organizationcreated)
  * [OrganizationRegistered](#event-organizationregistered)
  * [OrganizationDeregistered](#event-organizationderegistered)
  * [OwnershipTransferred](#event-ownershiptransferred)

# HotelDirectoryInterface


## *function* getHotels

HotelDirectoryInterface.getHotels() `view` `0d2e677a`





## *function* createHotel

HotelDirectoryInterface.createHotel(dataUri) `nonpayable` `6e36f8b0`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | undefined |


## *function* deregisterHotel

HotelDirectoryInterface.deregisterHotel(hotel) `nonpayable` `7dd2eea0`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | undefined |


## *function* hotelsIndex

HotelDirectoryInterface.hotelsIndex(hotel) `view` `9f9bfeb8`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | undefined |


## *function* getHotelsLength

HotelDirectoryInterface.getHotelsLength() `view` `ca63a55b`





## *function* hotels

HotelDirectoryInterface.hotels(index) `view` `cd338265`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | index | undefined |


## *function* createAndRegisterHotel

HotelDirectoryInterface.createAndRegisterHotel(dataUri) `nonpayable` `d5b3f23f`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | undefined |


## *function* registerHotel

HotelDirectoryInterface.registerHotel(hotel) `nonpayable` `dcd003fb`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | undefined |

## *event* OrganizationCreated

HotelDirectoryInterface.OrganizationCreated(organization) `47b68893`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OrganizationRegistered

HotelDirectoryInterface.OrganizationRegistered(organization, index) `0aa9369e`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |
| *uint256* | index | not indexed |

## *event* OrganizationDeregistered

HotelDirectoryInterface.OrganizationDeregistered(organization) `2ef6503b`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OwnershipTransferred

HotelDirectoryInterface.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
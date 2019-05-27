* [HotelDirectoryInterface](#hoteldirectoryinterface)
  * [getHotels](#function-gethotels)
  * [removeHotel](#function-removehotel)
  * [addHotel](#function-addhotel)
  * [createHotel](#function-createhotel)
  * [createAndAddHotel](#function-createandaddhotel)
  * [hotelsIndex](#function-hotelsindex)
  * [getHotelsLength](#function-gethotelslength)
  * [hotels](#function-hotels)
  * [OrganizationCreated](#event-organizationcreated)
  * [OrganizationAdded](#event-organizationadded)
  * [OrganizationRemoveed](#event-organizationremoveed)
  * [OwnershipTransferred](#event-ownershiptransferred)

# HotelDirectoryInterface


## *function* getHotels

HotelDirectoryInterface.getHotels() `view` `0d2e677a`





## *function* removeHotel

HotelDirectoryInterface.removeHotel(hotel) `nonpayable` `315610a1`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | undefined |


## *function* addHotel

HotelDirectoryInterface.addHotel(hotel) `nonpayable` `50cd3fc0`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | undefined |


## *function* createHotel

HotelDirectoryInterface.createHotel(dataUri) `nonpayable` `6e36f8b0`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | undefined |


## *function* createAndAddHotel

HotelDirectoryInterface.createAndAddHotel(dataUri) `nonpayable` `95a5f074`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | undefined |


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

## *event* OrganizationCreated

HotelDirectoryInterface.OrganizationCreated(organization) `47b68893`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OrganizationAdded

HotelDirectoryInterface.OrganizationAdded(organization, index) `424a91ec`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |
| *uint256* | index | not indexed |

## *event* OrganizationRemoveed

HotelDirectoryInterface.OrganizationRemoveed(organization) `3325ef95`

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
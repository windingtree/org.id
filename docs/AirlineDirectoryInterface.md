* [AirlineDirectoryInterface](#airlinedirectoryinterface)
  * [getAirlines](#function-getairlines)
  * [addAirline](#function-addairline)
  * [airlines](#function-airlines)
  * [createAndAddAirline](#function-createandaddairline)
  * [getAirlinesLength](#function-getairlineslength)
  * [removeAirline](#function-removeairline)
  * [createAirline](#function-createairline)
  * [airlinesIndex](#function-airlinesindex)
  * [OrganizationCreated](#event-organizationcreated)
  * [OrganizationAdded](#event-organizationadded)
  * [OrganizationRemoveed](#event-organizationremoveed)
  * [OwnershipTransferred](#event-ownershiptransferred)

# AirlineDirectoryInterface


## *function* getAirlines

AirlineDirectoryInterface.getAirlines() `view` `0d5dc054`





## *function* addAirline

AirlineDirectoryInterface.addAirline(airline) `nonpayable` `3a0295d1`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | undefined |


## *function* airlines

AirlineDirectoryInterface.airlines(index) `view` `3a9a77ca`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | index | undefined |


## *function* createAndAddAirline

AirlineDirectoryInterface.createAndAddAirline(dataUri) `nonpayable` `59a4507a`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | undefined |


## *function* getAirlinesLength

AirlineDirectoryInterface.getAirlinesLength() `view` `98696eb5`





## *function* removeAirline

AirlineDirectoryInterface.removeAirline(airline) `nonpayable` `a4945e84`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | undefined |


## *function* createAirline

AirlineDirectoryInterface.createAirline(dataUri) `nonpayable` `b260c10a`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | undefined |


## *function* airlinesIndex

AirlineDirectoryInterface.airlinesIndex(airline) `view` `c73f2bfb`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | undefined |

## *event* OrganizationCreated

AirlineDirectoryInterface.OrganizationCreated(organization) `47b68893`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OrganizationAdded

AirlineDirectoryInterface.OrganizationAdded(organization, index) `424a91ec`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |
| *uint256* | index | not indexed |

## *event* OrganizationRemoveed

AirlineDirectoryInterface.OrganizationRemoveed(organization) `3325ef95`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OwnershipTransferred

AirlineDirectoryInterface.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
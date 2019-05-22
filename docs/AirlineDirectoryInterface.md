* [AirlineDirectoryInterface](#airlinedirectoryinterface)
  * [getAirlines](#function-getairlines)
  * [airlines](#function-airlines)
  * [getAirlinesLength](#function-getairlineslength)
  * [createAndRegisterAirline](#function-createandregisterairline)
  * [createAirline](#function-createairline)
  * [registerAirline](#function-registerairline)
  * [airlinesIndex](#function-airlinesindex)
  * [deregisterAirline](#function-deregisterairline)
  * [OrganizationCreated](#event-organizationcreated)
  * [OrganizationRegistered](#event-organizationregistered)
  * [OrganizationDeregistered](#event-organizationderegistered)
  * [OwnershipTransferred](#event-ownershiptransferred)

# AirlineDirectoryInterface


## *function* getAirlines

AirlineDirectoryInterface.getAirlines() `view` `0d5dc054`





## *function* airlines

AirlineDirectoryInterface.airlines(index) `view` `3a9a77ca`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | index | undefined |


## *function* getAirlinesLength

AirlineDirectoryInterface.getAirlinesLength() `view` `98696eb5`





## *function* createAndRegisterAirline

AirlineDirectoryInterface.createAndRegisterAirline(dataUri) `nonpayable` `9c808770`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | undefined |


## *function* createAirline

AirlineDirectoryInterface.createAirline(dataUri) `nonpayable` `b260c10a`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | undefined |


## *function* registerAirline

AirlineDirectoryInterface.registerAirline(airline) `nonpayable` `bdfd9877`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | undefined |


## *function* airlinesIndex

AirlineDirectoryInterface.airlinesIndex(airline) `view` `c73f2bfb`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | undefined |


## *function* deregisterAirline

AirlineDirectoryInterface.deregisterAirline(airline) `nonpayable` `f9d7e9e5`


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

## *event* OrganizationRegistered

AirlineDirectoryInterface.OrganizationRegistered(organization, index) `0aa9369e`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |
| *uint256* | index | not indexed |

## *event* OrganizationDeregistered

AirlineDirectoryInterface.OrganizationDeregistered(organization) `2ef6503b`

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
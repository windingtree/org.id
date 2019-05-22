* [AbstractWTAirlineIndex](#abstractwtairlineindex)
  * [getAirlines](#function-getairlines)
  * [airlines](#function-airlines)
  * [getAirlinesByManager](#function-getairlinesbymanager)
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

# AbstractWTAirlineIndex


## *function* getAirlines

AbstractWTAirlineIndex.getAirlines() `view` `0d5dc054`





## *function* airlines

AbstractWTAirlineIndex.airlines(index) `view` `3a9a77ca`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | index | undefined |


## *function* getAirlinesByManager

AbstractWTAirlineIndex.getAirlinesByManager(manager) `view` `7ea6d3c1`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | manager | undefined |


## *function* getAirlinesLength

AbstractWTAirlineIndex.getAirlinesLength() `view` `98696eb5`





## *function* createAndRegisterAirline

AbstractWTAirlineIndex.createAndRegisterAirline(dataUri) `nonpayable` `9c808770`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | undefined |


## *function* createAirline

AbstractWTAirlineIndex.createAirline(dataUri) `nonpayable` `b260c10a`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | undefined |


## *function* registerAirline

AbstractWTAirlineIndex.registerAirline(airline) `nonpayable` `bdfd9877`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | undefined |


## *function* airlinesIndex

AbstractWTAirlineIndex.airlinesIndex(hotel) `view` `c73f2bfb`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | undefined |


## *function* deregisterAirline

AbstractWTAirlineIndex.deregisterAirline(airline) `nonpayable` `f9d7e9e5`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | undefined |

## *event* OrganizationCreated

AbstractWTAirlineIndex.OrganizationCreated(organization) `47b68893`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OrganizationRegistered

AbstractWTAirlineIndex.OrganizationRegistered(organization, managerIndex, allIndex) `0896224a`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |
| *uint256* | managerIndex | not indexed |
| *uint256* | allIndex | not indexed |

## *event* OrganizationDeregistered

AbstractWTAirlineIndex.OrganizationDeregistered(organization) `2ef6503b`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OwnershipTransferred

AbstractWTAirlineIndex.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
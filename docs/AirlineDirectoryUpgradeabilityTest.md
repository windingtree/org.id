* [AirlineDirectoryUpgradeabilityTest](#airlinedirectoryupgradeabilitytest)
  * [getAirlines](#function-getairlines)
  * [organizationsByOwnerDeprecated](#function-organizationsbyownerdeprecated)
  * [newFunction](#function-newfunction)
  * [airlines](#function-airlines)
  * [initialize](#function-initialize)
  * [LifToken](#function-liftoken)
  * [organizationsByOwnerIndexDeprecated](#function-organizationsbyownerindexdeprecated)
  * [organizationsIndex](#function-organizationsindex)
  * [getOrganizations](#function-getorganizations)
  * [getAirlinesLength](#function-getairlineslength)
  * [createAndRegisterAirline](#function-createandregisterairline)
  * [createAirline](#function-createairline)
  * [getOrganizationsLength](#function-getorganizationslength)
  * [registerAirline](#function-registerairline)
  * [airlinesIndex](#function-airlinesindex)
  * [organizations](#function-organizations)
  * [setLifToken](#function-setliftoken)
  * [transferOwnership](#function-transferownership)
  * [deregisterAirline](#function-deregisterairline)
  * [OrganizationCreated](#event-organizationcreated)
  * [OrganizationRegistered](#event-organizationregistered)
  * [OrganizationDeregistered](#event-organizationderegistered)
  * [OwnershipTransferred](#event-ownershiptransferred)

# AirlineDirectoryUpgradeabilityTest


## *function* getAirlines

AirlineDirectoryUpgradeabilityTest.getAirlines() `view` `0d5dc054`

> `getAirlines` proxies getOrganizations



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* organizationsByOwnerDeprecated

AirlineDirectoryUpgradeabilityTest.organizationsByOwnerDeprecated(, ) `view` `18531bb6`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |
| *uint256* |  | undefined |


## *function* newFunction

AirlineDirectoryUpgradeabilityTest.newFunction() `pure` `1b28d63e`





## *function* airlines

AirlineDirectoryUpgradeabilityTest.airlines(index) `view` `3a9a77ca`

> `airlines` aliases organizations

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | index | Airline's index |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* initialize

AirlineDirectoryUpgradeabilityTest.initialize(__owner, _lifToken) `nonpayable` `485cc955`

> Initializer for upgradeable contracts.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | __owner | The address of the contract owner |
| *address* | _lifToken | The new contract address |


## *function* LifToken

AirlineDirectoryUpgradeabilityTest.LifToken() `view` `554d8b37`





## *function* organizationsByOwnerIndexDeprecated

AirlineDirectoryUpgradeabilityTest.organizationsByOwnerIndexDeprecated() `view` `5bb087d8`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* organizationsIndex

AirlineDirectoryUpgradeabilityTest.organizationsIndex() `view` `63cd48fb`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* getOrganizations

AirlineDirectoryUpgradeabilityTest.getOrganizations() `view` `9754a3a8`

> `getOrganizations` get `organizations` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* getAirlinesLength

AirlineDirectoryUpgradeabilityTest.getAirlinesLength() `view` `98696eb5`

> `getAirlinesLength` proxies getOrganizationsLength



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* createAndRegisterAirline

AirlineDirectoryUpgradeabilityTest.createAndRegisterAirline(dataUri) `nonpayable` `9c808770`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | undefined |


## *function* createAirline

AirlineDirectoryUpgradeabilityTest.createAirline(dataUri) `nonpayable` `b260c10a`

> `createAirline` proxies and externalizes createOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | Airline's data pointer |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* getOrganizationsLength

AirlineDirectoryUpgradeabilityTest.getOrganizationsLength() `view` `b9306681`

> `getOrganizationsLength` get the length of the `organizations` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* registerAirline

AirlineDirectoryUpgradeabilityTest.registerAirline(airline) `nonpayable` `bdfd9877`

> `registerAirline` proxies and externalizes registerOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | Airline's address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* airlinesIndex

AirlineDirectoryUpgradeabilityTest.airlinesIndex(airline) `view` `c73f2bfb`

> `airlinesIndex` aliases organizatoinsIndex 

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | Airline's address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* organizations

AirlineDirectoryUpgradeabilityTest.organizations() `view` `e792dd8a`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* setLifToken

AirlineDirectoryUpgradeabilityTest.setLifToken(_lifToken) `nonpayable` `f2f0967b`

> `setLifToken` allows the owner of the contract to change the address of the LifToken contract. Allows to set the address to zero address

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _lifToken | The new contract address |


## *function* transferOwnership

AirlineDirectoryUpgradeabilityTest.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |


## *function* deregisterAirline

AirlineDirectoryUpgradeabilityTest.deregisterAirline(airline) `nonpayable` `f9d7e9e5`

> `deregisterAirline` proxies and externalizes deregisterOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | Airline's address |

## *event* OrganizationCreated

AirlineDirectoryUpgradeabilityTest.OrganizationCreated(organization) `47b68893`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OrganizationRegistered

AirlineDirectoryUpgradeabilityTest.OrganizationRegistered(organization, index) `0aa9369e`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |
| *uint256* | index | not indexed |

## *event* OrganizationDeregistered

AirlineDirectoryUpgradeabilityTest.OrganizationDeregistered(organization) `2ef6503b`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OwnershipTransferred

AirlineDirectoryUpgradeabilityTest.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
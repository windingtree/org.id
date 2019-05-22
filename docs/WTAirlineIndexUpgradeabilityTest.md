* [WTAirlineIndexUpgradeabilityTest](#wtairlineindexupgradeabilitytest)
  * [getAirlines](#function-getairlines)
  * [newFunction](#function-newfunction)
  * [airlines](#function-airlines)
  * [initialize](#function-initialize)
  * [LifToken](#function-liftoken)
  * [organizationsIndex](#function-organizationsindex)
  * [getAirlinesByManager](#function-getairlinesbymanager)
  * [getOrganizations](#function-getorganizations)
  * [getAirlinesLength](#function-getairlineslength)
  * [createAndRegisterAirline](#function-createandregisterairline)
  * [organizationsByManagerIndex](#function-organizationsbymanagerindex)
  * [createAirline](#function-createairline)
  * [organizationsByManager](#function-organizationsbymanager)
  * [getOrganizationsLength](#function-getorganizationslength)
  * [registerAirline](#function-registerairline)
  * [airlinesIndex](#function-airlinesindex)
  * [organizations](#function-organizations)
  * [setLifToken](#function-setliftoken)
  * [transferOwnership](#function-transferownership)
  * [getOrganizationsByManager](#function-getorganizationsbymanager)
  * [deregisterAirline](#function-deregisterairline)
  * [OrganizationCreated](#event-organizationcreated)
  * [OrganizationRegistered](#event-organizationregistered)
  * [OrganizationDeregistered](#event-organizationderegistered)
  * [OwnershipTransferred](#event-ownershiptransferred)

# WTAirlineIndexUpgradeabilityTest


## *function* getAirlines

WTAirlineIndexUpgradeabilityTest.getAirlines() `view` `0d5dc054`

> `getAirlines` proxies getOrganizations



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* newFunction

WTAirlineIndexUpgradeabilityTest.newFunction() `pure` `1b28d63e`





## *function* airlines

WTAirlineIndexUpgradeabilityTest.airlines(index) `view` `3a9a77ca`

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

WTAirlineIndexUpgradeabilityTest.initialize(__owner, _lifToken) `nonpayable` `485cc955`

> Initializer for upgradeable contracts.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | __owner | The address of the contract owner |
| *address* | _lifToken | The new contract address |


## *function* LifToken

WTAirlineIndexUpgradeabilityTest.LifToken() `view` `554d8b37`





## *function* organizationsIndex

WTAirlineIndexUpgradeabilityTest.organizationsIndex() `view` `63cd48fb`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* getAirlinesByManager

WTAirlineIndexUpgradeabilityTest.getAirlinesByManager(manager) `view` `7ea6d3c1`

> `getAirlinesByManager` proxies getOrganizationsByManager

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | manager | Manager address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* getOrganizations

WTAirlineIndexUpgradeabilityTest.getOrganizations() `view` `9754a3a8`

> `getOrganizations` get `organizations` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* getAirlinesLength

WTAirlineIndexUpgradeabilityTest.getAirlinesLength() `view` `98696eb5`

> `getAirlinesLength` proxies getOrganizationsLength



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* createAndRegisterAirline

WTAirlineIndexUpgradeabilityTest.createAndRegisterAirline(dataUri) `nonpayable` `9c808770`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | undefined |


## *function* organizationsByManagerIndex

WTAirlineIndexUpgradeabilityTest.organizationsByManagerIndex() `view` `a6fd23b7`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* createAirline

WTAirlineIndexUpgradeabilityTest.createAirline(dataUri) `nonpayable` `b260c10a`

> `createAirline` proxies and externalizes createOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | Airline's data pointer |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* organizationsByManager

WTAirlineIndexUpgradeabilityTest.organizationsByManager(, ) `view` `b4d9b278`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |
| *uint256* |  | undefined |


## *function* getOrganizationsLength

WTAirlineIndexUpgradeabilityTest.getOrganizationsLength() `view` `b9306681`

> `getOrganizationsLength` get the length of the `organizations` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* registerAirline

WTAirlineIndexUpgradeabilityTest.registerAirline(airline) `nonpayable` `bdfd9877`

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

WTAirlineIndexUpgradeabilityTest.airlinesIndex(airline) `view` `c73f2bfb`

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

WTAirlineIndexUpgradeabilityTest.organizations() `view` `e792dd8a`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* setLifToken

WTAirlineIndexUpgradeabilityTest.setLifToken(_lifToken) `nonpayable` `f2f0967b`

> `setLifToken` allows the owner of the contract to change the address of the LifToken contract. Allows to set the address to zero address

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _lifToken | The new contract address |


## *function* transferOwnership

WTAirlineIndexUpgradeabilityTest.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |


## *function* getOrganizationsByManager

WTAirlineIndexUpgradeabilityTest.getOrganizationsByManager(manager) `view` `f439cdfc`

> `getOrganizationsByManager` get all the organizations belonging to one manager

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | manager | Manager address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* deregisterAirline

WTAirlineIndexUpgradeabilityTest.deregisterAirline(airline) `nonpayable` `f9d7e9e5`

> `deregisterAirline` proxies and externalizes deregisterOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | Airline's address |

## *event* OrganizationCreated

WTAirlineIndexUpgradeabilityTest.OrganizationCreated(organization) `47b68893`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OrganizationRegistered

WTAirlineIndexUpgradeabilityTest.OrganizationRegistered(organization, managerIndex, allIndex) `0896224a`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |
| *uint256* | managerIndex | not indexed |
| *uint256* | allIndex | not indexed |

## *event* OrganizationDeregistered

WTAirlineIndexUpgradeabilityTest.OrganizationDeregistered(organization) `2ef6503b`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OwnershipTransferred

WTAirlineIndexUpgradeabilityTest.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
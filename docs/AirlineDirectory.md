* [AirlineDirectory](#airlinedirectory)
  * [getAirlines](#function-getairlines)
  * [organizationsByManagerDeprecated](#function-organizationsbymanagerdeprecated)
  * [airlines](#function-airlines)
  * [initialize](#function-initialize)
  * [LifToken](#function-liftoken)
  * [organizationsIndex](#function-organizationsindex)
  * [organizationsByManagerIndexDeprecated](#function-organizationsbymanagerindexdeprecated)
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

# AirlineDirectory


## *function* getAirlines

AirlineDirectory.getAirlines() `view` `0d5dc054`

> `getAirlines` proxies getOrganizations



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* organizationsByManagerDeprecated

AirlineDirectory.organizationsByManagerDeprecated(, ) `view` `1dafad71`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |
| *uint256* |  | undefined |


## *function* airlines

AirlineDirectory.airlines(index) `view` `3a9a77ca`

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

AirlineDirectory.initialize(__owner, _lifToken) `nonpayable` `485cc955`

> Initializer for upgradeable contracts.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | __owner | The address of the contract owner |
| *address* | _lifToken | The new contract address |


## *function* LifToken

AirlineDirectory.LifToken() `view` `554d8b37`





## *function* organizationsIndex

AirlineDirectory.organizationsIndex() `view` `63cd48fb`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* organizationsByManagerIndexDeprecated

AirlineDirectory.organizationsByManagerIndexDeprecated() `view` `7ead8a4c`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* getOrganizations

AirlineDirectory.getOrganizations() `view` `9754a3a8`

> `getOrganizations` get `organizations` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* getAirlinesLength

AirlineDirectory.getAirlinesLength() `view` `98696eb5`

> `getAirlinesLength` proxies getOrganizationsLength



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* createAndRegisterAirline

AirlineDirectory.createAndRegisterAirline(dataUri) `nonpayable` `9c808770`

> `createAndRegisterAirline` proxies and externalizes createAndRegisterOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | Airline's data pointer |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* createAirline

AirlineDirectory.createAirline(dataUri) `nonpayable` `b260c10a`

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

AirlineDirectory.getOrganizationsLength() `view` `b9306681`

> `getOrganizationsLength` get the length of the `organizations` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* registerAirline

AirlineDirectory.registerAirline(airline) `nonpayable` `bdfd9877`

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

AirlineDirectory.airlinesIndex(airline) `view` `c73f2bfb`

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

AirlineDirectory.organizations() `view` `e792dd8a`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* setLifToken

AirlineDirectory.setLifToken(_lifToken) `nonpayable` `f2f0967b`

> `setLifToken` allows the owner of the contract to change the address of the LifToken contract. Allows to set the address to zero address

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _lifToken | The new contract address |


## *function* transferOwnership

AirlineDirectory.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |


## *function* deregisterAirline

AirlineDirectory.deregisterAirline(airline) `nonpayable` `f9d7e9e5`

> `deregisterAirline` proxies and externalizes deregisterOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | airline | Airline's address |

## *event* OrganizationCreated

AirlineDirectory.OrganizationCreated(organization) `47b68893`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OrganizationRegistered

AirlineDirectory.OrganizationRegistered(organization, index) `0aa9369e`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |
| *uint256* | index | not indexed |

## *event* OrganizationDeregistered

AirlineDirectory.OrganizationDeregistered(organization) `2ef6503b`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OwnershipTransferred

AirlineDirectory.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
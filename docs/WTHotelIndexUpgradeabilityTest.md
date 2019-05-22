* [WTHotelIndexUpgradeabilityTest](#wthotelindexupgradeabilitytest)
  * [getHotels](#function-gethotels)
  * [newFunction](#function-newfunction)
  * [initialize](#function-initialize)
  * [LifToken](#function-liftoken)
  * [organizationsIndex](#function-organizationsindex)
  * [createHotel](#function-createhotel)
  * [deregisterHotel](#function-deregisterhotel)
  * [getOrganizations](#function-getorganizations)
  * [hotelsIndex](#function-hotelsindex)
  * [organizationsByManagerIndex](#function-organizationsbymanagerindex)
  * [organizationsByManager](#function-organizationsbymanager)
  * [getOrganizationsLength](#function-getorganizationslength)
  * [getHotelsByManager](#function-gethotelsbymanager)
  * [getHotelsLength](#function-gethotelslength)
  * [hotels](#function-hotels)
  * [createAndRegisterHotel](#function-createandregisterhotel)
  * [registerHotel](#function-registerhotel)
  * [organizations](#function-organizations)
  * [setLifToken](#function-setliftoken)
  * [transferOwnership](#function-transferownership)
  * [getOrganizationsByManager](#function-getorganizationsbymanager)
  * [OrganizationCreated](#event-organizationcreated)
  * [OrganizationRegistered](#event-organizationregistered)
  * [OrganizationDeregistered](#event-organizationderegistered)
  * [OwnershipTransferred](#event-ownershiptransferred)

# WTHotelIndexUpgradeabilityTest


## *function* getHotels

WTHotelIndexUpgradeabilityTest.getHotels() `view` `0d2e677a`

> `getHotels` proxies getOrganizations



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* newFunction

WTHotelIndexUpgradeabilityTest.newFunction() `pure` `1b28d63e`





## *function* initialize

WTHotelIndexUpgradeabilityTest.initialize(__owner, _lifToken) `nonpayable` `485cc955`

> Initializer for upgradeable contracts.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | __owner | The address of the contract owner |
| *address* | _lifToken | The new contract address |


## *function* LifToken

WTHotelIndexUpgradeabilityTest.LifToken() `view` `554d8b37`





## *function* organizationsIndex

WTHotelIndexUpgradeabilityTest.organizationsIndex() `view` `63cd48fb`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* createHotel

WTHotelIndexUpgradeabilityTest.createHotel(dataUri) `nonpayable` `6e36f8b0`

> `createHotel` proxies and externalizes createOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | Hotel's data pointer |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* deregisterHotel

WTHotelIndexUpgradeabilityTest.deregisterHotel(hotel) `nonpayable` `7dd2eea0`

> `deregisterHotel` proxies and externalizes deregisterOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | Hotel's address |


## *function* getOrganizations

WTHotelIndexUpgradeabilityTest.getOrganizations() `view` `9754a3a8`

> `getOrganizations` get `organizations` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* hotelsIndex

WTHotelIndexUpgradeabilityTest.hotelsIndex(hotel) `view` `9f9bfeb8`

> `hotelsIndex` aliases organizatoinsIndex 

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | Hotel's address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* organizationsByManagerIndex

WTHotelIndexUpgradeabilityTest.organizationsByManagerIndex() `view` `a6fd23b7`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* organizationsByManager

WTHotelIndexUpgradeabilityTest.organizationsByManager(, ) `view` `b4d9b278`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |
| *uint256* |  | undefined |


## *function* getOrganizationsLength

WTHotelIndexUpgradeabilityTest.getOrganizationsLength() `view` `b9306681`

> `getOrganizationsLength` get the length of the `organizations` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* getHotelsByManager

WTHotelIndexUpgradeabilityTest.getHotelsByManager(manager) `view` `bb979c3d`

> `getHotelsByManager` proxies getOrganizationsByManager

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | manager | Manager address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* getHotelsLength

WTHotelIndexUpgradeabilityTest.getHotelsLength() `view` `ca63a55b`

> `getHotelsLength` proxies getOrganizationsLength



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* hotels

WTHotelIndexUpgradeabilityTest.hotels(index) `view` `cd338265`

> `hotels` aliases organizations

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | index | Hotel's index |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* createAndRegisterHotel

WTHotelIndexUpgradeabilityTest.createAndRegisterHotel(dataUri) `nonpayable` `d5b3f23f`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | undefined |


## *function* registerHotel

WTHotelIndexUpgradeabilityTest.registerHotel(hotel) `nonpayable` `dcd003fb`

> `registerHotel` proxies and externalizes registerOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | Hotel's address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* organizations

WTHotelIndexUpgradeabilityTest.organizations() `view` `e792dd8a`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* setLifToken

WTHotelIndexUpgradeabilityTest.setLifToken(_lifToken) `nonpayable` `f2f0967b`

> `setLifToken` allows the owner of the contract to change the address of the LifToken contract. Allows to set the address to zero address

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _lifToken | The new contract address |


## *function* transferOwnership

WTHotelIndexUpgradeabilityTest.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |


## *function* getOrganizationsByManager

WTHotelIndexUpgradeabilityTest.getOrganizationsByManager(manager) `view` `f439cdfc`

> `getOrganizationsByManager` get all the organizations belonging to one manager

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | manager | Manager address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |
## *event* OrganizationCreated

WTHotelIndexUpgradeabilityTest.OrganizationCreated(organization) `47b68893`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OrganizationRegistered

WTHotelIndexUpgradeabilityTest.OrganizationRegistered(organization, managerIndex, allIndex) `0896224a`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |
| *uint256* | managerIndex | not indexed |
| *uint256* | allIndex | not indexed |

## *event* OrganizationDeregistered

WTHotelIndexUpgradeabilityTest.OrganizationDeregistered(organization) `2ef6503b`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OwnershipTransferred

WTHotelIndexUpgradeabilityTest.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
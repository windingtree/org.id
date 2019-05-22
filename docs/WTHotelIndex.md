* [WTHotelIndex](#wthotelindex)
  * [getHotels](#function-gethotels)
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

# WTHotelIndex


## *function* getHotels

WTHotelIndex.getHotels() `view` `0d2e677a`

> `getHotels` proxies getOrganizations



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* initialize

WTHotelIndex.initialize(__owner, _lifToken) `nonpayable` `485cc955`

> Initializer for upgradeable contracts.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | __owner | The address of the contract owner |
| *address* | _lifToken | The new contract address |


## *function* LifToken

WTHotelIndex.LifToken() `view` `554d8b37`





## *function* organizationsIndex

WTHotelIndex.organizationsIndex() `view` `63cd48fb`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* createHotel

WTHotelIndex.createHotel(dataUri) `nonpayable` `6e36f8b0`

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

WTHotelIndex.deregisterHotel(hotel) `nonpayable` `7dd2eea0`

> `deregisterHotel` proxies and externalizes deregisterOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | Hotel's address |


## *function* getOrganizations

WTHotelIndex.getOrganizations() `view` `9754a3a8`

> `getOrganizations` get `organizations` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* hotelsIndex

WTHotelIndex.hotelsIndex(hotel) `view` `9f9bfeb8`

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

WTHotelIndex.organizationsByManagerIndex() `view` `a6fd23b7`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* organizationsByManager

WTHotelIndex.organizationsByManager(, ) `view` `b4d9b278`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |
| *uint256* |  | undefined |


## *function* getOrganizationsLength

WTHotelIndex.getOrganizationsLength() `view` `b9306681`

> `getOrganizationsLength` get the length of the `organizations` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* getHotelsByManager

WTHotelIndex.getHotelsByManager(manager) `view` `bb979c3d`

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

WTHotelIndex.getHotelsLength() `view` `ca63a55b`

> `getHotelsLength` proxies getOrganizationsLength



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* hotels

WTHotelIndex.hotels(index) `view` `cd338265`

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

WTHotelIndex.createAndRegisterHotel(dataUri) `nonpayable` `d5b3f23f`

> `createAndRegisterHotel` proxies and externalizes createAndRegisterOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | Hotel's data pointer |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* registerHotel

WTHotelIndex.registerHotel(hotel) `nonpayable` `dcd003fb`

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

WTHotelIndex.organizations() `view` `e792dd8a`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* setLifToken

WTHotelIndex.setLifToken(_lifToken) `nonpayable` `f2f0967b`

> `setLifToken` allows the owner of the contract to change the address of the LifToken contract. Allows to set the address to zero address

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _lifToken | The new contract address |


## *function* transferOwnership

WTHotelIndex.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |


## *function* getOrganizationsByManager

WTHotelIndex.getOrganizationsByManager(manager) `view` `f439cdfc`

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

WTHotelIndex.OrganizationCreated(organization) `47b68893`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OrganizationRegistered

WTHotelIndex.OrganizationRegistered(organization, managerIndex, allIndex) `0896224a`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |
| *uint256* | managerIndex | not indexed |
| *uint256* | allIndex | not indexed |

## *event* OrganizationDeregistered

WTHotelIndex.OrganizationDeregistered(organization) `2ef6503b`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OwnershipTransferred

WTHotelIndex.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
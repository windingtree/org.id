* [HotelDirectory](#hoteldirectory)
  * [getHotels](#function-gethotels)
  * [organizationsByOwnerDeprecated](#function-organizationsbyownerdeprecated)
  * [removeHotel](#function-removehotel)
  * [initialize](#function-initialize)
  * [addHotel](#function-addhotel)
  * [LifToken](#function-liftoken)
  * [organizationsByOwnerIndexDeprecated](#function-organizationsbyownerindexdeprecated)
  * [organizationsIndex](#function-organizationsindex)
  * [createHotel](#function-createhotel)
  * [owner](#function-owner)
  * [createAndAddHotel](#function-createandaddhotel)
  * [getOrganizations](#function-getorganizations)
  * [hotelsIndex](#function-hotelsindex)
  * [getOrganizationsLength](#function-getorganizationslength)
  * [getHotelsLength](#function-gethotelslength)
  * [hotels](#function-hotels)
  * [organizations](#function-organizations)
  * [setLifToken](#function-setliftoken)
  * [transferOwnership](#function-transferownership)
  * [OrganizationCreated](#event-organizationcreated)
  * [OrganizationAdded](#event-organizationadded)
  * [OrganizationRemoveed](#event-organizationremoveed)
  * [OwnershipTransferred](#event-ownershiptransferred)

# HotelDirectory


## *function* getHotels

HotelDirectory.getHotels() `view` `0d2e677a`

> `getHotels` proxies getOrganizations



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* organizationsByOwnerDeprecated

HotelDirectory.organizationsByOwnerDeprecated(, ) `view` `18531bb6`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |
| *uint256* |  | undefined |


## *function* removeHotel

HotelDirectory.removeHotel(hotel) `nonpayable` `315610a1`

> `removeHotel` proxies and externalizes removeOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | Hotel's address |


## *function* initialize

HotelDirectory.initialize(__owner, _lifToken) `nonpayable` `485cc955`

> Initializer for upgradeable contracts.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | __owner | The address of the contract owner |
| *address* | _lifToken | The new contract address |


## *function* addHotel

HotelDirectory.addHotel(hotel) `nonpayable` `50cd3fc0`

> `addHotel` proxies and externalizes addOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | Hotel's address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* LifToken

HotelDirectory.LifToken() `view` `554d8b37`





## *function* organizationsByOwnerIndexDeprecated

HotelDirectory.organizationsByOwnerIndexDeprecated() `view` `5bb087d8`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* organizationsIndex

HotelDirectory.organizationsIndex() `view` `63cd48fb`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* createHotel

HotelDirectory.createHotel(dataUri) `nonpayable` `6e36f8b0`

> `createHotel` proxies and externalizes createOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | Hotel's data pointer |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* owner

HotelDirectory.owner() `view` `8da5cb5b`

> Returns the address of the current owner.




## *function* createAndAddHotel

HotelDirectory.createAndAddHotel(dataUri) `nonpayable` `95a5f074`

> `createAndAddHotel` proxies and externalizes createAndAddOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | Hotel's data pointer |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* getOrganizations

HotelDirectory.getOrganizations() `view` `9754a3a8`

> `getOrganizations` get `organizations` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* hotelsIndex

HotelDirectory.hotelsIndex(hotel) `view` `9f9bfeb8`

> `hotelsIndex` aliases organizatoinsIndex 

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | Hotel's address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* getOrganizationsLength

HotelDirectory.getOrganizationsLength() `view` `b9306681`

> `getOrganizationsLength` get the length of the `organizations` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* getHotelsLength

HotelDirectory.getHotelsLength() `view` `ca63a55b`

> `getHotelsLength` proxies getOrganizationsLength



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* hotels

HotelDirectory.hotels(index) `view` `cd338265`

> `hotels` aliases organizations

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | index | Hotel's index |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* organizations

HotelDirectory.organizations() `view` `e792dd8a`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* setLifToken

HotelDirectory.setLifToken(_lifToken) `nonpayable` `f2f0967b`

> `setLifToken` allows the owner of the contract to change the address of the LifToken contract. Allows to set the address to zero address

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _lifToken | The new contract address |


## *function* transferOwnership

HotelDirectory.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |

## *event* OrganizationCreated

HotelDirectory.OrganizationCreated(organization) `47b68893`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OrganizationAdded

HotelDirectory.OrganizationAdded(organization, index) `424a91ec`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |
| *uint256* | index | not indexed |

## *event* OrganizationRemoveed

HotelDirectory.OrganizationRemoveed(organization) `3325ef95`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OwnershipTransferred

HotelDirectory.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
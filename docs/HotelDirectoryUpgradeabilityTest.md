* [HotelDirectoryUpgradeabilityTest](#hoteldirectoryupgradeabilitytest)
  * [getHotels](#function-gethotels)
  * [organizationsByOwnerDeprecated](#function-organizationsbyownerdeprecated)
  * [newFunction](#function-newfunction)
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
  * [OrganizationRemoved](#event-organizationremoved)
  * [OwnershipTransferred](#event-ownershiptransferred)

# HotelDirectoryUpgradeabilityTest


## *function* getHotels

HotelDirectoryUpgradeabilityTest.getHotels() `view` `0d2e677a`

> `getHotels` proxies getOrganizations



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* organizationsByOwnerDeprecated

HotelDirectoryUpgradeabilityTest.organizationsByOwnerDeprecated(, ) `view` `18531bb6`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |
| *uint256* |  | undefined |


## *function* newFunction

HotelDirectoryUpgradeabilityTest.newFunction() `pure` `1b28d63e`





## *function* removeHotel

HotelDirectoryUpgradeabilityTest.removeHotel(hotel) `nonpayable` `315610a1`

> `removeHotel` proxies and externalizes removeOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | hotel | Hotel's address |


## *function* initialize

HotelDirectoryUpgradeabilityTest.initialize(__owner, _lifToken) `nonpayable` `485cc955`

> Initializer for upgradeable contracts.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | __owner | The address of the contract owner |
| *address* | _lifToken | The new contract address |


## *function* addHotel

HotelDirectoryUpgradeabilityTest.addHotel(hotel) `nonpayable` `50cd3fc0`

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

HotelDirectoryUpgradeabilityTest.LifToken() `view` `554d8b37`





## *function* organizationsByOwnerIndexDeprecated

HotelDirectoryUpgradeabilityTest.organizationsByOwnerIndexDeprecated() `view` `5bb087d8`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* organizationsIndex

HotelDirectoryUpgradeabilityTest.organizationsIndex() `view` `63cd48fb`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* createHotel

HotelDirectoryUpgradeabilityTest.createHotel(dataUri) `nonpayable` `6e36f8b0`

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

HotelDirectoryUpgradeabilityTest.owner() `view` `8da5cb5b`

> Returns the address of the current owner.




## *function* createAndAddHotel

HotelDirectoryUpgradeabilityTest.createAndAddHotel(dataUri) `nonpayable` `95a5f074`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | undefined |


## *function* getOrganizations

HotelDirectoryUpgradeabilityTest.getOrganizations() `view` `9754a3a8`

> `getOrganizations` get `organizations` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* hotelsIndex

HotelDirectoryUpgradeabilityTest.hotelsIndex(hotel) `view` `9f9bfeb8`

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

HotelDirectoryUpgradeabilityTest.getOrganizationsLength() `view` `b9306681`

> `getOrganizationsLength` get the length of the `organizations` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* getHotelsLength

HotelDirectoryUpgradeabilityTest.getHotelsLength() `view` `ca63a55b`

> `getHotelsLength` proxies getOrganizationsLength



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* hotels

HotelDirectoryUpgradeabilityTest.hotels(index) `view` `cd338265`

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

HotelDirectoryUpgradeabilityTest.organizations() `view` `e792dd8a`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* setLifToken

HotelDirectoryUpgradeabilityTest.setLifToken(_lifToken) `nonpayable` `f2f0967b`

> `setLifToken` allows the owner of the contract to change the address of the LifToken contract. Allows to set the address to zero address

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _lifToken | The new contract address |


## *function* transferOwnership

HotelDirectoryUpgradeabilityTest.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |

## *event* OrganizationCreated

HotelDirectoryUpgradeabilityTest.OrganizationCreated(organization) `47b68893`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OrganizationAdded

HotelDirectoryUpgradeabilityTest.OrganizationAdded(organization, index) `424a91ec`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |
| *uint256* | index | not indexed |

## *event* OrganizationRemoved

HotelDirectoryUpgradeabilityTest.OrganizationRemoved(organization) `ed5ec13b`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OwnershipTransferred

HotelDirectoryUpgradeabilityTest.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
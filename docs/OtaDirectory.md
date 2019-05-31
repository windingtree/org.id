* [OtaDirectory](#otadirectory)
  * [organizationsByOwnerDeprecated](#function-organizationsbyownerdeprecated)
  * [createAndAddOta](#function-createandaddota)
  * [createOta](#function-createota)
  * [otasIndex](#function-otasindex)
  * [initialize](#function-initialize)
  * [LifToken](#function-liftoken)
  * [organizationsByOwnerIndexDeprecated](#function-organizationsbyownerindexdeprecated)
  * [getOtas](#function-getotas)
  * [organizationsIndex](#function-organizationsindex)
  * [addOta](#function-addota)
  * [owner](#function-owner)
  * [getOrganizations](#function-getorganizations)
  * [otas](#function-otas)
  * [getOrganizationsLength](#function-getorganizationslength)
  * [getOtasLength](#function-getotaslength)
  * [removeOta](#function-removeota)
  * [organizations](#function-organizations)
  * [setLifToken](#function-setliftoken)
  * [transferOwnership](#function-transferownership)
  * [OrganizationCreated](#event-organizationcreated)
  * [OrganizationAdded](#event-organizationadded)
  * [OrganizationRemoved](#event-organizationremoved)
  * [OwnershipTransferred](#event-ownershiptransferred)

# OtaDirectory


## *function* organizationsByOwnerDeprecated

OtaDirectory.organizationsByOwnerDeprecated(, ) `view` `18531bb6`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |
| *uint256* |  | undefined |


## *function* createAndAddOta

OtaDirectory.createAndAddOta(dataUri) `nonpayable` `1adc44cd`

> `createAndAddOta` proxies and externalizes createAndAddOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | Ota's data pointer |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* createOta

OtaDirectory.createOta(dataUri) `nonpayable` `38004cf4`

> `createOta` proxies and externalizes createOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | Ota's data pointer |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* otasIndex

OtaDirectory.otasIndex(ota) `view` `460d3841`

> `otasIndex` aliases organizationsIndex 

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | ota | Ota's address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* initialize

OtaDirectory.initialize(__owner, _lifToken) `nonpayable` `485cc955`

> Initializer for upgradeable contracts.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | __owner | The address of the contract owner |
| *address* | _lifToken | The new contract address |


## *function* LifToken

OtaDirectory.LifToken() `view` `554d8b37`





## *function* organizationsByOwnerIndexDeprecated

OtaDirectory.organizationsByOwnerIndexDeprecated() `view` `5bb087d8`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* getOtas

OtaDirectory.getOtas() `view` `5c8a8c8d`

> `getOtas` proxies getOrganizations



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* organizationsIndex

OtaDirectory.organizationsIndex() `view` `63cd48fb`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* addOta

OtaDirectory.addOta(ota) `nonpayable` `84902979`

> `addOta` proxies and externalizes addOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | ota | Ota's address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* owner

OtaDirectory.owner() `view` `8da5cb5b`

> Returns the address of the current owner.




## *function* getOrganizations

OtaDirectory.getOrganizations() `view` `9754a3a8`

> `getOrganizations` get `organizations` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* otas

OtaDirectory.otas(index) `view` `b02f7f65`

> `otas` aliases organizations

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | index | Ota's index |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* getOrganizationsLength

OtaDirectory.getOrganizationsLength() `view` `b9306681`

> `getOrganizationsLength` get the length of the `organizations` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* getOtasLength

OtaDirectory.getOtasLength() `view` `d0be6aa3`

> `getOtasLength` proxies getOrganizationsLength



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* removeOta

OtaDirectory.removeOta(ota) `nonpayable` `de6bd6b2`

> `removeOta` proxies and externalizes removeOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | ota | Ota's address |


## *function* organizations

OtaDirectory.organizations() `view` `e792dd8a`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* setLifToken

OtaDirectory.setLifToken(_lifToken) `nonpayable` `f2f0967b`

> `setLifToken` allows the owner of the contract to change the address of the LifToken contract. Allows to set the address to zero address

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _lifToken | The new contract address |


## *function* transferOwnership

OtaDirectory.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |

## *event* OrganizationCreated

OtaDirectory.OrganizationCreated(organization) `47b68893`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OrganizationAdded

OtaDirectory.OrganizationAdded(organization, index) `424a91ec`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |
| *uint256* | index | not indexed |

## *event* OrganizationRemoved

OtaDirectory.OrganizationRemoved(organization) `ed5ec13b`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OwnershipTransferred

OtaDirectory.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
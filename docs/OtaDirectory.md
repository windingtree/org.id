* [OtaDirectory](#otadirectory)
  * [organizationsByOwnerDeprecated](#function-organizationsbyownerdeprecated)
  * [createOta](#function-createota)
  * [deregisterOta](#function-deregisterota)
  * [otasIndex](#function-otasindex)
  * [initialize](#function-initialize)
  * [LifToken](#function-liftoken)
  * [organizationsByOwnerIndexDeprecated](#function-organizationsbyownerindexdeprecated)
  * [getOtas](#function-getotas)
  * [organizationsIndex](#function-organizationsindex)
  * [getOrganizations](#function-getorganizations)
  * [otas](#function-otas)
  * [getOrganizationsLength](#function-getorganizationslength)
  * [getOtasLength](#function-getotaslength)
  * [organizations](#function-organizations)
  * [createAndRegisterOta](#function-createandregisterota)
  * [setLifToken](#function-setliftoken)
  * [transferOwnership](#function-transferownership)
  * [registerOta](#function-registerota)
  * [OrganizationCreated](#event-organizationcreated)
  * [OrganizationRegistered](#event-organizationregistered)
  * [OrganizationDeregistered](#event-organizationderegistered)
  * [OwnershipTransferred](#event-ownershiptransferred)

# OtaDirectory


## *function* organizationsByOwnerDeprecated

OtaDirectory.organizationsByOwnerDeprecated(, ) `view` `18531bb6`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |
| *uint256* |  | undefined |


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

## *function* deregisterOta

OtaDirectory.deregisterOta(ota) `nonpayable` `453a1f6a`

> `deregisterOta` proxies and externalizes deregisterOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | ota | Ota's address |


## *function* otasIndex

OtaDirectory.otasIndex(ota) `view` `460d3841`

> `otasIndex` aliases organizatoinsIndex 

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

## *function* organizations

OtaDirectory.organizations() `view` `e792dd8a`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* createAndRegisterOta

OtaDirectory.createAndRegisterOta(dataUri) `nonpayable` `f1e34560`

> `createAndRegisterOta` proxies and externalizes createAndRegisterOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | Ota's data pointer |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

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


## *function* registerOta

OtaDirectory.registerOta(ota) `nonpayable` `ff69461c`

> `registerOta` proxies and externalizes registerOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | ota | Ota's address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |
## *event* OrganizationCreated

OtaDirectory.OrganizationCreated(organization) `47b68893`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OrganizationRegistered

OtaDirectory.OrganizationRegistered(organization, index) `0aa9369e`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |
| *uint256* | index | not indexed |

## *event* OrganizationDeregistered

OtaDirectory.OrganizationDeregistered(organization) `2ef6503b`

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
* [OrganizationFactoryUpgradeabilityTest](#organizationfactoryupgradeabilitytest)
  * [createdOrganizationsIndex](#function-createdorganizationsindex)
  * [newFunction](#function-newfunction)
  * [getCreatedOrganizations](#function-getcreatedorganizations)
  * [getCreatedOrganizationsLength](#function-getcreatedorganizationslength)
  * [create](#function-create)
  * [initialize](#function-initialize)
  * [owner](#function-owner)
  * [createdOrganizations](#function-createdorganizations)
  * [createAndAddToDirectory](#function-createandaddtodirectory)
  * [transferOwnership](#function-transferownership)
  * [OrganizationCreated](#event-organizationcreated)
  * [OwnershipTransferred](#event-ownershiptransferred)

# OrganizationFactoryUpgradeabilityTest


## *function* createdOrganizationsIndex

OrganizationFactoryUpgradeabilityTest.createdOrganizationsIndex(organization) `view` `0a1bd90b`

> `createdOrganizationsIndex` get index of Organization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | undefined |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* newFunction

OrganizationFactoryUpgradeabilityTest.newFunction() `pure` `1b28d63e`





## *function* getCreatedOrganizations

OrganizationFactoryUpgradeabilityTest.getCreatedOrganizations() `view` `270ca0f0`

> `getCreatedOrganizations` get `createdOrganizations` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* getCreatedOrganizationsLength

OrganizationFactoryUpgradeabilityTest.getCreatedOrganizationsLength() `view` `3db297e9`

> `getCreatedOrganizationsLength` get the length of the `createdOrganizations` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* create

OrganizationFactoryUpgradeabilityTest.create(orgJsonUri, orgJsonHash) `nonpayable` `3dee0c50`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | orgJsonUri | undefined |
| *bytes32* | orgJsonHash | undefined |


## *function* initialize

OrganizationFactoryUpgradeabilityTest.initialize(__owner, _app) `nonpayable` `485cc955`

> Initializer for upgradeable contracts.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | __owner | The address of the contract owner |
| *address* | _app | ZeppelinOS App address |


## *function* owner

OrganizationFactoryUpgradeabilityTest.owner() `view` `8da5cb5b`

> Returns the address of the current owner.




## *function* createdOrganizations

OrganizationFactoryUpgradeabilityTest.createdOrganizations(index) `view` `9e356f4c`

> `createdOrganizations` get Organization address on an index

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | index | undefined |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* createAndAddToDirectory

OrganizationFactoryUpgradeabilityTest.createAndAddToDirectory(orgJsonUri, orgJsonHash, directory) `nonpayable` `af276209`

> `createAndAddToDirectory` Creates the organization contract and tries to add it to a SegmentDirectory living on the passed `directory` address.     * We cannot reuse create call due to the Organization ownership restrictions. 

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | orgJsonUri | Organization's data pointer |
| *bytes32* | orgJsonHash | Organization's data hash |
| *address* | directory | Segment directory's address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* transferOwnership

OrganizationFactoryUpgradeabilityTest.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |

## *event* OrganizationCreated

OrganizationFactoryUpgradeabilityTest.OrganizationCreated(organization) `47b68893`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OwnershipTransferred

OrganizationFactoryUpgradeabilityTest.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
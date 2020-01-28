* [OrganizationFactory](#organizationfactory)
  * [OrganizationCreated](#event-organizationcreated)
  * [OwnershipTransferred](#event-ownershiptransferred)
  * [create](#function-create)
  * [create](#function-create)
  * [createAndAddToDirectory](#function-createandaddtodirectory)
  * [createAndAddToDirectory](#function-createandaddtodirectory)
  * [createdOrganizations](#function-createdorganizations)
  * [createdOrganizationsIndex](#function-createdorganizationsindex)
  * [getCreatedOrganizations](#function-getcreatedorganizations)
  * [getCreatedOrganizationsLength](#function-getcreatedorganizationslength)
  * [initialize](#function-initialize)
  * [owner](#function-owner)
  * [transferOwnership](#function-transferownership)

# OrganizationFactory

## *event* OrganizationCreated

OrganizationFactory.OrganizationCreated(organization) `47b68893`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OwnershipTransferred

OrganizationFactory.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


## *function* create

OrganizationFactory.create(orgJsonUri, orgJsonHash) `nonpayable` `3dee0c50`

> `create` proxies and externalizes createOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | orgJsonUri | Organization's data pointer |
| *bytes32* | orgJsonHash | Organization's data hash |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* create

OrganizationFactory.create(orgJsonUri, orgJsonHash, parentEntity, entityDirector) `nonpayable` `a6dd857e`

> This version of 'create' is dedicated to creation of subsidiaries

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | orgJsonUri | Organization's data pointer |
| *bytes32* | orgJsonHash | Organization's data hash |
| *address* | parentEntity | Parent organization address |
| *address* | entityDirector | Subsidiary director address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* createAndAddToDirectory

OrganizationFactory.createAndAddToDirectory(orgJsonUri, orgJsonHash, directory, parentEntity, entityDirector) `nonpayable` `00a5a6a3`

> This version of 'createAndAddToDirectory' is dedicated to creation of subsidiary and add it to a SegmentDirectory living on the passed `directory` address.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | orgJsonUri | Organization's data pointer |
| *bytes32* | orgJsonHash | Organization's data hash |
| *address* | directory | Segment directory's address |
| *address* | parentEntity | Parent organization address |
| *address* | entityDirector | Subsidiary director address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* createAndAddToDirectory

OrganizationFactory.createAndAddToDirectory(orgJsonUri, orgJsonHash, directory) `nonpayable` `af276209`

> `createAndAddToDirectory` proxies and externalizes create organization and add it to a SegmentDirectory living on the passed `directory` address.

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

## *function* createdOrganizations

OrganizationFactory.createdOrganizations(index) `view` `9e356f4c`

> `createdOrganizations` get Organization address on an index

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | index | undefined |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* createdOrganizationsIndex

OrganizationFactory.createdOrganizationsIndex(organization) `view` `0a1bd90b`

> `createdOrganizationsIndex` get index of Organization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | undefined |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* getCreatedOrganizations

OrganizationFactory.getCreatedOrganizations() `view` `270ca0f0`

> `getCreatedOrganizations` get `createdOrganizations` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* getCreatedOrganizationsLength

OrganizationFactory.getCreatedOrganizationsLength() `view` `3db297e9`

> `getCreatedOrganizationsLength` get the length of the `createdOrganizations` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* initialize

OrganizationFactory.initialize(__owner, _app) `nonpayable` `485cc955`

> Initializer for upgradeable contracts.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | __owner | The address of the contract owner |
| *address* | _app | ZeppelinOS App address |


## *function* owner

OrganizationFactory.owner() `view` `8da5cb5b`

> Returns the address of the current owner.




## *function* transferOwnership

OrganizationFactory.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |


---
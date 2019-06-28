* [AbstractOrganizationFactory](#abstractorganizationfactory)
  * [createdOrganizationsIndex](#function-createdorganizationsindex)
  * [createAndAddToDirectory](#function-createandaddtodirectory)
  * [getCreatedOrganizations](#function-getcreatedorganizations)
  * [getCreatedOrganizationsLength](#function-getcreatedorganizationslength)
  * [owner](#function-owner)
  * [createdOrganizations](#function-createdorganizations)
  * [create](#function-create)
  * [OrganizationCreated](#event-organizationcreated)
  * [OwnershipTransferred](#event-ownershiptransferred)

# AbstractOrganizationFactory


## *function* createdOrganizationsIndex

AbstractOrganizationFactory.createdOrganizationsIndex(organization) `view` `0a1bd90b`

> Returns index of `organization`

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | undefined |


## *function* createAndAddToDirectory

AbstractOrganizationFactory.createAndAddToDirectory(orgJsonUri, directory) `nonpayable` `1f7d8864`

> Creates new 0xORG smart contract and adds it to a segment directory in the same transaction

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | orgJsonUri | Organization's data pointer |
| *address* | directory | Segment directory address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* getCreatedOrganizations

AbstractOrganizationFactory.getCreatedOrganizations() `view` `270ca0f0`

> Returns a list of created organizations.




## *function* getCreatedOrganizationsLength

AbstractOrganizationFactory.getCreatedOrganizationsLength() `view` `3db297e9`

> Returns number of created organizations.




## *function* owner

AbstractOrganizationFactory.owner() `view` `8da5cb5b`

> Returns the address of the current owner.




## *function* createdOrganizations

AbstractOrganizationFactory.createdOrganizations(index) `view` `9e356f4c`

> Returns organization address on `index` position.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | index | undefined |


## *function* create

AbstractOrganizationFactory.create(orgJsonUri) `nonpayable` `b6a46b3b`

> Creates new 0xORG smart contract

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | orgJsonUri | Organization's data pointer |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |
## *event* OrganizationCreated

AbstractOrganizationFactory.OrganizationCreated(organization) `47b68893`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OwnershipTransferred

AbstractOrganizationFactory.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
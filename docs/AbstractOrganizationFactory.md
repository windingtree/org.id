* [AbstractOrganizationFactory](#abstractorganizationfactory)
  * [createdOrganizationsIndex](#function-createdorganizationsindex)
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


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | undefined |


## *function* getCreatedOrganizations

AbstractOrganizationFactory.getCreatedOrganizations() `view` `270ca0f0`





## *function* getCreatedOrganizationsLength

AbstractOrganizationFactory.getCreatedOrganizationsLength() `view` `3db297e9`





## *function* owner

AbstractOrganizationFactory.owner() `view` `8da5cb5b`





## *function* createdOrganizations

AbstractOrganizationFactory.createdOrganizations(index) `view` `9e356f4c`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | index | undefined |


## *function* create

AbstractOrganizationFactory.create(orgJsonUri) `nonpayable` `b6a46b3b`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | orgJsonUri | undefined |

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
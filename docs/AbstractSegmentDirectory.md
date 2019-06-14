* [AbstractSegmentDirectory](#abstractsegmentdirectory)
  * [add](#function-add)
  * [getSegment](#function-getsegment)
  * [remove](#function-remove)
  * [organizationsIndex](#function-organizationsindex)
  * [getLifToken](#function-getliftoken)
  * [owner](#function-owner)
  * [getOrganizations](#function-getorganizations)
  * [getOrganizationsLength](#function-getorganizationslength)
  * [organizations](#function-organizations)
  * [OrganizationAdded](#event-organizationadded)
  * [OrganizationRemoved](#event-organizationremoved)
  * [OwnershipTransferred](#event-ownershiptransferred)

# AbstractSegmentDirectory


## *function* add

AbstractSegmentDirectory.add(organization) `nonpayable` `0a3b0a4f`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | undefined |


## *function* getSegment

AbstractSegmentDirectory.getSegment() `view` `2203793c`





## *function* remove

AbstractSegmentDirectory.remove(organization) `nonpayable` `29092d0e`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | undefined |


## *function* organizationsIndex

AbstractSegmentDirectory.organizationsIndex(organization) `view` `63cd48fb`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | undefined |


## *function* getLifToken

AbstractSegmentDirectory.getLifToken() `view` `8b0728cf`





## *function* owner

AbstractSegmentDirectory.owner() `view` `8da5cb5b`





## *function* getOrganizations

AbstractSegmentDirectory.getOrganizations() `view` `9754a3a8`





## *function* getOrganizationsLength

AbstractSegmentDirectory.getOrganizationsLength() `view` `b9306681`





## *function* organizations

AbstractSegmentDirectory.organizations(index) `view` `e792dd8a`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | index | undefined |

## *event* OrganizationAdded

AbstractSegmentDirectory.OrganizationAdded(organization, index) `424a91ec`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |
| *uint256* | index | not indexed |

## *event* OrganizationRemoved

AbstractSegmentDirectory.OrganizationRemoved(organization) `ed5ec13b`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OwnershipTransferred

AbstractSegmentDirectory.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
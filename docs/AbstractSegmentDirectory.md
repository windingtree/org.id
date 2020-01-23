* [AbstractSegmentDirectory](#abstractsegmentdirectory)
  * [OrganizationAdded](#event-organizationadded)
  * [OrganizationRemoved](#event-organizationremoved)
  * [OwnershipTransferred](#event-ownershiptransferred)
  * [add](#function-add)
  * [getLifToken](#function-getliftoken)
  * [getOrganizations](#function-getorganizations)
  * [getOrganizationsLength](#function-getorganizationslength)
  * [getSegment](#function-getsegment)
  * [organizations](#function-organizations)
  * [organizationsIndex](#function-organizationsindex)
  * [owner](#function-owner)
  * [remove](#function-remove)

# AbstractSegmentDirectory

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


## *function* add

AbstractSegmentDirectory.add(organization) `nonpayable` `0a3b0a4f`

> Adds an organization to the list

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | undefined |


## *function* getLifToken

AbstractSegmentDirectory.getLifToken() `view` `8b0728cf`

> Returns the address of the associated lif token




## *function* getOrganizations

AbstractSegmentDirectory.getOrganizations() `view` `9754a3a8`

> Returns a list of added organizations. Might contain zero addresses.




## *function* getOrganizationsLength

AbstractSegmentDirectory.getOrganizationsLength() `view` `b9306681`

> Returns the number of added organizations. Might contain zero addresses (these remain after removing an organization).




## *function* getSegment

AbstractSegmentDirectory.getSegment() `view` `2203793c`

> Returns the segment name




## *function* organizations

AbstractSegmentDirectory.organizations(index) `view` `e792dd8a`

> Returns organization address on `index` position.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | index | undefined |


## *function* organizationsIndex

AbstractSegmentDirectory.organizationsIndex(organization) `view` `63cd48fb`

> Returns index of `organization`

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | undefined |


## *function* owner

AbstractSegmentDirectory.owner() `view` `8da5cb5b`

> Returns the address of the current owner.




## *function* remove

AbstractSegmentDirectory.remove(organization) `nonpayable` `29092d0e`

> Removes an organization from the list

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | undefined |


---
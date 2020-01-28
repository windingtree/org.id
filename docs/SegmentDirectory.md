* [SegmentDirectory](#segmentdirectory)
  * [OrganizationAdded](#event-organizationadded)
  * [OrganizationRemoved](#event-organizationremoved)
  * [OwnershipTransferred](#event-ownershiptransferred)
  * [add](#function-add)
  * [getLifToken](#function-getliftoken)
  * [getOrganizations](#function-getorganizations)
  * [getOrganizationsLength](#function-getorganizationslength)
  * [getSegment](#function-getsegment)
  * [initialize](#function-initialize)
  * [organizations](#function-organizations)
  * [organizationsIndex](#function-organizationsindex)
  * [owner](#function-owner)
  * [remove](#function-remove)
  * [resolveLifTokenFromENS](#function-resolveliftokenfromens)
  * [setSegment](#function-setsegment)
  * [transferOwnership](#function-transferownership)

# SegmentDirectory

## *event* OrganizationAdded

SegmentDirectory.OrganizationAdded(organization, index) `424a91ec`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |
| *uint256* | index | not indexed |

## *event* OrganizationRemoved

SegmentDirectory.OrganizationRemoved(organization) `ed5ec13b`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OwnershipTransferred

SegmentDirectory.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


## *function* add

SegmentDirectory.add(organization) `nonpayable` `0a3b0a4f`

> `add` proxies and externalizes addOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | Organization's address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* getLifToken

SegmentDirectory.getLifToken() `view` `8b0728cf`

> `getLifToken` Returns address of set Lif token



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* getOrganizations

SegmentDirectory.getOrganizations() `view` `9754a3a8`

> `getOrganizations` get `organizations` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* getOrganizationsLength

SegmentDirectory.getOrganizationsLength() `view` `b9306681`

> `getOrganizationsLength` get the length of the `organizations` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* getSegment

SegmentDirectory.getSegment() `view` `2203793c`

> `getSegment` Returns segment name



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *string* |  | undefined |

## *function* initialize

SegmentDirectory.initialize(__owner, __segment, __lifToken) `nonpayable` `7bb7c0d8`

> Initializer for upgradeable contracts.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | __owner | The address of the contract owner |
| *string* | __segment | The segment name |
| *address* | __lifToken | The Lif Token contract address |


## *function* organizations

SegmentDirectory.organizations(index) `view` `e792dd8a`

> `organizations` get Organization address on an index

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | index | undefined |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* organizationsIndex

SegmentDirectory.organizationsIndex(organization) `view` `63cd48fb`

> `organizationsIndex` get index of Organization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | undefined |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* owner

SegmentDirectory.owner() `view` `8da5cb5b`

> Returns the address of the current owner.




## *function* remove

SegmentDirectory.remove(organization) `nonpayable` `29092d0e`

> `remove` proxies and externalizes removeOrganization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | Organization's address |


## *function* resolveLifTokenFromENS

SegmentDirectory.resolveLifTokenFromENS(_ENS) `nonpayable` `423ba56e`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _ENS | undefined |


## *function* setSegment

SegmentDirectory.setSegment(__segment) `nonpayable` `a81159ea`

> `setSegment` allows the owner of the contract to change the segment name.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | __segment | The new segment name |


## *function* transferOwnership

SegmentDirectory.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |


---
* [WindingTreeEntrypoint](#windingtreeentrypoint)
  * [getSegmentsLength](#function-getsegmentslength)
  * [getOrganizationFactory](#function-getorganizationfactory)
  * [segments](#function-segments)
  * [setSegment](#function-setsegment)
  * [removeSegment](#function-removesegment)
  * [directories](#function-directories)
  * [resolveLifTokenFromENS](#function-resolveliftokenfromens)
  * [getSegmentName](#function-getsegmentname)
  * [_lifToken](#function-_liftoken)
  * [organizationFactory](#function-organizationfactory)
  * [getSegmentsIndex](#function-getsegmentsindex)
  * [getLifToken](#function-getliftoken)
  * [owner](#function-owner)
  * [segmentsIndex](#function-segmentsindex)
  * [getSegment](#function-getsegment)
  * [setOrganizationFactory](#function-setorganizationfactory)
  * [initialize](#function-initialize)
  * [transferOwnership](#function-transferownership)
  * [OwnershipTransferred](#event-ownershiptransferred)
  * [SegmentSet](#event-segmentset)
  * [OrganizationFactorySet](#event-organizationfactoryset)

# WindingTreeEntrypoint


## *function* getSegmentsLength

WindingTreeEntrypoint.getSegmentsLength() `view` `0ce6a272`

> `getSegmentsLength` get the length of the `segments` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* getOrganizationFactory

WindingTreeEntrypoint.getOrganizationFactory() `view` `163fdcc8`

> Returns Organization Factory address.



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* segments

WindingTreeEntrypoint.segments() `view` `31560626`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* setSegment

WindingTreeEntrypoint.setSegment(segment, addr) `nonpayable` `39f00d97`

> Sets an address for a segment. Overwrites existing value. Can be called only by the contract owner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | segment | Segment name |
| *address* | addr | New segment directory address |


## *function* removeSegment

WindingTreeEntrypoint.removeSegment(segment) `nonpayable` `3c4f8790`

> Sets an address for a segment to 0x0 address. Can be called only by the contract owner

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | segment | Segment name |


## *function* directories

WindingTreeEntrypoint.directories() `view` `3eb0f1a4`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* |  | undefined |


## *function* resolveLifTokenFromENS

WindingTreeEntrypoint.resolveLifTokenFromENS(_ENS) `nonpayable` `423ba56e`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _ENS | undefined |


## *function* getSegmentName

WindingTreeEntrypoint.getSegmentName(index) `view` `45eade19`

> `getSegmentName` get name of segment on given index

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | index | Segment index |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *string* |  | undefined |

## *function* _lifToken

WindingTreeEntrypoint._lifToken() `view` `5c8c66ee`





## *function* organizationFactory

WindingTreeEntrypoint.organizationFactory() `view` `81d6bb50`





## *function* getSegmentsIndex

WindingTreeEntrypoint.getSegmentsIndex(segment) `view` `861f1072`

> `getSegmentsIndex` get index of the segment by such name. On that index, segment's name is stored.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | segment | Segment name |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* getLifToken

WindingTreeEntrypoint.getLifToken() `view` `8b0728cf`

> `getLifToken` Returns address of set Lif token



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* owner

WindingTreeEntrypoint.owner() `view` `8da5cb5b`

> Returns the address of the current owner.




## *function* segmentsIndex

WindingTreeEntrypoint.segmentsIndex() `view` `9191178a`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* |  | undefined |


## *function* getSegment

WindingTreeEntrypoint.getSegment(segment) `view` `9997b0cc`

> `getSegment` Returns address of a segment or a 0x0 address if segment is unknown.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | segment | Segment name |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* setOrganizationFactory

WindingTreeEntrypoint.setOrganizationFactory(addr) `nonpayable` `a89fb282`

> Sets an address for the organization factory. Overwrites existing value. Can be called only by the contract owner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | addr | New organization factory address |


## *function* initialize

WindingTreeEntrypoint.initialize(__owner, __lifToken, _organizationFactory) `nonpayable` `c0c53b8b`

> Initializer for upgradeable contracts.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | __owner | The address of the contract owner |
| *address* | __lifToken | The LifToken contract address |
| *address* | _organizationFactory | The OrganizationFactory contract address |


## *function* transferOwnership

WindingTreeEntrypoint.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |

## *event* OwnershipTransferred

WindingTreeEntrypoint.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |

## *event* SegmentSet

WindingTreeEntrypoint.SegmentSet(segment, oldAddress, newAddress) `1e561672`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | segment | indexed |
| *address* | oldAddress | indexed |
| *address* | newAddress | indexed |

## *event* OrganizationFactorySet

WindingTreeEntrypoint.OrganizationFactorySet(oldAddress, newAddress) `3b79604b`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | oldAddress | indexed |
| *address* | newAddress | indexed |


---
* [WindingTreeEntrypoint](#windingtreeentrypoint)
  * [getSegmentIndex](#function-getsegmentindex)
  * [getSegmentsLength](#function-getsegmentslength)
  * [segments](#function-segments)
  * [setSegment](#function-setsegment)
  * [removeSegment](#function-removesegment)
  * [directories](#function-directories)
  * [getSegmentName](#function-getsegmentname)
  * [owner](#function-owner)
  * [getSegment](#function-getsegment)
  * [initialize](#function-initialize)
  * [segmentIndex](#function-segmentindex)
  * [transferOwnership](#function-transferownership)
  * [OwnershipTransferred](#event-ownershiptransferred)
  * [SegmentSet](#event-segmentset)

# WindingTreeEntrypoint


## *function* getSegmentIndex

WindingTreeEntrypoint.getSegmentIndex(segment) `view` `06b9a18c`

> `getSegmentIndex` get index of the segment by such name. On that index, segment's name is stored.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | segment | Segment name |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* getSegmentsLength

WindingTreeEntrypoint.getSegmentsLength() `view` `0ce6a272`

> `getSegmentsLength` get the length of the `segments` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

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

## *function* owner

WindingTreeEntrypoint.owner() `view` `8da5cb5b`

> Returns the address of the current owner.




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

## *function* initialize

WindingTreeEntrypoint.initialize(__owner) `nonpayable` `c4d66de8`

> Initializer for upgradeable contracts.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | __owner | The address of the contract owner |


## *function* segmentIndex

WindingTreeEntrypoint.segmentIndex() `view` `e37064bd`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* |  | undefined |


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


---
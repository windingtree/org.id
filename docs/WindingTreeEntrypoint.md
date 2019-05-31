* [WindingTreeEntrypoint](#windingtreeentrypoint)
  * [getSegmentsLength](#function-getsegmentslength)
  * [segments](#function-segments)
  * [setSegment](#function-setsegment)
  * [removeSegment](#function-removesegment)
  * [directories](#function-directories)
  * [getSegmentName](#function-getsegmentname)
  * [initialize](#function-initialize)
  * [LifToken](#function-liftoken)
  * [getSegmentsIndex](#function-getsegmentsindex)
  * [owner](#function-owner)
  * [segmentsIndex](#function-segmentsindex)
  * [getSegment](#function-getsegment)
  * [setLifToken](#function-setliftoken)
  * [transferOwnership](#function-transferownership)
  * [OwnershipTransferred](#event-ownershiptransferred)
  * [SegmentSet](#event-segmentset)

# WindingTreeEntrypoint


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

## *function* initialize

WindingTreeEntrypoint.initialize(__owner, _lifToken) `nonpayable` `485cc955`

> Initializer for upgradeable contracts.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | __owner | The address of the contract owner |
| *address* | _lifToken | The new contract address |


## *function* LifToken

WindingTreeEntrypoint.LifToken() `view` `554d8b37`





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

## *function* setLifToken

WindingTreeEntrypoint.setLifToken(_lifToken) `nonpayable` `f2f0967b`

> `setLifToken` allows the owner of the contract to change the address of the LifToken contract. Allows to set the address to zero address

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _lifToken | The new contract address |


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
* [SegmentDirectoryInterface](#segmentdirectoryinterface)
  * [add](#function-add)
  * [getLifToken](#function-getliftoken)
  * [getOrganizations](#function-getorganizations)
  * [getOrganizationsLength](#function-getorganizationslength)
  * [getSegment](#function-getsegment)
  * [organizations](#function-organizations)
  * [organizationsIndex](#function-organizationsindex)
  * [owner](#function-owner)
  * [remove](#function-remove)
  * [reportUpdate](#function-reportupdate)
  * [setSegment](#function-setsegment)
  * [transferOwnership](#function-transferownership)

# SegmentDirectoryInterface


## *function* add

SegmentDirectoryInterface.add(organization) `nonpayable` `0a3b0a4f`

> Adds an organization to the list

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | undefined |


## *function* getLifToken

SegmentDirectoryInterface.getLifToken() `view` `8b0728cf`

> Returns the address of the associated lif token




## *function* getOrganizations

SegmentDirectoryInterface.getOrganizations() `view` `9754a3a8`

> Returns a list of added organizations. Might contain zero addresses.




## *function* getOrganizationsLength

SegmentDirectoryInterface.getOrganizationsLength() `view` `b9306681`

> Returns the number of added organizations. Might contain zero addresses (these remain after removing an organization).




## *function* getSegment

SegmentDirectoryInterface.getSegment() `view` `2203793c`

> Returns the segment name




## *function* organizations

SegmentDirectoryInterface.organizations(index) `view` `e792dd8a`

> Returns organization address on `index` position.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | index | undefined |


## *function* organizationsIndex

SegmentDirectoryInterface.organizationsIndex(organization) `view` `63cd48fb`

> Returns index of `organization`

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | undefined |


## *function* owner

SegmentDirectoryInterface.owner() `view` `8da5cb5b`

> Returns the address of the current owner.




## *function* remove

SegmentDirectoryInterface.remove(organization) `nonpayable` `29092d0e`

> Removes an organization from the list

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | undefined |


## *function* reportUpdate

SegmentDirectoryInterface.reportUpdate() `nonpayable` `873d45bf`

> This function is dedicated to receiving signals  about updates from registered organizations




## *function* setSegment

SegmentDirectoryInterface.setSegment(__segment) `nonpayable` `a81159ea`

> `setSegment` allows the owner of the contract to change the segment name.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | __segment | The new segment name |


## *function* transferOwnership

SegmentDirectoryInterface.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |


---
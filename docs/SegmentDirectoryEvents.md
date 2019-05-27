* [SegmentDirectoryEvents](#segmentdirectoryevents)
  * [OrganizationCreated](#event-organizationcreated)
  * [OrganizationAdded](#event-organizationadded)
  * [OrganizationRemoveed](#event-organizationremoveed)
  * [OwnershipTransferred](#event-ownershiptransferred)

# SegmentDirectoryEvents

## *event* OrganizationCreated

SegmentDirectoryEvents.OrganizationCreated(organization) `47b68893`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OrganizationAdded

SegmentDirectoryEvents.OrganizationAdded(organization, index) `424a91ec`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |
| *uint256* | index | not indexed |

## *event* OrganizationRemoveed

SegmentDirectoryEvents.OrganizationRemoveed(organization) `3325ef95`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OwnershipTransferred

SegmentDirectoryEvents.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
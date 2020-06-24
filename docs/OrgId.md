* [OrgId](#orgid)
  * [DirectorshipAccepted](#event-directorshipaccepted)
  * [DirectorshipTransferred](#event-directorshiptransferred)
  * [OrgJsonChanged](#event-orgjsonchanged)
  * [OrganizationActiveStateChanged](#event-organizationactivestatechanged)
  * [OrganizationCreated](#event-organizationcreated)
  * [OrganizationOwnershipTransferred](#event-organizationownershiptransferred)
  * [OwnershipTransferred](#event-ownershiptransferred)
  * [UnitCreated](#event-unitcreated)
  * [acceptDirectorship](#function-acceptdirectorship)
  * [createOrganization](#function-createorganization)
  * [createUnit](#function-createunit)
  * [getOrganization](#function-getorganization)
  * [getOrganizations](#function-getorganizations)
  * [getUnits](#function-getunits)
  * [initialize](#function-initialize)
  * [isOwner](#function-isowner)
  * [owner](#function-owner)
  * [renounceDirectorship](#function-renouncedirectorship)
  * [renounceOwnership](#function-renounceownership)
  * [setInterfaces](#function-setinterfaces)
  * [setOrgJson](#function-setorgjson)
  * [supportsInterface](#function-supportsinterface)
  * [toggleActiveState](#function-toggleactivestate)
  * [transferDirectorship](#function-transferdirectorship)
  * [transferOrganizationOwnership](#function-transferorganizationownership)
  * [transferOwnership](#function-transferownership)

# OrgId

## *event* DirectorshipAccepted

OrgId.DirectorshipAccepted(orgId, director) `2f2df3ca`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *address* | director | indexed |

## *event* DirectorshipTransferred

OrgId.DirectorshipTransferred(orgId, previousDirector, newDirector) `f48a0476`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *address* | previousDirector | indexed |
| *address* | newDirector | indexed |

## *event* OrgJsonChanged

OrgId.OrgJsonChanged(orgId, previousOrgJsonHash, previousOrgJsonUri, previousOrgJsonUriBackup1, previousOrgJsonUriBackup2, newOrgJsonHash, newOrgJsonUri, newOrgJsonUriBackup1, newOrgJsonUriBackup2) `f4652552`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *bytes32* | previousOrgJsonHash | indexed |
| *string* | previousOrgJsonUri | not indexed |
| *string* | previousOrgJsonUriBackup1 | not indexed |
| *string* | previousOrgJsonUriBackup2 | not indexed |
| *bytes32* | newOrgJsonHash | indexed |
| *string* | newOrgJsonUri | not indexed |
| *string* | newOrgJsonUriBackup1 | not indexed |
| *string* | newOrgJsonUriBackup2 | not indexed |

## *event* OrganizationActiveStateChanged

OrgId.OrganizationActiveStateChanged(orgId, previousState, newState) `74dc7d69`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *bool* | previousState | not indexed |
| *bool* | newState | not indexed |

## *event* OrganizationCreated

OrgId.OrganizationCreated(orgId, owner) `5bf391b9`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *address* | owner | indexed |

## *event* OrganizationOwnershipTransferred

OrgId.OrganizationOwnershipTransferred(orgId, previousOwner, newOwner) `92cbe7f5`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |

## *event* OwnershipTransferred

OrgId.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |

## *event* UnitCreated

OrgId.UnitCreated(parentOrgId, unitOrgId, director) `01b4c566`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | parentOrgId | indexed |
| *bytes32* | unitOrgId | indexed |
| *address* | director | indexed |


## *function* acceptDirectorship

OrgId.acceptDirectorship(orgId) `nonpayable` `781a9601`

> Accept director role

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | Unit's ORGiD hash |


## *function* createOrganization

OrgId.createOrganization(solt, orgJsonHash, orgJsonUri, orgJsonUriBackup1, orgJsonUriBackup2) `nonpayable` `b2c23371`

> Create organization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | solt | Unique hash required for identifier creation |
| *bytes32* | orgJsonHash | ORG.JSON's keccak256 hash |
| *string* | orgJsonUri | ORG.JSON URI (stored off-chain) |
| *string* | orgJsonUriBackup1 | ORG.JSON URI backup (stored off-chain) |
| *string* | orgJsonUriBackup2 | ORG.JSON URI backup (stored off-chain) |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | id | ORGiD byte32 hash |

## *function* createUnit

OrgId.createUnit(solt, parentOrgId, director, orgJsonHash, orgJsonUri, orgJsonUriBackup1, orgJsonUriBackup2) `nonpayable` `bf042ef2`

> Create organizational unit

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | solt | Unique hash required for identifier creation |
| *bytes32* | parentOrgId | Parent ORGiD hash |
| *address* | director | Unit director address |
| *bytes32* | orgJsonHash | ORG.JSON keccak256 hash |
| *string* | orgJsonUri | Unit ORG.JSON URI |
| *string* | orgJsonUriBackup1 | Unit ORG.JSON URI backup |
| *string* | orgJsonUriBackup2 | Unit ORG.JSON URI backup |


## *function* getOrganization

OrgId.getOrganization(_orgId) `view` `22b3cd4e`

> Get organization or unit's info by ORGiD hashReturn parameters marked by (*) are only applicable to units

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | _orgId | ORGiD hash |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* | exists | Returns `false` if ORGiD doesn't exist |
| *bytes32* | orgId | ORGiD hash |
| *bytes32* | orgJsonHash | ORG.JSON keccak256 hash |
| *string* | orgJsonUri | ORG.JSON URI |
| *string* | orgJsonUriBackup1 | ORG.JSON URI backup |
| *string* | orgJsonUriBackup2 | ORG.JSON URI backup |
| *bytes32* | parentOrgId | Parent ORGiD (*) |
| *address* | owner | Owner's address |
| *address* | director | Unit director's address (*) |
| *bool* | isActive | Indicates whether ORGiD is active |
| *bool* | isDirectorshipAccepted | Indicates whether director accepted the role (*) |

## *function* getOrganizations

OrgId.getOrganizations(includeInactive) `view` `0c70d7c5`

> Get all active organizations' ORGiD hashes

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* | includeInactive | Includes not active organizations into response |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32[]* |  | undefined |

## *function* getUnits

OrgId.getUnits(parentOrgId, includeInactive) `view` `0dd56c93`

> Get all active organizational units of a particular ORGiD

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | parentOrgId | Parent ORGiD hash |
| *bool* | includeInactive | Includes not active units into response |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32[]* |  | undefined |

## *function* initialize

OrgId.initialize(__owner) `nonpayable` `c4d66de8`

> Initializer for upgradeable contracts

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | __owner | Contract owner's address |


## *function* isOwner

OrgId.isOwner() `view` `8f32d59b`

> Returns true if the caller is the current owner.




## *function* owner

OrgId.owner() `view` `8da5cb5b`

> Returns the address of the current owner.




## *function* renounceDirectorship

OrgId.renounceDirectorship(orgId) `nonpayable` `096dde02`

> Unit directorship renounce

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | Unit's ORGiD hash |


## *function* renounceOwnership

OrgId.renounceOwnership() `nonpayable` `715018a6`

> Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner.     * NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.




## *function* setInterfaces

OrgId.setInterfaces() `nonpayable` `fca85eb3`

> Set supported contract interfaces




## *function* setOrgJson

OrgId.setOrgJson(orgId, orgJsonHash, orgJsonUri, orgJsonUriBackup1, orgJsonUriBackup2) `nonpayable` `3b331384`

> Shorthand method to change ORG.JSON URI and hash at once

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | ORGiD hash |
| *bytes32* | orgJsonHash | New ORG.JSON's keccak256 hash |
| *string* | orgJsonUri | New ORG.JSON URI |
| *string* | orgJsonUriBackup1 | New ORG.JSON URI backup |
| *string* | orgJsonUriBackup2 | New ORG.JSON URI backup |


## *function* supportsInterface

OrgId.supportsInterface(interfaceId) `view` `01ffc9a7`

> See {IERC165-supportsInterface}.     * Time complexity O(1), guaranteed to always use less than 30 000 gas.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes4* | interfaceId | undefined |


## *function* toggleActiveState

OrgId.toggleActiveState(orgId) `nonpayable` `0209c0ef`

> Toggle ORGiD's active/inactive state

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | ORGiD hash |


## *function* transferDirectorship

OrgId.transferDirectorship(orgId, newDirector) `nonpayable` `a954f145`

> Unit directorship transfer

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | Unit's ORGiD hash |
| *address* | newDirector | New director's address |


## *function* transferOrganizationOwnership

OrgId.transferOrganizationOwnership(orgId, newOwner) `nonpayable` `aa73697e`

> Ownership transfer

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | ORGiD hash |
| *address* | newOwner | New owner's address |


## *function* transferOwnership

OrgId.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | undefined |


---
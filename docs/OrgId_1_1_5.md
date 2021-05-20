* [OrgId_1_1_5](#orgid_1_1_5)
  * [DirectorshipAccepted](#event-directorshipaccepted)
  * [DirectorshipTransferred](#event-directorshiptransferred)
  * [OrgJsonChanged](#event-orgjsonchanged)
  * [OrganizationActiveStateChanged](#event-organizationactivestatechanged)
  * [OrganizationCreated](#event-organizationcreated)
  * [OrganizationOwnershipTransferred](#event-organizationownershiptransferred)
  * [UnitCreated](#event-unitcreated)
  * [acceptDirectorship](#function-acceptdirectorship)
  * [createOrganization](#function-createorganization)
  * [createUnit](#function-createunit)
  * [getOrganization](#function-getorganization)
  * [getOrganizations](#function-getorganizations)
  * [getUnits](#function-getunits)
  * [initialize](#function-initialize)
  * [initializeUpgrade110](#function-initializeupgrade110)
  * [renounceDirectorship](#function-renouncedirectorship)
  * [setOrgJson](#function-setorgjson)
  * [supportsInterface](#function-supportsinterface)
  * [toggleActiveState](#function-toggleactivestate)
  * [transferDirectorship](#function-transferdirectorship)
  * [transferOrganizationOwnership](#function-transferorganizationownership)

# OrgId_1_1_5

## *event* DirectorshipAccepted

OrgId_1_1_5.DirectorshipAccepted(orgId, director) `2f2df3ca`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *address* | director | indexed |

## *event* DirectorshipTransferred

OrgId_1_1_5.DirectorshipTransferred(orgId, previousDirector, newDirector) `f48a0476`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *address* | previousDirector | indexed |
| *address* | newDirector | indexed |

## *event* OrgJsonChanged

OrgId_1_1_5.OrgJsonChanged(orgId, previousOrgJsonHash, previousOrgJsonUri, previousOrgJsonUriBackup1, previousOrgJsonUriBackup2, newOrgJsonHash, newOrgJsonUri, newOrgJsonUriBackup1, newOrgJsonUriBackup2) `f4652552`

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

OrgId_1_1_5.OrganizationActiveStateChanged(orgId, previousState, newState) `74dc7d69`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *bool* | previousState | not indexed |
| *bool* | newState | not indexed |

## *event* OrganizationCreated

OrgId_1_1_5.OrganizationCreated(orgId, owner) `5bf391b9`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *address* | owner | indexed |

## *event* OrganizationOwnershipTransferred

OrgId_1_1_5.OrganizationOwnershipTransferred(orgId, previousOwner, newOwner) `92cbe7f5`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |

## *event* UnitCreated

OrgId_1_1_5.UnitCreated(parentOrgId, unitOrgId, director) `01b4c566`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | parentOrgId | indexed |
| *bytes32* | unitOrgId | indexed |
| *address* | director | indexed |


## *function* acceptDirectorship

OrgId_1_1_5.acceptDirectorship(orgId) `nonpayable` `781a9601`

> Accept director role

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | Unit's ORGiD hash |


## *function* createOrganization

OrgId_1_1_5.createOrganization(salt, orgJsonHash, orgJsonUri, orgJsonUriBackup1, orgJsonUriBackup2) `nonpayable` `b2c23371`

> Create organization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | salt | Unique hash required for identifier creation |
| *bytes32* | orgJsonHash | ORG.JSON's keccak256 hash |
| *string* | orgJsonUri | ORG.JSON URI (stored off-chain) |
| *string* | orgJsonUriBackup1 | ORG.JSON URI backup (stored off-chain) |
| *string* | orgJsonUriBackup2 | ORG.JSON URI backup (stored off-chain) |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | id | ORGiD byte32 hash |

## *function* createUnit

OrgId_1_1_5.createUnit(salt, parentOrgId, director, orgJsonHash, orgJsonUri, orgJsonUriBackup1, orgJsonUriBackup2) `nonpayable` `bf042ef2`

> Create organizational unit

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | salt | Unique hash required for identifier creation |
| *bytes32* | parentOrgId | Parent ORGiD hash |
| *address* | director | Unit director address |
| *bytes32* | orgJsonHash | ORG.JSON keccak256 hash |
| *string* | orgJsonUri | Unit ORG.JSON URI |
| *string* | orgJsonUriBackup1 | Unit ORG.JSON URI backup |
| *string* | orgJsonUriBackup2 | Unit ORG.JSON URI backup |


## *function* getOrganization

OrgId_1_1_5.getOrganization(_orgId) `view` `22b3cd4e`

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

OrgId_1_1_5.getOrganizations(includeInactive) `view` `0c70d7c5`

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

OrgId_1_1_5.getUnits(parentOrgId, includeInactive) `view` `0dd56c93`

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

OrgId_1_1_5.initialize() `nonpayable` `8129fc1c`

> Initializer for upgradeable contracts




## *function* initializeUpgrade110

OrgId_1_1_5.initializeUpgrade110() `nonpayable` `0631bae9`

> Initializer for the version 1.1.0




## *function* renounceDirectorship

OrgId_1_1_5.renounceDirectorship(orgId) `nonpayable` `096dde02`

> Unit directorship renounce

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | Unit's ORGiD hash |


## *function* setOrgJson

OrgId_1_1_5.setOrgJson(orgId, orgJsonHash, orgJsonUri, orgJsonUriBackup1, orgJsonUriBackup2) `nonpayable` `3b331384`

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

OrgId_1_1_5.supportsInterface(interfaceId) `view` `01ffc9a7`

> Interface of the ERC165 standard, as defined in the https://eips.ethereum.org/EIPS/eip-165[EIP].

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes4* | interfaceId | Interface Id |


## *function* toggleActiveState

OrgId_1_1_5.toggleActiveState(orgId) `nonpayable` `0209c0ef`

> Toggle ORGiD's active/inactive state

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | ORGiD hash |


## *function* transferDirectorship

OrgId_1_1_5.transferDirectorship(orgId, newDirector) `nonpayable` `a954f145`

> Unit directorship transfer

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | Unit's ORGiD hash |
| *address* | newDirector | New director's address |


## *function* transferOrganizationOwnership

OrgId_1_1_5.transferOrganizationOwnership(orgId, newOwner) `nonpayable` `aa73697e`

> Ownership transfer

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | ORGiD hash |
| *address* | newOwner | New owner's address |


---
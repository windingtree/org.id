* [OrgId](#orgid)
  * [DirectorshipAccepted](#event-directorshipaccepted)
  * [DirectorshipTransferred](#event-directorshiptransferred)
  * [OrgIdCreated](#event-orgidcreated)
  * [OrgIdOwnershipTransferred](#event-orgidownershiptransferred)
  * [OrgJsonChanged](#event-orgjsonchanged)
  * [OrgJsonUriChanged](#event-orgjsonurichanged)
  * [OrganizationActiveStateChanged](#event-organizationactivestatechanged)
  * [OrganizationCreated](#event-organizationcreated)
  * [OrganizationOwnershipTransferred](#event-organizationownershiptransferred)
  * [UnitCreated](#event-unitcreated)
  * [acceptDirectorship](#function-acceptdirectorship)
  * [createOrgId](#function-createorgid)
  * [createOrganization](#function-createorganization)
  * [createUnit](#function-createunit)
  * [getOrgId](#function-getorgid)
  * [getOrgIds](#function-getorgids)
  * [getOrgIds](#function-getorgids)
  * [getOrgIdsCount](#function-getorgidscount)
  * [getOrganization](#function-getorganization)
  * [getOrganizations](#function-getorganizations)
  * [getUnits](#function-getunits)
  * [initialize](#function-initialize)
  * [initializeUpgrade110](#function-initializeupgrade110)
  * [initializeUpgrade_2_0_0](#function-initializeupgrade_2_0_0)
  * [renounceDirectorship](#function-renouncedirectorship)
  * [setOrgJson](#function-setorgjson)
  * [setOrgJson](#function-setorgjson)
  * [supportsInterface](#function-supportsinterface)
  * [toggleActiveState](#function-toggleactivestate)
  * [transferDirectorship](#function-transferdirectorship)
  * [transferOrgIdOwnership](#function-transferorgidownership)
  * [transferOrganizationOwnership](#function-transferorganizationownership)

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

## *event* OrgIdCreated

OrgId.OrgIdCreated(orgId, owner) `49422f7a`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *address* | owner | indexed |

## *event* OrgIdOwnershipTransferred

OrgId.OrgIdOwnershipTransferred(orgId, previousOwner, newOwner) `f6028548`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |

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

## *event* OrgJsonUriChanged

OrgId.OrgJsonUriChanged(orgId, orgJsonUri) `4e0249d1`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *string* | orgJsonUri | not indexed |

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


## *function* createOrgId

OrgId.createOrgId(salt, orgJsonUri) `nonpayable` `0ad0abce`

> Create ORGiD

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | salt | Unique hash required for identifier creation |
| *string* | orgJsonUri | ORG.JSON URI (stored off-chain) |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | ORGiD byte32 hash |

## *function* createOrganization

OrgId.createOrganization(salt, orgJsonHash, orgJsonUri, orgJsonUriBackup1, orgJsonUriBackup2) `nonpayable` `b2c23371`

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

OrgId.createUnit(salt, parentOrgId, director, orgJsonHash, orgJsonUri, orgJsonUriBackup1, orgJsonUriBackup2) `nonpayable` `bf042ef2`

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


## *function* getOrgId

OrgId.getOrgId(orgId) `view` `037640df`

> Check ORGiD existenceReturn parameters marked by (*) are only applicable to units

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | ORGiD hash |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* | exists | ORGiD existence |
| *address* | owner | ORGiD owner address |

## *function* getOrgIds

OrgId.getOrgIds(cursor, count) `view` `0193eda6`

> Get paginated ORGiDs hashes list

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | cursor | Index of the ORGiD from which to start querying |
| *uint256* | count | Number of ORGiDs to go through |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32[]* | orgIdsList | Array of ORGiDs hashes |

## *function* getOrgIds

OrgId.getOrgIds() `view` `e4f64990`

> Get all organizations' ORGiD hashes list



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32[]* | orgIdsList | Array of all ORGiDs hashes |

## *function* getOrgIdsCount

OrgId.getOrgIdsCount() `view` `caa10c57`

> Check registered ORGiD countReturn count of ORGiD hashes



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | count | ORGiDs count |

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

OrgId.initialize() `nonpayable` `8129fc1c`

> Initializer for upgradeable contracts




## *function* initializeUpgrade110

OrgId.initializeUpgrade110() `nonpayable` `0631bae9`

> Initializer for the version 1.1.0




## *function* initializeUpgrade_2_0_0

OrgId.initializeUpgrade_2_0_0() `nonpayable` `46515fc9`

> Initializer for the version 2.0.0




## *function* renounceDirectorship

OrgId.renounceDirectorship(orgId) `nonpayable` `096dde02`

> Unit directorship renounce

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | Unit's ORGiD hash |


## *function* setOrgJson

OrgId.setOrgJson(orgId, orgJsonUri) `nonpayable` `35178d91`

> Shorthand method to change ORG.JSON URI and hash at once

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | ORGiD hash |
| *string* | orgJsonUri | New ORG.JSON URI |


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

> Interface of the ERC165 standard, as defined in the https://eips.ethereum.org/EIPS/eip-165[EIP].

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes4* | interfaceId | Interface Id |


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


## *function* transferOrgIdOwnership

OrgId.transferOrgIdOwnership(orgId, newOwner) `nonpayable` `bcdf8e41`

> Ownership transfer

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | ORGiD hash |
| *address* | newOwner | New owner's address |


## *function* transferOrganizationOwnership

OrgId.transferOrganizationOwnership(orgId, newOwner) `nonpayable` `aa73697e`

> Ownership transfer

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | ORGiD hash |
| *address* | newOwner | New owner's address |


---
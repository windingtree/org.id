* [OrgIdInterface](#orgidinterface)
  * [acceptDirectorship](#function-acceptdirectorship)
  * [createOrganization](#function-createorganization)
  * [createUnit](#function-createunit)
  * [getOrganization](#function-getorganization)
  * [getOrganizations](#function-getorganizations)
  * [getUnits](#function-getunits)
  * [renounceDirectorship](#function-renouncedirectorship)
  * [setOrgJson](#function-setorgjson)
  * [toggleActiveState](#function-toggleactivestate)
  * [transferDirectorship](#function-transferdirectorship)
  * [transferOrganizationOwnership](#function-transferorganizationownership)

# OrgIdInterface


## *function* acceptDirectorship

OrgIdInterface.acceptDirectorship(orgId) `nonpayable` `781a9601`

> Accept director role

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | Unit's ORGiD hash |


## *function* createOrganization

OrgIdInterface.createOrganization(salt, orgJsonHash, orgJsonUri, orgJsonUriBackup1, orgJsonUriBackup2) `nonpayable` `b2c23371`

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

OrgIdInterface.createUnit(salt, parentOrgId, director, orgJsonHash, orgJsonUri, orgJsonUriBackup1, orgJsonUriBackup2) `nonpayable` `bf042ef2`

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

OrgIdInterface.getOrganization(_orgId) `view` `22b3cd4e`

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

OrgIdInterface.getOrganizations(includeInactive) `view` `0c70d7c5`

> Get all active organizations' ORGiD hashes

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* | includeInactive | Includes not active units into response |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32[]* | organizationsList | Array of all active organizations' ORGiD hashes |

## *function* getUnits

OrgIdInterface.getUnits(parentOrgId, includeInactive) `view` `0dd56c93`

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

## *function* renounceDirectorship

OrgIdInterface.renounceDirectorship(orgId) `nonpayable` `096dde02`

> Unit directorship renounce

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | Unit's ORGiD hash |


## *function* setOrgJson

OrgIdInterface.setOrgJson(orgId, orgJsonHash, orgJsonUri, orgJsonUriBackup1, orgJsonUriBackup2) `nonpayable` `3b331384`

> Shorthand method to change ORG.JSON URI and hash at once

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | ORGiD hash |
| *bytes32* | orgJsonHash | New ORG.JSON's keccak256 hash |
| *string* | orgJsonUri | New ORG.JSON URI |
| *string* | orgJsonUriBackup1 | New ORG.JSON URI backup |
| *string* | orgJsonUriBackup2 | New ORG.JSON URI backup |


## *function* toggleActiveState

OrgIdInterface.toggleActiveState(orgId) `nonpayable` `0209c0ef`

> Toggle ORGiD's active/inactive state

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | ORGiD hash |


## *function* transferDirectorship

OrgIdInterface.transferDirectorship(orgId, newDirector) `nonpayable` `a954f145`

> Transfer director role

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | Unit's ORGiD hash |
| *address* | newDirector | New director's address |


## *function* transferOrganizationOwnership

OrgIdInterface.transferOrganizationOwnership(orgId, newOwner) `nonpayable` `aa73697e`

> Ownership transfer

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | ORGiD hash |
| *address* | newOwner | New owner's address |


---
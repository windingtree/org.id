* [OrgIdInterface](#orgidinterface)
  * [confirmDirectorship](#function-confirmdirectorship)
  * [createOrganization](#function-createorganization)
  * [createUnit](#function-createunit)
  * [getOrganization](#function-getorganization)
  * [getOrganizations](#function-getorganizations)
  * [getUnits](#function-getunits)
  * [renounceDirectorship](#function-renouncedirectorship)
  * [setOrgJson](#function-setorgjson)
  * [toggleOrganization](#function-toggleorganization)
  * [transferDirectorship](#function-transferdirectorship)
  * [transferOrganizationOwnership](#function-transferorganizationownership)

# OrgIdInterface


## *function* confirmDirectorship

OrgIdInterface.confirmDirectorship(orgId) `nonpayable` `9c1429b3`

> Unit directorship confirmation

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | Unit's ORG.ID hash |


## *function* createOrganization

OrgIdInterface.createOrganization(orgJsonUri, orgJsonHash) `nonpayable` `bdb71f05`

> Create organization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | orgJsonUri | ORG.JSON URI (stored off-chain) |
| *bytes32* | orgJsonHash | ORG.JSON's keccak256 hash |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | id | ORG.ID byte32 hash |

## *function* createUnit

OrgIdInterface.createUnit(parentOrgId, director, orgJsonUri, orgJsonHash) `nonpayable` `cc6d8ef4`

> Create organizational unit

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | parentOrgId | Parent ORG.ID hash |
| *address* | director | Unit director address |
| *string* | orgJsonUri | Unit ORG.JSON URI |
| *bytes32* | orgJsonHash | ORG.JSON keccak256 hash |


## *function* getOrganization

OrgIdInterface.getOrganization(_orgId) `view` `22b3cd4e`

> Get organization or unit's info by ORG.ID hash

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | _orgId | ORG.ID hash |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* | existed | Flag indicating ORG.ID's existence |
| *bytes32* | orgId | ORG.ID hash |
| *string* | orgJsonUri | ORG.JSON URI |
| *bytes32* | orgJsonHash | ORG.JSON keccak256 hash |
| *bytes32* | parentOrgId | Parent ORG.ID (if applicable) |
| *address* | owner | Owner's address |
| *address* | director | Unit director's address |
| *bool* | isActive | Indicates whether ORG.ID is active |
| *bool* | directorConfirmed | Indicates whether directorship is confirmed |

## *function* getOrganizations

OrgIdInterface.getOrganizations(includeInactive) `view` `0c70d7c5`

> Get all active organizations' ORG.ID hashes

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* | includeInactive | Includes not active units into response |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32[]* | organizationsList | Array of all active organizations' ORG.ID hashes |

## *function* getUnits

OrgIdInterface.getUnits(parentOrgId, includeInactive) `view` `0dd56c93`

> Get all active organizational units of a particular ORG.ID

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | parentOrgId | Parent ORG.ID hash |
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
| *bytes32* | orgId | Unit's ORG.ID hash |


## *function* setOrgJson

OrgIdInterface.setOrgJson(orgId, orgJsonUri, orgJsonHash) `nonpayable` `bf9e43db`

> Shorthand method to change ORG.JSON URI and hash at once

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | ORG.ID hash |
| *string* | orgJsonUri | New ORG.JSON URI |
| *bytes32* | orgJsonHash | New ORG.JSON's keccak256 hash |


## *function* toggleOrganization

OrgIdInterface.toggleOrganization(orgId) `nonpayable` `07233a3d`

> Toggle ORG.ID's active/inactive state

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | ORG.ID hash |


## *function* transferDirectorship

OrgIdInterface.transferDirectorship(orgId, newDirector) `nonpayable` `a954f145`

> Unit directorship transfer

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | Unit's ORG.ID hash |
| *address* | newDirector | New director's address |


## *function* transferOrganizationOwnership

OrgIdInterface.transferOrganizationOwnership(orgId, newOwner) `nonpayable` `aa73697e`

> Ownership transfer

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | ORG.ID hash |
| *address* | newOwner | New owner's address |


---
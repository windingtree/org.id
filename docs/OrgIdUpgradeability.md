* [OrgIdUpgradeability](#orgidupgradeability)
  * [DirectorshipConfirmed](#event-directorshipconfirmed)
  * [DirectorshipTransferred](#event-directorshiptransferred)
  * [OrgJsonChanged](#event-orgjsonchanged)
  * [OrganizationCreated](#event-organizationcreated)
  * [OrganizationOwnershipTransferred](#event-organizationownershiptransferred)
  * [OrganizationToggled](#event-organizationtoggled)
  * [OwnershipTransferred](#event-ownershiptransferred)
  * [UnitCreated](#event-unitcreated)
  * [confirmDirectorship](#function-confirmdirectorship)
  * [createOrganization](#function-createorganization)
  * [createUnit](#function-createunit)
  * [getOrganization](#function-getorganization)
  * [getOrganizations](#function-getorganizations)
  * [getUnits](#function-getunits)
  * [initialize](#function-initialize)
  * [initialize](#function-initialize)
  * [isOwner](#function-isowner)
  * [newFunction](#function-newfunction)
  * [owner](#function-owner)
  * [renounceDirectorship](#function-renouncedirectorship)
  * [renounceOwnership](#function-renounceownership)
  * [setInterfaces](#function-setinterfaces)
  * [setOrgJson](#function-setorgjson)
  * [setupNewStorage](#function-setupnewstorage)
  * [supportsInterface](#function-supportsinterface)
  * [test](#function-test)
  * [toggleOrganization](#function-toggleorganization)
  * [transferDirectorship](#function-transferdirectorship)
  * [transferOrganizationOwnership](#function-transferorganizationownership)
  * [transferOwnership](#function-transferownership)

# OrgIdUpgradeability

## *event* DirectorshipConfirmed

OrgIdUpgradeability.DirectorshipConfirmed(orgId, director) `1e8793fd`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *address* | director | indexed |

## *event* DirectorshipTransferred

OrgIdUpgradeability.DirectorshipTransferred(orgId, previousDirector, newDirector) `f48a0476`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *address* | previousDirector | indexed |
| *address* | newDirector | indexed |

## *event* OrgJsonChanged

OrgIdUpgradeability.OrgJsonChanged(orgId, previousOrgJsonUri, newOrgJsonUri, previousOrgJsonHash, newOrgJsonHash) `dc7a54f1`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *string* | previousOrgJsonUri | not indexed |
| *string* | newOrgJsonUri | not indexed |
| *bytes32* | previousOrgJsonHash | indexed |
| *bytes32* | newOrgJsonHash | indexed |

## *event* OrganizationCreated

OrgIdUpgradeability.OrganizationCreated(orgId, owner) `5bf391b9`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *address* | owner | indexed |

## *event* OrganizationOwnershipTransferred

OrgIdUpgradeability.OrganizationOwnershipTransferred(orgId, previousOwner, newOwner) `92cbe7f5`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |

## *event* OrganizationToggled

OrgIdUpgradeability.OrganizationToggled(orgId, previousState, newState) `e6a96d99`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *bool* | previousState | not indexed |
| *bool* | newState | not indexed |

## *event* OwnershipTransferred

OrgIdUpgradeability.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |

## *event* UnitCreated

OrgIdUpgradeability.UnitCreated(parentOrgId, unitOrgId, director) `01b4c566`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | parentOrgId | indexed |
| *bytes32* | unitOrgId | indexed |
| *address* | director | indexed |


## *function* confirmDirectorship

OrgIdUpgradeability.confirmDirectorship(orgId) `nonpayable` `9c1429b3`

> Unit directorship confirmation

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | Unit's ORG.ID hash |


## *function* createOrganization

OrgIdUpgradeability.createOrganization(orgJsonUri, orgJsonHash) `nonpayable` `bdb71f05`

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

OrgIdUpgradeability.createUnit(parentOrgId, director, orgJsonUri, orgJsonHash) `nonpayable` `cc6d8ef4`

> Create organizational unit

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | parentOrgId | Parent ORG.ID hash |
| *address* | director | Unit director address |
| *string* | orgJsonUri | Unit ORG.JSON URI |
| *bytes32* | orgJsonHash | ORG.JSON keccak256 hash |


## *function* getOrganization

OrgIdUpgradeability.getOrganization(_orgId) `view` `22b3cd4e`

> Get organization or unit's info by ORG.ID hashReturn parameters marked by (*) are only applicable to units

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | _orgId | ORG.ID hash |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* | exist | undefined |
| *bytes32* | orgId | undefined |
| *string* | orgJsonUri | ORG.JSON URI |
| *bytes32* | orgJsonHash | ORG.JSON keccak256 hash |
| *bytes32* | parentOrgId | Parent ORG.ID (*) |
| *address* | owner | Owner's address |
| *address* | director | Unit director's address (*) |
| *bool* | isActive | Indicates whether ORG.ID is active |
| *bool* | directorConfirmed | Indicates whether directorship is confirmed (*) |

## *function* getOrganizations

OrgIdUpgradeability.getOrganizations(includeInactive) `view` `0c70d7c5`

> Get all active organizations' ORG.ID hashes

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* | includeInactive | Includes not active organizations into response |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32[]* |  | undefined |

## *function* getUnits

OrgIdUpgradeability.getUnits(parentOrgId, includeInactive) `view` `0dd56c93`

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

## *function* initialize

OrgIdUpgradeability.initialize() `nonpayable` `8129fc1c`





## *function* initialize

OrgIdUpgradeability.initialize(__owner) `nonpayable` `c4d66de8`

> Initializer for upgradeable contracts

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | __owner | Contract owner's address |


## *function* isOwner

OrgIdUpgradeability.isOwner() `view` `8f32d59b`

> Returns true if the caller is the current owner.




## *function* newFunction

OrgIdUpgradeability.newFunction() `view` `1b28d63e`





## *function* owner

OrgIdUpgradeability.owner() `view` `8da5cb5b`

> Returns the address of the current owner.




## *function* renounceDirectorship

OrgIdUpgradeability.renounceDirectorship(orgId) `nonpayable` `096dde02`

> Unit directorship renounce

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | Unit's ORG.ID hash |


## *function* renounceOwnership

OrgIdUpgradeability.renounceOwnership() `nonpayable` `715018a6`

> Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner.     * NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.




## *function* setInterfaces

OrgIdUpgradeability.setInterfaces() `nonpayable` `fca85eb3`

> Set supported contract interfaces




## *function* setOrgJson

OrgIdUpgradeability.setOrgJson(orgId, orgJsonUri, orgJsonHash) `nonpayable` `bf9e43db`

> Shorthand method to change ORG.JSON URI and hash at once

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | ORG.ID hash |
| *string* | orgJsonUri | New ORG.JSON URI |
| *bytes32* | orgJsonHash | New ORG.JSON's keccak256 hash |


## *function* setupNewStorage

OrgIdUpgradeability.setupNewStorage(value) `nonpayable` `00551333`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | value | undefined |


## *function* supportsInterface

OrgIdUpgradeability.supportsInterface(interfaceId) `view` `01ffc9a7`

> See {IERC165-supportsInterface}.     * Time complexity O(1), guaranteed to always use less than 30 000 gas.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes4* | interfaceId | undefined |


## *function* test

OrgIdUpgradeability.test() `view` `f8a8fd6d`





## *function* toggleOrganization

OrgIdUpgradeability.toggleOrganization(orgId) `nonpayable` `07233a3d`

> Toggle ORG.ID's active/inactive state

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | ORG.ID hash |


## *function* transferDirectorship

OrgIdUpgradeability.transferDirectorship(orgId, newDirector) `nonpayable` `a954f145`

> Unit directorship transfer

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | Unit's ORG.ID hash |
| *address* | newDirector | New director's address |


## *function* transferOrganizationOwnership

OrgIdUpgradeability.transferOrganizationOwnership(orgId, newOwner) `nonpayable` `aa73697e`

> Ownership transfer

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | ORG.ID hash |
| *address* | newOwner | New owner's address |


## *function* transferOwnership

OrgIdUpgradeability.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | undefined |


---
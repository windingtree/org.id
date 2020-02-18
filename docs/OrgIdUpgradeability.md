* [OrgIdUpgradeability](#orgidupgradeability)
  * [DirectorOwnershipConfirmed](#event-directorownershipconfirmed)
  * [DirectorOwnershipTransferred](#event-directorownershiptransferred)
  * [OrgJsonHashChanged](#event-orgjsonhashchanged)
  * [OrgJsonUriChanged](#event-orgjsonurichanged)
  * [OrganizationCreated](#event-organizationcreated)
  * [OrganizationOwnershipTransferred](#event-organizationownershiptransferred)
  * [OrganizationToggled](#event-organizationtoggled)
  * [OwnershipTransferred](#event-ownershiptransferred)
  * [SubsidiaryCreated](#event-subsidiarycreated)
  * [changeOrgJsonHash](#function-changeorgjsonhash)
  * [changeOrgJsonUri](#function-changeorgjsonuri)
  * [changeOrgJsonUriAndHash](#function-changeorgjsonuriandhash)
  * [confirmDirectorOwnership](#function-confirmdirectorownership)
  * [createOrganization](#function-createorganization)
  * [createSubsidiary](#function-createsubsidiary)
  * [getOrganization](#function-getorganization)
  * [getOrganizations](#function-getorganizations)
  * [getSubsidiaries](#function-getsubsidiaries)
  * [initialize](#function-initialize)
  * [initialize](#function-initialize)
  * [isOwner](#function-isowner)
  * [newFunction](#function-newfunction)
  * [owner](#function-owner)
  * [renounceOwnership](#function-renounceownership)
  * [setInterfaces](#function-setinterfaces)
  * [setupNewStorage](#function-setupnewstorage)
  * [supportsInterface](#function-supportsinterface)
  * [test](#function-test)
  * [toggleOrganization](#function-toggleorganization)
  * [transferDirectorOwnership](#function-transferdirectorownership)
  * [transferOrganizationOwnership](#function-transferorganizationownership)
  * [transferOwnership](#function-transferownership)

# OrgIdUpgradeability

## *event* DirectorOwnershipConfirmed

OrgIdUpgradeability.DirectorOwnershipConfirmed(orgId, director) `fe20179a`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *address* | director | indexed |

## *event* DirectorOwnershipTransferred

OrgIdUpgradeability.DirectorOwnershipTransferred(orgId, previousDirector, newDirector) `872246ae`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *address* | previousDirector | indexed |
| *address* | newDirector | indexed |

## *event* OrgJsonHashChanged

OrgIdUpgradeability.OrgJsonHashChanged(orgId, previousOrgJsonHash, newOrgJsonHash) `fa137db5`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *bytes32* | previousOrgJsonHash | indexed |
| *bytes32* | newOrgJsonHash | indexed |

## *event* OrgJsonUriChanged

OrgIdUpgradeability.OrgJsonUriChanged(orgId, previousOrgJsonUri, newOrgJsonUri) `0cd23142`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *string* | previousOrgJsonUri | not indexed |
| *string* | newOrgJsonUri | not indexed |

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

## *event* SubsidiaryCreated

OrgIdUpgradeability.SubsidiaryCreated(parentOrgId, subOrgId, director) `ea0a430a`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | parentOrgId | indexed |
| *bytes32* | subOrgId | indexed |
| *address* | director | indexed |


## *function* changeOrgJsonHash

OrgIdUpgradeability.changeOrgJsonHash(orgId, orgJsonHash) `nonpayable` `7fc5f5fb`

> Allows owner to change Organization"s orgJsonHash

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization OrgId |
| *bytes32* | orgJsonHash | keccak256 hash of the new ORG.JSON contents |


## *function* changeOrgJsonUri

OrgIdUpgradeability.changeOrgJsonUri(orgId, orgJsonUri) `nonpayable` `57b5e80d`

> Allows owner to change Organization"s orgJsonUri

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization OrgId |
| *string* | orgJsonUri | New orgJsonUri pointer of this Organization |


## *function* changeOrgJsonUriAndHash

OrgIdUpgradeability.changeOrgJsonUriAndHash(orgId, orgJsonUri, orgJsonHash) `nonpayable` `f1745894`

> Shorthand method to change ORG.JSON uri and hash at the same time

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization orgId |
| *string* | orgJsonUri | New orgJsonUri pointer of this Organization |
| *bytes32* | orgJsonHash | keccak256 hash of the new ORG.JSON contents. |


## *function* confirmDirectorOwnership

OrgIdUpgradeability.confirmDirectorOwnership(orgId) `nonpayable` `4b845bef`

> Confirmation of the organization director ownership

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization orgId |


## *function* createOrganization

OrgIdUpgradeability.createOrganization(orgId, orgJsonUri, orgJsonHash) `nonpayable` `0670af5c`

> Create organization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization Id |
| *string* | orgJsonUri | orgJsonUri pointer |
| *bytes32* | orgJsonHash | keccak256 hash of the new ORG.JSON contents |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | id | The organization orgId |

## *function* createSubsidiary

OrgIdUpgradeability.createSubsidiary(orgId, subOrgId, subsidiaryDirector, orgJsonUri, orgJsonHash) `nonpayable` `981f3dcf`

> Create subsidiary

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization Id |
| *bytes32* | subOrgId | The subsidiary organization Id |
| *address* | subsidiaryDirector | Subsidiary director address |
| *string* | orgJsonUri | orgJsonUri pointer |
| *bytes32* | orgJsonHash | keccak256 hash of the new ORG.JSON contents |


## *function* getOrganization

OrgIdUpgradeability.getOrganization(_orgId) `view` `22b3cd4e`

> Get organization by orgId

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | _orgId | The organization Id |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization orgId |
| *string* | orgJsonUri | orgJsonUri pointer of this Organization |
| *bytes32* | orgJsonHash | keccak256 hash of the new ORG.JSON contents |
| *bytes32* | parentEntity | The parent organization orgId |
| *address* | owner | The organization owner |
| *address* | director | The organization director |
| *bool* | state | State of the organization |
| *bool* | directorConfirmed | Flag is director ownership is confirmed |

## *function* getOrganizations

OrgIdUpgradeability.getOrganizations() `view` `9754a3a8`

> Return an array of active organizations orgIds



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32[]* |  | undefined |

## *function* getSubsidiaries

OrgIdUpgradeability.getSubsidiaries(orgId) `view` `5aee5dc7`

> Return an array of active subsidiaries orgIds

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | undefined |

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
| *address* | __owner | The address of the contract owner |


## *function* isOwner

OrgIdUpgradeability.isOwner() `view` `8f32d59b`

> Returns true if the caller is the current owner.




## *function* newFunction

OrgIdUpgradeability.newFunction() `view` `1b28d63e`





## *function* owner

OrgIdUpgradeability.owner() `view` `8da5cb5b`

> Returns the address of the current owner.




## *function* renounceOwnership

OrgIdUpgradeability.renounceOwnership() `nonpayable` `715018a6`

> Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner.     * NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.




## *function* setInterfaces

OrgIdUpgradeability.setInterfaces() `nonpayable` `fca85eb3`

> Set the list of contract interfaces supported




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

> Toggle the organization state

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization orgId |


## *function* transferDirectorOwnership

OrgIdUpgradeability.transferDirectorOwnership(orgId, newDirector) `nonpayable` `b34ef9b7`

> Transfer subsidiary director ownership

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization orgId |
| *address* | newDirector | New subsidiary director address |


## *function* transferOrganizationOwnership

OrgIdUpgradeability.transferOrganizationOwnership(orgId, newOwner) `nonpayable` `aa73697e`

> Transfer organization ownership

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization orgId |
| *address* | newOwner | New subsidiary director address |


## *function* transferOwnership

OrgIdUpgradeability.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | undefined |


---
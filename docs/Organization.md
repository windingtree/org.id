* [Organization](#organization)
  * [DirectoryLinked](#event-directorylinked)
  * [DirectoryUnlinked](#event-directoryunlinked)
  * [EntityDirectorOwnershipChanged](#event-entitydirectorownershipchanged)
  * [OrgJsonHashChanged](#event-orgjsonhashchanged)
  * [OrgJsonUriChanged](#event-orgjsonurichanged)
  * [OwnershipTransferred](#event-ownershiptransferred)
  * [SubsidiaryCreated](#event-subsidiarycreated)
  * [SubsidiaryDirectorOwnershipConfirmed](#event-subsidiarydirectorownershipconfirmed)
  * [SubsidiaryDirectorOwnershipTransferred](#event-subsidiarydirectorownershiptransferred)
  * [SubsidiaryToggled](#event-subsidiarytoggled)
  * [app](#function-app)
  * [changeEntityDirector](#function-changeentitydirector)
  * [changeOrgJsonHash](#function-changeorgjsonhash)
  * [changeOrgJsonUri](#function-changeorgjsonuri)
  * [changeOrgJsonUriAndHash](#function-changeorgjsonuriandhash)
  * [confirmSubsidiaryDirectorOwnership](#function-confirmsubsidiarydirectorownership)
  * [createSubsidiary](#function-createsubsidiary)
  * [created](#function-created)
  * [directoriesIndex](#function-directoriesindex)
  * [entityDirector](#function-entitydirector)
  * [getOrgJsonHash](#function-getorgjsonhash)
  * [getOrgJsonUri](#function-getorgjsonuri)
  * [getSubsidiaries](#function-getsubsidiaries)
  * [getSubsidiary](#function-getsubsidiary)
  * [initialize](#function-initialize)
  * [linkDirectory](#function-linkdirectory)
  * [orgJsonHash](#function-orgjsonhash)
  * [orgJsonUri](#function-orgjsonuri)
  * [owner](#function-owner)
  * [parentEntity](#function-parententity)
  * [proxyAdmin](#function-proxyadmin)
  * [setInterfaces](#function-setinterfaces)
  * [subsidiariesIndex](#function-subsidiariesindex)
  * [supportsInterface](#function-supportsinterface)
  * [toggleSubsidiary](#function-togglesubsidiary)
  * [transferDirectorOwnership](#function-transferdirectorownership)
  * [transferOwnership](#function-transferownership)
  * [unlinkDirectory](#function-unlinkdirectory)

# Organization

## *event* DirectoryLinked

Organization.DirectoryLinked(directory) `d5bc0c0f`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | directory | indexed |

## *event* DirectoryUnlinked

Organization.DirectoryUnlinked(directory) `2412e58f`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | directory | indexed |

## *event* EntityDirectorOwnershipChanged

Organization.EntityDirectorOwnershipChanged(previousDirector, newDirector) `a12ebcf3`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousDirector | indexed |
| *address* | newDirector | indexed |

## *event* OrgJsonHashChanged

Organization.OrgJsonHashChanged(previousOrgJsonHash, newOrgJsonHash) `ccd34c96`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | previousOrgJsonHash | indexed |
| *bytes32* | newOrgJsonHash | indexed |

## *event* OrgJsonUriChanged

Organization.OrgJsonUriChanged(previousOrgJsonUri, newOrgJsonUri) `0153064f`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *string* | previousOrgJsonUri | not indexed |
| *string* | newOrgJsonUri | not indexed |

## *event* OwnershipTransferred

Organization.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |

## *event* SubsidiaryCreated

Organization.SubsidiaryCreated(owner, director, subsidiary) `1d19959a`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | owner | indexed |
| *address* | director | indexed |
| *address* | subsidiary | indexed |

## *event* SubsidiaryDirectorOwnershipConfirmed

Organization.SubsidiaryDirectorOwnershipConfirmed(subsidiary, director) `caea9a4e`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | subsidiary | indexed |
| *address* | director | indexed |

## *event* SubsidiaryDirectorOwnershipTransferred

Organization.SubsidiaryDirectorOwnershipTransferred(subsidiary, previousDirector, newDirector) `9d3df1e3`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | subsidiary | indexed |
| *address* | previousDirector | indexed |
| *address* | newDirector | indexed |

## *event* SubsidiaryToggled

Organization.SubsidiaryToggled(subsidiary, previousState, newState) `c61c8be4`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | subsidiary | indexed |
| *bool* | previousState | not indexed |
| *bool* | newState | not indexed |


## *function* app

Organization.app() `view` `b76564bd`





## *function* changeEntityDirector

Organization.changeEntityDirector(newEntityDirectorAddress) `nonpayable` `b1b53517`

> Change entity director

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newEntityDirectorAddress | New entity director address |


## *function* changeOrgJsonHash

Organization.changeOrgJsonHash(_orgJsonHash) `nonpayable` `32fda029`

> `changeOrgJsonHash` Allows owner to change Organization's orgJsonHash.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | _orgJsonHash | keccak256 hash of the new ORG.JSON contents. |


## *function* changeOrgJsonUri

Organization.changeOrgJsonUri(_orgJsonUri) `nonpayable` `b454f4ef`

> `changeOrgJsonUri` Allows owner to change Organization"s orgJsonUri.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _orgJsonUri | New orgJsonUri pointer of this Organization |


## *function* changeOrgJsonUriAndHash

Organization.changeOrgJsonUriAndHash(_orgJsonUri, _orgJsonHash) `nonpayable` `a4e99359`

> Shorthand method to change ORG.JSON uri and hash at the same time

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _orgJsonUri | New orgJsonUri pointer of this Organization |
| *bytes32* | _orgJsonHash | keccak256 hash of the new ORG.JSON contents. |


## *function* confirmSubsidiaryDirectorOwnership

Organization.confirmSubsidiaryDirectorOwnership(subsidiaryAddress) `nonpayable` `2cd7f88c`

> Confirm subsidiary director ownership

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | subsidiaryAddress | Subsidiary organization address |


## *function* createSubsidiary

Organization.createSubsidiary(_orgJsonUri, _orgJsonHash, subsidiaryDirector, packageName, contractName) `nonpayable` `3ba2e931`

> Create subsidiary

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _orgJsonUri | orgJsonUri pointer |
| *bytes32* | _orgJsonHash | keccak256 hash of the new ORG.JSON contents |
| *address* | subsidiaryDirector | Subsidiary director address |
| *string* | packageName | Name of the package where the contract is contained.  Will be "wt-contracts" if empty string provided |
| *string* | contractName | Name of the organization contract.  Will be "Organization" if empty string provided |


## *function* created

Organization.created() `view` `325a19f1`





## *function* directoriesIndex

Organization.directoriesIndex() `view` `83cec58d`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* entityDirector

Organization.entityDirector() `view` `dcfa1cdc`





## *function* getOrgJsonHash

Organization.getOrgJsonHash() `view` `72cd7fc9`

> Returns keccak256 hash of raw ORG.JSON contents. This should be used to verify that the contents of ORG.JSON has not been tampered with. It is a responsibility of the Organization owner to keep this hash up to date.



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* |  | undefined |

## *function* getOrgJsonUri

Organization.getOrgJsonUri() `view` `1d855977`

> Returns current orgJsonUri



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *string* |  | undefined |

## *function* getSubsidiaries

Organization.getSubsidiaries() `view` `fadc2569`

> Return an array of subsidiaries addresses



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* | subsidiariesList | Array of active subsidiaries |

## *function* getSubsidiary

Organization.getSubsidiary(subsidiaryAddress) `view` `b2a1e312`

> Return subsidiary organization parmeters

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | subsidiaryAddress | Subsidiary organization address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | id | Subsidiary address |
| *bool* | state | Subsidiary state |
| *bool* | confirmed | Subsidiary director ownership confirmation state |
| *address* | director | Entity director address |

## *function* initialize

Organization.initialize(__owner, _orgJsonUri, _orgJsonHash, _app, _proxyAdmin, _parentEntity, _entityDirector) `nonpayable` `63ef1e8f`

> Initializer for upgradeable contracts

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | __owner | The address of the contract owner |
| *string* | _orgJsonUri | pointer to Organization data |
| *bytes32* | _orgJsonHash | keccak256 hash of the new ORG.JSON contents |
| *address* | _app | OpenZeppelin App address |
| *address* | _proxyAdmin | OpenZeppelin proxyAdmin address |
| *address* | _parentEntity | Parent organization address |
| *address* | _entityDirector | Entity director address |


## *function* linkDirectory

Organization.linkDirectory() `nonpayable` `8335ad14`

> Liking with SegmentDirectory.  This function have to be called by SegmentDirectory contract only




## *function* orgJsonHash

Organization.orgJsonHash() `view` `2095005b`





## *function* orgJsonUri

Organization.orgJsonUri() `view` `3b3ba578`





## *function* owner

Organization.owner() `view` `8da5cb5b`

> Returns the address of the current owner.




## *function* parentEntity

Organization.parentEntity() `view` `19fb3ff2`





## *function* proxyAdmin

Organization.proxyAdmin() `view` `3e47158c`





## *function* setInterfaces

Organization.setInterfaces() `nonpayable` `fca85eb3`

> A synchronization method that should be kept up to date with  the list of interfaces set during initialization. It should also be called everytime the implementation gets updated. If the interface list gets out of sync with the implementation at anytime, it is possible that some integrations will stop working. Since this method is not destructive, no access restriction is in place. It"s supposed to be called by the proxy admin anyway.




## *function* subsidiariesIndex

Organization.subsidiariesIndex() `view` `3f923cdc`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* supportsInterface

Organization.supportsInterface(interfaceId) `view` `01ffc9a7`

> See {IERC165-supportsInterface}.     * Time complexity O(1), guaranteed to always use less than 30 000 gas.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes4* | interfaceId | undefined |


## *function* toggleSubsidiary

Organization.toggleSubsidiary(subsidiaryAddress) `nonpayable` `6df2e446`

> Toggle subsidiary state

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | subsidiaryAddress | Subsidiary organization address |


## *function* transferDirectorOwnership

Organization.transferDirectorOwnership(subsidiaryAddress, newSubsidiaryDirector) `nonpayable` `f56f2d85`

> Transfer subsidiary director ownership

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | subsidiaryAddress | Subsidiary organization address |
| *address* | newSubsidiaryDirector | New subsidiary director address |


## *function* transferOwnership

Organization.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |


## *function* unlinkDirectory

Organization.unlinkDirectory() `nonpayable` `791d8763`

> Removes a link with SegmentDirectory.  This function have to be called by SegmentDirectory contract only




---
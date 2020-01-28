* [Organization](#organization)
  * [AssociatedKeyAdded](#event-associatedkeyadded)
  * [AssociatedKeyRemoved](#event-associatedkeyremoved)
  * [EntityDirectorOwnershipChanged](#event-entitydirectorownershipchanged)
  * [OrgJsonHashChanged](#event-orgjsonhashchanged)
  * [OrgJsonUriChanged](#event-orgjsonurichanged)
  * [OwnershipTransferred](#event-ownershiptransferred)
  * [SubsidiaryCreated](#event-subsidiarycreated)
  * [SubsidiaryDirectorOwnershipConfirmed](#event-subsidiarydirectorownershipconfirmed)
  * [SubsidiaryDirectorOwnershipTransferred](#event-subsidiarydirectorownershiptransferred)
  * [SubsidiaryToggled](#event-subsidiarytoggled)
  * [addAssociatedKey](#function-addassociatedkey)
  * [associatedKeys](#function-associatedkeys)
  * [associatedKeysIndex](#function-associatedkeysindex)
  * [changeEntityDirector](#function-changeentitydirector)
  * [changeOrgJsonHash](#function-changeorgjsonhash)
  * [changeOrgJsonUri](#function-changeorgjsonuri)
  * [changeOrgJsonUriAndHash](#function-changeorgjsonuriandhash)
  * [confirmSubsidiaryDirectorOwnership](#function-confirmsubsidiarydirectorownership)
  * [createSubsidiary](#function-createsubsidiary)
  * [createSubsidiaryAndAddToDirectory](#function-createsubsidiaryandaddtodirectory)
  * [created](#function-created)
  * [entityDirector](#function-entitydirector)
  * [getAssociatedKeys](#function-getassociatedkeys)
  * [getOrgJsonHash](#function-getorgjsonhash)
  * [getOrgJsonUri](#function-getorgjsonuri)
  * [getSubsidiaries](#function-getsubsidiaries)
  * [getSubsidiary](#function-getsubsidiary)
  * [hasAssociatedKey](#function-hasassociatedkey)
  * [initialize](#function-initialize)
  * [orgJsonHash](#function-orgjsonhash)
  * [orgJsonUri](#function-orgjsonuri)
  * [organizationFactory](#function-organizationfactory)
  * [owner](#function-owner)
  * [parentEntity](#function-parententity)
  * [removeAssociatedKey](#function-removeassociatedkey)
  * [setInterfaces](#function-setinterfaces)
  * [subsidiariesIndex](#function-subsidiariesindex)
  * [supportsInterface](#function-supportsinterface)
  * [toggleSubsidiary](#function-togglesubsidiary)
  * [transferDirectorOwnership](#function-transferdirectorownership)
  * [transferOwnership](#function-transferownership)

# Organization

## *event* AssociatedKeyAdded

Organization.AssociatedKeyAdded(associatedKey, index) `1cbc30c7`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | associatedKey | indexed |
| *uint256* | index | not indexed |

## *event* AssociatedKeyRemoved

Organization.AssociatedKeyRemoved(associatedKey) `e8c3a62e`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | associatedKey | indexed |

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


## *function* addAssociatedKey

Organization.addAssociatedKey(addr) `nonpayable` `8d6c8ef0`

> Adds another associated key. Only owner can call this.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | addr | Associated Ethereum address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* associatedKeys

Organization.associatedKeys() `view` `1ad2c3cb`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* associatedKeysIndex

Organization.associatedKeysIndex() `view` `df0a2bca`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


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

> `changeOrgJsonUri` Allows owner to change Organization's orgJsonUri.

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

Organization.createSubsidiary(_orgJsonUri, _orgJsonHash, subsidiaryDirector) `nonpayable` `81cab693`

> Create subsidiary

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _orgJsonUri | orgJsonUri pointer |
| *bytes32* | _orgJsonHash | keccak256 hash of the new ORG.JSON contents |
| *address* | subsidiaryDirector | Subsidiary director address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | subsidiaryAddress | Created subsidiary address |

## *function* createSubsidiaryAndAddToDirectory

Organization.createSubsidiaryAndAddToDirectory(_orgJsonUri, _orgJsonHash, subsidiaryDirector, directory) `nonpayable` `4090e12a`

> Create subsidiary and add it to a segment directory

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _orgJsonUri | orgJsonUri pointer |
| *bytes32* | _orgJsonHash | keccak256 hash of the new ORG.JSON contents |
| *address* | subsidiaryDirector | Subsidiary director address |
| *address* | directory | Segment directory address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | subsidiaryAddress | Created subsidiary address |

## *function* created

Organization.created() `view` `325a19f1`





## *function* entityDirector

Organization.entityDirector() `view` `dcfa1cdc`





## *function* getAssociatedKeys

Organization.getAssociatedKeys() `view` `0ba11d86`

> Returns all addresses associated with this organization.



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

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

## *function* hasAssociatedKey

Organization.hasAssociatedKey(addr) `view` `f5760597`

> Is an address considered as associated for this organization?

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | addr | undefined |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* |  | undefined |

## *function* initialize

Organization.initialize(__owner, _orgJsonUri, _orgJsonHash, _organizationFactory, _parentEntity, _entityDirector) `nonpayable` `a21f27f0`

> Initializer for upgradeable contracts.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | __owner | The address of the contract owner |
| *string* | _orgJsonUri | pointer to Organization data |
| *bytes32* | _orgJsonHash | keccak256 hash of the new ORG.JSON contents. |
| *address* | _organizationFactory | Organizations factory address |
| *address* | _parentEntity | Parent organization address |
| *address* | _entityDirector | Entity director address |


## *function* orgJsonHash

Organization.orgJsonHash() `view` `2095005b`





## *function* orgJsonUri

Organization.orgJsonUri() `view` `3b3ba578`





## *function* organizationFactory

Organization.organizationFactory() `view` `81d6bb50`





## *function* owner

Organization.owner() `view` `8da5cb5b`

> Returns the address of the current owner.




## *function* parentEntity

Organization.parentEntity() `view` `19fb3ff2`





## *function* removeAssociatedKey

Organization.removeAssociatedKey(addr) `nonpayable` `01aedb62`

> Removes an associated key. Only owner can call this.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | addr | Associated Ethereum address |


## *function* setInterfaces

Organization.setInterfaces() `nonpayable` `fca85eb3`

> A synchronization method that should be kept up to date with  the list of interfaces set during initialization. It should also be called everytime the implementation gets updated. If the interface list gets out of sync with the implementation at anytime, it is possible that some integrations will stop working. Since this method is not destructive, no access restriction is in place. It's supposed to be called by the proxy admin anyway.




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


---
* [OrgId](#orgid)
  * [DepositWithdrawn](#event-depositwithdrawn)
  * [DirectorOwnershipConfirmed](#event-directorownershipconfirmed)
  * [DirectorOwnershipTransferred](#event-directorownershiptransferred)
  * [LifDepositAdded](#event-lifdepositadded)
  * [LifTokenChanged](#event-liftokenchanged)
  * [OrgJsonHashChanged](#event-orgjsonhashchanged)
  * [OrgJsonUriChanged](#event-orgjsonurichanged)
  * [OrganizationCreated](#event-organizationcreated)
  * [OrganizationOwnershipTransferred](#event-organizationownershiptransferred)
  * [OrganizationToggled](#event-organizationtoggled)
  * [OwnershipTransferred](#event-ownershiptransferred)
  * [SubsidiaryCreated](#event-subsidiarycreated)
  * [WithdrawDelayChanged](#event-withdrawdelaychanged)
  * [WithdrawalRequested](#event-withdrawalrequested)
  * [addDeposit](#function-adddeposit)
  * [changeLifToken](#function-changeliftoken)
  * [changeOrgJsonHash](#function-changeorgjsonhash)
  * [changeOrgJsonUri](#function-changeorgjsonuri)
  * [changeOrgJsonUriAndHash](#function-changeorgjsonuriandhash)
  * [confirmDirectorOwnership](#function-confirmdirectorownership)
  * [createOrganization](#function-createorganization)
  * [createSubsidiary](#function-createsubsidiary)
  * [getLifTokenAddress](#function-getliftokenaddress)
  * [getOrganization](#function-getorganization)
  * [getOrganizations](#function-getorganizations)
  * [getSubsidiaries](#function-getsubsidiaries)
  * [getWithdrawDelay](#function-getwithdrawdelay)
  * [getWithdrawalRequest](#function-getwithdrawalrequest)
  * [initialize](#function-initialize)
  * [isOwner](#function-isowner)
  * [owner](#function-owner)
  * [renounceOwnership](#function-renounceownership)
  * [setInterfaces](#function-setinterfaces)
  * [setWithdrawDelay](#function-setwithdrawdelay)
  * [submitWithdrawalRequest](#function-submitwithdrawalrequest)
  * [supportsInterface](#function-supportsinterface)
  * [toggleOrganization](#function-toggleorganization)
  * [transferDirectorOwnership](#function-transferdirectorownership)
  * [transferOrganizationOwnership](#function-transferorganizationownership)
  * [transferOwnership](#function-transferownership)
  * [withdrawDeposit](#function-withdrawdeposit)

# OrgId

## *event* DepositWithdrawn

OrgId.DepositWithdrawn(orgId, sender, value) `0c4c5d4c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *address* | sender | indexed |
| *uint256* | value | not indexed |

## *event* DirectorOwnershipConfirmed

OrgId.DirectorOwnershipConfirmed(orgId, director) `fe20179a`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *address* | director | indexed |

## *event* DirectorOwnershipTransferred

OrgId.DirectorOwnershipTransferred(orgId, previousDirector, newDirector) `872246ae`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *address* | previousDirector | indexed |
| *address* | newDirector | indexed |

## *event* LifDepositAdded

OrgId.LifDepositAdded(orgId, sender, value) `6acf8bd7`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *address* | sender | indexed |
| *uint256* | value | not indexed |

## *event* LifTokenChanged

OrgId.LifTokenChanged(previousAddress, newAddress) `c380bccc`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousAddress | indexed |
| *address* | newAddress | indexed |

## *event* OrgJsonHashChanged

OrgId.OrgJsonHashChanged(orgId, previousOrgJsonHash, newOrgJsonHash) `fa137db5`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *bytes32* | previousOrgJsonHash | indexed |
| *bytes32* | newOrgJsonHash | indexed |

## *event* OrgJsonUriChanged

OrgId.OrgJsonUriChanged(orgId, previousOrgJsonUri, newOrgJsonUri) `0cd23142`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *string* | previousOrgJsonUri | not indexed |
| *string* | newOrgJsonUri | not indexed |

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

## *event* OrganizationToggled

OrgId.OrganizationToggled(orgId, previousState, newState) `e6a96d99`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *bool* | previousState | not indexed |
| *bool* | newState | not indexed |

## *event* OwnershipTransferred

OrgId.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |

## *event* SubsidiaryCreated

OrgId.SubsidiaryCreated(parentOrgId, subOrgId, director) `ea0a430a`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | parentOrgId | indexed |
| *bytes32* | subOrgId | indexed |
| *address* | director | indexed |

## *event* WithdrawDelayChanged

OrgId.WithdrawDelayChanged(previousWithdrawDelay, newWithdrawDelay) `675b321b`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | previousWithdrawDelay | not indexed |
| *uint256* | newWithdrawDelay | not indexed |

## *event* WithdrawalRequested

OrgId.WithdrawalRequested(orgId, sender, value, withdrawTime) `8b0fcbdf`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *address* | sender | indexed |
| *uint256* | value | not indexed |
| *uint256* | withdrawTime | not indexed |


## *function* addDeposit

OrgId.addDeposit(orgId, value) `nonpayable` `6e700a7f`

> Makes deposit of Lif tokens

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization OrgId |
| *uint256* | value | The value to be deposited |


## *function* changeLifToken

OrgId.changeLifToken(_lif) `nonpayable` `b8674252`

> Change Lif token

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _lif | Address of the Lif token |


## *function* changeOrgJsonHash

OrgId.changeOrgJsonHash(orgId, orgJsonHash) `nonpayable` `7fc5f5fb`

> Allows owner to change Organization"s orgJsonHash

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization OrgId |
| *bytes32* | orgJsonHash | keccak256 hash of the new ORG.JSON contents |


## *function* changeOrgJsonUri

OrgId.changeOrgJsonUri(orgId, orgJsonUri) `nonpayable` `57b5e80d`

> Allows owner to change Organization"s orgJsonUri

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization OrgId |
| *string* | orgJsonUri | New orgJsonUri pointer of this Organization |


## *function* changeOrgJsonUriAndHash

OrgId.changeOrgJsonUriAndHash(orgId, orgJsonUri, orgJsonHash) `nonpayable` `f1745894`

> Shorthand method to change ORG.JSON uri and hash at the same time

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization Id |
| *string* | orgJsonUri | New orgJsonUri pointer of this Organization |
| *bytes32* | orgJsonHash | keccak256 hash of the new ORG.JSON contents. |


## *function* confirmDirectorOwnership

OrgId.confirmDirectorOwnership(orgId) `nonpayable` `4b845bef`

> Confirmation of the organization director ownership

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization Id |


## *function* createOrganization

OrgId.createOrganization(orgId, orgJsonUri, orgJsonHash) `nonpayable` `0670af5c`

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
| *bytes32* | id | The organization Id |

## *function* createSubsidiary

OrgId.createSubsidiary(orgId, subOrgId, subsidiaryDirector, orgJsonUri, orgJsonHash) `nonpayable` `981f3dcf`

> Create subsidiary

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization Id |
| *bytes32* | subOrgId | The subsidiary organization Id |
| *address* | subsidiaryDirector | Subsidiary director address |
| *string* | orgJsonUri | orgJsonUri pointer |
| *bytes32* | orgJsonHash | keccak256 hash of the new ORG.JSON contents |


## *function* getLifTokenAddress

OrgId.getLifTokenAddress() `view` `671110df`

> Returns Lif token address



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | lifToken | Address of the Lif token |

## *function* getOrganization

OrgId.getOrganization(_orgId) `view` `22b3cd4e`

> Get organization by orgId

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | _orgId | The organization Id |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* | exist | The organizatoin existence flag |
| *bytes32* | orgId | The organization orgId |
| *string* | orgJsonUri | orgJsonUri pointer of this Organization |
| *bytes32* | orgJsonHash | keccak256 hash of the new ORG.JSON contents |
| *bytes32* | parentEntity | The parent organization orgId |
| *address* | owner | The organization owner |
| *address* | director | The organization director |
| *bool* | state | State of the organization |
| *bool* | directorConfirmed | Flag is director ownership is confirmed |
| *uint256* | deposit | Lif deposit value |

## *function* getOrganizations

OrgId.getOrganizations() `view` `9754a3a8`

> Return an array of active organizations orgIds



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32[]* |  | undefined |

## *function* getSubsidiaries

OrgId.getSubsidiaries(orgId) `view` `5aee5dc7`

> Return an array of active subsidiaries orgIds

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | undefined |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32[]* |  | undefined |

## *function* getWithdrawDelay

OrgId.getWithdrawDelay() `view` `fe3300d0`

> Returns withdrawDelay value



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | delay | Delay time in seconds before the requested withdrawal will be possible |

## *function* getWithdrawalRequest

OrgId.getWithdrawalRequest(orgId) `view` `3e7d48ab`

> Returns information about deposit withdrawal request

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization Id |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* | exist | The request existence flag |
| *uint256* | value | Deposit withdrawal value |
| *uint256* | withdrawTime | Withraw time on seconds |

## *function* initialize

OrgId.initialize(__owner, _lif) `nonpayable` `485cc955`

> Initializer for upgradeable contracts

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | __owner | The address of the contract owner |
| *address* | _lif | Address of the Lif token |


## *function* isOwner

OrgId.isOwner() `view` `8f32d59b`

> Returns true if the caller is the current owner.




## *function* owner

OrgId.owner() `view` `8da5cb5b`

> Returns the address of the current owner.




## *function* renounceOwnership

OrgId.renounceOwnership() `nonpayable` `715018a6`

> Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner.     * NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.




## *function* setInterfaces

OrgId.setInterfaces() `nonpayable` `fca85eb3`

> Set the list of contract interfaces supported




## *function* setWithdrawDelay

OrgId.setWithdrawDelay(_withdrawDelay) `nonpayable` `72f0cb30`

> Changing withdrawDelay value

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | _withdrawDelay | New withdrawDelay value in seconds |


## *function* submitWithdrawalRequest

OrgId.submitWithdrawalRequest(orgId, value) `nonpayable` `fa094c70`

> Submits withdrawal request

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization OrgId |
| *uint256* | value | The value to withdraw |


## *function* supportsInterface

OrgId.supportsInterface(interfaceId) `view` `01ffc9a7`

> See {IERC165-supportsInterface}.     * Time complexity O(1), guaranteed to always use less than 30 000 gas.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes4* | interfaceId | undefined |


## *function* toggleOrganization

OrgId.toggleOrganization(orgId) `nonpayable` `07233a3d`

> Toggle the organization state

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization Id |


## *function* transferDirectorOwnership

OrgId.transferDirectorOwnership(orgId, newDirector) `nonpayable` `b34ef9b7`

> Transfer subsidiary director ownership

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization Id |
| *address* | newDirector | New subsidiary director address |


## *function* transferOrganizationOwnership

OrgId.transferOrganizationOwnership(orgId, newOwner) `nonpayable` `aa73697e`

> Transfer organization ownership

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization Id |
| *address* | newOwner | New subsidiary director address |


## *function* transferOwnership

OrgId.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | undefined |


## *function* withdrawDeposit

OrgId.withdrawDeposit(orgId) `nonpayable` `a8e06bc3`

> Trunsfers deposited tokens to the sender

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization OrgId |


---
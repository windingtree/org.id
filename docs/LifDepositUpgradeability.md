* [LifDepositUpgradeability](#lifdepositupgradeability)
  * [DepositWithdrawn](#event-depositwithdrawn)
  * [LifDepositAdded](#event-lifdepositadded)
  * [OwnershipTransferred](#event-ownershiptransferred)
  * [WithdrawDelayChanged](#event-withdrawdelaychanged)
  * [WithdrawalRequested](#event-withdrawalrequested)
  * [addDeposit](#function-adddeposit)
  * [balanceOf](#function-balanceof)
  * [getLifTokenAddress](#function-getliftokenaddress)
  * [getWithdrawDelay](#function-getwithdrawdelay)
  * [getWithdrawalRequest](#function-getwithdrawalrequest)
  * [initialize](#function-initialize)
  * [initialize](#function-initialize)
  * [isOwner](#function-isowner)
  * [newFunction](#function-newfunction)
  * [owner](#function-owner)
  * [renounceOwnership](#function-renounceownership)
  * [setInterfaces](#function-setinterfaces)
  * [setWithdrawDelay](#function-setwithdrawdelay)
  * [setupNewStorage](#function-setupnewstorage)
  * [submitWithdrawalRequest](#function-submitwithdrawalrequest)
  * [supportsInterface](#function-supportsinterface)
  * [test](#function-test)
  * [transferOwnership](#function-transferownership)
  * [withdrawDeposit](#function-withdrawdeposit)

# LifDepositUpgradeability

## *event* DepositWithdrawn

LifDepositUpgradeability.DepositWithdrawn(organization, sender, value) `0c4c5d4c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | organization | indexed |
| *address* | sender | indexed |
| *uint256* | value | not indexed |

## *event* LifDepositAdded

LifDepositUpgradeability.LifDepositAdded(organization, sender, value) `6acf8bd7`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | organization | indexed |
| *address* | sender | indexed |
| *uint256* | value | not indexed |

## *event* OwnershipTransferred

LifDepositUpgradeability.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |

## *event* WithdrawDelayChanged

LifDepositUpgradeability.WithdrawDelayChanged(previousWithdrawDelay, newWithdrawDelay) `675b321b`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | previousWithdrawDelay | not indexed |
| *uint256* | newWithdrawDelay | not indexed |

## *event* WithdrawalRequested

LifDepositUpgradeability.WithdrawalRequested(organization, sender, value, withdrawTime) `8b0fcbdf`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | organization | indexed |
| *address* | sender | indexed |
| *uint256* | value | not indexed |
| *uint256* | withdrawTime | not indexed |


## *function* addDeposit

LifDepositUpgradeability.addDeposit(organization, value) `nonpayable` `6e700a7f`

> Makes deposit of Lif tokens

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | organization | The organization OrgId |
| *uint256* | value | The value to be deposited |


## *function* balanceOf

LifDepositUpgradeability.balanceOf(organization) `view` `6c7f1542`

> Returns deposit value of the organization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | organization | The organization Id |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | balance | Deposit value |

## *function* getLifTokenAddress

LifDepositUpgradeability.getLifTokenAddress() `view` `671110df`

> Returns Lif token address



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | lifToken | Address of the Lif token |

## *function* getWithdrawDelay

LifDepositUpgradeability.getWithdrawDelay() `view` `fe3300d0`

> Returns withdrawDelay value



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | delay | Delay time in seconds before the requested withdrawal will be possible |

## *function* getWithdrawalRequest

LifDepositUpgradeability.getWithdrawalRequest(organization) `view` `3e7d48ab`

> Returns information about deposit withdrawal request

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | organization | The organization Id |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* | exist | The request existence flag |
| *uint256* | value | Deposit withdrawal value |
| *uint256* | withdrawTime | Withraw time on seconds |

## *function* initialize

LifDepositUpgradeability.initialize() `nonpayable` `8129fc1c`





## *function* initialize

LifDepositUpgradeability.initialize(__owner, _orgId, _lif) `nonpayable` `c0c53b8b`

> Initializer for upgradeable contracts

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | __owner | The address of the contract owner |
| *address* | _orgId | Address of the OrgId contract |
| *address* | _lif | Address of the Lif token |


## *function* isOwner

LifDepositUpgradeability.isOwner() `view` `8f32d59b`

> Returns true if the caller is the current owner.




## *function* newFunction

LifDepositUpgradeability.newFunction() `view` `1b28d63e`





## *function* owner

LifDepositUpgradeability.owner() `view` `8da5cb5b`

> Returns the address of the current owner.




## *function* renounceOwnership

LifDepositUpgradeability.renounceOwnership() `nonpayable` `715018a6`

> Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner.     * NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.




## *function* setInterfaces

LifDepositUpgradeability.setInterfaces() `nonpayable` `fca85eb3`

> Set the list of contract interfaces supported




## *function* setWithdrawDelay

LifDepositUpgradeability.setWithdrawDelay(_withdrawDelay) `nonpayable` `72f0cb30`

> Changing withdrawDelay value

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | _withdrawDelay | New withdrawDelay value in seconds |


## *function* setupNewStorage

LifDepositUpgradeability.setupNewStorage(value) `nonpayable` `00551333`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | value | undefined |


## *function* submitWithdrawalRequest

LifDepositUpgradeability.submitWithdrawalRequest(organization, value) `nonpayable` `fa094c70`

> Submits withdrawal request

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | organization | The organization OrgId |
| *uint256* | value | The value to withdraw |


## *function* supportsInterface

LifDepositUpgradeability.supportsInterface(interfaceId) `view` `01ffc9a7`

> See {IERC165-supportsInterface}.     * Time complexity O(1), guaranteed to always use less than 30 000 gas.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes4* | interfaceId | undefined |


## *function* test

LifDepositUpgradeability.test() `view` `f8a8fd6d`





## *function* transferOwnership

LifDepositUpgradeability.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | undefined |


## *function* withdrawDeposit

LifDepositUpgradeability.withdrawDeposit(organization) `nonpayable` `a8e06bc3`

> Trunsfers deposited tokens to the sender

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | organization | The organization OrgId |


---
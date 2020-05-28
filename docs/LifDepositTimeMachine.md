* [LifDepositTimeMachine](#lifdeposittimemachine)
  * [DepositWithdrawn](#event-depositwithdrawn)
  * [LifDepositAdded](#event-lifdepositadded)
  * [OwnershipTransferred](#event-ownershiptransferred)
  * [TimeMachine](#event-timemachine)
  * [WithdrawDelayChanged](#event-withdrawdelaychanged)
  * [WithdrawalRequested](#event-withdrawalrequested)
  * [addDeposit](#function-adddeposit)
  * [balanceOf](#function-balanceof)
  * [currentTime](#function-currenttime)
  * [getLifTokenAddress](#function-getliftokenaddress)
  * [getWithdrawDelay](#function-getwithdrawdelay)
  * [getWithdrawalRequest](#function-getwithdrawalrequest)
  * [initialize](#function-initialize)
  * [isOwner](#function-isowner)
  * [owner](#function-owner)
  * [renounceOwnership](#function-renounceownership)
  * [setCurrentTime](#function-setcurrenttime)
  * [setInterfaces](#function-setinterfaces)
  * [setWithdrawDelay](#function-setwithdrawdelay)
  * [submitWithdrawalRequest](#function-submitwithdrawalrequest)
  * [supportsInterface](#function-supportsinterface)
  * [transferOwnership](#function-transferownership)
  * [withdrawDeposit](#function-withdrawdeposit)

# LifDepositTimeMachine

## *event* DepositWithdrawn

LifDepositTimeMachine.DepositWithdrawn(organization, sender, value) `0c4c5d4c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | organization | indexed |
| *address* | sender | indexed |
| *uint256* | value | not indexed |

## *event* LifDepositAdded

LifDepositTimeMachine.LifDepositAdded(organization, sender, value) `6acf8bd7`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | organization | indexed |
| *address* | sender | indexed |
| *uint256* | value | not indexed |

## *event* OwnershipTransferred

LifDepositTimeMachine.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |

## *event* TimeMachine

LifDepositTimeMachine.TimeMachine(oldTime, newTime) `78028a94`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | oldTime | not indexed |
| *uint256* | newTime | not indexed |

## *event* WithdrawDelayChanged

LifDepositTimeMachine.WithdrawDelayChanged(previousWithdrawDelay, newWithdrawDelay) `675b321b`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | previousWithdrawDelay | not indexed |
| *uint256* | newWithdrawDelay | not indexed |

## *event* WithdrawalRequested

LifDepositTimeMachine.WithdrawalRequested(organization, sender, value, withdrawTime) `8b0fcbdf`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | organization | indexed |
| *address* | sender | indexed |
| *uint256* | value | not indexed |
| *uint256* | withdrawTime | not indexed |


## *function* addDeposit

LifDepositTimeMachine.addDeposit(organization, value) `nonpayable` `6e700a7f`

> Makes deposit of Lif tokens

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | organization | The organization OrgId |
| *uint256* | value | The value to be deposited |


## *function* balanceOf

LifDepositTimeMachine.balanceOf(organization) `view` `6c7f1542`

> Returns deposit value of the organization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | organization | The organization Id |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | balance | Deposit value |

## *function* currentTime

LifDepositTimeMachine.currentTime() `view` `d18e81b3`

> Get current contract time



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | contractTime | Current time inside the contract used as 'now' |

## *function* getLifTokenAddress

LifDepositTimeMachine.getLifTokenAddress() `view` `671110df`

> Returns Lif token address



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | lifToken | Address of the Lif token |

## *function* getWithdrawDelay

LifDepositTimeMachine.getWithdrawDelay() `view` `fe3300d0`

> Returns withdrawDelay value



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | delay | Delay time in seconds before the requested withdrawal will be possible |

## *function* getWithdrawalRequest

LifDepositTimeMachine.getWithdrawalRequest(organization) `view` `3e7d48ab`

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

LifDepositTimeMachine.initialize(__owner, _orgId, _lif) `nonpayable` `c0c53b8b`

> Initializer for upgradeable contracts

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | __owner | The address of the contract owner |
| *address* | _orgId | Address of the OrgId contract |
| *address* | _lif | Address of the Lif token |


## *function* isOwner

LifDepositTimeMachine.isOwner() `view` `8f32d59b`

> Returns true if the caller is the current owner.




## *function* owner

LifDepositTimeMachine.owner() `view` `8da5cb5b`

> Returns the address of the current owner.




## *function* renounceOwnership

LifDepositTimeMachine.renounceOwnership() `nonpayable` `715018a6`

> Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner.     * NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.




## *function* setCurrentTime

LifDepositTimeMachine.setCurrentTime(time) `nonpayable` `22f8e566`

> Set new contract time

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | time | New time value |


## *function* setInterfaces

LifDepositTimeMachine.setInterfaces() `nonpayable` `fca85eb3`

> Set the list of contract interfaces supported




## *function* setWithdrawDelay

LifDepositTimeMachine.setWithdrawDelay(_withdrawDelay) `nonpayable` `72f0cb30`

> Changing withdrawDelay value

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | _withdrawDelay | New withdrawDelay value in seconds |


## *function* submitWithdrawalRequest

LifDepositTimeMachine.submitWithdrawalRequest(organization, value) `nonpayable` `fa094c70`

> Submits withdrawal request

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | organization | The organization OrgId |
| *uint256* | value | The value to withdraw |


## *function* supportsInterface

LifDepositTimeMachine.supportsInterface(interfaceId) `view` `01ffc9a7`

> See {IERC165-supportsInterface}.     * Time complexity O(1), guaranteed to always use less than 30 000 gas.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes4* | interfaceId | undefined |


## *function* transferOwnership

LifDepositTimeMachine.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | undefined |


## *function* withdrawDeposit

LifDepositTimeMachine.withdrawDeposit(organization) `nonpayable` `a8e06bc3`

> Trunsfers deposited tokens to the sender

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | organization | The organization OrgId |


---
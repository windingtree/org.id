* [LifDepositInterface](#lifdepositinterface)
  * [addDeposit](#function-adddeposit)
  * [getLifTokenAddress](#function-getliftokenaddress)
  * [getWithdrawDelay](#function-getwithdrawdelay)
  * [getWithdrawalRequest](#function-getwithdrawalrequest)
  * [setWithdrawDelay](#function-setwithdrawdelay)
  * [submitWithdrawalRequest](#function-submitwithdrawalrequest)
  * [withdrawDeposit](#function-withdrawdeposit)

# LifDepositInterface


## *function* addDeposit

LifDepositInterface.addDeposit(organization, value) `nonpayable` `6e700a7f`

> Makes deposit of Lif tokens

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | organization | The organization Id |
| *uint256* | value | The value to be deposited |


## *function* getLifTokenAddress

LifDepositInterface.getLifTokenAddress() `view` `671110df`

> Returns Lif token address



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | lifToken | Address of the Lif token |

## *function* getWithdrawDelay

LifDepositInterface.getWithdrawDelay() `view` `fe3300d0`

> Returns withdrawDelay value



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | delay | Delay time in seconds before the requested withdrawal will be possible |

## *function* getWithdrawalRequest

LifDepositInterface.getWithdrawalRequest(organization) `view` `3e7d48ab`

> Returns information about deposit withdrawal request

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | organization | The organization Id |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* | existed | The request existence flag |
| *uint256* | value | Deposit withdrawal value |
| *uint256* | withdrawTime | Withraw time on seconds |

## *function* setWithdrawDelay

LifDepositInterface.setWithdrawDelay(_withdrawDelay) `nonpayable` `72f0cb30`

> Changing withdrawDelay value

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | _withdrawDelay | New withdrawDelay value in seconds |


## *function* submitWithdrawalRequest

LifDepositInterface.submitWithdrawalRequest(organization, value) `nonpayable` `fa094c70`

> Submits withdrawal request

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | organization | The organization Id |
| *uint256* | value | The value to withdraw |


## *function* withdrawDeposit

LifDepositInterface.withdrawDeposit(organization) `nonpayable` `a8e06bc3`

> Trunsfers deposited tokens to the sender

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | organization | The organization OrgId |


---
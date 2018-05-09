* [AsyncCall_Interface](#asynccall_interface)
  * [beginCall](#function-begincall)
  * [pendingCalls](#function-pendingcalls)
  * [continueCall](#function-continuecall)
  * [changeConfirmation](#function-changeconfirmation)
  * [owner](#function-owner)
  * [waitConfirmation](#function-waitconfirmation)
  * [transferOwnership](#function-transferownership)
  * [CallStarted](#event-callstarted)
  * [CallFinish](#event-callfinish)
  * [OwnershipTransferred](#event-ownershiptransferred)

# AsyncCall_Interface


## *function* beginCall

AsyncCall_Interface.beginCall(publicCallData, privateData) `nonpayable` `203eaf27`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes* | publicCallData | undefined |
| *bytes* | privateData | undefined |


## *function* pendingCalls

AsyncCall_Interface.pendingCalls() `view` `32fdd45c`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* |  | undefined |


## *function* continueCall

AsyncCall_Interface.continueCall(msgDataHash) `nonpayable` `411f2351`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | msgDataHash | undefined |


## *function* changeConfirmation

AsyncCall_Interface.changeConfirmation(_waitConfirmation) `nonpayable` `44f5484a`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* | _waitConfirmation | undefined |


## *function* owner

AsyncCall_Interface.owner() `view` `8da5cb5b`





## *function* waitConfirmation

AsyncCall_Interface.waitConfirmation() `view` `ac72bb98`





## *function* transferOwnership

AsyncCall_Interface.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |

## *event* CallStarted

AsyncCall_Interface.CallStarted(from, dataHash) `5ec33322`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | from | not indexed |
| *bytes32* | dataHash | not indexed |

## *event* CallFinish

AsyncCall_Interface.CallFinish(from, dataHash) `b2be3874`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | from | not indexed |
| *bytes32* | dataHash | not indexed |

## *event* OwnershipTransferred

AsyncCall_Interface.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
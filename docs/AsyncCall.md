* [AsyncCall](#asynccall)
  * [beginCall](#function-begincall)
  * [pendingCalls](#function-pendingcalls)
  * [continueCall](#function-continuecall)
  * [changeConfirmation](#function-changeconfirmation)
  * [version](#function-version)
  * [owner](#function-owner)
  * [waitConfirmation](#function-waitconfirmation)
  * [getPublicCallData](#function-getpubliccalldata)
  * [contractType](#function-contracttype)
  * [transferOwnership](#function-transferownership)
  * [CallStarted](#event-callstarted)
  * [CallFinish](#event-callfinish)
  * [OwnershipTransferred](#event-ownershiptransferred)

# AsyncCall


## *function* beginCall

AsyncCall.beginCall(publicCallData, privateData) `nonpayable` `203eaf27`

> `beginCall` requests the execution of a call by the contract

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes* | publicCallData | The call data to be executed |
| *bytes* | privateData | The extra, encrypted data stored as a parameter returns true if the call was requested succesfully |


## *function* pendingCalls

AsyncCall.pendingCalls() `view` `32fdd45c`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* |  | undefined |


## *function* continueCall

AsyncCall.continueCall(msgDataHash) `nonpayable` `411f2351`

> `continueCall` allows the owner to approve the execution of a call

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | msgDataHash | The hash of the call to be executed |


## *function* changeConfirmation

AsyncCall.changeConfirmation(_waitConfirmation) `nonpayable` `44f5484a`

> `changeConfirmation` allows the owner of the contract to switch the `waitConfirmation` value

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* | _waitConfirmation | The new `waitConfirmation` value |


## *function* version

AsyncCall.version() `view` `54fd4d50`





## *function* owner

AsyncCall.owner() `view` `8da5cb5b`





## *function* waitConfirmation

AsyncCall.waitConfirmation() `view` `ac72bb98`





## *function* getPublicCallData

AsyncCall.getPublicCallData(msgDataHash) `view` `acc36826`

> `getPublicCallData` returns the data to be executed of a pending call

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | msgDataHash | The hash of the pending call |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes* | _callData | The public call data |

## *function* contractType

AsyncCall.contractType() `view` `cb2ef6f7`





## *function* transferOwnership

AsyncCall.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |

## *event* CallStarted

AsyncCall.CallStarted(from, dataHash) `5ec33322`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | from | not indexed |
| *bytes32* | dataHash | not indexed |

## *event* CallFinish

AsyncCall.CallFinish(from, dataHash) `b2be3874`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | from | not indexed |
| *bytes32* | dataHash | not indexed |

## *event* OwnershipTransferred

AsyncCall.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
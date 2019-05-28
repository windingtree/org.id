* [Organization](#organization)
  * [supportsInterface](#function-supportsinterface)
  * [isDelegate](#function-isdelegate)
  * [changeDataUri](#function-changedatauri)
  * [created](#function-created)
  * [getDataUri](#function-getdatauri)
  * [removeDelegate](#function-removedelegate)
  * [renounceOwnership](#function-renounceownership)
  * [dataUri](#function-datauri)
  * [owner](#function-owner)
  * [isOwner](#function-isowner)
  * [delegates](#function-delegates)
  * [delegatesIndex](#function-delegatesindex)
  * [addDelegate](#function-adddelegate)
  * [transferOwnership](#function-transferownership)
  * [OwnershipTransferred](#event-ownershiptransferred)
  * [DataUriChanged](#event-dataurichanged)
  * [DelegateAdded](#event-delegateadded)
  * [DelegateRemoved](#event-delegateremoved)

# Organization


## *function* supportsInterface

Organization.supportsInterface(interfaceId) `view` `01ffc9a7`

> See `IERC165.supportsInterface`.     * Time complexity O(1), guaranteed to always use less than 30 000 gas.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes4* | interfaceId | undefined |


## *function* isDelegate

Organization.isDelegate(addr) `view` `07779627`

> Is an address considered a delegate for this organization?

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | addr | undefined |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* |  | undefined |

## *function* changeDataUri

Organization.changeDataUri(_dataUri) `nonpayable` `18f9205d`

> `changeDataUri` Allows owner to change Organization's dataUri.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _dataUri | New dataUri pointer of this Organization |


## *function* created

Organization.created() `view` `325a19f1`





## *function* getDataUri

Organization.getDataUri() `view` `65f2c7a7`

> Returns current dataUri



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *string* |  | undefined |

## *function* removeDelegate

Organization.removeDelegate(addr) `nonpayable` `67e7646f`

> Removes delegate address. Only owner can call this.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | addr | Delegate's Ethereum address |


## *function* renounceOwnership

Organization.renounceOwnership() `nonpayable` `715018a6`

> Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner.     * > Note: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.




## *function* dataUri

Organization.dataUri() `view` `8a9b29eb`





## *function* owner

Organization.owner() `view` `8da5cb5b`

> Returns the address of the current owner.




## *function* isOwner

Organization.isOwner() `view` `8f32d59b`

> Returns true if the caller is the current owner.




## *function* delegates

Organization.delegates() `view` `b1548afc`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* delegatesIndex

Organization.delegatesIndex() `view` `c72934d5`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* addDelegate

Organization.addDelegate(addr) `nonpayable` `e71bdf41`

> Adds new delegate address. Only owner can call this.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | addr | Delegate's Ethereum address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* transferOwnership

Organization.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | undefined |


## *event* OwnershipTransferred

Organization.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |

## *event* DataUriChanged

Organization.DataUriChanged(previousDataUri, newDataUri) `2b3a8c1a`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *string* | previousDataUri | indexed |
| *string* | newDataUri | indexed |

## *event* DelegateAdded

Organization.DelegateAdded(delegate, index) `ea230cdd`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | delegate | indexed |
| *uint256* | index | not indexed |

## *event* DelegateRemoved

Organization.DelegateRemoved(delegate) `5a362b19`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | delegate | indexed |


---
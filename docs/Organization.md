* [Organization](#organization)
  * [changeDataUri](#function-changedatauri)
  * [created](#function-created)
  * [renounceOwnership](#function-renounceownership)
  * [dataUri](#function-datauri)
  * [owner](#function-owner)
  * [isOwner](#function-isowner)
  * [transferOwnership](#function-transferownership)
  * [OwnershipTransferred](#event-ownershiptransferred)
  * [DataUriChanged](#event-dataurichanged)

# Organization


## *function* changeDataUri

Organization.changeDataUri(_dataUri) `nonpayable` `18f9205d`

> `changeDataUri` Allows owner to change Organization's dataUri.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _dataUri | New dataUri pointer of this Organization |


## *function* created

Organization.created() `view` `325a19f1`





## *function* renounceOwnership

Organization.renounceOwnership() `nonpayable` `715018a6`

**Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.**

> Allows the current owner to relinquish control of the contract. It will not be possible to call the functions with the `onlyOwner` modifier anymore.




## *function* dataUri

Organization.dataUri() `view` `8a9b29eb`





## *function* owner

Organization.owner() `view` `8da5cb5b`




Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* isOwner

Organization.isOwner() `view` `8f32d59b`




Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* |  | undefined |

## *function* transferOwnership

Organization.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |


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


---
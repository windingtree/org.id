* [OrganizationUpgradeabilityTest](#organizationupgradeabilitytest)
  * [changeDataUri](#function-changedatauri)
  * [newFunction](#function-newfunction)
  * [created](#function-created)
  * [renounceOwnership](#function-renounceownership)
  * [dataUri](#function-datauri)
  * [owner](#function-owner)
  * [isOwner](#function-isowner)
  * [transferOwnership](#function-transferownership)
  * [OwnershipTransferred](#event-ownershiptransferred)
  * [DataUriChanged](#event-dataurichanged)

# OrganizationUpgradeabilityTest


## *function* changeDataUri

OrganizationUpgradeabilityTest.changeDataUri(_dataUri) `nonpayable` `18f9205d`

> `changeDataUri` Allows owner to change Organization's dataUri.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _dataUri | New dataUri pointer of this Organization |


## *function* newFunction

OrganizationUpgradeabilityTest.newFunction() `pure` `1b28d63e`





## *function* created

OrganizationUpgradeabilityTest.created() `view` `325a19f1`





## *function* renounceOwnership

OrganizationUpgradeabilityTest.renounceOwnership() `nonpayable` `715018a6`

**Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.**

> Allows the current owner to relinquish control of the contract. It will not be possible to call the functions with the `onlyOwner` modifier anymore.




## *function* dataUri

OrganizationUpgradeabilityTest.dataUri() `view` `8a9b29eb`





## *function* owner

OrganizationUpgradeabilityTest.owner() `view` `8da5cb5b`




Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* isOwner

OrganizationUpgradeabilityTest.isOwner() `view` `8f32d59b`




Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* |  | undefined |

## *function* transferOwnership

OrganizationUpgradeabilityTest.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |


## *event* OwnershipTransferred

OrganizationUpgradeabilityTest.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |

## *event* DataUriChanged

OrganizationUpgradeabilityTest.DataUriChanged(previousDataUri, newDataUri) `2b3a8c1a`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *string* | previousDataUri | indexed |
| *string* | newDataUri | indexed |


---
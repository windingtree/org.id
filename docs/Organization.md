* [Organization](#organization)
  * [changeDataUri](#function-changedatauri)
  * [created](#function-created)
  * [manager](#function-manager)
  * [destroy](#function-destroy)
  * [dataUri](#function-datauri)
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





## *function* manager

Organization.manager() `view` `481c6a75`





## *function* destroy

Organization.destroy() `nonpayable` `83197ef0`

> `destroy` allows the owner to delete the Organization altogether. All associated funds are transferred to the `manager`.




## *function* dataUri

Organization.dataUri() `view` `8a9b29eb`





## *function* transferOwnership

Organization.transferOwnership(newManager) `nonpayable` `f2fde38b`

> Allows owner to change Organization manager.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newManager | New manager's address |


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
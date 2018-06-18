* [Hotel](#hotel)
  * [created](#function-created)
  * [manager](#function-manager)
  * [version](#function-version)
  * [renounceOwnership](#function-renounceownership)
  * [destroy](#function-destroy)
  * [dataUri](#function-datauri)
  * [owner](#function-owner)
  * [editInfo](#function-editinfo)
  * [contractType](#function-contracttype)
  * [transferOwnership](#function-transferownership)
  * [destroyAndSend](#function-destroyandsend)
  * [OwnershipRenounced](#event-ownershiprenounced)
  * [OwnershipTransferred](#event-ownershiptransferred)

# Hotel


## *function* created

Hotel.created() `view` `325a19f1`





## *function* manager

Hotel.manager() `view` `481c6a75`





## *function* version

Hotel.version() `view` `54fd4d50`





## *function* renounceOwnership

Hotel.renounceOwnership() `nonpayable` `715018a6`

> Allows the current owner to relinquish control of the contract.




## *function* destroy

Hotel.destroy() `nonpayable` `83197ef0`

> `destroy` allows the owner to delete the Hotel




## *function* dataUri

Hotel.dataUri() `view` `8a9b29eb`





## *function* owner

Hotel.owner() `view` `8da5cb5b`





## *function* editInfo

Hotel.editInfo(_dataUri) `nonpayable` `9d9b5342`

> `editInfo` Allows manager to change hotel's dataUri.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _dataUri | New dataUri pointer of this hotel |


## *function* contractType

Hotel.contractType() `view` `cb2ef6f7`





## *function* transferOwnership

Hotel.transferOwnership(_newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _newOwner | The address to transfer ownership to. |


## *function* destroyAndSend

Hotel.destroyAndSend(_recipient) `nonpayable` `f5074f41`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _recipient | undefined |


## *event* OwnershipRenounced

Hotel.OwnershipRenounced(previousOwner) `f8df3114`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |

## *event* OwnershipTransferred

Hotel.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
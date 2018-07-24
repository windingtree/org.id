* [AbstractHotel](#abstracthotel)
  * [index](#function-index)
  * [created](#function-created)
  * [manager](#function-manager)
  * [version](#function-version)
  * [destroy](#function-destroy)
  * [dataUri](#function-datauri)
  * [editInfo](#function-editinfo)
  * [changeManager](#function-changemanager)
  * [contractType](#function-contracttype)

# AbstractHotel


## *function* index

AbstractHotel.index() `view` `2986c0e5`





## *function* created

AbstractHotel.created() `view` `325a19f1`





## *function* manager

AbstractHotel.manager() `view` `481c6a75`





## *function* version

AbstractHotel.version() `view` `54fd4d50`





## *function* destroy

AbstractHotel.destroy() `nonpayable` `83197ef0`

> `destroy` allows the owner to delete the Hotel




## *function* dataUri

AbstractHotel.dataUri() `view` `8a9b29eb`





## *function* editInfo

AbstractHotel.editInfo(_dataUri) `nonpayable` `9d9b5342`

> `editInfo` Allows owner to change hotel's dataUri.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _dataUri | New dataUri pointer of this hotel |


## *function* changeManager

AbstractHotel.changeManager(_newManager) `nonpayable` `a3fbbaae`

> Allows owner to change hotel manager.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _newManager | New manager's address |


## *function* contractType

AbstractHotel.contractType() `view` `cb2ef6f7`





---
* [Hotel](#hotel)
  * [index](#function-index)
  * [created](#function-created)
  * [manager](#function-manager)
  * [version](#function-version)
  * [destroy](#function-destroy)
  * [dataUri](#function-datauri)
  * [editInfo](#function-editinfo)
  * [changeManager](#function-changemanager)
  * [contractType](#function-contracttype)

# Hotel


## *function* index

Hotel.index() `view` `2986c0e5`





## *function* created

Hotel.created() `view` `325a19f1`





## *function* manager

Hotel.manager() `view` `481c6a75`





## *function* version

Hotel.version() `view` `54fd4d50`





## *function* destroy

Hotel.destroy() `nonpayable` `83197ef0`

> `destroy` allows the owner to delete the Hotel




## *function* dataUri

Hotel.dataUri() `view` `8a9b29eb`





## *function* editInfo

Hotel.editInfo(_dataUri) `nonpayable` `9d9b5342`

> `editInfo` Allows owner to change hotel's dataUri.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _dataUri | New dataUri pointer of this hotel |


## *function* changeManager

Hotel.changeManager(_newManager) `nonpayable` `a3fbbaae`

> Allows owner to change hotel manager.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _newManager | New manager's address |


## *function* contractType

Hotel.contractType() `view` `cb2ef6f7`






---
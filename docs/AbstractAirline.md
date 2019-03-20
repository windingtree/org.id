* [AbstractAirline](#abstractairline)
  * [index](#function-index)
  * [created](#function-created)
  * [manager](#function-manager)
  * [destroy](#function-destroy)
  * [dataUri](#function-datauri)
  * [editInfo](#function-editinfo)
  * [changeManager](#function-changemanager)

# AbstractAirline


## *function* index

AbstractAirline.index() `view` `2986c0e5`





## *function* created

AbstractAirline.created() `view` `325a19f1`





## *function* manager

AbstractAirline.manager() `view` `481c6a75`





## *function* destroy

AbstractAirline.destroy() `nonpayable` `83197ef0`

> `destroy` allows the owner to delete the airline




## *function* dataUri

AbstractAirline.dataUri() `view` `8a9b29eb`





## *function* editInfo

AbstractAirline.editInfo(_dataUri) `nonpayable` `9d9b5342`

> `editInfo` Allows owner to change airline's dataUri.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _dataUri | New dataUri pointer of this hotel |


## *function* changeManager

AbstractAirline.changeManager(_newManager) `nonpayable` `a3fbbaae`

> Allows owner to change airline manager.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _newManager | New manager's address |


---
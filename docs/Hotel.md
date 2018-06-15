* [Hotel](#hotel)
  * [created](#function-created)
  * [manager](#function-manager)
  * [version](#function-version)
  * [url](#function-url)
  * [renounceOwnership](#function-renounceownership)
  * [destroy](#function-destroy)
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





## *function* url

Hotel.url() `view` `5600f04f`





## *function* renounceOwnership

Hotel.renounceOwnership() `nonpayable` `715018a6`

> Allows the current owner to relinquish control of the contract.




## *function* destroy

Hotel.destroy() `nonpayable` `83197ef0`

> `destroy` allows the owner to delete the Hotel




## *function* owner

Hotel.owner() `view` `8da5cb5b`





## *function* editInfo

Hotel.editInfo(_url) `nonpayable` `9d9b5342`

> `editInfo` Allows manager to change hotel's url.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _url | New url pointer of this hotel |


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
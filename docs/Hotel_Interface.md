* [Hotel_Interface](#hotel_interface)
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

# Hotel_Interface


## *function* created

Hotel_Interface.created() `view` `325a19f1`





## *function* manager

Hotel_Interface.manager() `view` `481c6a75`





## *function* version

Hotel_Interface.version() `view` `54fd4d50`





## *function* url

Hotel_Interface.url() `view` `5600f04f`





## *function* renounceOwnership

Hotel_Interface.renounceOwnership() `nonpayable` `715018a6`

> Allows the current owner to relinquish control of the contract.




## *function* destroy

Hotel_Interface.destroy() `nonpayable` `83197ef0`

> Transfers the current balance to the owner and terminates the contract.




## *function* owner

Hotel_Interface.owner() `view` `8da5cb5b`





## *function* editInfo

Hotel_Interface.editInfo(_url) `nonpayable` `9d9b5342`

> `editInfo` Allows manager to change hotel's url.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _url | New url pointer of this hotel |


## *function* contractType

Hotel_Interface.contractType() `view` `cb2ef6f7`





## *function* transferOwnership

Hotel_Interface.transferOwnership(_newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _newOwner | The address to transfer ownership to. |


## *function* destroyAndSend

Hotel_Interface.destroyAndSend(_recipient) `nonpayable` `f5074f41`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _recipient | undefined |

## *event* OwnershipRenounced

Hotel_Interface.OwnershipRenounced(previousOwner) `f8df3114`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |

## *event* OwnershipTransferred

Hotel_Interface.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
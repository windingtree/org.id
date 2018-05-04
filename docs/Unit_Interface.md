* [Unit_Interface](#unit_interface)
  * [active](#function-active)
  * [setSpecialPrice](#function-setspecialprice)
  * [defaultLifTokenPrice](#function-defaultliftokenprice)
  * [unitType](#function-unittype)
  * [owner](#function-owner)
  * [setActive](#function-setactive)
  * [book](#function-book)
  * [getReservation](#function-getreservation)
  * [transferOwnership](#function-transferownership)
  * [setSpecialLifPrice](#function-setspeciallifprice)
  * [Book](#event-book)
  * [OwnershipTransferred](#event-ownershiptransferred)

# Unit_Interface


## *function* active

Unit_Interface.active() `view` `02fb0c5e`





## *function* setSpecialPrice

Unit_Interface.setSpecialPrice(price, fromDay, daysAmount) `nonpayable` `46a8e678`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | price | undefined |
| *uint256* | fromDay | undefined |
| *uint256* | daysAmount | undefined |


## *function* defaultLifTokenPrice

Unit_Interface.defaultLifTokenPrice() `view` `7d40192d`





## *function* unitType

Unit_Interface.unitType() `view` `85ad4f90`





## *function* owner

Unit_Interface.owner() `view` `8da5cb5b`





## *function* setActive

Unit_Interface.setActive(_active) `nonpayable` `acec338a`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* | _active | undefined |


## *function* book

Unit_Interface.book(from, fromDay, daysAmount) `nonpayable` `c78e687c`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | from | undefined |
| *uint256* | fromDay | undefined |
| *uint256* | daysAmount | undefined |


## *function* getReservation

Unit_Interface.getReservation(day) `view` `d57763c3`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | day | undefined |


## *function* transferOwnership

Unit_Interface.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |


## *function* setSpecialLifPrice

Unit_Interface.setSpecialLifPrice(price, fromDay, daysAmount) `nonpayable` `fd480e5f`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | price | undefined |
| *uint256* | fromDay | undefined |
| *uint256* | daysAmount | undefined |

## *event* Book

Unit_Interface.Book(from, fromDay, daysAmount) `923908e9`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | from | not indexed |
| *uint256* | fromDay | not indexed |
| *uint256* | daysAmount | not indexed |

## *event* OwnershipTransferred

Unit_Interface.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
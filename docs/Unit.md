* [Unit](#unit)
  * [active](#function-active)
  * [setSpecialPrice](#function-setspecialprice)
  * [version](#function-version)
  * [destroy](#function-destroy)
  * [unitType](#function-unittype)
  * [owner](#function-owner)
  * [setActive](#function-setactive)
  * [book](#function-book)
  * [contractType](#function-contracttype)
  * [getReservation](#function-getreservation)
  * [transferOwnership](#function-transferownership)
  * [destroyAndSend](#function-destroyandsend)
  * [setSpecialLifPrice](#function-setspeciallifprice)
  * [OwnershipTransferred](#event-ownershiptransferred)

# Unit


## *function* active

Unit.active() `view` `02fb0c5e`





## *function* setSpecialPrice

Unit.setSpecialPrice(price, fromDay, daysAmount) `nonpayable` `46a8e678`

> `setPrice` allows the owner of the contract to set a speical price in the custom currency for a range of dates

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | price | The price of the unit |
| *uint256* | fromDay | The starting date of the period of days to change |
| *uint256* | daysAmount | The amount of days in the period |


## *function* version

Unit.version() `view` `54fd4d50`





## *function* destroy

Unit.destroy() `nonpayable` `83197ef0`

> Transfers the current balance to the owner and terminates the contract.




## *function* unitType

Unit.unitType() `view` `85ad4f90`





## *function* owner

Unit.owner() `view` `8da5cb5b`





## *function* setActive

Unit.setActive(_active) `nonpayable` `acec338a`

> `setActive` allows the owner of the contract to switch the status

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* | _active | The new status of the unit |


## *function* book

Unit.book(from, fromDay, daysAmount) `nonpayable` `c78e687c`

> `book` allows the owner to make a reservation

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | from | The address of the opener of the reservation |
| *uint256* | fromDay | The starting day of the period of days to book |
| *uint256* | daysAmount | The amount of days in the booking period |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* | _bookingResult | Whether the booking was successful or not |

## *function* contractType

Unit.contractType() `view` `cb2ef6f7`





## *function* getReservation

Unit.getReservation(day) `view` `d57763c3`

> `getReservation` get the avalibility and price of a day

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | day | The number of days after 01-01-1970 |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | _specialPrice | The price of the day in the custom currency, 0 if default price |
| *uint256* | _specialLifPrice | The price of the day in Líf, 0 if default price |
| *address* | _bookedBy | The address of the owner of the reservation, returns 0x0 if its available |

## *function* transferOwnership

Unit.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |


## *function* destroyAndSend

Unit.destroyAndSend(_recipient) `nonpayable` `f5074f41`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _recipient | undefined |


## *function* setSpecialLifPrice

Unit.setSpecialLifPrice(price, fromDay, daysAmount) `nonpayable` `fd480e5f`

> `setSpecialLifPrice` allows the owner of the contract to set a special price in Líf for a range of days

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | price | The price of the unit |
| *uint256* | fromDay | The starting date of the period of days to change |
| *uint256* | daysAmount | The amount of days in the period |


## *event* OwnershipTransferred

Unit.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
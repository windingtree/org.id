* [UnitType_Interface](#unittype_interface)
  * [removeAmenity](#function-removeamenity)
  * [addImage](#function-addimage)
  * [setCurrencyCode](#function-setcurrencycode)
  * [increaseUnits](#function-increaseunits)
  * [defaultLifPrice](#function-defaultlifprice)
  * [version](#function-version)
  * [getInfo](#function-getinfo)
  * [getImagesLength](#function-getimageslength)
  * [setDefaultPrice](#function-setdefaultprice)
  * [totalUnits](#function-totalunits)
  * [decreaseUnits](#function-decreaseunits)
  * [images](#function-images)
  * [unitType](#function-unittype)
  * [removeImage](#function-removeimage)
  * [owner](#function-owner)
  * [edit](#function-edit)
  * [setDefaultLifPrice](#function-setdefaultlifprice)
  * [contractType](#function-contracttype)
  * [getAmenities](#function-getamenities)
  * [currencyCode](#function-currencycode)
  * [defaultPrice](#function-defaultprice)
  * [addAmenity](#function-addamenity)
  * [transferOwnership](#function-transferownership)
  * [removeUnit](#function-removeunit)
  * [OwnershipTransferred](#event-ownershiptransferred)

# UnitType_Interface


## *function* removeAmenity

UnitType_Interface.removeAmenity(amenity) `nonpayable` `0ad23923`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | amenity | undefined |


## *function* addImage

UnitType_Interface.addImage(url) `nonpayable` `166f1779`

> `addImage` allows the owner to add an image

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | url | The url of the image |


## *function* setCurrencyCode

UnitType_Interface.setCurrencyCode(_currencyCode) `nonpayable` `2914fc0a`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes8* | _currencyCode | undefined |


## *function* increaseUnits

UnitType_Interface.increaseUnits() `nonpayable` `362db291`





## *function* defaultLifPrice

UnitType_Interface.defaultLifPrice() `view` `4e922d6d`





## *function* version

UnitType_Interface.version() `view` `54fd4d50`





## *function* getInfo

UnitType_Interface.getInfo() `view` `5a9b0b89`





## *function* getImagesLength

UnitType_Interface.getImagesLength() `view` `60839bd8`

> `getImagesLength` get the length of the `images` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | _length | Length of the `images` array |

## *function* setDefaultPrice

UnitType_Interface.setDefaultPrice(price) `nonpayable` `6d3c7ec5`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | price | undefined |


## *function* totalUnits

UnitType_Interface.totalUnits() `view` `6d86acc4`





## *function* decreaseUnits

UnitType_Interface.decreaseUnits() `nonpayable` `72730c01`





## *function* images

UnitType_Interface.images() `view` `84856482`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* unitType

UnitType_Interface.unitType() `view` `85ad4f90`





## *function* removeImage

UnitType_Interface.removeImage(index) `nonpayable` `8b25261f`

> `removeImage` allows the owner to remove an image

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | index | The image's index in the `images` array |


## *function* owner

UnitType_Interface.owner() `view` `8da5cb5b`





## *function* edit

UnitType_Interface.edit(description, minGuests, maxGuests) `nonpayable` `ae9a6137`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | description | undefined |
| *uint256* | minGuests | undefined |
| *uint256* | maxGuests | undefined |


## *function* setDefaultLifPrice

UnitType_Interface.setDefaultLifPrice(price) `nonpayable` `c55b2ee7`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | price | undefined |


## *function* contractType

UnitType_Interface.contractType() `view` `cb2ef6f7`





## *function* getAmenities

UnitType_Interface.getAmenities() `view` `d0ceaae8`





## *function* currencyCode

UnitType_Interface.currencyCode() `view` `e102e5e3`





## *function* defaultPrice

UnitType_Interface.defaultPrice() `view` `e69e04b3`





## *function* addAmenity

UnitType_Interface.addAmenity(amenity) `nonpayable` `f240180c`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | amenity | undefined |


## *function* transferOwnership

UnitType_Interface.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |


## *function* removeUnit

UnitType_Interface.removeUnit(unitIndex) `nonpayable` `ff3c6039`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | unitIndex | undefined |

## *event* OwnershipTransferred

UnitType_Interface.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
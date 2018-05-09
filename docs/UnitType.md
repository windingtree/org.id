* [UnitType](#unittype)
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
  * [destroy](#function-destroy)
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
  * [destroyAndSend](#function-destroyandsend)
  * [OwnershipTransferred](#event-ownershiptransferred)

# UnitType


## *function* removeAmenity

UnitType.removeAmenity(amenityId) `nonpayable` `0ad23923`

> `removeAmenity` allows the owner to remove an amenity

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | amenityId | The id of the amenity in the amenitiesIndex array |


## *function* addImage

UnitType.addImage(url) `nonpayable` `166f1779`

> `addImage` allows the owner to add an image

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | url | The url of the image |


## *function* setCurrencyCode

UnitType.setCurrencyCode(_currencyCode) `nonpayable` `2914fc0a`

> `setCurrencyCode` allows the owner of the contract to set which currency other than Líf the UnitType is priced in

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes8* | _currencyCode | The hex value of the currency code |


## *function* increaseUnits

UnitType.increaseUnits() `nonpayable` `362db291`

> `increaseUnits` allows the owner to increase the `totalUnits`




## *function* defaultLifPrice

UnitType.defaultLifPrice() `view` `4e922d6d`





## *function* version

UnitType.version() `view` `54fd4d50`





## *function* getInfo

UnitType.getInfo() `view` `5a9b0b89`

> `GetInfo` get the information of the unit



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _description | The description of the unit type |
| *uint256* | _minGuests | The minimun amount guests |
| *uint256* | _maxGuests | The maximum amount guests |
| *uint256* | _defaultPrice | The default fiat price |

## *function* getImagesLength

UnitType.getImagesLength() `view` `60839bd8`

> `getImagesLength` get the length of the `images` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | _length | Length of the `images` array |

## *function* setDefaultPrice

UnitType.setDefaultPrice(price) `nonpayable` `6d3c7ec5`

> `setDefaultPrice` allows the owner of the contract to set the default price in the custom currency for reserving the UnitType for 1 day

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | price | The new default price |


## *function* totalUnits

UnitType.totalUnits() `view` `6d86acc4`





## *function* decreaseUnits

UnitType.decreaseUnits() `nonpayable` `72730c01`

> `decreaseUnits` allows the owner to decrease the `totalUnits`




## *function* destroy

UnitType.destroy() `nonpayable` `83197ef0`

> Transfers the current balance to the owner and terminates the contract.




## *function* images

UnitType.images() `view` `84856482`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* unitType

UnitType.unitType() `view` `85ad4f90`





## *function* removeImage

UnitType.removeImage(index) `nonpayable` `8b25261f`

> `removeImage` allows the owner to remove an image

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | index | The image's index in the `images` array |


## *function* owner

UnitType.owner() `view` `8da5cb5b`





## *function* edit

UnitType.edit(_description, _minGuests, _maxGuests) `nonpayable` `ae9a6137`

> `edit` allows the owner of the contract to change the description, min/max guests and base price

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _description | The new description |
| *uint256* | _minGuests | The minimun amount of guests allowed |
| *uint256* | _maxGuests | The maximum amount of guests allowed |


## *function* setDefaultLifPrice

UnitType.setDefaultLifPrice(price) `nonpayable` `c55b2ee7`

> `setDefaultLifPrice` allows the owner of the contract to set the default price in Lif for reserving the UnitType for 1 day

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | price | The new default Lif price |


## *function* contractType

UnitType.contractType() `view` `cb2ef6f7`





## *function* getAmenities

UnitType.getAmenities() `view` `d0ceaae8`

> `getAmenities` get the amenities ids



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256[]* | _amenities | Array of all the amenities ids in the unit type |

## *function* currencyCode

UnitType.currencyCode() `view` `e102e5e3`





## *function* defaultPrice

UnitType.defaultPrice() `view` `e69e04b3`





## *function* addAmenity

UnitType.addAmenity(amenityId) `nonpayable` `f240180c`

> `addAmenity` allows the owner to add an amenity.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | amenityId | The id of the amenity to add |


## *function* transferOwnership

UnitType.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |


## *function* destroyAndSend

UnitType.destroyAndSend(_recipient) `nonpayable` `f5074f41`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _recipient | undefined |


## *event* OwnershipTransferred

UnitType.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
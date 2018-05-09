* [Hotel_Interface](#hotel_interface)
  * [zip](#function-zip)
  * [name](#function-name)
  * [editInfo](#function-editinfo)
  * [addImage](#function-addimage)
  * [callUnit](#function-callunit)
  * [beginCall](#function-begincall)
  * [getLifCost](#function-getlifcost)
  * [unitTypeNames](#function-unittypenames)
  * [lineOne](#function-lineone)
  * [unitTypes](#function-unittypes)
  * [getUnitTypeNames](#function-getunittypenames)
  * [created](#function-created)
  * [pendingCalls](#function-pendingcalls)
  * [changeUnitType](#function-changeunittype)
  * [continueCall](#function-continuecall)
  * [changeConfirmation](#function-changeconfirmation)
  * [manager](#function-manager)
  * [latitude](#function-latitude)
  * [version](#function-version)
  * [longitude](#function-longitude)
  * [unitsIndex](#function-unitsindex)
  * [editAddress](#function-editaddress)
  * [getImagesLength](#function-getimageslength)
  * [getCost](#function-getcost)
  * [bookWithLif](#function-bookwithlif)
  * [description](#function-description)
  * [getUnitType](#function-getunittype)
  * [images](#function-images)
  * [removeImage](#function-removeimage)
  * [owner](#function-owner)
  * [addUnit](#function-addunit)
  * [waitConfirmation](#function-waitconfirmation)
  * [book](#function-book)
  * [timezone](#function-timezone)
  * [contractType](#function-contracttype)
  * [removeUnitType](#function-removeunittype)
  * [country](#function-country)
  * [callUnitType](#function-callunittype)
  * [addUnitType](#function-addunittype)
  * [removeUnit](#function-removeunit)
  * [units](#function-units)
  * [lineTwo](#function-linetwo)
  * [transferOwnership](#function-transferownership)
  * [Book](#event-book)
  * [CallStarted](#event-callstarted)
  * [CallFinish](#event-callfinish)
  * [OwnershipTransferred](#event-ownershiptransferred)

# Hotel_Interface


## *function* zip

Hotel_Interface.zip() `view` `00919055`





## *function* name

Hotel_Interface.name() `view` `06fdde03`





## *function* editInfo

Hotel_Interface.editInfo(_name, _description) `nonpayable` `0b0d3ca2`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _name | undefined |
| *string* | _description | undefined |


## *function* addImage

Hotel_Interface.addImage(url) `nonpayable` `166f1779`

> `addImage` allows the owner to add an image

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | url | The url of the image |


## *function* callUnit

Hotel_Interface.callUnit(unitAddress, data) `nonpayable` `1c4e4d46`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | unitAddress | undefined |
| *bytes* | data | undefined |


## *function* beginCall

Hotel_Interface.beginCall(publicCallData, privateData) `nonpayable` `203eaf27`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes* | publicCallData | undefined |
| *bytes* | privateData | undefined |


## *function* getLifCost

Hotel_Interface.getLifCost(unitAddress, fromDay, daysAmount) `view` `25820f61`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | unitAddress | undefined |
| *uint256* | fromDay | undefined |
| *uint256* | daysAmount | undefined |


## *function* unitTypeNames

Hotel_Interface.unitTypeNames() `view` `28ef6b93`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* lineOne

Hotel_Interface.lineOne() `view` `2a323572`





## *function* unitTypes

Hotel_Interface.unitTypes() `view` `2bb03f6e`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* |  | undefined |


## *function* getUnitTypeNames

Hotel_Interface.getUnitTypeNames() `view` `2db25a38`





## *function* created

Hotel_Interface.created() `view` `325a19f1`





## *function* pendingCalls

Hotel_Interface.pendingCalls() `view` `32fdd45c`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* |  | undefined |


## *function* changeUnitType

Hotel_Interface.changeUnitType(unitType, newAddr) `nonpayable` `37844767`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | unitType | undefined |
| *address* | newAddr | undefined |


## *function* continueCall

Hotel_Interface.continueCall(msgDataHash) `nonpayable` `411f2351`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | msgDataHash | undefined |


## *function* changeConfirmation

Hotel_Interface.changeConfirmation(_waitConfirmation) `nonpayable` `44f5484a`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* | _waitConfirmation | undefined |


## *function* manager

Hotel_Interface.manager() `view` `481c6a75`





## *function* latitude

Hotel_Interface.latitude() `view` `4fd7d76a`





## *function* version

Hotel_Interface.version() `view` `54fd4d50`





## *function* longitude

Hotel_Interface.longitude() `view` `589af69c`





## *function* unitsIndex

Hotel_Interface.unitsIndex() `view` `5edad458`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* editAddress

Hotel_Interface.editAddress(_lineOne, _lineTwo, _zip, _country, _timezone, _longitude, _latitude) `nonpayable` `5efa8a7c`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _lineOne | undefined |
| *string* | _lineTwo | undefined |
| *string* | _zip | undefined |
| *bytes2* | _country | undefined |
| *string* | _timezone | undefined |
| *uint256* | _longitude | undefined |
| *uint256* | _latitude | undefined |


## *function* getImagesLength

Hotel_Interface.getImagesLength() `view` `60839bd8`

> `getImagesLength` get the length of the `images` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | _length | Length of the `images` array |

## *function* getCost

Hotel_Interface.getCost(unitAddress, fromDay, daysAmount) `view` `62a966b0`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | unitAddress | undefined |
| *uint256* | fromDay | undefined |
| *uint256* | daysAmount | undefined |


## *function* bookWithLif

Hotel_Interface.bookWithLif(unitAddress, from, fromDay, daysAmount) `nonpayable` `676e0079`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | unitAddress | undefined |
| *address* | from | undefined |
| *uint256* | fromDay | undefined |
| *uint256* | daysAmount | undefined |


## *function* description

Hotel_Interface.description() `view` `7284e416`





## *function* getUnitType

Hotel_Interface.getUnitType(unitType) `view` `7e1d63c3`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | unitType | undefined |


## *function* images

Hotel_Interface.images() `view` `84856482`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* removeImage

Hotel_Interface.removeImage(index) `nonpayable` `8b25261f`

> `removeImage` allows the owner to remove an image

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | index | The image's index in the `images` array |


## *function* owner

Hotel_Interface.owner() `view` `8da5cb5b`





## *function* addUnit

Hotel_Interface.addUnit(unit) `nonpayable` `a9f7f247`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | unit | undefined |


## *function* waitConfirmation

Hotel_Interface.waitConfirmation() `view` `ac72bb98`





## *function* book

Hotel_Interface.book(unitAddress, from, fromDay, daysAmount) `nonpayable` `b9a527b4`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | unitAddress | undefined |
| *address* | from | undefined |
| *uint256* | fromDay | undefined |
| *uint256* | daysAmount | undefined |


## *function* timezone

Hotel_Interface.timezone() `view` `c4148fe5`





## *function* contractType

Hotel_Interface.contractType() `view` `cb2ef6f7`





## *function* removeUnitType

Hotel_Interface.removeUnitType(unitType, index) `nonpayable` `d5268e8c`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | unitType | undefined |
| *uint256* | index | undefined |


## *function* country

Hotel_Interface.country() `view` `d8b0b499`





## *function* callUnitType

Hotel_Interface.callUnitType(unitType, data) `nonpayable` `dbc6c290`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | unitType | undefined |
| *bytes* | data | undefined |


## *function* addUnitType

Hotel_Interface.addUnitType(addr) `nonpayable` `dc8f86e5`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | addr | undefined |


## *function* removeUnit

Hotel_Interface.removeUnit(unit) `nonpayable` `df155165`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | unit | undefined |


## *function* units

Hotel_Interface.units() `view` `e5fba6cc`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* lineTwo

Hotel_Interface.lineTwo() `view` `ed7fa4f1`





## *function* transferOwnership

Hotel_Interface.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |

## *event* Book

Hotel_Interface.Book(from, unit, fromDay, daysAmount) `a7fd659d`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | from | not indexed |
| *address* | unit | not indexed |
| *uint256* | fromDay | not indexed |
| *uint256* | daysAmount | not indexed |

## *event* CallStarted

Hotel_Interface.CallStarted(from, dataHash) `5ec33322`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | from | not indexed |
| *bytes32* | dataHash | not indexed |

## *event* CallFinish

Hotel_Interface.CallFinish(from, dataHash) `b2be3874`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | from | not indexed |
| *bytes32* | dataHash | not indexed |

## *event* OwnershipTransferred

Hotel_Interface.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
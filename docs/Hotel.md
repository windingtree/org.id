* [Hotel](#hotel)
  * [zip](#function-zip)
  * [getUnits](#function-getunits)
  * [name](#function-name)
  * [editInfo](#function-editinfo)
  * [editLocation](#function-editlocation)
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
  * [getImagesLength](#function-getimageslength)
  * [getCost](#function-getcost)
  * [bookWithLif](#function-bookwithlif)
  * [description](#function-description)
  * [getUnitType](#function-getunittype)
  * [destroy](#function-destroy)
  * [images](#function-images)
  * [getUnitsLength](#function-getunitslength)
  * [removeImage](#function-removeimage)
  * [owner](#function-owner)
  * [addUnit](#function-addunit)
  * [waitConfirmation](#function-waitconfirmation)
  * [getPublicCallData](#function-getpubliccalldata)
  * [book](#function-book)
  * [timezone](#function-timezone)
  * [contractType](#function-contracttype)
  * [country](#function-country)
  * [callUnitType](#function-callunittype)
  * [addUnitType](#function-addunittype)
  * [units](#function-units)
  * [deleteUnit](#function-deleteunit)
  * [deleteUnitType](#function-deleteunittype)
  * [lineTwo](#function-linetwo)
  * [transferOwnership](#function-transferownership)
  * [destroyAndSend](#function-destroyandsend)
  * [Book](#event-book)
  * [CallStarted](#event-callstarted)
  * [CallFinish](#event-callfinish)
  * [OwnershipTransferred](#event-ownershiptransferred)

# Hotel


## *function* zip

Hotel.zip() `view` `00919055`





## *function* getUnits

Hotel.getUnits() `view` `027aa9f5`

> `getUnits` get the `units` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* | _units | the `units` array |

## *function* name

Hotel.name() `view` `06fdde03`





## *function* editInfo

Hotel.editInfo(_name, _description) `nonpayable` `0b0d3ca2`

> `editInfo` allows the owner of the contract to change the hotel's main information

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _name | The new name of the hotel |
| *string* | _description | The new description of the hotel |


## *function* editLocation

Hotel.editLocation(_lineOne, _lineTwo, _zip, _country, _timezone, _longitude, _latitude) `nonpayable` `15e9dfde`

> `editLocation` allows the owner of the contract to change the hotel's address and geolocation

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _lineOne | The new main address of the hotel |
| *string* | _lineTwo | The new second address of the hotel |
| *string* | _zip | The new zip code of the hotel |
| *bytes2* | _country | The new ISO3166-1 Alpha2 country code of the hotel |
| *string* | _timezone | The new tz database timezone of the hotel |
| *uint256* | _longitude | The new longitude value of the location of the hotel |
| *uint256* | _latitude | The new longitude value of the latitude of the hotel |


## *function* addImage

Hotel.addImage(url) `nonpayable` `166f1779`

> `addImage` allows the owner to add an image

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | url | The url of the image |


## *function* callUnit

Hotel.callUnit(unitAddress, data) `nonpayable` `1c4e4d46`

> `callUnit` allows the owner to call a unit

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | unitAddress | The address of the `Unit` contract |
| *bytes* | data | The data of the call to execute on the `Unit` contract |


## *function* beginCall

Hotel.beginCall(publicCallData, privateData) `nonpayable` `203eaf27`

> `beginCall` requests the execution of a call by the contract

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes* | publicCallData | The call data to be executed |
| *bytes* | privateData | The extra, encrypted data stored as a parameter returns true if the call was requested succesfully |


## *function* getLifCost

Hotel.getLifCost(unitAddress, fromDay, daysAmount) `view` `25820f61`

> `getLifCost` calculates the cost of renting the Unit for the given dates

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | unitAddress | undefined |
| *uint256* | fromDay | The starting date of the period of days to book |
| *uint256* | daysAmount | The amount of days in the period |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | _totalCost | The total cost of the booking in Lif |

## *function* unitTypeNames

Hotel.unitTypeNames() `view` `28ef6b93`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* lineOne

Hotel.lineOne() `view` `2a323572`





## *function* unitTypes

Hotel.unitTypes() `view` `2bb03f6e`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* |  | undefined |


## *function* getUnitTypeNames

Hotel.getUnitTypeNames() `view` `2db25a38`

> `getUnitTypeNames` get the names of all the unitTypes



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32[]* | _unitTypeNames | Names of all the unit types |

## *function* created

Hotel.created() `view` `325a19f1`





## *function* pendingCalls

Hotel.pendingCalls() `view` `32fdd45c`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* |  | undefined |


## *function* changeUnitType

Hotel.changeUnitType(unitType, newAddr) `nonpayable` `37844767`

> `changeUnitType` allows the owner to change a unit type

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | unitType | The type of unit |
| *address* | newAddr | The new address of the `UnitType` contract |


## *function* continueCall

Hotel.continueCall(msgDataHash) `nonpayable` `411f2351`

> `continueCall` allows the owner to approve the execution of a call

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | msgDataHash | The hash of the call to be executed |


## *function* changeConfirmation

Hotel.changeConfirmation(_waitConfirmation) `nonpayable` `44f5484a`

> `changeConfirmation` allows the owner of the contract to switch the `waitConfirmation` value

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* | _waitConfirmation | The new `waitConfirmation` value |


## *function* manager

Hotel.manager() `view` `481c6a75`





## *function* latitude

Hotel.latitude() `view` `4fd7d76a`





## *function* version

Hotel.version() `view` `54fd4d50`





## *function* longitude

Hotel.longitude() `view` `589af69c`





## *function* unitsIndex

Hotel.unitsIndex() `view` `5edad458`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* getImagesLength

Hotel.getImagesLength() `view` `60839bd8`

> `getImagesLength` get the length of the `images` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | _length | Length of the `images` array |

## *function* getCost

Hotel.getCost(unitAddress, fromDay, daysAmount) `view` `62a966b0`

> `getCost` calculates the cost of renting the Unit for the given dates

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | unitAddress | undefined |
| *uint256* | fromDay | The starting date of the period of days to book |
| *uint256* | daysAmount | The amount of days in the period |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | _totalCost | The total cost of the booking in the custom currency |

## *function* bookWithLif

Hotel.bookWithLif(unitAddress, from, fromDay, daysAmount) `nonpayable` `676e0079`

> `bookWithLif` allows the contract to execute a book function itself

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | unitAddress | The address of the `Unit` contract |
| *address* | from | The address of the opener of the reservation |
| *uint256* | fromDay | The starting day of the period of days to book |
| *uint256* | daysAmount | The amount of days in the booking period |


## *function* description

Hotel.description() `view` `7284e416`





## *function* getUnitType

Hotel.getUnitType(unitType) `view` `7e1d63c3`

> `getUnitType` get the address of a unit type

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | unitType | The type of the unit |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _unitTypeAddress | Address of the `UnitType` contract |

## *function* destroy

Hotel.destroy() `nonpayable` `83197ef0`

> 'destroy' allows the owner to delete the Hotel and all of its Units and UnitTypes




## *function* images

Hotel.images() `view` `84856482`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* getUnitsLength

Hotel.getUnitsLength() `view` `8ab7cbfa`

> `getUnitsLength` get the length of the `units` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | _length | Length of the `units` array |

## *function* removeImage

Hotel.removeImage(index) `nonpayable` `8b25261f`

> `removeImage` allows the owner to remove an image

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | index | The image's index in the `images` array |


## *function* owner

Hotel.owner() `view` `8da5cb5b`





## *function* addUnit

Hotel.addUnit(unit) `nonpayable` `a9f7f247`

> `addUnit` allows the owner to add a new unit to the inventory

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | unit | The address of the `Unit` contract |


## *function* waitConfirmation

Hotel.waitConfirmation() `view` `ac72bb98`





## *function* getPublicCallData

Hotel.getPublicCallData(msgDataHash) `view` `acc36826`

> `getPublicCallData` returns the data to be executed of a pending call

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | msgDataHash | The hash of the pending call |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes* | _callData | The public call data |

## *function* book

Hotel.book(unitAddress, from, fromDay, daysAmount) `nonpayable` `b9a527b4`

> `book` allows the contract to execute a book function itself

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | unitAddress | The address of the `Unit` contract |
| *address* | from | The address of the opener of the reservation |
| *uint256* | fromDay | The starting day of the period of days to book |
| *uint256* | daysAmount | The amount of days in the booking period |


## *function* timezone

Hotel.timezone() `view` `c4148fe5`





## *function* contractType

Hotel.contractType() `view` `cb2ef6f7`





## *function* country

Hotel.country() `view` `d8b0b499`





## *function* callUnitType

Hotel.callUnitType(unitType, data) `nonpayable` `dbc6c290`

> `callUnitType` allows the owner to call a unit type

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | unitType | The type of unit |
| *bytes* | data | The data of the call to execute on the `UnitType` contract |


## *function* addUnitType

Hotel.addUnitType(addr) `nonpayable` `dc8f86e5`

> `addUnitType` allows the owner to add a new unit type

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | addr | The address of the `UnitType` contract |


## *function* units

Hotel.units() `view` `e5fba6cc`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* deleteUnit

Hotel.deleteUnit(unit) `nonpayable` `e6c94c94`

> `deleteUnit` allows the owner to remove a unit from the inventory

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | unit | The address of the `Unit` contract |


## *function* deleteUnitType

Hotel.deleteUnitType(unitType, index) `nonpayable` `e8782acf`

> `deleteUnitType` allows the owner to delete a unit type

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | unitType | The type of unit |
| *uint256* | index | The unit's index in the `unitTypeNames` array |


## *function* lineTwo

Hotel.lineTwo() `view` `ed7fa4f1`





## *function* transferOwnership

Hotel.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |


## *function* destroyAndSend

Hotel.destroyAndSend(_recipient) `nonpayable` `f5074f41`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _recipient | undefined |


## *event* Book

Hotel.Book(from, unit, fromDay, daysAmount) `a7fd659d`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | from | not indexed |
| *address* | unit | not indexed |
| *uint256* | fromDay | not indexed |
| *uint256* | daysAmount | not indexed |

## *event* CallStarted

Hotel.CallStarted(from, dataHash) `5ec33322`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | from | not indexed |
| *bytes32* | dataHash | not indexed |

## *event* CallFinish

Hotel.CallFinish(from, dataHash) `b2be3874`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | from | not indexed |
| *bytes32* | dataHash | not indexed |

## *event* OwnershipTransferred

Hotel.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
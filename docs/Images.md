* [Images](#images)
  * [addImage](#function-addimage)
  * [version](#function-version)
  * [getImagesLength](#function-getimageslength)
  * [images](#function-images)
  * [removeImage](#function-removeimage)
  * [owner](#function-owner)
  * [contractType](#function-contracttype)
  * [transferOwnership](#function-transferownership)
  * [OwnershipTransferred](#event-ownershiptransferred)

# Images


## *function* addImage

Images.addImage(url) `nonpayable` `166f1779`

> `addImage` allows the owner to add an image

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | url | The url of the image |


## *function* version

Images.version() `view` `54fd4d50`





## *function* getImagesLength

Images.getImagesLength() `view` `60839bd8`

> `getImagesLength` get the length of the `images` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | _length | Length of the `images` array |

## *function* images

Images.images() `view` `84856482`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* removeImage

Images.removeImage(index) `nonpayable` `8b25261f`

> `removeImage` allows the owner to remove an image

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | index | The image's index in the `images` array |


## *function* owner

Images.owner() `view` `8da5cb5b`





## *function* contractType

Images.contractType() `view` `cb2ef6f7`





## *function* transferOwnership

Images.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |

## *event* OwnershipTransferred

Images.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
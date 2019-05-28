* [OtaDirectoryInterface](#otadirectoryinterface)
  * [createAndAddOta](#function-createandaddota)
  * [createOta](#function-createota)
  * [otasIndex](#function-otasindex)
  * [getOtas](#function-getotas)
  * [addOta](#function-addota)
  * [otas](#function-otas)
  * [getOtasLength](#function-getotaslength)
  * [removeOta](#function-removeota)
  * [OrganizationCreated](#event-organizationcreated)
  * [OrganizationAdded](#event-organizationadded)
  * [OrganizationRemoved](#event-organizationremoved)
  * [OwnershipTransferred](#event-ownershiptransferred)

# OtaDirectoryInterface


## *function* createAndAddOta

OtaDirectoryInterface.createAndAddOta(dataUri) `nonpayable` `1adc44cd`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | undefined |


## *function* createOta

OtaDirectoryInterface.createOta(dataUri) `nonpayable` `38004cf4`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | undefined |


## *function* otasIndex

OtaDirectoryInterface.otasIndex(ota) `view` `460d3841`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | ota | undefined |


## *function* getOtas

OtaDirectoryInterface.getOtas() `view` `5c8a8c8d`





## *function* addOta

OtaDirectoryInterface.addOta(ota) `nonpayable` `84902979`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | ota | undefined |


## *function* otas

OtaDirectoryInterface.otas(index) `view` `b02f7f65`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | index | undefined |


## *function* getOtasLength

OtaDirectoryInterface.getOtasLength() `view` `d0be6aa3`





## *function* removeOta

OtaDirectoryInterface.removeOta(ota) `nonpayable` `de6bd6b2`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | ota | undefined |

## *event* OrganizationCreated

OtaDirectoryInterface.OrganizationCreated(organization) `47b68893`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OrganizationAdded

OtaDirectoryInterface.OrganizationAdded(organization, index) `424a91ec`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |
| *uint256* | index | not indexed |

## *event* OrganizationRemoved

OtaDirectoryInterface.OrganizationRemoved(organization) `ed5ec13b`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OwnershipTransferred

OtaDirectoryInterface.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
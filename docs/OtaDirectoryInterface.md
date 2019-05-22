* [OtaDirectoryInterface](#otadirectoryinterface)
  * [createOta](#function-createota)
  * [deregisterOta](#function-deregisterota)
  * [otasIndex](#function-otasindex)
  * [getOtas](#function-getotas)
  * [otas](#function-otas)
  * [getOtasLength](#function-getotaslength)
  * [createAndRegisterOta](#function-createandregisterota)
  * [registerOta](#function-registerota)
  * [OrganizationCreated](#event-organizationcreated)
  * [OrganizationRegistered](#event-organizationregistered)
  * [OrganizationDeregistered](#event-organizationderegistered)
  * [OwnershipTransferred](#event-ownershiptransferred)

# OtaDirectoryInterface


## *function* createOta

OtaDirectoryInterface.createOta(dataUri) `nonpayable` `38004cf4`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | undefined |


## *function* deregisterOta

OtaDirectoryInterface.deregisterOta(ota) `nonpayable` `453a1f6a`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | ota | undefined |


## *function* otasIndex

OtaDirectoryInterface.otasIndex(ota) `view` `460d3841`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | ota | undefined |


## *function* getOtas

OtaDirectoryInterface.getOtas() `view` `5c8a8c8d`





## *function* otas

OtaDirectoryInterface.otas(index) `view` `b02f7f65`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | index | undefined |


## *function* getOtasLength

OtaDirectoryInterface.getOtasLength() `view` `d0be6aa3`





## *function* createAndRegisterOta

OtaDirectoryInterface.createAndRegisterOta(dataUri) `nonpayable` `f1e34560`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | undefined |


## *function* registerOta

OtaDirectoryInterface.registerOta(ota) `nonpayable` `ff69461c`


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

## *event* OrganizationRegistered

OtaDirectoryInterface.OrganizationRegistered(organization, index) `0aa9369e`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |
| *uint256* | index | not indexed |

## *event* OrganizationDeregistered

OtaDirectoryInterface.OrganizationDeregistered(organization) `2ef6503b`

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
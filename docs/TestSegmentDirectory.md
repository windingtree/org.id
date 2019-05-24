* [TestSegmentDirectory](#testsegmentdirectory)
  * [organizationsByOwnerDeprecated](#function-organizationsbyownerdeprecated)
  * [createAndRegisterFoodTruck](#function-createandregisterfoodtruck)
  * [deregisterFoodTruck](#function-deregisterfoodtruck)
  * [initialize](#function-initialize)
  * [LifToken](#function-liftoken)
  * [organizationsByOwnerIndexDeprecated](#function-organizationsbyownerindexdeprecated)
  * [organizationsIndex](#function-organizationsindex)
  * [getOrganizations](#function-getorganizations)
  * [registerFoodTruck](#function-registerfoodtruck)
  * [getOrganizationsLength](#function-getorganizationslength)
  * [organizations](#function-organizations)
  * [setLifToken](#function-setliftoken)
  * [transferOwnership](#function-transferownership)
  * [createFoodTruck](#function-createfoodtruck)
  * [OrganizationCreated](#event-organizationcreated)
  * [OrganizationRegistered](#event-organizationregistered)
  * [OrganizationDeregistered](#event-organizationderegistered)
  * [OwnershipTransferred](#event-ownershiptransferred)

# TestSegmentDirectory


## *function* organizationsByOwnerDeprecated

TestSegmentDirectory.organizationsByOwnerDeprecated(, ) `view` `18531bb6`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |
| *uint256* |  | undefined |


## *function* createAndRegisterFoodTruck

TestSegmentDirectory.createAndRegisterFoodTruck(dataUri) `nonpayable` `1fcab0b5`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | undefined |


## *function* deregisterFoodTruck

TestSegmentDirectory.deregisterFoodTruck(foodTruck) `nonpayable` `28f3e623`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | foodTruck | undefined |


## *function* initialize

TestSegmentDirectory.initialize(__owner, _lifToken) `nonpayable` `485cc955`

> Initializer for upgradeable contracts.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | __owner | The address of the contract owner |
| *address* | _lifToken | The new contract address |


## *function* LifToken

TestSegmentDirectory.LifToken() `view` `554d8b37`





## *function* organizationsByOwnerIndexDeprecated

TestSegmentDirectory.organizationsByOwnerIndexDeprecated() `view` `5bb087d8`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* organizationsIndex

TestSegmentDirectory.organizationsIndex() `view` `63cd48fb`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* getOrganizations

TestSegmentDirectory.getOrganizations() `view` `9754a3a8`

> `getOrganizations` get `organizations` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* registerFoodTruck

TestSegmentDirectory.registerFoodTruck(foodTruck) `nonpayable` `b2c5d09f`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | foodTruck | undefined |


## *function* getOrganizationsLength

TestSegmentDirectory.getOrganizationsLength() `view` `b9306681`

> `getOrganizationsLength` get the length of the `organizations` array



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |

## *function* organizations

TestSegmentDirectory.organizations() `view` `e792dd8a`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* setLifToken

TestSegmentDirectory.setLifToken(_lifToken) `nonpayable` `f2f0967b`

> `setLifToken` allows the owner of the contract to change the address of the LifToken contract. Allows to set the address to zero address

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | _lifToken | The new contract address |


## *function* transferOwnership

TestSegmentDirectory.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |


## *function* createFoodTruck

TestSegmentDirectory.createFoodTruck(dataUri) `nonpayable` `f9c7613a`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | dataUri | undefined |

## *event* OrganizationCreated

TestSegmentDirectory.OrganizationCreated(organization) `47b68893`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OrganizationRegistered

TestSegmentDirectory.OrganizationRegistered(organization, index) `0aa9369e`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |
| *uint256* | index | not indexed |

## *event* OrganizationDeregistered

TestSegmentDirectory.OrganizationDeregistered(organization) `2ef6503b`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | organization | indexed |

## *event* OwnershipTransferred

TestSegmentDirectory.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |


---
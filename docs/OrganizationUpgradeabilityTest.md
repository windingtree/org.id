* [OrganizationUpgradeabilityTest](#organizationupgradeabilitytest)
  * [removeAssociatedKey](#function-removeassociatedkey)
  * [supportsInterface](#function-supportsinterface)
  * [getAssociatedKeys](#function-getassociatedkeys)
  * [associatedKeys](#function-associatedkeys)
  * [newFunction](#function-newfunction)
  * [getOrgJsonUri](#function-getorgjsonuri)
  * [created](#function-created)
  * [orgJsonUri](#function-orgjsonuri)
  * [addAssociatedKey](#function-addassociatedkey)
  * [owner](#function-owner)
  * [changeOrgJsonUri](#function-changeorgjsonuri)
  * [associatedKeysIndex](#function-associatedkeysindex)
  * [transferOwnership](#function-transferownership)
  * [initialize](#function-initialize)
  * [hasAssociatedKey](#function-hasassociatedkey)
  * [OwnershipTransferred](#event-ownershiptransferred)
  * [OrgJsonUriChanged](#event-orgjsonurichanged)
  * [AssociatedKeyAdded](#event-associatedkeyadded)
  * [AssociatedKeyRemoved](#event-associatedkeyremoved)

# OrganizationUpgradeabilityTest


## *function* removeAssociatedKey

OrganizationUpgradeabilityTest.removeAssociatedKey(addr) `nonpayable` `01aedb62`

> Removes associatedKey address. Only owner can call this.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | addr | Associated Ethereum address |


## *function* supportsInterface

OrganizationUpgradeabilityTest.supportsInterface(interfaceId) `view` `01ffc9a7`

> See `IERC165.supportsInterface`.     * Time complexity O(1), guaranteed to always use less than 30 000 gas.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes4* | interfaceId | undefined |


## *function* getAssociatedKeys

OrganizationUpgradeabilityTest.getAssociatedKeys() `view` `0ba11d86`

> Returns all associatedKeys associated with this organization.



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* associatedKeys

OrganizationUpgradeabilityTest.associatedKeys() `view` `1ad2c3cb`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* newFunction

OrganizationUpgradeabilityTest.newFunction() `pure` `1b28d63e`





## *function* getOrgJsonUri

OrganizationUpgradeabilityTest.getOrgJsonUri() `view` `1d855977`

> Returns current orgJsonUri



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *string* |  | undefined |

## *function* created

OrganizationUpgradeabilityTest.created() `view` `325a19f1`





## *function* orgJsonUri

OrganizationUpgradeabilityTest.orgJsonUri() `view` `3b3ba578`





## *function* addAssociatedKey

OrganizationUpgradeabilityTest.addAssociatedKey(addr) `nonpayable` `8d6c8ef0`

> Adds new associatedKey address. Only owner can call this.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | addr | Associated Ethereum address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* owner

OrganizationUpgradeabilityTest.owner() `view` `8da5cb5b`

> Returns the address of the current owner.




## *function* changeOrgJsonUri

OrganizationUpgradeabilityTest.changeOrgJsonUri(_orgJsonUri) `nonpayable` `b454f4ef`

> `changeOrgJsonUri` Allows owner to change Organization's orgJsonUri.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _orgJsonUri | New orgJsonUri pointer of this Organization |


## *function* associatedKeysIndex

OrganizationUpgradeabilityTest.associatedKeysIndex() `view` `df0a2bca`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* transferOwnership

OrganizationUpgradeabilityTest.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |


## *function* initialize

OrganizationUpgradeabilityTest.initialize(__owner, _orgJsonUri) `nonpayable` `f399e22e`

> Initializer for upgradeable contracts.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | __owner | The address of the contract owner |
| *string* | _orgJsonUri | pointer to Organization data |


## *function* hasAssociatedKey

OrganizationUpgradeabilityTest.hasAssociatedKey(addr) `view` `f5760597`

> Is an address considered a associatedKey for this organization?

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | addr | undefined |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* |  | undefined |
## *event* OwnershipTransferred

OrganizationUpgradeabilityTest.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |

## *event* OrgJsonUriChanged

OrganizationUpgradeabilityTest.OrgJsonUriChanged(previousOrgJsonUri, newOrgJsonUri) `0153064f`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *string* | previousOrgJsonUri | indexed |
| *string* | newOrgJsonUri | indexed |

## *event* AssociatedKeyAdded

OrganizationUpgradeabilityTest.AssociatedKeyAdded(associatedKey, index) `1cbc30c7`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | associatedKey | indexed |
| *uint256* | index | not indexed |

## *event* AssociatedKeyRemoved

OrganizationUpgradeabilityTest.AssociatedKeyRemoved(associatedKey) `e8c3a62e`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | associatedKey | indexed |


---
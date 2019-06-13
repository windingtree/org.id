* [OrganizationUpgradeabilityTest](#organizationupgradeabilitytest)
  * [supportsInterface](#function-supportsinterface)
  * [newFunction](#function-newfunction)
  * [getOrgJsonUri](#function-getorgjsonuri)
  * [created](#function-created)
  * [orgJsonUri](#function-orgjsonuri)
  * [hasDelegate](#function-hasdelegate)
  * [removeDelegate](#function-removedelegate)
  * [renounceOwnership](#function-renounceownership)
  * [owner](#function-owner)
  * [isOwner](#function-isowner)
  * [delegates](#function-delegates)
  * [changeOrgJsonUri](#function-changeorgjsonuri)
  * [delegatesIndex](#function-delegatesindex)
  * [addDelegate](#function-adddelegate)
  * [transferOwnership](#function-transferownership)
  * [OwnershipTransferred](#event-ownershiptransferred)
  * [OrgJsonUriChanged](#event-orgjsonurichanged)
  * [DelegateAdded](#event-delegateadded)
  * [DelegateRemoved](#event-delegateremoved)

# OrganizationUpgradeabilityTest


## *function* supportsInterface

OrganizationUpgradeabilityTest.supportsInterface(interfaceId) `view` `01ffc9a7`

> See `IERC165.supportsInterface`.     * Time complexity O(1), guaranteed to always use less than 30 000 gas.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes4* | interfaceId | undefined |


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





## *function* hasDelegate

OrganizationUpgradeabilityTest.hasDelegate(addr) `view` `480005cd`

> Is an address considered a delegate for this organization?

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | addr | undefined |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* |  | undefined |

## *function* removeDelegate

OrganizationUpgradeabilityTest.removeDelegate(addr) `nonpayable` `67e7646f`

> Removes delegate address. Only owner can call this.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | addr | Delegate's Ethereum address |


## *function* renounceOwnership

OrganizationUpgradeabilityTest.renounceOwnership() `nonpayable` `715018a6`

> Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner.     * > Note: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.




## *function* owner

OrganizationUpgradeabilityTest.owner() `view` `8da5cb5b`

> Returns the address of the current owner.




## *function* isOwner

OrganizationUpgradeabilityTest.isOwner() `view` `8f32d59b`

> Returns true if the caller is the current owner.




## *function* delegates

OrganizationUpgradeabilityTest.delegates() `view` `b1548afc`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* changeOrgJsonUri

OrganizationUpgradeabilityTest.changeOrgJsonUri(_orgJsonUri) `nonpayable` `b454f4ef`

> `changeOrgJsonUri` Allows owner to change Organization's orgJsonUri.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _orgJsonUri | New orgJsonUri pointer of this Organization |


## *function* delegatesIndex

OrganizationUpgradeabilityTest.delegatesIndex() `view` `c72934d5`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* addDelegate

OrganizationUpgradeabilityTest.addDelegate(addr) `nonpayable` `e71bdf41`

> Adds new delegate address. Only owner can call this.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | addr | Delegate's Ethereum address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* transferOwnership

OrganizationUpgradeabilityTest.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | undefined |


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

## *event* DelegateAdded

OrganizationUpgradeabilityTest.DelegateAdded(delegate, index) `ea230cdd`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | delegate | indexed |
| *uint256* | index | not indexed |

## *event* DelegateRemoved

OrganizationUpgradeabilityTest.DelegateRemoved(delegate) `5a362b19`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | delegate | indexed |


---
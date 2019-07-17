* [Organization](#organization)
  * [removeAssociatedKey](#function-removeassociatedkey)
  * [supportsInterface](#function-supportsinterface)
  * [getAssociatedKeys](#function-getassociatedkeys)
  * [associatedKeys](#function-associatedkeys)
  * [getOrgJsonUri](#function-getorgjsonuri)
  * [orgJsonHash](#function-orgjsonhash)
  * [created](#function-created)
  * [changeOrgJsonHash](#function-changeorgjsonhash)
  * [orgJsonUri](#function-orgjsonuri)
  * [getOrgJsonHash](#function-getorgjsonhash)
  * [addAssociatedKey](#function-addassociatedkey)
  * [owner](#function-owner)
  * [changeOrgJsonUriAndHash](#function-changeorgjsonuriandhash)
  * [changeOrgJsonUri](#function-changeorgjsonuri)
  * [initialize](#function-initialize)
  * [associatedKeysIndex](#function-associatedkeysindex)
  * [transferOwnership](#function-transferownership)
  * [hasAssociatedKey](#function-hasassociatedkey)
  * [OwnershipTransferred](#event-ownershiptransferred)
  * [OrgJsonUriChanged](#event-orgjsonurichanged)
  * [OrgJsonHashChanged](#event-orgjsonhashchanged)
  * [AssociatedKeyAdded](#event-associatedkeyadded)
  * [AssociatedKeyRemoved](#event-associatedkeyremoved)

# Organization


## *function* removeAssociatedKey

Organization.removeAssociatedKey(addr) `nonpayable` `01aedb62`

> Removes an associated key. Only owner can call this.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | addr | Associated Ethereum address |


## *function* supportsInterface

Organization.supportsInterface(interfaceId) `view` `01ffc9a7`

> See `IERC165.supportsInterface`.     * Time complexity O(1), guaranteed to always use less than 30 000 gas.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes4* | interfaceId | undefined |


## *function* getAssociatedKeys

Organization.getAssociatedKeys() `view` `0ba11d86`

> Returns all addresses associated with this organization.



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* |  | undefined |

## *function* associatedKeys

Organization.associatedKeys() `view` `1ad2c3cb`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* |  | undefined |


## *function* getOrgJsonUri

Organization.getOrgJsonUri() `view` `1d855977`

> Returns current orgJsonUri



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *string* |  | undefined |

## *function* orgJsonHash

Organization.orgJsonHash() `view` `2095005b`





## *function* created

Organization.created() `view` `325a19f1`





## *function* changeOrgJsonHash

Organization.changeOrgJsonHash(_orgJsonHash) `nonpayable` `32fda029`

> `changeOrgJsonHash` Allows owner to change Organization's orgJsonHash.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | _orgJsonHash | keccak256 hash of the new ORG.JSON contents. |


## *function* orgJsonUri

Organization.orgJsonUri() `view` `3b3ba578`





## *function* getOrgJsonHash

Organization.getOrgJsonHash() `view` `72cd7fc9`

> Returns keccak256 hash of raw ORG.JSON contents. This should be used to verify that the contents of ORG.JSON has not been tampered with. It is a responsibility of the Organization owner to keep this hash up to date.



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* |  | undefined |

## *function* addAssociatedKey

Organization.addAssociatedKey(addr) `nonpayable` `8d6c8ef0`

> Adds another associated key. Only owner can call this.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | addr | Associated Ethereum address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* owner

Organization.owner() `view` `8da5cb5b`

> Returns the address of the current owner.




## *function* changeOrgJsonUriAndHash

Organization.changeOrgJsonUriAndHash(_orgJsonUri, _orgJsonHash) `nonpayable` `a4e99359`

> Shorthand method to change ORG.JSON uri and hash at the same time

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _orgJsonUri | New orgJsonUri pointer of this Organization |
| *bytes32* | _orgJsonHash | keccak256 hash of the new ORG.JSON contents. |


## *function* changeOrgJsonUri

Organization.changeOrgJsonUri(_orgJsonUri) `nonpayable` `b454f4ef`

> `changeOrgJsonUri` Allows owner to change Organization's orgJsonUri.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _orgJsonUri | New orgJsonUri pointer of this Organization |


## *function* initialize

Organization.initialize(__owner, _orgJsonUri, _orgJsonHash) `nonpayable` `ca303fc7`

> Initializer for upgradeable contracts.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | __owner | The address of the contract owner |
| *string* | _orgJsonUri | pointer to Organization data |
| *bytes32* | _orgJsonHash | keccak256 hash of the new ORG.JSON contents. |


## *function* associatedKeysIndex

Organization.associatedKeysIndex() `view` `df0a2bca`


Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |


## *function* transferOwnership

Organization.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |


## *function* hasAssociatedKey

Organization.hasAssociatedKey(addr) `view` `f5760597`

> Is an address considered as associated for this organization?

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | addr | undefined |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* |  | undefined |
## *event* OwnershipTransferred

Organization.OwnershipTransferred(previousOwner, newOwner) `8be0079c`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |

## *event* OrgJsonUriChanged

Organization.OrgJsonUriChanged(previousOrgJsonUri, newOrgJsonUri) `0153064f`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *string* | previousOrgJsonUri | not indexed |
| *string* | newOrgJsonUri | not indexed |

## *event* OrgJsonHashChanged

Organization.OrgJsonHashChanged(previousOrgJsonHash, newOrgJsonHash) `ccd34c96`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | previousOrgJsonHash | indexed |
| *bytes32* | newOrgJsonHash | indexed |

## *event* AssociatedKeyAdded

Organization.AssociatedKeyAdded(associatedKey, index) `1cbc30c7`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | associatedKey | indexed |
| *uint256* | index | not indexed |

## *event* AssociatedKeyRemoved

Organization.AssociatedKeyRemoved(associatedKey) `e8c3a62e`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *address* | associatedKey | indexed |


---
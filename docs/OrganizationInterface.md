* [OrganizationInterface](#organizationinterface)
  * [supportsInterface](#function-supportsinterface)
  * [isDelegate](#function-isdelegate)
  * [getDataUri](#function-getdatauri)
  * [owner](#function-owner)

# OrganizationInterface


## *function* supportsInterface

OrganizationInterface.supportsInterface(interfaceId) `view` `01ffc9a7`

> Returns true if this contract implements the interface defined by `interfaceId`. See the corresponding [EIP section](https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified) to learn more about how these ids are created.     * This function call must use less than 30 000 gas.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes4* | interfaceId | undefined |


## *function* isDelegate

OrganizationInterface.isDelegate(addr) `view` `07779627`

> Returns if an `address` is Organization's delegate. Delegates can operate on behalf of the organization, typically sign messages.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | addr | Delegate's Ethereum address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* |  | undefined |

## *function* getDataUri

OrganizationInterface.getDataUri() `view` `65f2c7a7`

> Returns the URI of ORG.ID JSON file stored off-chain.



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *string* |  | undefined |

## *function* owner

OrganizationInterface.owner() `view` `8da5cb5b`

> Returns the address of the current owner.



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

---
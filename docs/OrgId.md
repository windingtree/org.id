* [OrgId](#orgid)
  * [OrgIdCreated](#event-orgidcreated)
  * [OrgIdOwnershipTransferred](#event-orgidownershiptransferred)
  * [OrgJsonUriChanged](#event-orgjsonurichanged)
  * [createOrgId](#function-createorgid)
  * [getOrgId](#function-getorgid)
  * [getOrgIds](#function-getorgids)
  * [getOrgIds](#function-getorgids)
  * [getOrgIdsCount](#function-getorgidscount)
  * [initializeUpgrade_2_0_0](#function-initializeupgrade_2_0_0)
  * [setOrgJson](#function-setorgjson)
  * [supportsInterface](#function-supportsinterface)
  * [transferOrgIdOwnership](#function-transferorgidownership)

# OrgId

## *event* OrgIdCreated

OrgId.OrgIdCreated(orgId, owner) `49422f7a`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *address* | owner | indexed |

## *event* OrgIdOwnershipTransferred

OrgId.OrgIdOwnershipTransferred(orgId, previousOwner, newOwner) `f6028548`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *address* | previousOwner | indexed |
| *address* | newOwner | indexed |

## *event* OrgJsonUriChanged

OrgId.OrgJsonUriChanged(orgId, orgJsonUri) `4e0249d1`

Arguments

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | indexed |
| *string* | orgJsonUri | not indexed |


## *function* createOrgId

OrgId.createOrgId(salt, orgJsonUri) `nonpayable` `0ad0abce`

> Create ORGiD

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | salt | Unique hash required for identifier creation |
| *string* | orgJsonUri | ORG.JSON URI (stored off-chain) |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | ORGiD byte32 hash |

## *function* getOrgId

OrgId.getOrgId(orgId) `view` `037640df`

> Check ORGiD existenceReturn parameters marked by (*) are only applicable to units

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | ORGiD hash |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* | exists | ORGiD existence |
| *address* | owner | ORGiD owner address |

## *function* getOrgIds

OrgId.getOrgIds(cursor, count) `view` `0193eda6`

> Get paginated ORGiDs hashes list

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | cursor | Index of the ORGiD from which to start querying |
| *uint256* | count | Number of ORGiDs to go through |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32[]* | orgIdsList | Array of ORGiDs hashes |

## *function* getOrgIds

OrgId.getOrgIds() `view` `e4f64990`

> Get all organizations' ORGiD hashes list



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32[]* | orgIdsList | Array of all ORGiDs hashes |

## *function* getOrgIdsCount

OrgId.getOrgIdsCount() `view` `caa10c57`

> Check registered ORGiD countReturn count of ORGiD hashes



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | count | ORGiDs count |

## *function* initializeUpgrade_2_0_0

OrgId.initializeUpgrade_2_0_0() `nonpayable` `46515fc9`

> Initializer for the version 2.0.0




## *function* setOrgJson

OrgId.setOrgJson(orgId, orgJsonUri) `nonpayable` `35178d91`

> Shorthand method to change ORG.JSON URI and hash at once

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | ORGiD hash |
| *string* | orgJsonUri | New ORG.JSON URI |


## *function* supportsInterface

OrgId.supportsInterface(interfaceId) `view` `01ffc9a7`

> Interface of the ERC165 standard, as defined in the https://eips.ethereum.org/EIPS/eip-165[EIP].

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes4* | interfaceId | Interface Id |


## *function* transferOrgIdOwnership

OrgId.transferOrgIdOwnership(orgId, newOwner) `nonpayable` `bcdf8e41`

> Ownership transfer

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | ORGiD hash |
| *address* | newOwner | New owner's address |


---
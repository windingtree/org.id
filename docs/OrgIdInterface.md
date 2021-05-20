* [OrgIdInterface](#orgidinterface)
  * [createOrgId](#function-createorgid)
  * [getOrgId](#function-getorgid)
  * [getOrgIds](#function-getorgids)
  * [getOrgIds](#function-getorgids)
  * [getOrgIdsCount](#function-getorgidscount)
  * [setOrgJson](#function-setorgjson)
  * [transferOrgIdOwnership](#function-transferorgidownership)

# OrgIdInterface


## *function* createOrgId

OrgIdInterface.createOrgId(salt, orgJsonUri) `nonpayable` `0ad0abce`

> Create organization Id

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

OrgIdInterface.getOrgId(orgId) `view` `037640df`

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

OrgIdInterface.getOrgIds(cursor, count) `view` `0193eda6`

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

OrgIdInterface.getOrgIds() `view` `e4f64990`

> Get all organizations' ORGiD hashes list



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32[]* | orgIdsList | Array of all organizations' ORGiD hashes |

## *function* getOrgIdsCount

OrgIdInterface.getOrgIdsCount() `view` `caa10c57`

> Check registered ORGiD countReturn count of ORGiD hashes



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | count | ORGiDs count |

## *function* setOrgJson

OrgIdInterface.setOrgJson(orgId, orgJsonUri) `nonpayable` `35178d91`

> Shorthand method to change ORG.JSON URI and hash at once

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | ORGiD hash |
| *string* | orgJsonUri | New ORG.JSON URI |


## *function* transferOrgIdOwnership

OrgIdInterface.transferOrgIdOwnership(orgId, newOwner) `nonpayable` `bcdf8e41`

> Ownership transfer

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | ORGiD hash |
| *address* | newOwner | New owner's address |


---
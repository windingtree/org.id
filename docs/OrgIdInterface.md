* [OrgIdInterface](#orgidinterface)
  * [createOrgId](#function-createorgid)
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

## *function* transferOrgIdOwnership

OrgIdInterface.transferOrgIdOwnership(orgId, newOwner) `nonpayable` `bcdf8e41`

> Ownership transfer

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | ORGiD hash |
| *address* | newOwner | New owner's address |


---
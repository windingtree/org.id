* [OrgIdInterface](#orgidinterface)
  * [changeOrgJsonHash](#function-changeorgjsonhash)
  * [changeOrgJsonUri](#function-changeorgjsonuri)
  * [changeOrgJsonUriAndHash](#function-changeorgjsonuriandhash)
  * [confirmDirectorOwnership](#function-confirmdirectorownership)
  * [createOrganization](#function-createorganization)
  * [createSubsidiary](#function-createsubsidiary)
  * [getOrganization](#function-getorganization)
  * [getOrganizations](#function-getorganizations)
  * [getSubsidiaries](#function-getsubsidiaries)
  * [toggleOrganization](#function-toggleorganization)
  * [transferDirectorOwnership](#function-transferdirectorownership)
  * [transferOrganizationOwnership](#function-transferorganizationownership)

# OrgIdInterface


## *function* changeOrgJsonHash

OrgIdInterface.changeOrgJsonHash(orgId, orgJsonHash) `nonpayable` `7fc5f5fb`

> Allows owner to change Organization"s orgJsonHash

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization OrgId |
| *bytes32* | orgJsonHash | keccak256 hash of the new ORG.JSON contents |


## *function* changeOrgJsonUri

OrgIdInterface.changeOrgJsonUri(orgId, orgJsonUri) `nonpayable` `57b5e80d`

> Allows owner to change Organization"s orgJsonUri

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization OrgId |
| *string* | orgJsonUri | New orgJsonUri pointer of this Organization |


## *function* changeOrgJsonUriAndHash

OrgIdInterface.changeOrgJsonUriAndHash(orgId, orgJsonUri, orgJsonHash) `nonpayable` `f1745894`

> Shorthand method to change ORG.JSON uri and hash at the same time

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | undefined |
| *string* | orgJsonUri | New orgJsonUri pointer of this Organization |
| *bytes32* | orgJsonHash | keccak256 hash of the new ORG.JSON contents. |


## *function* confirmDirectorOwnership

OrgIdInterface.confirmDirectorOwnership(orgId) `nonpayable` `4b845bef`

> Confirmation of the organization director ownership

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization orgId |


## *function* createOrganization

OrgIdInterface.createOrganization(orgId, orgJsonUri, orgJsonHash) `nonpayable` `0670af5c`

> Create organization

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization Id |
| *string* | orgJsonUri | orgJsonUri pointer |
| *bytes32* | orgJsonHash | keccak256 hash of the new ORG.JSON contents |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | id | The organization orgId |

## *function* createSubsidiary

OrgIdInterface.createSubsidiary(orgId, subOrgId, subsidiaryDirector, orgJsonUri, orgJsonHash) `nonpayable` `981f3dcf`

> Create subsidiary

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization Id |
| *bytes32* | subOrgId | The subsidiary organization Id |
| *address* | subsidiaryDirector | Subsidiary director address |
| *string* | orgJsonUri | orgJsonUri pointer |
| *bytes32* | orgJsonHash | keccak256 hash of the new ORG.JSON contents |


## *function* getOrganization

OrgIdInterface.getOrganization(_orgId) `view` `22b3cd4e`

> Get organization by orgId

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | _orgId | The organization Id |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bool* | existed | The organizatoin existence flag |
| *bytes32* | orgId | The organization orgId |
| *string* | orgJsonUri | orgJsonUri pointer of this Organization |
| *bytes32* | orgJsonHash | keccak256 hash of the new ORG.JSON contents |
| *bytes32* | parentEntity | The parent organization orgId |
| *address* | owner | The organization owner |
| *address* | director | The organization director |
| *bool* | state | State of the organization |
| *bool* | directorConfirmed | Flag is director ownership is confirmed |

## *function* getOrganizations

OrgIdInterface.getOrganizations() `view` `9754a3a8`

> Return an array of active organizations orgIds



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32[]* | organizationsList | Array of active organizations orgIds |

## *function* getSubsidiaries

OrgIdInterface.getSubsidiaries(orgId) `view` `5aee5dc7`

> Return an array of active subsidiaries orgIds

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | undefined |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32[]* |  | undefined |

## *function* toggleOrganization

OrgIdInterface.toggleOrganization(orgId) `nonpayable` `07233a3d`

> Toggle the organization state

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization orgId |


## *function* transferDirectorOwnership

OrgIdInterface.transferDirectorOwnership(orgId, newDirector) `nonpayable` `b34ef9b7`

> Transfer subsidiary director ownership

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization orgId |
| *address* | newDirector | New subsidiary director address |


## *function* transferOrganizationOwnership

OrgIdInterface.transferOrganizationOwnership(orgId, newOwner) `nonpayable` `aa73697e`

> Transfer organization ownership

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization orgId |
| *address* | newOwner | New subsidiary director address |


---
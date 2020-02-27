* [OrgIdInterface](#orgidinterface)
  * [addDeposit](#function-adddeposit)
  * [changeOrgJsonHash](#function-changeorgjsonhash)
  * [changeOrgJsonUri](#function-changeorgjsonuri)
  * [changeOrgJsonUriAndHash](#function-changeorgjsonuriandhash)
  * [confirmDirectorOwnership](#function-confirmdirectorownership)
  * [createOrganization](#function-createorganization)
  * [createSubsidiary](#function-createsubsidiary)
  * [getLifTokenAddress](#function-getliftokenaddress)
  * [getOrganization](#function-getorganization)
  * [getOrganizations](#function-getorganizations)
  * [getSubsidiaries](#function-getsubsidiaries)
  * [getWithdrawDelay](#function-getwithdrawdelay)
  * [getWithdrawalRequest](#function-getwithdrawalrequest)
  * [setWithdrawDelay](#function-setwithdrawdelay)
  * [submitWithdrawalRequest](#function-submitwithdrawalrequest)
  * [toggleOrganization](#function-toggleorganization)
  * [transferDirectorOwnership](#function-transferdirectorownership)
  * [transferOrganizationOwnership](#function-transferorganizationownership)
  * [withdrawDeposit](#function-withdrawdeposit)

# OrgIdInterface


## *function* addDeposit

OrgIdInterface.addDeposit(orgId, value) `nonpayable` `6e700a7f`

> Makes deposit of Lif tokens

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization OrgId |
| *uint256* | value | The value to be deposited |


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


## *function* getLifTokenAddress

OrgIdInterface.getLifTokenAddress() `view` `671110df`

> Returns Lif token address



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | lifToken | Address of the Lif token |

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
| *bytes32* | orgId | The organization orgId |
| *string* | orgJsonUri | orgJsonUri pointer of this Organization |
| *bytes32* | orgJsonHash | keccak256 hash of the new ORG.JSON contents |
| *bytes32* | parentEntity | The parent organization orgId |
| *address* | owner | The organization owner |
| *address* | director | The organization director |
| *bool* | state | State of the organization |
| *bool* | directorConfirmed | Flag is director ownership is confirmed |
| *uint256* | deposit | Lif deposit value |

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

## *function* getWithdrawDelay

OrgIdInterface.getWithdrawDelay() `view` `fe3300d0`

> Returns withdrawDelay value



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | delay | Delay time in seconds before the requested withdrawal will be possible |

## *function* getWithdrawalRequest

OrgIdInterface.getWithdrawalRequest(orgId) `view` `3e7d48ab`

> Returns information about deposit withdrawal request

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization Id |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | value | Deposit withdrawal value |
| *uint256* | withdrawTime | Withraw time on seconds |

## *function* setWithdrawDelay

OrgIdInterface.setWithdrawDelay(_withdrawDelay) `nonpayable` `72f0cb30`

> Changing withdrawDelay value

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *uint256* | _withdrawDelay | New withdrawDelay value in seconds |


## *function* submitWithdrawalRequest

OrgIdInterface.submitWithdrawalRequest(orgId, value) `nonpayable` `fa094c70`

> Submits withdrawal request

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization OrgId |
| *uint256* | value | The value to withdraw |


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


## *function* withdrawDeposit

OrgIdInterface.withdrawDeposit(orgId) `nonpayable` `a8e06bc3`

> Trunsfers deposited tokens to the sender

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | orgId | The organization OrgId |


---
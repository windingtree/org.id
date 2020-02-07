* [OrganizationInterface](#organizationinterface)
  * [changeEntityDirector](#function-changeentitydirector)
  * [changeOrgJsonHash](#function-changeorgjsonhash)
  * [changeOrgJsonUri](#function-changeorgjsonuri)
  * [createSubsidiary](#function-createsubsidiary)
  * [entityDirector](#function-entitydirector)
  * [getOrgJsonHash](#function-getorgjsonhash)
  * [getOrgJsonUri](#function-getorgjsonuri)
  * [getSubsidiaries](#function-getsubsidiaries)
  * [getSubsidiary](#function-getsubsidiary)
  * [linkDirectory](#function-linkdirectory)
  * [owner](#function-owner)
  * [parentEntity](#function-parententity)
  * [supportsInterface](#function-supportsinterface)
  * [toggleSubsidiary](#function-togglesubsidiary)
  * [transferDirectorOwnership](#function-transferdirectorownership)
  * [transferOwnership](#function-transferownership)
  * [unlinkDirectory](#function-unlinkdirectory)

# OrganizationInterface


## *function* changeEntityDirector

OrganizationInterface.changeEntityDirector(newEntityDirectorAddress) `nonpayable` `b1b53517`

> Change entity director

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newEntityDirectorAddress | New entity director address |


## *function* changeOrgJsonHash

OrganizationInterface.changeOrgJsonHash(_orgJsonHash) `nonpayable` `32fda029`

> `changeOrgJsonHash` Allows owner to change Organization's orgJsonHash.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* | _orgJsonHash | keccak256 hash of the new ORG.JSON contents. |


## *function* changeOrgJsonUri

OrganizationInterface.changeOrgJsonUri(_orgJsonUri) `nonpayable` `b454f4ef`

> `changeOrgJsonUri` Allows owner to change Organization's orgJsonUri.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _orgJsonUri | New orgJsonUri pointer of this Organization |


## *function* createSubsidiary

OrganizationInterface.createSubsidiary(_orgJsonUri, _orgJsonHash, subsidiaryDirector, packageName, contractName) `nonpayable` `3ba2e931`

> Create subsidiary

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *string* | _orgJsonUri | orgJsonUri pointer |
| *bytes32* | _orgJsonHash | keccak256 hash of the new ORG.JSON contents |
| *address* | subsidiaryDirector | Subsidiary director address |
| *string* | packageName | Name of the package where the contract is contained.  Will be "wt-contracts" if empty string provided |
| *string* | contractName | Name of the organization contract.  Will be "Organization" if empty string provided |


## *function* entityDirector

OrganizationInterface.entityDirector() `view` `dcfa1cdc`





## *function* getOrgJsonHash

OrganizationInterface.getOrgJsonHash() `view` `72cd7fc9`

> Returns keccak256 hash of raw ORG.JSON contents. This should be used to verify that the contents of ORG.JSON has not been tampered with. It is a responsibility of the Organization owner to keep this hash up to date.



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes32* |  | undefined |

## *function* getOrgJsonUri

OrganizationInterface.getOrgJsonUri() `view` `1d855977`

> Returns the URI of ORG.JSON file stored off-chain.



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *string* |  | undefined |

## *function* getSubsidiaries

OrganizationInterface.getSubsidiaries() `view` `fadc2569`

> Return an array of subsidiaries addresses



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address[]* | subsidiariesList | Array of active subsidiaries |

## *function* getSubsidiary

OrganizationInterface.getSubsidiary(subsidiaryAddress) `view` `b2a1e312`

> Return subsidiary organization parmeters

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | subsidiaryAddress | Subsidiary organization address |

Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | id | Subsidiary address |
| *bool* | state | Subsidiary state |
| *bool* | confirmed | Subsidiary director ownership confirmation state |
| *address* | director | Entity director address |

## *function* linkDirectory

OrganizationInterface.linkDirectory() `nonpayable` `8335ad14`

> Liking with SegmentDirectory.  This function have to be called by SegmentDirectory contract only




## *function* owner

OrganizationInterface.owner() `view` `8da5cb5b`

> Returns the address of the current owner.



Outputs

| **type** | **name** | **description** |
|-|-|-|
| *address* |  | undefined |

## *function* parentEntity

OrganizationInterface.parentEntity() `view` `19fb3ff2`





## *function* supportsInterface

OrganizationInterface.supportsInterface(interfaceId) `view` `01ffc9a7`

> Returns true if this contract implements the interface defined by `interfaceId`. See the corresponding https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section] to learn more about how these ids are created.     * This function call must use less than 30 000 gas.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *bytes4* | interfaceId | undefined |


## *function* toggleSubsidiary

OrganizationInterface.toggleSubsidiary(subsidiaryAddress) `nonpayable` `6df2e446`

> Toggle subsidiary state

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | subsidiaryAddress | Subsidiary organization address |


## *function* transferDirectorOwnership

OrganizationInterface.transferDirectorOwnership(subsidiaryAddress, newSubsidiaryDirector) `nonpayable` `f56f2d85`

> Transfer subsidiary director ownership

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | subsidiaryAddress | Subsidiary organization address |
| *address* | newSubsidiaryDirector | New subsidiary director address |


## *function* transferOwnership

OrganizationInterface.transferOwnership(newOwner) `nonpayable` `f2fde38b`

> Allows the current owner to transfer control of the contract to a newOwner.

Inputs

| **type** | **name** | **description** |
|-|-|-|
| *address* | newOwner | The address to transfer ownership to. |


## *function* unlinkDirectory

OrganizationInterface.unlinkDirectory() `nonpayable` `791d8763`

> Removes a link with SegmentDirectory.  This function have to be called by SegmentDirectory contract only




---
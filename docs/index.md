# ORGiD smart contract

## ORGiD identifiers registry

**OrgId** is the core smart contract of the ORGiD protocol. It is a decentralized registry of unique identifiers used for the creation and managing of network-specific [DID](https://www.w3.org/TR/did-core)s'. The main idea of the ORGiD protocol is providing a Self Sovereign Identity (SSI) for every organization or person.

The ORGiD smart contract supports [ERC721](https://eips.ethereum.org/EIPS/eip-721) interface, so every entity represented by the unique Id is recognizable as NFT.

### Identifier metadata

Every identifier is represented by the following metadata:

- `tokenId` - NFT Id, a unique entity index, integer number which enumeration starts from the `1`;
- `orgId` - unique organization hash;
- `owner` - an entity owner, the Ethereum address that has exceptional right to manage metadata changes and transfer ownership of the identifier;
- `orgJsonUri` - HTTP or IPFS/IPNS link to an off-chain JSON file with data related to identifier composed in accordance to [ORG.JSON schema](https://github.com/windingtree/org.json-schema).

### ORGiD contract metadata (ERC721)

- `name` - NFT name is `ORGiD`
- `symbol` - NFT symbol is `ORGiD`
- `tokenURI` - link to a NFT metadata, the same as `orgJsonUri`

## ORGiD contract core features

### Identifier creation

A function `createOrgId(bytes32,string)` is allowing to create an unique identifier in predictable way.

> The identifier is generating as a keccak256 hash of Ethereum address of the function caller and of a unique bytes32 hash salt that generated (off-chain).

The function caller is able to reproduce the generation algorithm off-chain before the function will be called.

During the `orgId` creation, also the `tokenId` is assigning that is the next-available token Id in the storage. These two unique identifiers are cross-referenced in the contract storage.

Requirements:

- `orgJsonUri` parameter cannot be empty string;
- `salt` parameter cannot be used twice by the same function caller.

### Identifiers lookup

Identifiers can be looked up by these functions:

- `getOrgIds()` getting of the complete list of all registered `orgId`'s
- `getOrgIds(uint256,uint256)` getting of paginated list of `orgId`'s
- `getTokenId(bytes32)` getting of the `tokenId` by given `orgId`
- `getOrgId(uint256)` getting of the whole metadata set by given `tokenId`

The ORGiD metadata set that returns `getOrgId(uint256)` consists of:

- `exists` boolean flag (helper) of an `orgId` existence
- `orgId` unique organization hash
- `orgJsonUri` link to off-chain JSON data file
- `owner` an owner Ethereum address

### `orgJsonUri` update

A function `setOrgJson(bytes32,string)` allows to change a value of the `orgJsonUri` linked to the `orgId` hash.

Requirements:

- `orgId` must exists
- `orgJson` must not be empty string
- Function must be called by the ORGiD owner

Errors:

- `CalledNotByOrgIdOwner()` will be thrown if the function calld not by an owner of the ORGiD
- `OrgJsonUriEmpty()` will be thrown if an empty orgJsonUri has been provided

In case of success the `OrgJsonUriChanged(bytes32,string)` event will be emitted.

### Ownership management

An ownership management in the smart contract is represented by the set functions that is a part of the ERC721 interface that imported from the [OpenZeppelins' implementation](https://docs.openzeppelin.com/contracts/4.x/erc721).

- `approve(address,uint256)` gives permission to `to` to transfer `tokenId` token to another account
- `getApproved(uint256)` returns the account approved for `tokenId` token
- `setApprovalForAll(address,bool)` approve or remove `operator` as an operator for the caller.
- `isApprovedForAll(address,address)` Returns if the `operator` is allowed to manage all of the assets of `owner`.
- `safeTransferFrom(address,address,uint256)` Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients are aware of the ERC721 protocol to prevent tokens from being forever locked.
- `transferFrom(address,address,uint256)` Transfers `tokenId` token from `from` to `to`.

### Capability delegation

In general use-case, the ORGiD identifier owner can create the possibility to prove the consistency of the identifier metadata by applying the cryptographic signature on the metadata (create a verifiable credential) using the private key of the Ethereum account that belongs to him. But in some cases, for example, if ownership of an ORGiD is moved to a multisig wallet, applying a signature is not possible.

To make it possible to verify the consistency of metadata the ORGiD owner must register in the smart contract a list of authorized verification methods (DIDs).

#### Adding of delegates

A function `addDelegates(bytes32,string[])` allows to register new delegates in the smart contract storage. The first parameter is the ORGiD hash and the second is the list of authorized verification methods (DIDs).

Requirements:

- the function must be called by the ORGiD owner
- `ORGiD` related to the given hash must exists
- list of authorized verification methods cannot be empty
- list of authorized verification methods must contain at least one new record (already registered records will be ignored)

Errors:

- `CalledNotByOrgIdOwner()` will be thrown if the function calld not by an owner of the ORGiD
- `OrgIdNotFound(bytes32)` will be thrown if unknown ORGiD has been provided
- `InvalidDelegatesInput()` will be thrown if an invalid input has been provided

In the case of success the `OrgIdDelegatesAdded(bytes32,string[])` event will be emitted.

#### Removing of delegates

A function `removeDelegates(bytes32,string[])` allows to remove delegates from the smart contract storage. The first parameter is the ORGiD hash and the second is the list of verification methods to remove.

Requirements:

- the function must be called by the ORGiD owner
- `ORGiD` related to the given hash must exists
- list of authorized verification methods cannot be empty
- list of authorized verification methods must contain registered records only

Errors:

- `CalledNotByOrgIdOwner()` will be thrown if the function calld not by an owner of the ORGiD
- `OrgIdNotFound(bytes32)` will be thrown if unknown ORGiD has been provided
- `InvalidDelegatesInput()` will be thrown if an invalid input has been provided

Another one modification of this function is `removeDelegates(bytes32)` allows to remove all registered records at once.

In the case of success the `OrgIdDelegatesRemoved(bytes32,string[])` event will be emitted.

#### Getting delegates

A function `getDelegates(bytes32)` allows to fetch the whole list of registered delegates.

Requirements:

- `ORGiD` related to the given hash must exists

If an ORGiD has no registered delegates an empty array will be returned.

### Supported interfaces (ERC165)

ORGiD is ERC165 compatible smart contract that supports the following interfaces that can be verified by calling the `supportsInterface(bytes4)` function:

- ERC165 interface: `0x01ffc9a7`
- ORGiD interface: `0x8bf1ed02`
- ERC721Metadata interface: `0x5b5e139f`
- ERC721 interface: `0x80ac58cd`
- ERC721Enumerable interface: `0x780e9d63`

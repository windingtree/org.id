pragma solidity ^0.5.6;

/**
 * Abstract Organization Factory. Usable in libraries.
 */
contract AbstractOrganizationFactory {

    /**
     * @dev Event triggered every time organization is created.
     */
    event OrganizationCreated(address indexed organization);

    /**
     * @dev Event triggered when owner of the factory is changed.
     */
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view returns (address);

    /**
     * @dev Creates new 0xORG smart contract
     * @param  orgJsonUri Organization's data pointer
     * @param  orgJsonHash Organization's data hash
     * @return {" ": "Address of the new organization."}
     */
    function create(string calldata orgJsonUri, bytes32 orgJsonHash) external returns (address);

    /**
     * @dev Creates new subsidiary 0xORG smart contract
     * @param orgJsonUri Organization's data pointer
     * @param orgJsonHash Organization's data hash
     * @param parentAddress Parent organization address
     * @param subsidiaryDirector Subsidiary director address
     * @return {" ": "Address of the new organization."}
     */
    function create(
        string calldata orgJsonUri, 
        bytes32 orgJsonHash,
        address parentAddress,
        address subsidiaryDirector
    ) external returns (address);

    /**
     * @dev Creates new 0xORG smart contract and adds it to a segment directory
     * in the same transaction
     * @param orgJsonUri Organization's data pointer
     * @param orgJsonHash Organization's data hash
     * @param directory Segment directory address
     * @return {" ": "Address of the new organization."}
     */
    function createAndAddToDirectory(
        string calldata orgJsonUri,
        bytes32 orgJsonHash,
        address directory
    ) external returns (address);

    /**
     * @dev Creates new subsidiary 0xORG smart contract and adds it to a segment directory
     * in the same transaction
     * @param orgJsonUri Organization's data pointer
     * @param orgJsonHash Organization's data hash
     * @param directory Segment directory address
     * @param parentAddress Parent organization address
     * @param subsidiaryDirector Subsidiary director address
     * @return {" ": "Address of the new organization."}
     */
    function createAndAddToDirectory(
        string calldata orgJsonUri,
        bytes32 orgJsonHash,
        address directory,
        address parentAddress,
        address subsidiaryDirector
    ) external returns (address);

    /**
     * @dev Returns number of created organizations.
     */
    function getCreatedOrganizationsLength() public view returns (uint);

    /**
     * @dev Returns a list of created organizations.
     */
    function getCreatedOrganizations() public view returns (address[] memory);

    /**
     * @dev Returns index of `organization`
     */
    function createdOrganizationsIndex(address organization) public view returns (uint);

    /**
     * @dev Returns organization address on `index` position.
     */
    function createdOrganizations(uint index) public view returns (address);
}

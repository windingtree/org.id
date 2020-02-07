pragma solidity ^0.5.6;

import "openzeppelin-solidity/contracts/introspection/IERC165.sol";

/**
 * @title Minimal 0xORG interface
 * 
 * @dev If you are creating your own implementation of Winding
 * Tree Organization, this is the minimal interface that you must
 * fullfill. Without it, the Organization won't be added into the
 * SegmentDirectory. For checked interface ID, head over to the
 * implementation of `addOrganization` in `SegmentDirectory`.
 *
 * This is not meant to be used by libraries that try to operate
 * with the organization as any data manipulation methods are
 * intentionally omitted. It can be used only for reading data.
 */
contract OrganizationInterface is IERC165 {

    // Address of the parent organization.
    // Should be set if the organization is subsidiary 
    address public parentEntity;

    // Address of the director account.
    // Should be set if the organization is subsidiary
    address public entityDirector;

    /**
     * @dev Returns the address of the current owner.
     * @return {" ": "Current owner address."}
     */
    function owner() external view returns (address);

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address payable newOwner) external;

    /**
     * @dev Create subsidiary
     * @param _orgJsonUri orgJsonUri pointer
     * @param _orgJsonHash keccak256 hash of the new ORG.JSON contents
     * @param subsidiaryDirector Subsidiary director address
     * @param packageName Name of the package where the contract is contained. 
     * Will be "wt-contracts" if empty string provided
     * @param contractName Name of the organization contract. 
     * Will be "Organization" if empty string provided
     */
    function createSubsidiary(
        string calldata _orgJsonUri,
        bytes32 _orgJsonHash,
        address subsidiaryDirector,
        string calldata packageName,
        string calldata contractName
    ) external;

    /**
     * @dev Toggle subsidiary state
     * @param subsidiaryAddress Subsidiary organization address
     */
    function toggleSubsidiary(address subsidiaryAddress) external;

    /**
     * @dev Change entity director
     * @param newEntityDirectorAddress New entity director address
     */
    function changeEntityDirector(address newEntityDirectorAddress) external;

    /**
     * @dev Return subsidiary organization parmeters
     * @param subsidiaryAddress Subsidiary organization address
     * @return {
        "id": "Subsidiary address",
        "state": "Subsidiary state",
        "confirmed": "Subsidiary director ownership confirmation state",
        "director": "Entity director address"
     }     
     */
    function getSubsidiary(address subsidiaryAddress) external view returns (
        address id,
        bool state,
        bool confirmed,
        address director
    );

    /**
     * @dev Return an array of subsidiaries addresses
     * @return {
         "subsidiariesList": "Array of active subsidiaries"
     }
     */
    function getSubsidiaries() external view returns (
        address[] memory subsidiariesList
    );

    /**
     * @dev Transfer subsidiary director ownership
     * @param subsidiaryAddress Subsidiary organization address
     * @param newSubsidiaryDirector New subsidiary director address
     */
    function transferDirectorOwnership(
        address subsidiaryAddress,
        address newSubsidiaryDirector
    ) external;

    /**
     * @dev Liking with SegmentDirectory. 
     * This function have to be called by SegmentDirectory contract only
     */
    function linkDirectory() external;

    /**
     * @dev Removes a link with SegmentDirectory. 
     * This function have to be called by SegmentDirectory contract only
     */
    function unlinkDirectory() external;

    /**
     * @dev Returns the URI of ORG.JSON file stored off-chain.
     * @return {" ": "Current ORG.JSON URI."}
     */
    function getOrgJsonUri() external view returns (string memory);

    /**
     * @dev Returns keccak256 hash of raw ORG.JSON contents. This should
     * be used to verify that the contents of ORG.JSON has not been tampered
     * with. It is a responsibility of the Organization owner to keep this
     * hash up to date.
     * @return {" ": "Current ORG.JSON hash."}
     */
    function getOrgJsonHash() external view returns (bytes32);

    /**
     * @dev `changeOrgJsonUri` Allows owner to change Organization's orgJsonUri.
     * @param  _orgJsonUri New orgJsonUri pointer of this Organization
     */
    function changeOrgJsonUri(string memory _orgJsonUri) public;

    /**
     * @dev `changeOrgJsonHash` Allows owner to change Organization's orgJsonHash.
     * @param _orgJsonHash keccak256 hash of the new ORG.JSON contents.
     */
    function changeOrgJsonHash(bytes32 _orgJsonHash) public;
}
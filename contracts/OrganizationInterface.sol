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

    /// @dev Subsidiary organization configuration structure
    struct Subsidiary {
        address id;
        bool state;
        bool confirmed;
        address director;
    }

    /**
     * @dev Returns the address of the current owner.
     * @return {" ": "Current owner address."}
     */
    function owner() public view returns (address);

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address payable newOwner) public;

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
     * @dev Returns if an `address` is associated with the Organization.
     * Associated keys can be used on behalf of the organization,
     * typically to sign messages.
     *
     * @param addr Associated Ethereum address
     * @return {" ": "true if associated, false otherwise"}
     */
    function hasAssociatedKey(address addr) external view returns (bool);

    /**
     * @dev Returns all associatedKeys belonging to this organization.
     * @return {" ": "List of associatedKeys"}
     */
    function getAssociatedKeys() external view returns (address[] memory);
}
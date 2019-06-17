pragma solidity ^0.5.6;

import "openzeppelin-solidity/contracts/introspection/IERC165.sol";

/**
 * If you are creating your own implementation of Winding
 * Tree Organization, this is the minimal interface that you should
 * fullfill. Without it, the Organization won't be added into the
 * SegmentDirectory. For checked interface ID, head over to the
 * implementation of `addOrganization`.
 *
 * This is not meant to be used by libraries that try to operate
 * with the organization as any data manipulation methods are
 * intentionally omitted.
 */
contract OrganizationInterface is IERC165 {
    /**
     * @dev Returns the address of the current owner.
     * @return {" ": "Current owner address."}
     */
    function owner() public view returns (address);

    /**
     * @dev Returns the URI of ORG.ID JSON file stored off-chain.
     * @return {" ": "Current ORG.ID JSON URI."}
     */
    function getOrgJsonUri() external view returns (string memory);

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
     * @dev Returns all associatedKeys associated with this organization.
     * @return {" ": "List of associatedKeys"}
     */
    function getAssociatedKeys() external view returns (address[] memory);
}
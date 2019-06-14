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
     * @dev Returns if an `address` is Organization's delegate.
     * Delegates can operate on behalf of the organization,
     * typically sign messages.
     *
     * @param addr Delegate's Ethereum address
     * @return {" ": "true if delegate, false otherwise"}
     */
    function hasDelegate(address addr) external view returns (bool);

    /**
     * @dev Returns all delegates associated with this organization.
     * @return {" ": "List of delegates"}
     */
    function getDelegates() external view returns (address[] memory);
}
pragma solidity ^0.5.6;

/**
 * @title AbstractSegmentDirectory
 * @dev Usable in libraries. Segment Directory is essentially a list
 * of 0xORG smart contracts that share a common segment - hotels, airlines, otas.
 */
contract SegmentDirectoryInterface {

    /**
     * @dev `setSegment` allows the owner of the contract to change the
     * segment name.
     * @param __segment The new segment name
     */
    function setSegment(string calldata __segment) external;

    /**
     * @dev Adds an organization to the list
     */
    function add(address organization) external returns (address);

    /**
     * @dev Removes an organization from the list
     */
    function remove(address organization) external;

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address payable newOwner) external;

    /**
     * @dev Returns the number of added organizations. Might contain zero
     * addresses (these remain after removing an organization).
     */
    function getOrganizationsLength() external view returns (uint256);

    /**
     * @dev Returns a list of added organizations. Might contain zero addresses.
     */
    function getOrganizations() external view returns (address[] memory);

    /**
     * @dev Returns index of `organization`
     */
    function organizationsIndex(address organization) external view returns (uint256);

    /**
     * @dev Returns organization address on `index` position.
     */
    function organizations(uint256 index) external view returns (address);

    /**
     * @dev Returns the address of the associated lif token
     */
    function getLifToken() external view returns (address);

    /**
     * @dev Returns the segment name
     */
    function getSegment() external view returns (string memory);

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view returns (address);
}

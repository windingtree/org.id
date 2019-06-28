pragma solidity ^0.5.6;

/**
 * @title AbstractSegmentDirectory
 * 
 * @dev Usable in libraries. Segment Directory is essentially a list
 * of 0xORG smart contracts that share a common segment - hotels, airlines, otas.
 */
contract AbstractSegmentDirectory {

    /**
     * @dev Event triggered every time organization is added.
     */
    event OrganizationAdded(address indexed organization, uint index);

    /**
     * @dev Event triggered every time organization is removed.
     */
    event OrganizationRemoved(address indexed organization);

    /**
     * @dev Event triggered when owner of the directory is changed.
     */
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view returns (address);

    /**
     * @dev Returns the segment name
     */
    function getSegment() public view returns (string memory);

    /**
     * @dev Returns the address of the associated lif token
     */
    function getLifToken() public view returns (address);

    /**
     * @dev Adds an organization to the list
     */
    function add(address organization) external returns (address);

    /**
     * @dev Removes an organization from the list
     */
    function remove(address organization) external;

    /**
     * @dev Returns the number of added organizations. Might contain zero
     * addresses (these remain after removing an organization).
     */
    function getOrganizationsLength() public view returns (uint);

    /**
     * @dev Returns a list of added organizations. Might contain zero addresses.
     */
    function getOrganizations() public view returns (address[] memory);

    /**
     * @dev Returns index of `organization`
     */
    function organizationsIndex(address organization) public view returns (uint);

    /**
     * @dev Returns organization address on `index` position.
     */
    function organizations(uint index) public view returns (address);
}

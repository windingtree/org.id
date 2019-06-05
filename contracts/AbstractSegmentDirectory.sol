pragma solidity ^0.5.6;

/**
 * Abstract Segment Directory. Usable in libraries.
 */
contract AbstractSegmentDirectory {

    /**
     * @dev Event triggered every time organization is added
     */
    event OrganizationCreated(address indexed organization);

    /**
     * @dev Event triggered every time organization is added
     */
    event OrganizationAdded(address indexed organization, uint index);

    /**
     * @dev Event triggered every time organization is deleted
     */
    event OrganizationRemoved(address indexed organization);

    /**
     * @dev Event triggered when owner of the index is changed.
     */
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    function create(string calldata dataUri) external returns (address);
    function createAndAdd(string calldata dataUri) external returns (address);
    function add(address organization) external returns (address);
    function remove(address organization) external;
    function getOrganizationsLength() public view returns (uint);
    function getOrganizations() public view returns (address[] memory);
    function organizationsIndex(address organization) public view returns (uint);
    function organizations(uint index) public view returns (address);
}

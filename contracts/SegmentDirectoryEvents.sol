pragma solidity ^0.5.6;

contract SegmentDirectoryEvents {

    /**
     * @dev Event triggered every time organization is registered
     */
    event OrganizationCreated(address indexed organization);

    /**
     * @dev Event triggered every time organization is registered
     */
    event OrganizationRegistered(address indexed organization, uint managerIndex, uint allIndex);

    /**
     * @dev Event triggered every time organization is deleted
     */
    event OrganizationDeregistered(address indexed organization, uint managerIndex, uint allIndex);

    /**
     * @dev Event triggered when owner of the index is changed.
     */
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

}

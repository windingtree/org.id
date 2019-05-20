pragma solidity ^0.5.6;

contract SegmentDirectoryEvents {

    /**
     * @dev Event triggered every time organization is registered
     */
    event OrganizationRegistered(address indexed organization, uint managerIndex, uint allIndex);
    /**
     * @dev Event triggered every time organization is deleted
     */
    event OrganizationDeleted(address indexed organization, uint managerIndex, uint allIndex);
    /**
     * @dev Event triggered every time organization is called
     */
    event OrganizationCalled(address indexed organization);

    /**
     * @dev Event triggered every time a organization changes a manager.
     */
    event OrganizationTransferred(address indexed organization, address previousManager, address newManager);

    /**
     * @dev Event triggered when owner of the index is changed.
     */
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

}

pragma solidity ^0.5.6;

/**
 * List of events emittable by a SegmentDirectory. This is singled out
 * so it can be included in segment directory instance interfaces which
 * in turn can be easily used by the non-solidity libraries.
 */
contract SegmentDirectoryEvents {

    /**
     * @dev Event triggered every time organization is registered
     */
    event OrganizationCreated(address indexed organization);

    /**
     * @dev Event triggered every time organization is registered
     */
    event OrganizationRegistered(address indexed organization, uint index);

    /**
     * @dev Event triggered every time organization is deleted
     */
    event OrganizationDeregistered(address indexed organization);

    /**
     * @dev Event triggered when owner of the index is changed.
     */
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

}

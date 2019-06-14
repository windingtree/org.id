pragma solidity ^0.5.6;

/**
 * Abstract Organization Factory. Usable in libraries.
 */
contract AbstractOrganizationFactory {

        /**
     * @dev Event triggered every time organization is added
     */
    event OrganizationCreated(address indexed organization);

    /**
     * @dev Event triggered when owner of the index is changed.
     */
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);


    function owner() public view returns (address);

    function create(string calldata orgJsonUri) external returns (address);

    function getCreatedOrganizationsLength() public view returns (uint);
    function getCreatedOrganizations() public view returns (address[] memory);
    function createdOrganizationsIndex(address organization) public view returns (uint);
    function createdOrganizations(uint index) public view returns (address);
}

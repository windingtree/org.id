pragma solidity ^0.5.6;

import "zos-lib/contracts/Initializable.sol";
import "./Organization.sol";
import "./SegmentDirectoryEvents.sol";

contract SegmentDirectory is Initializable, SegmentDirectoryEvents {

    // Array of addresses of `Organization` contracts
    address[] public organizations;

    // Mapping of organizations position in the general organization index
    mapping(address => uint) public organizationsIndex;

    // Mapping of the organizations indexed by manager's address
    mapping(address => address[]) public organizationsByManager;

    // Mapping of organizations position in the manager's indexed organization index
    mapping(address => uint) public organizationsByManagerIndex;

    // Address of the LifToken contract
    // solhint-disable-next-line var-name-mixedcase
    address public LifToken;

    // Address of the contract owner
    address _owner;

    /**
     * @dev `createOrganization` Register new organization in the index.
     * Emits `OrganizationCreated` on success.
     * @param  dataUri Organization's data pointer
     * @return {" ": "Address of the new organization."}
     */
    function createOrganization(string memory dataUri) internal returns (address) {
        Organization newOrganization = new Organization(dataUri);
        newOrganization.transferOwnership(msg.sender);
        address newOrganizationAddress = address(newOrganization);
        emit OrganizationCreated(newOrganizationAddress);
        return newOrganizationAddress;
    }

    /**
     * @dev `registerOrganization` Register new organization in the index.
     * Emits `OrganizationRegistered` on success.
     * @param  organization Organization's address
     * @return {" ": "Address of the organization."}
     */
    function registerOrganization(address organization) internal returns (address) {
        organizationsIndex[organization] = organizations.length;
        organizations.push(organization);
        organizationsByManagerIndex[organization] = organizationsByManager[msg.sender].length;
        organizationsByManager[msg.sender].push(organization);
        emit OrganizationRegistered(
            organization,
            organizationsByManagerIndex[organization],
            organizationsIndex[organization]
        );
        return organization;
    }

    function createAndRegisterOrganization(string memory dataUri) internal returns (address) {
        address newOrganizationAddress = createOrganization(dataUri);
        return registerOrganization(newOrganizationAddress);
    }

    /**
     * @dev `deleteOrganization` Allows a manager to delete a organization, i. e. call destroy
     * on the target Organization contract. Emits `OrganizationDeregistered` on success.
     * @param  organization  Organization's address
     */
    function deregisterOrganization(address organization) internal {
        // Ensure organization address is valid
        require(organization != address(0));
        // Ensure we know about the organization at all
        require(organizationsIndex[organization] != uint(0));
        // Ensure that the caller is the organization's rightful owner
        // There may actually be a organization on index zero, that's why we use a double check
        require(organizationsByManager[msg.sender][organizationsByManagerIndex[organization]] != address(0));
        uint index = organizationsByManagerIndex[organization];
        uint allIndex = organizationsIndex[organization];
        delete organizations[allIndex];
        delete organizationsIndex[organization];
        delete organizationsByManager[msg.sender][index];
        delete organizationsByManagerIndex[organization];
        emit OrganizationDeregistered(organization);
    }

    /**
     * @dev Initializer for upgradeable contracts.
     * @param __owner The address of the contract owner
     * @param _lifToken The new contract address
     */
    function initialize(address __owner, address _lifToken) public initializer {
        _owner = __owner;
        LifToken = _lifToken;
        organizations.length++;
    }

    /**
     * @dev `getOrganizationsLength` get the length of the `organizations` array
     * @return {" ": "Length of the organizations array. Might contain zero addresses."}
     */
    function getOrganizationsLength() public view returns (uint) {
        return organizations.length;
    }

    /**
     * @dev `getOrganizations` get `organizations` array
     * @return {" ": "Array of organization addresses. Might contain zero addresses."}
     */
    function getOrganizations() public view returns (address[] memory) {
        return organizations;
    }

    /**
     * @dev `getOrganizationsByManager` get all the organizations belonging to one manager
     * @param  manager Manager address
     * @return {" ": "Array of organizations belonging to one manager. Might contain zero addresses."}
     */
    function getOrganizationsByManager(address manager) public view returns (address[] memory) {
        return organizationsByManager[manager];
    }

        /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == _owner);
        _;
    }

    /**
     * @dev `setLifToken` allows the owner of the contract to change the
     * address of the LifToken contract
     * @param _lifToken The new contract address
     */
    function setLifToken(address _lifToken) public onlyOwner {
        LifToken = _lifToken;
    }

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address payable newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0));
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

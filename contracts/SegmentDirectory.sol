pragma solidity ^0.5.6;

import "zos-lib/contracts/Initializable.sol";
import "./Organization.sol";

contract SegmentDirectory is Initializable {

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


    /**
     * @dev `registerOrganization` Register new organization in the index.
     * Emits `OrganizationRegistered` on success.
     * @param  dataUri Organization's data pointer
     * @return {" ": "Address of the new organization."}
     */
    function registerOrganization(string memory dataUri) internal returns (address) {
        Organization newOrganization = new Organization(msg.sender, dataUri, address(this));
        address newOrganizationAddress = address(newOrganization);
        organizationsIndex[newOrganizationAddress] = organizations.length;
        organizations.push(newOrganizationAddress);
        organizationsByManagerIndex[newOrganizationAddress] = organizationsByManager[msg.sender].length;
        organizationsByManager[msg.sender].push(newOrganizationAddress);
        emit OrganizationRegistered(
            newOrganizationAddress,
            organizationsByManagerIndex[newOrganizationAddress],
            organizationsIndex[newOrganizationAddress]
        );
        return newOrganizationAddress;
    }

    /**
     * @dev `deleteOrganization` Allows a manager to delete a organization, i. e. call destroy
     * on the target Organization contract. Emits `OrganizationDeleted` on success.
     * @param  organization  Organization's address
     */
    function deleteOrganization(address organization) internal {
        // Ensure organization address is valid
        require(organization != address(0));
        // Ensure we know about the organization at all
        require(organizationsIndex[organization] != uint(0));
        // Ensure that the caller is the organization's rightful owner
        // There may actually be a organization on index zero, that's why we use a double check
        require(organizationsByManager[msg.sender][organizationsByManagerIndex[organization]] != address(0));

        Organization organizationInstance = Organization(organization);
        // Ensure we are calling only our own organizations
        require(organizationInstance.index() == address(this));
        organizationInstance.destroy();

        uint index = organizationsByManagerIndex[organization];
        uint allIndex = organizationsIndex[organization];
        delete organizations[allIndex];
        delete organizationsIndex[organization];
        delete organizationsByManager[msg.sender][index];
        delete organizationsByManagerIndex[organization];
        emit OrganizationDeleted(organization, index, allIndex);
    }

    /**
     * @dev `callOrganization` Call organization in the index, the organization can only
     * be called by its manager. Effectively proxies a organization call.
     * Emits OrganizationCalled on success.
     * @param  organization Organization's address
     * @param  data Encoded method call to be done on Organization contract.
     */
    function callOrganization(address organization, bytes memory data) internal {
        // Ensure organization address is valid
        require(organization != address(0));
        // Ensure we know about the organization at all
        require(organizationsIndex[organization] != uint(0));
        // Ensure that the caller is the organization's rightful owner
        require(organizationsByManager[msg.sender][organizationsByManagerIndex[organization]] != address(0));
        Organization organizationInstance = Organization(organization);
        // Ensure we are calling only our own organizations
        require(organizationInstance.index() == address(this));
        // solhint-disable-next-line avoid-low-level-calls
        (bool success,) = organization.call(data);
        require(success);
        emit OrganizationCalled(organization);
    }

    /**
     * @dev `transferOrganization` Allows to change ownership of
     * the organization contract. Emits OrganizationTransferred on success.
     * @param organization Organization's address
     * @param newManager Address to which the organization will belong after transfer.
     */
    function transferOrganization(address organization, address payable newManager) internal {
        // Ensure organization address is valid
        require(organization != address(0));
        // Ensure new manager is valid
        require(newManager != address(0));
        // Ensure we know about the organization at all
        require(organizationsIndex[organization] != uint(0));
        // Ensure that the caller is the organization's rightful owner
        // There may actually be a organization on index zero, that's why we use a double check
        require(organizationsByManager[msg.sender][organizationsByManagerIndex[organization]] != address(0));

        Organization organizationInstance = Organization(organization);
        // Ensure we are calling only our own organizations
        require(organizationInstance.index() == address(this));
        // Change ownership in the Organization contract
        organizationInstance.changeManager(newManager);

        // Detach from the old manager ...
        uint index = organizationsByManagerIndex[organization];
        delete organizationsByManager[msg.sender][index];
        // ... and attach to new manager
        organizationsByManagerIndex[organization] = organizationsByManager[newManager].length;
        organizationsByManager[newManager].push(organization);
        emit OrganizationTransferred(organization, msg.sender, newManager);
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
     * @dev `setLifToken` allows the owner of the contract to change the
     * address of the LifToken contract
     * @param _lifToken The new contract address
     */
    function setLifToken(address _lifToken) public onlyOwner {
        LifToken = _lifToken;
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
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address newOwner) public onlyOwner {
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

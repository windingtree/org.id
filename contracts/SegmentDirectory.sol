pragma solidity ^0.5.6;

import "zos-lib/contracts/Initializable.sol";
import "./Organization.sol";
import "./SegmentDirectoryEvents.sol";

/**
 * An abstract SegmentDirectory that can handle a list of organizations
 */
contract SegmentDirectory is Initializable, SegmentDirectoryEvents {

    // Array of addresses of `Organization` contracts
    address[] public organizations;

    // Mapping of organizations position in the general organization index
    mapping(address => uint) public organizationsIndex;

    // Mapping of organizations indexed by owner's address. Deprecated,
    // we cannot keep this consistent when organizations might change owners
    // at any time. Do not delete this field as it would break the zos
    // upgradeability.
    mapping(address => address[]) public organizationsByOwnerDeprecated;

    // Mapping of organizations position in the owner-indexed organization
    // index. Deprecated, we cannot keep this consistent when organizations
    // might change owners at any time. Do not delete this field as it would
    // break the zos upgradeability.
    mapping(address => uint) public organizationsByOwnerIndexDeprecated;

    // Address of the LifToken contract
    // solhint-disable-next-line var-name-mixedcase
    address public LifToken;

    // Address of the contract owner
    address _owner;

    /**
     * @dev `createOrganization` Create new organization contract. Does not 
     * register the organization in the directory. The created contract's
     * ownership is transferred to `msg.sender`.
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
     * @dev `registerOrganization` Register new organization in the directory.
     * Emits `OrganizationRegistered` on success.
     * @param  organization Organization's address
     * @return {" ": "Address of the organization."}
     */
    function registerOrganization(address organization) internal returns (address) {
        Organization org = Organization(organization);
        require(org.owner() == msg.sender, 'Only organization owner can register the organization');
        organizationsIndex[organization] = organizations.length;
        organizations.push(organization);
        emit OrganizationRegistered(
            organization,
            organizationsIndex[organization]
        );
        return organization;
    }

    /**
     * @dev `createAndRegisterOrganization` Creates and registers new organization
     * contract. Uses `createOrganization` and `registerOrganization` internally.
     * @param  dataUri Organization's data pointer
     * @return {" ": "Address of the new organization."}
     */
    function createAndRegisterOrganization(string memory dataUri) internal returns (address) {
        address newOrganizationAddress = createOrganization(dataUri);
        return registerOrganization(newOrganizationAddress);
    }

    /**
     * @dev `deregisterOrganization` Allows a owner to deregister an organization
     * from the directory. Does not destroy the organization contract.
     * Emits `OrganizationDeregistered` on success.
     * @param  organization  Organization's address
     */
    function deregisterOrganization(address organization) internal {
        // Ensure organization address is valid
        require(organization != address(0), 'Cannot remove organization on 0x0 address');
        // Ensure we know about the organization at all
        require(organizationsIndex[organization] != uint(0), 'Cannot remove unknown organization');
        // Ensure that the caller is the organization's rightful owner
        // Organization might have changed hands without the index taking notice
        Organization org = Organization(organization);
        require(org.owner() == msg.sender);
        uint allIndex = organizationsIndex[organization];
        delete organizations[allIndex];
        delete organizationsIndex[organization];
        emit OrganizationDeregistered(organization);
    }

    /**
     * @dev Initializer for upgradeable contracts.
     * @param __owner The address of the contract owner
     * @param _lifToken The new contract address
     */
    function initialize(address payable __owner, address _lifToken) public initializer {
        require(__owner != address(0), 'Cannot set owner to 0x0 address');
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
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == _owner);
        _;
    }

    /**
     * @dev `setLifToken` allows the owner of the contract to change the
     * address of the LifToken contract. Allows to set the address to
     * zero address
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
    function _transferOwnership(address payable newOwner) internal {
        require(newOwner != address(0));
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

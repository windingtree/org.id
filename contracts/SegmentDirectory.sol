pragma solidity ^0.5.6;

import "zos-lib/contracts/Initializable.sol";
import "openzeppelin-solidity/contracts/introspection/ERC165Checker.sol";
import "./OrganizationInterface.sol";
import "./Organization.sol";
import "./AbstractSegmentDirectory.sol";

/**
 * An abstract SegmentDirectory that can handle a list of organizations
 */
contract SegmentDirectory is Initializable, AbstractSegmentDirectory {

    // Array of addresses of `Organization` contracts
    address[] public _organizations;

    // Mapping of organizations position in the general organization index
    mapping(address => uint) public _organizationsIndex;

    // Address of the LifToken contract
    // solhint-disable-next-line var-name-mixedcase
    address public LifToken;

    // Address of the contract owner
    address _owner;

    /**
     * @dev `createOrganization` Create new organization contract. Does not 
     * add the organization in the directory. The created contract's
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
     * @dev `addOrganization` Add new organization in the directory.
     * Emits `OrganizationAdded` on success.
     * @param  organization Organization's address
     * @return {" ": "Address of the organization."}
     */
    function addOrganization(address organization) internal returns (address) {
        // this is intentionally not part of the state variables as we expect it to change in time.
        require(_organizationsIndex[organization] == 0, 'Cannot add organization twice');
        bytes4 _INTERFACE_ID_ORGANIZATION = 0xef209adb;
        require(
            ERC165Checker._supportsInterface(organization, _INTERFACE_ID_ORGANIZATION),
            'Organization has to support _INTERFACE_ID_ORGANIZATION'
        );
        OrganizationInterface org = OrganizationInterface(organization);
        require(org.owner() == msg.sender, 'Only organization owner can register the organization');
        _organizationsIndex[organization] = _organizations.length;
        _organizations.push(organization);
        emit OrganizationAdded(
            organization,
            _organizationsIndex[organization]
        );
        return organization;
    }

    /**
     * @dev `createAndAddOrganization` Creates and adds new organization
     * contract. Uses `createOrganization` and `addOrganization` internally.
     * @param  dataUri Organization's data pointer
     * @return {" ": "Address of the new organization."}
     */
    function createAndAddOrganization(string memory dataUri) internal returns (address) {
        address newOrganizationAddress = createOrganization(dataUri);
        return addOrganization(newOrganizationAddress);
    }

    /**
     * @dev `removeOrganization` Allows a owner to remove an organization
     * from the directory. Does not destroy the organization contract.
     * Emits `OrganizationRemoved` on success.
     * @param  organization  Organization's address
     */
    function removeOrganization(address organization) internal {
        // Ensure organization address is valid
        require(organization != address(0), 'Cannot remove organization on 0x0 address');
        // Ensure we know about the organization at all
        require(_organizationsIndex[organization] != uint(0), 'Cannot remove unknown organization');
        // Ensure that the caller is the organization's rightful owner
        // Organization might have changed hands without the index taking notice
        OrganizationInterface org = OrganizationInterface(organization);
        require(org.owner() == msg.sender);
        uint allIndex = _organizationsIndex[organization];
        delete _organizations[allIndex];
        delete _organizationsIndex[organization];
        emit OrganizationRemoved(organization);
    }

    /**
     * @dev `create` proxies and externalizes createOrganization
     * @param  dataUri Organization's data pointer
     * @return {" ": "Address of the new organization."}
     */
    function create(string calldata dataUri) external returns (address) {
        return createOrganization(dataUri);
    }

    /**
     * @dev `add` proxies and externalizes addOrganization
     * @param  organization Organization's address
     * @return {" ": "Address of the organization."}
     */
    function add(address organization) external returns (address) {
        return addOrganization(organization);
    }

    /**
     * @dev `createAndAdd` proxies and externalizes createAndAddOrganization
     * @param  dataUri Organization's data pointer
     * @return {" ": "Address of the new organization."}
     */
    function createAndAdd(string calldata dataUri) external returns (address) {
        return createAndAddOrganization(dataUri);
    }

    /**
     * @dev `remove` proxies and externalizes removeOrganization
     * @param  organization  Organization's address
     */
    function remove(address organization) external {
        return removeOrganization(organization);
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
        _organizations.length++;
    }

    /**
     * @dev `getOrganizationsLength` get the length of the `organizations` array
     * @return {" ": "Length of the organizations array. Might contain zero addresses."}
     */
    function getOrganizationsLength() public view returns (uint) {
        return _organizations.length;
    }

    /**
     * @dev `getOrganizations` get `organizations` array
     * @return {" ": "Array of organization addresses. Might contain zero addresses."}
     */
    function getOrganizations() public view returns (address[] memory) {
        return _organizations;
    }

    function organizationsIndex(address organization) public view returns (uint) {
        return _organizationsIndex[organization];
    }

    function organizations(uint index) public view returns (address) {
        return _organizations[index];
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

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }
}

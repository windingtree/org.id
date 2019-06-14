pragma solidity ^0.5.6;

import "zos-lib/contracts/Initializable.sol";
import "zos-lib/contracts/application/App.sol";

contract OrganizationFactory is Initializable {
    // ZeppelinOS App instance
    App internal app;

    // Address of the contract owner
    address _owner;

    // Array of addresses of created `Organization` contracts
    address[] _createdOrganizations;

    // Mapping of organizations position in the general created organization index
    mapping(address => uint) _createdOrganizationsIndex;

    /**
     * @dev Event triggered every time organization is added
     */
    event OrganizationCreated(address indexed organization);

    /**
     * @dev Event triggered when owner of the index is changed.
     */
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev `createOrganization` Create new organization upgradeable contract.
     * The created proxy's owner is **this Factory owner**.
     * The created Organizations's ownership is given to `msg.sender`.
     * This ownership design allows the factory owner to keep the implementation
     * safe whilst giving the data owner full control over their data.
     * Emits `OrganizationCreated` on success.
     * @param  orgJsonUri Organization's data pointer
     * @return {" ": "Address of the new organization."}
     */
    function createOrganization(string memory orgJsonUri) internal returns (address) {
        address newOrganizationAddress = address(
            app.create(
                "wt-contracts", 
                "Organization", 
                _owner, 
                abi.encodeWithSignature("initialize(address,string)", msg.sender, orgJsonUri)
            )
        );
        emit OrganizationCreated(newOrganizationAddress);
        return newOrganizationAddress;
    }

    /**
     * @dev `create` proxies and externalizes createOrganization
     * @param  orgJsonUri Organization's data pointer
     * @return {" ": "Address of the new organization."}
     */
    function create(string calldata orgJsonUri) external returns (address) {
        return createOrganization(orgJsonUri);
    }

    /**
     * @dev Initializer for upgradeable contracts.
     * @param __owner The address of the contract owner
     * @param _app ZeppelinOS App address
     */
    function initialize(address payable __owner, App _app) public initializer {
        require(__owner != address(0), 'Cannot set owner to 0x0 address');
        _owner = __owner;
        app = _app;
        _createdOrganizations.length++;
    }

    /**
     * @dev `getCreatedOrganizationsLength` get the length of the `createdOrganizations` array
     * @return {" ": "Length of the organizations array. Might contain zero addresses."}
     */
    function getCreatedOrganizationsLength() public view returns (uint) {
        return _createdOrganizations.length;
    }

    /**
     * @dev `getCreatedOrganizations` get `createdOrganizations` array
     * @return {" ": "Array of organization addresses. Might contain zero addresses."}
     */
    function getCreatedOrganizations() public view returns (address[] memory) {
        return _createdOrganizations;
    }

    /**
     * @dev `createdOrganizationsIndex` get index of Organization
     * @return {" ": "Organization index."}
     */
    function createdOrganizationsIndex(address organization) public view returns (uint) {
        return _createdOrganizationsIndex[organization];
    }

    /**
     * @dev `createdOrganizations` get Organization address on an index
     * @return {" ": "Organization address."}
     */
    function createdOrganizations(uint index) public view returns (address) {
        return _createdOrganizations[index];
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
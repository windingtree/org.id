pragma solidity ^0.5.6;

import "./AbstractOrganizationFactory.sol";
import "./AbstractSegmentDirectory.sol";
import "./Organization.sol";
import "zos-lib/contracts/Initializable.sol";
import "zos-lib/contracts/application/App.sol";

/**
 * @title OrganizationFactory
 *
 * @dev A factory contract that can create new instances of upgradeable
 * 0xORG smart contracts from the `Organization` blueprint published in
 * `wt-contracts` ZeppelinOS package.
 */
contract OrganizationFactory is Initializable, AbstractOrganizationFactory {
    // ZeppelinOS App instance
    App internal app;

    // Address of the contract owner
    address _owner;

    // Array of addresses of created `Organization` contracts. We need to keep
    // track of it because owner of this factory remains the Proxy Owner of
    // the created smart contracts and is the only account that can change
    // the implementation or transfer its ownership.
    address[] _createdOrganizations;

    // Mapping of organizations position in the general created organization index
    mapping(address => uint) _createdOrganizationsIndex;

    /**
     * @dev `createOrganization` Create new organization upgradeable contract.
     * The created proxy's owner is **this Factory owner**.
     * The created Organizations's ownership is given to `msg.sender`.
     * This ownership design allows the factory owner to keep the implementation
     * safe whilst giving the data owner full control over their data.
     *
     * See the reasoning on https://github.com/windingtree/wt-contracts/pull/241#issuecomment-501726595
     * 
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
        _createdOrganizationsIndex[newOrganizationAddress] = _createdOrganizations.length;
        _createdOrganizations.push(newOrganizationAddress);
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
     * @dev `createAndAddToDirectory` Creates the organization contract and tries to add it
     * to a SegmentDirectory living on the passed `directory` address.
     *
     * We cannot reuse create call due to the Organization ownership restrictions.
     * 
     * @param  orgJsonUri Organization's data pointer
     * @param  directory Segment directory's address
     * @return {" ": "Address of the new organization."}
     */
    function createAndAddToDirectory(string calldata orgJsonUri, address directory) external returns (address) {
        // TODO rewrite so that directory address gets known from entrypoint #248
        require(directory != address(0), 'Cannot use directory with 0x0 address');
        address newOrganizationAddress = address(
            app.create(
                "wt-contracts", 
                "Organization", 
                _owner, 
                abi.encodeWithSignature("initialize(address,string)", address(this), orgJsonUri)
            )
        );
        AbstractSegmentDirectory sd = AbstractSegmentDirectory(directory);
        sd.add(newOrganizationAddress);
        _createdOrganizationsIndex[newOrganizationAddress] = _createdOrganizations.length;
        _createdOrganizations.push(newOrganizationAddress);
        Organization o = Organization(newOrganizationAddress);
        o.transferOwnership(msg.sender);
        emit OrganizationCreated(newOrganizationAddress);
        return newOrganizationAddress;
    }

    /**
     * @dev Initializer for upgradeable contracts.
     * @param __owner The address of the contract owner
     * @param _app ZeppelinOS App address
     */
    function initialize(address payable __owner, App _app) public initializer {
        require(__owner != address(0), 'Cannot set owner to 0x0 address');
        require(address(_app) != address(0), 'Cannot set app to 0x0 address');
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
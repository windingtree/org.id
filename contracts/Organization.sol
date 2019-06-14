pragma solidity ^0.5.6;

import "openzeppelin-solidity/contracts/introspection/ERC165.sol";
import "./OrganizationInterface.sol";
import "zos-lib/contracts/Initializable.sol";

/**
 * @title Organization
 * @dev A contract that represents an Organization in the Winding Tree platform.
 */
contract Organization is OrganizationInterface, ERC165, Initializable {
    // Address of the contract owner
    address _owner;

    // Arbitrary locator of the off-chain stored Organization data
    // This might be an HTTPS resource, IPFS hash, Swarm address...
    // This is intentionally generic.
    string public orgJsonUri;

    // Number of a block when the Organization was created
    uint public created;

    // Index of registered delegate addresses. These can be used
    // to verify that signed data can be presented on behalf of this
    // organization.
    mapping(address => uint) public delegatesIndex;

    // List of delegate addresses. These addresses (i. e. public key
    // fingerprints) can be used to associate signed content with this
    // organization.
    address[] public delegates;

    /**
     * @dev Event triggered when owner of the organization is changed.
     */
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Event triggered when orgJsonUri of the organization is changed.
     */
    event OrgJsonUriChanged(string indexed previousOrgJsonUri, string indexed newOrgJsonUri);

    /**
     * @dev Event triggered when new delegate is added.
     */
    event DelegateAdded(address indexed delegate, uint index);

    /**
     * @dev Event triggered when a delegate is removed.
     */    
    event DelegateRemoved(address indexed delegate);

    /**
     * @dev Initializer for upgradeable contracts.
     * @param __owner The address of the contract owner
     * @param _orgJsonUri pointer to Organization data
     */
    function initialize(address payable __owner, string memory _orgJsonUri) public initializer {
        require(__owner != address(0), 'Cannot set owner to 0x0 address');
        require(bytes(_orgJsonUri).length != 0, 'orgJsonUri cannot be an empty string');
        emit OwnershipTransferred(_owner, __owner);
        _owner = __owner;        
        orgJsonUri = _orgJsonUri;
        created = block.number;
        delegates.length++;
        OrganizationInterface i;
        _registerInterface(0x01ffc9a7);//_INTERFACE_ID_ERC165
        _registerInterface(
            i.owner.selector ^
            i.getOrgJsonUri.selector ^
            i.hasDelegate.selector ^
            i.getDelegates.selector
            );
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == _owner);
        _;
    }

    /**
     * @dev `changeOrgJsonUri` Allows owner to change Organization's orgJsonUri.
     * @param  _orgJsonUri New orgJsonUri pointer of this Organization
     */
    function changeOrgJsonUri(string memory _orgJsonUri) public onlyOwner {
        bytes memory tempStringRepr = bytes(_orgJsonUri);
        require(tempStringRepr.length != 0, 'orgJsonUri cannot be an empty string');
        emit OrgJsonUriChanged(orgJsonUri, _orgJsonUri);
        orgJsonUri = _orgJsonUri;
    }

    /**
     * @dev Returns current orgJsonUri
     * @return {" ": "Current orgJsonUri."}
     */
    function getOrgJsonUri() external view returns (string memory) {
        return orgJsonUri;
    }

    /**
     * @dev Adds new delegate address. Only owner can call this.
     * @param addr Delegate's Ethereum address
     * @return {" ": "Address of the added delegate"}
     */
    function addDelegate(address addr) public onlyOwner returns(address) {
        require(addr != address(0), 'Cannot add delegate with 0x0 address');
        require(delegatesIndex[addr] == 0, 'Cannot add delegate twice');
        delegatesIndex[addr] = delegates.length;
        delegates.push(addr);
        emit DelegateAdded(addr, delegatesIndex[addr]);
        return addr;
    }

    /**
     * @dev Removes delegate address. Only owner can call this.
     * @param addr Delegate's Ethereum address
     */
    function removeDelegate(address addr) public onlyOwner {
        require(addr != address(0), 'Cannot remove delegate with 0x0 address');
        require(delegatesIndex[addr] != uint(0), 'Cannot remove unknown organization');
        delete delegates[delegatesIndex[addr]];
        delete delegatesIndex[addr];
        emit DelegateRemoved(addr);
    }

    /**
     * @dev Is an address considered a delegate for this organization?
     * @return {" ": "True if address is considered a delegate, false otherwise"}
     */
    function hasDelegate(address addr) external view returns(bool) {
        return delegates[delegatesIndex[addr]] != address(0);
    }

    /**
     * @dev Returns all delegates associated with this organization.
     * @return {" ": "List of delegates"}
     */
    function getDelegates() external view returns (address[] memory) {
        return delegates;
    }

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address payable newOwner) public onlyOwner {
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

pragma solidity ^0.5.6;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/introspection/ERC165.sol";
import "./OrganizationInterface.sol";

/**
 * @title Organization
 * @dev A contract that represents an Organization in the Winding Tree platform.
 */
contract Organization is OrganizationInterface, ERC165, Ownable {

    // Arbitrary locator of the off-chain stored Organization data
    // This might be an HTTPS resource, IPFS hash, Swarm address...
    // This is intentionally generic.
    string public dataUri;

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
     * @dev Event triggered when dataUri of the organization is changed.
     */
    event DataUriChanged(string indexed previousDataUri, string indexed newDataUri);

    /**
     * @dev Event triggered when new delegate is added.
     */
    event DelegateAdded(address indexed delegate, uint index);

    /**
     * @dev Event triggered when a delegate is removed.
     */    
    event DelegateRemoved(address indexed delegate);

    /**
     * @dev Constructor.
     * @param _dataUri pointer to Organization data
     */
    constructor(string memory _dataUri) public {
        require(bytes(_dataUri).length != 0, 'dataUri cannot be an empty string');
        dataUri = _dataUri;
        created = block.number;
        delegates.length++;
        OrganizationInterface i;
        _registerInterface(0x01ffc9a7);//_INTERFACE_ID_ERC165
        _registerInterface(i.owner.selector ^ i.getDataUri.selector ^ i.hasDelegate.selector);
    }

    /**
     * @dev `changeDataUri` Allows owner to change Organization's dataUri.
     * @param  _dataUri New dataUri pointer of this Organization
     */
    function changeDataUri(string memory _dataUri) public onlyOwner {
        bytes memory tempStringRepr = bytes(_dataUri);
        require(tempStringRepr.length != 0, 'dataUri cannot be an empty string');
        emit DataUriChanged(dataUri, _dataUri);
        dataUri = _dataUri;
    }

    /**
     * @dev Returns current dataUri
     * @return {" ": "Current dataUri."}
     */
    function getDataUri() external view returns (string memory) {
        return dataUri;
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
}

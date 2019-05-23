pragma solidity ^0.5.6;

/**
 * @title Organization
 * @dev A contract that represents an Organization in the WT network. We cannot use
 * zeppelin's Ownable, because we need the owner
 * field to be publicly readable.
 */
contract Organization {

    // Who owns this Organization contract and can manage it.
    address payable public owner;

    // Arbitrary locator of the off-chain stored Organization data
    // This might be an HTTPS resource, IPFS hash, Swarm address...
    // This is intentionally generic.
    string public dataUri;

    // Number of a block when the Organization was created
    uint public created;

    /**
     * @dev Event triggered when owner of the organization is changed.
     */
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Event triggered when dataUri of the organization is changed.
     */
    event DataUriChanged(string indexed previousDataUri, string indexed newDataUri);

    /**
     * @dev Constructor.
     * @param _dataUri pointer to Organization data
     */
    constructor(string memory _dataUri) public {
        require(bytes(_dataUri).length != 0);
        owner = msg.sender;
        dataUri = _dataUri;
        created = block.number;
        emit OwnershipTransferred(address(0), owner);
    }

    /**
     * Allows calling such methods only when msg.sender is equal
     * to previously set `owner` property.
     */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /**
     * @dev `changeDataUri` Allows owner to change Organization's dataUri.
     * @param  _dataUri New dataUri pointer of this Organization
     */
    function changeDataUri(string memory _dataUri) public onlyOwner {
        bytes memory tempStringRepr = bytes(_dataUri);
        require(tempStringRepr.length != 0);
        emit DataUriChanged(dataUri, _dataUri);
        dataUri = _dataUri;
    }

    /**
     * @dev `destroy` allows the owner to delete the Organization altogether.
     * All associated funds are transferred to the `owner`.
     */
    function destroy() public onlyOwner {
        selfdestruct(owner);
    }

    /**
     * @dev Allows owner to change Organization owner.
     * @param newOwner New owner's address
     */
    function transferOwnership(address payable newOwner) public onlyOwner {
        require(newOwner != address(0));
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

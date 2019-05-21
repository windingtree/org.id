pragma solidity ^0.5.6;

/**
 * @title Organization, contract for a Organization registered in the WT network
 * @dev A contract that represents a Organization in the WT network. We cannot use
 * zeppelin's Ownable, because we need the owner field to be public.
 */
contract Organization {

    // Who owns this Organization and can manage it.
    address payable public manager;

    // Arbitrary locator of the off-chain stored Organization data
    // This might be an HTTPS resource, IPFS hash, Swarm address...
    // This is intentionally generic.
    string public dataUri;

    // Number of block when the Organization was created
    uint public created;

    /**
     * @dev Event triggered when manager of the organization is changed.
     */
    event OwnershipTransferred(address indexed previousManager, address indexed newManager);

    event DataUriChanged(string indexed previousDataUri, string indexed newDataUri);

    /**
     * @dev Constructor.
     * @param _dataUri pointer to Organization data
     */
    constructor(string memory _dataUri) public {
        require(bytes(_dataUri).length != 0);
        manager = msg.sender;
        dataUri = _dataUri;
        created = block.number;
        emit OwnershipTransferred(address(0), manager);
    }

    /**
     * Allows calling such methods only when msg.sender is equal
     * to previously set index propert.y
     */
    modifier onlyManager() {
        require(msg.sender == manager);
        _;
    }

    /**
     * @dev `changeDataUri` Allows owner to change Organization's dataUri.
     * @param  _dataUri New dataUri pointer of this Organization
     */
    function changeDataUri(string memory _dataUri) public onlyManager {
        bytes memory tempStringRepr = bytes(_dataUri);
        require(tempStringRepr.length != 0);
        emit DataUriChanged(dataUri, _dataUri);
        dataUri = _dataUri;
    }

    /**
     * @dev `destroy` allows the owner to delete the Organization
     */
    function destroy() public onlyManager {
        selfdestruct(manager);
    }

    /**
     * @dev Allows owner to change Organization manager.
     * @param newManager New manager's address
     */
    function transferOwnership(address payable newManager) public onlyManager {
        require(newManager != address(0));
        emit OwnershipTransferred(manager, newManager);
        manager = newManager;
    }
}

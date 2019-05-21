pragma solidity ^0.5.6;

/**
 * @title Organization, contract for a Organization registered in the WT network
 * @dev A contract that represents a Organization in the WT network.
 */
// TODO try to switch to Ownable
contract Organization {

    // Who owns this Organization and can manage it.
    address payable public manager;

    // Arbitrary locator of the off-chain stored Organization data
    // This might be an HTTPS resource, IPFS hash, Swarm address...
    // This is intentionally generic.
    string public dataUri;

    // Number of block when the Organization was created
    uint public created;

    // WTOrganizationIndex address
    address public index;

    /**
     * @dev Event triggered when manager of the organization is changed.
     */
    event OwnershipTransferred(address indexed previousManager, address indexed newManager);

    event DataUriChanged(string indexed previousDataUri, string indexed newDataUri);

    /**
     * @dev Constructor.
     * @param _manager address of Organization owner
     * @param _dataUri pointer to Organization data
     * @param _index originating WTOrganizationIndex address
     */
    constructor(address payable _manager, string memory _dataUri, address _index) public {
        require(_manager != address(0));
        require(_index != address(0));
        require(bytes(_dataUri).length != 0);
        manager = _manager;
        index = _index;
        dataUri = _dataUri;
        created = block.number;
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

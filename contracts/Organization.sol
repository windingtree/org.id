pragma solidity ^0.5.6;

/**
 * @title Organization, contract for a Organization registered in the WT network
 * @dev A contract that represents a Organization in the WT network.
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

    // WTOrganizationIndex address
    address public index;

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
    modifier onlyFromIndex() {
        require(msg.sender == index);
        _;
    }

    /**
     * @dev `editInfo` Allows owner to change Organization's dataUri.
     * @param  _dataUri New dataUri pointer of this Organization
     */
    function editInfo(string memory _dataUri) public onlyFromIndex {
        require(bytes(_dataUri).length != 0);
        dataUri = _dataUri;
    }

    /**
     * @dev `destroy` allows the owner to delete the Organization
     */
    function destroy() public onlyFromIndex {
        selfdestruct(manager);
    }

    /**
     * @dev Allows owner to change Organization manager.
     * @param _newManager New manager's address
     */
    function changeManager(address payable _newManager) public onlyFromIndex {
        require(_newManager != address(0));
        manager = _newManager;
    }
}

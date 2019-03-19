pragma solidity ^0.5.6;


/**
 * @title AbstractHotel
 * @dev Interface of Hotel contract
 */
contract AbstractHotel {

    // Who owns this Hotel and can manage it.
    address payable public manager;

    // Arbitrary locator of the off-chain stored hotel data
    // This might be an HTTPS resource, IPFS hash, Swarm address...
    // This is intentionally generic.
    string public dataUri;

    // Number of block when the Hotel was created
    uint public created;

    // WTHotelIndex address
    address public index;

    /**
     * Allows calling such methods only when msg.sender is equal
     * to previously set index propert.y
     */
    modifier onlyFromIndex() {
        require(msg.sender == index);
        _;
    }

    /**
     * @dev `editInfo` Allows owner to change hotel's dataUri.
     * @param  _dataUri New dataUri pointer of this hotel
     */
    function editInfo(string memory _dataUri) public onlyFromIndex {
        _editInfoImpl(_dataUri);
    }

    /**
     * @dev `destroy` allows the owner to delete the Hotel
     */
    function destroy() public onlyFromIndex {
        _destroyImpl();
    }

    /**
     * @dev Allows owner to change hotel manager.
     * @param _newManager New manager's address
     */
    function changeManager(address payable _newManager) public onlyFromIndex {
        _changeManagerImpl(_newManager);
    }

    function _editInfoImpl(string memory _dataUri) internal;
    function _destroyImpl() internal;
    function _changeManagerImpl(address payable _newManager) internal;
}

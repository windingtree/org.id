pragma solidity ^0.4.25;


/**
 * @title AbstractAirline
 * @dev Interface of Airline contract
 */
contract AbstractAirline {

    // Who owns this Airline and can manage it.
    address public manager;

    // Arbitrary locator of the off-chain stored airline data
    // This might be an HTTPS resource, IPFS hash, Swarm address...
    // This is intentionally generic.
    string public dataUri;

    // Number of block when the Hotel was created
    uint public created;

    // WTAirlineIndex address
    address public index;

    /**
     * Allows calling such methods only when msg.sender is equal
     * to previously set index property.
     */
    modifier onlyFromIndex() {
        require(msg.sender == index);
        _;
    }

    /**
     * @dev `editInfo` Allows owner to change airline's dataUri.
     * @param  _dataUri New dataUri pointer of this hotel
     */
    function editInfo(string _dataUri) public onlyFromIndex {
        _editInfoImpl(_dataUri);
    }

    /**
     * @dev `destroy` allows the owner to delete the airline
     */
    function destroy() public onlyFromIndex {
        _destroyImpl();
    }

    /**
     * @dev Allows owner to change airline manager.
     * @param _newManager New manager's address
     */
    function changeManager(address _newManager) public onlyFromIndex {
        _changeManagerImpl(_newManager);
    }

    function _editInfoImpl(string _dataUri) internal;
    function _destroyImpl() internal;
    function _changeManagerImpl(address _newManager) internal;
}

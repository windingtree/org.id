pragma solidity ^0.4.25;

import "./AbstractAirline.sol";


/**
 * @title Airline, contract for an Airline registered in the WT network
 * @dev A contract that represents an airline in the WT network. Inherits
 * from WT's 'AbstractAirline'.
 */
contract Airline is AbstractAirline {

    bytes32 public contractType = bytes32("airline");

    /**
     * @dev Constructor.
     * @param _manager address of airline owner
     * @param _dataUri pointer to airline data
     * @param _index originating WTAirlineIndex address
     */
    constructor(address _manager, string _dataUri, address _index) public {
        require(_manager != address(0));
        require(_index != address(0));
        require(bytes(_dataUri).length != 0);
        manager = _manager;
        index = _index;
        dataUri = _dataUri;
        created = block.number;
    }

    function _editInfoImpl(string _dataUri) internal {
        require(bytes(_dataUri).length != 0);
        dataUri = _dataUri;
    }

    function _destroyImpl() internal {
        selfdestruct(manager);
    }

    function _changeManagerImpl(address _newManager) internal {
        require(_newManager != address(0));
        manager = _newManager;
    }
}

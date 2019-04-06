pragma solidity ^0.5.6;

import "./AbstractHotel.sol";


/**
 * @title Hotel, contract for a Hotel registered in the WT network
 * @dev A contract that represents a hotel in the WT network.
 */
contract Hotel is AbstractHotel {

    /**
     * @dev Constructor.
     * @param _manager address of hotel owner
     * @param _dataUri pointer to hotel data
     * @param _index originating WTHotelIndex address
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

    function _editInfoImpl(string memory _dataUri) internal {
        require(bytes(_dataUri).length != 0);
        dataUri = _dataUri;
    }

    function _destroyImpl() internal {
        selfdestruct(manager);
    }

    function _changeManagerImpl(address payable _newManager) internal {
        require(_newManager != address(0));
        manager = _newManager;
    }

}

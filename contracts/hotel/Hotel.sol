pragma solidity ^0.4.24;

import "./AbstractHotel.sol";

/**
 * @title Hotel, contract for a Hotel registered in the WT network
 * @dev A contract that represents a hotel in the WT network. Inherits
 * from WT's 'AbstractHotel'.
 */
contract Hotel is AbstractHotel {

  bytes32 public contractType = bytes32("hotel");

  /**
   * @dev Constructor.
   * @param _manager address of hotel owner
   * @param _dataUri pointer to hotel data
   * @param _index originating WTIndex address
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

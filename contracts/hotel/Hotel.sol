pragma solidity ^0.4.24;

import "./AbstractHotel.sol";

/**
 * @title Hotel, contract for a Hotel registered in the WT network
 * @dev A contract that represents a hotel in the WT network. Inherits
 * from OpenZeppelin's `Ownable` and WT's 'AbstractBaseContract'.
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
    owner = _manager;
    index = _index;
    dataUri = _dataUri;
    created = block.number;
  }

  function _editInfoImpl(string _dataUri) internal {
    require(bytes(_dataUri).length != 0);
    dataUri = _dataUri;
  }

  /**
   * @dev `destroy` allows the owner to delete the Hotel
   */
  function destroy() onlyFromIndex public {
    selfdestruct(owner);
  }

}

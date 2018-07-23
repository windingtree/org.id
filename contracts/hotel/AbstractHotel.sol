pragma solidity ^0.4.24;

import "../AbstractBaseContract.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title AbstractHotel
 * @dev Interface of Hotel contract, inherits
 * from OpenZeppelin's `Ownable` and WT's 'AbstractBaseContract'.
 */
contract AbstractHotel is Ownable, AbstractBaseContract {

  // Arbitrary locator of the off-chain stored hotel data
  // This might be an HTTPS resource, IPFS hash, Swarm address...
  // This is intentionally generic.
  string public dataUri;
  // Number of block when the Hotel was created
  uint public created;

  // WTIndex address
  address public index;

  /**
   * Allows calling such methods only when msg.sender is equal
   * to previously set index propert.y
   */
  modifier onlyFromIndex() {
    require(msg.sender == index);
    _;
  }


  function _editInfoImpl(string _dataUri) internal;

  /**
   * @dev `editInfo` Allows owner to change hotel's dataUri.
   * @param  _dataUri New dataUri pointer of this hotel
   */
  function editInfo(string _dataUri) onlyFromIndex public {
    _editInfoImpl(_dataUri);
  }
}

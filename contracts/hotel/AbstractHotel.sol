pragma solidity ^0.4.24;

import "../AbstractBaseContract.sol";
import "openzeppelin-solidity/contracts/lifecycle/Destructible.sol";

/**
 * @title AbstractHotel
 * @dev Interface of Hotel contract, inherits
 * from OpenZeppelin's `Destructible` and WT's 'AbstractBaseContract'.
 */
contract AbstractHotel is Destructible, AbstractBaseContract {

  // Who owns this Hotel and can manage it.
  address public manager;
  // Arbitrary locator of the off-chain stored hotel data
  // This might be an HTTPS resource, IPFS hash, Swarm address...
  // This is intentionally generic.
  string public dataUri;
  // Number of block when the Hotel was created
  uint public created;


  function _editInfoImpl(string _dataUri) internal;

  /**
   * @dev `editInfo` Allows manager to change hotel's dataUri.
   * @param  _dataUri New dataUri pointer of this hotel
   */
  function editInfo(string _dataUri) onlyOwner public {
    _editInfoImpl(_dataUri);
  }
}

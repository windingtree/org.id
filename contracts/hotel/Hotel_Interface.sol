pragma solidity ^0.4.18;

import "../Base_Interface.sol";
import "zeppelin-solidity/contracts/lifecycle/Destructible.sol";

/**
 * @title Hotel_Interface
 * @dev Interface of Hotel contract, inherits
 * from OpenZeppelin's `Destructible` and WT's 'Base_Interface'.
 */
contract Hotel_Interface is Destructible, Base_Interface {

  // Who owns this Hotel and can manage it.
  address public manager;
  // Arbitrary locator of the off-chain stored hotel data
  // This might be an HTTPS resource, IPFS hash, Swarm address...
  // This is intentionally generic.
  string public url;
  // Number of block when the Hotel was created
  uint public created;

  /**
   * @dev `editInfo` Allows manager to change hotel's url.
   * @param  _url New url pointer of this hotel
   */
  function editInfo(string _url) onlyOwner() public;
}

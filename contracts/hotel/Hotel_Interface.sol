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
  // Hex-encoded customer identifier. This can be used
  // as a reference when someone does not know the hotel's address.
  // It makes sense to use some form of hash (keccak256 for example)
  // to ensure that the id fits bytes32.
  bytes32 public customIdHash;
  // Number of block when the Hotel was created
  uint public created;

  /**
   * @dev `editInfo` Allows manager to change hotel's url and customIdHash. If only
   * one of these values changed, pass the old value as well.
   * @param  _url New url pointer of this hotel
   * @param  _customIdHash new customIdHash
   */
  function editInfo(string _url, bytes32 _customIdHash) onlyOwner() public;
}

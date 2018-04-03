pragma solidity ^0.4.18;

import "../Index_Interface.sol";
import "../Base_Interface.sol";
import "zeppelin-solidity/contracts/lifecycle/Destructible.sol";
import "zeppelin-solidity/contracts/token/ERC20/ERC20.sol";

/**
 * @title Hotel, contract for a Hotel registered in the WT network
 * @dev A contract that represents a hotel in the WT network. Inherits
 * from OpenZeppelin's `Destructible` and WT's 'Base_Interface'.
 */
contract Hotel is Destructible, Base_Interface {

  bytes32 public contractType = bytes32("hotel");

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
   * @dev Constructor.
   * @param _manager address of hotel owner
   * @param _url pointer to hotel data
   * @param _customIdHash custom hotel identifier's hash
   */
  function Hotel(address _manager, string _url, bytes32 _customIdHash) public {
    require(_manager != address(0));
    require(bytes(_url).length != 0);
    manager = _manager;
    url = _url;
    customIdHash = _customIdHash;
    created = block.number;
  }

  /**
   * @dev `editInfo` Allows manager to change hotel's url and customIdHash. If only
   * one of these values changed, pass the old value as well.
   * @param  _url New url pointer of this hotel
   * @param  _customIdHash new customIdHash
   */
  function editInfo(string _url, bytes32 _customIdHash) onlyOwner() public {
    require(bytes(_url).length != 0);
    url = _url;
    customIdHash = _customIdHash;
  }


  /**
   * @dev `destroy` allows the owner to delete the Hotel
   */
  function destroy() onlyOwner() public {
    super.destroyAndSend(tx.origin);
  }

}

pragma solidity ^0.4.18;

import "../Index_Interface.sol";
import "../Base_Interface.sol";
import "zeppelin-solidity/contracts/lifecycle/Destructible.sol";
import "zeppelin-solidity/contracts/token/ERC20/ERC20.sol";

/**
   @title Hotel, contract for a Hotel registered in the WT network

   A contract that represents a hotel in the WT network.

   Inherits from OpenZeppelin's `Destructible` and WT's 'Base_Interface'.
 */
contract Hotel is Destructible, Base_Interface {

  bytes32 public contractType = bytes32("hotel");

  // Who owns this Hotel and can manage it.
  address public manager;
  // Arbitrary locator of the off-chain stored hotel data
  // This might be an HTTPS resource, IPFS hash, Swarm address...
  // This is intentionally generic
  string public url;
  // keccak256 hash of the customer identifier. This can be used
  // as a reference when someone does not know the hotel's address.
  // It is the responsibility of contract users to derive the hash
  // in a repeatable and well-documented way
  bytes32 public customIdHash;
  // Number of block when Hotel was created
  uint public created;

  /**
     @dev Constructor.

     @param _manager see `manager`
     @param _url see `url`
     @param _customIdHash see `customIdHash`
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
     @dev `editInfo` allows the owner of the contract to change the hotel's
     main information

     @param _url see `url`
     @param _customIdHash see `customIdHash`
   */
  function editInfo(string _url, bytes32 _customIdHash) onlyOwner() public {
    //require(_url.length != 0);
    //require(_customIdHash.length != 0);
    url = _url;
    customIdHash = _customIdHash;
  }


  /**
    @dev 'destroy' allows the owner to delete the Hotel and all of its Units
    and UnitTypes
  */
  function destroy() onlyOwner() public {
    super.destroyAndSend(tx.origin);
  }

}

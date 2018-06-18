pragma solidity ^0.4.18;

import "../WTIndex_Interface.sol";
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
  string public dataUri;
  // Number of block when the Hotel was created
  uint public created;

  /**
   * @dev Constructor.
   * @param _manager address of hotel owner
   * @param _dataUri pointer to hotel data
   */
  function Hotel(address _manager, string _dataUri) public {
    require(_manager != address(0));
    require(bytes(_dataUri).length != 0);
    manager = _manager;
    dataUri = _dataUri;
    created = block.number;
  }

  /**
   * @dev `editInfo` Allows manager to change hotel's dataUri.
   * @param  _dataUri New dataUri pointer of this hotel
   */
  function editInfo(string _dataUri) onlyOwner() public {
    require(bytes(_dataUri).length != 0);
    dataUri = _dataUri;
  }


  /**
   * @dev `destroy` allows the owner to delete the Hotel
   */
  function destroy() onlyOwner() public {
    super.destroyAndSend(tx.origin);
  }

}

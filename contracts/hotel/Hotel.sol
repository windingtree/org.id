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

  // Main information
  address public manager;
  uint public created;

  string public name;
  string public description;


  /**
     @dev Constructor.

     @param _name see `name`
     @param _description see `description`
     @param _manager see `_manager`
   */
  function Hotel(string _name, string _description, address _manager) public {
    manager = _manager;
    name = _name;
    description = _description;
    created = block.number;
  }

  /**
     @dev `editInfo` allows the owner of the contract to change the hotel's
     main information

     @param _name The new name of the hotel
     @param _description The new description of the hotel
   */
  function editInfo(
    string _name,
    string _description
  ) onlyOwner() public {
     name = _name;
     description = _description;
  }


  /**
    @dev 'destroy' allows the owner to delete the Hotel and all of its Units
    and UnitTypes
  */
  function destroy() onlyOwner() public {
    super.destroyAndSend(tx.origin);
  }

}

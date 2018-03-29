pragma solidity ^0.4.18;

import "../Base_Interface.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

/*
 * Hotel_Interface
 * Interface of Hotel contract
 */
contract Hotel_Interface is Ownable, Base_Interface {

  // Main information
  address public manager;
  uint public created;

  string public name;
  string public description;

  function editInfo(string _name, string _description) onlyOwner() public;
}

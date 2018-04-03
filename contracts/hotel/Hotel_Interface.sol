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

  string public url;
  bytes32 public customIdHash;

  function editInfo(string _url, bytes32 _customIdHash) onlyOwner() public;
}

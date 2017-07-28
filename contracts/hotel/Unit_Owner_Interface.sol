pragma solidity ^0.4.11;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

/*
 * Unit_Owner_Interface
 * Owner interface of Unit contract
 */
contract Unit_Owner_Interface is Ownable {

  // Owner methods
  function setActive(bool _active) onlyOwner();
  function setPrice(string price, uint fromDay, uint daysAmount) onlyOwner();

}

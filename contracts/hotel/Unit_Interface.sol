pragma solidity ^0.4.15;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

/*
 * Unit_Interface
 * Interface of Unit contract
 */
contract Unit_Interface is Ownable {

  bool public active;
  bytes32 public unitType;

  event Book(address from, uint fromDay, uint daysAmount);

  // Public methods
  function getReservation(uint day) constant returns(string, address);

  // Owner methods
  function setActive(bool _active) onlyOwner();
  function setPrice(string price, uint fromDay, uint daysAmount) onlyOwner();
  function book(address from, uint fromDay, uint daysAmount) onlyOwner() returns(bool);

}

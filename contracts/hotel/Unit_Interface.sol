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
  function getPrice(uint fromDay, uint daysAmount) constant returns(uint256);

  // Owner methods
  function setActive(bool _active) onlyOwner();
  function setDateTime(address _date) onlyOwner();
  function setSpecialPrice(string price, uint fromDay, uint daysAmount) onlyOwner();
  function setDefaultLifTokenPrice(uint256 price) onlyOwner();
  function book(address from, uint fromDay, uint fromDayTimestamp, uint daysAmount) onlyOwner() returns(bool);

}

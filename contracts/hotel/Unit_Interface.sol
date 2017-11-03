pragma solidity ^0.4.15;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

/*
 * Unit_Interface
 * Interface of Unit contract
 */
contract Unit_Interface is Ownable {

  // Main Information
  bool public active;
  bytes32 public unitType;
  uint256 public defaultLifTokenPrice;

  // Events
  event Book(address from, uint fromDay, uint daysAmount);

  // Owner methods
  function setActive(bool _active) onlyOwner();
  function setCurrencyCode(bytes8 _currencyCode) onlyOwner();
  function setSpecialPrice(uint256 price, uint256 fromDay, uint256 daysAmount) onlyOwner();
  function setSpecialLifPrice(uint256 price, uint256 fromDay, uint256 daysAmount) onlyOwner();
  function setDefaultPrice(uint256 price) onlyOwner();
  function setDefaultLifPrice(uint256 price) onlyOwner();
  function book(address from, uint256 fromDay, uint256 daysAmount) onlyOwner() returns(bool);

  // Public methods
  function getReservation(uint256 day) constant returns(uint256, uint256, address);
  function getCost(uint256 fromDay, uint256 daysAmount) constant returns(uint256);
  function getLifCost(uint256 fromDay, uint256 daysAmount) constant returns(uint256);

}

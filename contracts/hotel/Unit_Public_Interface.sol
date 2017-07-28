pragma solidity ^0.4.11;

/*
 * Unit_Public_Interface
 * Public interface of Unit contract
 */
contract Unit_Public_Interface {

  bool public active;
  bytes32 public unitType;

  event Book(address from, uint fromDay, uint daysAmount);

  // Public methods
  function getReservation(uint day) constant returns(string, address);

}

pragma solidity ^0.4.11;

import "../PrivateCall.sol";

/*
 * UnitType_Public_Interface
 * Public interface of UnitType contract
 */
contract UnitType_Public_Interface is PrivateCall {

  bool public active;
  bytes32 public unitType;
  uint public totalUnits;

  event Book(address from, uint unitIndex, uint fromDay, uint daysAmount);

  // Methods from private call
  function book( address from, uint unitIndex, uint fromDay, uint daysAmount ) fromSelf();

  // Public methods
  function getUnit(uint unitIndex) constant returns(string, string, uint, uint, string, bool);
  function getAmenities(uint unitIndex) constant returns(uint[]);
  function getReservation( uint unitIndex, uint day ) constant returns(string, address);
  function getImage(uint unitIndex, uint i) constant returns (string); 
  function getImagesLength(uint unitIndex) constant returns (uint);

}

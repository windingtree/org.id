pragma solidity ^0.4.15;

/*
 * UnitType_Public_Interface
 * Public interface of UnitType contract
 */
contract UnitType_Public_Interface {

  bytes32 public unitType;
  uint public totalUnits;

  // Public methods
  function getInfo() constant returns(string, uint, uint, string, bool);
  function getAmenities() constant returns(uint[]);
  function getImage(uint i) constant returns (string);
  function getImagesLength() constant returns (uint);

}

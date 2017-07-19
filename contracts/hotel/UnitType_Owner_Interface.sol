pragma solidity ^0.4.11;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

/*
 * UnitType_Owner_Interface
 * Owner interface of UnitType contract
 */
contract UnitType_Owner_Interface is Ownable {

  bool public active;
  bytes32 public unitType;
  uint public totalUnits;

  event Book(address from, uint unitIndex, uint fromDay, uint daysAmount);

  // Owner methods
  function addUnit() onlyOwner();
  function edit(string description, uint minGuests, uint maxGuests, string price) onlyOwner();
  function active(bool _active) onlyOwner();
  function unitActive(uint unitIndex, bool _active) onlyOwner();
  function setPrice(string price, uint unitIndex, uint fromDay, uint daysAmount) onlyOwner();
  function addAmenity(uint amenity) onlyOwner();
  function removeAmenity( uint amenity) onlyOwner();
  function addImage(string url) onlyOwner();
  function removeImage(uint imageIndex) onlyOwner();
  function removeUnit(uint unitIndex) onlyOwner();

  // Public methods
  function getInfo() constant returns(string, uint, uint, string, bool);
  function getUnit(uint unitIndex) constant returns(bool);
  function getAmenities() constant returns(uint[]);
  function getReservation( uint unitIndex, uint day ) constant returns(string, address);
  function getImage(uint i) constant returns (string);
  function getImagesLength() constant returns (uint);

}

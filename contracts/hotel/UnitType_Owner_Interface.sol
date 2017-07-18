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
  function addUnit(string name, string description, uint minGuests, uint maxGuests, string price) onlyOwner();
  function editUnit(uint unitIndex, string name, string description, uint minGuests, uint maxGuests, string price) onlyOwner();
  function active(bool _active) onlyOwner();
  function unitActive(uint unitIndex, bool _active) onlyOwner();
  function setPrice(string price, uint unitIndex, uint fromDay, uint daysAmount) onlyOwner();
  function addAmenity(uint unitIndex, uint amenity) onlyOwner();
  function removeAmenity(uint unitIndex, uint amenity) onlyOwner();
  function addImage(uint unitIndex, string url) onlyOwner();
  function removeImage(uint unitIndex, uint imageIndex) onlyOwner();
  function removeUnit(uint unitIndex) onlyOwner();

  // Public methods
  function getUnit(uint unitIndex) constant returns(string, string, uint, uint, string, bool);
  function getAmenities(uint unitIndex) constant returns(uint[]);
  function getReservation(uint unitIndex, uint day) constant returns(string, address);

}

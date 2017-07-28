pragma solidity ^0.4.11;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

/*
 * UnitType_Owner_Interface
 * Owner interface of UnitType contract
 */
contract UnitType_Owner_Interface is Ownable {

  // Owner methods
  function edit(string description, uint minGuests, uint maxGuests, string price) onlyOwner();
  function addAmenity(uint amenity) onlyOwner();
  function removeAmenity( uint amenity) onlyOwner();
  function addImage(string url) onlyOwner();
  function removeImage(uint imageIndex) onlyOwner();
  function removeUnit(uint unitIndex) onlyOwner();
  function increaseUnits() onlyOwner();
  function decreaseUnits() onlyOwner();

}

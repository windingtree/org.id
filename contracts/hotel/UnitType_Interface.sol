pragma solidity ^0.4.15;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "../Images.sol";

/*
 * UnitType_Interface
 * Interface of UnitType contract
 */
contract UnitType_Interface is Ownable, Images {

  // Main information
  bytes32 public unitType;
  uint public totalUnits;

  // Owner methods
  function edit(string description, uint minGuests, uint maxGuests, string price) onlyOwner();
  function addAmenity(uint amenity) onlyOwner();
  function removeAmenity( uint amenity) onlyOwner();
  function removeUnit(uint unitIndex) onlyOwner();
  function increaseUnits() onlyOwner();
  function decreaseUnits() onlyOwner();

  // Public methods
  function getInfo() constant returns(string, uint, uint, string, bool);
  function getAmenities() constant returns(uint[]);

}

pragma solidity ^0.4.18;

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

  // The default price for the UnitType in LifTokens
  uint256 public defaultLifPrice;

  // Default price in custom currency (10000 = 100.00)
  uint256 public defaultPrice;

  // Currency code for the custom price
  bytes8 public currencyCode;

  // Owner methods
  function edit(string description, uint minGuests, uint maxGuests) onlyOwner();
  function addAmenity(uint amenity) onlyOwner();
  function removeAmenity( uint amenity) onlyOwner();
  function removeUnit(uint unitIndex) onlyOwner();
  function increaseUnits() onlyOwner();
  function decreaseUnits() onlyOwner();
  function setCurrencyCode(bytes8 _currencyCode) onlyOwner();
  function setDefaultPrice(uint256 price) onlyOwner();
  function setDefaultLifPrice(uint256 price) onlyOwner();

  // Public methods
  function getInfo() constant returns(string, uint, uint, string, bool);
  function getAmenities() constant returns(uint[]);

}

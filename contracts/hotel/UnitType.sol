pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "../Images.sol";

 /**
   @title UnitType, contract for a unit type in a hotel

   A type of unit that a Hotel has in their inventory. Stores the
   total number of units, description, min/max guests, price, amenities and
   images.

   Inherits from OpenZeppelin's `Ownable` and WT's 'Images'.
 */
contract UnitType is Ownable, Images {

  bytes32 public version = bytes32("0.0.1-alpha");
  bytes32 public contractType = bytes32("unittype");

  // The name of the unit type
  bytes32 public unitType;

  // The total amount of units of this type
  uint public totalUnits;

  // The description of the unit type
  string description;

  // The minimun and maximun amount of guests
  uint minGuests;
  uint maxGuests;

  // The price of the unit
  string price;

  // The amenities in the unit type, represented by uints
  uint[] amenities;
  mapping(uint => uint) amenitiesIndex;

  /**
     @dev Constructor.

     @param _owner see `owner`
     @param _unitType see `unitType`
   */
  function UnitType(address _owner, bytes32 _unitType){
    owner = _owner;
    unitType = _unitType;
  }

  /**
     @dev `edit` allows the owner of the contract to change the description,
     min/max guests and base price

     @param _price The base price of the unit
     @param _minGuests The minimun amount of guests allowed
     @param _maxGuests The maximun amount of guests allowed
     @param _description The new description
   */
  function edit(
    string _description,
    uint _minGuests,
    uint _maxGuests,
    string _price
  ) onlyOwner() {
    description = _description;
    minGuests = _minGuests;
    maxGuests = _maxGuests;
    price = _price;
  }

  /**
     @dev `increaseUnits` allows the owner to increase the `totalUnits`
   */
  function increaseUnits() onlyOwner() {
    totalUnits ++;
  }

  /**
     @dev `decreaseUnits` allows the owner to decrease the `totalUnits`
   */
  function decreaseUnits() onlyOwner() {
    totalUnits --;
  }

  /**
     @dev `addAmenity` allows the owner to add an amenity.

     @param amenityId The id of the amenity to add
   */
  function addAmenity(uint amenityId) onlyOwner() {
    amenitiesIndex[amenityId] = amenities.length;
    amenities.push(amenityId);
  }

  /**
     @dev `removeAmenity` allows the owner to remove an amenity

     @param amenityId The id of the amenity in the amenitiesIndex array
   */
  function removeAmenity(uint amenityId) onlyOwner() {
    delete amenities[ amenitiesIndex[amenityId] ];
    amenitiesIndex[amenityId] = 0;
  }

  /**
     @dev `GetInfo` get the information of the unit

     @return string The description of the unit type
     @return uint The minimun amount guests
     @return uint The maximun amount guests
     @return string The base price
   */
  function getInfo() constant returns(string, uint, uint, string) {
    return (description, minGuests, maxGuests, price);
  }

  /**
     @dev `getAmenities` get the amenities ids

     @return uint[] Array of all the amenities ids in the unit type
   */
  function getAmenities() constant returns(uint[]) {
    return (amenities);
  }

}

pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/lifecycle/Destructible.sol";
import "../Images.sol";

 /**
   @title UnitType, contract for a unit type in a hotel

   A type of unit that a Hotel has in their inventory. Stores the
   total number of units, description, min/max guests, price, amenities and
   images.

   Inherits from OpenZeppelin's `Destructible` and WT's 'Images'.
 */
contract UnitType is Destructible, Images {

  bytes32 public version = bytes32("0.0.1-alpha");
  bytes32 public contractType = bytes32("unittype");

  // The name of the unit type
  bytes32 public unitType;

  // The total amount of units of this type
  uint public totalUnits;

  // The description of the unit type
  string description;

  // The minimun and maximum amount of guests
  uint minGuests;
  uint maxGuests;

  // The default price for the UnitType in Lif
  uint256 public defaultLifPrice;

  // Default price in custom currency (10000 = 100.00)
  uint256 public defaultPrice;

  // Currency code for the custom price
  bytes8 public currencyCode;

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

     @param _minGuests The minimun amount of guests allowed
     @param _maxGuests The maximum amount of guests allowed
     @param _description The new description
   */
  function edit(
    string _description,
    uint _minGuests,
    uint _maxGuests
  ) onlyOwner() {
    description = _description;
    minGuests = _minGuests;
    maxGuests = _maxGuests;
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
     @dev `setCurrencyCode` allows the owner of the contract to set which
     currency other than Líf the UnitType is priced in

     @param _currencyCode The hex value of the currency code
   */
  function setCurrencyCode(bytes8 _currencyCode) onlyOwner() {
    currencyCode = _currencyCode;
  }

  /**
     @dev `setDefaultPrice` allows the owner of the contract to set the default
     price in the custom currency for reserving the UnitType for 1 day

     @param price The new default price
   */
  function setDefaultPrice(uint256 price) onlyOwner() {
    defaultPrice = price;
  }

  /**
     @dev `setDefaultLifPrice` allows the owner of the contract to set the default
     price in Lif for reserving the UnitType for 1 day

     @param price The new default Lif price
   */
  function setDefaultLifPrice(uint256 price) onlyOwner() {
    defaultLifPrice = price;
  }

  /**
     @dev `GetInfo` get the information of the unit

     @return {
      "_description": "The description of the unit type",
      "_minGuests": "The minimun amount guests",
      "_maxGuests": "The maximum amount guests",
      "_defaultPrice": "The default fiat price"
    }
   */
  function getInfo() constant returns(string _description, uint _minGuests, uint _maxGuests, uint _defaultPrice) {
    return (description, minGuests, maxGuests, defaultPrice);
  }

  /**
     @dev `getAmenities` get the amenities ids

     @return {"_amenities": "Array of all the amenities ids in the unit type" }
   */
  function getAmenities() constant returns(uint[] _amenities) {
    return (amenities);
  }

}

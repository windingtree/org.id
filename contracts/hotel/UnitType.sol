pragma solidity ^0.4.15;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

 /**
   @title UnitType, contract for a unit type in a hotel

   A type of unit that a Hotel has in their inventory, it stores the
   total of units, description, min/max guests, price, amenities and
   images.

   Uses Ownable contract developed by open-zeppelin.
 */
contract UnitType is Ownable {

  // The name on the unit type
  bytes32 public unitType;

  // The total amount of units
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

  // The urls of the images of the unit type
  string[] images;

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
     min/max guests and base price.

     @param _price The base price of the unit.
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
     @dev `increaseUnits` allows the owner to increase the totalUnits
   */
  function increaseUnits() onlyOwner() {
    totalUnits ++;
  }

  /**
     @dev `decreaseUnits` allows the owner to decrease the totalUnits
   */
  function decreaseUnits() onlyOwner() {
    totalUnits --;
  }

  /**
     @dev `addImage` allows the owner to add an image.

     @param url The url of the image
   */
  function addImage(string url) onlyOwner() {
    images.push(url);
  }

  /**
     @dev `removeImage` allows the owner to remove an image.

     @param index The index of the image in the images array
   */
  function removeImage(uint imageIndex) onlyOwner() {
    delete images[imageIndex];
  }

  /**
     @dev `addAmenity` allows the owner to add an amenity.

     @param index The uint of the amenity to add
   */
  function addAmenity(uint amenity) onlyOwner() {
    amenitiesIndex[amenity] = amenities.length;
    amenities.push(amenity);
  }

  /**
     @dev `removeAmenity` allows the owner to remove an amenity.

     @param index The index of the amenity in the amenitiesIndex array
   */
  function removeAmenity(uint amenity) onlyOwner() {
    delete amenities[ amenitiesIndex[amenity] ];
    amenitiesIndex[amenity] = 0;
  }

  /**
     @dev `GetInfo` get the information of the unit.

     @return string The description of the unit type
     @return uint The minimun amount guests
     @return uint The maximun amount guests
     @return string The base price
   */
  function getInfo() constant returns(string, uint, uint, string) {
    return (description, minGuests, maxGuests, price);
  }

  /**
     @dev `getAmenities` get the amenities ids.

     @return uint[] Array of all the amenities ids in the unit type
   */
  function getAmenities() constant returns(uint[]) {
    return (amenities);
  }

  /**
     @dev `getImage` get the url of an image.

     @param i The index of the image in the images array

     @return string Url of the image
   */
  function getImage(uint i) constant returns (string) {
    return images[i];
  }

  /**
     @dev `getImagesLength` get the length of the images array.

     @return uint Length of the images array
   */
  function getImagesLength() constant returns (uint) {
    return images.length;
  }

}

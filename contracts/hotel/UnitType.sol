pragma solidity ^0.4.11;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

/*
 * UnitType
 * A type of unit that a Hotel has in his inventory, with all the units
 * information and avaliability.
 */
contract UnitType is Ownable {

  bytes32 public unitType;
  uint public totalUnits;
  string description;
  uint minGuests;
  uint maxGuests;
  string price;
  uint[] amenities;
  mapping(uint => uint) amenitiesIndex;
  string[] images;

  // Constructor

  function UnitType(address _owner, bytes32 _unitType){
    owner = _owner;
    unitType = _unitType;
  }

  // Owner methods

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

  function increaseUnits() onlyOwner() {
    totalUnits ++;
  }

  function decreaseUnits() onlyOwner() {
    totalUnits --;
  }

  function addImage(string url) onlyOwner() {
    images.push(url);
  }

  function removeImage(uint imageIndex) onlyOwner() {
    delete images[imageIndex];
  }

  function addAmenity(uint amenity) onlyOwner() {
    amenitiesIndex[amenity] = amenities.length;
    amenities.push(amenity);
  }

  function removeAmenity(uint amenity) onlyOwner() {
    delete amenities[ amenitiesIndex[amenity] ];
    amenitiesIndex[amenity] = 0;
  }

  // Public methods

  function getInfo() constant returns(string, uint, uint, string) {
    return (description, minGuests, maxGuests, price);
  }

  function getAmenities() constant returns(uint[]) {
    return (amenities);
  }

  function getImage(uint i) constant returns (string) {
    return images[i];
  }

  function getImagesLength() constant returns (uint) {
    return images.length;
  }

}

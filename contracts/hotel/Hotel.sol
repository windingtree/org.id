pragma solidity ^0.4.15;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "../Parent.sol";

/**
   @title Hotel, contract for a Hotel registered in the WT network

   A contract that represents a hotels in the WT network, it stores the
   hotel main information and, location, address, country, timezone, zip,
   images and the addresses of the hotel unit types and units.
   Every hotel have different types for units in his inventory and every
   unit contract save on childs variable reference an unit type.
   Uses OpenZeppelin Ownable and Parent contract developed by WT.
 */
contract Hotel is Ownable, Parent {

  // Main information
  string public name;
  string public description;
  address public manager;
  uint public created;

  // Address and Location
  string public lineOne;
  string public lineTwo;
  string public zip;
  string public country;
  uint public timezone;
  uint public latitude;
  uint public longitude;

  // The unit types contracts indexed by type and index.
  mapping(bytes32 => address) public unitTypes;
  bytes32[] public unitTypeNames;

  // Hotel images
  string[] public images;

  /**
     @dev Constructor.

     @param _name see `name`
     @param _description see `description`
     @param _manager see `_manager`
   */
  function Hotel(string _name, string _description, address _manager) {
    name = _name;
    description = _description;
    manager = _manager;
    created = block.number;
    unitTypeNames.length ++;
  }

  /**
     @dev `editInfo` allows the owner of the contract to change the hotel
     main information.

     @param _name The new name of the hotel.
     @param _description The new description of the hotel
   */
  function editInfo(
    string _name,
    string _description
  ) onlyOwner() {
    name = _name;
    description = _description;
  }

  /**
     @dev `editAddress` allows the owner of the contract to change the hotel
     phisical address.

     @param _lineOne The new main address of the hotel.
     @param _lineTwo The new second address of the hotel
     @param _zip The new zip code of the hotel.
     @param _country The new country of the hotel
   */
  function editAddress(
    string _lineOne,
    string _lineTwo,
    string _zip,
    string _country
  ) onlyOwner() {
    lineOne = _lineOne;
    lineTwo = _lineTwo;
    zip = _zip;
    country = _country;
  }

  /**
     @dev `editLocation` allows the owner of the contract to change the hotel
     location.

     @param _timezone The new timezone of the hotel
     @param _longitude The new longitude value of the location of the hotel
     @param _latitude The new longitude value of the latitude of the hotel
   */
  function editLocation(
    uint _timezone,
    uint _longitude,
    uint _latitude
  ) onlyOwner() {
    timezone = _timezone;
    latitude = _latitude;
    longitude = _longitude;
  }

  /**
     @dev `addUnitType` allows the owner to add a new unit type.

     @param addr The address of the UnitType contract
     @param unitType The type of the unit
   */
  function addUnitType(
    address addr,
    bytes32 unitType
  ) onlyOwner() {
		require(unitTypes[unitType] == address(0));
		unitTypes[unitType] = addr;
		unitTypeNames.push(unitType);
	}

  /**
     @dev `addUnit` allows the owner to add a new unit in the inventory.

     @param unitType The type of the unit
     @param unit The address of the Unit contract
   */
	function addUnit(
    bytes32 unitType,
    address unit
  ) onlyOwner() {
		require(unitTypes[unitType] != address(0));
		addChild(unit);
	}

  /**
     @dev `removeUnit` allows the owner to remove a unit in the inventory.

     @param unit The address of the Unit contract
   */
  function removeUnit(address unit) onlyOwner() {
		removeChild(unit);
	}

  /**
     @dev `addImage` allows the owner to add an image of the hotel.

     @param url The url of the image
   */
  function addImage(string url) onlyOwner() {
    images.push(url);
  }

  /**
     @dev `removeImage` allows the owner to remove an image of the hotel.

     @param index The index of the image in the images array
   */
  function removeImage(uint index) onlyOwner() {
    delete images[index];
  }

  /**
     @dev `removeUnitType` allows the owner to remove a unit type.

     @param unitType The type on the unit
     @param index The index in the unitTypeNames array
   */
  function removeUnitType(
    bytes32 unitType,
    uint index
  ) onlyOwner() {
    require(
      (unitTypes[unitType] != address(0)) &&
      (unitTypeNames[index] == unitType)
    );
    delete unitTypes[unitType];
    delete unitTypeNames[index];
  }

  /**
     @dev `changeUnitType` allows the owner to change a unit type.

     @param unitType The type on the unit
     @param newAddr The new address of the unit type
   */
  function changeUnitType(
    bytes32 unitType,
    address newAddr
  ) onlyOwner() {
    require(unitTypes[unitType] != address(0));
    removeChild(unitTypes[unitType]);
    unitTypes[unitType] = newAddr;
    addChild(newAddr);
  }

  /**
     @dev `callUnitType` allows the owner to call a unit type.

     @param unitType The type on the unit
     @param data The data of the call to execute on the unit type contract
   */
  function callUnitType(
    bytes32 unitType,
    bytes data
  ) onlyOwner() {
    require(unitTypes[unitType] != address(0));
    require(unitTypes[unitType].call(data));
  }

  /**
     @dev `callUnit` allows the owner to call a unit.

     @param unitAddress The address of the unit contract
     @param data The data of the call to execute on the unit contract
   */
  function callUnit(
    address unitAddress,
    bytes data
  ) onlyOwner() {
    if (childsIndex[unitAddress] > 0)
      unitAddress.call(data);
  }

  /**
     @dev `callIndex` allows a child contract to call the index.

     @param data The data of the call to execute on the index contract
   */
  function callIndex(bytes data) onlyChild() {
    require(owner.call(data));
  }

  /**
     @dev `getUnitType` get the address of a unit type.

     @param unitType The type of the unit

     @return address Address of the unit type contract
   */
  function getUnitType(bytes32 unitType) constant returns (address) {
    return unitTypes[unitType];
  }

  /**
     @dev `getUnitTypeNames` get the names of all the unitTypes.

     @return bytes32[] Names of all the unit types
   */
  function getUnitTypeNames() constant returns (bytes32[]) {
    return unitTypeNames;
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

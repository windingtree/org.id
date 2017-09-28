pragma solidity ^0.4.15;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "../Parent.sol";

/*
 * Hotel
 * An indexed contract on the WT Index that contains the hotel information and
 * the addresses of his Unit Types contracts.
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

  // The units that the hotel have for rent.
  mapping(bytes32 => address) public unitTypes;
  bytes32[] public unitTypeNames;

  // Hotel images
  string[] public images;

  // Constructor

  function Hotel(string _name, string _description, address _manager) {
    name = _name;
    description = _description;
    manager = _manager;
    created = block.number;
    unitTypeNames.length ++;
  }

  // Owner methods

  function editInfo(
    string _name,
    string _description
  ) onlyOwner() {
    name = _name;
    description = _description;
  }

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

  function editLocation(
    uint _timezone,
    uint _longitude,
    uint _latitude
  ) onlyOwner() {
    timezone = _timezone;
    latitude = _latitude;
    longitude = _longitude;
  }

  function addUnitType(
    address addr,
    bytes32 unitType
  ) onlyOwner() {
		require(unitTypes[unitType] == address(0));
		unitTypes[unitType] = addr;
		unitTypeNames.push(unitType);
	}

	function addUnit(
    bytes32 unitType,
    address unit
  ) onlyOwner() {
		require(unitTypes[unitType] != address(0));
		addChild(unit);
	}

  function removeUnit(address unit) onlyOwner() {
		removeChild(unit);
	}

  function addImage(string url) onlyOwner() {
    images.push(url);
  }

  function removeImage(uint index) onlyOwner() {
    delete images[index];
  }

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

  function changeUnitType(
    bytes32 unitType,
    address newAddr
  ) onlyOwner() {
    require(unitTypes[unitType] != address(0));
    removeChild(unitTypes[unitType]);
    unitTypes[unitType] = newAddr;
    addChild(newAddr);
  }

  function callUnitType(
    bytes32 unitType,
    bytes data
  ) onlyOwner() {
    require(unitTypes[unitType] != address(0));
    require(unitTypes[unitType].call(data));
  }

  function callUnit(
    address unitAddress,
    bytes data
  ) onlyOwner() {
    if (childsIndex[unitAddress] > 0)
      unitAddress.call(data);
  }

  // Only child methods

  function callIndex(bytes data) onlyChild() {
    require(owner.call(data));
  }

  // Public methods

  function getUnitType(bytes32 unitType) constant returns (address) {
    return unitTypes[unitType];
  }

  function getUnitTypeNames() constant returns (bytes32[]) {
    return unitTypeNames;
  }

  function getImage(uint i) constant returns (string) {
    return images[i];
  }

  function getImagesLength() constant returns (uint) {
    return images.length;
  }

}

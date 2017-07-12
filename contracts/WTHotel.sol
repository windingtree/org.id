pragma solidity ^0.4.8;

import "./Indexed.sol";

/*
 * WTHotel
 * An indexed contract on the WT Index taht contains the hotel information and
 * the addresses of his Unit Types contracts.
 */
contract WTHotel is Indexed {

	// Main information
	string public name;
	string public description;
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

  // Constructor

	function WTHotel(string _name, string _description) {
		name = _name;
		description = _description;
		created = block.number;
		unitTypeNames.length ++;
	}

  // Owner methods

	function editInfo(
    string _name,
    string _description
  ) troughIndex() onlyOwner() {
		name = _name;
		description = _description;
	}

	function editAddress(
    string _lineOne,
    string _lineTwo,
    string _zip,
    string _country
  ) troughIndex() onlyOwner() {
		lineOne = _lineOne;
		lineTwo = _lineTwo;
		zip = _zip;
		country = _country;
	}

	function editLocation(
    uint _timezone,
    uint _longitude,
    uint _latitude
  ) troughIndex() onlyOwner() {
		timezone = _timezone;
		latitude = _latitude;
		longitude = _longitude;
	}

	function addUnitType(
    address addr,
    bytes32 unitType
  ) troughIndex() onlyOwner() {
		if (unitTypes[unitType] != address(0))
			throw;
		unitTypes[unitType] = addr;
		unitTypeNames.push(unitType);
	}

	function removeUnitType(
    bytes32 unitType,
    uint index
  ) troughIndex() onlyOwner() {
		if (
      (unitTypes[unitType] == address(0)) ||
      (unitTypeNames[index] != unitType)
    )
			throw;
		delete unitTypes[unitType];
		delete unitTypeNames[index];
	}

	function changeUnitType(
    bytes32 unitType,
    address newAddr
  ) troughIndex() onlyOwner() {
		if (unitTypes[unitType] == address(0))
			throw;
		unitTypes[unitType] = newAddr;
	}

	function callUnitType(
    bytes32 unitType,
    bytes data
  ) troughIndex() onlyOwner() {
		if (unitTypes[unitType] == address(0))
			throw;
		if (!unitTypes[unitType].call(data))
			throw;
	}

	// Public constant methods

	function getUnitType(bytes32 unitType) constant returns (address) {
		return unitTypes[unitType];
	}

  function getUnitTypeNames() constant returns (bytes32[]) {
		return unitTypeNames;
	}

}

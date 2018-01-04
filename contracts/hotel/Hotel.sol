pragma solidity ^0.4.18;

import "../AsyncCall.sol";
import "../Images.sol";
import "./UnitType_Interface.sol";
import "./Unit_Interface.sol";
import "../Index_Interface.sol";
import "zeppelin-solidity/contracts/token/ERC20.sol";

/**
   @title Hotel, contract for a Hotel registered in the WT network

   A contract that represents a hotel in the WT network. It stores the
   hotel's main information as well as its geographic coordinates, address,
   country, timezone, zip code, images and the contract addresses of the hotel's
   unit types and individual units.
   Every hotel offers different types of units, each type represented
   by a `UnitType` contract whose address is stored in the mapping `unitTypes`.
   Each individual unit is represented by its own `Unit` contract, whose address
   is stored in the `units` array.

   Inherits from OpenZeppelin's `Ownable` and WT's 'Images'
 */
contract Hotel is AsyncCall, Images {

  bytes32 public version = bytes32("0.0.1-alpha");
  bytes32 public contractType = bytes32("hotel");

  // Main information
  string public name;
  string public description;
  address public manager;
  uint public created;

  // Address and Location
  string public lineOne;
  string public lineTwo;
  string public zip;
  bytes2 public country;
  string public timezone;
  uint public latitude;
  uint public longitude;

  // The `UnitType` contracts indexed by type and index
  mapping(bytes32 => address) public unitTypes;
  bytes32[] public unitTypeNames;

  // Array of addresses of `Unit` contracts and mapping of their index position
  mapping(address => uint) public unitsIndex;
  address[] public units;

  /**
     @dev Event triggered on every booking
  **/
  event Book(address from, address unit, uint256 fromDay, uint256 daysAmount);

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
    units.length ++;
  }

  /**
     @dev `editInfo` allows the owner of the contract to change the hotel's
     main information

     @param _name The new name of the hotel
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
     @dev `editLocation` allows the owner of the contract to change the hotel's
     address and geolocation

     @param _lineOne The new main address of the hotel
     @param _lineTwo The new second address of the hotel
     @param _zip The new zip code of the hotel
     @param _country The new ISO3166-1 Alpha2 country code of the hotel
     @param _timezone The new tz database timezone of the hotel
     @param _longitude The new longitude value of the location of the hotel
     @param _latitude The new longitude value of the latitude of the hotel
   */
  function editLocation(
    string _lineOne,
    string _lineTwo,
    string _zip,
    bytes2 _country,
    string _timezone,
    uint _longitude,
    uint _latitude
  ) onlyOwner() {
    lineOne = _lineOne;
    lineTwo = _lineTwo;
    zip = _zip;
    country = _country;
    timezone = _timezone;
    longitude = _longitude;
    latitude = _latitude;
  }

  /**
     @dev `addUnitType` allows the owner to add a new unit type

     @param addr The address of the `UnitType` contract
   */
  function addUnitType(
    address addr
  ) onlyOwner() {
    bytes32 unitType = UnitType_Interface(addr).unitType();
		require(unitTypes[unitType] == address(0));
		unitTypes[unitType] = addr;
		unitTypeNames.push(unitType);
	}

  /**
     @dev `addUnit` allows the owner to add a new unit to the inventory

     @param unit The address of the `Unit` contract
   */
	function addUnit(
    address unit
  ) onlyOwner() {
		require(unitTypes[Unit_Interface(unit).unitType()] != address(0));
    unitsIndex[unit] = units.length;
    units.push(unit);
    UnitType_Interface(unitTypes[Unit_Interface(unit).unitType()]).increaseUnits();
  }

  /**
     @dev `removeUnit` allows the owner to remove a unit from the inventory

     @param unit The address of the `Unit` contract
   */
  function removeUnit(address unit) onlyOwner() {
    delete units[ unitsIndex[unit] ];
    delete unitsIndex[unit];
    UnitType_Interface(unitTypes[Unit_Interface(unit).unitType()]).decreaseUnits();
  }

  /**
     @dev `removeUnitType` allows the owner to remove a unit type

     @param unitType The type of unit
     @param index The unit's index in the `unitTypeNames` array
   */
  function removeUnitType(
    bytes32 unitType,
    uint index
  ) onlyOwner() {
    require(unitTypes[unitType] != address(0));
    require(unitTypeNames[index] == unitType);
    delete unitTypes[unitType];
    delete unitTypeNames[index];
  }

  /**
     @dev `changeUnitType` allows the owner to change a unit type

     @param unitType The type of unit
     @param newAddr The new address of the `UnitType` contract
   */
  function changeUnitType(
    bytes32 unitType,
    address newAddr
  ) onlyOwner() {
    require(unitTypes[unitType] != address(0));
    require(Unit_Interface(newAddr).unitType() == unitType);
    unitTypes[unitType] = newAddr;
  }

  /**
     @dev `callUnitType` allows the owner to call a unit type

     @param unitType The type of unit
     @param data The data of the call to execute on the `UnitType` contract
   */
  function callUnitType(
    bytes32 unitType,
    bytes data
  ) onlyOwner() {
    require(unitTypes[unitType] != address(0));
    require(unitTypes[unitType].call(data));
  }

  /**
     @dev `callUnit` allows the owner to call a unit

     @param unitAddress The address of the `Unit` contract
     @param data The data of the call to execute on the `Unit` contract
   */
  function callUnit(
    address unitAddress,
    bytes data
  ) onlyOwner() {
    require(unitsIndex[unitAddress] > 0);
    require(unitAddress.call(data));
  }

  /**
     @dev `book` allows the contract to execute a book function itself

     @param unitAddress The address of the `Unit` contract
     @param from The address of the opener of the reservation
     @param fromDay The starting day of the period of days to book
     @param daysAmount The amount of days in the booking period
   */
  function book(
    address unitAddress,
    address from,
    uint256 fromDay,
    uint256 daysAmount
  ) fromSelf() {
    require(unitsIndex[unitAddress] > 0);
    require(daysAmount > 0);
    require(Unit_Interface(unitAddress).book(from, fromDay, daysAmount));
    Book(from, unitAddress, fromDay, daysAmount);
  }

  /**
     @dev `bookWithLif` allows the contract to execute a book function itself

     @param unitAddress The address of the `Unit` contract
     @param from The address of the opener of the reservation
     @param fromDay The starting day of the period of days to book
     @param daysAmount The amount of days in the booking period
   */
  function bookWithLif(
    address unitAddress,
    address from,
    uint256 fromDay,
    uint256 daysAmount
  ) fromSelf() {
    require(unitsIndex[unitAddress] > 0);
    require(daysAmount > 0);
    uint256 price = getLifCost(unitAddress, fromDay, daysAmount);
    require(Unit_Interface(unitAddress).book(from, fromDay, daysAmount));
    require(ERC20(Index_Interface(owner).LifToken()).transferFrom(from, this, price));
    Book(from, unitAddress, fromDay, daysAmount);
  }

  /**
     @dev `getCost` calculates the cost of renting the Unit for the given dates

     @param fromDay The starting date of the period of days to book
     @param daysAmount The amount of days in the period

     @return uint256 The total cost of the booking in the custom currency
   */
  function getCost(
    address unitAddress,
    uint256 fromDay,
    uint256 daysAmount
  ) constant returns(uint256) {
    uint256 toDay = fromDay+daysAmount;
    uint256 totalCost = 0;
    uint256 defaultPrice = UnitType_Interface(unitTypes[Unit_Interface(unitAddress).unitType()]).defaultPrice();

    for (uint256 i = fromDay; i < toDay ; i++){
      var (specialPrice,,) = Unit_Interface(unitAddress).getReservation(i);
      if (specialPrice > 0) {
        totalCost += specialPrice;
      } else {
        totalCost += defaultPrice;
      }
    }

    return totalCost;
  }

  /**
     @dev `getLifCost` calculates the cost of renting the Unit for the given dates

     @param fromDay The starting date of the period of days to book
     @param daysAmount The amount of days in the period

     @return uint256 The total cost of the booking in Lif
   */
  function getLifCost(
    address unitAddress,
    uint256 fromDay,
    uint256 daysAmount
  ) constant returns(uint256) {
    uint256 toDay = fromDay+daysAmount;
    uint256 totalCost = 0;
    uint256 defaultLifPrice = UnitType_Interface(unitTypes[Unit_Interface(unitAddress).unitType()]).defaultLifPrice();

    for (uint256 i = fromDay; i < toDay ; i++){
      var (,specialLifPrice,) = Unit_Interface(unitAddress).getReservation(i);
      if (specialLifPrice > 0) {
        totalCost += specialLifPrice;
      } else {
        totalCost += defaultLifPrice;
      }
    }

    return totalCost;
  }

  /**
     @dev `getUnitType` get the address of a unit type

     @param unitType The type of the unit

     @return address Address of the `UnitType` contract
   */
  function getUnitType(bytes32 unitType) constant returns (address) {
    return unitTypes[unitType];
  }

  /**
     @dev `getUnitTypeNames` get the names of all the unitTypes

     @return bytes32[] Names of all the unit types
   */
  function getUnitTypeNames() constant returns (bytes32[]) {
    return unitTypeNames;
  }

  /**
     @dev `getUnitsLength` get the length of the `units` array

     @return uint Length of the `units` array
   */
  function getUnitsLength() constant returns (uint) {
    return units.length;
  }

  /**
     @dev `getUnits` get the `units` array

     @return address[] the `units` array
   */
  function getUnits() constant returns (address[]) {
    return units;
  }

}

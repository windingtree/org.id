pragma solidity ^0.4.15;

import "../PrivateCall.sol";
import "../Images.sol";

/*
 * Hotel_Interface
 * Interface of Hotel contract
 */
contract Hotel_Interface is PrivateCall, Images {

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

  // The `UnitType` contracts indexed by type and index
  mapping(bytes32 => address) public unitTypes;
  bytes32[] public unitTypeNames;

  // Array of addresses of `Unit` contracts and mapping of their index position
  mapping(address => uint) public unitsIndex;
  address[] public units;

  event Book(address from, address unit, uint256 fromDay, uint256 daysAmount);

  // Owner methods
  function editInfo(string _name, string _description) onlyOwner();
  function editAddress(string _lineOne, string _lineTwo, string _zip, string _country) onlyOwner() ;
  function editLocation(uint _timezone, uint _longitude, uint _latitude) onlyOwner();
  function addUnit(address unit) onlyOwner();
  function removeUnit(address unit) onlyOwner();
  function addUnitType(address addr) onlyOwner();
  function removeUnitType(bytes32 unitType, uint index) onlyOwner();
  function changeUnitType(bytes32 unitType, address newAddr) onlyOwner();
  function callUnitType(bytes32 unitType, bytes data) onlyOwner();
  function callUnit(address unitAddress, bytes data) onlyOwner();

  // Private call methods
  function book(address unitAddress, address from, uint fromDay, uint daysAmount) fromSelf();
  function bookWithLif(address unitAddress, address from, uint256 fromDay, uint256 daysAmount) fromSelf();

  // Public constant methods
  function getUnitType(bytes32 unitType) constant returns (address);
  function getUnitTypeNames() constant returns (bytes32[]);

}

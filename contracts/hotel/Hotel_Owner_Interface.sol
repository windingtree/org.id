pragma solidity ^0.4.11;

import "../Indexed.sol";

/*
 * Hotel_Owner_Interface
 * Owner interface of Hotel contract
 */
contract Hotel_Owner_Interface is Indexed {

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

  // Owner methods
  function editInfo(string _name, string _description) throughIndex() onlyOwner();
  function editAddress(string _lineOne, string _lineTwo, string _zip, string _country) throughIndex() onlyOwner() ;
  function editLocation(uint _timezone, uint _longitude, uint _latitude) throughIndex() onlyOwner();
  function addUnitType(address addr, bytes32 unitType) throughIndex() onlyOwner();
  function removeUnitType(bytes32 unitType, uint index) throughIndex() onlyOwner();
  function changeUnitType(bytes32 unitType, address newAddr) throughIndex() onlyOwner();
  function addImage(string url) throughIndex() onlyOwner();
  function removeImage(uint index) throughIndex() onlyOwner();
  function callUnitType(bytes32 unitType, bytes data) throughIndex() onlyOwner();

  // Public constant methods
  function getUnitType(bytes32 unitType) constant returns (address);
  function getUnitTypeNames() constant returns (bytes32[]);

}

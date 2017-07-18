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
  function editInfo(string _name, string _description) troughIndex() onlyOwner();
  function editAddress(string _lineOne, string _lineTwo, string _zip, string _country) troughIndex() onlyOwner() ;
  function editLocation(uint _timezone, uint _longitude, uint _latitude) troughIndex() onlyOwner();
  function addUnitType(address addr, bytes32 unitType) troughIndex() onlyOwner();
  function removeUnitType(bytes32 unitType, uint index) troughIndex() onlyOwner();
  function changeUnitType(bytes32 unitType, address newAddr) troughIndex() onlyOwner();
  function addImage(string url) troughIndex() onlyOwner();
  function removeImage(uint index) troughIndex() onlyOwner();
  function callUnitType(bytes32 unitType, bytes data) troughIndex() onlyOwner();

  // Public constant methods
  function getUnitType(bytes32 unitType) constant returns (address);
  function getUnitTypeNames() constant returns (bytes32[]);

}

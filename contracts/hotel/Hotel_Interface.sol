pragma solidity ^0.4.15;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

/*
 * Hotel_Interface
 * Interface of Hotel contract
 */
contract Hotel_Interface is Ownable {

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

  // Owner methods
  function editInfo(string _name, string _description) onlyOwner();
  function editAddress(string _lineOne, string _lineTwo, string _zip, string _country) onlyOwner() ;
  function editLocation(uint _timezone, uint _longitude, uint _latitude) onlyOwner();
  function addUnitType(address addr, bytes32 unitType) onlyOwner();
  function removeUnitType(bytes32 unitType, uint index) onlyOwner();
  function changeUnitType(bytes32 unitType, address newAddr) onlyOwner();
  function addImage(string url) onlyOwner();
  function removeImage(uint index) onlyOwner();
  function callUnitType(bytes32 unitType, bytes data) onlyOwner();
  function callUnit(address unitAddress, bytes data) onlyOwner();

  // Public constant methods
  function getUnitType(bytes32 unitType) constant returns (address);
  function getUnitTypeNames() constant returns (bytes32[]);

}

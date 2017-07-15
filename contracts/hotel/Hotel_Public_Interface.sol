pragma solidity ^0.4.8;

import "../Indexed.sol";

/*
 * Hotel_Public_Interface
 * Owner interface of Hotel contract
 */
contract Hotel_Public_Interface {

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

  // Public constant methods
  function getUnitType(bytes32 unitType) constant returns (address);
  function getUnitTypeNames() constant returns (bytes32[]);

}

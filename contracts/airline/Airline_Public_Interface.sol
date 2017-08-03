pragma solidity ^0.4.11;

import "../Parent.sol";

/*
 * Airline_Public_Interface
 * Owner interface of Airline contract
 */
contract Airline_Public_Interface is Parent {

  // Only child methods
  function callIndex(bytes data) onlyChild();

  // Public methods
  function getInfo() constant returns (string, string, string, string, string);
  function getRoute(bytes12 from, bytes12 to) constant returns (address);

}

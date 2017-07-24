pragma solidity ^0.4.11;

import "../Indexed.sol";
import "../Father.sol";

/*
 * Airline_Owner_Interface
 * Owner interface of Airline contract
 */
contract Airline_Owner_Interface is Indexed, Father {

  // Constructor
  function Airline_Owner_Interface(string _name, string _description);

  // Owner methods
  function editInfo(string _name, string _description, string _website) throughIndex() onlyOwner();
  function editLocation(string _legalAddress, string _country) throughIndex() onlyOwner();
  function addRoute(address addr, bytes12 from, bytes12 to) throughIndex() onlyOwner();
  function changeRoute(bytes12 from, bytes12 to, address newRoute) throughIndex() onlyOwner();
	function callRoute(bytes12 from, bytes12 to, bytes data) throughIndex() onlyOwner();

  // Only child methods
  function callIndex(bytes data) onlyChild();

  // Public methods
  function getInfo() constant returns (string, string, string, string, string);
	function getRoute(bytes12 from, bytes12 to) constant returns (address);

}

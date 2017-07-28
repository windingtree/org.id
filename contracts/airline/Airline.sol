pragma solidity ^0.4.11;

import "../Indexed.sol";
import "../Parent.sol";

/*
 * Airline
 * An indexed contract on the WT Index that contains the airline information
 * and the addresses of his Flight Routes contracts.
 */
contract Airline is Indexed, Parent {

	// Airline information
	string public name;
	string public description;
	string public legalAddress;
	string public country;
	string public website;

	// The flight routes that the airline has.
	mapping(bytes12 => mapping(bytes12 => address)) routes;

  // Constructor

	function Airline(string _name, string _description) {
		name = _name;
		description = _description;
	}

  // Owner methods

	function editInfo(
    string _name, string _description, string _website
  ) throughIndex() onlyOwner() {
		name = _name;
		description = _description;
		website = _website;
	}

	function editLocation(
    string _legalAddress, string _country
  ) throughIndex() onlyOwner() {
		legalAddress = _legalAddress;
		country = _country;
	}

	function addRoute(
    address addr, bytes12 from, bytes12 to
  ) throughIndex() onlyOwner() {
		if (routes[from][to] != address(0))
			throw;
		routes[from][to] = addr;
	}

	function changeRoute(
    bytes12 from, bytes12 to, address newRoute
  ) throughIndex() onlyOwner() {
		if (routes[from][to] == address(0))
			throw;
		routes[from][to] = newRoute;
	}

	function callRoute(
    bytes12 from, bytes12 to, bytes data
  ) throughIndex() onlyOwner() {
		if (routes[from][to] == address(0))
			throw;
		if (!routes[from][to].call(data))
			throw;
	}

  // Only child methods

  function callIndex(bytes data) onlyChild() {
    if (!index.call(data))
      throw;
  }

  // Public methods

  function getInfo() constant returns (
    string, string, string, string, string
  ) {
    return(
      name,
      description,
      legalAddress,
      country,
      website
    );
	}

	function getRoute(bytes12 from, bytes12 to) constant returns (address) {
		return routes[from][to];
	}

}

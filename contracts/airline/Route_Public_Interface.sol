pragma solidity ^0.4.11;

import "../PrivateCall.sol";

/*
 * Route_Public_Interface
 * Owner interface of Route contract
 */
contract Route_Public_Interface is PrivateCall {

	event Book(bytes12 flightId, uint class);

  // Methods from private call
	function book(bytes12 id, uint class, bytes publicData, bytes finalDataCall) fromSelf();

  // Public methods
  function getInfo() constant returns(bytes12, bytes12, bool, uint, uint, uint);
  function getClassInfo(uint class) constant returns(uint, string);
  function getFlight(bytes12 id) constant returns(uint, uint, uint, bool, uint);
  function getFlightClass(bytes12 id, uint class) constant returns(uint, string);

}

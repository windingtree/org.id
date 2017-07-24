pragma solidity ^0.4.11;

import "../PrivateCall.sol";

/*
 * Route_Owner_Interface
 * Owner interface of Route contract
 */
contract Route_Owner_Interface is PrivateCall {

	event Book(bytes12 flightId, uint class);

  // Constructor
	function Route_Owner_Interface(address _owner, bytes12 _from, bytes12 _to);

  // Owner methods
	function active(bool _active) onlyOwner();
	function addFlight(bytes12 id, uint start, uint end) onlyOwner();
	function editFlight(bytes12 id, uint _start, uint _end, bool _active) onlyOwner();
	function removeFlight(bytes12 id) onlyOwner();
  function addClass(uint seats, string price) onlyOwner();
	function editClass(uint index, uint seats, string price) onlyOwner();
	function removeClass(uint index) onlyOwner();

  // Methods from private call
	function book(bytes12 id, uint class, bytes publicData, bytes finalDataCall) fromSelf();

  // Public methods
  function getInfo() constant returns(bytes12, bytes12, bool, uint, uint, uint);
  function getClassInfo(uint class) constant returns(uint, string);
  function getFlight(bytes12 id) constant returns(uint, uint, uint, bool, uint);
  function getFlightClass(bytes12 id, uint class) constant returns(uint, string);

}

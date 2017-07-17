pragma solidity ^0.4.11;

import "../PrivateCall.sol";

/*
 * Route
 * A flight route owned by an Airline, it keep record of all future and passed
 * flights in the route.
 */
contract Route is PrivateCall {

	// Route information
	bytes12 public from;
	bytes12 public to;
	bool public active;
	uint totalFlights;

	// The flight routes that the airline has.
	mapping(uint => Flight) public flights;

	// The flights id refering their position on flights mapping
	mapping(bytes12 => uint) public ids;

	event Book(bytes12 flightId);

	struct Flight {
		bytes12 id;
    uint start;
    uint end;
    uint seatsFree;
		uint seats;
    bool active;
  }

  // Constructor

	function Route(address _owner, bytes12 _from, bytes12 _to) {
		owner = _owner;
		from = _from;
		to = _to;
		totalFlights ++;
	}

  // Owner methods

	function active(bool _active) onlyOwner() {
		active = _active;
	}

	function addFlight(
    bytes12 id,
    uint start,
    uint end,
    uint seats
  ) onlyOwner() {

		if (ids[id] > 0)
			throw;

		flights[totalFlights] = Flight(id, start, end, seats, seats, true);
		ids[id] = totalFlights;
		totalFlights ++;

	}

	function editFlight(bytes12 id, uint _start, uint _end) onlyOwner() {

		if (ids[id] == 0)
			throw;

		flights[ ids[id] ].start = _start;
		flights[ ids[id] ].end = _end;

	}

	function removeFlight(bytes12 id) onlyOwner() {

		if (ids[id] == 0)
			throw;

		delete flights[ ids[id] ];
		ids[id] = 0;

	}

  // Methods from private call

	function book(bytes12 id) fromSelf() {

		if (ids[id] == 0)
			throw;

		flights[ ids[id] ].seatsFree --;
		Book(id);

	}

  // Public methods

  function getFlight(bytes12 id) constant returns(
    uint, uint, uint, uint, bool
  ) {
      Flight flight = flights[ ids[id] ];
      return(
        flight.start,
        flight.end,
        flight.seatsFree,
        flight.seats,
        flight.active
      );
    }

}

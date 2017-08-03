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
  uint public totalFlights;
  uint public totalSeats;
  mapping(uint => Class) public classes;
  uint public totalClasses;

  // The flight routes that the airline has.
  mapping(uint => Flight) public flights;

  // The flights id refering their position on flights mapping
  mapping(bytes12 => uint) public ids;

  event Book(bytes12 flightId, uint class);

  struct Class {
    uint seats;
    string price;
  }

  struct Flight {
    bytes12 id;
    uint totalSeatsFree;
    uint start;
    uint end;
    bool active;
    mapping(uint => FlightClass) classes;
  }

  struct FlightClass {
    uint seatsBooked;
    string price;
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
    bytes12 id, uint start, uint end
  ) onlyOwner() {
    if (ids[id] > 0)
      throw;
    flights[totalFlights] = Flight(id, totalSeats, start, end, true);
    ids[id] = totalFlights;
    totalFlights ++;
  }

  function editFlight(bytes12 id, uint _start, uint _end, bool _active) onlyOwner() {
    if (ids[id] == 0)
      throw;
    flights[ ids[id] ].start = _start;
    flights[ ids[id] ].end = _end;
    flights[ ids[id] ].active = _active;
  }

  function removeFlight(bytes12 id) onlyOwner() {
    if (ids[id] == 0)
      throw;
    delete flights[ ids[id] ];
    ids[id] = 0;
  }

  function addClass(
    uint seats, string price
  ) onlyOwner() {
    totalSeats += seats;
    classes[totalClasses] = Class(seats, price);
    totalClasses ++;
  }

  function editClass(
    uint index, uint seats, string price
  ) onlyOwner() {
    totalSeats -= classes[index].seats;
    totalSeats += seats;
    classes[index].seats = seats;
    classes[index].price = price;
  }

  function removeClass(uint index) onlyOwner() {
    totalSeats -= classes[index].seats;
    delete classes[index];
  }

  // Methods from private call

  function book(bytes12 id, uint class, bytes publicData, bytes finalDataCall) fromSelf() {
    if (ids[id] == 0)
      throw;
    flights[ ids[id] ].totalSeatsFree --;
    flights[ ids[id] ].classes[class].seatsBooked --;
    Book(id, class);
    owner.call(finalDataCall);
  }

  // Public methods

  function getInfo() constant returns(
    bytes12, bytes12, bool, uint, uint, uint
  ) {
    return(
      from, to, active, totalFlights, totalSeats, totalClasses
    );
  }

  function getClassInfo(uint class) constant returns(
    uint, string
  ) {
    return(
      classes[class].seats, classes[class].price
    );
  }

  function getFlight(bytes12 id) constant returns(
    uint, uint, uint, bool, uint
  ) {
    Flight flight = flights[ ids[id] ];
    return(
      flight.start,
      flight.end,
      flight.totalSeatsFree,
      flight.active,
      ids[id]
    );
  }

  function getFlightClass(bytes12 id, uint class) constant returns(
    uint, string
  ) {
    Flight flight = flights[ ids[id] ];
    return(
      flight.classes[class].seatsBooked,
      flight.classes[class].price
    );
  }

}

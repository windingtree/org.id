pragma solidity ^0.4.11;

import "../PrivateCall.sol";

/*
 * Unit
 * A type of unit that a Hotel has in his inventory, with all the units
 * information and avaliability.
 */
contract Unit is PrivateCall {

  bytes32 public unitType;

  bool public active;
  // An array of all days avaliability after 01-01-1970
  mapping(uint => UnitDay) reservations;

  struct UnitDay {
    string specialPrice;
    address bookedBy;
  }

  event Book(address from, uint fromDay, uint daysAmount);

  // Constructor

  function Unit(address _owner, bytes32 _unitType){
    owner = _owner;
    unitType = _unitType;
    active = true;
  }

  // Owner methods

  function setActive(bool _active) onlyOwner() {
    active = _active;
  }

  function setPrice(
    string price,
    uint fromDay,
    uint daysAmount
  ) onlyOwner() {
    uint toDay = fromDay+daysAmount;
    for (uint i = fromDay; i < toDay; i++)
      reservations[i].specialPrice = price;
  }

  // Methods from private call

  function book(
    address from,
    uint fromDay,
    uint daysAmount,
    bytes finalDataCall
  ) fromSelf() {
    if (!active)
      throw;
    bool canBook = true;
    uint toDay = fromDay+daysAmount;

    for (uint i = fromDay; i <= toDay ; i++){
      if (reservations[i].bookedBy != address(0)) {
        canBook = false;
        break;
      }
    }

    if (canBook){
      for (i = fromDay; i <= toDay ; i++)
        reservations[i].bookedBy = from;
      Book(from, fromDay, toDay);
      owner.call(finalDataCall);
    }
  }

  // Public methods

  function getReservation(
    uint day
  ) constant returns(string, address) {
    return (
      reservations[day].specialPrice,
      reservations[day].bookedBy
    );
  }

}

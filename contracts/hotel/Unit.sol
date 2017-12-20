pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

 /**
   @title Unit, contract for an individual unit in a Hotel

   A contract that represents an individual unit of a hotel registered in the
   WT network. Tracks the price and availability of this unit.

   Inherits from WT's `PrivateCall`
 */
contract Unit is Ownable {

  bytes32 public version = bytes32("0.0.1-alpha");
  bytes32 public contractType = bytes32("unit");

  // The type of the unit
  bytes32 public unitType;

  // The status of the unit
  bool public active;

  /*
     Mapping of reservations, indexed by date represented by number of days
     after 01-01-1970
  */
  mapping(uint256 => UnitDay) reservations;
  struct UnitDay {
    uint256 specialPrice;
    uint256 specialLifPrice;
    address bookedBy;
  }

  /**
     @dev Constructor. Creates the `Unit` contract with an active status

     @param _owner see `owner`
     @param _unitType see `unitType`
   */
  function Unit(address _owner, bytes32 _unitType) {
    owner = _owner;
    unitType = _unitType;
    active = true;
  }

  /**
     @dev `setActive` allows the owner of the contract to switch the status

     @param _active The new status of the unit
   */
  function setActive(bool _active) onlyOwner() {
    active = _active;
  }

  /**
     @dev `setPrice` allows the owner of the contract to set a speical price in
     the custom currency for a range of dates

     @param price The price of the unit
     @param fromDay The starting date of the period of days to change
     @param daysAmount The amount of days in the period
   */
  function setSpecialPrice(
    uint256 price,
    uint256 fromDay,
    uint256 daysAmount
  ) onlyOwner() {
    uint256 toDay = fromDay+daysAmount;
    for (uint256 i = fromDay; i < toDay; i++)
      reservations[i].specialPrice = price;
  }

  /**
     @dev `setSpecialLifPrice` allows the owner of the contract to set a special
     price in Líf for a range of days

     @param price The price of the unit
     @param fromDay The starting date of the period of days to change
     @param daysAmount The amount of days in the period
   */
  function setSpecialLifPrice(
    uint256 price,
    uint256 fromDay,
    uint256 daysAmount
  ) onlyOwner() {
    uint256 toDay = fromDay+daysAmount;
    for (uint256 i = fromDay; i < toDay; i++)
      reservations[i].specialLifPrice = price;
  }

  /**
     @dev `book` allows the owner to make a reservation

     @param from The address of the opener of the reservation
     @param fromDay The starting day of the period of days to book
     @param daysAmount The amount of days in the booking period

     @return bool Whether the booking was successful or not
   */
  function book(
    address from,
    uint256 fromDay,
    uint256 daysAmount
  ) onlyOwner() returns(bool) {
    require(isFutureDay(fromDay));
    require(active);
    uint256 toDay = fromDay+daysAmount;

    for (uint256 i = fromDay; i < toDay ; i++){
      if (reservations[i].bookedBy != address(0)) {
        return false;
      }
    }

    for (i = fromDay; i < toDay ; i++)
      reservations[i].bookedBy = from;
    return true;
  }

  /**
     @dev `getReservation` get the avalibility and price of a day

     @param day The number of days after 01-01-1970

     @return uint256 The price of the day in the custom currency, 0 if default price
     @return uint256 The price of the day in Líf, 0 if default price
     @return address The address of the owner of the reservation
     returns 0x0 if its available
   */
  function getReservation(
    uint256 day
  ) constant returns(uint256, uint256, address) {
    return (
      reservations[day].specialPrice,
      reservations[day].specialLifPrice,
      reservations[day].bookedBy
    );
  }

  /**
     @dev `getCost` calculates the cost of renting the Unit for the given dates

     @param fromDay The starting date of the period of days to book
     @param daysAmount The amount of days in the period

     @return uint256 The total cost of the booking in the custom currency
   */
  /* function getCost(
    uint256 fromDay,
    uint256 daysAmount
  ) constant returns(uint256) {
    uint256 toDay = fromDay+daysAmount;
    uint256 totalCost = 0;

    for (uint256 i = fromDay; i < toDay ; i++){
      if (reservations[i].specialPrice > 0) {
        totalCost += reservations[i].specialPrice;
      } else {
        totalCost += defaultPrice;
      }
    }

    return totalCost;
  } */

  /**
     @dev `getLifCost` calculates the cost of renting the Unit for the given dates

     @param fromDay The starting date of the period of days to book
     @param daysAmount The amount of days in the period

     @return uint256 The total cost of the booking in Lif
   */
  /* function getLifCost(
    uint256 fromDay,
    uint256 daysAmount
  ) constant returns(uint256) {
    uint256 toDay = fromDay+daysAmount;
    uint256 totalCost = 0;

    for (uint256 i = fromDay; i < toDay ; i++){
      if (reservations[i].specialLifPrice > 0) {
        totalCost += reservations[i].specialLifPrice;
      } else {
        totalCost += defaultLifPrice;
      }
    }

    return totalCost;
  } */

  /**
     @dev `isFutureDay` checks that a timestamp is not a past date

     @param time The number of days after 01-01-1970

     @return bool If the timestamp is today or in the future
   */
  function isFutureDay(uint256 time) internal returns (bool) {
    return !(now / 86400 > time);
  }

}

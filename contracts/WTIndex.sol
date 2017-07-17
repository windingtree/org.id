pragma solidity ^0.4.8;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./hotel/Hotel.sol";
import "./airline/Airline.sol";
import "./Father.sol";

/*
 * WTIndex
 * Public resgitry of all hotels and airlines regsitered on WT
 * The hotels and airlines are saved in array and can be filtered by the owner
 * address.
 */
contract WTIndex is Ownable, Father {

	Hotel[] public hotels;
	mapping(address => address[]) public hotelsByOwner;

	Airline[] public airlines;
	mapping(address => address[]) public airlinesByOwner;

  address DAO;

	event log();

  event voteGiven(address);

	function WTIndex() {
		hotels.length ++;
		airlines.length ++;
	}

  // Only owner methods

  function setDAO(address _DAO) onlyOwner() {
    DAO = _DAO;
  }

  // Public external methods

	function registerHotel(string name, string description) external {
		Hotel newHotel = new Hotel(name, description);
		hotels.push(newHotel);
		hotelsByOwner[msg.sender].push(newHotel);
    addChild(newHotel);
		log();
	}

	function callHotel(uint index, bytes data) external {
		if (!hotelsByOwner[msg.sender][index].call(data))
			throw;
		else
			log();
	}

	function registerAirline(string name, string description) external {
		Airline newAirline = new Airline(name, description);
		airlines.push(newAirline);
		airlinesByOwner[msg.sender].push(newAirline);
    addChild(newAirline);
		log();
	}

	function callAirline(uint index, bytes data) external {
		if (!airlinesByOwner[msg.sender][index].call(data))
			throw;
		else
			log();
	}

  // Only childs methods

  function giveVote(address userAddress) onlyChild() {
      // TO DO
      voteGiven(msg.sender);
  }

  // Public constant methods

	function getHotels() constant returns(Hotel[]){
		return hotels;
	}

	function getAirlines() constant returns(Airline[]){
		return airlines;
	}

	function getHotelsByOwner(address owner) constant returns(address[]){
		return hotelsByOwner[owner];
	}

	function getAirlineByOwner(address owner) constant returns(address[]){
		return airlinesByOwner[owner];
	}

}

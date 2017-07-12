pragma solidity ^0.4.8;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./WTHotel.sol";
import "./WTAirline.sol";
import "./WTAirRoute.sol";

/*
 * WTIndex
 * Public resgitry of all hotels and airlines regsitered on WT
 * The hotels and airlines are saved in array and can be filtered by the owner
 * address.
 */
contract WTIndex is Ownable {

	WTHotel[] public hotels;
	mapping(address => address[]) public hotelsByOwner;

	WTAirline[] public airlines;
	mapping(address => address[]) public airlinesByOwner;

	event log();

	function WTIndex() {
		hotels.length ++;
		airlines.length ++;
	}

	function registerHotel(string name, string description) external {
		WTHotel newHotel = new WTHotel(name, description);
		hotels.push(newHotel);
		hotelsByOwner[msg.sender].push(newHotel);
		log();
	}

	function callHotel(uint index, bytes data) external {
		if (!hotelsByOwner[msg.sender][index].call(data))
			throw;
		else
			log();
	}

	function registerAirline(string name, string description) external {
		WTAirline newAirline = new WTAirline(name, description);
		airlines.push(newAirline);
		airlinesByOwner[msg.sender].push(newAirline);
		log();
	}

	function callAirline(uint index, bytes data) external {
		if (!airlinesByOwner[msg.sender][index].call(data))
			throw;
		else
			log();
	}

	function getHotels() constant returns(WTHotel[]){
		return hotels;
	}

	function getAirlines() constant returns(WTAirline[]){
		return airlines;
	}

	function getHotelsByOwner(address owner) constant returns(address[]){
		return hotelsByOwner[owner];
	}

	function getAirlineByOwner(address owner) constant returns(address[]){
		return airlinesByOwner[owner];
	}

}

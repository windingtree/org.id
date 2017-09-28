pragma solidity ^0.4.15;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./hotel/Hotel.sol";
import "./Parent.sol";

/*
 * WTIndex
 * Public resgitry of all hotels and airlines regsitered on WT
 * The hotels and airlines are saved in array and can be filtered by the owner
 * address.
 */
contract WTIndex is Ownable, Parent {

  Hotel[] public hotels;
  mapping(address => address[]) public hotelsByManager;

  address DAO;

  event log();

  event voteGiven(address receiver);

	function WTIndex() {
		hotels.length ++;
	}

  // Only owner methods

  function setDAO(address _DAO) onlyOwner() {
    DAO = _DAO;
  }

  // Public external methods

  function registerHotel(string name, string description) external {
    Hotel newHotel = new Hotel(name, description, msg.sender);
    hotels.push(newHotel);
    hotelsByManager[msg.sender].push(newHotel);
    addChild(newHotel);
		log();
	}

	function callHotel(uint index, bytes data) external {
		require(hotelsByManager[msg.sender][index].call(data));
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

	function getHotelsByManager(address owner) constant returns(address[]){
		return hotelsByManager[owner];
	}

}

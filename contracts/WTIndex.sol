pragma solidity ^0.4.15;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./hotel/Hotel.sol";

/*
 * WTIndex
 * Public resgitry of all hotels and airlines regsitered on WT
 * The hotels and airlines are saved in array and can be filtered by the owner
 * address.
 */
contract WTIndex is Ownable {

  // Array of addresses of `Hotel` contracts and mapping of their index position
  address[] public hotels;
  mapping(address => uint) public hotelsIndex;

  mapping(address => address[]) public hotelsByManager;

  address DAO;

  event log();

  event voteGiven(address receiver);

  modifier onlyHotel() {
    require(hotels[hotelsIndex[msg.sender]] != 0);
    _;
  }

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
    hotelsIndex[newHotel] = hotels.length;
    hotels.push(newHotel);
    hotelsByManager[msg.sender].push(newHotel);
		log();
	}

	function callHotel(uint index, bytes data) external {
		require(hotelsByManager[msg.sender][index].call(data));
		log();
	}

  // Only hotel methods

  function giveVote(address userAddress) onlyHotel() {
      // TO DO
      voteGiven(msg.sender);
  }

  // Public constant methods

  function getHotels() constant returns(address[]){
    return hotels;
  }

	function getHotelsByManager(address owner) constant returns(address[]){
		return hotelsByManager[owner];
	}

}

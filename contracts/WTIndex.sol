pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Base_Interface.sol";
import "./hotel/Hotel.sol";

/**
   @title WTIndex, registry of all hotels registered on WT

   The hotels are stored in an array and can be filtered by the owner
   address.

   Inherits from OpenZeppelin's `Ownable`
 */
contract WTIndex is Ownable, Base_Interface {

  bytes32 public contractType = bytes32("wtindex");

  // Array of addresses of `Hotel` contracts and mapping of their index position
  address[] public hotels;
  mapping(address => uint) public hotelsIndex;

  // Mapping of the hotels indexed by manager's address
  mapping(address => address[]) public hotelsByManager;

  // Address of the LifToken contract
  address public LifToken;

  /**
     @dev Event triggered every time hotel is registered or called
  **/
  event log();

  /**
     @dev Constructor. Creates the `WTIndex` contract
   */
	function WTIndex() public {
		hotels.length ++;
	}

  /**
     @dev `setLifToken` allows the owner of the contract to change the
     address of the LifToken contract

     @param _LifToken The new contract address
   */
  function setLifToken(address _LifToken) onlyOwner() public {
    LifToken = _LifToken;
  }

  /**
     @dev `registerHotel` Register new hotel in the index

     @param name The name of the hotel
     @param description The description of the hotel
   */
  function registerHotel(string name, string description) external {
    Hotel newHotel = new Hotel(name, description, msg.sender);
    hotelsIndex[newHotel] = hotels.length;
    hotels.push(newHotel);
    hotelsByManager[msg.sender].push(newHotel);
		log();
	}

  /**
     @dev `deleteHotel` Allows a manager to delete a hotel.

     @param index The hotel's index
   */
  function deleteHotel(uint index) external {
    require(hotelsByManager[msg.sender][index] != address(0));
    Hotel(hotelsByManager[msg.sender][index]).destroy();
    delete hotels[hotelsIndex[hotelsByManager[msg.sender][index]]];
    delete hotelsIndex[hotelsByManager[msg.sender][index]];
    delete hotelsByManager[msg.sender][index];
	}

  /**
     @dev `callHotel` Call hotel in the index, the hotel can only
     be called by its manager

     @param index The index position of the hotel
     @param data The data to be executed in the hotel contract
   */
	function callHotel(uint index, bytes data) external {
		require(hotelsByManager[msg.sender][index].call(data));
		log();
	}

  /**
     @dev `getHotelsLength` get the length of the `hotels` array

     @return uint Length of the `hotels` array
   */
  function getHotelsLength() constant public returns (uint) {
    return hotels.length;
  }

  /**
     @dev `getHotels` get `hotels` array

     @return address[] `hotels` array
   */
  function getHotels() constant public returns (address[]) {
    return hotels;
  }

  /**
     @dev `getHotelsByManager` get all the hotels belonging to one manager

     returns The addresses of `Hotel` contracts that belong to one manager
   */
	function getHotelsByManager(address owner) constant public returns(address[]){
		return hotelsByManager[owner];
	}

}

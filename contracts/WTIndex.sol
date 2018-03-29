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

  // Mapping of hotels indexed by a a manager's address and customIdHash
  mapping(address => mapping(bytes32 => address)) public hotelsByManagerAndCustomHash;
  // Mapping of the hotels indexed by manager's address
  mapping(address => address[]) public hotelsByManager;
  mapping(address => uint) public hotelsByManagerIndex;

  // Address of the LifToken contract
  address public LifToken;

  /**
     @dev Event triggered every time hotel is registered
  **/
  event HotelRegistered(address hotel, uint managerIndex, uint allIndex);
  /**
     @dev Event triggered every time hotel is deleted
  **/
  event HotelDeleted(address hotel, uint managerIndex, uint allIndex);
  /**
     @dev Event triggered every time hotel is called
  **/
  event HotelCalled(address hotel);

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

   */
  function registerHotel(string url, bytes32 customIdHash) external {
    Hotel newHotel = new Hotel(msg.sender, url, customIdHash);
    hotelsIndex[newHotel] = hotels.length;
    hotels.push(newHotel);
    hotelsByManagerIndex[newHotel] = hotelsByManager[msg.sender].length;
    hotelsByManager[msg.sender].push(newHotel);
    hotelsByManagerAndCustomHash[msg.sender][customIdHash] = newHotel;
		HotelRegistered(newHotel, hotelsByManagerIndex[newHotel], hotelsIndex[newHotel]);
	}

  /**
     @dev `deleteHotel` Allows a manager to delete a hotel.

     @param customIdHash The hotel's custom ID hash
   */
  function deleteHotel(bytes32 customIdHash) external {
    require(hotelsByManagerAndCustomHash[msg.sender][customIdHash] != address(0));
    Hotel(hotelsByManagerAndCustomHash[msg.sender][customIdHash]).destroy();
    address hotel = hotelsByManagerAndCustomHash[msg.sender][customIdHash];
    uint index = hotelsByManagerIndex[hotel];
    uint allIndex = hotelsIndex[hotel];
    delete hotels[hotelsIndex[hotel]];
    delete hotelsIndex[hotel];
    delete hotelsByManager[msg.sender][index];
    delete hotelsByManagerIndex[hotel];
    delete hotelsByManagerAndCustomHash[msg.sender][customIdHash];
    HotelDeleted(hotel, index, allIndex);
	}

  /**
     @dev `callHotel` Call hotel in the index, the hotel can only
     be called by its manager

     @param customIdHash the custom ID hash of the hotel
     @param data The data to be executed in the hotel contract
   */
	function callHotel(bytes32 customIdHash, bytes data) external {
    require(hotelsByManagerAndCustomHash[msg.sender][customIdHash] != address(0));
		require(hotelsByManagerAndCustomHash[msg.sender][customIdHash].call(data));
    HotelCalled(hotelsByManagerAndCustomHash[msg.sender][customIdHash]);
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
     @dev `getHotel` get Hotel address by owner and custom ID hash

     @param manager Hotel manager
     @param customIdHash custom ID hash
     @return address hotel address
   */
  function getHotel(address manager, bytes32 customIdHash) public view returns (address) {
    return hotelsByManagerAndCustomHash[manager][customIdHash];
  }

  /**
     @dev `getHotelsByManager` get all the hotels belonging to one manager

     returns The addresses of `Hotel` contracts that belong to one manager
   */
	function getHotelsByManager(address manager) constant public returns (address[]) {
		return hotelsByManager[manager];
	}

}

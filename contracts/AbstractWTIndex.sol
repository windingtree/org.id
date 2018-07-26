pragma solidity ^0.4.24;

import "./AbstractBaseContract.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title AbstractWTIndex
 * @dev Interface of WTIndex contract, inherits from OpenZeppelin's Ownable and
 * from WT's 'AbstractBaseContract'.
 */
contract AbstractWTIndex is Ownable, AbstractBaseContract {
  address[] public hotels;
  mapping(address => uint) public hotelsIndex;
  mapping(address => address[]) public hotelsByManager;
  mapping(address => uint) public hotelsByManagerIndex;
  address public LifToken;

  function registerHotel(string dataUri) external;
  function deleteHotel(address hotel) external;
  function callHotel(address hotel, bytes data) external;
  function transferHotel(address hotel, address newManager) external;
  function getHotelsLength() view public returns (uint);
  function getHotels() view public returns (address[]);
  function getHotelsByManager(address manager) view public returns (address[]);

  event HotelRegistered(address hotel, uint managerIndex, uint allIndex);
  event HotelDeleted(address hotel, uint managerIndex, uint allIndex);
  event HotelCalled(address hotel);
  event HotelTransferred(address hotel, address previousManager, address newManager);
}

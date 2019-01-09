pragma solidity ^0.4.25;

import "./AbstractBaseContract.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


/**
 * @title AbstractWTHotelIndex
 * @dev Interface of WTHotelIndex contract, inherits from OpenZeppelin's Ownable and
 * from WT's 'AbstractBaseContract'.
 */
contract AbstractWTHotelIndex is Ownable, AbstractBaseContract {
    address[] public hotels;
    mapping(address => uint) public hotelsIndex;
    mapping(address => address[]) public hotelsByManager;
    mapping(address => uint) public hotelsByManagerIndex;
    // solhint-disable-next-line var-name-mixedcase
    address public LifToken;

    function registerHotel(string dataUri) external returns (address);
    function deleteHotel(address hotel) external;
    function callHotel(address hotel, bytes data) external;
    function transferHotel(address hotel, address newManager) external;
    function getHotelsLength() public view returns (uint);
    function getHotels() public view returns (address[]);
    function getHotelsByManager(address manager) public view returns (address[]);

    event HotelRegistered(address hotel, uint managerIndex, uint allIndex);
    event HotelDeleted(address hotel, uint managerIndex, uint allIndex);
    event HotelCalled(address hotel);
    event HotelTransferred(address hotel, address previousManager, address newManager);
}

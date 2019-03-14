pragma solidity ^0.4.25;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


/**
 * @title AbstractWTHotelIndex
 * @dev Interface of WTHotelIndex contract, inherits from OpenZeppelin's Ownable
 */
contract AbstractWTHotelIndex is Ownable {
    
    // Array of addresses of `Hotel` contracts
    address[] public hotels;

    // Mapping of hotels position in the general hotel index
    mapping(address => uint) public hotelsIndex;

    // Mapping of the hotels indexed by manager's address
    mapping(address => address[]) public hotelsByManager;
    // Mapping of hotels position in the manager's indexed hotel index
    mapping(address => uint) public hotelsByManagerIndex;

    // Address of the LifToken contract
    // solhint-disable-next-line var-name-mixedcase
    address public LifToken;

    /**
     * @dev Event triggered every time hotel is registered
     */
    event HotelRegistered(address hotel, uint managerIndex, uint allIndex);
    /**
     * @dev Event triggered every time hotel is deleted
     */
    event HotelDeleted(address hotel, uint managerIndex, uint allIndex);
    /**
     * @dev Event triggered every time hotel is called
     */
    event HotelCalled(address hotel);

    /**
     * @dev Event triggered every time a hotel changes a manager.
     */
    event HotelTransferred(address hotel, address previousManager, address newManager);

    function registerHotel(string dataUri) external returns (address);
    function deleteHotel(address hotel) external;
    function callHotel(address hotel, bytes data) external;
    function transferHotel(address hotel, address newManager) external;
    function getHotelsLength() public view returns (uint);
    function getHotels() public view returns (address[]);
    function getHotelsByManager(address manager) public view returns (address[]);
}

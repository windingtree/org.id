pragma solidity ^0.4.25;

import "./AbstractWTHotelIndex.sol";
import "./hotel/Hotel.sol";


/**
 * @title WTHotelIndex, registry of all hotels registered on WT
 * @dev The hotels are stored in an array and can be filtered by the owner
 * address. Inherits from OpenZeppelin's `Ownable` and `AbstractBaseContract`.
 */
contract WTHotelIndex is AbstractWTHotelIndex {

    bytes32 public contractType = bytes32("wthotelindex");

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

    /**
     * @dev Constructor. Creates the `WTHotelIndex` contract
     */
    constructor() public {
        hotels.length++;
    }

    /**
     * @dev `registerHotel` Register new hotel in the index.
     * Emits `HotelRegistered` on success.
     * @param  dataUri Hotel's data pointer
     * @return {" ": "Address of the new hotel."}
     */
    function registerHotel(string dataUri) external returns (address) {
        Hotel newHotel = new Hotel(msg.sender, dataUri, this);
        hotelsIndex[newHotel] = hotels.length;
        hotels.push(newHotel);
        hotelsByManagerIndex[newHotel] = hotelsByManager[msg.sender].length;
        hotelsByManager[msg.sender].push(newHotel);
        emit HotelRegistered(newHotel, hotelsByManagerIndex[newHotel], hotelsIndex[newHotel]);
        return newHotel;
    }

    /**
     * @dev `deleteHotel` Allows a manager to delete a hotel, i. e. call destroy
     * on the target Hotel contract. Emits `HotelDeleted` on success.
     * @param  hotel  Hotel's address
     */
    function deleteHotel(address hotel) external {
        // Ensure hotel address is valid
        require(hotel != address(0));
        // Ensure we know about the hotel at all
        require(hotelsIndex[hotel] != uint(0));
        // Ensure that the caller is the hotel's rightful owner
        // There may actually be a hotel on index zero, that's why we use a double check
        require(hotelsByManager[msg.sender][hotelsByManagerIndex[hotel]] != address(0));

        Hotel hotelInstance = Hotel(hotel);
        // Ensure we are calling only our own hotels
        require(hotelInstance.index() == address(this));
        hotelInstance.destroy();

        uint index = hotelsByManagerIndex[hotel];
        uint allIndex = hotelsIndex[hotel];
        delete hotels[allIndex];
        delete hotelsIndex[hotel];
        delete hotelsByManager[msg.sender][index];
        delete hotelsByManagerIndex[hotel];
        emit HotelDeleted(hotel, index, allIndex);
    }

    /**
     * @dev `callHotel` Call hotel in the index, the hotel can only
     * be called by its manager. Effectively proxies a hotel call.
     * Emits HotelCalled on success.
     * @param  hotel Hotel's address
     * @param  data Encoded method call to be done on Hotel contract.
     */
    function callHotel(address hotel, bytes data) external {
        // Ensure hotel address is valid
        require(hotel != address(0));
        // Ensure we know about the hotel at all
        require(hotelsIndex[hotel] != uint(0));
        // Ensure that the caller is the hotel's rightful owner
        require(hotelsByManager[msg.sender][hotelsByManagerIndex[hotel]] != address(0));
        Hotel hotelInstance = Hotel(hotel);
        // Ensure we are calling only our own hotels
        require(hotelInstance.index() == address(this));
        // solhint-disable-next-line avoid-low-level-calls
        require(hotel.call(data));
        emit HotelCalled(hotel);
    }

    /**
     * @dev `transferHotel` Allows to change ownership of
     * the hotel contract. Emits HotelTransferred on success.
     * @param hotel Hotel's address
     * @param newManager Address to which the hotel will belong after transfer.
     */
    function transferHotel(address hotel, address newManager) external {
        // Ensure hotel address is valid
        require(hotel != address(0));
        // Ensure new manager is valid
        require(newManager != address(0));
        // Ensure we know about the hotel at all
        require(hotelsIndex[hotel] != uint(0));
        // Ensure that the caller is the hotel's rightful owner
        // There may actually be a hotel on index zero, that's why we use a double check
        require(hotelsByManager[msg.sender][hotelsByManagerIndex[hotel]] != address(0));

        Hotel hotelInstance = Hotel(hotel);
        // Ensure we are calling only our own hotels
        require(hotelInstance.index() == address(this));
        // Change ownership in the Hotel contract
        hotelInstance.changeManager(newManager);

        // Detach from the old manager ...
        uint index = hotelsByManagerIndex[hotel];
        delete hotelsByManager[msg.sender][index];
        // ... and attach to new manager
        hotelsByManagerIndex[hotel] = hotelsByManager[newManager].length;
        hotelsByManager[newManager].push(hotel);
        emit HotelTransferred(hotel, msg.sender, newManager);
    }

    /**
     * @dev `setLifToken` allows the owner of the contract to change the
     * address of the LifToken contract
     * @param _lifToken The new contract address
     */
    function setLifToken(address _lifToken) public onlyOwner {
        LifToken = _lifToken;
    }

    /**
     * @dev `getHotelsLength` get the length of the `hotels` array
     * @return {" ": "Length of the hotels array. Might contain zero addresses."}
     */
    function getHotelsLength() public view returns (uint) {
        return hotels.length;
    }

    /**
     * @dev `getHotels` get `hotels` array
     * @return {" ": "Array of hotel addresses. Might contain zero addresses."}
     */
    function getHotels() public view returns (address[]) {
        return hotels;
    }

    /**
     * @dev `getHotelsByManager` get all the hotels belonging to one manager
     * @param  manager Manager address
     * @return {" ": "Array of hotels belonging to one manager. Might contain zero addresses."}
     */
    function getHotelsByManager(address manager) public view returns (address[]) {
        return hotelsByManager[manager];
    }
}

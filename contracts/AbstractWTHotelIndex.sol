pragma solidity ^0.5.6;

/**
 * @title AbstractWTHotelIndex
 * @dev Interface of WTHotelIndex contract
 */
contract AbstractWTHotelIndex {
    
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

    // Address of the contract owner
    address _owner;

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
     * @dev Event triggered when owner of the index is changed.
     */
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    function registerHotel(string calldata dataUri) external returns (address);
    function deleteHotel(address hotel) external;
    function callHotel(address hotel, bytes calldata data) external;
    function transferHotel(address hotel, address payable newManager) external;
    function getHotelsLength() public view returns (uint);
    function getHotels() public view returns (address[] memory);
    function getHotelsByManager(address manager) public view returns (address[] memory);

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == _owner);
        _;
    }

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0));
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

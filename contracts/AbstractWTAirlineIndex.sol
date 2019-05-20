pragma solidity ^0.5.6;

/**
 * @title AbstractWTAirlineIndex
 * @dev Interface of WTAirlineIndex contract
 */
contract AbstractWTAirlineIndex {

    // Array of addresses of `Airline` contracts
    address[] public airlines;

    // Mapping of airlines position in the general airline index
    mapping(address => uint) public airlinesIndex;

    // Mapping of the airlines indexed by manager's address
    mapping(address => address[]) public airlinesByManager;
    // Mapping of airlines position in the manager's indexed airline index
    mapping(address => uint) public airlinesByManagerIndex;

    // Address of the LifToken contract
    // solhint-disable-next-line var-name-mixedcase
    address public LifToken;

    // Address of the contract owner
    address _owner;

    /**
     * @dev Event triggered every time airline is registered
     */
    event AirlineRegistered(address indexed airline, uint managerIndex, uint allIndex);
    /**
     * @dev Event triggered every time airline is deleted
     */
    event AirlineDeleted(address indexed airline, uint managerIndex, uint allIndex);
    /**
     * @dev Event triggered every time airline is called
     */
    event AirlineCalled(address indexed airline);

    /**
     * @dev Event triggered every time a airline changes a manager.
     */
    event AirlineTransferred(address indexed airline, address previousManager, address newManager);

    /**
     * @dev Event triggered when owner of the index is changed.
     */
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    function registerAirline(string calldata dataUri) external returns (address);
    function deleteAirline(address airline) external;
    function callAirline(address airline, bytes calldata data) external;
    function transferAirline(address airline, address payable newManager) external;
    function getAirlinesLength() public view returns (uint);
    function getAirlines() public view returns (address[] memory);
    function getAirlinesByManager(address manager) public view returns (address[] memory);

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

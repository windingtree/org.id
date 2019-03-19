pragma solidity ^0.5.6;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


/**
 * @title AbstractWTAirlineIndex
 * @dev Interface of WTAirlineIndex contract, inherits from OpenZeppelin's Ownable
 */
contract AbstractWTAirlineIndex is Ownable {
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

    /**
     * @dev Event triggered every time airline is registered
     */
    event AirlineRegistered(address airline, uint managerIndex, uint allIndex);
    /**
     * @dev Event triggered every time airline is deleted
     */
    event AirlineDeleted(address airline, uint managerIndex, uint allIndex);
    /**
     * @dev Event triggered every time airline is called
     */
    event AirlineCalled(address airline);

    /**
     * @dev Event triggered every time a airline changes a manager.
     */
    event AirlineTransferred(address airline, address previousManager, address newManager);


    function registerAirline(string calldata dataUri) external returns (address);
    function deleteAirline(address airline) external;
    function callAirline(address airline, bytes calldata data) external;
    function transferAirline(address airline, address payable newManager) external;
    function getAirlinesLength() public view returns (uint);
    function getAirlines() public view returns (address[] memory);
    function getAirlinesByManager(address manager) public view returns (address[] memory);
}

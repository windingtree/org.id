pragma solidity ^0.4.25;

import "zos-lib/contracts/Initializable.sol";
import "./AbstractWTAirlineIndex.sol";
import "./airline/Airline.sol";


/**
 * @title WTAirlineIndex, registry of all airlines registered on WT
 * @dev The airlines are stored in an array and can be filtered by the owner
 * address.
 */
contract WTAirlineIndex is Initializable, AbstractWTAirlineIndex {

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

    /**
     * @dev `registerAirline` Register new airline in the index.
     * Emits `AirlineRegistered` on success.
     * @param  dataUri Airline's data pointer
     * @return {" ": "Address of the new airline."}
     */
    function registerAirline(string dataUri) external returns (address) {
        Airline newAirline = new Airline(msg.sender, dataUri, this);
        airlinesIndex[newAirline] = airlines.length;
        airlines.push(newAirline);
        airlinesByManagerIndex[newAirline] = airlinesByManager[msg.sender].length;
        airlinesByManager[msg.sender].push(newAirline);
        emit AirlineRegistered(newAirline, airlinesByManagerIndex[newAirline], airlinesIndex[newAirline]);
        return newAirline;
    }

    /**
     * @dev `deleteAirline` Allows a manager to delete a airline, i. e. call destroy
     * on the target Airline contract. Emits `AirlineDeleted` on success.
     * @param  airline  Airline's address
     */
    function deleteAirline(address airline) external {
        // Ensure airline address is valid
        require(airline != address(0));
        // Ensure we know about the airline at all
        require(airlinesIndex[airline] != uint(0));
        // Ensure that the caller is the airline's rightful owner
        // There may actually be a airline on index zero, that's why we use a double check
        require(airlinesByManager[msg.sender][airlinesByManagerIndex[airline]] != address(0));

        Airline airlineInstance = Airline(airline);
        // Ensure we are calling only our own airlines
        require(airlineInstance.index() == address(this));
        airlineInstance.destroy();

        uint index = airlinesByManagerIndex[airline];
        uint allIndex = airlinesIndex[airline];
        delete airlines[allIndex];
        delete airlinesIndex[airline];
        delete airlinesByManager[msg.sender][index];
        delete airlinesByManagerIndex[airline];
        emit AirlineDeleted(airline, index, allIndex);
    }

    /**
     * @dev `callAirline` Call airline in the index, the airline can only
     * be called by its manager. Effectively proxies a airline call.
     * Emits AirlineCalled on success.
     * @param  airline Airline's address
     * @param  data Encoded method call to be done on Airline contract.
     */
    function callAirline(address airline, bytes data) external {
        // Ensure airline address is valid
        require(airline != address(0));
        // Ensure we know about the airline at all
        require(airlinesIndex[airline] != uint(0));
        // Ensure that the caller is the airline's rightful owner
        require(airlinesByManager[msg.sender][airlinesByManagerIndex[airline]] != address(0));
        Airline airlineInstance = Airline(airline);
        // Ensure we are calling only our own airlines
        require(airlineInstance.index() == address(this));
        // solhint-disable-next-line avoid-low-level-calls
        require(airline.call(data));
        emit AirlineCalled(airline);
    }

    /**
     * @dev `transferAirline` Allows to change ownership of
     * the airline contract. Emits AirlineTransferred on success.
     * @param airline Airline's address
     * @param newManager Address to which the airline will belong after transfer.
     */
    function transferAirline(address airline, address newManager) external {
        // Ensure airline address is valid
        require(airline != address(0));
        // Ensure new manager is valid
        require(newManager != address(0));
        // Ensure we know about the airline at all
        require(airlinesIndex[airline] != uint(0));
        // Ensure that the caller is the airline's rightful owner
        // There may actually be a airline on index zero, that's why we use a double check
        require(airlinesByManager[msg.sender][airlinesByManagerIndex[airline]] != address(0));

        Airline airlineInstance = Airline(airline);
        // Ensure we are calling only our own airlines
        require(airlineInstance.index() == address(this));
        // Change ownership in the Airline contract
        airlineInstance.changeManager(newManager);

        // Detach from the old manager ...
        uint index = airlinesByManagerIndex[airline];
        delete airlinesByManager[msg.sender][index];
        // ... and attach to new manager
        airlinesByManagerIndex[airline] = airlinesByManager[newManager].length;
        airlinesByManager[newManager].push(airline);
        emit AirlineTransferred(airline, msg.sender, newManager);
    }

    /**
     * @dev Initializer for upgradeable contracts.
     * @param  _owner The address of the contract owner
     */
    function initialize(address _owner) public initializer {
        airlines.length++;
        owner = _owner;
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
     * @dev `getAirlinesLength` get the length of the `airlines` array
     * @return {" ": "Length of the airlines array. Might contain zero addresses."}
     */
    function getAirlinesLength() public view returns (uint) {
        return airlines.length;
    }

    /**
     * @dev `getAirlines` get `airlines` array
     * @return {" ": "Array of airline addresses. Might contain zero addresses."}
     */
    function getAirlines() public view returns (address[]) {
        return airlines;
    }

    /**
     * @dev `getAirlinesByManager` get all the airlines belonging to one manager
     * @param  manager Manager address
     * @return {" ": "Array of airlines belonging to one manager. Might contain zero addresses."}
     */
    function getAirlinesByManager(address manager) public view returns (address[]) {
        return airlinesByManager[manager];
    }
}

pragma solidity ^0.5.6;

import "./AbstractWTAirlineIndex.sol";
import "./SegmentDirectory.sol";

/**
 * @title WTAirlineIndex, registry of all airlines registered on WT
 * @dev The airlines are stored in an array and can be filtered by the owner
 * address.
 */
contract WTAirlineIndex is SegmentDirectory, AbstractWTAirlineIndex {

    /**
     * @dev `registerAirline` Register new airline in the index.
     * Emits `AirlineRegistered` on success.
     * @param  dataUri Airline's data pointer
     * @return {" ": "Address of the new airline."}
     */
    function registerAirline(string calldata dataUri) external returns (address) {
        return registerOrganization(dataUri);
    }

    /**
     * @dev `deleteAirline` Allows a manager to delete a airline, i. e. call destroy
     * on the target Airline contract. Emits `AirlineDeleted` on success.
     * @param  airline  Airline's address
     */
    function deleteAirline(address airline) external {
        return deleteOrganization(airline);
    }

    /**
     * @dev `callAirline` Call airline in the index, the airline can only
     * be called by its manager. Effectively proxies a airline call.
     * Emits AirlineCalled on success.
     * @param  airline Airline's address
     * @param  data Encoded method call to be done on Airline contract.
     */
    function callAirline(address airline, bytes calldata data) external {
        return callOrganization(airline, data);
    }

    /**
     * @dev `transferAirline` Allows to change ownership of
     * the airline contract. Emits AirlineTransferred on success.
     * @param airline Airline's address
     * @param newManager Address to which the airline will belong after transfer.
     */
    function transferAirline(address airline, address payable newManager) external {
        return transferOrganization(airline, newManager);
    }

    /**
     * @dev `getAirlinesLength` get the length of the `airlines` array
     * @return {" ": "Length of the airlines array. Might contain zero addresses."}
     */
    function getAirlinesLength() public view returns (uint) {
        return this.getOrganizationsLength();
    }

    /**
     * @dev `getAirlines` get `airlines` array
     * @return {" ": "Array of airline addresses. Might contain zero addresses."}
     */
    function getAirlines() public view returns (address[] memory) {
        return this.getOrganizations();
    }

    /**
     * @dev `getAirlinesByManager` get all the airlines belonging to one manager
     * @param  manager Manager address
     * @return {" ": "Array of airlines belonging to one manager. Might contain zero addresses."}
     */
    function getAirlinesByManager(address manager) public view returns (address[] memory) {
        return this.getOrganizationsByManager(manager);
    }

    function airlinesIndex(address hotel) public view returns (uint) {
        return organizationsIndex[hotel];
    }

    function airlines(uint index) public view returns (address) {
        return organizations[index];
    }

}

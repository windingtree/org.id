pragma solidity ^0.5.6;

import "./AbstractWTAirlineIndex.sol";
import "./SegmentDirectory.sol";

/**
 * @title WTAirlineIndex, registry of all airlines registered on WT
 * @dev The airlines are stored in an array and can be filtered by the owner
 * address.
 */
contract WTAirlineIndex is SegmentDirectory, AbstractWTAirlineIndex {

    function createAirline(string calldata dataUri) external returns (address) {
        return createOrganization(dataUri);
    }

    function registerAirline(address airline) external returns (address) {
        return registerOrganization(airline);
    }

    function createAndRegisterAirline(string calldata dataUri) external returns (address) {
        return createAndRegisterOrganization(dataUri);
    }

    /**
     * @dev `deregisterAirline` Allows a manager to delete a airline, i. e. call destroy
     * on the target Airline contract. Emits `AirlineDeleted` on success.
     * @param  airline  Airline's address
     */
    function deregisterAirline(address airline) external {
        return deregisterOrganization(airline);
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

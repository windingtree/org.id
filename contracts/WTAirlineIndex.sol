pragma solidity ^0.5.6;

import "./AbstractWTAirlineIndex.sol";
import "./SegmentDirectory.sol";

/**
 * @title WTAirlineIndex
 * @dev The airlines are stored in an array and can be filtered by the owner
 * address.
 */
contract WTAirlineIndex is SegmentDirectory, AbstractWTAirlineIndex {

    /**
     * @dev `createAirline` proxies and externalizes createOrganization
     * @param  dataUri Airline's data pointer
     * @return {" ": "Address of the new airline."}
     */
    function createAirline(string calldata dataUri) external returns (address) {
        return createOrganization(dataUri);
    }

    /**
     * @dev `registerAirline` proxies and externalizes registerOrganization
     * @param  airline Airline's address
     * @return {" ": "Address of the airline."}
     */
    function registerAirline(address airline) external returns (address) {
        return registerOrganization(airline);
    }

    /**
     * @dev `createAndRegisterAirline` proxies and externalizes createAndRegisterOrganization
     * @param  dataUri Airline's data pointer
     * @return {" ": "Address of the new airline."}
     */
    function createAndRegisterAirline(string calldata dataUri) external returns (address) {
        return createAndRegisterOrganization(dataUri);
    }

    /**
     * @dev `deregisterAirline` proxies and externalizes deregisterOrganization
     * @param  airline  Airline's address
     */
    function deregisterAirline(address airline) external {
        return deregisterOrganization(airline);
    }

    /**
     * @dev `getAirlinesLength` proxies getOrganizationsLength
     * @return {" ": "Number of airlines. Might contain zero addresses."}
     */
    function getAirlinesLength() public view returns (uint) {
        return this.getOrganizationsLength();
    }

    /**
     * @dev `getAirlines` proxies getOrganizations
     * @return {" ": "List of airlines. Might contain zero addresses."}
     */
    function getAirlines() public view returns (address[] memory) {
        return this.getOrganizations();
    }

    /**
     * @dev `getAirlinesByManager` proxies getOrganizationsByManager
     * @param  manager Manager address
     * @return {" ": "Array of airlines belonging to one manager. Might contain zero addresses."}
     */
    function getAirlinesByManager(address manager) public view returns (address[] memory) {
        return this.getOrganizationsByManager(manager);
    }

    /**
     * @dev `airlinesIndex` aliases organizatoinsIndex 
     * @param  airline Airline's address
     * @return {" ": "Index of airline in the directory list."}
     */
    function airlinesIndex(address airline) public view returns (uint) {
        return organizationsIndex[airline];
    }

    /**
     * @dev `airlines` aliases organizations
     * @param  index Airline's index
     * @return {" ": "Address of airline on given index."}
     */
    function airlines(uint index) public view returns (address) {
        return organizations[index];
    }

}

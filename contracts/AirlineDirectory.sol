pragma solidity ^0.5.6;

import "./AirlineDirectoryInterface.sol";
import "./SegmentDirectory.sol";

/**
 * @title AirlineDirectory
 * @dev The airlines are stored in an array
 */
contract AirlineDirectory is SegmentDirectory, AirlineDirectoryInterface {

    /**
     * @dev `createAirline` proxies and externalizes createOrganization
     * @param  dataUri Airline's data pointer
     * @return {" ": "Address of the new airline."}
     */
    function createAirline(string calldata dataUri) external returns (address) {
        return createOrganization(dataUri);
    }

    /**
     * @dev `addAirline` proxies and externalizes addOrganization
     * @param  airline Airline's address
     * @return {" ": "Address of the airline."}
     */
    function addAirline(address airline) external returns (address) {
        return addOrganization(airline);
    }

    /**
     * @dev `createAndAddAirline` proxies and externalizes createAndAddOrganization
     * @param  dataUri Airline's data pointer
     * @return {" ": "Address of the new airline."}
     */
    function createAndAddAirline(string calldata dataUri) external returns (address) {
        return createAndAddOrganization(dataUri);
    }

    /**
     * @dev `removeAirline` proxies and externalizes removeOrganization
     * @param  airline  Airline's address
     */
    function removeAirline(address airline) external {
        return removeOrganization(airline);
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

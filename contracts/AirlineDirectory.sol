pragma solidity ^0.5.6;

import "./AirlineDirectoryInterface.sol";
import "./SegmentDirectory.sol";

/**
 * @title AirlineDirectory
 * @dev The airlines are stored in an array
 */
contract AirlineDirectory is AirlineDirectoryInterface, SegmentDirectory {

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
     * @dev `airlinesIndex` aliases organizationsIndex 
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

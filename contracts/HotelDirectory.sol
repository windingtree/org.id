pragma solidity ^0.5.6;

import "./HotelDirectoryInterface.sol";
import "./SegmentDirectory.sol";

/**
 * @title HotelDirectory
 * @dev The hotels are stored in an array
 */
contract HotelDirectory is HotelDirectoryInterface, SegmentDirectory {

    /**
     * @dev `getHotelsLength` proxies getOrganizationsLength
     * @return {" ": "Number of hotels. Might contain zero addresses."}
     */
    function getHotelsLength() public view returns (uint) {
        return this.getOrganizationsLength();
    }

    /**
     * @dev `getHotels` proxies getOrganizations
     * @return {" ": "List of hotels. Might contain zero addresses."}
     */
    function getHotels() public view returns (address[] memory) {
        return this.getOrganizations();
    }

    /**
     * @dev `hotelsIndex` aliases organizationsIndex 
     * @param  hotel Hotel's address
     * @return {" ": "Index of hotel in the directory list."}
     */
    function hotelsIndex(address hotel) public view returns (uint) {
        return organizationsIndex[hotel];
    }

    /**
     * @dev `hotels` aliases organizations
     * @param  index Hotel's index
     * @return {" ": "Address of hotel on given index."}
     */
    function hotels(uint index) public view returns (address) {
        return organizations[index];
    }

}

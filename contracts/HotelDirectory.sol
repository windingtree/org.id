pragma solidity ^0.5.6;

import "./HotelDirectoryInterface.sol";
import "./SegmentDirectory.sol";

/**
 * @title HotelDirectory
 * @dev The hotels are stored in an array
 */
contract HotelDirectory is SegmentDirectory, HotelDirectoryInterface {

    /**
     * @dev `createHotel` proxies and externalizes createOrganization
     * @param  dataUri Hotel's data pointer
     * @return {" ": "Address of the new hotel."}
     */
    function createHotel(string calldata dataUri) external returns (address) {
        return createOrganization(dataUri);
    }

    /**
     * @dev `addHotel` proxies and externalizes addOrganization
     * @param  hotel Hotel's address
     * @return {" ": "Address of the hotel."}
     */
    function addHotel(address hotel) external returns (address) {
        return addOrganization(hotel);
    }

    /**
     * @dev `createAndAddHotel` proxies and externalizes createAndAddOrganization
     * @param  dataUri Hotel's data pointer
     * @return {" ": "Address of the new hotel."}
     */
    function createAndAddHotel(string calldata dataUri) external returns (address) {
        return createAndAddOrganization(dataUri);
    }

    /**
     * @dev `removeHotel` proxies and externalizes removeOrganization
     * @param  hotel  Hotel's address
     */
    function removeHotel(address hotel) external {
        return removeOrganization(hotel);
    }

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
     * @dev `hotelsIndex` aliases organizatoinsIndex 
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

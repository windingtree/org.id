pragma solidity ^0.5.6;

import "./HotelDirectoryInterface.sol";
import "./SegmentDirectory.sol";

/**
 * @title HotelDirectory
 * @dev The hotels are stored in an array and can be filtered by the owner
 * address.
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
     * @dev `registerHotel` proxies and externalizes registerOrganization
     * @param  hotel Hotel's address
     * @return {" ": "Address of the hotel."}
     */
    function registerHotel(address hotel) external returns (address) {
        return registerOrganization(hotel);
    }

    /**
     * @dev `createAndRegisterHotel` proxies and externalizes createAndRegisterOrganization
     * @param  dataUri Hotel's data pointer
     * @return {" ": "Address of the new hotel."}
     */
    function createAndRegisterHotel(string calldata dataUri) external returns (address) {
        return createAndRegisterOrganization(dataUri);
    }

    /**
     * @dev `deregisterHotel` proxies and externalizes deregisterOrganization
     * @param  hotel  Hotel's address
     */
    function deregisterHotel(address hotel) external {
        return deregisterOrganization(hotel);
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

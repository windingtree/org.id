pragma solidity ^0.5.6;

import "./AbstractWTHotelIndex.sol";
import "./SegmentDirectory.sol";

/**
 * @title WTHotelIndex, registry of all hotels registered on WT
 * @dev The hotels are stored in an array and can be filtered by the owner
 * address.
 */
contract WTHotelIndex is SegmentDirectory, AbstractWTHotelIndex {

    function createHotel(string calldata dataUri) external returns (address) {
        return createOrganization(dataUri);
    }

    function registerHotel(address hotel) external returns (address) {
        return registerOrganization(hotel);
    }

    function createAndRegisterHotel(string calldata dataUri) external returns (address) {
        return createAndRegisterOrganization(dataUri);
    }

    /**
     * @dev `deleteHotel` Allows a manager to delete a hotel, i. e. call destroy
     * on the target Hotel contract. Emits `HotelDeleted` on success.
     * @param  hotel  Hotel's address
     */
    function deregisterHotel(address hotel) external {
        return deregisterOrganization(hotel);
    }

    /**
     * @dev `getHotelsLength` get the length of the `hotels` array
     * @return {" ": "Length of the hotels array. Might contain zero addresses."}
     */
    function getHotelsLength() public view returns (uint) {
        return this.getOrganizationsLength();
    }

    /**
     * @dev `getHotels` get `hotels` array
     * @return {" ": "Array of hotel addresses. Might contain zero addresses."}
     */
    function getHotels() public view returns (address[] memory) {
        return this.getOrganizations();
    }

    /**
     * @dev `getHotelsByManager` get all the hotels belonging to one manager
     * @param  manager Manager address
     * @return {" ": "Array of hotels belonging to one manager. Might contain zero addresses."}
     */
    function getHotelsByManager(address manager) public view returns (address[] memory) {
        return this.getOrganizationsByManager(manager);
    }

    function hotelsIndex(address hotel) public view returns (uint) {
        return organizationsIndex[hotel];
    }

    function hotels(uint index) public view returns (address) {
        return organizations[index];
    }
}

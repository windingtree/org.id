pragma solidity ^0.5.6;

import "./AbstractWTHotelIndex.sol";
import "./SegmentDirectory.sol";

/**
 * @title WTHotelIndex, registry of all hotels registered on WT
 * @dev The hotels are stored in an array and can be filtered by the owner
 * address.
 */
contract WTHotelIndex is SegmentDirectory, AbstractWTHotelIndex {

    /**
     * @dev `registerHotel` Register new hotel in the index.
     * Emits `HotelRegistered` on success.
     * @param  dataUri Hotel's data pointer
     * @return {" ": "Address of the new hotel."}
     */
    function registerHotel(string calldata dataUri) external returns (address) {
        return registerOrganization(dataUri);
    }

    /**
     * @dev `deleteHotel` Allows a manager to delete a hotel, i. e. call destroy
     * on the target Hotel contract. Emits `HotelDeleted` on success.
     * @param  hotel  Hotel's address
     */
    function deleteHotel(address hotel) external {
        return deleteOrganization(hotel);
    }

    /**
     * @dev `callHotel` Call hotel in the index, the hotel can only
     * be called by its manager. Effectively proxies a hotel call.
     * Emits HotelCalled on success.
     * @param  hotel Hotel's address
     * @param  data Encoded method call to be done on Hotel contract.
     */
    function callHotel(address hotel, bytes calldata data) external {
        return callOrganization(hotel, data);
    }

    /**
     * @dev `transferHotel` Allows to change ownership of
     * the hotel contract. Emits HotelTransferred on success.
     * @param hotel Hotel's address
     * @param newManager Address to which the hotel will belong after transfer.
     */
    function transferHotel(address hotel, address payable newManager) external {
        return transferOrganization(hotel, newManager);
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

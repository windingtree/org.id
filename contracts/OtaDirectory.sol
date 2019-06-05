pragma solidity ^0.5.6;

import "./OtaDirectoryInterface.sol";
import "./SegmentDirectory.sol";

/**
 * @title OtaDirectory
 * @dev The OTAs (Online Travel Agencies) are stored in an array
 */
contract OtaDirectory is OtaDirectoryInterface, SegmentDirectory {

    /**
     * @dev `getOtasLength` proxies getOrganizationsLength
     * @return {" ": "Number of otas. Might contain zero addresses."}
     */
    function getOtasLength() public view returns (uint) {
        return this.getOrganizationsLength();
    }

    /**
     * @dev `getOtas` proxies getOrganizations
     * @return {" ": "List of otas. Might contain zero addresses."}
     */
    function getOtas() public view returns (address[] memory) {
        return this.getOrganizations();
    }

    /**
     * @dev `otasIndex` aliases organizationsIndex 
     * @param  ota Ota's address
     * @return {" ": "Index of ota in the directory list."}
     */
    function otasIndex(address ota) public view returns (uint) {
        return organizationsIndex[ota];
    }

    /**
     * @dev `otas` aliases organizations
     * @param  index Ota's index
     * @return {" ": "Address of ota on given index."}
     */
    function otas(uint index) public view returns (address) {
        return organizations[index];
    }

}

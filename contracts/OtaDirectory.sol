pragma solidity ^0.5.6;

import "./OtaDirectoryInterface.sol";
import "./SegmentDirectory.sol";

/**
 * @title OtaDirectory
 * @dev The OTAs (Online Travel Agencies) are stored in an array
 */
contract OtaDirectory is SegmentDirectory, OtaDirectoryInterface {

    /**
     * @dev `createOta` proxies and externalizes createOrganization
     * @param  dataUri Ota's data pointer
     * @return {" ": "Address of the new ota."}
     */
    function createOta(string calldata dataUri) external returns (address) {
        return createOrganization(dataUri);
    }

    /**
     * @dev `registerOta` proxies and externalizes registerOrganization
     * @param  ota Ota's address
     * @return {" ": "Address of the ota."}
     */
    function registerOta(address ota) external returns (address) {
        return registerOrganization(ota);
    }

    /**
     * @dev `createAndRegisterOta` proxies and externalizes createAndRegisterOrganization
     * @param  dataUri Ota's data pointer
     * @return {" ": "Address of the new ota."}
     */
    function createAndRegisterOta(string calldata dataUri) external returns (address) {
        return createAndRegisterOrganization(dataUri);
    }

    /**
     * @dev `deregisterOta` proxies and externalizes deregisterOrganization
     * @param  ota  Ota's address
     */
    function deregisterOta(address ota) external {
        return deregisterOrganization(ota);
    }

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
     * @dev `otasIndex` aliases organizatoinsIndex 
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

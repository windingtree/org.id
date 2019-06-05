pragma solidity ^0.5.6;

import "../HotelDirectory.sol";
import "./OrganizationUpgradeabilityTest.sol";

contract HotelDirectoryUpgradeabilityTest is HotelDirectory {

    function createAndAdd(string calldata dataUri) external returns (address) {
        OrganizationUpgradeabilityTest newOrganization = new OrganizationUpgradeabilityTest(dataUri);
        address newOrganizationAddress = address(newOrganization);
        organizationsIndex[newOrganizationAddress] = organizations.length;
        organizations.push(newOrganizationAddress);
        emit OrganizationAdded(
            newOrganizationAddress,
            organizationsIndex[newOrganizationAddress]
        );
        return newOrganizationAddress;
    }

    function newFunction() public pure returns(uint) {
        return 100;
    }

}

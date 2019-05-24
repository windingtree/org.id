pragma solidity ^0.5.6;

import "../AirlineDirectory.sol";
import "./OrganizationUpgradeabilityTest.sol";

contract AirlineDirectoryUpgradeabilityTest is AirlineDirectory {

    function createAndRegisterAirline(string calldata dataUri) external returns (address) {
        OrganizationUpgradeabilityTest newOrganization = new OrganizationUpgradeabilityTest(dataUri);
        address newOrganizationAddress = address(newOrganization);
        organizationsIndex[newOrganizationAddress] = organizations.length;
        organizations.push(newOrganizationAddress);
        emit OrganizationRegistered(
            newOrganizationAddress,
            organizationsIndex[newOrganizationAddress]
        );
        return newOrganizationAddress;
    }

    function newFunction() public pure returns(uint) {
        return 100;
    }

}

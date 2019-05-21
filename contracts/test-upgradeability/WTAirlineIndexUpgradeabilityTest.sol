pragma solidity ^0.5.6;

import "../WTAirlineIndex.sol";
import "./AirlineUpgradeabilityTest.sol";


contract WTAirlineIndexUpgradeabilityTest is WTAirlineIndex {

    function createAndRegisterAirline(string calldata dataUri) external returns (address) {
        AirlineUpgradeabilityTest newOrganization = new AirlineUpgradeabilityTest(msg.sender, dataUri, address(this));
        address newOrganizationAddress = address(newOrganization);
        organizationsIndex[newOrganizationAddress] = organizations.length;
        organizations.push(newOrganizationAddress);
        organizationsByManagerIndex[newOrganizationAddress] = organizationsByManager[msg.sender].length;
        organizationsByManager[msg.sender].push(newOrganizationAddress);
        emit OrganizationRegistered(
            newOrganizationAddress,
            organizationsByManagerIndex[newOrganizationAddress],
            organizationsIndex[newOrganizationAddress]
        );
        return newOrganizationAddress;
    }

    function newFunction() public pure returns(uint) {
        return 100;
    }

}

pragma solidity ^0.5.6;

import "../WTAirlineIndex.sol";
import "./AirlineUpgradeabilityTest.sol";


contract WTAirlineIndexUpgradeabilityTest is WTAirlineIndex {

    function createAndRegisterAirline(string calldata dataUri) external returns (address) {
        AirlineUpgradeabilityTest newOrganization = new AirlineUpgradeabilityTest(msg.sender, dataUri);
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

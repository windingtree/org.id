pragma solidity ^0.5.6;

import "../WTHotelIndex.sol";
import "./HotelUpgradeabilityTest.sol";


contract WTHotelIndexUpgradeabilityTest is WTHotelIndex {

    function createAndRegisterHotel(string calldata dataUri) external returns (address) {
        HotelUpgradeabilityTest newOrganization = new HotelUpgradeabilityTest(msg.sender, dataUri, address(this));
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

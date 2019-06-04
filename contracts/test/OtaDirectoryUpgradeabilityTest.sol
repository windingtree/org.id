pragma solidity ^0.5.6;

import "../OtaDirectory.sol";
import "./OrganizationUpgradeabilityTest.sol";

contract OtaDirectoryUpgradeabilityTest is OtaDirectory {
    
    function createAndAddOta(string calldata dataUri) external returns (address) {
        address newOrganizationAddress = address(
            app.create(
                "wt-contracts", 
                "OrganizationUpgradeabilityTest", 
                _owner, 
                abi.encodeWithSignature("initialize(address,string)", msg.sender, dataUri)
            )
        );
        emit OrganizationCreated(newOrganizationAddress);
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

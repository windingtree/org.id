pragma solidity ^0.5.6;

import "../SegmentDirectory.sol";
import "./OrganizationUpgradeabilityTest.sol";

contract SegmentDirectoryUpgradeabilityTest is SegmentDirectory {

    function createAndAdd(string calldata dataUri) external returns (address) {
        address newOrganizationAddress = address(
            app.create(
                "wt-contracts", 
                "OrganizationUpgradeabilityTest", 
                _owner, 
                abi.encodeWithSignature("initialize(address,string)", msg.sender, dataUri)
            )
        );
        _organizationsIndex[newOrganizationAddress] = _organizations.length;
        _organizations.push(newOrganizationAddress);
        emit OrganizationCreated(newOrganizationAddress);
        emit OrganizationAdded(
            newOrganizationAddress,
            _organizationsIndex[newOrganizationAddress]
        );
        return newOrganizationAddress;
    }

    function newFunction() public pure returns(uint) {
        return 100;
    }

}

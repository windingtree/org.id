pragma solidity ^0.5.6;

import "../SegmentDirectory.sol";
import "./OrganizationUpgradeabilityTest.sol";

contract SegmentDirectoryUpgradeabilityTest is SegmentDirectory {

    function createAndAdd(string calldata dataUri) external returns (address) {
        OrganizationUpgradeabilityTest newOrganization = new OrganizationUpgradeabilityTest(dataUri);
        address newOrganizationAddress = address(newOrganization);
        _organizationsIndex[newOrganizationAddress] = _organizations.length;
        _organizations.push(newOrganizationAddress);
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

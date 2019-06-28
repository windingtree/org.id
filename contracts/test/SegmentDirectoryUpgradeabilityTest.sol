pragma solidity ^0.5.6;

import "../SegmentDirectory.sol";
import "./OrganizationUpgradeabilityTest.sol";

contract SegmentDirectoryUpgradeabilityTest is SegmentDirectory {

    function newFunction() public pure returns(uint) {
        return 100;
    }

}

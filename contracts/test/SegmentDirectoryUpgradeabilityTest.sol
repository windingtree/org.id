pragma solidity >=0.5.16;

import "../SegmentDirectory.sol";
import "./OrganizationUpgradeabilityTest.sol";

contract SegmentDirectoryUpgradeabilityTest is SegmentDirectory {

    function newFunction() public pure returns(uint) {
        return 100;
    }

}

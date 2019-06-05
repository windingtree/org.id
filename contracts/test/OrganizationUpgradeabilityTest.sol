pragma solidity ^0.5.6;

import "../Organization.sol";

contract OrganizationUpgradeabilityTest is Organization {

    function newFunction() public pure returns(uint) {
        return 100;
    }

}

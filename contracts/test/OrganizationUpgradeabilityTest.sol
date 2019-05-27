pragma solidity ^0.5.6;

import "../Organization.sol";

contract OrganizationUpgradeabilityTest is Organization {

    constructor(
        string memory _dataUri
    ) Organization(_dataUri) public {}

    function newFunction() public pure returns(uint) {
        return 100;
    }

}

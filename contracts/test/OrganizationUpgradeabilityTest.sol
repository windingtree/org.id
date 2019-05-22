pragma solidity ^0.5.6;

import "../Organization.sol";

contract OrganizationUpgradeabilityTest is Organization {

    constructor(
        address payable _manager,
        string memory _dataUri
    ) Organization(_dataUri) public {
        manager = _manager;
    }

    function newFunction() public pure returns(uint) {
        return 100;
    }

}

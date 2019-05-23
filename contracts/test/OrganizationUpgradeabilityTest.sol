pragma solidity ^0.5.6;

import "../Organization.sol";

contract OrganizationUpgradeabilityTest is Organization {

    constructor(
        address payable _owner,
        string memory _dataUri
    ) Organization(_dataUri) public {
        owner = _owner;
    }

    function newFunction() public pure returns(uint) {
        return 100;
    }

}

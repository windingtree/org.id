pragma solidity ^0.5.6;

import "../OrganizationFactory.sol";

contract OrganizationFactoryUpgradeabilityTest is OrganizationFactory {
    
    function newFunction() public pure returns(uint) {
        return 100;
    }

}
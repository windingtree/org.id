pragma solidity ^0.5.6;

import "../WindingTreeEntrypoint.sol";

contract WindingTreeEntrypointUpgradeabilityTest is WindingTreeEntrypoint {
    
    function newFunction() public pure returns(uint) {
        return 100;
    }

}
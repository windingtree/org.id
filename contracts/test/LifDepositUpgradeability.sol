pragma solidity >=0.5.16;

import "../LifDeposit.sol";

/**
 * @title LifDepositUpgradeability
 * @dev A contract for testing OrgId upgradeability behaviour
 */
contract LifDepositUpgradeability is LifDeposit {
    uint256 public test;

    function newFunction() external view returns (uint256) {
        return test;
    }

    function initialize() external {
        _registerInterface(this.newFunction.selector);// 0x1b28d63e
    }

    function setupNewStorage(uint256 value) external onlyOwner {
        test = value;
    }
}

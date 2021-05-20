// SPDX-License-Identifier: GPL-3.0-only;
pragma solidity 0.5.17;

import "./OrgId_1_1_5.sol";

/**
 * @title OrgIdUpgradeability
 * @dev A contract for testing OrgId upgradeability behaviour
 */
/* solhint-disable contract-name-camelcase */
contract OrgId_1_1_5_Upgradeability is OrgId_1_1_5 {
    uint256 public test;

    function newFunction() external view returns (uint256) {
        return test;
    }

    function initializeNew() external {
        _registerInterface(this.newFunction.selector);// 0x1b28d63e
    }

    function setupNewStorage(uint256 value) external {
        test = value;
    }
}

// SPDX-License-Identifier: GPL-3.0-only;
pragma solidity 0.5.17;

/**
 * @title Ownable smart contract replacement.
 * Required for the saving of the order and composition of variables
 * in the OrgId storage due to upgrade to version 1.1.0
 */
contract OwnablePatch {
    address private _owner;
}

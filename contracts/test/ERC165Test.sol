// SPDX-License-Identifier: GPL-3.0-only;
pragma solidity 0.5.17;

import "../ERC165/ERC165.sol";

/**
 * @title ERC165Test
 * @dev A contract for testing ERC165 behaviour
 */
contract ERC165Test is ERC165 {

    function register(bytes4 interfaceId) external {
        _registerInterface(interfaceId);
    }

    function remove(bytes4 interfaceId) external {
        _removeInterface(interfaceId);
    }
}

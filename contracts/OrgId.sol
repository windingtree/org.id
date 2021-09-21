// SPDX-License-Identifier: GPL-3.0-only;
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
// import "./InitializableVersion.sol";
import "./OrgIdRegistry.sol";

contract OrgId is Initializable, OrgIdRegistry {

  /// @dev OrgId contract initializer
  function initialize()
    external
    initializer
  {
    __ERC721_init("ORGiD", "ORGiD");
    __OrgIdRegistry_init();
  }
}

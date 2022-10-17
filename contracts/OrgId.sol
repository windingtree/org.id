// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
// import "./InitializableVersion.sol";
import "./OrgIdRegistry.sol";
import "./OrgIdDelegates.sol";

/**
 * @dev OrgId contract
 */
contract OrgId is Initializable, OrgIdRegistry, OrgIdDelegates {

  /// @dev OrgId contract initializer
  function initialize()
    external
    initializer
  {
    __ERC721_init("ORGiD", "ORGiD");
    __OrgIdRegistry_init();
  }

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(OrgIdRegistry, OrgIdDelegates)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}

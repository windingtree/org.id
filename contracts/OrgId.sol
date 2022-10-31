// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
// import "./InitializableVersion.sol";
import "./OrgIdFeat.sol";

/**
 * @dev OrgId contract
 */
contract OrgId is Initializable, OrgIdFeat {

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
    override(OrgIdFeat)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  uint256[51] private __gap;
}

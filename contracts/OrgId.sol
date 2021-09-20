// SPDX-License-Identifier: GPL-3.0-only;
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "./InitializableVersion.sol";
import "./OrgIdRegistry.sol";

contract OrgId is InitializableVersion, OrgIdRegistry {
  bytes32 private constant ORGID_V3_DOMAIN = keccak256("ORGID_V3_DOMAIN");

  /// @dev OrgId contract initializer
  function initialize()
    external
    versionInitializer(ORGID_V3_DOMAIN)
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
    override(OrgIdRegistry)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  /**
   * @dev _beforeTokenTransfer override
   */
  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  )
    internal
    override(ERC721EnumerableUpgradeable)
  {
    super._beforeTokenTransfer(from, to, tokenId);
  }
}

// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.17;

import "./IOrgIdRegistry.sol";

/// @dev OrgId interface class with extensions
abstract contract IOrgIdFeat is IOrgIdRegistry {
  /**
   * @dev Create ORGiD with delegates
   * @param salt Unique hash required for identifier creation
   * @param orgJsonUri ORG.JSON URI (stored off-chain)
   * @param dids DIDs of delegates
   *
   * Requirements:
   * - `orgJsonUri` must not be an empty string
   * - `orgId` must not exists
   *
  */
  function createOrgId(
    bytes32 salt,
    string calldata orgJsonUri,
    string[] calldata dids
  )
    external
    virtual;

  /**
   * @dev Changes an ORG.JSON URI with delegates
   * @param orgId ORGiD hash
   * @param orgJsonUri New ORG.JSON URI
   * @param dids DIDs of delegates
   *
   * Requirements:
   * - `orgId` must exists
   * - `orgJsonUri` must not be an empty string
   * - function caller must be an owner of `orgId`
   */
  function setOrgJson(
      bytes32 orgId,
      string calldata orgJsonUri,
      string[] calldata dids
  )
    external
    virtual;
}

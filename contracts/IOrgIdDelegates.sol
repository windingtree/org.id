// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.7;

abstract contract IOrgIdDelegates {
  /**
   * @dev Emits when ORGiD delegates are added
   */
  event OrgIdDelegatesAdded(
    bytes32 indexed orgId,
    string[] delegates
  );

  /**
   * @dev Emits when ORGiD delegates are removed
   */
  event OrgIdDelegatesRemoved(
    bytes32 indexed orgId,
    string[] delegates
  );

  /**
   * Throws when invalid delegates list is provided with calldata
   */
  error InvalidDelegatesInput();

  /**
   * @dev Register delegates in the ORGiD delegates list
   * @param orgId An organization hash
   * @param dids DIDs of delegates
   *
   * Requirements:
   * - `dids` length must not be zero
   * - every `did` in a list must be a non-empty string
   * - ORGiD must exists
   * - must be called by the ORGiD owner
   */
  function addDelegates(bytes32 orgId, string[] memory dids)
    external
    virtual;

  /**
   * @dev Removes delegates from the ORGiD delegates list
   * @param orgId An organization hash
   * @param dids DIDs of delegates to remove
   *
   * Requirements:
   * - `dids` length must not be zero
   * - every `did` in a list must be a non-empty string
   * - ORGiD must exists
   * - must be called by the ORGiD owner
   */
  function removeDelegates(bytes32 orgId, string[] memory dids)
    external
    virtual;

  /**
   * @dev Removes all delegates from the ORGiD delegates list
   * @param orgId An organization hash
   *
   * Requirements:
   * - ORGiD must exists
   * - ORGiD must have registered delegates
   * - must be called by the ORGiD owner
   */
  function removeDelegates(bytes32 orgId)
    external
    virtual;

  /**
   * @dev Returns registered ORGiD delegates
   * @param orgId An organization hash
   * @return dids Array of registered ORGiDs' delegates
   */
  function getDelegates(bytes32 orgId)
    external
    view
    virtual
    returns (string[] memory dids);
}

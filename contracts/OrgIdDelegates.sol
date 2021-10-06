// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.7;

import "./OrgIdRegistry.sol";
import "./IOrgIdDelegates.sol";
import "./libraries/StringsSet.sol";

abstract contract OrgIdDelegates is IOrgIdDelegates, OrgIdRegistry {
  using StringsSet for StringsSet.Set;

  /// @dev Mapping of a organization hash to delegates list
  mapping (bytes32 => StringsSet.Set) private _delegates;

  /**
   * @dev Prevents function execution if ORGiD not found
   */
  modifier existedOrgId(bytes32 orgId) {
    if (!isOrgIdExists(orgId)) {
      revert OrgIdNotFound(orgId);
    }
    _;
  }

  /**
   * @dev See {IERC165-supportsInterface(bytes4)}
   */
  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(OrgIdRegistry)
    returns (bool)
  {
    return interfaceId == type(IOrgIdDelegates).interfaceId
      || super.supportsInterface(interfaceId);
  }

  /**
   * @dev See {IOrgIdDelegates-addDelegates(bytes32,string[])}
   */
  function addDelegates(bytes32 orgId, string[] memory dids)
    external
    virtual
    override
    existedOrgId(orgId)
    onlyOrgIdOwner(orgId)
  {
    if (dids.length == 0) {
      revert InvalidDelegatesInput();
    }

    bool result;

    for (uint256 i = 0; i < dids.length; i++) {
      result = _delegates[orgId].add(dids[i]);

      if (!result) {
        revert InvalidDelegatesInput();
      }
    }
  }

  /**
   * @dev See {IOrgIdDelegates-removeDelegates(bytes32,string[])}
   */
  function removeDelegates(bytes32 orgId, string[] memory dids)
    external
    virtual
    override
    existedOrgId(orgId)
    onlyOrgIdOwner(orgId)
  {
    if (dids.length == 0) {
      revert InvalidDelegatesInput();
    }

    bool result;

    for (uint256 i = 0; i < dids.length; i++) {
      result = _delegates[orgId].remove(dids[i]);

      if (!result) {
        revert InvalidDelegatesInput();
      }
    }
  }

  /**
   * @dev See {IOrgIdDelegates-removeDelegates(bytes32)}
   */
  function removeDelegates(bytes32 orgId)
    external
    virtual
    override
    existedOrgId(orgId)
    onlyOrgIdOwner(orgId)
  {
    bool result = _delegates[orgId].removeAll();

    if (!result) {
      revert InvalidDelegatesInput();
    }
  }

  /**
   * @dev See IOrgIdDelegates-getDelegates
   */
  function getDelegates(bytes32 orgId)
    external
    view
    virtual
    override
    returns (string[] memory dids)
  {
    dids = _delegates[orgId].get();
  }
}

// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.17;

import "./OrgIdRegistry.sol";
import "./OrgIdDelegates.sol";
import "./IOrgIdFeat.sol";

/**
 * @dev OrgIdRegistry contract
 */
abstract contract OrgIdFeat is IOrgIdFeat, OrgIdRegistry, OrgIdDelegates {

  /**
   * @dev See {IOrgIdFeat-createOrgId(bytes32,string,string[])}.
   */
  function createOrgId(
    bytes32 salt,
    string calldata orgJsonUri,
    string[] calldata dids
  )
    external
    virtual
    override
  {
    bytes32 orgId = createOrgId(salt, orgJsonUri);

    if (dids.length > 0) {
      addDelegates(orgId, dids);
    }
  }

  /**
   * @dev See {IOrgIdFeat-setOrgJson(bytes32,string,string[])}.
   */
  function setOrgJson(
      bytes32 orgId,
      string calldata orgJsonUri,
      string[] calldata dids
  )
    external
    virtual
    override
  {
    setOrgJson(orgId, orgJsonUri);

    if (getDelegates(orgId).length > 0) {
      removeDelegates(orgId);
    }

    if (dids.length > 0) {
      addDelegates(orgId, dids);
    }
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

  uint256[51] private __gap;
}

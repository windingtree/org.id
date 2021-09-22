// SPDX-License-Identifier: GPL-3.0-only;
pragma solidity ^0.8.7;

import "../OrgId.sol";
import "../InitializableVersion.sol";

contract OrgIdUpgradeabilityTest is OrgId, InitializableVersion {
  bytes32 private constant ORGID_V2_DOMAIN = keccak256("ORGID_V2_DOMAIN");
  string private _version;

  // solhint-disable-next-line func-name-mixedcase
  function __OrgIdV2_init()
    public
    versionInitializer(ORGID_V2_DOMAIN)
  {
    _version = "V2";
  }

  function version() external view returns (string memory) {
    return _version;
  }
}

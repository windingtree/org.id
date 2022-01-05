// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.7;

abstract contract InitializableVersion {
  /// @dev Versions store
  mapping(bytes32 => bool) private _versions;

  /**
   * @dev Throws when contract has been already initialized
   */
  error ContractAlreadyInitialized(bytes32 versionDomain);

  /**
   * @dev Modifier to prevent calling of initializers twice
   */
  modifier versionInitializer(bytes32 version) {
    if (_versions[version]) {
      revert ContractAlreadyInitialized(version);
    }
    _;

    // then updating the storage, so the next call with same argument will fail
    _versions[version] = true;
  }

  uint256[50] private __gap;
}

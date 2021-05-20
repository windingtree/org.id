// SPDX-License-Identifier: GPL-3.0-only;
pragma solidity 0.5.17;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "./ERC165/ERC165.sol";
import "./OwnablePatch.sol";

/**
 * @title Old ORGiD Registry Smart Contract
 */
/* solhint-disable contract-name-camelcase */
contract OrgId_1_1_5_Storage is OwnablePatch, ERC165, Initializable {

    using SafeMath for uint256;

    /// @dev Organization structure
    struct Organization {
        bytes32 orgId;
        bytes32 orgJsonHash;
        string orgJsonUri;
        string orgJsonUriBackup1;
        string orgJsonUriBackup2;
        bytes32 parentOrgId;
        address owner;
        address director;
        bool isActive;
        bool isDirectorshipAccepted;
        bytes32[] units;
    }

    /// @dev Mapped list of Organizations
    mapping (bytes32 => Organization) internal organizations;

    /// @dev List of ORGiD hashes
    bytes32[] internal orgIds;
}

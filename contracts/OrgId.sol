// SPDX-License-Identifier: GPL-3.0-only;
pragma solidity 0.5.17;

import "./OrgId_1_1_5.sol";
import "./OrgIdInterface.sol";


/**
 * @title ORGiD Registry Smart Contract
 */
contract OrgId is OrgId_1_1_5, OrgIdInterface {

    /// @dev Mapped list of Organizations
    mapping (bytes32 => address) internal organizationsList;

    /// orgIds storage is already defined in the parent contract
    // bytes32[] internal orgIds;

    // event OrganizationCreated is defined in the parent contract

    /**
     * @dev Emits when ORG.JSON changes
     */
    event OrgJsonUriChanged(
        bytes32 indexed orgId,
        string previousOrgJsonUri
    );

    /**
     * @dev Emits when ORGiD owner changes
     */
    event OrgIdOwnershipTransferred(
        bytes32 indexed orgId,
        address indexed previousOwner,
        address indexed newOwner
    );

    /**
     * @dev Throws if ORGiD does not exist
     */
    modifier orgIdMustExist(bytes32 orgId) {
        require(
            orgId != bytes32(0) &&
            organizationsList[orgId] != address(0),
            "OrgId: Organization not found"
        );
        _;
    }

    /**
     * @dev Throws if ORGiD called not by an owner
     */
    modifier mustBeCalledByOwner(bytes32 orgId) {
        require(
            organizationsList[orgId] == msg.sender,
            "OrgId: called not by an owner"
        );
        _;
    }

    /**
     * @dev Initializer for the version 2.0.0
     */
    /* solhint-disable func-name-mixedcase */
    function initializeUpgrade_2_0_0() public {
        // Remove old OrgId interface
        _removeInterface(0x0f4893ef);
        // Remove hierarchy interface
        _removeInterface(0x6af2fb27);

        // Register new OrgId interface: 0xb60f258f
        OrgIdInterface org;
        _registerInterface(
            org.createOrgId.selector ^
            org.transferOrgIdOwnership.selector
        );

        // Migrate OrgIds structures to the new mapping style
        for (uint256 i = 0; i < orgIds.length; i++) {
            organizationsList[orgIds[i]] = organizations[orgIds[i]].owner;

            // Remove organization structure from the storage
            delete organizations[orgIds[i]];
        }
    }

    /**
     * @dev Create organization Id
     * @param salt Unique hash required for identifier creation
     * @param orgJsonUri ORG.JSON URI (stored off-chain)
     * @return {
         "orgId": "ORGiD byte32 hash"
     }
     */
    function createOrgId(
        bytes32 salt,
        string calldata orgJsonUri
    ) external returns (bytes32 orgId) {
        // Organization unique Id creation
        orgId = keccak256(
            abi.encodePacked(
                msg.sender,
                salt
            )
        );

        require(
            organizationsList[orgId] == address(0),
            "OrgId: Organization already exists"
        );

        organizationsList[orgId] = msg.sender;
        orgIds.push(orgId);

        emit OrgJsonUriChanged(
            orgId,
            orgJsonUri
        );

        emit OrganizationCreated(orgId, msg.sender);
    }

    /**
     * @dev Ownership transfer
     * @param orgId ORGiD hash
     * @param newOwner New owner's address
     */
    function transferOrgIdOwnership(
        bytes32 orgId,
        address newOwner
    )
        external
        orgIdMustExist(orgId)
        mustBeCalledByOwner(orgId)
    {
        require(
            newOwner != address(0),
            "OrgId: Invalid owner address"
        );

        emit OrgIdOwnershipTransferred(
            orgId,
            organizationsList[orgId],
            newOwner
        );
        organizationsList[orgId] = newOwner;
    }

    /**
     * @dev Shorthand method to change ORG.JSON URI and hash at once
     * @param orgId ORGiD hash
     * @param orgJsonUri New ORG.JSON URI
     */
    function setOrgJson(
        bytes32 orgId,
        string calldata orgJsonUri
    )
        external
        orgIdMustExist(orgId)
        mustBeCalledByOwner(orgId)
    {
        require(
            bytes(orgJsonUri).length != 0,
            "OrgId: orgJsonUri cannot be empty"
        );

        emit OrgJsonUriChanged(
            orgId,
            orgJsonUri
        );
    }

    /**
     * @dev Check ORGiD existence
     * @param _orgId ORGiD hash
     * @dev Return parameters marked by (*) are only applicable to units
     * @return ORGiD existence
     */
    function getOrgId(bytes32 _orgId)
        external
        view
        returns (
            bool exists,
            address owner
        )
    {
        exists = _orgId != bytes32(0) && organizationsList[_orgId] != address(0);
        owner = organizationsList[_orgId];
    }

    /**
     * @dev Get all organizations' ORGiD hashes
     * @return {
         "organizationsList": "Array of all organizations' ORGiD hashes"
     }
     */
    function getOrgIds()
        external
        view
        returns (bytes32[] memory)
    {
        return orgIds;
    }
}

// SPDX-License-Identifier: GPL-3.0-only;
pragma solidity 0.5.17;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "./ERC165/ERC165.sol";
import "./OwnablePatch.sol";
import "./OrgIdInterface_1_1_5.sol";

/**
 * @title ORGiD Registry Smart Contract
 */
/* solhint-disable contract-name-camelcase */
contract OrgId_1_1_5 is OrgIdInterface_1_1_5, OwnablePatch, ERC165, Initializable {

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

    /**
     * @dev Emits when new organization created
     */
    event OrganizationCreated(
        bytes32 indexed orgId,
        address indexed owner
    );

    /**
     * @dev Emits when new organizational unit created
     */
    event UnitCreated(
        bytes32 indexed parentOrgId,
        bytes32 indexed unitOrgId,
        address indexed director
    );

    /**
     * @dev Emits when organization active/inactive state changes
     */
    event OrganizationActiveStateChanged(
        bytes32 indexed orgId,
        bool previousState,
        bool newState
    );

    /**
     * @dev Emits when unit's directorship is accepted
     */
    event DirectorshipAccepted(
        bytes32 indexed orgId,
        address indexed director
    );

    /**
     * @dev Emits when unit's director changes
     */
    event DirectorshipTransferred(
        bytes32 indexed orgId,
        address indexed previousDirector,
        address indexed newDirector
    );

    /**
     * @dev Emits when ORGiD owner changes
     */
    event OrganizationOwnershipTransferred(
        bytes32 indexed orgId,
        address indexed previousOwner,
        address indexed newOwner
    );

    /**
     * @dev Emits when ORG.JSON changes
     */
    event OrgJsonChanged(
        bytes32 indexed orgId,
        bytes32 indexed previousOrgJsonHash,
        string previousOrgJsonUri,
        string previousOrgJsonUriBackup1,
        string previousOrgJsonUriBackup2,
        bytes32 indexed newOrgJsonHash,
        string newOrgJsonUri,
        string newOrgJsonUriBackup1,
        string newOrgJsonUriBackup2
    );

    /**
     * @dev Throws if ORGiD does not exist
     */
    modifier orgIdMustExist(bytes32 orgId) {
        require(
            orgId != bytes32(0) &&
            organizations[orgId].orgId == orgId,
            "OrgId: Organization not found"
        );
        _;
    }

    /**
     * @dev Throws if called by non-owner
     */
    modifier mustBeCalledByOwner(bytes32 orgId) {
        require(
            organizations[orgId].owner == msg.sender,
            "OrgId: action not authorized (must be owner)"
        );
        _;
    }

    /**
     * @dev Throws if called by non-director
     */
    modifier mustBeCalledByOwnerOrDirector(bytes32 orgId) {
        require(
            organizations[orgId].owner == msg.sender ||
            organizations[orgId].director == msg.sender,
            "OrgId: action not authorized (must be owner or director)"
        );
        _;
    }

    /**
     * @dev Initializer for upgradeable contracts
     */
    function initialize() public initializer {
        _setInterfaces();
    }

    /**
     * @dev Initializer for the version 1.1.0
     */
    function initializeUpgrade110() public {
        // ownable interface has been removed in version 1.1.0
        _removeInterface(0x7f5828d0);
    }

    /**
     * @dev Create organization
     * @param salt Unique hash required for identifier creation
     * @param orgJsonHash ORG.JSON's keccak256 hash
     * @param orgJsonUri ORG.JSON URI (stored off-chain)
     * @param orgJsonUriBackup1 ORG.JSON URI backup (stored off-chain)
     * @param orgJsonUriBackup2 ORG.JSON URI backup (stored off-chain)
     * @return {
         "id": "ORGiD byte32 hash"
     }
     */
    function createOrganization(
        bytes32 salt,
        bytes32 orgJsonHash,
        string calldata orgJsonUri,
        string calldata orgJsonUriBackup1,
        string calldata orgJsonUriBackup2
    ) external returns (bytes32 id) {
        id = _createOrganization(
            salt,
            bytes32(0),
            address(0),
            orgJsonHash,
            orgJsonUri,
            orgJsonUriBackup1,
            orgJsonUriBackup2
        );
        emit OrganizationCreated(id, msg.sender);
    }

    /**
     * @dev Create organizational unit
     * @param salt Unique hash required for identifier creation
     * @param parentOrgId Parent ORGiD hash
     * @param director Unit director address
     * @param orgJsonHash ORG.JSON keccak256 hash
     * @param orgJsonUri Unit ORG.JSON URI
     * @param orgJsonUriBackup1 Unit ORG.JSON URI backup
     * @param orgJsonUriBackup2 Unit ORG.JSON URI backup
     */
    function createUnit(
        bytes32 salt,
        bytes32 parentOrgId,
        address director,
        bytes32 orgJsonHash,
        string calldata orgJsonUri,
        string calldata orgJsonUriBackup1,
        string calldata orgJsonUriBackup2
    )
        external
        orgIdMustExist(parentOrgId)
        mustBeCalledByOwner(parentOrgId)
        returns (bytes32 newUnitOrgId)
    {
        newUnitOrgId = _createOrganization(
            salt,
            parentOrgId,
            director,
            orgJsonHash,
            orgJsonUri,
            orgJsonUriBackup1,
            orgJsonUriBackup2
        );
        emit UnitCreated(parentOrgId, newUnitOrgId, director);

        // If parent ORGiD owner indicates their address as director,
        // their directorship is automatically accepted
        if (director == msg.sender) {
            emit DirectorshipAccepted(newUnitOrgId, msg.sender);
        }
    }

    /**
     * @dev Toggle ORGiD's active/inactive state
     * @param orgId ORGiD hash
     */
    function toggleActiveState(bytes32 orgId)
        external
        orgIdMustExist(orgId)
        mustBeCalledByOwner(orgId)
    {
        emit OrganizationActiveStateChanged(
            orgId,
            organizations[orgId].isActive,
            !organizations[orgId].isActive
        );
        organizations[orgId].isActive = !organizations[orgId].isActive;
    }

    /**
     * @dev Accept director role
     * @param orgId Unit's ORGiD hash
     */
    function acceptDirectorship(bytes32 orgId)
        external
        orgIdMustExist(orgId)
    {
        require(
            organizations[orgId].director == msg.sender,
            "OrgId: action not authorized (must be director)"
        );

        _acceptDirectorship(orgId);
    }

    /**
     * @dev Unit directorship transfer
     * @param orgId Unit's ORGiD hash
     * @param newDirector New director's address
     */
    function transferDirectorship(
        bytes32 orgId,
        address newDirector
    )
        external
        orgIdMustExist(orgId)
        mustBeCalledByOwner(orgId)
    {
        emit DirectorshipTransferred(
            orgId,
            organizations[orgId].director,
            newDirector
        );
        organizations[orgId].director = newDirector;

        if (newDirector == msg.sender) {
            organizations[orgId].isDirectorshipAccepted = true;
            emit DirectorshipAccepted(orgId, newDirector);
        } else {
            organizations[orgId].isDirectorshipAccepted = false;
        }
    }

    /**
     * @dev Unit directorship renounce
     * @param orgId Unit's ORGiD hash
     */
    function renounceDirectorship(bytes32 orgId)
        external
        orgIdMustExist(orgId)
        mustBeCalledByOwnerOrDirector(orgId)
    {
        emit DirectorshipTransferred(
            orgId,
            organizations[orgId].director,
            address(0)
        );

        organizations[orgId].director = address(0);
        organizations[orgId].isDirectorshipAccepted = false;
    }

    /**
     * @dev Ownership transfer
     * @param orgId ORGiD hash
     * @param newOwner New owner's address
     */
    function transferOrganizationOwnership(
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

        emit OrganizationOwnershipTransferred(
            orgId,
            organizations[orgId].owner,
            newOwner
        );
        organizations[orgId].owner = newOwner;
    }

    /**
     * @dev Shorthand method to change ORG.JSON URI and hash at once
     * @param orgId ORGiD hash
     * @param orgJsonHash New ORG.JSON's keccak256 hash
     * @param orgJsonUri New ORG.JSON URI
     * @param orgJsonUriBackup1 New ORG.JSON URI backup
     * @param orgJsonUriBackup2 New ORG.JSON URI backup
     */
    function setOrgJson(
        bytes32 orgId,
        bytes32 orgJsonHash,
        string calldata orgJsonUri,
        string calldata orgJsonUriBackup1,
        string calldata orgJsonUriBackup2
    )
        external
        orgIdMustExist(orgId)
        mustBeCalledByOwnerOrDirector(orgId)
    {
        require(
            orgJsonHash != bytes32(0),
            "OrgId: ORG.JSON hash cannot be zero"
        );
        require(
            bytes(orgJsonUri).length != 0,
            "OrgId: ORG.JSON URI cannot be empty"
        );

        if (msg.sender == organizations[orgId].director &&
            organizations[orgId].isDirectorshipAccepted == false) {
            _acceptDirectorship(orgId);
        }

        _updateOrgJson(
            orgId,
            orgJsonHash,
            orgJsonUri,
            orgJsonUriBackup1,
            orgJsonUriBackup2
        );
    }

    /**
     * @dev Get all active organizations' ORGiD hashes
     * @param includeInactive Includes not active organizations into response
     * @return {
         "organizationsList": "Array of all active organizations' ORGiD hashes"
     }
     */
    function getOrganizations(bool includeInactive)
        external
        view
        returns (bytes32[] memory)
    {
        return _getOrganizations(bytes32(0), includeInactive);
    }

    /**
     * @dev Get organization or unit's info by ORGiD hash
     * @param _orgId ORGiD hash
     * @dev Return parameters marked by (*) are only applicable to units
     * @return {
         "exists": "Returns `false` if ORGiD doesn't exist",
         "orgId": "ORGiD hash",
         "orgJsonHash": "ORG.JSON keccak256 hash",
         "orgJsonUri": "ORG.JSON URI",
         "orgJsonUriBackup1": "ORG.JSON URI backup",
         "orgJsonUriBackup2": "ORG.JSON URI backup",
         "parentOrgId": "Parent ORGiD (*)",
         "owner": "Owner's address",
         "director": "Unit director's address (*)",
         "isActive": "Indicates whether ORGiD is active",
         "isDirectorshipAccepted": "Indicates whether director accepted the role (*)"
     }
     */
    function getOrganization(bytes32 _orgId)
        external
        view
        returns (
            bool exists,
            bytes32 orgId,
            bytes32 orgJsonHash,
            string memory orgJsonUri,
            string memory orgJsonUriBackup1,
            string memory orgJsonUriBackup2,
            bytes32 parentOrgId,
            address owner,
            address director,
            bool isActive,
            bool isDirectorshipAccepted
        )
    {
        exists = _orgId != bytes32(0) && organizations[_orgId].orgId == _orgId;
        orgId = organizations[_orgId].orgId;
        orgJsonHash = organizations[_orgId].orgJsonHash;
        orgJsonUri = organizations[_orgId].orgJsonUri;
        orgJsonUriBackup1 = organizations[_orgId].orgJsonUriBackup1;
        orgJsonUriBackup2 = organizations[_orgId].orgJsonUriBackup2;
        parentOrgId = organizations[_orgId].parentOrgId;
        owner = organizations[_orgId].owner;
        director = organizations[_orgId].director;
        isActive = organizations[_orgId].isActive;
        isDirectorshipAccepted = organizations[_orgId].isDirectorshipAccepted;
    }

    /**
     * @dev Get all active organizational units of a particular ORGiD
     * @param parentOrgId Parent ORGiD hash
     * @param includeInactive Includes not active units into response
     * @return {
         "organizationsList": "Array of ORGiD hashes of active organizational units"
     }
     */
    function getUnits(bytes32 parentOrgId, bool includeInactive)
        external
        view
        orgIdMustExist(parentOrgId)
        returns (bytes32[] memory)
    {
        return _getOrganizations(parentOrgId, includeInactive);
    }

    /**
     * @dev Set supported contract interfaces
     */
    function _setInterfaces() internal {
        OrgIdInterface_1_1_5 org;
        bytes4[3] memory interfaceIds = [
            // ERC165 interface: 0x01ffc9a7
            bytes4(0x01ffc9a7),

            // ORGiD interface: 0x0f4893ef
            org.createOrganization.selector ^
            org.toggleActiveState.selector ^
            org.transferOrganizationOwnership.selector ^
            org.setOrgJson.selector ^
            org.getOrganizations.selector ^
            org.getOrganization.selector,

            // hierarchy interface: 0x6af2fb27
            org.createUnit.selector ^
            org.acceptDirectorship.selector ^
            org.transferDirectorship.selector ^
            org.renounceDirectorship.selector ^
            org.getUnits.selector
        ];
        for (uint256 i = 0; i < interfaceIds.length; i++) {
            _registerInterface(interfaceIds[i]);
        }
    }

    /**
     * @dev Create new organization and add it to storage
     * @param salt Unique hash required for identifier creation
     * @param parentOrgId Parent ORGiD hash (if applicable)
     * @param director Unit director address (if applicable)
     * @param orgJsonHash ORG.JSON keccak256 hash
     * @param orgJsonUri ORG.JSON URI
     * @param orgJsonUriBackup1 ORG.JSON URI backup
     * @param orgJsonUriBackup2 ORG.JSON URI backup
     * @return {
         "ORGiD": "New ORGiD hash"
     }
     */
    function _createOrganization(
        bytes32 salt,
        bytes32 parentOrgId,
        address director,
        bytes32 orgJsonHash,
        string memory orgJsonUri,
        string memory orgJsonUriBackup1,
        string memory orgJsonUriBackup2
    ) internal returns (bytes32) {
        require(
            parentOrgId == bytes32(0) ||
            (
                // If this is a unit...
                parentOrgId != bytes32(0) &&
                organizations[parentOrgId].orgId == parentOrgId
            ),
            "OrgId: Parent ORGiD not found"
        );

        // Organization unique Id creation
        bytes32 orgId = keccak256(
            abi.encodePacked(
                msg.sender,
                salt
            )
        );

        require(
            organizations[orgId].orgId == bytes32(0),
            "OrgId: Organization already exists"
        );

        organizations[orgId] = Organization(
            orgId,
            orgJsonHash,
            orgJsonUri,
            orgJsonUriBackup1,
            orgJsonUriBackup2,
            parentOrgId,
            msg.sender,
            director,
            true,
            director == msg.sender ||
                (parentOrgId != bytes32(0) && director == address(0)),
            new bytes32[](0)
        );
        orgIds.push(orgId);

        if (parentOrgId != bytes32(0)) {
            organizations[parentOrgId].units.push(orgId);
        }

        return orgId;
    }

    /**
     * @dev Get all active organizations' ORGiD hashes in the registry (if no input provided)
     * @dev OR, if input is a valid ORGiD, get all active units' ORGiD hashes
     * @param orgId ORGiD hash or zero bytes
     * @param includeInactive Includes not active organizations into response
     * @return {
         "organizationsList": "Array of ORGiD hashes"
     }
     */
    function _getOrganizations(bytes32 orgId, bool includeInactive)
        internal
        view
        returns (bytes32[] memory organizationsList)
    {
        bytes32[] memory source =
            orgId == bytes32(0)
            ? orgIds
            : organizations[orgId].units;
        organizationsList = new bytes32[](_getOrganizationsCount(orgId, includeInactive));
        uint256 index;

        for (uint256 i = 0; i < source.length; i++) {
            // If organization is active (OR  not active) AND
            // organization is top level (not unit) OR
            // organization is a unit AND directorship is accepted
            if ((
                    (!includeInactive && organizations[source[i]].isActive) ||
                    includeInactive
                ) &&
                (
                    (orgId == bytes32(0) && organizations[source[i]].parentOrgId == bytes32(0)) ||
                    orgId != bytes32(0)
                )) {

                organizationsList[index] = source[i];
                index += 1;
            }
        }
    }

    /**
     * @dev Get a number of active organizations in the registry (if input is zero bytes)
     * @dev OR, if input is a valid ORGiD, get a number of active organizational units
     * @param orgId ORGiD hash or zero bytes
     * @param includeInactive Includes not active organizations into response
     * @return {
         "count": "ORGiD count"
     }
     */
    function _getOrganizationsCount(bytes32 orgId, bool includeInactive)
        internal
        view
        returns (uint256 count)
    {
        bytes32[] memory source =
            orgId == bytes32(0)
            ? orgIds
            : organizations[orgId].units;

        for (uint256 i = 0; i < source.length; i++) {
            if ((
                    (!includeInactive && organizations[source[i]].isActive) ||
                    includeInactive
                ) &&
                (
                    (orgId == bytes32(0) && organizations[source[i]].parentOrgId == bytes32(0)) ||
                    orgId != bytes32(0)
                )) {

                count += 1;
            }
        }
    }

    /**
     * @dev Unit directorship acceptance
     * @param orgId ORGiD hash
     */
    function _acceptDirectorship(bytes32 orgId) internal {
        organizations[orgId].isDirectorshipAccepted = true;
        emit DirectorshipAccepted(orgId, msg.sender);
    }

    /**
     * @dev ORG.JSON storage update
     * @param orgId ORGiD hash
     * @param orgJsonHash ORG.JSON keccak256 hash
     * @param orgJsonUri ORG.JSON URI
     * @param orgJsonUriBackup1 ORG.JSON URI backup
     * @param orgJsonUriBackup2 ORG.JSON URI backup
     */
    function _updateOrgJson(
        bytes32 orgId,
        bytes32 orgJsonHash,
        string memory orgJsonUri,
        string memory orgJsonUriBackup1,
        string memory orgJsonUriBackup2
    ) internal {
        emit OrgJsonChanged(
            orgId,
            organizations[orgId].orgJsonHash,
            organizations[orgId].orgJsonUri,
            organizations[orgId].orgJsonUriBackup1,
            organizations[orgId].orgJsonUriBackup2,
            orgJsonHash,
            orgJsonUri,
            orgJsonUriBackup1,
            orgJsonUriBackup2
        );

        organizations[orgId].orgJsonHash = orgJsonHash;
        organizations[orgId].orgJsonUri = orgJsonUri;
        organizations[orgId].orgJsonUriBackup1 = orgJsonUriBackup1;
        organizations[orgId].orgJsonUriBackup2 = orgJsonUriBackup2;
    }
}

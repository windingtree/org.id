pragma solidity >=0.5.16;

import "@openzeppelin/contracts/introspection/ERC165.sol";
import "@openzeppelin/contracts/introspection/ERC165Checker.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "./OrgIdInterface.sol";

/**
 * @title ORG.ID Registry Smart Contract
 */
contract OrgId is OrgIdInterface, Ownable, ERC165, Initializable {

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

    /// @dev List of ORG.ID hashes
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
     * @dev Emits when ORG.ID owner changes
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
     * @dev Throws if ORG.ID does not exist
     */
    modifier orgIdMustExist(bytes32 orgId) {
        require(
            orgId != bytes32(0) &&
            organizations[orgId].orgId == orgId,
            "ORG.ID: Organization not found"
        );
        _;
    }

    /**
     * @dev Throws if called by non-owner
     */
    modifier mustBeCalledByOwner(bytes32 orgId) {
        require(
            organizations[orgId].owner == msg.sender,
            "ORG.ID: action not authorized (must be owner)"
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
            "ORG.ID: action not authorized (must be owner or director)"
        );
        _;
    }

    /**
     * @dev Initializer for upgradeable contracts
     * @param __owner Contract owner's address
     */
    function initialize(
        address payable __owner
    ) public initializer {
        _transferOwnership(__owner);
        setInterfaces();
    }

    /**
     * @dev Create organization
     * @param orgJsonHash ORG.JSON's keccak256 hash
     * @param orgJsonUri ORG.JSON URI (stored off-chain)
     * @param orgJsonUriBackup1 ORG.JSON URI backup (stored off-chain)
     * @param orgJsonUriBackup2 ORG.JSON URI backup (stored off-chain)
     * @return {
         "id": "ORG.ID byte32 hash"
     }
     */
    function createOrganization(
        bytes32 orgJsonHash,
        string calldata orgJsonUri,
        string calldata orgJsonUriBackup1,
        string calldata orgJsonUriBackup2
    ) external returns (bytes32 id) {
        id = _createOrganization(
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
     * @param parentOrgId Parent ORG.ID hash
     * @param director Unit director address
     * @param orgJsonHash ORG.JSON keccak256 hash
     * @param orgJsonUri Unit ORG.JSON URI
     * @param orgJsonUriBackup1 Unit ORG.JSON URI backup
     * @param orgJsonUriBackup2 Unit ORG.JSON URI backup
     */
    function createUnit(
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
            parentOrgId,
            director,
            orgJsonHash,
            orgJsonUri,
            orgJsonUriBackup1,
            orgJsonUriBackup2
        );
        emit UnitCreated(parentOrgId, newUnitOrgId, director);

        // If parent ORG.ID owner indicates their address as director,
        // their directorship is automatically accepted
        if (director == msg.sender) {
            emit DirectorshipAccepted(newUnitOrgId, msg.sender);
        }
    }

    /**
     * @dev Toggle ORG.ID's active/inactive state
     * @param orgId ORG.ID hash
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
     * @param orgId Unit's ORG.ID hash
     */
    function acceptDirectorship(bytes32 orgId)
        external
        orgIdMustExist(orgId)
    {
        require(
            organizations[orgId].director == msg.sender,
            "ORG.ID: action not authorized (must be director)"
        );

        _acceptDirectorship(orgId);
    }

    /**
     * @dev Unit directorship transfer
     * @param orgId Unit's ORG.ID hash
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
     * @param orgId Unit's ORG.ID hash
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
        organizations[orgId].isDirectorshipAccepted = true;
    }

    /**
     * @dev Ownership transfer
     * @param orgId ORG.ID hash
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
            "ORG.ID: Invalid owner address"
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
     * @param orgId ORG.ID hash
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
            "ORG.ID: ORG.JSON hash cannot be zero"
        );
        require(
            bytes(orgJsonUri).length != 0,
            "ORG.ID: ORG.JSON URI cannot be empty"
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
     * @dev Get all active organizations' ORG.ID hashes
     * @param includeInactive Includes not active organizations into response
     * @return {
         "organizationsList": "Array of all active organizations' ORG.ID hashes"
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
     * @dev Get organization or unit's info by ORG.ID hash
     * @param _orgId ORG.ID hash
     * @dev Return parameters marked by (*) are only applicable to units
     * @return {
         "exists": "Returns `false` if ORG.ID doesn't exist",
         "ORG.ID": "ORG.ID hash",
         "orgJsonHash": "ORG.JSON keccak256 hash",
         "orgJsonUri": "ORG.JSON URI",
         "orgJsonUriBackup1": "ORG.JSON URI backup",
         "orgJsonUriBackup2": "ORG.JSON URI backup",
         "parentOrgId": "Parent ORG.ID (*)",
         "owner": "Owner's address",
         "director": "Unit director's address (*)",
         "isActive": "Indicates whether ORG.ID is active",
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
     * @dev Get all active organizational units of a particular ORG.ID
     * @param parentOrgId Parent ORG.ID hash
     * @param includeInactive Includes not active units into response
     * @return {
         "organizationsList": "Array of ORG.ID hashes of active organizational units"
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
    function setInterfaces() public {
        OrgIdInterface org;
        Ownable own;
        bytes4[4] memory interfaceIds = [
            // ERC165 interface: 0x01ffc9a7
            bytes4(0x01ffc9a7),

            // ownable interface: 0x7f5828d0
            own.owner.selector ^
            own.transferOwnership.selector,

            // ORG.ID interface: 0x212862a6
            org.createOrganization.selector ^
            org.toggleActiveState.selector ^
            org.transferOrganizationOwnership.selector ^
            org.setOrgJson.selector ^
            org.getOrganizations.selector ^
            org.getOrganization.selector,

            // hierarchy interface: 0x326bc55f
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
     * @param parentOrgId Parent ORG.ID hash (if applicable)
     * @param director Unit director address (if applicable)
     * @param orgJsonHash ORG.JSON keccak256 hash
     * @param orgJsonUri ORG.JSON URI
     * @param orgJsonUriBackup1 ORG.JSON URI backup
     * @param orgJsonUriBackup2 ORG.JSON URI backup
     * @return {
         "ORG.ID": "New ORG.ID hash"
     }
     */
    function _createOrganization(
        bytes32 parentOrgId,
        address director,
        bytes32 orgJsonHash,
        string memory orgJsonUri,
        string memory orgJsonUriBackup1,
        string memory orgJsonUriBackup2
    ) internal returns (bytes32) {
        // If this is a unit...
        if (parentOrgId != bytes32(0)) {
            require(
                organizations[parentOrgId].orgId == parentOrgId,
                "ORG.ID: Parent ORG.ID not found"
            );
        }

        // Organization unique Id creation
        bytes32 orgId = keccak256(
            abi.encodePacked(
                msg.sender,
                blockhash(block.number.sub(1))
            )
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
     * @dev Get all active organizations' ORG.ID hashes in the registry (if no input provided)
     * @dev OR, if input is a valid ORG.ID, get all active units' ORG.ID hashes
     * @param orgId ORG.ID hash or zero bytes
     * @param includeInactive Includes not active organizations into response
     * @return {
         "organizationsList": "Array of ORG.ID hashes"
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
     * @dev OR, if input is a valid ORG.ID, get a number of active organizational units
     * @param orgId ORG.ID hash or zero bytes
     * @param includeInactive Includes not active organizations into response
     * @return {
         "count": "ORG.ID count"
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
     * @param orgId ORG.ID hash
     */
    function _acceptDirectorship(bytes32 orgId) internal {
        organizations[orgId].isDirectorshipAccepted = true;
        emit DirectorshipAccepted(orgId, msg.sender);
    }

    /**
     * @dev ORG.JSON storage update
     * @param orgId ORG.ID hash
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

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
        string orgJsonUri;
        bytes32 orgJsonHash;
        bytes32 parentOrgId;
        address owner;
        address director;
        bool isActive;
        bool directorConfirmed;
        bytes32[] subsidiaries;
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
    event SubsidiaryCreated(
        bytes32 indexed parentOrgId,
        bytes32 indexed subOrgId,
        address indexed director
    );

    /**
     * @dev Emits when organization active/inactive state changes
     */
    event OrganizationToggled(
        bytes32 indexed orgId,
        bool previousState,
        bool newState
    );

    /**
     * @dev Emits when unit's directorship confirmed
     */
    event DirectorOwnershipConfirmed(
        bytes32 indexed orgId,
        address indexed director
    );

    /**
     * @dev Emits when unit's director changes
     */
    event DirectorOwnershipTransferred(
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
     * @dev Emits when ORG.JSON URI changes
     */
    event OrgJsonUriChanged(
        bytes32 indexed orgId,
        string previousOrgJsonUri,
        string newOrgJsonUri
    );

    /**
     * @dev Emits when ORG.JSON hash changes
     */
    event OrgJsonHashChanged(
        bytes32 indexed orgId,
        bytes32 indexed previousOrgJsonHash,
        bytes32 indexed newOrgJsonHash
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
     * @param orgJsonUri ORG.JSON URI (stored off-chain)
     * @param orgJsonHash ORG.JSON's keccak256 hash
     * @return {
         "id": "ORG.ID byte32 hash"
     }
     */
    function createOrganization(
        string calldata orgJsonUri,
        bytes32 orgJsonHash
    ) external returns (bytes32 id) {
        id = _createOrganization(
            bytes32(0),
            address(0),
            orgJsonUri,
            orgJsonHash
        );
        emit OrganizationCreated(id, msg.sender);
    }

    /**
     * @dev Create organizational unit
     * @param orgId Parent ORG.ID hash
     * @param subsidiaryDirector Unit's director address
     * @param orgJsonUri Unit's ORG.JSON URI
     * @param orgJsonHash ORG.JSON's keccak256 hash
     */
    function createSubsidiary(
        bytes32 orgId,
        address subsidiaryDirector,
        string calldata orgJsonUri,
        bytes32 orgJsonHash
    )
        external
        orgIdMustExist(orgId)
        mustBeCalledByOwner(orgId)
        returns (bytes32 id)
    {
        id = _createOrganization(
            orgId,
            subsidiaryDirector,
            orgJsonUri,
            orgJsonHash
        );
        emit SubsidiaryCreated(orgId, id, subsidiaryDirector);

        // If parent ORG.ID owner indicates their address as director,
        // their directorship is automatically confirmed
        if (subsidiaryDirector == msg.sender) {
            emit DirectorOwnershipConfirmed(id, msg.sender);
        }
    }

    /**
     * @dev Toggle ORG.ID's active/inactive state
     * @param orgId ORG.ID hash
     */
    function toggleOrganization(bytes32 orgId)
        external
        orgIdMustExist(orgId)
        mustBeCalledByOwner(orgId)
    {
        emit OrganizationToggled(
            orgId,
            organizations[orgId].isActive,
            !organizations[orgId].isActive
        );
        organizations[orgId].isActive = !organizations[orgId].isActive;
    }

    /**
     * @dev Unit directorship confirmation
     * @param orgId Unit's ORG.ID hash
     */
    function confirmDirectorOwnership(bytes32 orgId)
        external
        orgIdMustExist(orgId)
    {
        require(
            organizations[orgId].director == msg.sender,
            "ORG.ID: action not authorized (must be director)"
        );

        organizations[orgId].directorConfirmed = true;
        emit DirectorOwnershipConfirmed(orgId, msg.sender);
    }

    /**
     * @dev Unit directorship transfer
     * @param orgId Unit's ORG.ID hash
     * @param newDirector New director's address
     */
    function transferDirectorOwnership(
        bytes32 orgId,
        address newDirector
    )
        external
        orgIdMustExist(orgId)
        mustBeCalledByOwner(orgId)
    {
        require(
            newDirector != address(0),
            "ORG.ID: Invalid director address"
        );

        emit DirectorOwnershipTransferred(
            orgId,
            organizations[orgId].director,
            newDirector
        );
        organizations[orgId].director = newDirector;

        if (newDirector == msg.sender) {
            emit DirectorOwnershipConfirmed(orgId, newDirector);
        } else {
            organizations[orgId].directorConfirmed = false;
        }
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
     * @param orgJsonUri New ORG.JSON URI
     * @param orgJsonHash New ORG.JSON's keccak256 hash
     */
    function changeOrgJsonUriAndHash(
        bytes32 orgId,
        string calldata orgJsonUri,
        bytes32 orgJsonHash
    )
        external
        orgIdMustExist(orgId)
        mustBeCalledByOwnerOrDirector(orgId)
    {
        changeOrgJsonUri(orgId, orgJsonUri);
        changeOrgJsonHash(orgId, orgJsonHash);
    }

    /**
     * @dev Get all active organizations' ORG.ID hashes
     * @return {
         "organizationsList": "Array of all active organizations' ORG.ID hashes"
     }
     */
    function getOrganizations()
        external
        view
        returns (bytes32[] memory)
    {
        return _getOrganizations(bytes32(0));
    }

    /**
     * @dev Get organization or unit's info by ORG.ID hash
     * @param _orgId ORG.ID hash
     * @dev Return parameters marked by (*) are only applicable to units
     * @return {
         "existed": "Flag indicating ORG.ID's existence",
         "ORG.ID": "ORG.ID hash",
         "orgJsonUri": "ORG.JSON URI",
         "orgJsonHash": "ORG.JSON keccak256 hash",
         "parentOrgId": "Parent ORG.ID (*)",
         "owner": "Owner's address",
         "director": "Unit director's address (*)",
         "isActive": "Indicates whether ORG.ID is active",
         "directorConfirmed": "Indicates whether directorship is confirmed (*)"
     }
     */
    function getOrganization(bytes32 _orgId)
        external
        view
        returns (
            bool exist,
            bytes32 orgId,
            string memory orgJsonUri,
            bytes32 orgJsonHash,
            bytes32 parentOrgId,
            address owner,
            address director,
            bool isActive,
            bool directorConfirmed
        )
    {
        exist = _orgId != bytes32(0) && organizations[_orgId].orgId == _orgId;
        orgId = organizations[_orgId].orgId;
        orgJsonUri = organizations[_orgId].orgJsonUri;
        orgJsonHash = organizations[_orgId].orgJsonHash;
        parentOrgId = organizations[_orgId].parentOrgId;
        owner = organizations[_orgId].owner;
        director = organizations[_orgId].director;
        isActive = organizations[_orgId].isActive;
        directorConfirmed = organizations[_orgId].directorConfirmed;
    }

    /**
     * @dev Get all active organizational units of a particular ORG.ID
     * @param orgId Parent ORG.ID hash
     * @return {
         "organizationsList": "Array of ORG.ID hashes of active organizational units"
     }
     */
    function getSubsidiaries(bytes32 orgId)
        external
        view
        orgIdMustExist(orgId)
        returns (bytes32[] memory)
    {
        return _getOrganizations(orgId);
    }

    /**
     * @dev Change ORG.JSON URI (caller must be owner or director)
     * @param orgId ORG.ID hash
     * @param orgJsonUri New ORG.JSON URI
     */
    function changeOrgJsonUri(
        bytes32 orgId,
        string memory orgJsonUri
    )
        public
        orgIdMustExist(orgId)
        mustBeCalledByOwnerOrDirector(orgId)
    {
        require(
            bytes(orgJsonUri).length != 0,
            "ORG.ID: ORG.JSON URI cannot be empty"
        );

        emit OrgJsonUriChanged(
            orgId,
            organizations[orgId].orgJsonUri,
            orgJsonUri
        );
        organizations[orgId].orgJsonUri = orgJsonUri;
    }

    /**
     * @dev Change ORG.JSON hash (caller must be owner or director)
     * @param orgId ORG.ID hash
     * @param orgJsonHash New ORG.JSON's keccak256 hash
     */
    function changeOrgJsonHash(
        bytes32 orgId,
        bytes32 orgJsonHash
    )
        public
        orgIdMustExist(orgId)
        mustBeCalledByOwnerOrDirector(orgId)
    {
        require(
            orgJsonHash != bytes32(0),
            "ORG.ID: ORG.JSON hash cannot be zero"
        );

        emit OrgJsonHashChanged(
            orgId,
            organizations[orgId].orgJsonHash,
            orgJsonHash
        );
        organizations[orgId].orgJsonHash = orgJsonHash;
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

            // ORG.ID interface: 0x36b78f0f
            org.createOrganization.selector ^
            org.toggleOrganization.selector ^
            org.transferOrganizationOwnership.selector ^
            org.changeOrgJsonUri.selector ^
            org.changeOrgJsonHash.selector ^
            org.getOrganizations.selector ^
            org.getOrganization.selector,

            // hierarchy interface: 0x3a3bc250
            org.createSubsidiary.selector ^
            org.confirmDirectorOwnership.selector ^
            org.transferDirectorOwnership.selector ^
            org.getSubsidiaries.selector
        ];
        for (uint256 i = 0; i < interfaceIds.length; i++) {
            _registerInterface(interfaceIds[i]);
        }
    }

    /**
     * @dev Create new organization and add it to storage
     * @param orgJsonUri ORG.JSON URI
     * @param orgJsonHash ORG.JSON's keccak256 hash
     * @param parentOrgId Parent ORG.ID hash (if applicable)
     * @param subsidiaryDirector Unit director's address (if applicable)
     * @return {
         "ORG.ID": "New ORG.ID hash"
     }
     */
    function _createOrganization(
        bytes32 parentOrgId,
        address subsidiaryDirector,
        string memory orgJsonUri,
        bytes32 orgJsonHash
    ) internal returns (bytes32) {
        // If desired ORG.ID hash was not provided
        bytes32 orgId = keccak256(
            abi.encodePacked(
                msg.sender,
                blockhash(block.number.sub(1))
            )
        );

        // If this is a unit...
        if (parentOrgId != bytes32(0)) {
            require(
                organizations[parentOrgId].orgId == parentOrgId,
                "ORG.ID: Parent ORG.ID not found"
            );

            require(
                subsidiaryDirector != address(0),
                "ORG.ID: Invalid director address"
            );
        }

        organizations[orgId] = Organization(
            orgId,
            orgJsonUri,
            orgJsonHash,
            parentOrgId,
            msg.sender,
            subsidiaryDirector,
            true,
            subsidiaryDirector == msg.sender,
            new bytes32[](0)
        );
        orgIds.push(orgId);

        if (parentOrgId != bytes32(0)) {
            organizations[parentOrgId].subsidiaries.push(orgId);
        }

        return orgId;
    }

    /**
     * @dev Get all active organizations' ORG.ID hashes in the registry (if no input provided)
     * @dev OR, if input is a valid ORG.ID, get all active units' ORG.ID hashes
     * @param orgId ORG.ID hash or zero bytes
     * @return {
         "organizationsList": "Array of ORG.ID hashes"
     }
     */
    function _getOrganizations(bytes32 orgId)
        internal
        view
        returns (bytes32[] memory organizationsList)
    {
        bytes32[] memory source =
            orgId == bytes32(0)
            ? orgIds
            : organizations[orgId].subsidiaries;
        organizationsList = new bytes32[](_getOrganizationsCount(orgId));
        uint256 index;

        for (uint256 i = 0; i < source.length; i++) {
            // If organization is active AND
            // organization is top level (not unit) OR
            // organization is a unit AND directorship is confirmed
            if (organizations[source[i]].isActive &&
                (
                    (orgId == bytes32(0) && organizations[source[i]].parentOrgId == bytes32(0)) ||
                    (orgId != bytes32(0) &&
                        organizations[source[i]].parentOrgId != bytes32(0) &&
                        organizations[source[i]].directorConfirmed)
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
     * @return {
         "count": "ORG.ID count"
     }
     */
    function _getOrganizationsCount(bytes32 orgId)
        internal
        view
        returns (uint256 count)
    {
        bytes32[] memory source =
            orgId == bytes32(0)
            ? orgIds
            : organizations[orgId].subsidiaries;

        for (uint256 i = 0; i < source.length; i++) {
            if (organizations[source[i]].isActive &&
                (
                    (orgId == bytes32(0) && organizations[source[i]].parentOrgId == bytes32(0)) ||
                    (orgId != bytes32(0) &&
                        organizations[source[i]].parentOrgId != bytes32(0) &&
                        organizations[source[i]].directorConfirmed)
                )) {

                count += 1;
            }
        }
    }
}

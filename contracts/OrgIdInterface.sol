pragma solidity >=0.5.16;

/**
 * @title ORG.ID Registry Smart Contract Interface
 */
contract OrgIdInterface {

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
    ) external returns (bytes32 id);

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
        returns (bytes32 newUnitOrgId);

    /**
     * @dev Toggle ORG.ID's active/inactive state
     * @param orgId ORG.ID hash
     */
    function toggleActiveState(bytes32 orgId) external;

    /**
     * @dev Accept director role
     * @param orgId Unit's ORG.ID hash
     */
    function acceptDirectorship(bytes32 orgId) external;

    /**
     * @dev Transfer director role
     * @param orgId Unit's ORG.ID hash
     * @param newDirector New director's address
     */
    function transferDirectorship(
        bytes32 orgId,
        address newDirector
    ) external;

    /**
     * @dev Unit directorship renounce
     * @param orgId Unit's ORG.ID hash
     */
    function renounceDirectorship(bytes32 orgId)
        external;

    /**
     * @dev Ownership transfer
     * @param orgId ORG.ID hash
     * @param newOwner New owner's address
     */
    function transferOrganizationOwnership(
        bytes32 orgId,
        address newOwner
    ) external;

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
    ) external;

    /**
     * @dev Get all active organizations' ORG.ID hashes
     * @param includeInactive Includes not active units into response
     * @return {
         "organizationsList": "Array of all active organizations' ORG.ID hashes"
     }
     */
    function getOrganizations(bool includeInactive)
        external
        view
        returns (bytes32[] memory organizationsList);

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
        );

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
        returns (bytes32[] memory);
}

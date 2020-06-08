pragma solidity >=0.5.16;

/**
 * @title ORG.ID Registry Smart Contract Interface
 */
contract OrgIdInterface {

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
    ) external returns (bytes32 id);

    /**
     * @dev Create organizational unit
     * @param parentOrgId Parent ORG.ID hash
     * @param director Unit director address
     * @param orgJsonUri Unit ORG.JSON URI
     * @param orgJsonHash ORG.JSON keccak256 hash
     */
    function createUnit(
        bytes32 parentOrgId,
        address director,
        string calldata orgJsonUri,
        bytes32 orgJsonHash
    ) external returns (bytes32 id);

    /**
     * @dev Toggle ORG.ID's active/inactive state
     * @param orgId ORG.ID hash
     */
    function toggleOrganization(bytes32 orgId) external;

    /**
     * @dev Unit directorship confirmation
     * @param orgId Unit's ORG.ID hash
     */
    function confirmDirectorship(bytes32 orgId) external;

    /**
     * @dev Unit directorship transfer
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
     * @param orgJsonUri New ORG.JSON URI
     * @param orgJsonHash New ORG.JSON's keccak256 hash
     */
    function setOrgJson(
        bytes32 orgId,
        string calldata orgJsonUri,
        bytes32 orgJsonHash
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
     * @return {
         "existed": "Flag indicating ORG.ID's existence",
         "orgId": "ORG.ID hash",
         "orgJsonUri": "ORG.JSON URI",
         "orgJsonHash": "ORG.JSON keccak256 hash",
         "parentOrgId": "Parent ORG.ID (if applicable)",
         "owner": "Owner's address",
         "director": "Unit director's address",
         "isActive": "Indicates whether ORG.ID is active",
         "directorConfirmed": "Indicates whether directorship is confirmed"
     }
     */
    function getOrganization(bytes32 _orgId)
        external
        view
        returns (
            bool existed,
            bytes32 orgId,
            string memory orgJsonUri,
            bytes32 orgJsonHash,
            bytes32 parentOrgId,
            address owner,
            address director,
            bool isActive,
            bool directorConfirmed
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

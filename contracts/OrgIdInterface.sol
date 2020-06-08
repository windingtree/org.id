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
    function changeOrgJsonUriAndHash(
        bytes32 orgId,
        string calldata orgJsonUri,
        bytes32 orgJsonHash
    ) external;

    /**
     * @dev Get all active organizations' ORG.ID hashes
     * @return {
         "organizationsList": "Array of all active organizations' ORG.ID hashes"
     }
     */
    function getOrganizations()
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
         "isDirectorshipAccepted": "Indicates whether director accepted the role"
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
            bool isDirectorshipAccepted
        );

    /**
     * @dev Get all active organizational units of a particular ORG.ID
     * @param parentOrgId Parent ORG.ID hash
     * @return {
         "organizationsList": "Array of ORG.ID hashes of active organizational units"
     }
     */
    function getUnits(bytes32 parentOrgId)
        external
        view
        returns (bytes32[] memory);

    /**
     * @dev Change ORG.JSON URI (caller must be owner or director)
     * @param orgId ORG.ID hash
     * @param orgJsonUri New ORG.JSON URI
     */
    function changeOrgJsonUri(
        bytes32 orgId,
        string memory orgJsonUri
    ) public;

    /**
     * @dev Change ORG.JSON hash (caller must be owner or director)
     * @param orgId ORG.ID hash
     * @param orgJsonHash New ORG.JSON's keccak256 hash
     */
    function changeOrgJsonHash(
        bytes32 orgId,
        bytes32 orgJsonHash
    ) public;
}

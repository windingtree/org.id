pragma solidity >=0.5.16;

/**
 * @title OrgId contract interface
 * @dev A contract that represents an OrgId 
 */
contract OrgIdInterface {

    /**
     * @dev Create organization
     * @param orgId The organization Id
     * @param orgJsonUri orgJsonUri pointer
     * @param orgJsonHash keccak256 hash of the new ORG.JSON contents
     * @return {
         "id": "The organization orgId"
     }
     */
    function createOrganization(
        bytes32 orgId,
        string calldata orgJsonUri,
        bytes32 orgJsonHash
    ) external returns (bytes32 id);

    /**
     * @dev Create subsidiary
     * @param orgId The organization Id
     * @param subOrgId The subsidiary organization Id
     * @param orgJsonUri orgJsonUri pointer
     * @param orgJsonHash keccak256 hash of the new ORG.JSON contents
     * @param subsidiaryDirector Subsidiary director address
     */
    function createSubsidiary(
        bytes32 orgId,
        bytes32 subOrgId,
        string calldata orgJsonUri,
        bytes32 orgJsonHash,
        address subsidiaryDirector
    ) external returns (bytes32 id);

    /**
     * @dev Toggle the organization state
     * @param orgId The organization orgId
     */
    function toggleOrganization(bytes32 orgId) external;

    /**
     * @dev Confirmation of the organization director ownership
     * @param orgId The organization orgId
     */
    function confirmDirectorOwnership(bytes32 orgId) external;

    /**
     * @dev Transfer subsidiary director ownership
     * @param orgId The organization orgId
     * @param newDirector New subsidiary director address
     */
    function transferDirectorOwnership(
        bytes32 orgId,
        address newDirector
    ) external;

    /**
     * @dev Transfer organization ownership
     * @param orgId The organization orgId
     * @param newOwner New subsidiary director address
     */
    function transferOrganizationOwnership(
        bytes32 orgId,
        address newOwner
    ) external;

    /**
     * @dev Shorthand method to change ORG.JSON uri and hash at the same time
     * @param orgJsonUri New orgJsonUri pointer of this Organization
     * @param orgJsonHash keccak256 hash of the new ORG.JSON contents.
     */
    function changeOrgJsonUriAndHash(
        bytes32 orgId,
        string calldata orgJsonUri,
        bytes32 orgJsonHash
    ) external;

    /**
     * @dev Return an array of active organizations orgIds
     * @return {
         "organizationsList": "Array of active organizations orgIds"
     }
     */
    function getOrganizations()
        external 
        view 
        returns (bytes32[] memory organizationsList);

    /**
     * @dev Get organization by orgId
     * @param _orgId The organization Id
     * @return {
         "orgId": "The organization orgId",
         "orgJsonUri": "orgJsonUri pointer of this Organization",
         "orgJsonHash": "keccak256 hash of the new ORG.JSON contents",
         "parentEntity": "The parent organization orgId",
         "owner": "The organization owner",
         "director": "The organization director",
         "state": "State of the organization",
         "directorConfirmed": "Flag is director ownership is confirmed"
     }
     */
    function getOrganization(bytes32 _orgId) 
        external 
        view 
        returns (
            bytes32 orgId,
            string memory orgJsonUri,
            bytes32 orgJsonHash,
            bytes32 parentEntity,
            address owner,
            address director,
            bool state,
            bool directorConfirmed
        );
    
    /**
     * @dev Return an array of active subsidiaries orgIds
     * @return {
         "organizationsList": "Array of active subsidiaries orgIds"
     }
     */
    function getSubsidiaries(bytes32 orgId)
        external
        view 
        returns (bytes32[] memory);
    
    /**
     * @dev Allows owner to change Organization"s orgJsonUri
     * @param orgId The organization OrgId
     * @param orgJsonUri New orgJsonUri pointer of this Organization
     */
    function changeOrgJsonUri(
        bytes32 orgId,
        string memory orgJsonUri
    ) public;

    /**
     * @dev Allows owner to change Organization"s orgJsonHash
     * @param orgId The organization OrgId
     * @param orgJsonHash keccak256 hash of the new ORG.JSON contents
     */
    function changeOrgJsonHash(
        bytes32 orgId,
        bytes32 orgJsonHash
    ) public;
}

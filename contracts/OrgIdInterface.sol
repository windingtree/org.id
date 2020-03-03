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
     * @param subsidiaryDirector Subsidiary director address
     * @param orgJsonUri orgJsonUri pointer
     * @param orgJsonHash keccak256 hash of the new ORG.JSON contents
     */
    function createSubsidiary(
        bytes32 orgId,
        bytes32 subOrgId,
        address subsidiaryDirector,
        string calldata orgJsonUri,
        bytes32 orgJsonHash
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
         "existed": "The organizatoin existence flag",
         "orgId": "The organization orgId",
         "orgJsonUri": "orgJsonUri pointer of this Organization",
         "orgJsonHash": "keccak256 hash of the new ORG.JSON contents",
         "parentEntity": "The parent organization orgId",
         "owner": "The organization owner",
         "director": "The organization director",
         "state": "State of the organization",
         "directorConfirmed": "Flag is director ownership is confirmed",
         "deposit": "Lif deposit value"
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
            bytes32 parentEntity,
            address owner,
            address director,
            bool state,
            bool directorConfirmed,
            uint256 deposit
        );
    
    /**
     * @dev Returns Lif token address
     * @return {
         "lifToken": "Address of the Lif token"
     }
     */
    function getLifTokenAddress() external view returns (address lifToken);

    /**
     * @dev Returns withdrawDelay value
     * @return {
         "delay": "Delay time in seconds before the requested withdrawal will be possible"
     }
     */
    function getWithdrawDelay() external view returns (uint256 delay);

    /**
     * @dev Changing withdrawDelay value
     * @param _withdrawDelay New withdrawDelay value in seconds
     */
    function setWithdrawDelay(uint256 _withdrawDelay) external;

    /**
     * @dev Makes deposit of Lif tokens
     * @param orgId The organization OrgId
     * @param value The value to be deposited
     */
    function addDeposit(
        bytes32 orgId,
        uint256 value
    ) external;

    /**
     * @dev Submits withdrawal request
     * @param orgId The organization OrgId
     * @param value The value to withdraw
     */
    function submitWithdrawalRequest(
        bytes32 orgId,
        uint256 value
    ) external;

    /**
     * @dev Returns information about deposit withdrawal request
     * @param orgId The organization Id
     * @return {
         "existed": "The request existence flag",
         "value": "Deposit withdrawal value",
         "withdrawTime": "Withraw time on seconds"
     }
     */
    function getWithdrawalRequest(bytes32 orgId)
        external
        view 
        returns (
            bool existed,
            uint256 value,
            uint256 withdrawTime
        );

    /**
     * @dev Trunsfers deposited tokens to the sender
     * @param orgId The organization OrgId
     */
    function withdrawDeposit(
        bytes32 orgId
    ) external;

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

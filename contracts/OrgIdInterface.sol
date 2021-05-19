pragma solidity 0.5.17;


/**
 * @title ORGiD Registry Smart Contract Interface
 */
contract OrgIdInterface {
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
    ) external returns (bytes32 orgId);

    /**
     * @dev Ownership transfer
     * @param orgId ORGiD hash
     * @param newOwner New owner's address
     */
    function transferOrgIdOwnership(
        bytes32 orgId,
        address newOwner
    ) external;
}

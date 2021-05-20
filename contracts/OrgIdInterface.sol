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

    /**
     * @dev Shorthand method to change ORG.JSON URI and hash at once
     * @param orgId ORGiD hash
     * @param orgJsonUri New ORG.JSON URI
     */
    function setOrgJson(
        bytes32 orgId,
        string calldata orgJsonUri
    ) external;

    /**
     * @dev Check ORGiD existence
     * @param orgId ORGiD hash
     * @dev Return parameters marked by (*) are only applicable to units
     * @return {
        "exists": "ORGiD existence",
        "owner": "ORGiD owner address"
     }
     */
    function getOrgId(bytes32 orgId)
        external
        view
        returns (bool exists, address owner);

    /**
     * @dev Check registered ORGiD count
     * @dev Return count of ORGiD hashes
     * @return {
        "count": "ORGiDs count"
     }
     */
    function getOrgIdsCount()
        external
        view
        returns (uint256 count);

    /**
     * @dev Get all organizations' ORGiD hashes list
     * @return {
         "orgIdsList": "Array of all organizations' ORGiD hashes"
     }
     */
    function getOrgIds()
        external
        view
        returns (bytes32[] memory orgIdsList);

    /**
     * @dev Get paginated ORGiDs hashes list
     * @param cursor Index of the ORGiD from which to start querying
     * @param count Number of ORGiDs to go through
     * @return {
        "orgIdsList": "Array of ORGiDs hashes"
     }
     */
    function getOrgIds(uint256 cursor, uint256 count)
        external
        view
        returns (bytes32[] memory orgIdsList);
}

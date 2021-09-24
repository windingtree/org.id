// SPDX-License-Identifier: GPL-3.0-only;
pragma solidity ^0.8.7;

abstract contract IOrgIdRegistry {
  /**
   * @dev Emits when new ORGiD created
   */
  event OrgIdCreated(
    bytes32 indexed orgId,
    address indexed owner
  );

  /**
   * @dev Emits when ORG.JSON changes
   */
  event OrgJsonUriChanged(
    bytes32 indexed orgId,
    string orgJsonUri
  );

  /**
   * Throws when provided with calldata orgJsonUri is empty
   */
  error OrgJsonUriEmpty();

  /**
   * Throws when provided orgId is already exists
   */
  error OrgIdAlreadyExists(bytes32 orgId);

  /**
   * Throws when provided orgId is not found
   */
  error OrgIdNotFound(bytes32 orgId);

  /**
   * Throws when provided orgId is not found
   */
  error TokenNotFound(uint256 tokenId);

  /**
   * Throws when function called not by an orgId owner
   */
  error CalledNotByOrgIdOwner();

  /**
   * @dev Returns a tokenId by given orgId
   * @param orgId An organization hash
   * @return tokenId Token Id
   */
  function getTokenId(bytes32 orgId)
    external
    view
    virtual
    returns (uint256 tokenId);

  /**
   * @dev Returns an ORGiD
   * @param tokenId Token Id
   * @return exists ORGiD existence flag
   * @return orgId ORGiD hash
   * @return orgJsonUri ORG.JSON URI
   * @return owner ORGiD owner
   */
  function getOrgId(uint256 tokenId)
    external
    view
    virtual
    returns (
      bool exists,
      bytes32 orgId,
      string memory orgJsonUri,
      address owner
    );

  /**
   * @dev Returns all organizations' ORGiD hashes list
   * @return orgIds Array of all ORGiDs hashes
   */
  function getOrgIds()
    external
    view
    virtual
    returns (bytes32[] memory orgIds);

  /**
   * @dev Returns paginated ORGiDs hashes list
   * @param cursor Index of the ORGiD from which to start querying
   * @param count Number of ORGiDs to go through
   * @return orgIds Array of ORGiDs hashes
   */
  function getOrgIds(uint256 cursor, uint256 count)
    external
    view
    virtual
    returns (bytes32[] memory orgIds);

  /**
   * @dev Create ORGiD
   * @param salt Unique hash required for identifier creation
   * @param orgJsonUri ORG.JSON URI (stored off-chain)
   *
   * Requirements:
   * - `orgJsonUri` must not be an empty string
   * - `orgId` must not exists
   *
  */
  function createOrgId(
    bytes32 salt,
    string calldata orgJsonUri
  )
    external
    virtual;

  /**
   * @dev Changes an ORG.JSON URI
   * @param orgId ORGiD hash
   * @param orgJsonUri New ORG.JSON URI
   *
   * Requirements:
   * - `orgId` must exists
   * - `orgJsonUri` must not be an empty string
   * - function caller must be an owner of `orgId`
   */
  function setOrgJson(
      bytes32 orgId,
      string calldata orgJsonUri
  )
    external
    virtual;
}

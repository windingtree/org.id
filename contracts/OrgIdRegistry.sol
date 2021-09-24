// SPDX-License-Identifier: GPL-3.0-only;
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./IOrgIdRegistry.sol";

/**
 * @dev OrgIdRegistry contract
 */
abstract contract OrgIdRegistry is IOrgIdRegistry, Initializable, ERC721EnumerableUpgradeable {

  /// @dev Mapping of the organization hash to the tokenId
  mapping (bytes32 => uint256) private _orgToken;

  /// @dev Mapping of the tokenId to the organization hash
  mapping (uint256 => bytes32) private _tokenOrg;

  /// @dev Mapping of the token Id to the orgJsonUri
  mapping (uint256 => string) private _orgJsonUris;

  /// @dev Array with all orgIds', used for enumeration
  bytes32[] private _orgIds;

  /// @dev OrgIdRegistry contract initializer
  // solhint-disable-next-line func-name-mixedcase
  function __OrgIdRegistry_init() internal initializer {
    __ERC721Enumerable_init();
  }

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC721EnumerableUpgradeable)
    returns (bool)
  {
    return interfaceId == type(IOrgIdRegistry).interfaceId
      || super.supportsInterface(interfaceId);
  }

  /**
   * @dev See {IERC721Metadata-tokenURI}.
   */
  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override(ERC721Upgradeable)
    returns (string memory)
  {
    if (!_exists(tokenId)) {
      revert TokenNotFound(tokenId);
    }
    return _orgJsonUris[tokenId];
  }

  /**
   * @dev See {IOrgIdRegistry-getTokenId(bytes32)}.
   */
  function getTokenId(bytes32 orgId)
    external
    view
    virtual
    override
    returns (uint256 tokenId)
  {
    tokenId = _orgToken[orgId];
  }

  /**
   * @dev See {IOrgIdRegistry-getOrgId(uint256)}.
   */
  function getOrgId(uint256 tokenId)
    external
    view
    virtual
    override
    returns (
      bool exists,
      bytes32 orgId,
      string memory orgJsonUri,
      address owner
    )
  {
    orgId = _tokenOrg[tokenId];
    exists = _exists(tokenId);
    if (exists) {
      orgJsonUri = _orgJsonUris[tokenId];
      owner = ownerOf(tokenId);
    }
  }

  /**
   * @dev See {IOrgIdRegistry-getOrgIds()}.
   */
  function getOrgIds()
      external
      view
      override
      returns (bytes32[] memory orgIds)
  {
    orgIds = _orgIds;
  }

  /**
   * @dev See {IOrgIdRegistry-getOrgIds(uint256,uint256)}.
   */
  function getOrgIds(uint256 cursor, uint256 count)
      external
      view
      virtual
      override
      returns (bytes32[] memory orgIds)
  {
    bytes32[] memory orgIdsPageRaw = new bytes32[](count);
    uint256 index;
    uint256 nonZeroCount;

    // slice orgIds list by parameters
    for (uint256 i = cursor; i < _orgIds.length && (i < cursor + count); i++) {
      orgIdsPageRaw[index] = _orgIds[i];

      if (_orgIds[i] != bytes32(0)) {
        nonZeroCount++;
      }

      index++;
    }

    orgIds = new bytes32[](nonZeroCount);
    index = 0;

    // Filter zero elements
    for (uint256 i = 0; i < orgIdsPageRaw.length; i++) {
      if (orgIdsPageRaw[i] != bytes32(0)) {
        orgIds[index] = orgIdsPageRaw[i];
        index++;
      }
    }
  }

  /**
   * @dev See {IOrgIdRegistry-createOrgId(bytes32,string)}.
  */
  function createOrgId(
    bytes32 salt,
    string calldata orgJsonUri
  )
    external
    virtual
    override
  {
    if (bytes(orgJsonUri).length == 0) {
      revert OrgJsonUriEmpty();
    }

    address orgIdOwner = _msgSender();

    bytes32 orgId = keccak256(
      abi.encodePacked(
        orgIdOwner,
        salt
      )
    );
    _orgIds.push(orgId);

    if (_orgToken[orgId] != 0) {
      revert OrgIdAlreadyExists(orgId);
    }

    uint256 tokenId = totalSupply() + 1;
    _safeMint(orgIdOwner, tokenId);
    _orgToken[orgId] = tokenId;
    _tokenOrg[tokenId] = orgId;
    _orgJsonUris[tokenId] = orgJsonUri;

    emit OrgIdCreated(orgId, orgIdOwner);
    emit OrgJsonUriChanged(orgId, orgJsonUri);
  }

  /**
   * @dev See {IOrgIdRegistry-setOrgJson(bytes32,string)}.
   */
  function setOrgJson(
      bytes32 orgId,
      string calldata orgJsonUri
  )
    external
    virtual
    override
  {
    if (orgId == bytes32(0) || _orgToken[orgId] == 0) {
      revert OrgIdNotFound(orgId);
    }
    if (bytes(orgJsonUri).length == 0) {
      revert OrgJsonUriEmpty();
    }
    if (ownerOf(_orgToken[orgId]) != _msgSender()) {
      revert CalledNotByOrgIdOwner();
    }

    _orgJsonUris[_orgToken[orgId]] = orgJsonUri;

    emit OrgJsonUriChanged(orgId, orgJsonUri);
  }

  uint256[51] private __gap;
}

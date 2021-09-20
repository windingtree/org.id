// SPDX-License-Identifier: GPL-3.0-only;
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./IOrgIdRegistry.sol";

abstract contract OrgIdRegistry is IOrgIdRegistry, Initializable, ERC721EnumerableUpgradeable {

  /// @dev Mapping of the organization hash to the token Id
  mapping (bytes32 => uint256) private _organizationTokens;

  /// @dev Mapping of the token Id to the orgJsonUri
  mapping (uint256 => string) private _orgJsonUris;

  /// @dev Array with all orgIds', used for enumeration
  bytes32[] private _orgIds;

  /// @dev OrgIdRegistry contract initializer
  function __OrgIdRegistry_init() internal initializer { // solhint-disable-line func-name-mixedcase
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
   * @dev See {IOrgIdRegistry-getTokenId(bytes32)}.
   */
  function getTokenId(bytes32 orgId)
    external
    view
    virtual
    override
    returns (uint256 tokenId)
  {
    tokenId = _organizationTokens[orgId];
  }

  /**
   * @dev See {IOrgIdRegistry-getOrgJsonUri(bytes32)}.
   */
  function getOrgJsonUri(bytes32 orgId)
    public
    view
    virtual
    override
    returns (string memory orgJsonUri)
  {
    orgJsonUri = _orgJsonUris[_organizationTokens[orgId]];
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

      // Filter zero elements
      orgIds = new bytes32[](nonZeroCount);
      index = 0;
      for (uint256 i = 0; i < orgIdsPageRaw.length; i++) {
        if (orgIdsPageRaw[i] != bytes32(0)) {
          orgIds[index] = orgIdsPageRaw[i];
          index++;
        }
      }
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
   * @dev See {IERC721Metadata-createOrgId(bytes32,string)}.
  */
  function createOrgId(
    bytes32 salt,
    string calldata orgJsonUri
  )
    external
    virtual
    override
    returns (bytes32 orgId, uint256 tokenId)
  {
    if (bytes(orgJsonUri).length == 0) {
      revert OrgJsonUriEmpty();
    }

    address orgIdOwner = _msgSender();

    orgId = keccak256(
      abi.encodePacked(
        orgIdOwner,
        salt
      )
    );

    if (_organizationTokens[orgId] != 0) {
      revert OrgIdAlreadyExists(orgId);
    }

    tokenId = totalSupply();
    _safeMint(orgIdOwner, tokenId);
    _organizationTokens[orgId] = tokenId;
    _orgJsonUris[tokenId] = orgJsonUri;

    emit OrgIdCreated(orgId, orgIdOwner);

    emit OrgJsonUriChanged(
      orgId,
      orgJsonUri
    );
  }

  /**
   * @dev See {IERC721Metadata-setOrgJson(bytes32,string)}.
   */
  function setOrgJson(
      bytes32 orgId,
      string calldata orgJsonUri
  )
    external
    virtual
    override
  {
    if (orgId == bytes32(0)) {
      revert OrgIdNotFound(orgId);
    }
    if (bytes(orgJsonUri).length == 0) {
      revert OrgJsonUriEmpty();
    }
    if (ownerOf(_organizationTokens[orgId]) != _msgSender()) {
      revert CalledNotByOrgIdOwner();
    }

    _orgJsonUris[_organizationTokens[orgId]] = orgJsonUri;

    emit OrgJsonUriChanged(
      orgId,
      orgJsonUri
    );
  }

  uint256[51] private __gap;
}

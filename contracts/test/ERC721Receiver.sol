// SPDX-License-Identifier: GPL-3.0-only;
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";

contract ERC721Receiver is IERC721ReceiverUpgradeable {
  function onERC721Received(
    address operator,
    address from,
    uint256 tokenId,
    bytes calldata data
  )
    external
    pure
    override
    returns (bytes4)
  {
    // suppress compiler warnings
    operator = operator;
    from = from;
    tokenId = tokenId;
    data = data;
    return this.onERC721Received.selector;
  }
}

contract NonERC721Receiver {
  // nothing here
}

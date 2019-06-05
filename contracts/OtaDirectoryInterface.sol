pragma solidity ^0.5.6;

import "./SegmentDirectoryEvents.sol";

/**
 * Interface of Ota Directory. Usable in libraries.
 */
contract OtaDirectoryInterface is SegmentDirectoryEvents {
    function create(string calldata dataUri) external returns (address);
    function createAndAdd(string calldata dataUri) external returns (address);
    function add(address hotel) external returns (address);
    function remove(address hotel) external;
    function getOtasLength() public view returns (uint);
    function getOtas() public view returns (address[] memory);
    function otasIndex(address ota) public view returns (uint);
    function otas(uint index) public view returns (address);
}

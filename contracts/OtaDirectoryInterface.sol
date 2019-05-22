pragma solidity ^0.5.6;

import "./SegmentDirectoryEvents.sol";

/**
 * Interface of Ota Directory. Usable in libraries.
 */
contract OtaDirectoryInterface is SegmentDirectoryEvents {
    function createOta(string calldata dataUri) external returns (address);
    function createAndRegisterOta(string calldata dataUri) external returns (address);
    function registerOta(address ota) external returns (address);
    function deregisterOta(address ota) external;
    function getOtasLength() public view returns (uint);
    function getOtas() public view returns (address[] memory);
    function otasIndex(address ota) public view returns (uint);
    function otas(uint index) public view returns (address);
}

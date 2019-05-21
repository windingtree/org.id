pragma solidity ^0.5.6;

import "./SegmentDirectoryEvents.sol";

contract AbstractWTAirlineIndex is SegmentDirectoryEvents {
    function createAirline(string calldata dataUri) external returns (address);
    function createAndRegisterAirline(string calldata dataUri) external returns (address);
    function registerAirline(address airline) external returns (address);
    function deregisterAirline(address airline) external;
    function getAirlinesLength() public view returns (uint);
    function getAirlines() public view returns (address[] memory);
    function getAirlinesByManager(address manager) public view returns (address[] memory);
    function airlinesIndex(address hotel) public view returns (uint);
    function airlines(uint index) public view returns (address);
}

pragma solidity ^0.5.6;

import "./SegmentDirectoryEvents.sol";

/**
 * Interface of Airline Directory. Usable in libraries.
 */
contract AirlineDirectoryInterface is SegmentDirectoryEvents {
    function createAirline(string calldata dataUri) external returns (address);
    function createAndAddAirline(string calldata dataUri) external returns (address);
    function addAirline(address airline) external returns (address);
    function removeAirline(address airline) external;
    function getAirlinesLength() public view returns (uint);
    function getAirlines() public view returns (address[] memory);
    function airlinesIndex(address airline) public view returns (uint);
    function airlines(uint index) public view returns (address);
}

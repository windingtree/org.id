pragma solidity ^0.5.6;

contract AbstractWTAirlineIndex {
    function registerAirline(string calldata dataUri) external returns (address);
    function deleteAirline(address airline) external;
    function callAirline(address airline, bytes calldata data) external;
    function transferAirline(address airline, address payable newManager) external;
    function getAirlinesLength() public view returns (uint);
    function getAirlines() public view returns (address[] memory);
    function getAirlinesByManager(address manager) public view returns (address[] memory);
}

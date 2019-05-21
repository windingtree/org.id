pragma solidity ^0.5.6;

import "./SegmentDirectoryEvents.sol";

contract AbstractWTHotelIndex is SegmentDirectoryEvents {
    function createHotel(string calldata dataUri) external returns (address);
    function createAndRegisterHotel(string calldata dataUri) external returns (address);
    function registerHotel(address hotel) external returns (address);
    function deregisterHotel(address hotel) external;
    function getHotelsLength() public view returns (uint);
    function getHotels() public view returns (address[] memory);
    function getHotelsByManager(address manager) public view returns (address[] memory);
    function hotelsIndex(address hotel) public view returns (uint);
    function hotels(uint index) public view returns (address);
}

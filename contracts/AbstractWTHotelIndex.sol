pragma solidity ^0.5.6;

import "./SegmentDirectoryEvents.sol";

contract AbstractWTHotelIndex is SegmentDirectoryEvents {
    function registerHotel(string calldata dataUri) external returns (address);
    function deleteHotel(address hotel) external;
    function callHotel(address hotel, bytes calldata data) external;
    function transferHotel(address hotel, address payable newManager) external;
    function getHotelsLength() public view returns (uint);
    function getHotels() public view returns (address[] memory);
    function getHotelsByManager(address manager) public view returns (address[] memory);
    function hotelsIndex(address hotel) public view returns (uint);
    function hotels(uint index) public view returns (address);
}

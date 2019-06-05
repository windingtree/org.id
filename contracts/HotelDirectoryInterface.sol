pragma solidity ^0.5.6;

import "./SegmentDirectoryEvents.sol";

/**
 * Interface of Hotel Directory. Usable in libraries.
 */
contract HotelDirectoryInterface is SegmentDirectoryEvents {
    function create(string calldata dataUri) external returns (address);
    function createAndAdd(string calldata dataUri) external returns (address);
    function add(address hotel) external returns (address);
    function remove(address hotel) external;
    function getHotelsLength() public view returns (uint);
    function getHotels() public view returns (address[] memory);
    function hotelsIndex(address hotel) public view returns (uint);
    function hotels(uint index) public view returns (address);
}

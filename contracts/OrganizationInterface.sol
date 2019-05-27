pragma solidity ^0.5.6;

contract OrganizationInterface {
    function owner() public view returns (address);
    function getDataUri() external view returns (string memory);
}
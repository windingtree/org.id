pragma solidity ^0.5.6;

import "openzeppelin-solidity/contracts/introspection/IERC165.sol";

/**
 * This is an interface every Winding Tree Organization should
 * fullfill.
 */
contract OrganizationInterface is IERC165 {
    function owner() public view returns (address);
    function getDataUri() external view returns (string memory);
    function isDelegate(address addr) external view returns(bool);
}
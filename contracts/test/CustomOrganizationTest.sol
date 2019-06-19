pragma solidity ^0.5.6;

import "openzeppelin-solidity/contracts/introspection/ERC165.sol";
import "../OrganizationInterface.sol";

contract CustomOrganizationTest is ERC165, OrganizationInterface {
    address _owner;
    address[] associatedKeys;

    constructor() public {
        OrganizationInterface i;
        _owner = msg.sender;
        _registerInterface(
            i.owner.selector ^
            i.getOrgJsonUri.selector ^
            i.hasAssociatedKey.selector ^
            i.getAssociatedKeys.selector
        );
    }

    function owner() public view returns (address) {
        return _owner;
    }

    function getOrgJsonUri() external view returns (string memory) {
        return "https://super-sweet-custom-organization.com";
    }

    function hasAssociatedKey(address addr) external view returns(bool) {
        return addr == _owner;
    }

    function getAssociatedKeys() external view returns (address[] memory) {
        return associatedKeys;
    }
}
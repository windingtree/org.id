pragma solidity ^0.5.6;

import "openzeppelin-solidity/contracts/introspection/ERC165.sol";
import "../OrganizationInterface.sol";

contract CustomOrganizationTest is ERC165 {
    address _owner;
    address public parentEntity;
    address public entityDirector;

    constructor() public {
        _owner = msg.sender;
        setInterfaces();
    }

    function owner() public view returns (address) {
        return _owner;
    }

    function changeOrgJsonUri(string memory _orgJsonUri) public {}

    function changeOrgJsonHash(bytes32 _orgJsonHash) public {}

    function getOrgJsonUri() external pure returns (string memory) {
        return "https://super-sweet-custom-organization.com";
    }

    function getOrgJsonHash() external pure returns (bytes32) {
        return 0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99;
    }

    function linkDirectory() external pure {}

    function unlinkDirectory() external pure {}

    function newFunction() external pure returns(uint256) {
        return 100;
    }

    function setInterfaces() public {
        OrganizationInterface org;
        bytes4[6] memory interfaceIds = [
            // ERC165 interface: 0x01ffc9a7
            bytes4(0x01ffc9a7),

            // ownable interface: 0x7f5828d0
            org.owner.selector ^ 
            org.transferOwnership.selector, 
            
            // organization interface: 0xe9e17278
            org.changeOrgJsonUri.selector ^ 
            org.changeOrgJsonHash.selector ^ 
            org.getOrgJsonUri.selector ^ 
            org.getOrgJsonHash.selector,

            // hierarchy interface: 0xc501232e
            org.entityDirector.selector ^ 
            org.parentEntity.selector,

            // linkable interface: 0xfa282a77
            org.linkDirectory.selector ^ 
            org.unlinkDirectory.selector,

            // custom interface org.newFunction.selector
            bytes4(0x1b28d63e)
        ];
        for (uint256 i = 0; i < interfaceIds.length; i++) {
            _registerInterface(interfaceIds[i]);
        }
    }
}
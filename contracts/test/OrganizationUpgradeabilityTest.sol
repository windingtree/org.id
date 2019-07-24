pragma solidity ^0.5.6;

import "../Organization.sol";

contract OrganizationUpgradeabilityTest is Organization {

    function newFunction() public pure returns(uint) {
        return 100;
    }

    function setInterfaces() public {
        // OrganizationInterface i;
        bytes4[6] memory interfaceIds = [
            bytes4(0x01ffc9a7), // _INTERFACE_ID_ERC165
            bytes4(0x8da5cb5b), // i.owner.selector
            bytes4(0xfed71811), // i.hasAssociatedKey.selector ^ i.getAssociatedKeys.selector
            bytes4(0x6f4826be), // i.getOrgJsonUri.selector ^ i.getOrgJsonHash.selector
            bytes4(0x1c3af5f4),  // 0x8da5cb5b ^ 0xfed71811 ^ 0x6f4826be
            this.newFunction.selector
        ];
        for (uint256 i = 0; i < interfaceIds.length; i++) {
            if (!this.supportsInterface(interfaceIds[i])) {
                _registerInterface(interfaceIds[i]);
            }
        }
    }

}

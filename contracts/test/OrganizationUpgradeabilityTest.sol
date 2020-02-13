pragma solidity >=0.5.16;

import "../Organization.sol";

contract OrganizationUpgradeabilityTest is Organization {

    function newFunction() public pure returns(uint) {
        return 100;
    }

    function setInterfaces() public {
        OrganizationInterface org;
        bytes4[5] memory interfaceIds = [
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

            // subsidiary interface: 0x9ff6f0b0
            org.createSubsidiary.selector ^ 
            org.toggleSubsidiary.selector ^ 
            this.entityDirector.selector ^ 
            this.parentEntity.selector ^
            org.changeEntityDirector.selector ^ 
            org.getSubsidiary.selector ^ 
            org.getSubsidiaries.selector ^ 
            org.transferDirectorOwnership.selector,

            // custom interface: 0x1b28d63e
            this.newFunction.selector
        ];
        for (uint256 i = 0; i < interfaceIds.length; i++) {
            if (!this.supportsInterface(interfaceIds[i])) {
                _registerInterface(interfaceIds[i]);
            }
        }
    }
}

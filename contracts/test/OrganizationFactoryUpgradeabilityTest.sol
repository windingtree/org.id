pragma solidity ^0.5.6;

import "../OrganizationFactory.sol";

contract OrganizationFactoryUpgradeabilityTest is OrganizationFactory {
    
    function create(string calldata orgJsonUri) external returns (address) {
        address newOrganizationAddress = address(
            app.create(
                "wt-contracts", 
                "OrganizationUpgradeabilityTest", 
                _owner, 
                abi.encodeWithSignature("initialize(address,string)", msg.sender, orgJsonUri)
            )
        );
        _createdOrganizationsIndex[newOrganizationAddress] = _createdOrganizations.length;
        _createdOrganizations.push(newOrganizationAddress);
        emit OrganizationCreated(newOrganizationAddress);

        return newOrganizationAddress;
    }
    
    function newFunction() public pure returns(uint) {
        return 100;
    }

}
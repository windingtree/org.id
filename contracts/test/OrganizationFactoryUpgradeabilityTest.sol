pragma solidity ^0.5.6;

import "../OrganizationFactory.sol";

contract OrganizationFactoryUpgradeabilityTest is OrganizationFactory {
    
    function create(
        string calldata orgJsonUri, 
        bytes32 orgJsonHash
    ) external returns (address) {
        address newOrganizationAddress = address(
            app.create(
                "wt-contracts", 
                "OrganizationUpgradeabilityTest", 
                _owner, 
                abi.encodeWithSignature(
                    "initialize(address,string,bytes32,address,address,address)", 
                    msg.sender, 
                    orgJsonUri, 
                    orgJsonHash,
                    address(this),
                    address(0),
                    address(0)
                )
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
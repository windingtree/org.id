pragma solidity ^0.5.6;

import "../Organization.sol";


contract AirlineUpgradeabilityTest is Organization {

    constructor(
        address payable _manager,
        string memory _dataUri,
        address _index
    ) Organization(_manager, _dataUri, _index) public {}

    function newFunction() public pure returns(uint) {
        return 100;
    }

}

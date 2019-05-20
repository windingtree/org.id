pragma solidity ^0.5.6;

import "../Organization.sol";


contract HotelUpgradeabilityTest is Organization {

    constructor(
        address payable _manager,
        string memory _dataUri,
        address _index
    ) Organization(_manager, _dataUri, _index) public {}

    function newFunction() public pure returns(uint) {
        return 100;
    }

    function _editInfoImpl(string memory _dataUri) internal {
        require(bytes(_dataUri).length != 0);
        dataUri = _dataUri;
    }

    function _destroyImpl() internal {
        selfdestruct(manager);
    }

    function _changeManagerImpl(address payable _newManager) internal {
        require(_newManager != address(0));
        manager = _newManager;
    }

}

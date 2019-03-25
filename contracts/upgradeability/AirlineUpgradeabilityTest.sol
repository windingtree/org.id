pragma solidity ^0.4.25;

import "../airline/AbstractAirline.sol";


contract AirlineUpgradeabilityTest is AbstractAirline {

    constructor(address _manager, string _dataUri, address _index) public {
        require(_manager != address(0));
        require(_index != address(0));
        require(bytes(_dataUri).length != 0);
        manager = _manager;
        index = _index;
        dataUri = _dataUri;
        created = block.number;
    }

    function newFunction() public pure returns(uint) {
        return 100;
    }

    function _editInfoImpl(string _dataUri) internal {
        require(bytes(_dataUri).length != 0);
        dataUri = _dataUri;
    }

    function _destroyImpl() internal {
        selfdestruct(manager);
    }

    function _changeManagerImpl(address _newManager) internal {
        require(_newManager != address(0));
        manager = _newManager;
    }

}

pragma solidity ^0.5.6;

import "../SegmentDirectory.sol";

contract TestSegmentDirectory is SegmentDirectory {

    function createFoodTruck(string calldata dataUri) external returns (address) {
        return createOrganization(dataUri);
    }

    function registerFoodTruck(address foodTruck) external returns (address) {
        return registerOrganization(foodTruck);
    }

    function createAndRegisterFoodTruck(string calldata dataUri) external returns (address) {
        return createAndRegisterOrganization(dataUri);
    }

    function deregisterFoodTruck(address foodTruck) external {
        return deregisterOrganization(foodTruck);
    }
}

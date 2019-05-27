pragma solidity ^0.5.6;

import "../SegmentDirectory.sol";

/**
 * We are using this wrapper of SegmentDirectory for tests because
 * the actual implementation has no external methods.
 */
contract TestSegmentDirectory is SegmentDirectory {

    function createFoodTruck(string calldata dataUri) external returns (address) {
        return createOrganization(dataUri);
    }

    function addFoodTruck(address foodTruck) external returns (address) {
        return addOrganization(foodTruck);
    }

    function createAndAddFoodTruck(string calldata dataUri) external returns (address) {
        return createAndAddOrganization(dataUri);
    }

    function removeFoodTruck(address foodTruck) external {
        return removeOrganization(foodTruck);
    }
}

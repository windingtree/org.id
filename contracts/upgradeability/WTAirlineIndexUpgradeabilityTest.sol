pragma solidity ^0.5.6;

import "../WTAirlineIndex.sol";
import "./AirlineUpgradeabilityTest.sol";


contract WTAirlineIndexUpgradeabilityTest is WTAirlineIndex {

    function registerAirline(string calldata dataUri) external returns (address) {
        AirlineUpgradeabilityTest newAirline = new AirlineUpgradeabilityTest(msg.sender, dataUri, address(this));
        airlinesIndex[address(newAirline)] = airlines.length;
        airlines.push(address(newAirline));
        airlinesByManagerIndex[address(newAirline)] = airlinesByManager[msg.sender].length;
        airlinesByManager[msg.sender].push(address(newAirline));
        emit AirlineRegistered(
            address(newAirline),
            airlinesByManagerIndex[address(newAirline)],
            airlinesIndex[address(newAirline)]
        );
        return address(newAirline);
    }

    function newFunction() public pure returns(uint) {
        return 100;
    }

}

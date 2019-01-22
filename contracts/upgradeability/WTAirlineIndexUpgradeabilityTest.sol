pragma solidity ^0.4.25;

import "../WTAirlineIndex.sol";
import "./AirlineUpgradeabilityTest.sol";


contract WTAirlineIndexUpgradeabilityTest is WTAirlineIndex {

    function registerAirline(string dataUri) external returns (address) {
        AirlineUpgradeabilityTest newAirline = new AirlineUpgradeabilityTest(msg.sender, dataUri, this);
        airlinesIndex[newAirline] = airlines.length;
        airlines.push(newAirline);
        airlinesByManagerIndex[newAirline] = airlinesByManager[msg.sender].length;
        airlinesByManager[msg.sender].push(newAirline);
        emit AirlineRegistered(newAirline, airlinesByManagerIndex[newAirline], airlinesIndex[newAirline]);
        return newAirline;
    }

    function newFunction() public pure returns(uint) {
        return 100;
    }

}

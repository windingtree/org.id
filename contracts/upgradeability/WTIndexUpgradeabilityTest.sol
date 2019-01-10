pragma solidity ^0.4.25;

import "../WTIndex.sol";
import "./HotelUpgradeabilityTest.sol";


contract WTIndexUpgradeabilityTest is WTIndex {

    function registerHotel(string dataUri) external returns (address) {
        HotelUpgradeabilityTest newHotel = new HotelUpgradeabilityTest(msg.sender, dataUri, this);
        hotelsIndex[newHotel] = hotels.length;
        hotels.push(newHotel);
        hotelsByManagerIndex[newHotel] = hotelsByManager[msg.sender].length;
        hotelsByManager[msg.sender].push(newHotel);
        emit HotelRegistered(newHotel, hotelsByManagerIndex[newHotel], hotelsIndex[newHotel]);
        return newHotel;
    }

    function newFunction() public pure returns(uint) {
        return 100;
    }

}

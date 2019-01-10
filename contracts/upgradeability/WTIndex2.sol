pragma solidity ^0.4.25;

import "../WTIndex.sol";
import "./Hotel2.sol";


contract WTIndex2 is WTIndex {

    function registerHotel(string dataUri) external returns (address) {
        Hotel2 newHotel = new Hotel2(msg.sender, dataUri, this);
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

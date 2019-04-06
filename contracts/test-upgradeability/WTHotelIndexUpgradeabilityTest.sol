pragma solidity ^0.5.6;

import "../WTHotelIndex.sol";
import "./HotelUpgradeabilityTest.sol";


contract WTHotelIndexUpgradeabilityTest is WTHotelIndex {

    function registerHotel(string calldata dataUri) external returns (address) {
        HotelUpgradeabilityTest newHotel = new HotelUpgradeabilityTest(msg.sender, dataUri, address(this));
        hotelsIndex[address(newHotel)] = hotels.length;
        hotels.push(address(newHotel));
        hotelsByManagerIndex[address(newHotel)] = hotelsByManager[msg.sender].length;
        hotelsByManager[msg.sender].push(address(newHotel));
        emit HotelRegistered(
            address(newHotel),
            hotelsByManagerIndex[address(newHotel)],
            hotelsIndex[address(newHotel)]
        );
        return address(newHotel);
    }

    function newFunction() public pure returns(uint) {
        return 100;
    }

}

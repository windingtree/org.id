const simulateCrowdsale = require('./simulateCrowdsale');
const hotel = require('./hotel');
const misc = require('./misc');
const privateCall = require('./privateCall');

module.exports = {

  // Crowdsale
  simulateCrowdsale: simulateCrowdsale,

  // Hotel
  createHotel: hotel.createHotel,
  addUnitToHotel: hotel.addUnitToHotel,
  addUnitTypeToHotel : hotel.addUnitTypeToHotel,
  getHotelInfo: hotel.getHotelInfo,

  // PrivateCall
  runBeginCall: privateCall.runBeginCall,
  runContinueCall: privateCall.runContinueCall,

  // Misc
  isZeroBytes32: misc.isZeroBytes32,
  isZeroAddress: misc.isZeroAddress,
  isInvalidOpcodeEx: misc.isInvalidOpcodeEx,
  lifWei2Lif: misc.lifWei2Lif,
  lif2LifWei: misc.lif2LifWei,
  bytes32ToString: misc.bytes32ToString,
  locationToUint: misc.locationToUint,
  locationFromUint: misc.locationToUint,
  jsArrayFromSolidityArray: misc.jsArrayFromSolidityArray,
}

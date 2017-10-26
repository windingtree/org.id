const simulateCrowdsale = require('./simulateCrowdsale');
const hotel = require('./hotel');
const misc = require('./misc');
const privateCall = require('./privateCall');
const book = require('./book');

module.exports = {
  // Curreny version
  version: "0.0.1-alpha",

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

  // Book
  bookInstantly: book.bookInstantly,

  // Misc
  zeroAddress: misc.zeroAddress,
  zeroBytes32: misc.zeroBytes32,
  isZeroBytes32: misc.isZeroBytes32,
  isZeroAddress: misc.isZeroAddress,
  isInvalidOpcodeEx: misc.isInvalidOpcodeEx,
  lifWei2Lif: misc.lifWei2Lif,
  lif2LifWei: misc.lif2LifWei,
  bytes32ToString: misc.bytes32ToString,
  locationToUint: misc.locationToUint,
  locationFromUint: misc.locationToUint,
  jsArrayFromSolidityArray: misc.jsArrayFromSolidityArray,
  pretty: misc.pretty
}

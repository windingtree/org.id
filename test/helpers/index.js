const simulateCrowdsale = require('./simulate-crowdsale');
const hotel = require('./hotel');
const misc = require('./misc');
const packageFile = require('../../package');

module.exports = {
  // Current version
  version: packageFile.version,

  // Crowdsale
  simulateCrowdsale: simulateCrowdsale,

  // Hotel
  createHotel: hotel.createHotel,
  getHotelInfo: hotel.getHotelInfo,

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
  pretty: misc.pretty,
};

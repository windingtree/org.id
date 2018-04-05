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
  isZeroAddress: misc.isZeroAddress,
  isInvalidOpcodeEx: misc.isInvalidOpcodeEx,
  bytes32ToString: misc.bytes32ToString,
  stringToBytes32: misc.stringToBytes32,
  filterZeroAddresses: misc.filterZeroAddresses,
  jsArrayFromSolidityArray: misc.jsArrayFromSolidityArray,
  promisify: misc.promisify,
  determineAddress: misc.determineAddress,
};

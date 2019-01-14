const hotel = require('./hotel');
const airline = require('./airline');
const misc = require('./misc');
const packageFile = require('../../package');

module.exports = {
  // Current version
  version: packageFile.version,

  // Hotel
  createHotel: hotel.createHotel,
  getHotelInfo: hotel.getHotelInfo,

  // Airline
  createAirline: airline.createAirline,
  getAirlineInfo: airline.getAirlineInfo,

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

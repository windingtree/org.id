const hotel = require('./hotel');
const airline = require('./airline');
const misc = require('./misc');
const packageFile = require('../../package');

module.exports = {
  // Current version
  version: packageFile.version,

  // Hotel
  getHotelInfo: hotel.getHotelInfo,

  // Airline
  getAirlineInfo: airline.getAirlineInfo,

  // Misc
  zeroAddress: misc.zeroAddress,
  isZeroAddress: misc.isZeroAddress,
  isInvalidOpcodeEx: misc.isInvalidOpcodeEx,
  filterZeroAddresses: misc.filterZeroAddresses,
  jsArrayFromSolidityArray: misc.jsArrayFromSolidityArray,
  promisify: misc.promisify,
  determineAddress: misc.determineAddress,
};

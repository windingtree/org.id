const {
  isZeroAddress,
  isZeroUint,
  isZeroString,
} = require('./misc');

/**
 * Async function which gets all info associated with airline, its unit types and units. Zero
 * elements in the solidity arrays are filtered out and data types are converted from
 * their solidity form to JS, i.e. bytes32 --> utf8.
 * @param  {Instance} wtAirline Airline contract instance
 * @return {Object}   data
 */
async function getAirlineInfo (wtAirline) {
  // Airline Info
  const dataUri = await wtAirline.dataUri();
  const manager = await wtAirline.manager();
  const created = await wtAirline.created();

  return {
    dataUri: isZeroString(dataUri) ? null : dataUri,
    manager: isZeroAddress(manager) ? null : manager,
    created: isZeroUint(created) ? null : parseInt(created),
  };
}

module.exports = {
  getAirlineInfo: getAirlineInfo,
};

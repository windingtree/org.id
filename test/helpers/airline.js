const WTAirlineInterface = artifacts.require('AbstractAirline.sol');

const {
  isZeroAddress,
  isZeroUint,
  isZeroString,
} = require('./misc');

/**
 * Async method that creates a new empty Airline.
 * @param  {Instance} wtAirlineIndex            WTAirlineIndex contract instance
 * @param  {Address} airlineAccount        address of the airline's account
 * @return {Instance} Airline
 * @example
 *   const wtAirline = await createAirline(accounts[2]);
 *   wtAirline.callAirline(..etc..)
 */
async function createAirline (wtAirlineIndex, airlineAccount) {
  await wtAirlineIndex.registerAirline('WT Airline', 'WT Test Airline', { from: airlineAccount });
  let wtAirlineAddress = await wtAirlineIndex.getAirlinesByManager(airlineAccount);
  let wtAirline = await WTAirlineInterface.at(wtAirlineAddress[0]);

  return wtAirline;
}

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
  const index = await wtAirline.index();

  return {
    dataUri: isZeroString(dataUri) ? null : dataUri,
    manager: isZeroAddress(manager) ? null : manager,
    index: isZeroAddress(index) ? null : index,
    created: isZeroUint(created) ? null : parseInt(created),
  };
}

module.exports = {
  createAirline: createAirline,
  getAirlineInfo: getAirlineInfo,
};

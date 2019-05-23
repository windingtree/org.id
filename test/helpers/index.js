const misc = require('./misc');

async function getOrganizationInfo (wtOrganization) {
  // Airline Info
  const dataUri = await wtOrganization.dataUri();
  const owner = await wtOrganization.owner();
  const created = await wtOrganization.created();

  return {
    dataUri: misc.isZeroString(dataUri) ? null : dataUri,
    owner: misc.isZeroAddress(owner) ? null : owner,
    created: misc.isZeroUint(created) ? null : parseInt(created),
  };
}

module.exports = {
  // Hotel
  getOrganizationInfo,

  // Misc
  zeroAddress: misc.zeroAddress,
  isZeroAddress: misc.isZeroAddress,
  isInvalidOpcodeEx: misc.isInvalidOpcodeEx,
  filterZeroAddresses: misc.filterZeroAddresses,
  jsArrayFromSolidityArray: misc.jsArrayFromSolidityArray,
  promisify: misc.promisify,
  determineAddress: misc.determineAddress,
};

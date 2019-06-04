const misc = require('./misc');

async function getOrganizationInfo (wtOrganization) {
  // Airline Info
  const dataUri = await wtOrganization.methods.getDataUri().call();
  const owner = await wtOrganization.methods.owner().call();
  const created = await wtOrganization.methods.created().call();

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

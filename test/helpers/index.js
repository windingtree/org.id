const misc = require('./misc');

async function getOrganizationInfo (wtOrganization) {
  // Airline Info
  const orgJsonUri = await wtOrganization.methods.getOrgJsonUri().call();
  const owner = await wtOrganization.methods.owner().call();

  return {
    orgJsonUri: misc.isZeroString(orgJsonUri) ? null : orgJsonUri,
    owner: misc.isZeroAddress(owner) ? null : owner,
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

const { assertEvent } = require('./assertions');
const Organization = Contracts.getFromLocal('Organization');

/**
 * Creates a new subsidiary organization
 * @param {Object} organization Organization instance
 * @param {string} organizationOwner Owner account address
 * @param {string} entityDirectorAccount Entity director account address
 * @returns {Promise<{string}>} Promise that resolved with subsidiary instance address
 */
module.exports.createSubsidiary = async (
  organization,
  organizationOwner,
  entityDirectorAccount
) => {
  const result = await organization.methods['createSubsidiary(address)'](entityDirectorAccount).send(
    {
      from: organizationOwner
    }
  );
  let subsidiaryAddress;
  assertEvent(result, 'SubsidiaryCreated', [
    [
      'owner',
      p => (p).should.equal(organizationOwner)
    ],
    [
      'director',
      p => (p).should.equal(entityDirectorAccount)
    ],
    [
      'subsidiary',
      p => {
        (web3.utils.isAddress(p)).should.be.true;
        subsidiaryAddress = p;
      }
    ]
  ]);
  return subsidiaryAddress;
};

/**
 * Toggle state of the subsidiary organization
 * @param {Object} organization Organization instance
 * @param {string} organizationOwner Owner account address
 * @param {string} subsidiaryAddress Subsidiary organization address
 * @returns {Promise}
 */
module.exports.toggleSubsidiary = async (
  organization,
  organizationOwner,
  subsidiaryAddress
) => {
  const subsidiary = await organization.methods['getSubsidiary(address)'](subsidiaryAddress).call();
  const oldState = subsidiary.state;
  const result = await organization.methods['toggleSubsidiary(address)'](subsidiary.address).send(
    {
      from: organizationOwner
    }
  );
  assertEvent(result, 'SubsidiaryCreated', [
    [
      'subsidiary',
      p => (p).should.equal(subsidiaryAddress)
    ],
    [
      'oldState',
      p => (p).should.equal(oldState)
    ],
    [
      'newState',
      p => (p).should.equal(!oldState)
    ]
  ]);
};

/**
 * Confirm subsidiary director ownership
 * @param {Object} organization Organization instance
 * @param {string} subsidiaryAddress Subsidiary organization address
 * @param {string} entityDirectorAccount Director account address
 * @returns {Promise}
 */
module.exports.confirmSubsidiaryDirectorOwnership = async (
  organization,
  subsidiaryAddress,
  entityDirectorAccount
) => {
  const result = await organization.methods['toggleSubsidiary(address)'](subsidiary.address).send(
    {
      from: entityDirectorAccount
    }
  );
  assertEvent(result, 'SubsidiaryDirectorOwnership', [
    [
      'subsidiary',
      p => (p).should.equal(subsidiaryAddress)
    ],
    [
      'director',
      p => (p).should.equal(entityDirectorAccount)
    ]
  ]);
  const subsidiary = await organization.methods['getSubsidiary(address)'](subsidiaryAddress).call();
  (subsidiary.confirmed).should.be.true;
};

/**
 * Transfer organization ownership to the new owner
 * @param {Object} organization Organization instance
 * @param {string} organizationOwner Organization owner
 * @param {string} newOwnerAccount New organization owner account address
 * @returns {Promise}
 */
module.exports.transferOwnership = async (
  organization,
  organizationOwner,
  newOwnerAccount
) => {
  const result = await organization.methods['transferOwnership(address)'](newOwnerAccount).send(
    {
      from: organizationOwner
    }
  );
  assertEvent(result, 'OwnershipTransferred', [
    [
      'previousOwner',
      p => (p).should.equal(organizationOwner)
    ],
    [
      'newOwner',
      p => (p).should.equal(newOwnerAccount)
    ]
  ]);
  const subsidiaries = await organization.methods['getSubsidiaries()']().call();

  for (let i = 0; i < subsidiaries.length; i++) {
    let subsidiary = await Organization.at(subsidiaries[i]);
    (await subsidiary.methods['owner()']().call()).should.equal(newOwnerAccount);
  }
};

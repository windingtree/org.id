const { assertEvent } = require('./assertions');
const { Contracts } = require('@openzeppelin/upgrades');
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
  const oldState = subsidiary.state;// bool
  const result = await organization.methods['toggleSubsidiary(address)'](subsidiary.address).send(
    {
      from: organizationOwner
    }
  );
  assertEvent(result, 'SubsidiaryToggled', [
    [
      'subsidiary',
      p => (p).should.equal(subsidiaryAddress)
    ],
    [
      'previousState',
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
  assertEvent(result, 'DirectorOwnershipConfirmed', [
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
    const subsidiary = await Organization.at(subsidiaries[i]);
    (await subsidiary.methods['owner()']().call()).should.equal(newOwnerAccount);
  }
};

/**
 * Transfer subsidiary director ownership to the new director
 * @param {Object} subsidiaryAddress Subsidiary organization address
 * @param {string} organizationOwner Organization owner
 * @param {string} newDirectorAccount New subsidiary director account address
 * @returns {Promise}
 */
module.exports.transferDirectorOwnership = async (
  subsidiaryAddress,
  organizationOwner,
  newDirectorAccount
) => {
  const subsidiary = await Organization.at(subsidiaryAddress);
  const initialDirector = await subsidiary.methods['getEntityDirector()']().call();
  const result = await subsidiary.methods['transferDirectorOwnership(address)'](newDirectorAccount).send(
    {
      from: organizationOwner
    }
  );
  assertEvent(result, 'DirectorOwnershipTransferred', [
    [
      'subsidiary',
      p => (p).should.equal(subsidiaryAddress)
    ],
    [
      'previousDirector',
      p => (p).should.equal(initialDirector)
    ],
    [
      'newDirector',
      p => (p).should.equal(newDirectorAccount)
    ]
  ]);
};

/**
 * Change ORG.ID JSON URI
 * @param {Object} entity Organization instance
 * @param {string} ownerOrDirectorAccount Organization owner or director account
 * @param {string} newOrgJsonUri New json URI
 * @returns {Promise}
 */
module.exports.changeOrgJsonUri = async (
  entity,
  ownerOrDirectorAccount,
  newOrgJsonUri
) => {
  const initialUri = await entity.methods['getOrgJsonUri()']().call();
  const result = await entity.methods['changeOrgJsonUri(string)'](newOrgJsonUri).send(
    {
      from: ownerOrDirectorAccount
    }
  );
  assertEvent(result, 'OrgJsonUriChanged', [
    [
      'previousOrgJsonUri',
      p => (p).should.equal(initialUri)
    ],
    [
      'newOrgJsonUri',
      p => (p).should.equal(newOrgJsonUri)
    ]
  ]);
};

/**
 * Change ORG.ID JSON hash
 * @param {Object} entity Organization instance
 * @param {string} ownerOrDirectorAccount Organization owner or director account
 * @param {string} newOrgJsonHash New json hash
 * @returns {Promise}
 */
module.exports.changeOrgJsonHash = async (
  entity,
  ownerOrDirectorAccount,
  newOrgJsonHash
) => {
  const initialHash = await entity.methods['getOrgJsonHash()']().call();
  const result = await entity.methods['changeOrgJsonHash(bytes32)'](newOrgJsonHash).send(
    {
      from: ownerOrDirectorAccount
    }
  );
  assertEvent(result, 'OrgJsonHashChanged', [
    [
      'previousOrgJsonHash',
      p => (p).should.equal(initialHash)
    ],
    [
      'newOrgJsonHash',
      p => (p).should.equal(newOrgJsonHash)
    ]
  ]);
};

/**
 * Change ORG.ID JSON URI and hash
 * @param {Object} entity Organization instance
 * @param {string} ownerOrDirectorAccount Organization owner or director account
 * @param {string} newOrgJsonUri New json URI
 * @param {string} newOrgJsonHash New json hash
 * @returns {Promise}
 */
module.exports.changeOrgJsonUriAndHash = async (
  entity,
  ownerOrDirectorAccount,
  newOrgJsonUri,
  newOrgJsonHash
) => {
  const initialUri = await entity.methods['getOrgJsonUri()']().call();
  const initialHash = await entity.methods['getOrgJsonHash()']().call();
  const result = await entity.methods['changeOrgJsonUriAndHash(string,bytes32)'](
    newOrgJsonUri,
    newOrgJsonHash
  ).send(
    {
      from: ownerOrDirectorAccount
    }
  );
  assertEvent(result, 'OrgJsonUriChanged', [
    [
      'previousOrgJsonUri',
      p => (p).should.equal(initialUri)
    ],
    [
      'newOrgJsonUri',
      p => (p).should.equal(newOrgJsonUri)
    ]
  ]);
  assertEvent(result, 'OrgJsonHashChanged', [
    [
      'previousOrgJsonHash',
      p => (p).should.equal(initialHash)
    ],
    [
      'newOrgJsonHash',
      p => (p).should.equal(newOrgJsonHash)
    ]
  ]);
};

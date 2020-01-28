const { assertEvent } = require('./assertions');
const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');

ZWeb3.initialize(web3.currentProvider);
// workaround for https://github.com/zeppelinos/zos/issues/704
Contracts.setArtifactsDefaults({
  gas: 60000000,
});
const Organization = Contracts.getFromLocal('Organization');

/**
 * Creates a new subsidiary organization
 * @param {Object} organization Organization instance
 * @param {string} organizationOwner Owner account address
 * @param {string} entityDirectorAccount Entity director account address
 * @param {string} organizationUri Subsidiary Json Uri
 * @param {string} organizationHash Subsidiary Json hash
 * @returns {Promise<{string}>} Promise that resolved with subsidiary instance address
 */
module.exports.createSubsidiary = async (
  organization,
  organizationOwner,
  entityDirectorAccount,
  organizationUri,
  organizationHash
) => {
  const result = await organization.methods['createSubsidiary(string,bytes32,address)'](
    organizationUri,
    organizationHash,
    entityDirectorAccount
  ).send(
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

  const subsidiaryParams = await organization.methods['getSubsidiary(address)'](subsidiaryAddress).call();
  (subsidiaryParams.id).should.equal(subsidiaryAddress);
  (subsidiaryParams.director).should.equal(entityDirectorAccount);
  (subsidiaryParams.state).should.be.true;
  (subsidiaryParams.confirmed).should.be.false;

  const subsidiary = await Organization.at(subsidiaryAddress);
  (await subsidiary.methods['owner()']().call()).should.equal(organization.address);

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
  const subsidiaryParams = await organization.methods['getSubsidiary(address)'](subsidiaryAddress).call();
  const oldState = subsidiaryParams.state;// bool
  const result = await organization.methods['toggleSubsidiary(address)'](subsidiaryAddress).send(
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
  const result = await organization.methods['confirmSubsidiaryDirectorOwnership(address)'](subsidiaryAddress).send(
    {
      from: entityDirectorAccount
    }
  );
  assertEvent(result, 'SubsidiaryDirectorOwnershipConfirmed', [
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
 * Transfer subsidiary director ownership to the new director
 * @param {string} organizationAddress Master organization address
 * @param {string} subsidiaryAddress Subsidiary organization address
 * @param {string} organizationOwner Organization owner
 * @param {string} newDirectorAccount New subsidiary director account address
 * @returns {Promise}
 */
module.exports.transferSubsidiaryDirectorOwnership = async (
  organizationAddress,
  subsidiaryAddress,
  organizationOwner,
  newDirectorAccount
) => {
  const organization = await Organization.at(organizationAddress);
  const subsidiary = await Organization.at(subsidiaryAddress);
  const initialDirector = await subsidiary.methods['entityDirector()']().call();
  const result = await organization.methods['transferDirectorOwnership(address,address)'](
    subsidiaryAddress,
    newDirectorAccount
  ).send(
    {
      from: organizationOwner
    }
  );
  assertEvent(result, 'SubsidiaryDirectorOwnershipTransferred', [
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

// /**
//  * Change entity director
//  * @param {string} subsidiaryAddress Subsidiary organization address
//  * @param {string} organizationOwner Organization owner
//  * @param {string} newDirectorAccount New subsidiary director account address
//  * @returns {Promise}
//  */
// module.exports.changeEntityDirector = async (
//   subsidiaryAddress,
//   organizationOwner,
//   newDirectorAccount
// ) => {
//   const subsidiary = await Organization.at(subsidiaryAddress);
//   const initialDirector = await subsidiary.methods['getEntityDirector()']().call();
//   const result = await subsidiary.methods['transferDirectorOwnership(address)'](newDirectorAccount).send(
//     {
//       from: organizationOwner
//     }
//   );
//   assertEvent(result, 'DirectorOwnershipTransferred', [
//     [
//       'subsidiary',
//       p => (p).should.equal(subsidiaryAddress)
//     ],
//     [
//       'previousDirector',
//       p => (p).should.equal(initialDirector)
//     ],
//     [
//       'newDirector',
//       p => (p).should.equal(newDirectorAccount)
//     ]
//   ]);
// };

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

const { assertEvent } = require('../helpers/assertions');
const { zeroAddress, zeroHash } = require('../helpers/constants');

/**
 * Generates an ID from string and salt
 */
module.exports.generateHashHelper = () => web3.utils.keccak256(Math.random().toString());

/**
 * Helper function for creating organizations
 * @param {Object} orgIdContract ORG.ID contract instance
 * @param {address} callerAddress Caller address
 * @param {array} arguments Array of arguments for the real createOrganization
 * @dev Arguments order: [requestedOrgIdHash(bytes32), orgJsonUri(string), orgJsonHash(bytes32)]
 * @returns {Promise<{string}>} New ORG.ID hash
 */
module.exports.createOrganizationHelper = async (
    orgIdContract,
    callerAddress,
    arguments
) => {
    const requestedOrgIdHash = arguments[0];
    const orgJsonUri = arguments[1];
    const orgJsonHash = arguments[2];

    const result = await orgIdContract
        .methods['createOrganization(bytes32,string,bytes32)'](
            requestedOrgIdHash,
            orgJsonUri,
            orgJsonHash
        )
        .send({ from: callerAddress });

    let newOrgIdHash;
    assertEvent(result, 'OrganizationCreated', [
        [
            'orgId',
            p => {
                if (requestedOrgIdHash !== zeroHash) {
                    (p).should.equal(requestedOrgIdHash);
                }

                newOrgIdHash = p;
            }
        ],
        [
            'owner',
            p => (p).should.equal(callerAddress)
        ]
    ]);

    const org = await orgIdContract
        .methods['getOrganization(bytes32)'](newOrgIdHash)
        .call();
    (org.orgId).should.equal(newOrgIdHash);
    (org.orgJsonUri).should.equal(orgJsonUri);
    (org.orgJsonHash).should.equal(orgJsonHash);
    (org.parentEntity).should.equal(zeroHash);
    (org.owner).should.equal(callerAddress);
    (org.director).should.equal(zeroAddress);
    (org.state).should.be.true;
    (org.directorConfirmed).should.be.false;

    return newOrgIdHash;
};

/**
 * Helper function for creating organizational units
 * @param {Object} orgIdContract ORG.ID contract instance
 * @param {address} callerAddress Caller address
 * @param {array} arguments Array of arguments for the real createSubsidiary
 * @dev Arguments order: [parentOrgIdHash(bytes32), requestedUnitHash(bytes32), directorAddress(address), orgJsonUri(string), orgJsonHash(bytes32)]
 * @returns {Promise<{string}>} New unit's ORG.ID hash
 */
module.exports.createSubsidiaryHelper = async (
    orgIdContract,
    callerAddress,
    arguments
) => {
    const parentOrgIdHash = arguments[0];
    const requestedUnitHash = arguments[1];
    const directorAddress = arguments[2];
    const orgJsonUri = arguments[3];
    const orgJsonHash = arguments[4];

    const result = await orgIdContract
        .methods['createSubsidiary(bytes32,bytes32,address,string,bytes32)'](
            parentOrgIdHash,
            requestedUnitHash,
            directorAddress,
            orgJsonUri,
            orgJsonHash
        )
        .send({ from: callerAddress });

    let newUnitOrgIdHash;
    assertEvent(result, 'SubsidiaryCreated', [
        [
            'parentOrgId',
            p => (p).should.equal(parentOrgIdHash)
        ],
        [
            'subOrgId',
            p => {
                if (requestedUnitHash !== zeroHash) {
                    (p).should.equal(requestedUnitHash);
                }

                newUnitOrgIdHash = p;
            }
        ],
        [
            'director',
            p => (p).should.equal(directorAddress)
        ]
    ]);

    if (callerAddress === directorAddress) {
        assertEvent(result, 'DirectorOwnershipConfirmed', [
            [
                'orgId',
                p => (p).should.equal(newUnitOrgIdHash)
            ],
            [
                'director',
                p => (p).should.equal(directorAddress)
            ]
        ]);
    }

    const org = await orgIdContract
        .methods['getOrganization(bytes32)'](newUnitOrgIdHash)
        .call();

    (org.orgId).should.equal(newUnitOrgIdHash);
    (org.orgJsonUri).should.equal(orgJsonUri);
    (org.orgJsonHash).should.equal(orgJsonHash);
    (org.parentEntity).should.equal(parentOrgIdHash);
    (org.owner).should.equal(callerAddress);
    (org.director).should.equal(directorAddress);
    (org.state).should.be.true;
    (org.directorConfirmed).should.be[(callerAddress === directorAddress).toString()];

    return newUnitOrgIdHash;
};

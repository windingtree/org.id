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
 * @param {array} args Array of arguments for the real createOrganization
 * @dev Arguments order: [orgJsonUri(string), orgJsonHash(bytes32)]
 * @returns {Promise<{string}>} New ORG.ID hash
 */
module.exports.createOrganizationHelper = async (
    orgIdContract,
    callerAddress,
    args
) => {
    const orgJsonUri = args[0];
    const orgJsonHash = args[1];

    const result = await orgIdContract
        .methods['createOrganization(string,bytes32)'](
            orgJsonUri,
            orgJsonHash
        )
        .send({ from: callerAddress });

    let newOrgIdHash;
    assertEvent(result, 'OrganizationCreated', [
        [
            'orgId',
            p => {
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
    (org.parentOrgId).should.equal(zeroHash);
    (org.owner).should.equal(callerAddress);
    (org.director).should.equal(zeroAddress);
    (org.isActive).should.be.true;
    (org.directorConfirmed).should.be.false;

    return newOrgIdHash;
};

/**
 * Helper function for creating organizational units
 * @param {Object} orgIdContract ORG.ID contract instance
 * @param {address} callerAddress Caller address
 * @param {array} args Array of arguments for the real createUnit
 * @dev Arguments order: [requestedUnitHash(bytes32), directorAddress(address), orgJsonUri(string), orgJsonHash(bytes32)]
 * @returns {Promise<{string}>} New unit's ORG.ID hash
 */
module.exports.createUnitHelper = async (
    orgIdContract,
    callerAddress,
    args
) => {
    const parentOrgIdHash = args[0];
    const directorAddress = args[1];
    const orgJsonUri = args[2];
    const orgJsonHash = args[3];

    const result = await orgIdContract
        .methods['createUnit(bytes32,address,string,bytes32)'](
            parentOrgIdHash,
            directorAddress,
            orgJsonUri,
            orgJsonHash
        )
        .send({ from: callerAddress });

    let newUnitOrgIdHash;
    assertEvent(result, 'UnitCreated', [
        [
            'parentOrgId',
            p => (p).should.equal(parentOrgIdHash)
        ],
        [
            'unitOrgId',
            p => {
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
    (org.parentOrgId).should.equal(parentOrgIdHash);
    (org.owner).should.equal(callerAddress);
    (org.director).should.equal(directorAddress);
    (org.isActive).should.be.true;
    (org.directorConfirmed).should.be[(callerAddress === directorAddress).toString()];

    return newUnitOrgIdHash;
};

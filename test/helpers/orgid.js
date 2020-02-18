const { assertEvent } = require('../helpers/assertions');
const { zeroAddress, zeroBytes } = require('../helpers/constants');

module.exports.generateId = (string, solt = Math.random().toString()) => web3.utils.keccak256(`${string}${solt}`);

module.exports.createOrganization = async (
    contract,
    from,
    id,
    uri,
    hash
) => {
    const result = await contract
        .methods['createOrganization(bytes32,string,bytes32)'](
            id,
            uri,
            hash
        )
        .send({ from });
    let organizationId;
    assertEvent(result, 'OrganizationCreated', [
        [
            'orgId',
            p => {
                if (id !== zeroBytes) {
                    (p).should.equal(id);
                }

                organizationId = p;
            }
        ],
        [
            'owner',
            p => (p).should.equal(from)
        ]
    ]);

    const org = await contract
        .methods['getOrganization(bytes32)'](organizationId)
        .call();
    (org.orgId).should.equal(organizationId);
    (org.orgJsonUri).should.equal(uri);
    (org.orgJsonHash).should.equal(hash);
    (org.parentEntity).should.equal(zeroBytes);
    (org.owner).should.equal(from);
    (org.director).should.equal(zeroAddress);
    (org.state).should.be.true;
    (org.directorConfirmed).should.be.false;

    return organizationId;
};

module.exports.createSubsidiary = async (
    contract,
    from,
    id,
    subId,
    entityDirector,
    uri,
    hash
) => {
    const result = await contract
        .methods['createSubsidiary(bytes32,bytes32,address,string,bytes32)'](
            id,
            subId,
            entityDirector,
            uri,
            hash
        )
        .send({ from });
    let organizationId;
    assertEvent(result, 'SubsidiaryCreated', [
        [
            'parentOrgId',
            p => (p).should.equal(id)
        ],
        [
            'subOrgId',
            p => {
                if (id !== zeroBytes) {
                    (p).should.equal(subId);
                }

                organizationId = p;
            }
        ],
        [
            'director',
            p => (p).should.equal(entityDirector)
        ]
    ]);

    if (from === entityDirector) {
        assertEvent(result, 'DirectorOwnershipConfirmed', [
            [
                'orgId',
                p => (p).should.equal(organizationId)
            ],
            [
                'director',
                p => (p).should.equal(entityDirector)
            ]
        ]);
    }

    const org = await contract
        .methods['getOrganization(bytes32)'](organizationId)
        .call();
    (org.orgId).should.equal(organizationId);
    (org.orgJsonUri).should.equal(uri);
    (org.orgJsonHash).should.equal(hash);
    (org.parentEntity).should.equal(id);
    (org.owner).should.equal(from);
    (org.director).should.equal(entityDirector);
    (org.state).should.be.true;
    (org.directorConfirmed).should.be[(from === entityDirector).toString()];

    return organizationId;
};

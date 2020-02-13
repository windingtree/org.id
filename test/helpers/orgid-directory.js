const { assertEvent } = require('./assertions');
const { createSubsidiary } = require('./orgid-hierarchy');
const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');

ZWeb3.initialize(web3.currentProvider);
// workaround for https://github.com/zeppelinos/zos/issues/704
Contracts.setArtifactsDefaults({
    gas: 60000000,
});

module.exports.createOrganizationAndAddToDir = async (
    organization,
    organizationOwner,
    subsidiaryDirector,
    directory,
    jsonOrgUri,
    jsonOrgHash
) => {
    // Subsidiaries are usually added to the directory
    const subsidiaryAddress = await createSubsidiary(
        organization,
        organizationOwner,
        subsidiaryDirector,
        jsonOrgUri,
        jsonOrgHash
    );
    const length = await directory.methods['getOrganizationsLength()']().call();
    const result = await directory
        .methods['add(address)'](subsidiaryAddress)
        .send({
            from: subsidiaryDirector
        });
    assertEvent(result, 'OrganizationAdded', [
        [
            'organization',
            p => (p).should.equal(subsidiaryAddress)
        ],
        [
            'index',
            p => (p).should.equal(length)
        ]
    ]);
    return subsidiaryAddress;
};

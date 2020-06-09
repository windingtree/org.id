/**
 * Generates random byte32 keccak hash
 */
module.exports.generateHashHelper = () => web3.utils.keccak256(Math.random().toString());

/**
 * Helper function for creating organizations
 * @param {Object} orgIdContract ORG.ID contract instance
 * @param {address} callerAddress Caller address
 * @param {array} args Array of arguments for the real createOrganization
 * @dev Arguments order: [orgJsonUri(string), orgJsonHash(bytes32)]
 * @returns {Promise} Function call promise
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

    return result;
};

/**
 * Helper function for creating organizational units
 * @param {Object} orgIdContract ORG.ID contract instance
 * @param {address} callerAddress Caller address
 * @param {array} args Array of arguments for the real createUnit
 * @dev Arguments order: [requestedUnitHash(bytes32), directorAddress(address), orgJsonUri(string), orgJsonHash(bytes32)]
 * @returns {Promise} Function call promise
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

    return result;
};

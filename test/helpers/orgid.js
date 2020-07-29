/**
 * Generates random byte32 keccak hash
 */
module.exports.generateHashHelper = () => web3.utils.keccak256(Math.random().toString());

/**
 * Helper function for creating organizations
 * @param {Object} orgIdContract ORG.ID contract instance
 * @param {address} callerAddress Caller address
 * @param {array} args Array of arguments for the real createOrganization
 * Arguments order: [
 *   salt(bytes32),
 *   orgJsonHash(bytes32),
 *   orgJsonUri(string),
 *   orgJsonUriBackup1(string),
 *   orgJsonUriBackup2(string)
 * ]
 * @returns {Promise} Function call promise
 */
module.exports.createOrganizationHelper = async (
    orgIdContract,
    callerAddress,
    args
) => {
    const [
        salt,
        orgJsonHash,
        orgJsonUri,
        orgJsonUriBackup1,
        orgJsonUriBackup2
    ] = args;

    const result = await orgIdContract
        .methods['createOrganization(bytes32,bytes32,string,string,string)'](
            salt,
            orgJsonHash,
            orgJsonUri,
            orgJsonUriBackup1,
            orgJsonUriBackup2
        )
        .send({ from: callerAddress });

    return result;
};

/**
 * Helper function for creating organizational units
 * @param {Object} orgIdContract ORG.ID contract instance
 * @param {address} callerAddress Caller address
 * @param {array} args Array of arguments for the real createUnit
 * Arguments order: [
 *   salt(bytes32),
 *   parentOrgIdHash(bytes32),
 *   directorAddress(address),
 *   orgJsonHash(bytes32),
 *   orgJsonUri(string),
 *   orgJsonUriBackup1(string),
 *   orgJsonUriBackup2(string)
 * ]
 * @returns {Promise} Function call promise
 */
module.exports.createUnitHelper = async (
    orgIdContract,
    callerAddress,
    args
) => {
    const [
        salt,
        parentOrgIdHash,
        directorAddress,
        orgJsonHash,
        orgJsonUri,
        orgJsonUriBackup1,
        orgJsonUriBackup2
    ] = args;

    const result = await orgIdContract
        .methods['createUnit(bytes32,bytes32,address,bytes32,string,string,string)'](
            salt,
            parentOrgIdHash,
            directorAddress,
            orgJsonHash,
            orgJsonUri,
            orgJsonUriBackup1,
            orgJsonUriBackup2
        )
        .send({ from: callerAddress });

    return result;
};

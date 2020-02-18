const path = require('path');
const fs = require('fs');
const { title, log } = require('../utils/stdout');
const expect = require('../utils/expect');

module.exports = async (options) => {
    title('ORG.JSON hash');

    expect.all(options, {
        file: {
            type: 'string'
        }
    });

    const {
        file
    } = options;

    try {
        const orgidJsonString = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
        const orgidJson = JSON.parse(orgidJsonString);
        const hash = web3.utils.soliditySha3(orgidJsonString);
        log('DID', orgidJson.id);
        log('Sha3 Hash', hash);

        return {
            hash
        };
    } catch (e) {
        log('Unable to read ORG.ID JSON file due to error', e.message);
    }
};

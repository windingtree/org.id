const { utils: web3utils } = require('web3');

/**
 * ExpectError class
 * @class ExpectError
 * @extends {Error}
 */
class ExpectError extends Error {

    /**
     * Creates an instance of ExpectError.
     * @param {String} message
     * @memberof ExpectError
     */
    constructor(message = 'Unknown error', ...args) { // eslint-disable-line space-before-function-paren
        super(message);
        this.args = args;
    }
};
module.exports.ExpectError = ExpectError;

/**
 * Ensuring expected parameters helper
 * @param {Object} options
 * @param {Object} model
 */
const all = (options = {}, model = {}) => {

    if (typeof options !== 'object' || Object.keys(options).length === 0) {

        throw new ExpectError('Options for "expect.all" must be an object');
    }

    if (typeof model !== 'object' || Object.keys(model).length === 0) {

        throw new ExpectError('Model for "expect.all" must be an object');
    }

    for (const key of Object.keys(model)) {

        if (!model[key].type) {

            throw new ExpectError('Model property must have a "type" defined');
        }

        const value = key.split('.').reduce((acc, part) => {
            return acc && acc[part] !== undefined ? acc[part] : null;
        }, options);

        switch (model[key].type) {
            case 'enum':

                if (!model[key].values || !Array.isArray(model[key].values)) {

                    throw new ExpectError(
                        'Enumerator conditions array not defined in the model',
                        {
                            expected: 'enum',
                            values: model[key].values,
                            key,
                            value
                        }
                    );
                }

                if (!model[key].values.includes(value) &&
                    (model[key].required === true || model[key].required === undefined)) {

                    throw new ExpectError(
                        `The value type of the "${String(key)}" property is not valid. Expected type one of ${model[key].values} but got: ${String(value)}`,
                        {
                            expected: 'enum',
                            values: model[key].values,
                            key,
                            value
                        }
                    );
                }

                break;

            case 'address':

                if (!new RegExp('^0x[a-fA-F0-9]{40}$').test(value) &&
                    (model[key].required === true || model[key].required === undefined)) {

                    throw new ExpectError(
                        `Ethereum address is required as value for the property: "${key}"`,
                        {
                            expected: 'address',
                            key,
                            value
                        }
                    );
                }

                break;

            case 'hash':

                if (!new RegExp('^0x[a-fA-F0-9]{64}$').test(value) &&
                    (model[key].required === true || model[key].required === undefined)) {

                    throw new ExpectError(
                        `Ethereum tx hash is required as value for the property: "${key}"`,
                        {
                            expected: 'hash',
                            key,
                            value
                        }
                    );
                }

                break;

            case 'bn':

                if (!web3utils.isBN(value) &&
                    (model[key].required === true || model[key].required === undefined)) {

                    throw new ExpectError(
                        `BN instance expected as value for the property "${key}" but got: ${value}`,
                        {
                            expected: 'bn',
                            key,
                            value
                        }
                    );
                }

                break;

            case 'functionOrMember':

                if (typeof value === 'function') {

                    // It is OK
                    break;
                }
                // If not then follow the next rule

                // eslint-disable-next-line no-fallthrough
            case 'member':

                if (!model[key].provider || typeof model[key].provider !== 'object') {
                    throw new ExpectError(
                        `Provider object must be defined as "provider" model option for "${key}"`
                    );
                }

                if (typeof value !== 'string') {
                    throw new ExpectError(
                        `Property with "member" type must be a string but actually, it is a "${typeof value}"`
                    );
                }

                // eslint-disable-next-line no-case-declarations
                const memberValue = value.split('.').reduce((acc, part) => {
                    return acc && acc[part] !== undefined ? acc[part] : null;
                }, model[key].provider);

                if (!memberValue) {

                    throw new ExpectError('Not a member', {
                        expected: model[key].type,
                        provider: model[key].provider,
                        key,
                        value
                    });
                }

                break;

            default:

                // eslint-disable-next-line valid-typeof
                if (typeof value !== model[key].type &&
                    (model[key].required === true || model[key].required === undefined)) {

                    throw new ExpectError(
                        `The value type of the "${key}" property is not valid: ${value}`,
                        {
                            expected: model[key].type,
                            key,
                            value
                        }
                    );
                }
        }
    }
};
module.exports.all = all;

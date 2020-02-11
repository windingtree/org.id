/**
 * Parse argv parameters
 * @param {String[]} argv Argv array to parce
 * @param {Number} skip Count of parameters to skip from beginning of  the array
 * @returns {Object} Object with command line arguments
 */
module.exports.parseArgv = (argv, skip = 0) => {

    if (!Array.isArray(argv)) {
        throw new Error('ERROR_INVALID_ARGV');
    }

    argv = argv.slice(skip);

    let normalised = [];
    const args = {};

    argv.forEach((arg) => {

        // Splitting and cleananup
        normalised = [...normalised, ...(arg.split('='))
            .map(a => a.replace(/^-{1,2}/g, ''))];
    });

    for (let i = 0; i < normalised.length; i += 2) {
        args[normalised[i]] = normalised[i + 1] ? normalised[i + 1] : '';
    }

    return args;
};

/**
 * Parse command parameters
 * @param {Object} params
 * @returns {String[]}
 */
module.exports.parseParams = params => {

    if (!params) {
        return [];
    }

    return params.split(',').map(p => {
        const template = /^number:/g;
        return p.match(template) ? parseInt(p.replace(template, '')) : p;
    });
};

/**
 * Replace properties in the arguments array
 * @param {string[]} source Array of arguments
 * @param {Object} options Replacements object
 * @returns {string[]}
 */
module.exports.applyArgs = (source = [], options = {}) => source.map(
    i => options[i] ? options[i] : i
);

// Converting result property
// Calling recursively on objects and arrays
const convertProperty = prop => {

    if (typeof prop === 'string') {
        return prop;
    }

    if (typeof prop === 'number') {
        return String(prop);
    }

    if (web3.utils.isBN(prop) || web3.utils.isBigNumber(prop)) {
        return prop.toString();
    }

    if (Array.isArray(prop)) {
        return prop.map(p => convertProperty(p));
    }

    if (typeof prop === 'object') {
        for (const p in prop) {
            prop[p] = convertProperty(prop[p]);
        }
        return prop;
    }

    return prop;
};

/**
 * Converting web3 result to string value
 * @param {*} result web3 call result
 * @returns {*}
 */
module.exports.parseCallResult = result => convertProperty(result);

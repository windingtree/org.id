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
        normalised = [...normalised, ...(arg.split('=')).map(a => a.replace(/^-{1,2}/g, ''))];
    });

    for (let i = 0; i < normalised.length; i += 2) {
        args[normalised[i]] = normalised[i+1] ? normalised[i+1] : '';
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

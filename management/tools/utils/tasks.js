/**
 * Extract a value from the object by path
 * @param {Object} obj Source object
 * @param {string} path Path to value
 */
const deepValue = (obj, path) => path.split('.').reduce((a, v) => a[v], obj);

/**
 * Build options for the task command
 * @param {Object} properties Array of properties
 * @param {Object[]} resultsScope Array of results of commands finished before
 * @returns {Object}
 */
module.exports.buildTaskOptions = (properties, resultsScope) => {
    const options = {};

    const parseProperty = (property) => {

        if (property.match(/^\[TASK:/g)) {
            const parts = property.replace(/[\[\]']+/g, '').split(':'); // eslint-disable-line no-useless-escape
            const result = resultsScope[Number(parts[1])];
            return deepValue(result, parts[2]);
        }

        return property;
    };

    for (const prop in properties) {

        if (typeof properties[prop] === 'string') {
            options[prop] = parseProperty(properties[prop]);
        }

        if (Array.isArray(properties[prop])) {
            options[prop] = properties[prop].map(a => parseProperty(a)).join(',');
        }
    }

    return options;
};

/**
 * Parse grouped command parameters
 * @param {Object} params
 * @returns {Object}
 */
module.exports.parseParamsReplacements = params => {
    
    if (!params) {
        return {};
    }

    return params.split(',').reduce((a, v) => {
        const param = v.trim().split(':');
        a[`[${param[0]}]`] = param[1];
        return a;
    }, {});
};

/**
 * Replace templated paramenters with provided value
 * @param {Object} taskParams
 * @param {Object} replacements
 * @returns {Object}
 */
module.exports.applyParamsReplacements = (taskParams, replacements) => {

    if (!replacements || !Object.keys(replacements).length === 0) {
        return taskParams;
    }

    const replace = (param, replacements) => replacements[param]
        ? replacements[param]
        : param;

    for (const param in taskParams) {

        if (Array.isArray(taskParams[param])) {
            taskParams[param] = taskParams[param].map(p => replace(p, replacements));
        } else if (typeof param === 'string') {
            taskParams[param] = replace(taskParams[param], replacements);
        }
    }
    return taskParams;
};

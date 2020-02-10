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
      const parts = property.replace(/[\[\]']+/g, '').split(':');
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

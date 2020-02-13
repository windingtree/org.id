/**
 * Assert transaction revert
 * @param {Object} promise Promise object to process
 * @param {boolean} [reason=null] Revert reason to compare
 * @returns {Promise}
 */
module.exports.assertRevert = async (promise, reason = false) => {

    try {
        await promise;
        assert.fail('The assertion is fulfilled although failure was expected');
    } catch (error) {
        const revertFound = error.message.search('revert') >= 0;
        const reasonFoundByString = error.message.search(reason) >= 0;
        const reasonFound = reason
            ? error.reason === reason|| reasonFoundByString
            : true; // truffle 5 have to provide a revert reason string

        if (reason) {
            assert(
                revertFound && reasonFound,
                `Expected "revert"${
                    reason ? ' with reason "' + reason + '"' : ''
                }, got ${error} instead`
            );
        } else if (!reason && !revertFound) {
            throw error;
        }
    }
};

/**
 * Validate specific event existence
 * @param {Object} result Transaction execution result
 * @param {string} eventName Event name
 * @param {Array<[{string,{Function}}]>} validationConfig
 */
module.exports.assertEvent = (result, eventName, validationConfig) => {
    const event = result.events && result.events[eventName] ? result.events[eventName] : false;
    assert(typeof event === 'object', `Event "${eventName}" not found`);
    validationConfig.forEach(c => {
        assert(typeof c[0] === 'string', 'Property name has not a string type');
        assert(typeof c[1] === 'function', 'Property validator is not a function');
        assert(
            event.returnValues[c[0]] !== undefined,
            `Property '${c[0]}' not found in the event object`
        );
        c[1](event.returnValues[c[0]]);
    });
};

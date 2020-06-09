/**
 * Assert transaction revert
 * @param {Object} promise Promise object to process
 * @param {boolean} [reason=null] Revert reason to compare
 * @returns {Promise}
 */
module.exports.assertRevert = async (promise, expectedReason = null) => {
    if (expectedReason === null) {
        throw('assertRevert: expected reason for revert must be provided');
    }

    try {
        await promise;
        assert.fail('Revert was expected, but action succeeded');
    } catch (error) {
        const msg = error.message;
        const revertFound = msg.indexOf('revert') !== -1;
        const expectedReasonFound = msg.indexOf(expectedReason) !== -1 || error.reason === expectedReason;

        // Both "revert" keyword and the expected revert reason must be present in the error message
        if (!revertFound) {
            assert(false, '"revert" keyword not found in error message: ' + msg);
        }
        
        if (!expectedReasonFound) {
            assert(false, `Expected revert reason was not found in error message.

            expected reason: "${expectedReason}"
              error message: "${msg}"`);
        }

        assert(true);
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

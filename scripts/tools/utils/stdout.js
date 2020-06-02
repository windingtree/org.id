/**
 * Prints a title string
 * @param {*[]} args Array of the function arguments
 */
module.exports.title = (...args) => print.apply(null, [true, ...args]); // eslint-disable-line no-useless-call

/**
 * Prints a string with label
 * @param {*[]} args Array of the function arguments
 */
module.exports.log = (...args) => print.apply(null, [false, ...args]); // eslint-disable-line no-useless-call

/**
 * Prints a string
 * @param {boolean} isTitle Flag is title should be printed
 * @param {string} label Label text
 * @param {string} text Text
 * @param {boolean} divided Flag is horizontal divider should be printed
 */
const print = (isTitle = false, label, text, divided = false) => {

    if (process.env.TESTING) {
        return; // Suppress logs in testing mode
    }

    if (divided || isTitle) {
        console.log('\x1b[36m' + '='.repeat(80), '\x1b[0m');
    }

    console.log(
        label ? `${isTitle ? '\x1b[32m' : '\x1b[36m'}${label}${text ? ':' : ''} \x1b[0m` : '',
        text ? text : '' // eslint-disable-line no-unneeded-ternary
    );
};
module.exports.print = print;

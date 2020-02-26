/**
 * Convert number to BN
 * @param {string} value
 * @returns {Object<BN>}
 */
const toBN = x => web3.utils.isBN(x) ? x : web3.utils.toBN(x);
module.exports.toBN = toBN;

/**
 * Convert value to wei
 * @param {string} value
 * @returns {Object<BN>}
 */
const toWeiEther = x => web3.utils.toWei(x, 'ether');
module.exports.toWeiEther = toWeiEther;

/**
 * Convert Wei to BN
 * @param {string} value
 * @returns {Object<BN>}
 */
const toWeiBN = x => web3.utils.toBN(toWeiEther(x));
module.exports.toWeiBN = toWeiBN;

const { Contracts } = require('@openzeppelin/upgrades');
const { toWeiEther } = require('./common');

/**
 * Creates token instance
 * @param {string} from The token owner address
 * @param {string} totalSupply Amount of tokens to mint
 * @returns {Promise<{Object}>} The token instance
 */
module.exports.setupLifToken = async (
    from,
    totalSupply = '1000000'
) => {
    const LifToken = Contracts.getFromLocal('LifTest');
    return await LifToken.new(
        'Lif token',
        'Lif',
        18,
        toWeiEther(totalSupply),
        {
            from
        }
    );
};

/**
 * Sends tokens to the list of address
 * @param {Object} token The token instance
 * @param {string} from The token owner address
 * @param {string} value Amount of tokens to send
 * @param {string[]} distributionList Array of addresses
 * @returns {Promise}
 */
module.exports.distributeLifTokens = async (
    token,
    from,
    value,
    distributionList = []
) => await Promise.all(distributionList.map(
    addr => token.methods['mint(address,uint256)'](
        addr,
        toWeiEther(value)
    ).send({ from })
));

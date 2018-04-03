const web3 = require('web3');
const _ = require('lodash');

const zeroAddress = '0x0000000000000000000000000000000000000000';
const zeroBytes32 = '0x0000000000000000000000000000000000000000000000000000000000000000';

module.exports = {
  isZeroBytes32: function (val) {
    return val === zeroBytes32;
  },

  isZeroAddress: function (val) {
    return val === zeroAddress;
  },

  isZeroString: function (val) {
    return !(val.length);
  },

  isZeroUint: function (val) {
    return parseInt(val) === 0;
  },

  isInvalidOpcodeEx: function (e) {
    if (
      e.message.search('invalid opcode') >= 0 || // ethereumjs-testrpc at least <= 4
      e.message.search('revert') >= 0 // ganache-cli at least 6+
    ) {
      return true;
    } else {
      console.error(e);
      return false;
    }
  },

  bytes32ToString: function (hex) {
    return web3.utils.hexToUtf8(hex);
  },

  stringToBytes32: function (text) {
    return web3.utils.utf8ToHex(text);
  },

  hashCustomId: function (id) {
    return web3.utils.soliditySha3(id);
  },

  /**
   * Traverses a solidity array and returns an array of all its non-zero elements
   * @param {Function} getAtIndex reference to a getter method (e.g. getImage)
   * @param {Number}   length solidity array's length
   * @param {Function} zeroComparator e.g isZeroAddress
   * @return {Promise} Array
   */
  jsArrayFromSolidityArray: async function (getAtIndex, length, zeroComparator) {
    const arr = [];

    for (let i = 0; i < length; i++) {
      let item = await getAtIndex(i);
      arr.push(item);
    };

    return (zeroComparator !== undefined)
      ? arr.filter(item => !zeroComparator(item))
      : arr;
  },

  filterZeroAddresses: function (listOfAddresses) {
    return _.filter(listOfAddresses, (a) => a !== zeroAddress);
  },

};

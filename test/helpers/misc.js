var utf8 = require('utf8');

module.exports = {
  
  isZeroBytes32: function(val){
    return val === '0x0000000000000000000000000000000000000000000000000000000000000000';
  },
  
  isZeroAddress: function(val){
    return val === '0x0000000000000000000000000000000000000000';
  },

  isZeroString: function(val){
    return !val.length
  },

  isZeroUint: function(val){
    return parseInt(val) === 0;
  },

  isInvalidOpcodeEx: function(e) {
    return e.message.search('invalid opcode') >= 0;
  },

  lifWei2Lif: function(value){
    return web3.fromWei(value, 'ether');
  },

  lif2LifWei: function(value){
    return web3.toWei(value, 'ether');
  },

  // Stolen from the web3 1.0 lib (method is called toUtf8)
  bytes32ToString: function(hex){
    var str = "";
    var i = 0, l = hex.length;
    if (hex.substring(0, 2) === '0x') {
        i = 2;
    }
    for (; i < l; i+=2) {
        var code = parseInt(hex.substr(i, 2), 16);
        if (code === 0)
            break;
        str += String.fromCharCode(code);
    }

    return utf8.decode(str);
  },

  /**
   * Traverses a solidity array and returns an array of all its non-zero elements 
   * @param {Function} getAtIndex reference to a getter method (e.g. getImage)
   * @param {Number}   length solidity array's length
   * @param {Function} zeroComparator e.g isZeroAddress
   * @return {Promise} Array 
   */
  jsArrayFromSolidityArray: async function(getAtIndex, length, zeroComparator){
    const arr = [];

    for (let i = 0; i < length; i++){
      let item = await getAtIndex(i);
      arr.push(item)
    };

    return (zeroComparator !== undefined)
      ? arr.filter(item => zeroComparator(item))
      : arr;
  }
}


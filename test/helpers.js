var BigNumber = web3.BigNumber;

var LifCrowdsale = artifacts.require('./LifCrowdsale.sol');
var latestTime = require('./helpers/latestTime');
var {increaseTimeTestRPC, increaseTimeTestRPCTo} = require('./helpers/increaseTime');
var {createHotel, addUnitToHotel} = require('./helpers/hotel');

module.exports = {

  isInvalidOpcodeEx: function(e) {
    return e.message.search('invalid opcode') >= 0;
  },

  lifWei2Lif: function(value){
    return web3.fromWei(value, 'ether');
  },

  lif2LifWei: function(value){
    return web3.toWei(value, 'ether');
  },

  simulateCrowdsale: async function(rate, balances, accounts, weiPerUSD) {
    await increaseTimeTestRPC(1);
    var startTime = latestTime() + 5;
    var endTime = startTime + 20;

    var crowdsale = await LifCrowdsale.new(
      startTime+3, startTime+15, endTime,
      rate, rate+10, 1,
      accounts[0], accounts[1],
    );
  
    await increaseTimeTestRPCTo(latestTime()+1);
    await crowdsale.setWeiPerUSDinTGE(weiPerUSD);
    await increaseTimeTestRPCTo(startTime+3);
    for(let i = 0; i < 5; i++) {
      if (balances[i] > 0)
        await crowdsale.sendTransaction({ value: web3.toWei(balances[i]/rate, 'ether'), from: accounts[i + 1]});
    }
    await increaseTimeTestRPCTo(endTime+1);
    await crowdsale.finalize();
    return crowdsale;
  },

  waitBlocks: function(toWait, accounts){
    return this.waitToBlock(parseInt(web3.eth.blockNumber) + toWait, accounts);
  },

  createHotel: createHotel,
  addUnitToHotel: addUnitToHotel,
};


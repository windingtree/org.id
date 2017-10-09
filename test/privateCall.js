const assert = require('chai').assert;
const help = require('./helpers/index.js');
const abiDecoder = require('abi-decoder');

const WTHotel = artifacts.require('Hotel.sol')
const WTIndex = artifacts.require('WTIndex.sol');
const Unit = artifacts.require('Unit.sol')

abiDecoder.addABI(Unit._json.abi);

contract('PrivateCall.sol', function(accounts) {
  const hotelName = 'WTHotel';
  const hotelDescription = 'WT Test Hotel';
  const typeName = 'BASIC_ROOM';
  const typeNameHex = web3.toHex(typeName);
  const hotelAccount = accounts[2];
  const nonOwnerAccount = accounts[3];
  const augusto = accounts[1];

  let wtIndex;
  let wtHotel;
  let unitType;
  let unit;

  // Create and register a hotel
  beforeEach( async function(){
    wtIndex = await WTIndex.new();
    wtHotel = await help.createHotel(wtIndex, hotelAccount);
    unitType = await help.addUnitTypeToHotel(wtIndex, wtHotel, typeName, hotelAccount);
  });

  describe('changeConfirmation', function(){

    beforeEach( async function(){
      unit = await help.addUnitToHotel(wtIndex, wtHotel, typeName, hotelAccount);
    })

    it('should change the waitConfirmation flag', async function(){
      const initialState = await unit.waitConfirmation();
      const data = unit.contract.changeConfirmation.getData(true);
      const callUnitData = wtHotel.contract.callUnit.getData(unit.address, data);
      await wtIndex.callHotel(0, callUnitData, {from: hotelAccount});
      const finalState = await unit.waitConfirmation();

      assert(finalState);
      assert.notEqual(initialState, finalState);
    });

    it('should throw if non-owner changes confirmation', async function(){
      const data = unit.contract.changeConfirmation.getData(true);
      const callUnitData = wtHotel.contract.callUnit.getData(unit.address, data);

      try {
        await wtIndex.callHotel(0, callUnitData, {from: nonOwnerAccount});
        assert(false);
      } catch(e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('beginCall: (confirmation required)', function(){
    let bookData;
    let begin;
    let hash;
    let userInfo = web3.toHex('user info');

    // Add a unit that requires confirmation, beginCall w/ book data and synth msgDataHash
    beforeEach(async function() {
      unit = await help.addUnitToHotel(wtIndex, wtHotel, typeName, hotelAccount, true);
      const giveVoteData = wtIndex.contract.giveVote.getData(hotelAccount);
      const callIndexData = wtHotel.contract.callIndex.getData(giveVoteData);
      bookData = unit.contract.book.getData(augusto, 60, 5, callIndexData);
      begin = await unit.beginCall(bookData, userInfo, {from: augusto});
      const input = web3.eth.getTransaction(begin.tx).input;
      hash = web3.sha3(input, {encoding: 'hex'});
    });

    it.skip('should store correct information about the call', async function(){
      const [
        callData,
        sender,
        approved,
        success
      ] = await unit.pendingCalls.call(hash);

      assert.equal(callData, bookData);
      assert.equal(sender, augusto);
      assert.equal(approved, false);
      assert.equal(success, false);
    });

    it('should fire a CallStarted event', async function(){
      const events = abiDecoder.decodeLogs(begin.receipt.logs);
      const callStarted = events.filter(item => item.name === 'CallStarted')[0];
      const fromTopic = callStarted.events.filter(item => item.name === 'from')[0];
      const dataHashTopic = callStarted.events.filter(item => item.name === 'dataHash')[0];

      assert.equal(fromTopic.value, augusto);
      assert.equal(dataHashTopic.value, hash);
    });

    it('should not fire a CallFinish event', async function(){
      const events = abiDecoder.decodeLogs(begin.receipt.logs);
      const callFinishedEvents = events.filter(item => item.name === 'CallFinish');
      assert.equal(callFinishedEvents.length, 0);
    });

    it('should not fire a CallStarted event if call is duplicate', async function() {
      // We've already begun and indentical call in the beforeEach block
      const begin2 = await unit.beginCall(bookData, userInfo, {from: augusto});
      const events = abiDecoder.decodeLogs(begin2.receipt.logs);
      const callStartedEvents = events.filter(item => item.name === 'CallStarted');

      assert.equal(callStartedEvents.length, 0);
    });

    // Waiting for token integration to test this, beginCall needs to be invoked
    // as an internal call for the return value to have any meaning.
    it.skip('should return false if call is duplicate');
  });

  describe('beginCall: no confirmation required', function(){
    let bookData;
    let begin;
    let hash;
    let userInfo = web3.toHex('user info');

    // Add a unit that accepts instant booking, beginCall w/ book data, synth msgData hash
    beforeEach(async function() {
      unit = await help.addUnitToHotel(wtIndex, wtHotel, typeName, hotelAccount);
      const giveVoteData = wtIndex.contract.giveVote.getData(hotelAccount);
      const callIndexData = wtHotel.contract.callIndex.getData(giveVoteData);
      bookData = unit.contract.book.getData(augusto, 60, 5, callIndexData);
      begin = await unit.beginCall(bookData, userInfo, {from: augusto});
      const input = web3.eth.getTransaction(begin.tx).input;
      hash = web3.sha3(input, {encoding: 'hex'});
    });

    it('should execute the passed callData', async function(){
      // Checking for a 'Book' event, e.g the book call was executed.
      const events = abiDecoder.decodeLogs(begin.receipt.logs);
      const bookEvents = events.filter(item => item && item.name === 'Book');
      assert.equal(bookEvents.length, 1);
    });

    it.skip('should set PendingCall success flag to true on success', async function(){
      const [
        callData,
        sender,
        approved,
        success
      ] = await unit.pendingCalls.call(hash);

      assert(success);
    });

    it('should fire a CallFinish event', async function(){
      const events = abiDecoder.decodeLogs(begin.receipt.logs);
      const callFinish = events.filter(item => item && item.name === 'CallFinish')[0];
      const fromTopic = callFinish.events.filter(item => item.name === 'from')[0];
      const dataHashTopic = callFinish.events.filter(item => item.name === 'dataHash')[0];

      assert.equal(fromTopic.value, augusto);
      assert.equal(dataHashTopic.value, hash);
    });

    // Wait for token integration ?
    it.skip('should return true if the call fails or succeeds');
  });

  describe('continueCall: success cases', function(){
    let hash;
    let _continue;
    let userInfo = web3.toHex('user info');

    // Add a unit that requires confirmation,
    // beginCall w/ book data,
    // synth msgDataHash
    // execute continueCall via wtIndex.callHotel
    beforeEach(async function() {
      unit = await help.addUnitToHotel(wtIndex, wtHotel, typeName, hotelAccount, true);
      const giveVoteData = wtIndex.contract.giveVote.getData(hotelAccount);
      const callIndexData = wtHotel.contract.callIndex.getData(giveVoteData);
      const bookData = unit.contract.book.getData(augusto, 60, 5, callIndexData);
      const begin = await unit.beginCall(bookData, userInfo, {from: augusto});
      const input = web3.eth.getTransaction(begin.tx).input;
      hash = web3.sha3(input, {encoding: 'hex'});

      const continueData = unit.contract.continueCall.getData(hash);
      const callUnitData = await wtHotel.contract.callUnit.getData(unit.address, continueData);
      _continue = await wtIndex.callHotel(0, callUnitData, {from: hotelAccount});
    });

    it('should execute the pending call', async function(){
      const events = abiDecoder.decodeLogs(_continue.receipt.logs);
      const bookEvents = events.filter(item => item && item.name === 'Book');
      assert.equal(bookEvents.length, 1);
    });

    it.skip('should set the PendingCall records approved flag to true', async function(){
      const [
        callData,
        sender,
        approved,
        success
      ] = await unit.pendingCalls.call(hash);
      assert(approved);
    });

    it.skip('should set the PendingCall records success flag to true if call succeeds', async function(){
      const [
        callData,
        sender,
        approved,
        success
      ] = await unit.pendingCalls.call(hash);
      assert(success);
    });

    it('should fire a CallFinishEvent', async function(){
      const events = abiDecoder.decodeLogs(_continue.receipt.logs);
      const callFinish = events.filter(item => item && item.name === 'CallFinish')[0];
      const fromTopic = callFinish.events.filter(item => item.name === 'from')[0];
      const dataHashTopic = callFinish.events.filter(item => item.name === 'dataHash')[0];

      assert.equal(fromTopic.value, augusto);
      assert.equal(dataHashTopic.value, hash);
    });
  });

  describe('continueCall: failure cases', function(){

    beforeEach(async function() {
      unit = await help.addUnitToHotel(wtIndex, wtHotel, typeName, hotelAccount, true);
    });

    it('should throw if call hash does not exists in the pendingCalls map', async function(){
      const badHash = '0xabcdef';
      const continueData = unit.contract.continueCall.getData(badHash);
      const callUnitData = await wtHotel.contract.callUnit.getData(unit.address, continueData);

      try {
        await wtIndex.callHotel(0, callUnitData, {from: hotelAccount});
        assert(false);
      } catch(e){
        assert(help.isInvalidOpcodeEx);
      }
    })

    // ....Something's wrong here.....
    it.skip('PendingCalls success flag should be false if call fails', async function(){
      const userInfo = web3.toHex('user info');
      const unit = await help.addUnitToHotel(wtIndex, wtHotel, typeName, hotelAccount, true);

      // Augusto cannot setDao --> terminal call fails
      const daoData = wtIndex.contract.setDAO.getData(augusto);
      const callIndexData = wtHotel.contract.callIndex.getData(daoData);
      const bookData = unit.contract.book.getData(augusto, 60, 5, callIndexData);

      const begin = await unit.beginCall(bookData, userInfo, {from: augusto});
      const input = web3.eth.getTransaction(begin.tx).input;
      const hash = web3.sha3(input, {encoding: 'hex'});

      const continueData = unit.contract.continueCall.getData(hash);
      const callUnitData = await wtHotel.contract.callUnit.getData(unit.address, continueData);
      await wtIndex.callHotel(0, callUnitData, {from: hotelAccount});

      const [
        callData,
        sender,
        approved,
        success
      ] = await unit.pendingCalls.call(hash);

      assert.equal(success, false);
    });
  });
});

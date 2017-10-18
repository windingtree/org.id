const assert = require('chai').assert;
const help = require('./helpers/index.js');
const abiDecoder = require('abi-decoder');

const WTHotel = artifacts.require('Hotel.sol')
const WTIndex = artifacts.require('WTIndex.sol');
const LifToken = artifacts.require('LifToken.sol');
const Unit = artifacts.require('Unit.sol')

abiDecoder.addABI(Unit._json.abi);
abiDecoder.addABI(LifToken._json.abi);

contract('PrivateCall', function(accounts) {
  const augusto = accounts[1];
  const hotelAccount = accounts[2];
  const typeName = 'BASIC_ROOM';
  const fromDay = 60;
  const daysAmount = 5;
  const price = 1;
  const unitArgPos = 1;
  const dataArgPos = 8;

  let defaultCallArgs;
  let index;
  let hotel;
  let unitType;
  let unit;
  let stubData;

  // Create and register a hotel
  beforeEach( async function(){
    index = await WTIndex.new();
    hotel = await help.createHotel(index, hotelAccount);
    unitType = await help.addUnitTypeToHotel(index, hotel, typeName, hotelAccount);
    stubData = index.contract.getHotels.getData();
    defaultCallArgs = [
      hotel,
      null,
      augusto,
      fromDay,
      daysAmount,
      price,
      'approveData',
      accounts,
      stubData
    ];
  });

  describe('changeConfirmation', function(){

    beforeEach( async function(){
      unit = await help.addUnitToHotel(index, hotel, typeName, hotelAccount);
    })

    it('should change the waitConfirmation flag', async function(){
      const initialState = await hotel.waitConfirmation();
      const data = hotel.contract.changeConfirmation.getData(true);
      await index.callHotel(0, data, {from: hotelAccount});
      const finalState = await hotel.waitConfirmation();

      assert(finalState);
      assert.notEqual(initialState, finalState);
    });

    // NB - these would work if sent from Hotel & contracts can send gas
    it('should only be accessible via the index contract', async function(){
      // Via hotel:
      try {
        await hotel.changeConfirmation(true, {from: hotelAccount});
        assert(false);
      } catch(e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('beginCall: (confirmation required)', function(){
    let bookData;
    let events;
    let hash;
    let stubData;
    let token;
    let unit;
    let userInfo;
    let value;

    // Add a unit that requires confirmation, execute a token.approveData booking
    // Unit is the recipient of tokens
    beforeEach(async function() {
      unit = await help.addUnitToHotel(index, hotel, typeName, hotelAccount, true);
      defaultCallArgs[unitArgPos] = unit;
      ({
        bookData,
        events,
        hash,
        token,
        userInfo,
        value
      } = await help.runBeginCall(...defaultCallArgs));
    });

    it('should store correct information about the call', async function(){
      const [
        callData,
        sender,
        approved,
        success
      ] = await hotel.pendingCalls.call(hash);

      assert.equal(callData, bookData);
      assert.equal(sender, augusto);
      assert.equal(approved, false);
      assert.equal(success, false);
    });

    it('should fire a CallStarted event', async function(){
      const callStarted = events.filter(item => item.name === 'CallStarted')[0];
      const fromTopic = callStarted.events.filter(item => item.name === 'from')[0];
      const dataHashTopic = callStarted.events.filter(item => item.name === 'dataHash')[0];

      assert.equal(fromTopic.value, augusto);
      assert.equal(dataHashTopic.value, hash);
    });

    it('should not fire a CallFinish event', async function(){
      const callFinishedEvents = events.filter(item => item.name === 'CallFinish');
      assert.equal(callFinishedEvents.length, 0);
    });

    // We've already begun and indentical call in the beforeEach block. Smart token requires
    // that the call succeeds, so approveData will also throw.
    it('should throw if call is duplicate', async function() {
      const bookData = hotel.contract.book.getData(unit.address, augusto, 60, 5, stubData);
      const beginCall = hotel.contract.beginCall.getData(bookData, userInfo);

      try {
        await token.approveData(hotel.address, value, beginCall, {from: augusto});
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('beginCall: (no confirmation required)', function(){
    let beginCallData;
    let callerInitialBalance;
    let clientInitialBalance;
    let events;
    let hash;
    let token;
    let unit;
    let value;

    // Add a unit that accepts instant booking, execute a token.transferData booking
    // Unit is the recipient of tokens
    beforeEach(async function() {
      unit = await help.addUnitToHotel(index, hotel, typeName, hotelAccount, false);
      defaultCallArgs[unitArgPos] = unit;
      ({
        beginCallData,
        hotelInitialBalance,
        clientInitialBalance,
        events,
        hash,
        token,
        value
      } = await help.runBeginCall(...defaultCallArgs));
    });

    // Verify that token transfer took place
    it('should execute the passed callData', async function(){
      const augustoFinalBalance = await token.balanceOf(augusto);
      const hotelFinalBalance = await token.balanceOf(hotel.address);

      assert(augustoFinalBalance.lt(clientInitialBalance));
      assert(hotelFinalBalance.gt(hotelInitialBalance));
      assert(augustoFinalBalance.eq(clientInitialBalance.sub(value)));
      assert(hotelFinalBalance.eq(hotelInitialBalance.add(value)));
    });

    it('should set PendingCall success flag to true on success', async function(){
      const [
        callData,
        sender,
        approved,
        success
      ] = await hotel.pendingCalls.call(hash);

      assert(success);
    });

    it('should fire a CallFinish event', async function(){
      const callFinish = events.filter(item => item && item.name === 'CallFinish')[0];
      const fromTopic = callFinish.events.filter(item => item.name === 'from')[0];
      const dataHashTopic = callFinish.events.filter(item => item.name === 'dataHash')[0];

      assert.equal(fromTopic.value, augusto);
      assert.equal(dataHashTopic.value, hash);
    });

    // Token executes beginCall which succeeds, triggering the Transfer event in LifToken
    it('should return true if the call succeeds', async function(){
      const transfer = events.filter(item => item && item.name === 'Transfer')[0];
      const fromTopic = transfer.events.filter(item => item.name === 'from')[0];
      const toTopic = transfer.events.filter(item => item.name === 'to')[0];
      const valueTopic = transfer.events.filter(item => item.name === 'value')[0];

      assert.equal(fromTopic.value, augusto);
      assert.equal(toTopic.value, hotel.address);
      assert.equal(valueTopic.value, value);
    });
  });

  describe('beginCall: (error cases)', function(){
    let events;
    let hash;

    // Add a unit that accepts instant booking,
    // Set Unit's active status to false (book will throw)
    beforeEach(async function() {
      unit = await help.addUnitToHotel(index, hotel, typeName, hotelAccount, false);
      const data = unit.contract.setActive.getData(false);
      const callUnit = hotel.contract.callUnit.getData(unit.address, data);
      await index.callHotel(0, callUnit, {from: hotelAccount});
      defaultCallArgs[unitArgPos] = unit;

      ({
        events,
        hash,
      } = await help.runBeginCall(...defaultCallArgs));
    });

    // This test makes this verifiable by coverage.
    it('fromSelf modifier throws on indirect calls', async function(){
      const bookData = hotel.contract.book.getData(unit.address, augusto, 60, 5, stubData);
      try {
        await index.callHotel(0, bookData, {from: hotelAccount});
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('continueCall: success cases', function(){
    let events;
    let hash;
    let token;
    let unit;

    // Add a unit that requires confirmation, execute a token.approveData booking
    // Have hotel continue call.
    beforeEach(async function() {
      unit = await help.addUnitToHotel(index, hotel, typeName, hotelAccount, true);
      defaultCallArgs[unitArgPos] = unit;
      ({
        hash,
        token,
      } = await help.runBeginCall(...defaultCallArgs));

      ({ events } = await help.runContinueCall(index, hotel, hotelAccount, hash));
    });

    it('should execute the pending call', async function(){
      const bookEvents = events.filter(item => item && item.name === 'Book');
      assert.equal(bookEvents.length, 1);
    });

    it('should set the PendingCall records approved flag to true', async function(){
      const [
        callData,
        sender,
        approved,
        success
      ] = await hotel.pendingCalls.call(hash);

      assert(approved);
    });

    it('should set the PendingCall records success flag to true if call succeeds', async function(){
      const [
        callData,
        sender,
        approved,
        success
      ] = await hotel.pendingCalls.call(hash);

      assert(success);
    });

    it('should fire a CallFinishEvent', async function(){
      const callFinish = events.filter(item => item && item.name === 'CallFinish')[0];
      const fromTopic = callFinish.events.filter(item => item.name === 'from')[0];
      const dataHashTopic = callFinish.events.filter(item => item.name === 'dataHash')[0];

      assert.equal(fromTopic.value, augusto);
      assert.equal(dataHashTopic.value, hash);
    });
  });

  describe('continueCall: edge / failure cases', function(){
    let unit;

    beforeEach(async function() {
      unit = await help.addUnitToHotel(index, hotel, typeName, hotelAccount, true);
      defaultCallArgs[unitArgPos] = unit;
    });

    it('should throw if call hash does not exists in the pendingCalls map', async function(){
      const badHash = '0xabcdef';
      const continueData = hotel.contract.continueCall.getData(badHash);

      try {
        await index.callHotel(0, continueData, {from: hotelAccount});
        assert(false);
      } catch(e){
        assert(help.isInvalidOpcodeEx);
      }
    })

    // Passing book a null Data call will cause the finalCall to fail...
    it('PendingCalls success flag should be false if final call fails', async function(){
      const nullData = '0x00';
      defaultCallArgs[dataArgPos] = nullData;

      ({ hash } = await help.runBeginCall(...defaultCallArgs));
      try {
        await help.runContinueCall(index, hotel, hotelAccount, hash);
        assert(false);
      } catch(e) {
        assert(help.isInvalidOpcodeEx);
      }

      const [
        callData,
        sender,
        approved,
        success
      ] = await hotel.pendingCalls.call(hash);

      assert.equal(success, false);
    });

    // Passing book a zero length finalCall will skip that part of book
    it('PendingCalls success flag should be true if final call is ommitted', async function(){
      const noData = '';
      defaultCallArgs[dataArgPos] = noData;
      ({ hash } = await help.runBeginCall(...defaultCallArgs));
      await help.runContinueCall(index, hotel, hotelAccount, hash);

      const [
        callData,
        sender,
        approved,
        success
      ] = await hotel.pendingCalls.call(hash);

      assert(success);
    });
  });
});

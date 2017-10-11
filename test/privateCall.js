const assert = require('chai').assert;
const help = require('./helpers/index.js');
const abiDecoder = require('abi-decoder');

const WTHotel = artifacts.require('Hotel.sol')
const WTIndex = artifacts.require('WTIndex.sol');
const LifToken = artifacts.require('LifToken.sol');
const Unit = artifacts.require('Unit.sol')

abiDecoder.addABI(Unit._json.abi);
abiDecoder.addABI(LifToken._json.abi);

contract('PrivateCall.sol', function(accounts) {
  const augusto = accounts[1];
  const hotelAccount = accounts[2];
  const typeName = 'BASIC_ROOM';

  let wtIndex;
  let wtHotel;
  let unitType;
  let unit;
  let stubData;

  // Create and register a hotel
  beforeEach( async function(){
    wtIndex = await WTIndex.new();
    wtHotel = await help.createHotel(wtIndex, hotelAccount);
    unitType = await help.addUnitTypeToHotel(wtIndex, wtHotel, typeName, hotelAccount);
    stubData = wtHotel.contract.getUnitsLength.getData();
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

    // NB - these would work if sent from Hotel & contracts can send gas
    it('should only be accessible via the index contract', async function(){
      // Via unit:
      try {
        await unit.changeConfirmation(true, {from: hotelAccount});
        assert(false);
      } catch(e) {
        assert(help.isInvalidOpcodeEx(e));
      }

      // Via Hotel
      const data = unit.contract.changeConfirmation.getData(true);
      try {
        await wtHotel.callUnit(unit.address, data, {from: hotelAccount});
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
      unit = await help.addUnitToHotel(wtIndex, wtHotel, typeName, hotelAccount, true);
      ({
        bookData,
        events,
        hash,
        token,
        userInfo,
        value
      } = await help.runBeginCall(unit, augusto, 'approveData', accounts, stubData));
    });

    it('should store correct information about the call', async function(){
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

    // We've already begun and indentical call in the beforeEach block
    it('should not fire a CallStarted event if call is duplicate', async function() {
      const bookData = unit.contract.book.getData(augusto, 60, 5, stubData);
      const beginCall = unit.contract.beginCall.getData(bookData, userInfo);
      const approveAgain = await token.approveData(unit.address, value, beginCall, {from: augusto});

      events = abiDecoder.decodeLogs(approveAgain.receipt.logs);
      const callStartedEvents = events.filter(item => item.name === 'CallStarted');

      assert.equal(callStartedEvents.length, 0);
    });

    // First beginCall returns true (it's executed in the beforeEach) so tokens ApprovalData is fired
    // Second beginCall is duplicate. We know it returns false if there is no ApprovalData event
    it('should return true on success, return false if call is duplicate', async function(){
      let approvals = events.filter(item => item.name === 'ApprovalData');
      assert.equal(approvals.length, 1);

      const bookData = unit.contract.book.getData(augusto, 60, 5, stubData);
      const beginCall = unit.contract.beginCall.getData(bookData, userInfo);
      const approveAgain = await token.approveData(unit.address, value, beginCall, {from: augusto});

      events = abiDecoder.decodeLogs(approveAgain.receipt.logs);
      approvals = events.filter(item => item.name === 'ApprovalData');
      assert.equal(approvals.length, 0);
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
      unit = await help.addUnitToHotel(wtIndex, wtHotel, typeName, hotelAccount, false);
      ({
        beginCallData,
        callerInitialBalance,
        clientInitialBalance,
        events,
        hash,
        token,
        value
      } = await help.runBeginCall(unit, augusto, 'transferData', accounts, stubData));
    });

    // Verify that token transfer took place
    it('should execute the passed callData', async function(){
      const augustoFinalBalance = await token.balanceOf(augusto);
      const unitFinalBalance = await token.balanceOf(unit.address);

      assert(augustoFinalBalance.toNumber() < clientInitialBalance.toNumber());
      assert(unitFinalBalance.toNumber() > callerInitialBalance.toNumber())
      assert.equal(augustoFinalBalance.toNumber(), clientInitialBalance.sub(value).toNumber());
      assert.equal(unitFinalBalance.toNumber(), callerInitialBalance.add(value).toNumber());
    });

    it('should set PendingCall success flag to true on success', async function(){
      const [
        callData,
        sender,
        approved,
        success
      ] = await unit.pendingCalls.call(hash);

      assert(success);
    });

    it('should fire a CallFinish event', async function(){
      const callFinish = events.filter(item => item && item.name === 'CallFinish')[0];
      const fromTopic = callFinish.events.filter(item => item.name === 'from')[0];
      const dataHashTopic = callFinish.events.filter(item => item.name === 'dataHash')[0];

      assert.equal(fromTopic.value, augusto);
      assert.equal(dataHashTopic.value, hash);
    });

    // Token executes beginCall which succeeds, triggering the TransferData event in LifToken
    it('should return true if the call succeeds', async function(){
      const transferData = events.filter(item => item && item.name === 'TransferData')[0];
      const fromTopic = transferData.events.filter(item => item.name === 'from')[0];
      const toTopic = transferData.events.filter(item => item.name === 'to')[0];
      const valueTopic = transferData.events.filter(item => item.name === 'value')[0];
      const dataTopic = transferData.events.filter(item => item.name === 'data')[0];

      assert.equal(fromTopic.value, augusto);
      assert.equal(toTopic.value, unit.address);
      assert.equal(valueTopic.value, value);
      assert.equal(dataTopic.value, beginCallData);
    });
  });

  describe('beginCall: (error cases)', function(){
    let events;
    let hash;

    // Add a unit that accepts instant booking,
    // Set Unit's active status to false (book will throw)
    beforeEach(async function() {
      unit = await help.addUnitToHotel(wtIndex, wtHotel, typeName, hotelAccount, false);

      const data = unit.contract.setActive.getData(false);
      const callUnit = wtHotel.contract.callUnit.getData(unit.address, data);
      await wtIndex.callHotel(0, callUnit, {from: hotelAccount});

      ({
        events,
        hash,
      } = await help.runBeginCall(unit, augusto, 'transferData', accounts, stubData));
    });

    it('fires a TransferData event and does not fire a Book event', async function(){
      const transferDataEvents = events.filter(item => item && item.name === 'TransferData');
      const bookEvents = events.filter(item => item && item.name === 'Book');

      assert.equal(transferDataEvents.length, 1);
      assert.equal(bookEvents.length, 0);
    });

    it('PendingCall success flag is false on failure', async function(){
      const [
        callData,
        sender,
        approved,
        success
      ] = await unit.pendingCalls.call(hash);

      assert.equal(success, false);
    });

    // This test makes this verifiable by coverage.
    it('fromSelf modifier throws on indirect calls', async function(){
      const bookData = unit.contract.book.getData(augusto, 60, 5, stubData);
      const callUnit = wtHotel.contract.callUnit.getData(unit.address, bookData);
      try {
        await wtIndex.callHotel(0, callUnit, {from: hotelAccount});
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
      unit = await help.addUnitToHotel(wtIndex, wtHotel, typeName, hotelAccount, true);

      ({
        hash,
        token,
      } = await help.runBeginCall(unit, augusto, 'approveData', accounts, stubData));

      ({ events } = await help.runContinueCall(wtIndex, wtHotel, unit, hotelAccount, hash));
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
      ] = await unit.pendingCalls.call(hash);

      assert(approved);
    });

    it('should set the PendingCall records success flag to true if call succeeds', async function(){
      const [
        callData,
        sender,
        approved,
        success
      ] = await unit.pendingCalls.call(hash);

      assert(success);
    });

    it('should fire a CallFinishEvent', async function(){
      const callFinish = events.filter(item => item && item.name === 'CallFinish')[0];
      const fromTopic = callFinish.events.filter(item => item.name === 'from')[0];
      const dataHashTopic = callFinish.events.filter(item => item.name === 'dataHash')[0];

      assert.equal(fromTopic.value, augusto);
      assert.equal(dataHashTopic.value, hash);
    });

    it.skip('should be possible to sweep tokens from the unit')
  });

  describe('continueCall: failure cases', function(){
    let unit;

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

    // Passing book a null Data call will cause the finalCall to fail...
    it('PendingCalls success flag should be false if call fails', async function(){
      const nullData = '0x00';

      ({ hash } = await help.runBeginCall(unit, augusto, 'approveData', accounts, nullData));
      await help.runContinueCall(wtIndex, wtHotel, unit, hotelAccount, hash);

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

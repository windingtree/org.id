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
    const value = help.lif2LifWei(10);
    const userInfo = web3.toHex('user info');
    let approve;
    let hash;
    let bookData
    let token;
    let events;

    // Add a unit that accepts instant booking, execute a token.transferData booking
    // Unit is the recipient of tokens
    beforeEach(async function() {
      const nullData = '0x00';
      const userInfo = web3.toHex('user info');

      unit = await help.addUnitToHotel(wtIndex, wtHotel, typeName, hotelAccount, true);

      const crowdsale = await help.simulateCrowdsale(100000000000, [40,30,20,10,0], accounts, 1);
      token = LifToken.at(await crowdsale.token.call());

      const stubData = wtHotel.contract.getUnitsLength.getData();
      bookData = unit.contract.book.getData(augusto, 60, 5, stubData);
      const beginCallData = unit.contract.beginCall.getData(bookData, userInfo);
      approve = await token.approveData(unit.address, value, beginCallData, {from: augusto});

      events = abiDecoder.decodeLogs(approve.receipt.logs);
      const approveEvent = events.filter(item => item && item.name === 'CallStarted')[0];
      const dataHashTopic = approveEvent.events.filter(item => item.name === 'dataHash')[0];
      hash = dataHashTopic.value;
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

    it('should not fire a CallStarted event if call is duplicate', async function() {
      // We've already begun and indentical call in the beforeEach block
      const stubData = wtHotel.contract.getUnitsLength.getData();
      bookData = unit.contract.book.getData(augusto, 60, 5, stubData);
      const beginCallData = unit.contract.beginCall.getData(bookData, userInfo);
      const approve2 = await token.approveData(unit.address, value, beginCallData, {from: augusto});

      events = abiDecoder.decodeLogs(approve2.receipt.logs);
      const callStartedEvents = events.filter(item => item.name === 'CallStarted');

      assert.equal(callStartedEvents.length, 0);
    });

    // First beginCall returns true (it's executed in the beforeEach) so tokens ApprovalData is fired
    // Second beginCall is duplicate. We know it returns false if there is no ApprovalData event
    it('should return true on success, return false if call is duplicate', async function(){
      let approvalDataEvents = events.filter(item => item.name === 'ApprovalData');
      assert.equal(approvalDataEvents.length, 1);

      const stubData = wtHotel.contract.getUnitsLength.getData();
      bookData = unit.contract.book.getData(augusto, 60, 5, stubData);
      const beginCallData = unit.contract.beginCall.getData(bookData, userInfo);
      const approve2 = await token.approveData(unit.address, value, beginCallData, {from: augusto});

      events = abiDecoder.decodeLogs(approve2.receipt.logs);
      approvalDataEvents = events.filter(item => item.name === 'ApprovalData');
      assert.equal(approvalDataEvents.length, 0);
    });
  });

  describe('beginCall: no confirmation required', function(){
    let begin;
    let hash;
    let input;
    let token;
    const value = help.lif2LifWei(10);
    let beginCallData
    let augustoInitialBalance;
    let hotelInitialBalance;

    // Add a unit that accepts instant booking, execute a token.transferData booking
    // Unit is the recipient of tokens
    beforeEach(async function() {
      const nullData = '0x00';
      const userInfo = web3.toHex('user info');

      unit = await help.addUnitToHotel(wtIndex, wtHotel, typeName, hotelAccount);

      const crowdsale = await help.simulateCrowdsale(100000000000, [40,30,20,10,0], accounts, 1);
      token = LifToken.at(await crowdsale.token.call());

      augustoInitialBalance = await token.balanceOf(augusto);
      unitInitialBalance = await token.balanceOf(unit.address);

      const stubData = wtHotel.contract.getUnitsLength.getData();
      const bookData = unit.contract.book.getData(augusto, 60, 5, stubData);
      beginCallData = unit.contract.beginCall.getData(bookData, userInfo);
      begin = await token.transferData(unit.address, value, beginCallData, {from: augusto});

      const events = abiDecoder.decodeLogs(begin.receipt.logs);
      const callStarted = events.filter(item => item && item.name === 'CallStarted')[0];
      const dataHashTopic = callStarted.events.filter(item => item.name === 'dataHash')[0];
      hash = dataHashTopic.value;
    });

    it('should execute the passed callData', async function(){
      const augustoFinalBalance = await token.balanceOf(augusto);
      const unitFinalBalance = await token.balanceOf(unit.address);

      assert(augustoFinalBalance.toNumber() < augustoInitialBalance.toNumber());
      assert(unitFinalBalance.toNumber() > unitInitialBalance.toNumber())
      assert.equal(augustoFinalBalance.toNumber(), augustoInitialBalance.sub(value).toNumber());
      assert.equal(unitFinalBalance.toNumber(), unitInitialBalance.add(value).toNumber());
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
      const events = abiDecoder.decodeLogs(begin.receipt.logs);
      const callFinish = events.filter(item => item && item.name === 'CallFinish')[0];
      const fromTopic = callFinish.events.filter(item => item.name === 'from')[0];
      const dataHashTopic = callFinish.events.filter(item => item.name === 'dataHash')[0];

      assert.equal(fromTopic.value, augusto);
      assert.equal(dataHashTopic.value, hash);
    });

    // Token executes beginCall which succeeds, triggering the TransferData event in LifToken
    it('should return true if the call succeeds', async function(){
      const events = abiDecoder.decodeLogs(begin.receipt.logs);
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

  describe('beginCall: error cases', function(){
    let begin;

    // Add a unit that accepts instant booking, set Units active status to false (book will throw)
    beforeEach(async function() {
      const nullData = '0x00';
      const value = help.lif2LifWei(10);
      const userInfo = web3.toHex('user info');

      unit = await help.addUnitToHotel(wtIndex, wtHotel, typeName, hotelAccount);
      const data = unit.contract.setActive.getData(false);
      const callUnit = wtHotel.contract.callUnit.getData(unit.address, data);
      await wtIndex.callHotel(0, callUnit, {from: hotelAccount});

      const crowdsale = await help.simulateCrowdsale(100000000000, [40,30,20,10,0], accounts, 1);
      const token = LifToken.at(await crowdsale.token.call());

      const bookData = unit.contract.book.getData(augusto, 60, 5, nullData);
      const beginCallData = unit.contract.beginCall.getData(bookData, userInfo);
      begin = await token.transferData(unit.address, value, beginCallData, {from: augusto});
    });

    it('fires a TransferData event and does not fire a Book event', async function(){
      const events = abiDecoder.decodeLogs(begin.receipt.logs);
      const transferDataEvents = events.filter(item => item && item.name === 'TransferData');
      const bookEvents = events.filter(item => item && item.name === 'Book');

      assert.equal(transferDataEvents.length, 1);
      assert.equal(bookEvents.length, 0);
    });

    it('PendingCall success flag is false on failure', async function(){
      const events = abiDecoder.decodeLogs(begin.receipt.logs);
      const callStarted = events.filter(item => item && item.name === 'CallStarted')[0];
      const dataHashTopic = callStarted.events.filter(item => item.name === 'dataHash')[0];
      const hash = dataHashTopic.value;

      const [
        callData,
        sender,
        approved,
        success
      ] = await unit.pendingCalls.call(hash);

      assert.equal(success, false);
    });
  });

  describe('continueCall: success cases', function(){
    const nullData = '0x00';
    const value = help.lif2LifWei(10);
    const userInfo = web3.toHex('user info');
    let _continue;
    let hash;
    let token;


    // Add a unit that requires confirmation, execute a token.approveData booking
    // Unit is the recipient of tokens. Have hotel continue call.
    beforeEach(async function() {
      unit = await help.addUnitToHotel(wtIndex, wtHotel, typeName, hotelAccount, true);

      const crowdsale = await help.simulateCrowdsale(100000000000, [40,30,20,10,0], accounts, 1);
      token = LifToken.at(await crowdsale.token.call());

      // NB: books call fails unless there is a passing call to the dropthrough. Possibly remove this?
      // ....
      const stubData = wtHotel.contract.getUnitsLength.getData();
      const bookData = unit.contract.book.getData(augusto, 60, 5, stubData);
      const beginCallData = unit.contract.beginCall.getData(bookData, userInfo);
      const approve = await token.approveData(unit.address, value, beginCallData, {from: augusto});

      const events = abiDecoder.decodeLogs(approve.receipt.logs);
      const approveEvent = events.filter(item => item && item.name === 'CallStarted')[0];
      const dataHashTopic = approveEvent.events.filter(item => item.name === 'dataHash')[0];
      hash = dataHashTopic.value;

      const continueData = unit.contract.continueCall.getData(hash);
      const callUnitData = await wtHotel.contract.callUnit.getData(unit.address, continueData);
      _continue = await wtIndex.callHotel(0, callUnitData, {from: hotelAccount});
    });

    it('should execute the pending call', async function(){
      const events = abiDecoder.decodeLogs(_continue.receipt.logs);
      const bookEvents = events.filter(item => item && item.name === 'Book');
      assert.equal(bookEvents.length, 1);
    });

    it.skip('should be possible to sweep tokens from the unit')

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

    // Passing book a null Data call will cause the finalCall to fail...
    it('PendingCalls success flag should be false if call fails', async function(){
      const nullData = '0x00';
      const value = help.lif2LifWei(10);
      const userInfo = web3.toHex('user info');

      const crowdsale = await help.simulateCrowdsale(100000000000, [40,30,20,10,0], accounts, 1);
      token = LifToken.at(await crowdsale.token.call());

      const bookData = unit.contract.book.getData(augusto, 60, 5, nullData);
      const beginCallData = unit.contract.beginCall.getData(bookData, userInfo);
      const approve = await token.approveData(unit.address, value, beginCallData, {from: augusto});

      const events = abiDecoder.decodeLogs(approve.receipt.logs);
      const approveEvent = events.filter(item => item && item.name === 'CallStarted')[0];
      const dataHashTopic = approveEvent.events.filter(item => item.name === 'dataHash')[0];
      const hash = dataHashTopic.value;

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

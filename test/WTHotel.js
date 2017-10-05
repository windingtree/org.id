'use strict';

var chai = require('chai');
var moment = require('moment');
var Web3 = require('web3');
var abiDecoder = require('abi-decoder');
var help = require('./helpers/index.js');
var assert = chai.assert;

var WTKeysRegistry = artifacts.require('../contracts/WTKeysRegistry.sol');
var WTIndex = artifacts.require('../contracts/WTIndex.sol');
var WTHotel = artifacts.require('../contracts/hotel/Hotel.sol');
var UnitType = artifacts.require('../contracts/hotel/UnitType.sol');
var UnitTypePublic = artifacts.require('../contracts/hotel/UnitType_Public_Interface.sol');
var UnitTypeOwner = artifacts.require('../contracts/hotel/UnitType_Owner_Interface.sol');
var Unit = artifacts.require('../contracts/hotel/Unit.sol');
var UnitPublic = artifacts.require('../contracts/hotel/Unit_Public_Interface.sol');
var UnitOwner = artifacts.require('../contracts/hotel/Unit_Owner_Interface.sol');
var PrivateCall = artifacts.require('../contracts/PrivateCall.sol');
var LifToken = artifacts.require('../contracts/lif/LifToken.sol');

var augustoKey, hotelKey;

const DEBUG = true;

contract('WTHotel & UnitType', function(accounts) {

  var keysRegistry, wtIndex;

  beforeEach( async function() {

    // Create the WTIndex contract
    wtIndex = await WTIndex.new();

  });

  it('Should register a hotel, add a unit type, add a inventory unit and make a booking with private data encrypted.', async function() {

    abiDecoder.addABI(PrivateCall._json.abi);
    abiDecoder.addABI(WTHotel._json.abi);
    abiDecoder.addABI(WTIndex._json.abi);
    abiDecoder.addABI(UnitType._json.abi);
    abiDecoder.addABI(Unit._json.abi);

    // Register hotel on index
    let hotelRegisterTx = await wtIndex.registerHotel('WT Hotel', 'WT Test Hotel', {from: accounts[2]});
    let wtHotelAddress = await wtIndex.getHotelsByManager(accounts[2]);
    if (DEBUG) console.log('New WT Hotel addreess:', wtHotelAddress[0], '\n');
    let wtHotel = WTHotel.at(wtHotelAddress[0]);

    // Check that wtHotel is indexed
    assert.equal(wtIndex.contract.address, await wtHotel.owner());
    assert.equal(accounts[2], await wtHotel.manager());

    // Edit wtHotel address
    let editAddressData = wtHotel.contract.editAddress.getData('Common street 123', '', '6655', 'Spain');
    await wtIndex.callHotel(0, editAddressData, {from: accounts[2]});

    // Edit hotel location
    // To represent 40.426371, -3.703578 GPS position
    // (90 + 40.426371)*10^5, (180 + (-3.703578))*10^5 = 13042637, 17629642
    // Timezone is represented from 0 to 23, being 0 = UTC and 23 = +22UTC
    let editLocation = wtHotel.contract.editLocation.getData(2, 13042637, 17629642);
    await wtIndex.callHotel(0, editLocation, {from: accounts[2]});

    // Add images
    let addImageData = wtHotel.contract.addImage.getData('http://wthotel.com/image1');
    await wtIndex.callHotel(0, addImageData, {from: accounts[2]});
    addImageData = wtHotel.contract.addImage.getData('http://wthotel.com/image2');
    await wtIndex.callHotel(0, addImageData, {from: accounts[2]});
    addImageData = wtHotel.contract.addImage.getData('http://wthotel.com/image3');
    await wtIndex.callHotel(0, addImageData, {from: accounts[2]});

    // Remove image
    let removeImageData = wtHotel.contract.removeImage.getData(1);
    await wtIndex.callHotel(0, removeImageData, {from: accounts[2]});

    // Check hotel info
    assert.equal('Common street 123', await wtHotel.lineOne());
    assert.equal('', await wtHotel.lineTwo());
    assert.equal('6655', await wtHotel.zip());
    assert.equal('Spain', await wtHotel.country());
    assert.equal(2 , await wtHotel.timezone());
    assert.equal(17629642, await wtHotel.latitude());
    assert.equal(13042637, await wtHotel.longitude());
    assert.equal(3 , await wtHotel.getImagesLength());
    assert.equal('http://wthotel.com/image1', await wtHotel.getImage(0));
    assert.equal('', await wtHotel.getImage(1));
    assert.equal('http://wthotel.com/image3' ,await wtHotel.getImage(2));

    // Create the unit type on the hotel
    let wtHotelUnitType = await UnitType.new(wtHotel.address, web3.toHex('BASIC_ROOM'), {from: accounts[2]});
    let addUnitTypeData = wtHotel.contract.addUnitType.getData(wtHotelUnitType.address);
    await wtIndex.callHotel(0, addUnitTypeData, {from: accounts[2]});
    assert.equal(wtHotel.address, await wtHotelUnitType.owner());

    if (DEBUG) console.log('WTHotel BASIC_ROOM unit contract address:', wtHotelUnitType.address, '\n');

    // Edit unit type
    let callUnitData = wtHotelUnitType.contract.edit.getData('Room with basic amenities', 1, 2, '20 USD');
    callUnitData = wtHotel.contract.callUnitType.getData(web3.toHex('BASIC_ROOM'), callUnitData);
    await wtIndex.callHotel(0, callUnitData, {from: accounts[2]});
    let unitInfo = await wtHotelUnitType.getInfo();
    if (DEBUG) console.log('Unit added:', unitInfo, '\n');
    assert.equal('Room with basic amenities', unitInfo[0]);
    assert.equal(1, parseInt(unitInfo[1]));
    assert.equal(2, parseInt(unitInfo[2]));
    assert.equal('20 USD', unitInfo[3]);

    // Create and add a unit
    let wtHotelUnit = await Unit.new(wtHotel.address, web3.toHex('BASIC_ROOM'), {from: accounts[2]});
    let addUnitData = wtHotel.contract.addUnit.getData(wtHotelUnit.address);
    await wtIndex.callHotel(0, addUnitData, {from: accounts[2]});
    assert.equal(wtHotel.address, await wtHotelUnit.owner());

    // Config added unit to wait for confirmation fo calls
    callUnitData = wtHotelUnit.contract.changeConfirmation.getData(true);
    callUnitData = wtHotel.contract.callUnit.getData(wtHotelUnit.address, callUnitData);
    await wtIndex.callHotel(0, callUnitData, {from: accounts[2]});
    assert.equal(true, await wtHotelUnit.waitConfirmation());

    // Build the data to book a room
    let dataToSend = {
      "guests": [
        {
          "name": "Augusto Federico lemble",
          "email": "augusto@windingtree.com",
          "phone": "++5492983603655",
          "pnr": "ARG123456",
          "note": "I want to stay in this hotel"
        }
      ],
      "payment": "ETH",
      "amount": "0.5"
    };
    let originalHash = web3.sha3();

    // Build giveVote call data
    let giveVoteData = wtIndex.contract.giveVote.getData( await wtHotel.manager());
    giveVoteData = wtHotel.contract.callIndex.getData(giveVoteData);

    // Encode Augusto's private data and create the data to call the public function
    let privateData = web3.toHex(JSON.stringify(dataToSend));
    let publicData = await wtHotelUnit.contract.book.getData(accounts[1], 60, 5, giveVoteData);
    if (DEBUG) console.log('Private data:', privateData);
    if (DEBUG) console.log('Public data:', publicData, '\n');

    // Augusto begin the call by sending the public bytes of the call to be executed after receivers review it
    let beginCalltx = await wtHotelUnit.beginCall(publicData, privateData, {from: accounts[1]});
    let beginCalltxCode = web3.eth.getTransaction(beginCalltx.tx).input;
    if (DEBUG) console.log('Begin Call tx:', beginCalltx);
    let beginCallEvent = abiDecoder.decodeLogs(beginCalltx.receipt.logs)[0];
    if (DEBUG) console.log('Begin Call events:', beginCallEvent.events);
    assert.equal(accounts[1], beginCallEvent.events[0].value);
    let pendingCallHash = beginCallEvent.events[1].value;
    let pendingCall = await wtHotelUnit.callsPending.call(pendingCallHash);
    if (DEBUG) console.log('Call Pending:', pendingCall, '\n');

    // The receiver can get the privateData encrypted form the blockchian using the abi-decoder
    let transferDecoded = abiDecoder.decodeMethod(beginCalltxCode);
    let beginCallDecoded = abiDecoder.decodeMethod(transferDecoded.params[0].value);
    if (DEBUG) console.log('beginCall decoded:',beginCallDecoded);
    let decryptedDataOnReceiver = web3.toAscii( transferDecoded.params[1].value );
    assert.equal(JSON.stringify(dataToSend), decryptedDataOnReceiver);
    if (DEBUG) console.log('Decrypted data on receiver:', decryptedDataOnReceiver);
    assert.equal(JSON.parse(decryptedDataOnReceiver).payment, "ETH");
    // After the receiver read and verify the privateData sent by Augusto he can continue the call
    let continueCallData = await wtHotelUnit.contract.continueCall.getData(pendingCallHash);
    continueCallData = await wtHotel.contract.callUnit.getData(wtHotelUnit.address, continueCallData);
    let continueCalltx = await wtIndex.callHotel(0, continueCallData, {from: accounts[2]});
    if (DEBUG) console.log('Continue Call tx:', continueCalltx,'\n');

    // Check book was done
    let continueCallEvent = abiDecoder.decodeLogs(continueCalltx.receipt.logs)[0];
    if (DEBUG) console.log('Room booked event: ', continueCallEvent.events);
    assert.equal(accounts[1], continueCallEvent.events[0].value);
    assert.equal(60, continueCallEvent.events[1].value);
    assert.equal(65, continueCallEvent.events[2].value);
    let firstDayBooked = await wtHotelUnit.getReservation(60);
    let lastDayBooked = await wtHotelUnit.getReservation(65);
    if (DEBUG) console.log('First day booked:', firstDayBooked);
    if (DEBUG) console.log('Last day booked:', lastDayBooked, '\n');
    assert.equal(firstDayBooked[1], accounts[1]);
    assert.equal(lastDayBooked[1], accounts[1]);
    assert.equal(firstDayBooked[0], '');
    assert.equal(lastDayBooked[0], '');

    // Check pendingCall was confirmed
    let pendingCallTxConfirmed = await wtHotelUnit.callsPending.call(pendingCallHash);
    if (DEBUG) console.log('Call Pending confirmed:', pendingCallTxConfirmed);
    assert.equal(true, pendingCallTxConfirmed[2]);
  });

  it('Should add, edit unit type addresses and remove unit types.', async function() {

    let wtHotel = await help.createHotel(wtIndex, accounts[2]);

    // Create three unit types on the hotel
    let wtHotelUnitType = await UnitType.new(wtHotel.address, web3.toHex('BASIC_ROOM'), {from: accounts[2]});
    let callData = wtHotel.contract.addUnitType.getData(wtHotelUnitType.address);
    await wtIndex.callHotel(0, callData, {from: accounts[2]});
    assert.equal(wtHotel.address, await wtHotelUnitType.owner());
    assert.equal(wtHotelUnitType.address, await wtHotel.getUnitType(web3.toHex('BASIC_ROOM')));
    if (DEBUG) console.log('WTHotel BASIC_ROOM unit contract address:', wtHotelUnitType.address, '\n');

    wtHotelUnitType = await UnitType.new(wtHotel.address, web3.toHex('PREMIUM_ROOM'), {from: accounts[2]});
    callData = wtHotel.contract.addUnitType.getData(wtHotelUnitType.address);
    await wtIndex.callHotel(0, callData, {from: accounts[2]});
    assert.equal(wtHotel.address, await wtHotelUnitType.owner());
    assert.equal(wtHotelUnitType.address, await wtHotel.getUnitType(web3.toHex('PREMIUM_ROOM')));
    if (DEBUG) console.log('WTHotel PREMIUM_ROOM unit contract address:', wtHotelUnitType.address, '\n');

    wtHotelUnitType = await UnitType.new(wtHotel.address, web3.toHex('GOLD_ROOM'), {from: accounts[2]});
    callData = wtHotel.contract.addUnitType.getData(wtHotelUnitType.address);
    await wtIndex.callHotel(0, callData, {from: accounts[2]});
    assert.equal(wtHotel.address, await wtHotelUnitType.owner());
    assert.equal(wtHotelUnitType.address, await wtHotel.getUnitType(web3.toHex('GOLD_ROOM')));
    if (DEBUG) console.log('WTHotel GOLD_ROOM unit contract address:', wtHotelUnitType.address, '\n');

    assert.include(await wtHotel.unitTypeNames.call(1), web3.toHex('BASIC_ROOM'));
    assert.include(await wtHotel.unitTypeNames.call(2), web3.toHex('PREMIUM_ROOM'));
    assert.include(await wtHotel.unitTypeNames.call(3), web3.toHex('GOLD_ROOM'));

    // Change a unitType address
    wtHotelUnitType = await UnitType.new(wtHotel.address, web3.toHex('GOLD_ROOM'), {from: accounts[2]});
    callData = wtHotel.contract.changeUnitType.getData(web3.toHex('GOLD_ROOM'), wtHotelUnitType.address,);
    await wtIndex.callHotel(0, callData, {from: accounts[2]});
    assert.equal(wtHotel.address, await wtHotelUnitType.owner());
    assert.equal(wtHotelUnitType.address, await wtHotel.getUnitType(web3.toHex('GOLD_ROOM')));
    if (DEBUG) console.log('WTHotel GOLD_ROOM unit edited contract address:', wtHotelUnitType.address, '\n');

    // Remove a unitType
    wtHotelUnitType = await UnitType.new(wtHotel.address, web3.toHex('PREMIUM_ROOM'), {from: accounts[2]});
    callData = wtHotel.contract.removeUnitType.getData(web3.toHex('PREMIUM_ROOM'), 2);
    await wtIndex.callHotel(0, callData, {from: accounts[2]});
    assert.equal('0x0000000000000000000000000000000000000000', await wtHotel.getUnitType(web3.toHex('PREMIUM_ROOM')));

    assert.include(await wtHotel.unitTypeNames.call(1), web3.toHex('BASIC_ROOM'));
    assert.include(await wtHotel.unitTypeNames.call(2), '0x0000000000000000000000000000000000000000');
    assert.include(await wtHotel.unitTypeNames.call(3), web3.toHex('GOLD_ROOM'));

  });

  it('Should edit unit type amenities and images using interfaces', async function() {

    const wtHotel = await help.createHotel(wtIndex, accounts[2]);
    const wtHotelUnitType = await help.addUnitTypeToHotel(wtIndex, wtHotel, 'BASIC_ROOM', accounts[2]);
    const wtHotelUnit = await help.addUnitToHotel(wtIndex, wtHotel, 'BASIC_ROOM', accounts[2]);

    // Assign interfaces
    let UnitTypeOwnerInterface = UnitTypeOwner.at(wtHotelUnitType.address);
    let UnitTypePublicInterface = UnitTypePublic.at(wtHotelUnitType.address);

    // Add amenities
    let callUnitData = UnitTypeOwnerInterface.contract.addAmenity.getData(8);
    callUnitData = wtHotel.contract.callUnitType.getData(web3.toHex('BASIC_ROOM'), callUnitData);
    await wtIndex.callHotel(0, callUnitData, {from: accounts[2]});
    callUnitData = UnitTypeOwnerInterface.contract.addAmenity.getData(10);
    callUnitData = wtHotel.contract.callUnitType.getData(web3.toHex('BASIC_ROOM'), callUnitData);
    await wtIndex.callHotel(0, callUnitData, {from: accounts[2]});
    callUnitData = UnitTypeOwnerInterface.contract.addAmenity.getData(11);
    callUnitData = wtHotel.contract.callUnitType.getData(web3.toHex('BASIC_ROOM'), callUnitData);
    await wtIndex.callHotel(0, callUnitData, {from: accounts[2]});
    let hotelUnitAmenities = await UnitTypePublicInterface.getAmenities();
    if (DEBUG) console.log('Amenities:', hotelUnitAmenities, '\n');
    assert.equal(8, parseInt(hotelUnitAmenities[0]));
    assert.equal(10, parseInt(hotelUnitAmenities[1]));
    assert.equal(11, parseInt(hotelUnitAmenities[2]));

    // Remove amenity
    callUnitData = UnitTypeOwnerInterface.contract.removeAmenity.getData(10);
    callUnitData = wtHotel.contract.callUnitType.getData(web3.toHex('BASIC_ROOM'), callUnitData);
    await wtIndex.callHotel(0, callUnitData, {from: accounts[2]});
    hotelUnitAmenities = await UnitTypePublicInterface.getAmenities();
    if (DEBUG) console.log('Amenities:', hotelUnitAmenities, '\n');
    assert.equal(8, parseInt(hotelUnitAmenities[0]));
    assert.equal(0, parseInt(hotelUnitAmenities[1]));
    assert.equal(11, parseInt(hotelUnitAmenities[2]));

    // Add images
    callUnitData = UnitTypeOwnerInterface.contract.addImage.getData('http://wthotel.com/image1');
    callUnitData = wtHotel.contract.callUnitType.getData(web3.toHex('BASIC_ROOM'), callUnitData);
    await wtIndex.callHotel(0, callUnitData, {from: accounts[2]});
    callUnitData = UnitTypeOwnerInterface.contract.addImage.getData('http://wthotel.com/image2');
    callUnitData = wtHotel.contract.callUnitType.getData(web3.toHex('BASIC_ROOM'), callUnitData);
    await wtIndex.callHotel(0, callUnitData, {from: accounts[2]});
    callUnitData = UnitTypeOwnerInterface.contract.addImage.getData('http://wthotel.com/image3');
    callUnitData = wtHotel.contract.callUnitType.getData(web3.toHex('BASIC_ROOM'), callUnitData);
    await wtIndex.callHotel(0, callUnitData, {from: accounts[2]});
    assert.equal(3, await UnitTypePublicInterface.getImagesLength());
    assert.equal('http://wthotel.com/image1', await UnitTypePublicInterface.getImage(0));
    assert.equal('http://wthotel.com/image2', await UnitTypePublicInterface.getImage(1));
    assert.equal('http://wthotel.com/image3', await UnitTypePublicInterface.getImage(2));

    // Remove image
    callUnitData = UnitTypeOwnerInterface.contract.removeImage.getData(1);
    callUnitData = wtHotel.contract.callUnitType.getData(web3.toHex('BASIC_ROOM'), callUnitData);
    await wtIndex.callHotel(0, callUnitData, {from: accounts[2]});
    assert.equal(3, parseInt(await UnitTypePublicInterface.getImagesLength()));
    assert.equal('http://wthotel.com/image1', await UnitTypePublicInterface.getImage(0));
    assert.equal('', await UnitTypePublicInterface.getImage(1));
    assert.equal('http://wthotel.com/image3', await UnitTypePublicInterface.getImage(2));
  });

  it('Should edit unit types "active" status and price using interfaces', async function() {

    const wtHotel = await help.createHotel(wtIndex, accounts[2]);
    const wtHotelUnitType = await help.addUnitTypeToHotel(wtIndex, wtHotel, 'BASIC_ROOM', accounts[2]);
    const wtHotelUnit = await help.addUnitToHotel(wtIndex, wtHotel, 'BASIC_ROOM', accounts[2]);

    // Assign interfaces
    let UnitTypeOwnerInterface = UnitTypeOwner.at(wtHotelUnitType.address);
    let UnitTypePublicInterface = UnitTypePublic.at(wtHotelUnitType.address);

    let UnitOwnerInterface = UnitOwner.at(wtHotelUnit.address);
    let UnitPublicInterface = UnitPublic.at(wtHotelUnit.address);

    if (DEBUG) console.log('WTHotel BASIC_ROOM unit type contract address:', wtHotelUnitType.address, '\n');
    if (DEBUG) console.log('WTHotel BASIC_ROOM unit contract address:', wtHotelUnit.address, '\n');

    // Set active
    let callUnitData = UnitOwnerInterface.contract.setActive.getData(false);
    callUnitData = wtHotel.contract.callUnit.getData(wtHotelUnit.address, callUnitData);
    await wtIndex.callHotel(0, callUnitData, {from: accounts[2]});

    // Set Price
    callUnitData = UnitOwnerInterface.contract.setPrice.getData('100 USD', 10, 3);
    callUnitData = wtHotel.contract.callUnit.getData(wtHotelUnit.address, callUnitData);
    await wtIndex.callHotel(0, callUnitData, {from: accounts[2]});
    if (DEBUG) console.log('New Unit Type:', await UnitPublicInterface.unitType(), '\n');
    assert.equal('100 USD', (await UnitPublicInterface.getReservation(10))[0] );
    assert.equal('100 USD', (await UnitPublicInterface.getReservation(11))[0] );
    assert.equal('100 USD', (await UnitPublicInterface.getReservation(12))[0] );
    assert.equal('0x0000000000000000000000000000000000000000', (await UnitPublicInterface.getReservation(10))[1] );
    assert.equal('0x0000000000000000000000000000000000000000', (await UnitPublicInterface.getReservation(11))[1] );
    assert.equal('0x0000000000000000000000000000000000000000', (await UnitPublicInterface.getReservation(12))[1] );
    assert.equal(false, await UnitPublicInterface.active());

  });

});

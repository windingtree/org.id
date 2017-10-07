const assert = require('chai').assert;
const help = require('./helpers/index.js');
const abiDecoder = require('abi-decoder');

const WTIndex = artifacts.require('WTIndex.sol');
const WTHotel = artifacts.require('Hotel.sol');
const UnitType = artifacts.require('UnitType.sol');
const UnitTypeInterface = artifacts.require('UnitType_Interface.sol');
const Unit = artifacts.require('Unit.sol');
const UnitInterface = artifacts.require('Unit_Interface.sol');

contract('Hotel', function(accounts) {
  const hotelName = 'WTHotel';
  const hotelDescription = 'WT Test Hotel';
  const hotelAccount = accounts[2];
  const nonOwnerAccount = accounts[3];
  let wtIndex;
  let wtHotel;

  // Create and register a hotel
  beforeEach( async function(){
    wtIndex = await WTIndex.new();
    await wtIndex.registerHotel(hotelName, hotelDescription, {from: hotelAccount});
    let address = await wtIndex.getHotelsByManager(hotelAccount);
    wtHotel = WTHotel.at(address[0]);
  });

  describe('Constructor', function() {

    it('should be initialised with the correct data', async function(){
      const info = await help.getHotelInfo(wtHotel);
      assert.equal(info.name, hotelName);
      assert.equal(info.description, hotelDescription);
      assert.isAtMost(info.created, web3.eth.blockNumber);
      assert.equal(info.manager, hotelAccount);

      // These are false: why?
      assert.equal(info.unitTypeNames.length, 0);
      assert.equal(Object.keys(info.units).length, 0);
    });

    it('should be indexed', async function(){
      assert.equal(wtIndex.contract.address, await wtHotel.owner());
      assert.equal(hotelAccount, await wtHotel.manager());
    });
  })

  describe('editInfo', function(){

    it('should edit the hotel name and description', async function(){
      const newName = 'Claridges';
      const newDescription = 'Near everything';
      const data = wtHotel.contract.editInfo.getData(newName, newDescription);
      await wtIndex.callHotel(0, data, {from: hotelAccount});
      const info = await help.getHotelInfo(wtHotel);

      assert.equal(info.name, newName);
      assert.equal(info.description, newDescription);
    });

    it('should throw if non-owner edits name / description', async function(){
      const newName = 'Claridges';
      const newDescription = 'Near everything';
      const data = wtHotel.contract.editInfo.getData(newName, newDescription);

      try {
        await wtIndex.callHotel(0, data, {from: nonOwnerAccount});
        assert(false);
      } catch (e){
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('editAddress', function() {
    const lineOne = 'Common street 123';
    const lineTwo = '';
    const zip = '6655';
    const country = 'Spain';

    it('should edit the address', async function() {
      const data = wtHotel.contract.editAddress.getData(lineOne, lineTwo, zip, country);
      await wtIndex.callHotel(0, data, {from: hotelAccount});
      const info = await help.getHotelInfo(wtHotel);

      assert.equal(info.lineOne, lineOne);
      assert.equal(info.lineTwo, null);
      assert.equal(info.zip, zip);
      assert.equal(info.country, country);
    });

    it('should throw if non-owner edits address', async function(){
      const data = wtHotel.contract.editAddress.getData(lineOne, lineTwo, zip, country);

      try {
        await wtIndex.callHotel(0, data, {from: nonOwnerAccount});
        assert(false);
      } catch(e){
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  })

  describe('editLocation', function(){
    const timezone = 2;
    const longitude = 40.426371;
    const latitude = -3.703578;

    it('should edit the gps location', async function() {
      const { long, lat } = help.locationToUint(longitude, latitude);
      const data = wtHotel.contract.editLocation.getData(timezone, long, lat);
      await wtIndex.callHotel(0, data, {from: hotelAccount});
      const info = await help.getHotelInfo(wtHotel);

      assert.equal(longitude, info.longitude);
      assert.equal(latitude, info.latitude);
    });

    it('should throw if non-owner edits gps location', async function() {
      const { long, lat } = help.locationToUint(longitude, latitude);
      const data = wtHotel.contract.editLocation.getData(timezone, long, lat);

      try {
        await wtIndex.callHotel(0, data, {from: nonOwnerAccount});
        assert(false);
      } catch(e){
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('addImage / removeImage', function(){
    const image1 = 'http://wthotel.com/image1';
    const image2 = 'http://wthotel.com/image2';
    const image3 = 'http://wthotel.com/image1';

    it('should add and remove images', async function() {
      const data1 = wtHotel.contract.addImage.getData(image1);
      const data2 = wtHotel.contract.addImage.getData(image2);

      await wtIndex.callHotel(0, data1, {from: hotelAccount});
      await wtIndex.callHotel(0, data2, {from: hotelAccount});
      let info = await help.getHotelInfo(wtHotel);

      const found1 = info.images.findIndex(item => item === image1);
      const found2 = info.images.findIndex(item => item === image2);
      assert.notEqual(found1, -1);
      assert.notEqual(found2, -1);

      const removeImageData = wtHotel.contract.removeImage.getData(1);
      await wtIndex.callHotel(0, removeImageData, {from: hotelAccount});
      info = await help.getHotelInfo(wtHotel);

      const notFound = info.images.findIndex(item => item === image2);
      assert.equal(notFound, -1);
    });

    it('should throw if non-owner adds and removes images', async function(){
      const data1 = wtHotel.contract.addImage.getData(image1);
      const data2 = wtHotel.contract.addImage.getData(image2);

      // Add one image legitimately
      await wtIndex.callHotel(0, data1, {from: hotelAccount});
      const info = await help.getHotelInfo(wtHotel);
      const found1 = info.images.findIndex(item => item === image1);
      assert.notEqual(found1, -1);

      // Non-owner add
      try{
        await wtIndex.callHotel(0, data1, {from: nonOwnerAccount});
        assert(false);
      } catch(e){
        assert(help.isInvalidOpcodeEx(e));
      }

      // Non-owner remove at index 0
      const removeImageData = wtHotel.contract.removeImage.getData(0);

      try {
        await wtIndex.callHotel(0, removeImageData, {from: nonOwnerAccount});
        assert(false);
      } catch(e){
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('addUnitType', function(){
    const typeName = 'BASIC_ROOM';
    const typeNameHex = web3.toHex(typeName);
    let unitType;

    beforeEach(async function(){
      unitType = await UnitType.new(wtHotel.address, typeNameHex, {from: hotelAccount});
    })

    it('should add a UnitType', async function(){
      const data = wtHotel.contract.addUnitType.getData(unitType.address);
      await wtIndex.callHotel(0, data, {from: hotelAccount});
      const info = await help.getHotelInfo(wtHotel);

      assert.isDefined(info.unitTypes[typeName]);
    });

    it('should throw if non-owner adds a UnitType', async function(){
      const data = wtHotel.contract.addUnitType.getData(unitType.address);

      try {
        await wtIndex.callHotel(0, data, {from: nonOwnerAccount});
        assert(false);
      } catch(e){
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if the added UnitType already exists', async function(){
      const data = wtHotel.contract.addUnitType.getData(unitType.address);
      await wtIndex.callHotel(0, data, {from: hotelAccount});

      try {
        await wtIndex.callHotel(0, data, {from: hotelAccount});
        assert(false)
      } catch(e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('addUnit', function(){
    const typeName = 'BASIC_ROOM';
    const typeNameHex = web3.toHex(typeName);
    let unitType;

    beforeEach(async function(){
      unitType = await UnitType.new(wtHotel.address, typeNameHex, {from: hotelAccount});
      const data = wtHotel.contract.addUnitType.getData(unitType.address);
      await wtIndex.callHotel(0, data, {from: hotelAccount});
    });

    it('should add a Unit', async function(){
      const unit = await Unit.new(wtHotel.address, typeNameHex, {from: hotelAccount});
      const data = wtHotel.contract.addUnit.getData(unit.address);
      await wtIndex.callHotel(0, data, {from: hotelAccount});
      const info = await help.getHotelInfo(wtHotel);

      assert.isDefined(info.units[unit.address]);
    });

    it('should throw if non-owner adds a Unit', async function(){
      const unit = await Unit.new(wtHotel.address, typeNameHex, {from: hotelAccount});
      const data = wtHotel.contract.addUnit.getData(unit.address);

      try {
        await wtIndex.callHotel(0, data, {from: nonOwnerAccount});
        assert(false);
      } catch (e){
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if the UnitType of the Unit does not exist', async function(){
      const unknownTypeName = 'OCEAN_ROOM';
      const unknownTypeNameHex = web3.toHex(unknownTypeName);
      const unit = await Unit.new(wtHotel.address, unknownTypeNameHex, {from: hotelAccount});
      const data = wtHotel.contract.addUnit.getData(unit.address);

      try {
        await wtIndex.callHotel(0, data, {from: hotelAccount});
        assert(false);
      } catch (e){
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('removeUnitType', function(){
    const typeName = 'BASIC_ROOM';
    const typeNameHex = web3.toHex(typeName);
    const validIndex = 1;
    let unitType;

    beforeEach(async function(){
      await help.addUnitTypeToHotel(wtIndex, wtHotel, typeName, hotelAccount);
    })

    it('should remove a UnitType', async function(){
      const data = wtHotel.contract.removeUnitType.getData(typeNameHex, validIndex);
      await wtIndex.callHotel(0, data, {from: hotelAccount});
      const info = await help.getHotelInfo(wtHotel);

      assert.isUndefined(info.unitTypes[typeName]);
    });

    it('should throw if non-owner attempts removal', async function() {
      const data = wtHotel.contract.removeUnitType.getData(typeNameHex, validIndex);

      try {
        await wtIndex.callHotel(0, data, {from: nonOwnerAccount});
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if the unit type to be removed does not exist', async function(){
      const unknownTypeName = 'OCEAN_ROOM';
      const unknownTypeNameHex = web3.toHex(unknownTypeName);
      const data = wtHotel.contract.removeUnitType.getData(unknownTypeNameHex, validIndex);

      try {
        await wtIndex.callHotel(0, data, {from: hotelAccount});
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if the passed index does not match up with the UnitType', async function(){
      const invalidIndex = 2;
      const data = wtHotel.contract.removeUnitType.getData(typeNameHex, invalidIndex);

      try {
        await wtIndex.callHotel(0, data, {from: hotelAccount});
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('removeUnit', function(){
    const typeName = 'BASIC_ROOM';
    const typeNameHex = web3.toHex(typeName);
    let unit;

    beforeEach(async function() {
      await help.addUnitTypeToHotel(wtIndex, wtHotel, typeName, hotelAccount);
      unit = await help.addUnitToHotel(wtIndex, wtHotel, typeName, hotelAccount);
    })

    it('should remove a Unit', async function() {
      const data = wtHotel.contract.removeUnit.getData(unit.address);
      await wtIndex.callHotel(0, data, {from: hotelAccount});
      const info = await help.getHotelInfo(wtHotel);

      assert.isUndefined(info.units[unit]);
    });

    it('should throw if non-owner removes unit', async function() {
      const data = wtHotel.contract.removeUnit.getData(unit.address);

      try {
        await wtIndex.callHotel(0, data, {from: nonOwnerAccount});
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('changeUnitType', function(){
    const typeNameBasic = 'BASIC_ROOM';
    const hexBasic = web3.toHex(typeNameBasic);
    let unitTypeBasic;
    let unitTypeReplacement;

    beforeEach(async function() {
      unitTypeBasic = await help.addUnitTypeToHotel(wtIndex, wtHotel, typeNameBasic, hotelAccount);
      unitTypeReplacement = await UnitType.new(wtHotel.address, hexBasic, {from: hotelAccount});
    });

    it('should reassign the address of an existing UnitType', async function(){
      const data = wtHotel.contract.changeUnitType.getData(hexBasic, unitTypeReplacement.address);
      await wtIndex.callHotel(0, data, {from: hotelAccount});
      const info = await help.getHotelInfo(wtHotel);

      assert.equal(info.unitTypes[typeNameBasic].address, unitTypeReplacement.address);
    });

    it.skip('should should throw if the replacement typeName is mismatched', async function(){
      const typeNameMismatch = 'MISMATCH';
      const hexMismatch = web3.toHex(typeNameMismatch);
      unitTypeMismatch = await UnitType.new(wtHotel.address, hexMismatch, {from: hotelAccount});
      const data = wtHotel.contract.changeUnitType.getData(hexBasic, unitTypeMismatch.address);

      try {
        await wtIndex.callHotel(0, data, {from: hotelAccount});
        assert(false)
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if a non-owner changes the UnitType', async function(){
      const data = wtHotel.contract.changeUnitType.getData(hexBasic, unitTypeReplacement.address);

      try {
        await wtIndex.callHotel(0, data, {from: nonOwnerAccount});
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if the UnitType does not exist', async function(){
      const typeNameUnknown = 'OCEAN_ROOM';
      const hexUnknown = web3.toHex(typeNameUnknown);
      const data = wtHotel.contract.changeUnitType.getData(hexUnknown, unitTypeReplacement.address);

      try {
        await wtIndex.callHotel(0, data, {from: hotelAccount});
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('callUnitType', function(){
    const typeName = 'BASIC_ROOM';
    const typeNameHex = web3.toHex(typeName);
    const amenityNumber = 8;
    let unitType;
    let typeInterface;

    beforeEach(async function() {
      unitType = await help.addUnitTypeToHotel(wtIndex, wtHotel, typeName, hotelAccount);
      typeInterface = await UnitTypeInterface.at(unitType.address);
    });

    it('should execute a call on a UnitType', async function(){
      const addAmenityData = typeInterface.contract.addAmenity.getData(amenityNumber);
      const callUnitTypeData = wtHotel.contract.callUnitType.getData(typeNameHex, addAmenityData);
      await wtIndex.callHotel(0, callUnitTypeData, {from: hotelAccount});
      const info = await help.getHotelInfo(wtHotel);
      const amenity = info.unitTypes[typeName].amenities.filter(item => item === amenityNumber);

      assert.equal(amenity, amenityNumber);
    });

    it('should throw if non-owner executes the call', async function(){
      const addAmenityData = typeInterface.contract.addAmenity.getData(amenityNumber);
      const callUnitTypeData = wtHotel.contract.callUnitType.getData(typeNameHex, addAmenityData);

      try {
        await wtIndex.callHotel(0, callUnitTypeData, {from: nonOwnerAccount});
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if the hotel does not have the UnitType being called', async function(){
      const hexUnknown = web3.toHex('UNKNOWN_ROOM');
      const unknownUnitType = await UnitType.new(wtHotel.address, hexUnknown, {from: hotelAccount});
      typeInterface = await UnitTypeInterface.at(unknownUnitType.address);

      const addAmenityData = typeInterface.contract.addAmenity.getData(amenityNumber);
      const callUnitTypeData = wtHotel.contract.callUnitType.getData(hexUnknown, addAmenityData);

      try {
        await wtIndex.callHotel(0, callUnitTypeData, {from: hotelAccount});
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if the call to the UnitType returns false', async function(){
        // Not much throwing on UnitType except OnlyOwner which already throws.
    });
  });

  describe('callUnit', function(){
    const typeName = 'BASIC_ROOM';
    const typeNameHex = web3.toHex(typeName);
    const price = '100 USD';
    const fromDay = 10;
    const daysAmount = 3;
    let unitType;
    let unit;
    let typeInterface;
    let unitInterface;

    beforeEach(async function() {
      unitType = await help.addUnitTypeToHotel(wtIndex, wtHotel, typeName, hotelAccount);
      unit = await help.addUnitToHotel(wtIndex, wtHotel, typeName, hotelAccount);
      unitTypeInterface = await UnitTypeInterface.at(unitType.address);
      unitInterface = await UnitInterface.at(unit.address);
    });

    it('should execute a call on a Unit', async function(){
      setPriceData = unitInterface.contract.setPrice.getData(price, fromDay, daysAmount);
      callUnitData = wtHotel.contract.callUnit.getData(unit.address, setPriceData);
      await wtIndex.callHotel(0, callUnitData, {from: hotelAccount});
      const reservation = await unit.getReservation(10);

      assert.equal(reservation[0], price);
      assert(help.isZeroAddress(reservation[1]));
    });

    it('should fail if a non-owner calls the Unit', async function(){
      setPriceData = unitInterface.contract.setPrice.getData(price, fromDay, daysAmount);
      callUnitData = wtHotel.contract.callUnit.getData(unit.address, setPriceData);

      try {
        await wtIndex.callHotel(0, callUnitData, {from: nonOwnerAccount});
        assert(false);
      } catch(e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should fail if the Unit is not listed in the Hotels index of Units', async function(){
      const unknownUnit = await Unit.new(wtHotel.address, typeNameHex, {from: hotelAccount});
      setPriceData = unitInterface.contract.setPrice.getData(price, fromDay, daysAmount);
      callUnitData = wtHotel.contract.callUnit.getData(unknownUnit.address, setPriceData);

      try {
        await wtIndex.callHotel(0, callUnitData, {from: hotelAccount});
        assert(false);
      } catch(e) {
        assert(help.isInvalidOpcodeEx);
      }
    });
  });

  // These tests are stubs - they validate callIndex but rely on WTIndex behavior that is only
  // sketched in and likely to change.
  describe('callIndex', function(){
    const augusto = accounts[1];
    const typeName = 'BASIC_ROOM';
    const typeNameHex = web3.toHex(typeName);
    let unit;
    let bookData;

    beforeEach(async function() {
      const unitType = await help.addUnitTypeToHotel(wtIndex, wtHotel, typeName, hotelAccount);
      unit = await help.addUnitToHotel(wtIndex, wtHotel, typeName, hotelAccount, true);
      const giveVoteData = wtIndex.contract.giveVote.getData(hotelAccount);
      const callIndexData = wtHotel.contract.callIndex.getData(giveVoteData);
      bookData = unit.contract.book.getData(augusto, 60, 5, callIndexData);
    });

    it('should transfer a call from a Unit to the Index contract', async function(){

      abiDecoder.addABI(WTHotel._json.abi);
      abiDecoder.addABI(WTIndex._json.abi);
      abiDecoder.addABI(UnitType._json.abi);
      abiDecoder.addABI(Unit._json.abi);

      // We expect a giveVote event to have been logged
      const startTx = await unit.beginCall(bookData, '0x01', {from: augusto});
      const hash = startTx.logs[0].args.dataHash;
      const continueCallData = await unit.contract.continueCall.getData(hash);
      const callUnitData = await wtHotel.contract.callUnit.getData(unit.address, continueCallData);
      const finishTx = await wtIndex.callHotel(0, callUnitData, {from: hotelAccount});
      const voteGivenEvent = abiDecoder.decodeLogs(finishTx.receipt.logs)[1].events[0];
      assert.equal(voteGivenEvent.value, hotelAccount);
    });

    it('should throw if the calling Unit does not belong to the hotel', async function(){
      const unknownUnit = await Unit.new(wtHotel.address, typeNameHex, {from: hotelAccount});
      const startTx = await unknownUnit.beginCall('0x01', bookData, {from: augusto});
      const hash = startTx.logs[0].args.dataHash;
      const continueCallData = await unit.contract.continueCall.getData(hash);
      const callUnitData = await wtHotel.contract.callUnit.getData(unit.address, continueCallData);
      try {
        await wtIndex.callHotel(0, callUnitData, {from: hotelAccount});
        assert(false);
      } catch(e){
        assert(help.isInvalidOpcodeEx);
      }
    });

    it('should throw if the call returns false', async function(){
      // Try to have Unit WTIndex.setDao.
      const setDaoData = wtIndex.contract.setDAO.getData(augusto);
      const callIndexData = wtHotel.contract.callIndex.getData(setDaoData);
      bookData = unit.contract.book.getData(augusto, 60, 5, callIndexData);
      const startTx = await unit.beginCall(bookData, '0x01', {from: augusto});
      const hash = startTx.logs[0].args.dataHash;
      const continueCallData = await unit.contract.continueCall.getData(hash);
      const callUnitData = await wtHotel.contract.callUnit.getData(unit.address, continueCallData);

      try {
        await wtIndex.callHotel(0, callUnitData, {from: hotelAccount});
        assert(false);
      } catch(e){
        assert(help.isInvalidOpcodeEx);
      }
    });
  });
});

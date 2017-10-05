const Unit = artifacts.require('Unit.sol');
const WTHotel = artifacts.require('Hotel.sol');
const UnitType = artifacts.require('UnitType.sol');

const {
  isZeroAddress,
  isZeroBytes32,
  isZeroUint,
  isZeroString,
  bytes32ToString,
  jsArrayFromSolidityArray
} = require('./misc')

/**
 * Async method that creates a new empty Hotel.
 * @param  {Instance} wtIndex            WTIndex contract instance
 * @param  {Address} hotelAccount        address of the hotel's account
 * @param  {Boolean} requireConfirmation optional: require manager confirmation to book unit.
 * @return {Instance} Hotel
 * @example
 *   const wtHotel = await createHotel(accounts[2]);
 *   wtHotel.callHotel(..etc..)
 */
async function createHotel(wtIndex, hotelAccount){
  let hotelRegisterTx = await wtIndex.registerHotel('WT Hotel', 'WT Test Hotel', {from: hotelAccount});
  let wtHotelAddress = await wtIndex.getHotelsByManager(hotelAccount);
  let wtHotel = WTHotel.at(wtHotelAddress[0]);

  return wtHotel;
}

/**
 * Async method that adds a room (Unit) to a hotel
 * @param {[type]}  wtIndex             WTIndex contract instance
 * @param {[type]}  wtHotel             Hotel contract instance
 * @param {String}  unitTypeName        name of room type i.e. unitTypeName
 * @param {[type]}  hotelAccount        address of the hotel's account
 * @param {Boolean} requireConfirmation optional: require manager confirmation to book unit.
 * @return {Promise} Unit instance
 * @example
 *   const wtHotelUnit = await addUnitToHotel(wtIndex, wtHotel, unitTypeName, accounts[2], true);
 *   wtHotelUnit.book(accounts[1], 60, 5, callData);
 */
async function addUnitToHotel(wtIndex, wtHotel, unitTypeName, hotelAccount, requireConfirmation=false){

  // Create and add a unit
  let wtHotelUnit = await Unit.new(wtHotel.address, web3.toHex(unitTypeName), {from: hotelAccount});
  let addUnitData = wtHotel.contract.addUnit.getData(wtHotelUnit.address);
  await wtIndex.callHotel(0, addUnitData, {from: hotelAccount});

  // Require confirmation of unit booking by manager?
  if (requireConfirmation){
    callUnitData = wtHotelUnit.contract.changeConfirmation.getData(true);
    callUnitData = wtHotel.contract.callUnit.getData(wtHotelUnit.address, callUnitData);
    await wtIndex.callHotel(0, callUnitData, {from: hotelAccount});
  }

  return wtHotelUnit;
}

/**
 * Async method that creates a UnitType for a hotel
 * @param  {Instance} wtIndex      WTIndex contract instance
 * @param  {Instance} wtHotel      Hotel contract instance
 * @param  {String}   unitTypeName name of room type i.e. unitTypeName
 * @param  {Address}  hotelAccount address of the hotel's account
 * @return {Promise}  UnitType instance
 * @example
 *  const wtHotelUnitType = await addUnitTypeToHotel(wtIndex, wtHotel, 'BASIC_ROOM', accounts[2]);
 *  UnitTypeOwnerInterface = UnitTypeOwner.at(wtHotelUnitType.address);
 */
async function addUnitTypeToHotel(wtIndex, wtHotel, unitTypeName, hotelAccount){
   let wtHotelUnitType = await UnitType.new(wtHotel.address, web3.toHex(unitTypeName), {from: hotelAccount});
   let addUnitTypeData = wtHotel.contract.addUnitType.getData(wtHotelUnitType.address);
   await wtIndex.callHotel(0, addUnitTypeData, {from: hotelAccount});
   return wtHotelUnitType;
}

/**
 * Async function which gets all info associated with hotel, its unit types and units. Zero
 * elements in the solidity arrays are filtered out and data types are converted from
 * their solidity form to JS, i.e. bytes32 --> utf8.
 * @param  {Instance} wtHotel Hotel contract instance
 * @return {Object}   data
 */
async function getHotelInfo(wtHotel){

  // UnitTypes & Amenities
  const unitTypes = {};
  let unitTypeNames = await wtHotel.getUnitTypeNames();
  unitTypeNames = unitTypeNames.filter(name => !isZeroBytes32(name))

  if (unitTypeNames.length){
    for (let typeName of unitTypeNames){
      const unitType = await wtHotel.getUnitType(typeName);
      const instance = await UnitType.at(unitType);

      const name = bytes32ToString(typeName);
      unitTypes[name] = {};

      // UnitType Amenities
      const amenities = await instance.getAmenities();
      unitTypes[name].amenities = amenities.filter(item => !isZeroUint(item))
                                           .map(item => parseInt(item));
      // UnitType Info
      const info = {
        description,
        minGuests,
        maxGuests,
        price
      } = await instance.getInfo();

      unitTypes[name].info = info.reduce((acc, item, index) => {
        fields = ["description", "minGuests", "maxGuests", "price"];
        acc[fields[index]] = item;
        return acc;
      }, {});
      unitTypes[name].info.minGuests = parseInt(unitTypes[name].info.minGuests);
      unitTypes[name].info.maxGuests = parseInt(unitTypes[name].info.maxGuests)

      // UnitType Images
      const method = instance.getImage;
      const length = await instance.getImagesLength();
      const images = await jsArrayFromSolidityArray(method, length);
      unitTypes[name].images = images.filter(item => !isZeroString(item));
    };
  }

  // Hotel Images
  const imagesLength = await wtHotel.getImagesLength();
  const images = await jsArrayFromSolidityArray(wtHotel.getImage, imagesLength);

  // Hotel Units
  const units = {};
  const unitsLength = await wtHotel.getUnitsLength();
  let unitAddresses = await jsArrayFromSolidityArray(wtHotel.units.call, unitsLength.toNumber(), isZeroAddress);

  if(unitAddresses.length){
    for (let address of unitAddresses){
      const instance = Unit.at(address);
      units[address] = {};
      units[address].active = await instance.active.call();
      const unitType = await instance.unitType.call();
      units[address].unitType = bytes32ToString(unitType);
    }
  }

  return {
    images: images,
    unitTypeNames: unitTypeNames.map(name => bytes32ToString(name)),
    unitTypes: unitTypes,
    units: units
  }
}

module.exports = {
  createHotel : createHotel,
  addUnitToHotel: addUnitToHotel,
  addUnitTypeToHotel: addUnitTypeToHotel,
  getHotelInfo: getHotelInfo,
}

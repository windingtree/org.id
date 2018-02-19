const Unit = artifacts.require('Unit.sol');
const WTHotel = artifacts.require('Hotel.sol');
const UnitType = artifacts.require('UnitType.sol');
const UnitInterface = artifacts.require('Unit_Interface.sol');
const WTHotelInterface = artifacts.require('Hotel_Interface.sol');
const UnitTypeInterface = artifacts.require('UnitType_Interface.sol');

const {
  isZeroAddress,
  isZeroBytes32,
  isZeroUint,
  isZeroString,
  bytes32ToString,
  locationFromUint,
  jsArrayFromSolidityArray
} = require('./misc')

/**
 * Async method that creates a new empty Hotel.
 * @param  {Instance} wtIndex            WTIndex contract instance
 * @param  {Address} hotelAccount        address of the hotel's account
 * @return {Instance} Hotel
 * @example
 *   const wtHotel = await createHotel(accounts[2]);
 *   wtHotel.callHotel(..etc..)
 */
async function createHotel(wtIndex, hotelAccount){
  let hotelRegisterTx = await wtIndex.registerHotel('WT Hotel', 'WT Test Hotel', {from: hotelAccount});
  let wtHotelAddress = await wtIndex.getHotelsByManager(hotelAccount);
  let wtHotel = await WTHotelInterface.at(wtHotelAddress[0]);

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
  if (requireConfirmation) {
    callUnitData = wtHotel.contract.changeConfirmation.getData(true);
    await wtIndex.callHotel(0, callUnitData, {from: hotelAccount});
  }

  return await UnitInterface.at(wtHotelUnit.address);
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
   return await UnitTypeInterface.at(wtHotelUnitType.address);
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
      unitTypes[name].address = instance.address;

      // UnitType Amenities
      const amenities = await instance.getAmenities();
      unitTypes[name].amenities = amenities.filter(item => !isZeroUint(item))
                                           .map(item => parseInt(item));
      // UnitType Info
      const info = {
        typeDescription,
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
      const length = await instance.getImagesLength();
      const images = await jsArrayFromSolidityArray(instance.images, parseInt(length), isZeroString);
      unitTypes[name].images = images.filter(item => !isZeroString(item));
    };
  }

  // Hotel Images
  const imagesLength = await wtHotel.getImagesLength();
  const images = await jsArrayFromSolidityArray(wtHotel.images, parseInt(imagesLength), isZeroString);

  // Hotel Units
  const units = {};
  const unitsLength = await wtHotel.getUnitsLength();
  const unitAddresses = await jsArrayFromSolidityArray(wtHotel.units.call, parseInt(unitsLength), isZeroAddress);

  if(unitAddresses.length){
    for (let address of unitAddresses){
      const instance = Unit.at(address);
      units[address] = {};
      units[address].active = await instance.active.call();
      const unitType = await instance.unitType.call();
      units[address].unitType = bytes32ToString(unitType);
    }
  }

  // Hotel Info
  const name = await wtHotel.name();
  const description = await wtHotel.description();
  const manager = await wtHotel.manager();
  const lineOne = await wtHotel.lineOne();
  const lineTwo = await wtHotel.lineTwo();
  const zip = await wtHotel.zip();
  const country = await wtHotel.country();
  const created = await wtHotel.created();
  const timezone = await wtHotel.timezone();
  const latitude = await wtHotel.latitude();
  const longitude = await wtHotel.longitude();

  return {
    name: isZeroString(name) ? null : name,
    description: isZeroString(description) ? null : description,
    manager: isZeroAddress(manager) ? null : manager,
    lineOne : isZeroString(lineOne) ? null : lineOne,
    lineTwo : isZeroString(lineTwo) ? null : lineTwo,
    zip : isZeroString(zip) ? null : zip,
    country : isZeroString(country) ? null : country,
    created: isZeroUint(created) ? null : parseInt(created),
    timezone : isZeroString(timezone) ? null : timezone,
    latitude : isZeroUint(latitude) ? null : locationFromUint(longitude, latitude).lat,
    longitude : isZeroUint(longitude) ? null : locationFromUint(longitude, latitude).long,
    images: images,
    unitTypeNames: unitTypeNames.map(name => bytes32ToString(name)),
    unitTypes: unitTypes,
    units: units,
    unitAddresses: unitAddresses
  }
}

module.exports = {
  createHotel : createHotel,
  addUnitToHotel: addUnitToHotel,
  addUnitTypeToHotel: addUnitTypeToHotel,
  getHotelInfo: getHotelInfo,
}

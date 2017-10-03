const UnitType = artifacts.require('UnitType.sol');
const Unit = artifacts.require('Unit.sol');
const WTHotel = artifacts.require('Hotel.sol');

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
 * @return {Object} {wtHotelUnit: <Unit instance>, wtHotelUnitType: <UnitType instance> }
 * @example
 *   const { wtHotelUnit, wtHotelUnitType } = await addUnitToHotel(wtIndex, wtHotel, unitTypeName, accounts[2], true);
 *   wtHotelUnit.book(accounts[1], 60, 5, callData);
 *   UnitTypeOwnerInterface = UnitTypeOwner.at(wtHotelUnitType.address);
 */
async function addUnitToHotel(wtIndex, wtHotel, unitTypeName, hotelAccount, requireConfirmation=false){
  
  // Create the unit type on the hotel
  let wtHotelUnitType = await UnitType.new(wtHotel.address, web3.toHex(unitTypeName), {from: hotelAccount});
  let addUnitTypeData = wtHotel.contract.addUnitType.getData(wtHotelUnitType.address, web3.toHex(unitTypeName));
  await wtIndex.callHotel(0, addUnitTypeData, {from: hotelAccount});
    
  // Create and add a unit
  let wtHotelUnit = await Unit.new(wtHotel.address, web3.toHex(unitTypeName), {from: hotelAccount});
  let addUnitData = wtHotel.contract.addUnit.getData(web3.toHex(unitTypeName), wtHotelUnit.address);
  await wtIndex.callHotel(0, addUnitData, {from: hotelAccount});

  // Require confirmation of unit booking by manager? 
  if (requireConfirmation){
    callUnitData = wtHotelUnit.contract.changeConfirmation.getData(true);
    callUnitData = wtHotel.contract.callUnit.getData(wtHotelUnit.address, callUnitData);
    await wtIndex.callHotel(0, callUnitData, {from: hotelAccount});
  }

  return {
    wtHotelUnit: wtHotelUnit,
    wtHotelUnitType: wtHotelUnitType
  }
}

module.exports = {
  createHotel : createHotel,
  addUnitToHotel: addUnitToHotel
}


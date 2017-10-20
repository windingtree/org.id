const privateCallLib = require('./privateCall');
const hotelLib = require('./hotel');

const WTHotel = artifacts.require('Hotel.sol')
const WTIndex = artifacts.require('WTIndex.sol');
const LifToken = artifacts.require('LifToken.sol');
const Unit = artifacts.require('Unit.sol')

const typeName = 'BASIC_ROOM';

let index;
let hotel;
let unitType;
let stubData;
let accounts;

async function initializeHotel(hotelAccount){
  index = await WTIndex.new();
  hotel = await hotelLib.createHotel(index, hotelAccount);
  unitType = await hotelLib.addUnitTypeToHotel(index, hotel, typeName, hotelAccount);
  stubData = index.contract.getHotels.getData();
}

async function bookInstantly(
  client,
  hotelAccount,
  accounts,
  fromDay,
  daysAmount,
  unitPrice,
  options
) {

  // Options: require confirmation?
  (!options || options && !options.requireConfirmation)
    ? confirmation = false
    : confirmation = true;

  // Options: token method?
  (!options || options && !options.tokenMethod)
    ? tokenMethod = 'approveData'
    : tokenMethod = options.tokenMethod;

  // Options: keep previous hotel / perform a subsequent booking?
  if (!options || options && !options.keepPreviousHotel){
    await initializeHotel(hotelAccount);
    unit = await hotelLib.addUnitToHotel(index, hotel, typeName, hotelAccount, confirmation);
  }

  const args = [
    hotel,
    unit,
    client,
    fromDay,
    daysAmount,
    unitPrice,
    tokenMethod,
    accounts,
    stubData,
    options
  ];
  const result = await privateCallLib.runBeginCall(...args);

  result.hotel = hotel;
  result.index = index;
  result.unit = unit;
  return result;
}

module.exports = {
  bookInstantly: bookInstantly
}

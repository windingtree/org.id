const privateCallLib = require('./privateCall');
const hotelLib = require('./hotel');

const WTIndex = artifacts.require('WTIndex.sol');
const typeName = 'BASIC_ROOM';

let index;
let hotel;
let unit;

async function initializeHotel (hotelAccount) {
  index = await WTIndex.new();
  hotel = await hotelLib.createHotel(index, hotelAccount);
  unit = await hotelLib.addUnitTypeToHotel(index, hotel, typeName, hotelAccount);
}

async function bookInstantly (
  client,
  hotelAccount,
  accounts,
  fromDay,
  daysAmount,
  unitPrice,
  options
) {
  // Options: require confirmation?
  let confirmation = (options && options.requireConfirmation) || false;
  // Options: token method?
  let tokenMethod = (options && options.tokenMethod) || 'approveData';
  // Options: book method?
  let bookMethod = (options && options.bookMethod) || 'bookWithLif';

  // Options: keep previous hotel / perform a subsequent booking?
  if (!(options && options.keepPreviousHotel)) {
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
    bookMethod,
    accounts,
    options,
  ];
  const result = await privateCallLib.runBeginCall(...args);

  result.hotel = hotel;
  result.index = index;
  result.unit = unit;
  return result;
}

module.exports = {
  bookInstantly: bookInstantly,
};

const assert = require('chai').assert;
const help = require('./helpers/index.js');
const moment = require('moment');

contract('Hotel / PrivateCall: bookings', function(accounts) {
  const augusto = accounts[1];
  const hotelAccount = accounts[2];
  const jakub = accounts[3];
  const typeName = 'BASIC_ROOM';
  let fromDate;
  let fromDay;
  let block;

  describe('reservations', async function(){
    let events;
    let hash;
    let args;
    const daysAmount = 5;
    const daysFromNow = 1;
    const unitPrice = 1;

    before(async function() {
      block = await web3.eth.getBlock("latest");
      fromDate = moment.unix(block.timestamp);
      fromDate.add(daysFromNow, 'days');
      fromDay = fromDate.diff(moment(0), 'days');
    })

    // Add a unit that accepts instant booking, execute a token.transferData booking
    beforeEach(async function() {

      args = [
        augusto,
        hotelAccount,
        accounts,
        fromDay,
        daysAmount,
        unitPrice
      ];

      ({ events, hash, unit } = await help.bookInstantly(...args));
    });

    it('should make a reservation', async () => {
      const range = _.range(fromDay, fromDay + daysAmount);

      for (let day of range) {
        const [ specialPrice, bookedBy ] = await unit.getReservation(day);
        assert.equal(bookedBy, augusto);
      }
    });

    it('should fire a Book event with the correct info', async () => {
      const bookEvent = events.filter(item => item && item.name === 'Book')[0].events;
      const fromTopic = bookEvent.filter(item => item && item.name === 'from')[0];
      const fromDayTopic = bookEvent.filter(item => item && item.name === 'fromDay')[0];
      const daysAmountTopic = bookEvent.filter(item => item && item.name === 'daysAmount')[0];

      assert.equal(fromTopic.value, augusto);
      assert.equal(fromDayTopic.value, fromDay);
      assert.equal(daysAmountTopic.value, daysAmount);
    });

    it('should make a res that starts on the day a previous res ends', async () => {
      let nextDate = moment(fromDate).add(daysAmount, 'days');
      let nextFrom = nextDate.diff(moment(0), 'days');
      let nextAmount = 2;
      let options = {keepPreviousHotel: true};
      let newArgs = [
        jakub,
        hotelAccount,
        accounts,
        nextFrom,
        nextAmount,
        unitPrice,
        options
      ];
      const { unit } = await help.bookInstantly(...newArgs);

      const range = _.range(nextFrom, nextFrom + nextAmount);
      for (let day of range) {
        const [ specialPrice, bookedBy ] = await unit.getReservation(day);
        assert.equal(bookedBy, jakub);
      }
    })

    it('should throw if zero days are reserved', async () => {
      let nextDate = moment(fromDate).add(daysAmount, 'months');
      let nextFrom = nextDate.diff(moment(0), 'days');
      let nextAmount = 0;
      let newArgs = [
        jakub,
        hotelAccount,
        accounts,
        nextFrom,
        nextAmount,
        unitPrice
      ];

      const { success } = await help.bookInstantly(...newArgs);
      assert.equal(success, false);
    });

    it('should should throw if any of the days requested are already reserved', async () => {
      let nextDate = moment(fromDate).add(1, 'days');
      let nextFrom = nextDate.diff(moment(0), 'days');
      let options = {keepPreviousHotel: true};
      let newArgs = [
        jakub,
        hotelAccount,
        accounts,
        nextFrom,
        daysAmount,
        unitPrice,
        options
      ];

      const { success } = await help.bookInstantly(...newArgs);
      assert.equal(success, false);
    })

    // This requires more setup work.....
    it('should throw if the requested unit does not exist', async() => {
      let options = {badUnit: true};
      let newArgs = [
        augusto,
        hotelAccount,
        accounts,
        fromDay,
        daysAmount,
        unitPrice,
        options
      ];

      const { success } = await help.bookInstantly(...newArgs);
      assert.equal(success, false);
    })

    // This needs:
    // Contract logic about the current date.
    // Combing through the helpers and tests to remove '60' and provide an accurate date.
    it('should throw when reserving dates in the past', async() => {
      let pastDate = moment(fromDate).subtract(1, 'months');
      let nextFrom = pastDate.diff(moment(0), 'days');
      let nextAmount = 2;
      let newArgs = [
        augusto,
        hotelAccount,
        accounts,
        nextFrom,
        daysAmount,
        unitPrice
      ];

      const { success } = await help.bookInstantly(...newArgs);
      assert.equal(success, false);
    });
  });

  describe('instant payment with token', function () {
    const daysFromNow = 7;
    const daysAmount = 5;
    const unitPrice = 1;
    let args;

    before(async function() {
      block = await web3.eth.getBlock("latest");
      fromDate = moment.unix(block.timestamp);
      fromDate.add(daysFromNow, 'days');
      fromDay = fromDate.diff(moment(0), 'days');
    })

    beforeEach(function() {
      args = [
        augusto,
        hotelAccount,
        accounts,
        fromDay,
        daysAmount,
        unitPrice,
      ];
    })

    it('should transfer tokens from client account to the hotel contract', async () => {
      const {
        clientInitialBalance,
        hotelInitialBalance,
        hotel,
        token
      } = await help.bookInstantly(...args);

      const totalCost = daysAmount * unitPrice;
      const augustoFinalBalance = await token.balanceOf(augusto);
      const hotelFinalBalance = await token.balanceOf(hotel.address);

      assert(augustoFinalBalance.lt(clientInitialBalance));
      assert(hotelFinalBalance.gt(hotelInitialBalance));
      assert(augustoFinalBalance.eq(clientInitialBalance.sub(totalCost)));
      assert(hotelFinalBalance.eq(hotelInitialBalance.add(totalCost)));
    });

    // Room is different - more setup work.
    it('should revert the clients approval if the call fails', async () => {
      // Make a booking
      await help.bookInstantly(...args);

      // Make another booking that overlaps
      let takenDate = moment(fromDate).add(1, 'days');
      let nextFrom = takenDate.diff(moment(0), 'days');
      let options = {keepPreviousHotel: true};
      let newArgs = [
        jakub,
        hotelAccount,
        accounts,
        nextFrom,
        daysAmount,
        unitPrice,
        options
      ];

      const { hotel, token, success } = await help.bookInstantly(...newArgs);
      const allowance = await token.allowance(augusto, hotel.address);

      assert.equal(success, false);
      assert.equal(allowance.toNumber(), 0);
    });

    it('should throw if the approval is too low to execute the transfer', async () => {
      let options = {approvalValue: 0}
      args.push(options);

      const { hotel, token, success } = await help.bookInstantly(...args);
      const allowance = await token.allowance(augusto, hotel.address);

      assert.equal(success, false);
      assert.equal(allowance.toNumber(), 0);
    });

    it.skip('should clear allowances in excess of the room cost');
  });

});

const assert = require('chai').assert;
const help = require('./helpers/index.js');
const abiDecoder = require('abi-decoder');

const Unit = artifacts.require('Unit.sol');
const UnitInterface = artifacts.require('Unit_Interface.sol');

abiDecoder.addABI(Unit._json.abi);

contract('Unit', function(accounts) {
  let unit;
  const owner = accounts[1];
  const unitTypeName = 'UNIT_TYPE_NAME'
  const unitType = web3.toHex(unitTypeName);
  const currencyCode = "CHF";
  const currencyCodeHex = web3.toHex(currencyCode);
  const defaultPrice = 10000;
  const defaultLifPrice = 10;
  const specialPrice = 25000;
  const specialLifPrice = 25;
  const fromSpecialDate = 18000;
  const daysAmount = 5;

  describe('Constructor', function() {

    it('should be initialised with the correct data', async function(){
      unit = await Unit.new(owner, unitType);
      assert.equal(await unit.owner(), owner);
      assert.equal(help.bytes32ToString(await unit.unitType()), unitTypeName);
      assert(await unit.active());
    });

  });

  describe('Setting price info', function() {

    it('should let owner set custom currency code', async function() {
      await unit.setCurrencyCode(currencyCodeHex, {from: owner});
      assert.equal(help.bytes32ToString(await unit.currencyCode()), currencyCode);
    });

    it('should let owner set defaultPrice', async function() {
      await unit.setDefaultPrice(defaultPrice, {from: owner});
      assert.equal(await unit.defaultPrice(), defaultPrice);
    });

    it('should let owner set defaultLifPrice', async function() {
      await unit.setDefaultLifPrice(defaultLifPrice, {from: owner});
      assert.equal(await unit.defaultLifPrice(), defaultLifPrice);
    });

    it('should let owner set specialPrice for a set of dates', async function() {
      await unit.setSpecialPrice(specialPrice, fromSpecialDate, daysAmount, {from: owner});

      const range = _.range(fromSpecialDate, fromSpecialDate + daysAmount);

      for (let day of range) {
        const [ specialPriceRes, specialLifPriceRes, bookedBy ] = await unit.getReservation(day);
        assert.equal(specialPriceRes, specialPrice);
        assert.equal(specialLifPriceRes, 0);
        assert.equal(bookedBy, '0x0000000000000000000000000000000000000000');
      }
    });

    it('should let owner set specialLifPrice for a set of dates', async function() {
      await unit.setSpecialLifPrice(specialLifPrice, fromSpecialDate, daysAmount, {from: owner});

      const range = _.range(fromSpecialDate, fromSpecialDate + daysAmount);

      for (let day of range) {
        const [ specialPriceRes, specialLifPriceRes, bookedBy ] = await unit.getReservation(day);
        assert.equal(specialPriceRes, specialPrice);
        assert.equal(specialLifPriceRes, specialLifPrice);
        assert.equal(bookedBy, '0x0000000000000000000000000000000000000000');
      }
    });

  });

  describe('Getting price info', function() {

    it('should charge 3x default rate in custom currency for 3 regular days', async function() {
      assert.equal(await unit.getCost(100, 3), 3*defaultPrice);
    });

    it('should charge 2x default rate + special rate in custom currency for 2 regular days and 1 special day', async function() {
      assert.equal(await unit.getCost(fromSpecialDate-2, 3), 2*defaultPrice + specialPrice);
    });

    it('should charge 3x default rate in Lif for 3 regular days', async function() {
      assert.equal(await unit.getLifCost(100, 3), 3*defaultLifPrice);
    });

    it('should charge 2x default rate + special rate in Lif for 2 regular days and 1 special day', async function() {
      assert.equal(await unit.getLifCost(fromSpecialDate-2, 3), 2*defaultLifPrice + specialLifPrice);
    });
  });

});

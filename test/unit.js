const assert = require('chai').assert;
const help = require('./helpers/index.js');
const abiDecoder = require('abi-decoder');

const Unit = artifacts.require('Unit.sol');
const UnitType = artifacts.require('UnitType.sol');
const Hotel = artifacts.require('Hotel.sol');
const UnitInterface = artifacts.require('Unit_Interface.sol');
const Base_Interface = artifacts.require('Base_Interface.sol');

abiDecoder.addABI(UnitInterface._json.abi);

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

      let base = await Base_Interface.at(unit.address);
      assert.equal(help.bytes32ToString(await base.version()), help.version);
      assert.equal(help.bytes32ToString(await base.contractType()), "unit");
    });

  });

  describe('Setting price info', function() {

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

    let hotel;

    before(async function() {
      hotel = await Hotel.new('Hotel', 'Hotel desc', accounts[0]);
      unitTypeInstance = await UnitType.new(hotel.address, unitType);
      await hotel.addUnitType(unitTypeInstance.address);
      let setPriceData = unitTypeInstance.contract.setDefaultPrice.getData(defaultPrice);
      await hotel.callUnitType(unitType, setPriceData);
      setPriceData = unitTypeInstance.contract.setDefaultLifPrice.getData(defaultLifPrice);
      await hotel.callUnitType(unitType, setPriceData);
    })

    it('should charge 3x default rate in custom currency for 3 regular days', async function() {
      assert.equal(await hotel.getCost(unit.address, 100, 3), 3*defaultPrice);
    });

    it('should charge 2x default rate + special rate in custom currency for 2 regular days and 1 special day', async function() {
      assert.equal(await hotel.getCost(unit.address, fromSpecialDate-2, 3), 2*defaultPrice + specialPrice);
    });

    it('should charge 3x default rate in Lif for 3 regular days', async function() {
      assert.equal(await hotel.getLifCost(unit.address, 100, 3), 3*defaultLifPrice);
    });

    it('should charge 2x default rate + special rate in Lif for 2 regular days and 1 special day', async function() {
      assert.equal(await hotel.getLifCost(unit.address, fromSpecialDate-2, 3), 2*defaultLifPrice + specialLifPrice);
    });
  });

});

const assert = require('chai').assert;
const help = require('./helpers/index.js');

const WTContracts = artifacts.require('./WTContracts.sol');
const BaseInterface = artifacts.require('Base_Interface.sol');
const Hotel = artifacts.require('./Hotel.sol');

contract('WTContracts', function (accounts) {
  const hotelAccount = accounts[2];
  const nonOwnerAccount = accounts[3];
  const nullString = '';

  let contracts;
  let hotel;
  let hotelName;
  let hotelAddress;

  beforeEach(async () => {
    contracts = await WTContracts.new();
    hotel = await Hotel.new('EuroLux-Zug', 'Valets & Chalets', hotelAccount);
    hotelName = await hotel.name();
    hotelAddress = hotel.address;
  });

  describe('version', () => {
    it('should have the correct version and contract type', async () => {
      let base = await BaseInterface.at(contracts.address);
      assert.equal(help.bytes32ToString(await base.version()), help.version);
      assert.equal(help.bytes32ToString(await base.contractType()), 'wtcontracts');
    });
  });

  describe('register', function () {
    it('should register a contract', async () => {
      await contracts.register(hotelName, hotelAddress, hotelAccount);
      const [ name, addr, version ] = await contracts.getContract(1);

      assert.equal(name, hotelName);
      assert.equal(addr, hotelAddress);
      assert.equal(version, version);
    });

    it('should not register if the contract name exists in the registry', async () => {
      await contracts.register(hotelName, hotelAddress, hotelAccount);
      const initialTotal = await contracts.total();

      assert.equal(initialTotal.toNumber(), 1);

      await contracts.register(hotelName, contracts.address, hotelAccount);
      const finalTotal = await contracts.total();

      assert.equal(initialTotal.toNumber(), finalTotal.toNumber());
    });

    it('should not register if the contract address exists in the registry', async () => {
      await contracts.register(hotelName, hotelAddress, hotelAccount);
      const initialTotal = await contracts.total();

      assert.equal(initialTotal.toNumber(), 1);

      await contracts.register('Zug-Mountaineer-Hostel', hotelAddress, hotelAccount);
      const finalTotal = await contracts.total();

      assert.equal(initialTotal.toNumber(), finalTotal.toNumber());
    });

    it('should throw if a non-owner registers', async () => {
      try {
        await contracts.register(hotelName, hotelAddress, hotelAccount, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('edit', function () {
    it('should edit contracts name and address', async () => {
      const newAddress = accounts[5];
      const newVersion = '0.0.2';

      await contracts.register(hotelName, hotelAddress, hotelAccount);
      await contracts.edit(hotelName, newAddress, newVersion);

      const [ name, addr, version ] = await contracts.getContract(1);

      assert.equal(name, hotelName);
      assert.equal(addr, newAddress);
      assert.equal(version, newVersion);
    });

    it('should make no changes if contract name not registered', async () => {
      const newName = 'Zug-Mountaineer-Hostel';
      const newAddress = accounts[5];
      const newVersion = '0.0.2';

      await contracts.register(hotelName, hotelAddress, hotelAccount);
      await contracts.edit(newName, newAddress, newVersion);

      const [ name, addr, version ] = await contracts.getContract(1);

      assert.equal(name, hotelName);
      assert.equal(addr, hotelAddress);
      assert.equal(version, version);
    });

    it('should throw if non-owner edits', async () => {
      const newAddress = accounts[5];
      const newVersion = '0.0.2';
      await contracts.register(hotelName, hotelAddress, hotelAccount);

      try {
        await contracts.edit(hotelName, newAddress, newVersion, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('getContract', function () {
    beforeEach(async () => {
      await contracts.register(hotelName, hotelAddress, hotelAccount);
    });

    it('should return null values if index does not exist', async () => {
      const total = await contracts.total();
      const badIndex = total + 1;

      const [ name, addr, version ] = await contracts.getContract(badIndex);

      assert.equal(name, nullString);
      assert.equal(addr, help.zeroAddress);
      assert.equal(version, nullString);
    });
  });

  describe('getByAddr', function () {
    beforeEach(async () => {
      await contracts.register(hotelName, hotelAddress, hotelAccount);
    });

    it('should get contract by address', async () => {
      const [ name, addr, version ] = await contracts.getByAddr(hotelAddress);

      assert.equal(name, hotelName);
      assert.equal(addr, hotelAddress);
      assert.equal(version, version);
    });

    it('should return null values if addr does not exist', async () => {
      const badAddress = accounts[5];
      const [ name, addr, version ] = await contracts.getByAddr(badAddress);

      assert.equal(name, nullString);
      assert.equal(addr, help.zeroAddress);
      assert.equal(version, nullString);
    });
  });

  describe('getByName', function () {
    beforeEach(async () => {
      await contracts.register(hotelName, hotelAddress, hotelAccount);
    });

    it('should get contract by name', async () => {
      const [ name, addr, version ] = await contracts.getByName(hotelName);

      assert.equal(name, hotelName);
      assert.equal(addr, hotelAddress);
      assert.equal(version, version);
    });

    it('should return null values if addr does not exist', async () => {
      const badName = 'Zug-Mountaineer-Hostel';
      const [ name, addr, version ] = await contracts.getByName(badName);

      assert.equal(name, nullString);
      assert.equal(addr, help.zeroAddress);
      assert.equal(version, nullString);
    });
  });
});

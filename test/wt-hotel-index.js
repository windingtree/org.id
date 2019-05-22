const { TestHelper } = require('zos');
const { Contracts, ZWeb3 } = require('zos-lib');
const assert = require('chai').assert;
const help = require('./helpers/index.js');

ZWeb3.initialize(web3.currentProvider);
// workaround for https://github.com/zeppelinos/zos/issues/704
Contracts.setArtifactsDefaults({
  gas: 60000000,
});

const WTHotelIndex = Contracts.getFromLocal('WTHotelIndex');
const WTHotelIndexUpgradeabilityTest = Contracts.getFromLocal('WTHotelIndexUpgradeabilityTest');
// eaiser interaction with truffle-contract
const WTHotel = artifacts.require('Organization');
const AbstractWTHotelIndex = artifacts.require('AbstractWTHotelIndex');
const TruffleWTHotelIndexUpgradeabilityTest = artifacts.require('WTHotelIndexUpgradeabilityTest');
const HotelUpgradeabilityTest = artifacts.require('HotelUpgradeabilityTest');

contract('WTHotelIndex', (accounts) => {
  const hotelIndexOwner = accounts[1];
  const proxyOwner = accounts[2];
  const hotelAccount = accounts[3];
  const tokenAddress = accounts[5];

  let hotelIndexProxy;
  let hotelIndex;
  let project;

  // Deploy new hotelIndex but use AbstractWTHotelIndex for contract interaction
  beforeEach(async () => {
    project = await TestHelper();
    hotelIndexProxy = await project.createProxy(WTHotelIndex, {
      from: proxyOwner,
      initFunction: 'initialize',
      initArgs: [hotelIndexOwner, tokenAddress],
    });
    hotelIndex = await AbstractWTHotelIndex.at(hotelIndexProxy.address);
  });

  describe('upgradeability', () => {
    it('should upgrade WTHotelIndex and have new functions in Index and Hotel contracts', async () => {
      await hotelIndex.createAndRegisterHotel('dataUri', { from: hotelAccount });
      // Upgrade proxy with new implementation
      const newIndex = await WTHotelIndexUpgradeabilityTest.new({ from: hotelIndexOwner });
      await project.proxyAdmin.upgradeProxy(hotelIndexProxy.address, newIndex.address, WTHotelIndexUpgradeabilityTest);
      hotelIndex = await TruffleWTHotelIndexUpgradeabilityTest.at(hotelIndexProxy.address);
      await hotelIndex.createAndRegisterHotel('dataUri2', { from: hotelAccount });
      const length = await hotelIndex.getHotelsLength();
      const allHotels = await help.jsArrayFromSolidityArray(
        hotelIndex.hotels,
        length,
        help.isZeroAddress
      );
      const hotelsByManager = await hotelIndex.getHotelsByManager(hotelAccount);

      assert.isDefined(allHotels[0]);
      assert.isDefined(hotelsByManager[0]);
      assert.isFalse(help.isZeroAddress(allHotels[0]));
      assert.isFalse(help.isZeroAddress(hotelsByManager[0]));
      assert.equal(await hotelIndex.hotelsIndex(allHotels[0]), 1);
      assert.equal(await hotelIndex.hotelsIndex(allHotels[1]), 2);
      assert.equal(allHotels[0], hotelsByManager[0]);
      assert.equal(allHotels[1], hotelsByManager[1]);

      assert.equal(await (await WTHotel.at(allHotels[0])).dataUri(), 'dataUri');
      assert.equal(await (await WTHotel.at(allHotels[1])).dataUri(), 'dataUri2');

      assert.equal(await (await HotelUpgradeabilityTest.at(allHotels[1])).newFunction(), 100);
      assert.equal(await hotelIndex.newFunction(), 100);
    });
  });

  describe('createHotel', () => {
    it('should create hotel', async () => {
      const address = await hotelIndex.createHotel.call('dataUri', { from: hotelAccount });
      const receipt = await hotelIndex.createHotel('dataUri', { from: hotelAccount });
      assert.equal(receipt.logs.length, 3);
      assert.equal(receipt.logs[0].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[0].args[0], help.zeroAddress);
      assert.equal(receipt.logs[0].args[1], hotelIndex.address);
      assert.equal(receipt.logs[1].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[1].args[0], hotelIndex.address);
      assert.equal(receipt.logs[1].args[1], hotelAccount);
      assert.equal(receipt.logs[2].event, 'OrganizationCreated');
      assert.equal(receipt.logs[2].args[0], address);
    });
  });

  describe('registerHotel', () => {
    it('should register hotel', async () => {
      const address = await hotelIndex.createHotel.call('dataUri', { from: hotelAccount });
      await hotelIndex.createHotel('dataUri', { from: hotelAccount });
      const receipt = await hotelIndex.registerHotel(address, { from: hotelAccount });
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'OrganizationRegistered');
      assert.equal(receipt.logs[0].args[0], address);
      assert.equal(receipt.logs[0].args.managerIndex, 0);
      assert.equal(receipt.logs[0].args.allIndex, 1);
    });
  });

  describe('createAndRegisterHotel', () => {
    it('should create and register hotel', async () => {
      const address = await hotelIndex.createAndRegisterHotel.call('dataUri', { from: hotelAccount });
      const receipt = await hotelIndex.createAndRegisterHotel('dataUri', { from: hotelAccount });
      assert.equal(receipt.logs.length, 4);
      assert.equal(receipt.logs[0].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[0].args[0], help.zeroAddress);
      assert.equal(receipt.logs[0].args[1], hotelIndex.address);
      assert.equal(receipt.logs[1].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[1].args[0], hotelIndex.address);
      assert.equal(receipt.logs[1].args[1], hotelAccount);
      assert.equal(receipt.logs[2].event, 'OrganizationCreated');
      assert.equal(receipt.logs[2].args[0], address);
      assert.equal(receipt.logs[3].event, 'OrganizationRegistered');
      assert.equal(receipt.logs[3].args[0], address);
      assert.equal(receipt.logs[3].args.managerIndex, 0);
      assert.equal(receipt.logs[3].args.allIndex, 1);
    });
  });

  describe('deregisterHotel', () => {
    it('should remove an hotel', async () => {
      const address = await hotelIndex.createAndRegisterHotel.call('dataUri', { from: hotelAccount });
      await hotelIndex.createAndRegisterHotel('dataUri', { from: hotelAccount });
      const receipt = await hotelIndex.deregisterHotel(address, { from: hotelAccount });
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'OrganizationDeregistered');
      assert.equal(receipt.logs[0].args[0], address);
    });
  });

  describe('getHotelsLength', () => {
    it('should count hotels properly', async () => {
      // We start with empty address on the zero hotelIndex
      let length = await hotelIndex.getHotelsLength();
      // length is a bignumber
      assert.equal(length.toNumber(), 1);
      const address = await hotelIndex.createAndRegisterHotel.call('aaa', { from: hotelAccount });
      await hotelIndex.createAndRegisterHotel('aaa', { from: hotelAccount });
      await hotelIndex.createAndRegisterHotel('bbb', { from: hotelAccount });
      length = await hotelIndex.getHotelsLength();
      assert.equal(length.toNumber(), 3);
      await hotelIndex.deregisterHotel(address, { from: hotelAccount });
      length = await hotelIndex.getHotelsLength();
      // length counts zero addresses
      assert.equal(length.toNumber(), 3);
    });
  });

  describe('getHotels', () => {
    it('should return hotels properly', async () => {
      let hotels = await hotelIndex.getHotels();
      assert.equal(help.filterZeroAddresses(hotels).length, 0);
      const address = await hotelIndex.createAndRegisterHotel.call('aaa', { from: hotelAccount });
      await hotelIndex.createAndRegisterHotel('aaa', { from: hotelAccount });
      await hotelIndex.createAndRegisterHotel('bbb', { from: hotelAccount });
      hotels = await hotelIndex.getHotels();
      assert.equal(help.filterZeroAddresses(hotels).length, 2);
      await hotelIndex.deregisterHotel(address, { from: hotelAccount });
      hotels = await hotelIndex.getHotels();
      assert.equal(help.filterZeroAddresses(hotels).length, 1);
    });
  });

  describe('getHotelsByManager', () => {
    it('should return list of hotels for existing manager', async () => {
      await hotelIndex.createAndRegisterHotel('bbb', { from: hotelAccount });
      const hotelList = await hotelIndex.getHotelsByManager(hotelAccount);
      assert.equal(hotelList.length, 1);
    });

    it('should return empty list for a manager without hotels', async () => {
      const hotelList = await hotelIndex.getHotelsByManager(hotelAccount);
      assert.equal(hotelList.length, 0);
    });
  });
});

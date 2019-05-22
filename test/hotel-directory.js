const { TestHelper } = require('zos');
const { Contracts, ZWeb3 } = require('zos-lib');
const assert = require('chai').assert;
const help = require('./helpers/index.js');

ZWeb3.initialize(web3.currentProvider);
// workaround for https://github.com/zeppelinos/zos/issues/704
Contracts.setArtifactsDefaults({
  gas: 60000000,
});

const HotelDirectory = Contracts.getFromLocal('HotelDirectory');
const HotelDirectoryUpgradeabilityTest = Contracts.getFromLocal('HotelDirectoryUpgradeabilityTest');
// eaiser interaction with truffle-contract
const Organization = artifacts.require('Organization');
const HotelDirectoryInterface = artifacts.require('HotelDirectoryInterface');
const TruffleHotelDirectoryUpgradeabilityTest = artifacts.require('HotelDirectoryUpgradeabilityTest');
const OrganizationUpgradeabilityTest = artifacts.require('OrganizationUpgradeabilityTest');

contract('HotelDirectory', (accounts) => {
  const hotelDirectoryOwner = accounts[1];
  const proxyOwner = accounts[2];
  const hotelAccount = accounts[3];
  const tokenAddress = accounts[5];

  let hotelDirectoryProxy;
  let hotelDirectory;
  let project;

  // Deploy new hotelDirectory but use HotelDirectoryInterface for contract interaction
  beforeEach(async () => {
    project = await TestHelper();
    hotelDirectoryProxy = await project.createProxy(HotelDirectory, {
      from: proxyOwner,
      initFunction: 'initialize',
      initArgs: [hotelDirectoryOwner, tokenAddress],
    });
    hotelDirectory = await HotelDirectoryInterface.at(hotelDirectoryProxy.address);
  });

  describe('upgradeability', () => {
    it('should upgrade HotelDirectory and have new functions in Index and Hotel contracts', async () => {
      await hotelDirectory.createAndRegisterHotel('dataUri', { from: hotelAccount });
      // Upgrade proxy with new implementation
      const newIndex = await HotelDirectoryUpgradeabilityTest.new({ from: hotelDirectoryOwner });
      await project.proxyAdmin.upgradeProxy(hotelDirectoryProxy.address, newIndex.address, HotelDirectoryUpgradeabilityTest);
      hotelDirectory = await TruffleHotelDirectoryUpgradeabilityTest.at(hotelDirectoryProxy.address);
      await hotelDirectory.createAndRegisterHotel('dataUri2', { from: hotelAccount });
      const length = await hotelDirectory.getHotelsLength();
      const allHotels = await help.jsArrayFromSolidityArray(
        hotelDirectory.hotels,
        length,
        help.isZeroAddress
      );
      assert.isDefined(allHotels[0]);
      assert.isFalse(help.isZeroAddress(allHotels[0]));
      assert.equal(await hotelDirectory.hotelsIndex(allHotels[0]), 1);
      assert.equal(await hotelDirectory.hotelsIndex(allHotels[1]), 2);

      assert.equal(await (await Organization.at(allHotels[0])).dataUri(), 'dataUri');
      assert.equal(await (await Organization.at(allHotels[1])).dataUri(), 'dataUri2');

      assert.equal(await (await OrganizationUpgradeabilityTest.at(allHotels[1])).newFunction(), 100);
      assert.equal(await hotelDirectory.newFunction(), 100);
    });
  });

  describe('createHotel', () => {
    it('should create hotel', async () => {
      const address = await hotelDirectory.createHotel.call('dataUri', { from: hotelAccount });
      const receipt = await hotelDirectory.createHotel('dataUri', { from: hotelAccount });
      assert.equal(receipt.logs.length, 3);
      assert.equal(receipt.logs[0].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[0].args[0], help.zeroAddress);
      assert.equal(receipt.logs[0].args[1], hotelDirectory.address);
      assert.equal(receipt.logs[1].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[1].args[0], hotelDirectory.address);
      assert.equal(receipt.logs[1].args[1], hotelAccount);
      assert.equal(receipt.logs[2].event, 'OrganizationCreated');
      assert.equal(receipt.logs[2].args.organization, address);
    });
  });

  describe('registerHotel', () => {
    it('should register hotel', async () => {
      const address = await hotelDirectory.createHotel.call('dataUri', { from: hotelAccount });
      await hotelDirectory.createHotel('dataUri', { from: hotelAccount });
      const receipt = await hotelDirectory.registerHotel(address, { from: hotelAccount });
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'OrganizationRegistered');
      assert.equal(receipt.logs[0].args.organization, address);
      assert.equal(receipt.logs[0].args.index, 1);
    });
  });

  describe('createAndRegisterHotel', () => {
    it('should create and register hotel', async () => {
      const address = await hotelDirectory.createAndRegisterHotel.call('dataUri', { from: hotelAccount });
      const receipt = await hotelDirectory.createAndRegisterHotel('dataUri', { from: hotelAccount });
      assert.equal(receipt.logs.length, 4);
      assert.equal(receipt.logs[0].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[0].args[0], help.zeroAddress);
      assert.equal(receipt.logs[0].args[1], hotelDirectory.address);
      assert.equal(receipt.logs[1].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[1].args[0], hotelDirectory.address);
      assert.equal(receipt.logs[1].args[1], hotelAccount);
      assert.equal(receipt.logs[2].event, 'OrganizationCreated');
      assert.equal(receipt.logs[2].args.organization, address);
      assert.equal(receipt.logs[3].event, 'OrganizationRegistered');
      assert.equal(receipt.logs[3].args.organization, address);
      assert.equal(receipt.logs[3].args.index, 1);
    });
  });

  describe('deregisterHotel', () => {
    it('should remove an hotel', async () => {
      const address = await hotelDirectory.createAndRegisterHotel.call('dataUri', { from: hotelAccount });
      await hotelDirectory.createAndRegisterHotel('dataUri', { from: hotelAccount });
      const receipt = await hotelDirectory.deregisterHotel(address, { from: hotelAccount });
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'OrganizationDeregistered');
      assert.equal(receipt.logs[0].args[0], address);
    });
  });

  describe('getHotelsLength', () => {
    it('should count hotels properly', async () => {
      // We start with empty address on the zero hotelDirectory
      let length = await hotelDirectory.getHotelsLength();
      // length is a bignumber
      assert.equal(length.toNumber(), 1);
      const address = await hotelDirectory.createAndRegisterHotel.call('aaa', { from: hotelAccount });
      await hotelDirectory.createAndRegisterHotel('aaa', { from: hotelAccount });
      await hotelDirectory.createAndRegisterHotel('bbb', { from: hotelAccount });
      length = await hotelDirectory.getHotelsLength();
      assert.equal(length.toNumber(), 3);
      await hotelDirectory.deregisterHotel(address, { from: hotelAccount });
      length = await hotelDirectory.getHotelsLength();
      // length counts zero addresses
      assert.equal(length.toNumber(), 3);
    });
  });

  describe('getHotels', () => {
    it('should return hotels properly', async () => {
      let hotels = await hotelDirectory.getHotels();
      assert.equal(help.filterZeroAddresses(hotels).length, 0);
      const address = await hotelDirectory.createAndRegisterHotel.call('aaa', { from: hotelAccount });
      await hotelDirectory.createAndRegisterHotel('aaa', { from: hotelAccount });
      await hotelDirectory.createAndRegisterHotel('bbb', { from: hotelAccount });
      hotels = await hotelDirectory.getHotels();
      assert.equal(help.filterZeroAddresses(hotels).length, 2);
      await hotelDirectory.deregisterHotel(address, { from: hotelAccount });
      hotels = await hotelDirectory.getHotels();
      assert.equal(help.filterZeroAddresses(hotels).length, 1);
    });
  });
});

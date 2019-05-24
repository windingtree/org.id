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
      // add old organization
      await hotelDirectory.createAndAddHotel('dataUri', { from: hotelAccount });
      // upgrade directory
      const upgradedDirectory = await HotelDirectoryUpgradeabilityTest.new({ from: hotelDirectoryOwner });
      await project.proxyAdmin.upgradeProxy(hotelDirectoryProxy.address, upgradedDirectory.address, HotelDirectoryUpgradeabilityTest);
      const newDirectory = await HotelDirectoryUpgradeabilityTest.at(hotelDirectoryProxy.address);
      // add new organization
      await newDirectory.methods.createAndAddHotel('dataUri2').send({ from: hotelAccount });
      const allHotels = help.filterZeroAddresses(await newDirectory.methods.getHotels().call());
      // test values
      assert.isDefined(await newDirectory.methods.hotels(1).call());
      assert.isDefined(await newDirectory.methods.hotels(2).call());
      assert.isFalse(help.isZeroAddress(allHotels[0]));
      assert.isFalse(help.isZeroAddress(allHotels[1]));
      assert.equal(await newDirectory.methods.hotelsIndex(allHotels[0]).call(), 1);
      assert.equal(await newDirectory.methods.hotelsIndex(allHotels[1]).call(), 2);
      assert.equal(await (await Organization.at(allHotels[0])).dataUri(), 'dataUri');
      assert.equal(await (await Organization.at(allHotels[1])).dataUri(), 'dataUri2');
      assert.equal(await (await OrganizationUpgradeabilityTest.at(allHotels[1])).newFunction(), 100);
      assert.equal(await newDirectory.methods.newFunction().call(), 100);
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

  describe('addHotel', () => {
    it('should add hotel', async () => {
      const address = await hotelDirectory.createHotel.call('dataUri', { from: hotelAccount });
      await hotelDirectory.createHotel('dataUri', { from: hotelAccount });
      const receipt = await hotelDirectory.addHotel(address, { from: hotelAccount });
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'OrganizationAdded');
      assert.equal(receipt.logs[0].args.organization, address);
      assert.equal(receipt.logs[0].args.index, 1);
    });
  });

  describe('createAndAddHotel', () => {
    it('should create and add hotel', async () => {
      const address = await hotelDirectory.createAndAddHotel.call('dataUri', { from: hotelAccount });
      const receipt = await hotelDirectory.createAndAddHotel('dataUri', { from: hotelAccount });
      assert.equal(receipt.logs.length, 4);
      assert.equal(receipt.logs[0].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[0].args[0], help.zeroAddress);
      assert.equal(receipt.logs[0].args[1], hotelDirectory.address);
      assert.equal(receipt.logs[1].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[1].args[0], hotelDirectory.address);
      assert.equal(receipt.logs[1].args[1], hotelAccount);
      assert.equal(receipt.logs[2].event, 'OrganizationCreated');
      assert.equal(receipt.logs[2].args.organization, address);
      assert.equal(receipt.logs[3].event, 'OrganizationAdded');
      assert.equal(receipt.logs[3].args.organization, address);
      assert.equal(receipt.logs[3].args.index, 1);
    });
  });

  describe('removeHotel', () => {
    it('should remove an hotel', async () => {
      const address = await hotelDirectory.createAndAddHotel.call('dataUri', { from: hotelAccount });
      await hotelDirectory.createAndAddHotel('dataUri', { from: hotelAccount });
      const receipt = await hotelDirectory.removeHotel(address, { from: hotelAccount });
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'OrganizationRemoveed');
      assert.equal(receipt.logs[0].args[0], address);
    });
  });

  describe('getHotelsLength', () => {
    it('should count hotels properly', async () => {
      // We start with empty address on the zero hotelDirectory
      let length = await hotelDirectory.getHotelsLength();
      // length is a bignumber
      assert.equal(length.toNumber(), 1);
      const address = await hotelDirectory.createAndAddHotel.call('aaa', { from: hotelAccount });
      await hotelDirectory.createAndAddHotel('aaa', { from: hotelAccount });
      await hotelDirectory.createAndAddHotel('bbb', { from: hotelAccount });
      length = await hotelDirectory.getHotelsLength();
      assert.equal(length.toNumber(), 3);
      await hotelDirectory.removeHotel(address, { from: hotelAccount });
      length = await hotelDirectory.getHotelsLength();
      // length counts zero addresses
      assert.equal(length.toNumber(), 3);
    });
  });

  describe('getHotels', () => {
    it('should return hotels properly', async () => {
      let hotels = await hotelDirectory.getHotels();
      assert.equal(help.filterZeroAddresses(hotels).length, 0);
      const address = await hotelDirectory.createAndAddHotel.call('aaa', { from: hotelAccount });
      await hotelDirectory.createAndAddHotel('aaa', { from: hotelAccount });
      await hotelDirectory.createAndAddHotel('bbb', { from: hotelAccount });
      hotels = await hotelDirectory.getHotels();
      assert.equal(help.filterZeroAddresses(hotels).length, 2);
      await hotelDirectory.removeHotel(address, { from: hotelAccount });
      hotels = await hotelDirectory.getHotels();
      assert.equal(help.filterZeroAddresses(hotels).length, 1);
    });
  });
});

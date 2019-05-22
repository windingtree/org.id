const { TestHelper } = require('zos');
const { Contracts, ZWeb3 } = require('zos-lib');
const assert = require('chai').assert;
const help = require('./helpers/index.js');

ZWeb3.initialize(web3.currentProvider);
// workaround for https://github.com/zeppelinos/zos/issues/704
Contracts.setArtifactsDefaults({
  gas: 60000000,
});

const AirlineDirectory = Contracts.getFromLocal('AirlineDirectory');
const AirlineDirectoryUpgradeabilityTest = Contracts.getFromLocal('AirlineDirectoryUpgradeabilityTest');
// eaiser interaction with truffle-contract
const Organization = artifacts.require('Organization');
const AirlineDirectoryInterface = artifacts.require('AirlineDirectoryInterface');
const OrganizationUpgradeabilityTest = artifacts.require('OrganizationUpgradeabilityTest');

contract('AirlineDirectory', (accounts) => {
  const airlineDirectoryOwner = accounts[1];
  const proxyOwner = accounts[2];
  const airlineAccount = accounts[3];
  const tokenAddress = accounts[5];

  let airlineDirectoryProxy;
  let airlineDirectory;
  let project;

  // Deploy new airlineDirectory but use AirlineDirectoryInterface for contract interaction
  beforeEach(async () => {
    project = await TestHelper();
    airlineDirectoryProxy = await project.createProxy(AirlineDirectory, {
      from: proxyOwner,
      initFunction: 'initialize',
      initArgs: [airlineDirectoryOwner, tokenAddress],
    });
    airlineDirectory = await AirlineDirectoryInterface.at(airlineDirectoryProxy.address);
  });

  describe('upgradeability', () => {
    it('should upgrade AirlineDirectory and have new functions in Index and Airline contracts', async () => {
      // register old organization
      await airlineDirectory.createAndRegisterAirline('dataUri', { from: airlineAccount });
      // upgrade directory
      const upgradedDirectory = await AirlineDirectoryUpgradeabilityTest.new({ from: airlineDirectoryOwner });
      await project.proxyAdmin.upgradeProxy(airlineDirectoryProxy.address, upgradedDirectory.address, AirlineDirectoryUpgradeabilityTest);
      const newDirectory = await AirlineDirectoryUpgradeabilityTest.at(airlineDirectoryProxy.address);
      // register new organization
      await newDirectory.methods.createAndRegisterAirline('dataUri2').send({ from: airlineAccount });
      const allAirlines = help.filterZeroAddresses(await newDirectory.methods.getAirlines().call());
      // test values
      assert.isDefined(await newDirectory.methods.airlines(1).call());
      assert.isDefined(await newDirectory.methods.airlines(2).call());
      assert.isFalse(help.isZeroAddress(allAirlines[0]));
      assert.isFalse(help.isZeroAddress(allAirlines[1]));
      assert.equal(await newDirectory.methods.airlinesIndex(allAirlines[0]).call(), 1);
      assert.equal(await newDirectory.methods.airlinesIndex(allAirlines[1]).call(), 2);
      assert.equal(await (await Organization.at(allAirlines[0])).dataUri(), 'dataUri');
      assert.equal(await (await Organization.at(allAirlines[1])).dataUri(), 'dataUri2');
      assert.equal(await (await OrganizationUpgradeabilityTest.at(allAirlines[1])).newFunction(), 100);
      assert.equal(await newDirectory.methods.newFunction().call(), 100);
    });
  });

  describe('createAirline', () => {
    it('should create airline', async () => {
      const address = await airlineDirectory.createAirline.call('dataUri', { from: airlineAccount });
      const receipt = await airlineDirectory.createAirline('dataUri', { from: airlineAccount });
      assert.equal(receipt.logs.length, 3);
      assert.equal(receipt.logs[0].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[0].args[0], help.zeroAddress);
      assert.equal(receipt.logs[0].args[1], airlineDirectory.address);
      assert.equal(receipt.logs[1].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[1].args[0], airlineDirectory.address);
      assert.equal(receipt.logs[1].args[1], airlineAccount);
      assert.equal(receipt.logs[2].event, 'OrganizationCreated');
      assert.equal(receipt.logs[2].args.organization, address);
    });
  });

  describe('registerAirline', () => {
    it('should register airline', async () => {
      const address = await airlineDirectory.createAirline.call('dataUri', { from: airlineAccount });
      await airlineDirectory.createAirline('dataUri', { from: airlineAccount });
      const receipt = await airlineDirectory.registerAirline(address, { from: airlineAccount });
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'OrganizationRegistered');
      assert.equal(receipt.logs[0].args.organization, address);
      assert.equal(receipt.logs[0].args.index, 1);
    });
  });

  describe('createAndRegisterAirline', () => {
    it('should create and register airline', async () => {
      const address = await airlineDirectory.createAndRegisterAirline.call('dataUri', { from: airlineAccount });
      const receipt = await airlineDirectory.createAndRegisterAirline('dataUri', { from: airlineAccount });
      assert.equal(receipt.logs.length, 4);
      assert.equal(receipt.logs[0].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[0].args[0], help.zeroAddress);
      assert.equal(receipt.logs[0].args[1], airlineDirectory.address);
      assert.equal(receipt.logs[1].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[1].args[0], airlineDirectory.address);
      assert.equal(receipt.logs[1].args[1], airlineAccount);
      assert.equal(receipt.logs[2].event, 'OrganizationCreated');
      assert.equal(receipt.logs[2].args.organization, address);
      assert.equal(receipt.logs[3].event, 'OrganizationRegistered');
      assert.equal(receipt.logs[3].args.organization, address);
      assert.equal(receipt.logs[3].args.index, 1);
    });
  });

  describe('deregisterAirline', () => {
    it('should remove an airline', async () => {
      const address = await airlineDirectory.createAndRegisterAirline.call('dataUri', { from: airlineAccount });
      await airlineDirectory.createAndRegisterAirline('dataUri', { from: airlineAccount });
      const receipt = await airlineDirectory.deregisterAirline(address, { from: airlineAccount });
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'OrganizationDeregistered');
      assert.equal(receipt.logs[0].args[0], address);
    });
  });

  describe('getAirlinesLength', () => {
    it('should count airlines properly', async () => {
      // We start with empty address on the zero airlineDirectory
      let length = await airlineDirectory.getAirlinesLength();
      // length is a bignumber
      assert.equal(length.toNumber(), 1);
      const address = await airlineDirectory.createAndRegisterAirline.call('aaa', { from: airlineAccount });
      await airlineDirectory.createAndRegisterAirline('aaa', { from: airlineAccount });
      await airlineDirectory.createAndRegisterAirline('bbb', { from: airlineAccount });
      length = await airlineDirectory.getAirlinesLength();
      assert.equal(length.toNumber(), 3);
      await airlineDirectory.deregisterAirline(address, { from: airlineAccount });
      length = await airlineDirectory.getAirlinesLength();
      // length counts zero addresses
      assert.equal(length.toNumber(), 3);
    });
  });

  describe('getAirlines', () => {
    it('should return airlines properly', async () => {
      let airlines = await airlineDirectory.getAirlines();
      assert.equal(help.filterZeroAddresses(airlines).length, 0);
      const address = await airlineDirectory.createAndRegisterAirline.call('aaa', { from: airlineAccount });
      await airlineDirectory.createAndRegisterAirline('aaa', { from: airlineAccount });
      await airlineDirectory.createAndRegisterAirline('bbb', { from: airlineAccount });
      airlines = await airlineDirectory.getAirlines();
      assert.equal(help.filterZeroAddresses(airlines).length, 2);
      await airlineDirectory.deregisterAirline(address, { from: airlineAccount });
      airlines = await airlineDirectory.getAirlines();
      assert.equal(help.filterZeroAddresses(airlines).length, 1);
    });
  });
});

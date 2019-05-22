const { TestHelper } = require('zos');
const { Contracts, ZWeb3 } = require('zos-lib');
const assert = require('chai').assert;
const help = require('./helpers/index.js');

ZWeb3.initialize(web3.currentProvider);
// workaround for https://github.com/zeppelinos/zos/issues/704
Contracts.setArtifactsDefaults({
  gas: 60000000,
});

const WTAirlineIndex = Contracts.getFromLocal('WTAirlineIndex');
const WTAirlineIndexUpgradeabilityTest = Contracts.getFromLocal('WTAirlineIndexUpgradeabilityTest');
// eaiser interaction with truffle-contract
const WTAirline = artifacts.require('Organization');
const AbstractWTAirlineIndex = artifacts.require('AbstractWTAirlineIndex');
const TruffleWTAirlineIndexUpgradeabilityTest = artifacts.require('WTAirlineIndexUpgradeabilityTest');
const AirlineUpgradeabilityTest = artifacts.require('AirlineUpgradeabilityTest');

contract('WTAirlineIndex', (accounts) => {
  const airlineIndexOwner = accounts[1];
  const proxyOwner = accounts[2];
  const airlineAccount = accounts[3];
  const tokenAddress = accounts[5];

  let airlineIndexProxy;
  let airlineIndex;
  let project;

  // Deploy new airlineIndex but use AbstractWTAirlineIndex for contract interaction
  beforeEach(async () => {
    project = await TestHelper();
    airlineIndexProxy = await project.createProxy(WTAirlineIndex, {
      from: proxyOwner,
      initFunction: 'initialize',
      initArgs: [airlineIndexOwner, tokenAddress],
    });
    airlineIndex = await AbstractWTAirlineIndex.at(airlineIndexProxy.address);
  });

  describe('upgradeability', () => {
    it('should upgrade WTAirlineIndex and have new functions in Index and Airline contracts', async () => {
      await airlineIndex.createAndRegisterAirline('dataUri', { from: airlineAccount });
      // Upgrade proxy with new implementation
      const newIndex = await WTAirlineIndexUpgradeabilityTest.new({ from: airlineIndexOwner });
      await project.proxyAdmin.upgradeProxy(airlineIndexProxy.address, newIndex.address, WTAirlineIndexUpgradeabilityTest);
      airlineIndex = await TruffleWTAirlineIndexUpgradeabilityTest.at(airlineIndexProxy.address);
      await airlineIndex.createAndRegisterAirline('dataUri2', { from: airlineAccount });
      const length = await airlineIndex.getAirlinesLength();
      const allAirlines = await help.jsArrayFromSolidityArray(
        airlineIndex.airlines,
        length,
        help.isZeroAddress
      );
      const airlinesByManager = await airlineIndex.getAirlinesByManager(airlineAccount);

      assert.isDefined(allAirlines[0]);
      assert.isDefined(airlinesByManager[0]);
      assert.isFalse(help.isZeroAddress(allAirlines[0]));
      assert.isFalse(help.isZeroAddress(airlinesByManager[0]));
      assert.equal(await airlineIndex.airlinesIndex(allAirlines[0]), 1);
      assert.equal(await airlineIndex.airlinesIndex(allAirlines[1]), 2);
      assert.equal(allAirlines[0], airlinesByManager[0]);
      assert.equal(allAirlines[1], airlinesByManager[1]);

      assert.equal(await (await WTAirline.at(allAirlines[0])).dataUri(), 'dataUri');
      assert.equal(await (await WTAirline.at(allAirlines[1])).dataUri(), 'dataUri2');

      assert.equal(await (await AirlineUpgradeabilityTest.at(allAirlines[1])).newFunction(), 100);
      assert.equal(await airlineIndex.newFunction(), 100);
    });
  });

  describe('createAirline', () => {
    it('should create airline', async () => {
      const address = await airlineIndex.createAirline.call('dataUri', { from: airlineAccount });
      const receipt = await airlineIndex.createAirline('dataUri', { from: airlineAccount });
      assert.equal(receipt.logs.length, 3);
      assert.equal(receipt.logs[0].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[0].args[0], help.zeroAddress);
      assert.equal(receipt.logs[0].args[1], airlineIndex.address);
      assert.equal(receipt.logs[1].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[1].args[0], airlineIndex.address);
      assert.equal(receipt.logs[1].args[1], airlineAccount);
      assert.equal(receipt.logs[2].event, 'OrganizationCreated');
      assert.equal(receipt.logs[2].args[0], address);
    });
  });

  describe('registerAirline', () => {
    it('should register airline', async () => {
      const address = await airlineIndex.createAirline.call('dataUri', { from: airlineAccount });
      await airlineIndex.createAirline('dataUri', { from: airlineAccount });
      const receipt = await airlineIndex.registerAirline(address, { from: airlineAccount });
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'OrganizationRegistered');
      assert.equal(receipt.logs[0].args[0], address);
      assert.equal(receipt.logs[0].args.managerIndex, 0);
      assert.equal(receipt.logs[0].args.allIndex, 1);
    });
  });

  describe('createAndRegisterAirline', () => {
    it('should create and register airline', async () => {
      const address = await airlineIndex.createAndRegisterAirline.call('dataUri', { from: airlineAccount });
      const receipt = await airlineIndex.createAndRegisterAirline('dataUri', { from: airlineAccount });
      assert.equal(receipt.logs.length, 4);
      assert.equal(receipt.logs[0].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[0].args[0], help.zeroAddress);
      assert.equal(receipt.logs[0].args[1], airlineIndex.address);
      assert.equal(receipt.logs[1].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[1].args[0], airlineIndex.address);
      assert.equal(receipt.logs[1].args[1], airlineAccount);
      assert.equal(receipt.logs[2].event, 'OrganizationCreated');
      assert.equal(receipt.logs[2].args[0], address);
      assert.equal(receipt.logs[3].event, 'OrganizationRegistered');
      assert.equal(receipt.logs[3].args[0], address);
      assert.equal(receipt.logs[3].args.managerIndex, 0);
      assert.equal(receipt.logs[3].args.allIndex, 1);
    });
  });

  describe('deregisterAirline', () => {
    it('should remove an airline', async () => {
      const address = await airlineIndex.createAndRegisterAirline.call('dataUri', { from: airlineAccount });
      await airlineIndex.createAndRegisterAirline('dataUri', { from: airlineAccount });
      const receipt = await airlineIndex.deregisterAirline(address, { from: airlineAccount });
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'OrganizationDeregistered');
      assert.equal(receipt.logs[0].args[0], address);
    });
  });

  describe('getAirlinesLength', () => {
    it('should count airlines properly', async () => {
      // We start with empty address on the zero airlineIndex
      let length = await airlineIndex.getAirlinesLength();
      // length is a bignumber
      assert.equal(length.toNumber(), 1);
      const address = await airlineIndex.createAndRegisterAirline.call('aaa', { from: airlineAccount });
      await airlineIndex.createAndRegisterAirline('aaa', { from: airlineAccount });
      await airlineIndex.createAndRegisterAirline('bbb', { from: airlineAccount });
      length = await airlineIndex.getAirlinesLength();
      assert.equal(length.toNumber(), 3);
      await airlineIndex.deregisterAirline(address, { from: airlineAccount });
      length = await airlineIndex.getAirlinesLength();
      // length counts zero addresses
      assert.equal(length.toNumber(), 3);
    });
  });

  describe('getAirlines', () => {
    it('should return airlines properly', async () => {
      let airlines = await airlineIndex.getAirlines();
      assert.equal(help.filterZeroAddresses(airlines).length, 0);
      const address = await airlineIndex.createAndRegisterAirline.call('aaa', { from: airlineAccount });
      await airlineIndex.createAndRegisterAirline('aaa', { from: airlineAccount });
      await airlineIndex.createAndRegisterAirline('bbb', { from: airlineAccount });
      airlines = await airlineIndex.getAirlines();
      assert.equal(help.filterZeroAddresses(airlines).length, 2);
      await airlineIndex.deregisterAirline(address, { from: airlineAccount });
      airlines = await airlineIndex.getAirlines();
      assert.equal(help.filterZeroAddresses(airlines).length, 1);
    });
  });

  describe('getAirlinesByManager', () => {
    it('should return list of airlines for existing manager', async () => {
      await airlineIndex.createAndRegisterAirline('bbb', { from: airlineAccount });
      const airlineList = await airlineIndex.getAirlinesByManager(airlineAccount);
      assert.equal(airlineList.length, 1);
    });

    it('should return empty list for a manager without airlines', async () => {
      const airlineList = await airlineIndex.getAirlinesByManager(airlineAccount);
      assert.equal(airlineList.length, 0);
    });
  });
});

const { TestHelper } = require('zos');
const { Contracts, ZWeb3 } = require('zos-lib');
const assert = require('chai').assert;
const help = require('./helpers/index.js');

ZWeb3.initialize(web3.currentProvider);
// workaround for https://github.com/zeppelinos/zos/issues/704
Contracts.setArtifactsDefaults({
  gas: 60000000,
});

const OtaDirectory = Contracts.getFromLocal('OtaDirectory');
const OtaDirectoryUpgradeabilityTest = Contracts.getFromLocal('OtaDirectoryUpgradeabilityTest');
// eaiser interaction with truffle-contract
const Organization = artifacts.require('Organization');
const OtaDirectoryInterface = artifacts.require('OtaDirectoryInterface');
const TruffleOtaDirectoryUpgradeabilityTest = artifacts.require('OtaDirectoryUpgradeabilityTest');
const OrganizationUpgradeabilityTest = artifacts.require('OrganizationUpgradeabilityTest');

contract('OtaDirectory', (accounts) => {
  const otaDirectoryOwner = accounts[1];
  const proxyOwner = accounts[2];
  const otaAccount = accounts[3];
  const tokenAddress = accounts[5];

  let otaDirectoryProxy;
  let otaDirectory;
  let project;

  // Deploy new otaDirectory but use OtaDirectoryInterface for contract interaction
  beforeEach(async () => {
    project = await TestHelper();
    otaDirectoryProxy = await project.createProxy(OtaDirectory, {
      from: proxyOwner,
      initFunction: 'initialize',
      initArgs: [otaDirectoryOwner, tokenAddress],
    });
    otaDirectory = await OtaDirectoryInterface.at(otaDirectoryProxy.address);
  });

  describe('upgradeability', () => {
    it('should upgrade OtaDirectory and have new functions in Index and Ota contracts', async () => {
      // register old organization
      await otaDirectory.createAndRegisterOta('dataUri', { from: otaAccount });
      // upgrade directory
      const upgradedDirectory = await OtaDirectoryUpgradeabilityTest.new({ from: otaDirectoryOwner });
      await project.proxyAdmin.upgradeProxy(otaDirectoryProxy.address, upgradedDirectory.address, OtaDirectoryUpgradeabilityTest);
      const newDirectory = await OtaDirectoryUpgradeabilityTest.at(otaDirectoryProxy.address);
      // register new organization
      await newDirectory.methods.createAndRegisterOta('dataUri2').send({ from: otaAccount });
      const allOtas = help.filterZeroAddresses(await newDirectory.methods.getOtas().call());
      // test values
      assert.isDefined(await newDirectory.methods.otas(1).call());
      assert.isDefined(await newDirectory.methods.otas(2).call());
      assert.isFalse(help.isZeroAddress(allOtas[0]));
      assert.isFalse(help.isZeroAddress(allOtas[1]));
      assert.equal(await newDirectory.methods.otasIndex(allOtas[0]).call(), 1);
      assert.equal(await newDirectory.methods.otasIndex(allOtas[1]).call(), 2);
      assert.equal(await (await Organization.at(allOtas[0])).dataUri(), 'dataUri');
      assert.equal(await (await Organization.at(allOtas[1])).dataUri(), 'dataUri2');
      assert.equal(await (await OrganizationUpgradeabilityTest.at(allOtas[1])).newFunction(), 100);
      assert.equal(await newDirectory.methods.newFunction().call(), 100);
    });
  });

  describe('createOta', () => {
    it('should create ota', async () => {
      const address = await otaDirectory.createOta.call('dataUri', { from: otaAccount });
      const receipt = await otaDirectory.createOta('dataUri', { from: otaAccount });
      assert.equal(receipt.logs.length, 3);
      assert.equal(receipt.logs[0].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[0].args[0], help.zeroAddress);
      assert.equal(receipt.logs[0].args[1], otaDirectory.address);
      assert.equal(receipt.logs[1].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[1].args[0], otaDirectory.address);
      assert.equal(receipt.logs[1].args[1], otaAccount);
      assert.equal(receipt.logs[2].event, 'OrganizationCreated');
      assert.equal(receipt.logs[2].args.organization, address);
    });
  });

  describe('registerOta', () => {
    it('should register ota', async () => {
      const address = await otaDirectory.createOta.call('dataUri', { from: otaAccount });
      await otaDirectory.createOta('dataUri', { from: otaAccount });
      const receipt = await otaDirectory.registerOta(address, { from: otaAccount });
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'OrganizationRegistered');
      assert.equal(receipt.logs[0].args.organization, address);
      assert.equal(receipt.logs[0].args.index, 1);
    });
  });

  describe('createAndRegisterOta', () => {
    it('should create and register ota', async () => {
      const address = await otaDirectory.createAndRegisterOta.call('dataUri', { from: otaAccount });
      const receipt = await otaDirectory.createAndRegisterOta('dataUri', { from: otaAccount });
      assert.equal(receipt.logs.length, 4);
      assert.equal(receipt.logs[0].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[0].args[0], help.zeroAddress);
      assert.equal(receipt.logs[0].args[1], otaDirectory.address);
      assert.equal(receipt.logs[1].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[1].args[0], otaDirectory.address);
      assert.equal(receipt.logs[1].args[1], otaAccount);
      assert.equal(receipt.logs[2].event, 'OrganizationCreated');
      assert.equal(receipt.logs[2].args.organization, address);
      assert.equal(receipt.logs[3].event, 'OrganizationRegistered');
      assert.equal(receipt.logs[3].args.organization, address);
      assert.equal(receipt.logs[3].args.index, 1);
    });
  });

  describe('deregisterOta', () => {
    it('should remove an ota', async () => {
      const address = await otaDirectory.createAndRegisterOta.call('dataUri', { from: otaAccount });
      await otaDirectory.createAndRegisterOta('dataUri', { from: otaAccount });
      const receipt = await otaDirectory.deregisterOta(address, { from: otaAccount });
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'OrganizationDeregistered');
      assert.equal(receipt.logs[0].args[0], address);
    });
  });

  describe('getOtasLength', () => {
    it('should count otas properly', async () => {
      // We start with empty address on the zero otaDirectory
      let length = await otaDirectory.getOtasLength();
      // length is a bignumber
      assert.equal(length.toNumber(), 1);
      const address = await otaDirectory.createAndRegisterOta.call('aaa', { from: otaAccount });
      await otaDirectory.createAndRegisterOta('aaa', { from: otaAccount });
      await otaDirectory.createAndRegisterOta('bbb', { from: otaAccount });
      length = await otaDirectory.getOtasLength();
      assert.equal(length.toNumber(), 3);
      await otaDirectory.deregisterOta(address, { from: otaAccount });
      length = await otaDirectory.getOtasLength();
      // length counts zero addresses
      assert.equal(length.toNumber(), 3);
    });
  });

  describe('getOtas', () => {
    it('should return otas properly', async () => {
      let otas = await otaDirectory.getOtas();
      assert.equal(help.filterZeroAddresses(otas).length, 0);
      const address = await otaDirectory.createAndRegisterOta.call('aaa', { from: otaAccount });
      await otaDirectory.createAndRegisterOta('aaa', { from: otaAccount });
      await otaDirectory.createAndRegisterOta('bbb', { from: otaAccount });
      otas = await otaDirectory.getOtas();
      assert.equal(help.filterZeroAddresses(otas).length, 2);
      await otaDirectory.deregisterOta(address, { from: otaAccount });
      otas = await otaDirectory.getOtas();
      assert.equal(help.filterZeroAddresses(otas).length, 1);
    });
  });
});

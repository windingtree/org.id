const { Contracts, ZWeb3 } = require('zos-lib');
const assert = require('chai').assert;
const help = require('./helpers/index.js');
const TestHelper = require('./helpers/zostest');

ZWeb3.initialize(web3.currentProvider);
// workaround for https://github.com/zeppelinos/zos/issues/704
Contracts.setArtifactsDefaults({
  gas: 60000000,
});

const AdminUpgradeabilityProxy = Contracts.getFromLocal('AdminUpgradeabilityProxy');
const OrganizationInterface = Contracts.getFromLocal('OrganizationInterface');
const OrganizationFactory = Contracts.getFromLocal('OrganizationFactory');
const OrganizationFactoryUpgradeabilityTest = Contracts.getFromLocal('OrganizationFactoryUpgradeabilityTest');
const OrganizationUpgradeabilityTest = Contracts.getFromLocal('OrganizationUpgradeabilityTest');
const AbstractOrganizationFactory = artifacts.require('AbstractOrganizationFactory');
const SegmentDirectory = Contracts.getFromLocal('SegmentDirectory');
const AbstractSegmentDirectory = artifacts.require('AbstractSegmentDirectory');

contract('OrganizationFactory', (accounts) => {
  const organizationFactoryOwner = accounts[1];
  const organizationAccount = accounts[2];
  const nonOwnerAccount = accounts[3];
  const tokenAddress = accounts[4];

  let organizationFactoryProxy;
  let organizationFactory;
  let abstractOrganizationFactory;
  let abstractDirectory;
  let project;

  beforeEach(async () => {
    project = await TestHelper();
    organizationFactoryProxy = await project.createProxy(OrganizationFactory, {
      from: organizationFactoryOwner,
      initFunction: 'initialize',
      initArgs: [organizationFactoryOwner, project.app.address],
    });
    const segmentDirectoryProxy = await project.createProxy(SegmentDirectory, {
      from: organizationFactoryOwner,
      initFunction: 'initialize',
      initArgs: [organizationFactoryOwner, 'foodtrucks', help.zeroAddress],
    });
    organizationFactory = await OrganizationFactory.at(organizationFactoryProxy.address);
    abstractOrganizationFactory = await AbstractOrganizationFactory.at(organizationFactoryProxy.address);
    abstractDirectory = await AbstractSegmentDirectory.at(segmentDirectoryProxy.address);
  });

  describe('initialize', () => {
    it('should not allow zero address owner', async () => {
      try {
        const organizationFactory = await OrganizationFactory.new({ from: organizationFactoryOwner });
        await organizationFactory.methods.initialize(help.zeroAddress, project.app.address).send({ from: organizationFactoryOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should not allow zero address app', async () => {
      try {
        const organizationFactory = await OrganizationFactory.new({ from: organizationFactoryOwner });
        await organizationFactory.methods.initialize(project.app.address, help.zeroAddress).send({ from: organizationFactoryOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('upgradeability', () => {
    it('should upgrade OrganizationFactory and have new functions in directory and Organization contracts', async () => {
      // add old organization
      await organizationFactory.methods.create('orgJsonUri').send({ from: organizationAccount });
      // upgrade directory
      const upgradedDirectory = await OrganizationFactoryUpgradeabilityTest.new({ from: organizationFactoryOwner });
      await project.proxyAdmin.upgradeProxy(organizationFactoryProxy.address, upgradedDirectory.address, OrganizationFactoryUpgradeabilityTest);
      const newFactory = await OrganizationFactoryUpgradeabilityTest.at(organizationFactoryProxy.address);
      // add new organization
      await newFactory.methods.create('orgJsonUri2').send({ from: organizationAccount });
      const allOrganizations = help.filterZeroAddresses(await newFactory.methods.getCreatedOrganizations().call());
      // test values
      assert.isDefined(await newFactory.methods.createdOrganizations(1).call());
      assert.isDefined(await newFactory.methods.createdOrganizations(2).call());
      assert.isFalse(help.isZeroAddress(allOrganizations[0]));
      assert.isFalse(help.isZeroAddress(allOrganizations[1]));
      assert.equal(await newFactory.methods.createdOrganizationsIndex(allOrganizations[0]).call(), 1);
      assert.equal(await newFactory.methods.createdOrganizationsIndex(allOrganizations[1]).call(), 2);
      assert.equal(await (await OrganizationInterface.at(allOrganizations[0])).methods.getOrgJsonUri().call(), 'orgJsonUri');
      assert.equal(await (await OrganizationInterface.at(allOrganizations[1])).methods.getOrgJsonUri().call(), 'orgJsonUri2');
      assert.equal(await (await OrganizationUpgradeabilityTest.at(allOrganizations[1])).methods.newFunction().call(), 100);
      assert.equal(await newFactory.methods.newFunction().call(), 100);
    });
  });

  describe('transferOwnership', async () => {
    it('should transfer ownership', async () => {
      await organizationFactory.methods.transferOwnership(nonOwnerAccount).send({ from: organizationFactoryOwner });
      assert.equal(await organizationFactory.methods.owner().call(), nonOwnerAccount);
      await organizationFactory.methods.transferOwnership(organizationFactoryOwner).send({ from: nonOwnerAccount });
    });

    it('should not transfer ownership when initiated from a non-owner', async () => {
      try {
        await organizationFactory.methods.transferOwnership(tokenAddress).send({ from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should not transfer ownership to zero address', async () => {
      try {
        await organizationFactory.methods.transferOwnership(help.zeroAddress).send({ from: organizationFactoryOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('owner', async () => {
    it('should report current owner', async () => {
      const owner = await organizationFactory.methods.owner().call();
      assert.equal(owner, organizationFactoryOwner);
    });
  });

  describe('getCreatedOrganizationsLength', () => {
    it('should count organizations properly', async () => {
      // length is a bignumber
      let length = await abstractOrganizationFactory.getCreatedOrganizationsLength();
      // We start with empty address on the zero organizationFactory
      assert.equal(length, 1);
      await abstractOrganizationFactory.create('aaa', { from: organizationAccount });
      length = await abstractOrganizationFactory.getCreatedOrganizationsLength();
      assert.equal(length, 2);
      await abstractOrganizationFactory.create('bbb', { from: organizationAccount });
      length = await abstractOrganizationFactory.getCreatedOrganizationsLength();
      assert.equal(length, 3);
    });
  });

  describe('getCreatedOrganizations', () => {
    it('should return organizations properly', async () => {
      assert.equal(help.filterZeroAddresses(await abstractOrganizationFactory.getCreatedOrganizations()).length, 0);
      await abstractOrganizationFactory.create('aaa', { from: organizationAccount });
      assert.equal(help.filterZeroAddresses(await abstractOrganizationFactory.getCreatedOrganizations()).length, 1);
      await abstractOrganizationFactory.create('bbb', { from: organizationAccount });
      assert.equal(help.filterZeroAddresses(await abstractOrganizationFactory.getCreatedOrganizations()).length, 2);
    });
  });

  describe('create', () => {
    it('should create an Organization contract', async () => {
      // First emulate the transaction, then actually run it
      const address = await abstractOrganizationFactory.create.call('orgJsonUri');
      const receipt = await abstractOrganizationFactory.create('orgJsonUri', { from: organizationAccount });
      const organization = await OrganizationInterface.at(address);
      const info = await help.getOrganizationInfo(organization);
      assert.equal(info.owner, organizationAccount);
      assert.equal(info.orgJsonUri, 'orgJsonUri');
      assert.equal(receipt.logs.length, 2);
      assert.equal(receipt.logs[0].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[0].args[0], help.zeroAddress);
      assert.equal(receipt.logs[0].args[1], organizationAccount);
      assert.equal(receipt.logs[1].event, 'OrganizationCreated');
      assert.equal(receipt.logs[1].args.organization, address);
    });

    it('should add the organization into createdOrganizations', async () => {
      await abstractOrganizationFactory.create('orgJsonUri', { from: organizationAccount });
      const orgList = await abstractOrganizationFactory.getCreatedOrganizations();
      assert.equal(help.filterZeroAddresses(orgList).length, 1);
    });

    it('should not create an organization with empty orgJsonUri', async () => {
      try {
        await abstractOrganizationFactory.create('', { from: organizationAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should set the proxy admin to factory owner', async () => {
      const address = await abstractOrganizationFactory.create.call('orgJsonUri');
      await abstractOrganizationFactory.create('orgJsonUri', { from: organizationAccount });
      const organization = await AdminUpgradeabilityProxy.at(address);
      assert.equal(await organization.methods.admin().call({ from: organizationFactoryOwner }), organizationFactoryOwner);
      await organization.methods.changeAdmin(nonOwnerAccount).send({ from: organizationFactoryOwner });
      assert.equal(await organization.methods.admin().call({ from: nonOwnerAccount }), nonOwnerAccount);
    });
  });

  describe('createAndAddToDirectory', () => {
    it('should create and add an organization to a selected directory', async () => {
      // First emulate the transaction, then actually run it
      const address = await abstractOrganizationFactory.createAndAddToDirectory.call('orgJsonUri', abstractDirectory.address);
      const receipt = await abstractOrganizationFactory.createAndAddToDirectory('orgJsonUri', abstractDirectory.address, { from: organizationAccount });
      const organization = await OrganizationInterface.at(address);
      const info = await help.getOrganizationInfo(organization);
      assert.equal(info.owner, organizationAccount);
      assert.equal(info.orgJsonUri, 'orgJsonUri');
      assert.equal(receipt.logs.length, 3);
      assert.equal(receipt.logs[0].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[0].args[0], help.zeroAddress);
      assert.equal(receipt.logs[0].args[1], abstractOrganizationFactory.address);
      assert.equal(receipt.logs[1].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[1].args[0], abstractOrganizationFactory.address);
      assert.equal(receipt.logs[1].args[1], organizationAccount);
      assert.equal(receipt.logs[2].event, 'OrganizationCreated');
      assert.equal(receipt.logs[2].args.organization, address);
    });

    it('should throw when trying to add to a zero address directory', async () => {
      try {
        await abstractOrganizationFactory.createAndAddToDirectory('orgJsonUri', help.zeroAddress, { from: organizationAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw when trying to add to an address with no directory', async () => {
      try {
        await abstractOrganizationFactory.createAndAddToDirectory('orgJsonUri', abstractOrganizationFactory.address, { from: organizationAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });
});

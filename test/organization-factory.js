const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');
const assert = require('chai').assert;
const Web3Accounts = require('web3-eth-accounts');
const help = require('./helpers/index.js');
const TestHelper = require('./helpers/zostest');
const upgradeOrganizationsScript = require('../management/upgrade-organizations.js');

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
      await organizationFactory.methods.create('orgJsonUri', '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99').send({ from: organizationAccount });
      // upgrade directory
      const upgradedDirectory = await OrganizationFactoryUpgradeabilityTest.new({ from: organizationFactoryOwner });
      await project.proxyAdmin.upgradeProxy(organizationFactoryProxy.address, upgradedDirectory.address, OrganizationFactoryUpgradeabilityTest);
      const newFactory = await OrganizationFactoryUpgradeabilityTest.at(organizationFactoryProxy.address);
      // add new organization
      await newFactory.methods.create('orgJsonUri2', '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c98').send({ from: organizationAccount });
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
      assert.equal(await (await OrganizationInterface.at(allOrganizations[0])).methods.getOrgJsonHash().call(), '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99');
      assert.equal(await (await OrganizationInterface.at(allOrganizations[1])).methods.getOrgJsonHash().call(), '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c98');
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
      await abstractOrganizationFactory.create('aaa', '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99', { from: organizationAccount });
      length = await abstractOrganizationFactory.getCreatedOrganizationsLength();
      assert.equal(length, 2);
      await abstractOrganizationFactory.create('bbb', '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99', { from: organizationAccount });
      length = await abstractOrganizationFactory.getCreatedOrganizationsLength();
      assert.equal(length, 3);
    });
  });

  describe('getCreatedOrganizations', () => {
    it('should return organizations properly', async () => {
      assert.equal(help.filterZeroAddresses(await abstractOrganizationFactory.getCreatedOrganizations()).length, 0);
      await abstractOrganizationFactory.create('aaa', '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99', { from: organizationAccount });
      assert.equal(help.filterZeroAddresses(await abstractOrganizationFactory.getCreatedOrganizations()).length, 1);
      await abstractOrganizationFactory.create('bbb', '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99', { from: organizationAccount });
      assert.equal(help.filterZeroAddresses(await abstractOrganizationFactory.getCreatedOrganizations()).length, 2);
    });
  });

  describe('create', () => {
    it('should create an Organization contract', async () => {
      // First emulate the transaction, then actually run it
      const address = await abstractOrganizationFactory.create.call('orgJsonUri', '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99');
      const receipt = await abstractOrganizationFactory.create('orgJsonUri', '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99', { from: organizationAccount });
      const organization = await OrganizationInterface.at(address);
      const info = await help.getOrganizationInfo(organization);
      assert.equal(info.owner, organizationAccount);
      assert.equal(info.orgJsonUri, 'orgJsonUri');
      assert.equal(info.orgJsonHash, '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99');
      assert.equal(receipt.logs.length, 2);
      assert.equal(receipt.logs[0].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[0].args[0], help.zeroAddress);
      assert.equal(receipt.logs[0].args[1], organizationAccount);
      assert.equal(receipt.logs[1].event, 'OrganizationCreated');
      assert.equal(receipt.logs[1].args.organization, address);
    });

    it('should add the organization into createdOrganizations', async () => {
      await abstractOrganizationFactory.create('orgJsonUri', '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99', { from: organizationAccount });
      const orgList = await abstractOrganizationFactory.getCreatedOrganizations();
      assert.equal(help.filterZeroAddresses(orgList).length, 1);
    });

    it('should not create an organization with empty orgJsonUri', async () => {
      try {
        await abstractOrganizationFactory.create('', '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99', { from: organizationAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should not create an organization with empty orgJsonHash', async () => {
      try {
        await abstractOrganizationFactory.create('orgJsonUri', '0x0000000000000000000000000000000000000000000000000000000000000000', { from: organizationAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should set the proxy admin to factory owner', async () => {
      const address = await abstractOrganizationFactory.create.call('orgJsonUri', '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99');
      await abstractOrganizationFactory.create('orgJsonUri', '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99', { from: organizationAccount });
      const organization = await AdminUpgradeabilityProxy.at(address);
      assert.equal(await organization.methods.admin().call({ from: organizationFactoryOwner }), organizationFactoryOwner);
      await organization.methods.changeAdmin(nonOwnerAccount).send({ from: organizationFactoryOwner });
      assert.equal(await organization.methods.admin().call({ from: nonOwnerAccount }), nonOwnerAccount);
    });
  });

  describe('createAndAddToDirectory', () => {
    it('should create and add an organization to a selected directory', async () => {
      // First emulate the transaction, then actually run it
      const address = await abstractOrganizationFactory.createAndAddToDirectory.call('orgJsonUri', '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99', abstractDirectory.address);
      const receipt = await abstractOrganizationFactory.createAndAddToDirectory('orgJsonUri', '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99', abstractDirectory.address, { from: organizationAccount });
      const organization = await OrganizationInterface.at(address);
      const info = await help.getOrganizationInfo(organization);
      assert.equal(info.owner, organizationAccount);
      assert.equal(info.orgJsonUri, 'orgJsonUri');
      assert.equal(info.orgJsonHash, '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99');
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
        await abstractOrganizationFactory.createAndAddToDirectory('orgJsonUri', '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99', help.zeroAddress, { from: organizationAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw when trying to add to an address with no directory', async () => {
      try {
        await abstractOrganizationFactory.createAndAddToDirectory('orgJsonUri', '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99', abstractOrganizationFactory.address, { from: organizationAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('upgrade-organizations.js', () => {
    let factoryOwnerAccount, organizations, origImplementation, nonOwnedOrganization, newImplementation;

    beforeEach(async () => {
      const Accounts = new Web3Accounts(web3.currentProvider);
      await abstractOrganizationFactory.create('orgJsonUri0', '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99', { from: organizationAccount });
      await abstractOrganizationFactory.create('orgJsonUri1', '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99', { from: organizationAccount });
      await abstractOrganizationFactory.create('orgJsonUri2', '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99', { from: organizationAccount });
      nonOwnedOrganization = await abstractOrganizationFactory.create.call('orgJsonUri3', '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99');
      await abstractOrganizationFactory.create('orgJsonUri3', '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99', { from: organizationAccount });
      await abstractOrganizationFactory.create('orgJsonUri4', '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99', { from: organizationAccount });
      await abstractOrganizationFactory.create('orgJsonUri5', '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99', { from: organizationAccount });
      const organization = await AdminUpgradeabilityProxy.at(nonOwnedOrganization);
      origImplementation = await organization.methods.implementation().call({ from: organizationFactoryOwner });
      await organization.methods.changeAdmin(nonOwnerAccount).send({ from: organizationFactoryOwner });
      factoryOwnerAccount = Accounts.privateKeyToAccount('0xed095a912033d26dc444d2675b33414f0561af170d58c33f394db8812c87a764');
      organizations = await abstractOrganizationFactory.getCreatedOrganizations.call();
      const upgradedOrganization = await OrganizationUpgradeabilityTest.new({ from: organizationFactoryOwner });
      newImplementation = upgradedOrganization.address;
    });

    it('should change implementation of created organizations', async () => {
      await upgradeOrganizationsScript.upgradeOrganizations(
        web3.currentProvider,
        factoryOwnerAccount,
        organizationFactory.address,
        newImplementation,
        1, 5
      );
      for (const organization of organizations.slice(1, 5)) {
        if (help.isZeroAddress(organization)) {
          continue;
        }
        const orgProxy = await AdminUpgradeabilityProxy.at(organization);
        if (organization !== nonOwnedOrganization) {
          assert.equal(await orgProxy.methods.implementation().call({ from: organizationFactoryOwner }), newImplementation);
          const org = await OrganizationInterface.at(organization);
          assert.equal(await org.methods.supportsInterface('0x1b28d63e').call({ from: tokenAddress }), true);
        } else {
          assert.equal(await orgProxy.methods.implementation().call({ from: nonOwnerAccount }), origImplementation);
        }
      }
    });

    it('should fail when called from a non-owner account', async () => {
      try {
        const Accounts = new Web3Accounts(web3.currentProvider);
        await upgradeOrganizationsScript.upgradeOrganizations(
          web3.currentProvider,
          Accounts.privateKeyToAccount('0xf809d1a2969bec37e7c14628717092befa82156fb2ebf935ac5420bc522f0d29'),
          organizationFactory.address
        );
      } catch (e) {
        assert.match(e.message, /cannot work on organizationfactory/i);
      }
    });

    it('should not fail on zero address organization', async () => {
      await upgradeOrganizationsScript.upgradeOrganizations(
        web3.currentProvider,
        factoryOwnerAccount,
        organizationFactory.address,
        newImplementation,
        0, 1
      );
      assert(true);
    });

    it('should start at given index and respect passed limit', async () => {
      await upgradeOrganizationsScript.upgradeOrganizations(
        web3.currentProvider,
        factoryOwnerAccount,
        organizationFactory.address,
        newImplementation,
        3, 3
      );
      assert.equal(await (await AdminUpgradeabilityProxy.at(organizations[1])).methods.implementation().call({ from: organizationFactoryOwner }), origImplementation);
      assert.equal(await (await AdminUpgradeabilityProxy.at(organizations[2])).methods.implementation().call({ from: organizationFactoryOwner }), origImplementation);
      assert.equal(await (await AdminUpgradeabilityProxy.at(organizations[3])).methods.implementation().call({ from: organizationFactoryOwner }), newImplementation);
      assert.equal(await (await AdminUpgradeabilityProxy.at(organizations[4])).methods.implementation().call({ from: nonOwnerAccount }), origImplementation);
      assert.equal(await (await AdminUpgradeabilityProxy.at(organizations[5])).methods.implementation().call({ from: organizationFactoryOwner }), newImplementation);
      assert.equal(await (await AdminUpgradeabilityProxy.at(organizations[6])).methods.implementation().call({ from: organizationFactoryOwner }), origImplementation);
    });
  });
});

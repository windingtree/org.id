const { TestHelper } = require('zos');
const { Contracts, ZWeb3 } = require('zos-lib');
const assert = require('chai').assert;
const help = require('./helpers/index.js');

ZWeb3.initialize(web3.currentProvider);
// workaround for https://github.com/zeppelinos/zos/issues/704
Contracts.setArtifactsDefaults({
  gas: 60000000,
});

const OrganizationInterface = artifacts.require('OrganizationInterface');
const Organization = artifacts.require('Organization');
const CustomOrganizationTest = artifacts.require('CustomOrganizationTest');
const OrganizationUpgradeabilityTest = Contracts.getFromLocal('OrganizationUpgradeabilityTest');
const SegmentDirectory = Contracts.getFromLocal('SegmentDirectory');
const SegmentDirectoryUpgradeabilityTest = Contracts.getFromLocal('SegmentDirectoryUpgradeabilityTest');

contract('SegmentDirectory', (accounts) => {
  const segmentDirectoryOwner = accounts[1];
  const organizationAccount = accounts[3];
  const nonOwnerAccount = accounts[4];
  const tokenAddress = accounts[5];

  let segmentDirectoryProxy;
  let segmentDirectory;
  let project;

  beforeEach(async () => {
    project = await TestHelper();
    segmentDirectoryProxy = await project.createProxy(SegmentDirectory, {
      from: segmentDirectoryOwner,
      initFunction: 'initialize',
      initArgs: [segmentDirectoryOwner, tokenAddress],
    });
    segmentDirectory = await SegmentDirectory.at(segmentDirectoryProxy.address);
  });

  describe('initialize', () => {
    it('should not allow zero address owner', async () => {
      try {
        const segmentDirectory = await SegmentDirectory.new({ from: segmentDirectoryOwner });
        await segmentDirectory.methods.initialize(help.zeroAddress, tokenAddress).send({ from: segmentDirectoryOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should set liftoken', async () => {
      const segmentDirectory = await SegmentDirectory.new({ from: segmentDirectoryOwner });
      await segmentDirectory.methods.initialize(segmentDirectoryOwner, tokenAddress).send({ from: segmentDirectoryOwner });
      const testSegmentDirectory = await SegmentDirectory.at(segmentDirectory.address);
      assert.equal(await testSegmentDirectory.methods.LifToken().call(), tokenAddress);
    });
  });

  describe('upgradeability', () => {
    it('should upgrade SegmentDirectory and have new functions in directory and Organization contracts', async () => {
      // add old organization
      await segmentDirectory.methods.createAndAdd('dataUri').send({ from: organizationAccount });
      // upgrade directory
      const upgradedDirectory = await SegmentDirectoryUpgradeabilityTest.new({ from: segmentDirectoryOwner });
      await project.proxyAdmin.upgradeProxy(segmentDirectoryProxy.address, upgradedDirectory.address, SegmentDirectoryUpgradeabilityTest);
      const newDirectory = await SegmentDirectoryUpgradeabilityTest.at(segmentDirectoryProxy.address);
      // add new organization
      await newDirectory.methods.createAndAdd('dataUri2').send({ from: organizationAccount });
      const allOrganizations = help.filterZeroAddresses(await newDirectory.methods.getOrganizations().call());
      // test values
      assert.isDefined(await newDirectory.methods.organizations(1).call());
      assert.isDefined(await newDirectory.methods.organizations(2).call());
      assert.isFalse(help.isZeroAddress(allOrganizations[0]));
      assert.isFalse(help.isZeroAddress(allOrganizations[1]));
      assert.equal(await newDirectory.methods.organizationsIndex(allOrganizations[0]).call(), 1);
      assert.equal(await newDirectory.methods.organizationsIndex(allOrganizations[1]).call(), 2);
      assert.equal(await (await Organization.at(allOrganizations[0])).dataUri(), 'dataUri');
      assert.equal(await (await Organization.at(allOrganizations[1])).dataUri(), 'dataUri2');
      assert.equal(await (await OrganizationUpgradeabilityTest.at(allOrganizations[1])).methods.newFunction().call(), 100);
      assert.equal(await newDirectory.methods.newFunction().call(), 100);
    });
  });

  describe('transferOwnership', async () => {
    it('should transfer ownership', async () => {
      await segmentDirectory.methods.transferOwnership(nonOwnerAccount).send({ from: segmentDirectoryOwner });
      assert.equal(await segmentDirectory.methods.owner().call(), nonOwnerAccount);
      await segmentDirectory.methods.transferOwnership(segmentDirectoryOwner).send({ from: nonOwnerAccount });
    });

    it('should not transfer ownership when initiated from a non-owner', async () => {
      try {
        await segmentDirectory.methods.transferOwnership(tokenAddress).send({ from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should not transfer ownership to zero address', async () => {
      try {
        await segmentDirectory.methods.transferOwnership(help.zeroAddress).send({ from: segmentDirectoryOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('owner', async () => {
    it('should report current owner', async () => {
      const owner = await segmentDirectory.methods.owner().call();
      assert.equal(owner, segmentDirectoryOwner);
    });
  });

  describe('setLifToken', () => {
    it('should set the LifToken address', async () => {
      await segmentDirectory.methods.setLifToken(tokenAddress).send({ from: segmentDirectoryOwner });
      const setValue = await segmentDirectory.methods.LifToken().call();
      assert.equal(setValue, tokenAddress);
    });

    it('should throw if non-owner sets the LifToken address', async () => {
      try {
        await segmentDirectory.methods.setLifToken(tokenAddress).send({ from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('getOrganizationsLength', () => {
    it('should count organizations properly', async () => {
      // length is a bignumber
      let length = await segmentDirectory.methods.getOrganizationsLength().call();
      // We start with empty address on the zero segmentDirectory
      assert.equal(length, 1);
      await segmentDirectory.methods.createAndAdd('aaa').send({ from: organizationAccount });
      length = await segmentDirectory.methods.getOrganizationsLength().call();
      assert.equal(length, 2);
      const receipt = await segmentDirectory.methods.createAndAdd('bbb').send({ from: organizationAccount });
      length = await segmentDirectory.methods.getOrganizationsLength().call();
      assert.equal(length, 3);
      const expectedOrganizationAddress = receipt.events.OrganizationCreated.returnValues.organization;
      await segmentDirectory.methods.remove(expectedOrganizationAddress).send({ from: organizationAccount });
      length = await segmentDirectory.methods.getOrganizationsLength().call();
      // length counts zero addresses
      assert.equal(length, 3);
    });
  });

  describe('getOrganizations', () => {
    it('should return organizations properly', async () => {
      assert.equal(help.filterZeroAddresses(await segmentDirectory.methods.getOrganizations().call()).length, 0);
      const receipt = await segmentDirectory.methods.createAndAdd('aaa').send({ from: organizationAccount });
      const expectedOrganizationAddress = receipt.events.OrganizationCreated.returnValues.organization;
      assert.equal(help.filterZeroAddresses(await segmentDirectory.methods.getOrganizations().call()).length, 1);
      await segmentDirectory.methods.createAndAdd('bbb').send({ from: organizationAccount });
      assert.equal(help.filterZeroAddresses(await segmentDirectory.methods.getOrganizations().call()).length, 2);
      await segmentDirectory.methods.remove(expectedOrganizationAddress).send({ from: organizationAccount });
      assert.equal(help.filterZeroAddresses(await segmentDirectory.methods.getOrganizations().call()).length, 1);
    });
  });

  describe('create', () => {
    it('should create an Organization contract', async () => {
      // First emulate the transaction, then actually run it
      const address = await segmentDirectory.methods.create('dataUri').call({ from: organizationAccount });
      const receipt = await segmentDirectory.methods.create('dataUri').send({ from: organizationAccount });
      const organization = await Organization.at(address);
      const info = await help.getOrganizationInfo(organization);
      assert.equal(info.owner, organizationAccount);
      assert.equal(info.dataUri, 'dataUri');
      assert.isDefined(receipt.events.OwnershipTransferred);
      assert.isDefined(receipt.events.OrganizationCreated);
      assert.equal(receipt.events.OwnershipTransferred.length, 2);
      assert.equal(receipt.events.OwnershipTransferred[0].returnValues.previousOwner, help.zeroAddress);
      assert.equal(receipt.events.OwnershipTransferred[0].returnValues.newOwner, segmentDirectory.address);
      assert.equal(receipt.events.OwnershipTransferred[1].returnValues.previousOwner, segmentDirectory.address);
      assert.equal(receipt.events.OwnershipTransferred[1].returnValues.newOwner, organizationAccount);
      assert.equal(receipt.events.OrganizationCreated.returnValues.organization, address);
    });

    it('should not add the organization into any mapping', async () => {
      await segmentDirectory.methods.create('dataUri').send({ from: organizationAccount });
      const orgList = await segmentDirectory.methods.getOrganizations().call();
      assert.equal(help.filterZeroAddresses(orgList).length, 0);
    });

    it('should not create an organization with empty dataUri', async () => {
      try {
        await segmentDirectory.methods.create('').send({ from: organizationAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('add', () => {
    let organization;
    beforeEach(async () => {
      organization = await Organization.new('dataUri', { from: organizationAccount });
    });

    it('should add the organization to the registry', async () => {
      const receipt = await segmentDirectory.methods.add(organization.address).send({ from: organizationAccount });
      assert.equal(receipt.events.OrganizationAdded.returnValues.organization, organization.address);
      assert.equal(receipt.events.OrganizationAdded.returnValues.index, 1);

      const allOrganizations = await help.jsArrayFromSolidityArray(
        segmentDirectory.methods.organizations,
        await segmentDirectory.methods.getOrganizationsLength().call(),
        help.isZeroAddress
      );
      const actualIndexPos = await segmentDirectory.methods.organizationsIndex(allOrganizations[0]).call();
      assert.isDefined(allOrganizations[0]);
      assert.isFalse(help.isZeroAddress(allOrganizations[0]));
      assert.equal(actualIndexPos, 1);
    });

    it('should throw if adding an already added organization', async () => {
      await segmentDirectory.methods.add(organization.address).send({ from: organizationAccount });
      try {
        await segmentDirectory.methods.add(organization.address).send({ from: organizationAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if adding organization on a zero address', async () => {
      try {
        await segmentDirectory.methods.add(help.zeroAddress).send({ from: organizationAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if somebody is adding organization which she does not own', async () => {
      try {
        await segmentDirectory.methods.add(organization.address).send({ from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should not add an Organization that does not support OrganizationInterface', async () => {
      try {
        await segmentDirectory.methods.add(nonOwnerAccount).send({ from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should add a custom organization contract', async () => {
      const customOrg = await CustomOrganizationTest.new({ from: organizationAccount });
      const receipt = await segmentDirectory.methods.add(customOrg.address).send({ from: organizationAccount });
      assert.equal(receipt.events.OrganizationAdded.returnValues.organization, customOrg.address);
      assert.equal(receipt.events.OrganizationAdded.returnValues.index, 1);

      const allOrganizations = await help.jsArrayFromSolidityArray(
        segmentDirectory.methods.organizations,
        await segmentDirectory.methods.getOrganizationsLength().call(),
        help.isZeroAddress
      );
      const actualIndexPos = await segmentDirectory.methods.organizationsIndex(allOrganizations[0]).call();
      const organization = allOrganizations[0];
      assert.isDefined(organization);
      assert.isFalse(help.isZeroAddress(organization));
      assert.equal(actualIndexPos, 1);
      const org = await OrganizationInterface.at(customOrg.address);
      assert.equal(await org.getDataUri(), 'https://super-sweet-custom-organization.com');
    });
  });

  describe('createAndAdd', () => {
    it('should create and add the organization to the registry', async () => {
      const address = await segmentDirectory.methods.createAndAdd('dataUri').call({ from: organizationAccount });
      const receipt = await segmentDirectory.methods.createAndAdd('dataUri').send({ from: organizationAccount });
      const organization = await Organization.at(address);

      assert.isDefined(receipt.events.OwnershipTransferred);
      assert.isDefined(receipt.events.OrganizationCreated);
      assert.equal(receipt.events.OwnershipTransferred.length, 2);
      assert.equal(receipt.events.OwnershipTransferred[0].returnValues.previousOwner, help.zeroAddress);
      assert.equal(receipt.events.OwnershipTransferred[0].returnValues.newOwner, segmentDirectory.address);
      assert.equal(receipt.events.OwnershipTransferred[1].returnValues.previousOwner, segmentDirectory.address);
      assert.equal(receipt.events.OwnershipTransferred[1].returnValues.newOwner, organizationAccount);
      assert.equal(receipt.events.OrganizationCreated.returnValues.organization, organization.address);
      assert.equal(receipt.events.OrganizationAdded.returnValues.organization, organization.address);
      assert.equal(receipt.events.OrganizationAdded.returnValues.index, 1);

      const info = await help.getOrganizationInfo(organization);
      assert.equal(info.owner, organizationAccount);
      assert.equal(info.dataUri, 'dataUri');
      const allOrganizations = await help.jsArrayFromSolidityArray(
        segmentDirectory.methods.organizations,
        await segmentDirectory.methods.getOrganizationsLength().call(),
        help.isZeroAddress
      );
      const actualIndexPos = await segmentDirectory.methods.organizationsIndex(allOrganizations[0]).call();
      assert.isDefined(allOrganizations[0]);
      assert.isFalse(help.isZeroAddress(allOrganizations[0]));
      assert.equal(actualIndexPos, 1);
    });
  });

  describe('remove', () => {
    let organization;
    beforeEach(async () => {
      const receipt = await segmentDirectory.methods.createAndAdd('aaa').send({ from: organizationAccount });
      organization = await Organization.at(receipt.events.OrganizationCreated.returnValues.organization);
    });

    it('should remove organization from the directory', async () => {
      const receipt = await segmentDirectory.methods.remove(organization.address).send({ from: organizationAccount });
      const allOrganizations = await help.jsArrayFromSolidityArray(
        segmentDirectory.methods.organizations,
        await segmentDirectory.methods.getOrganizationsLength().call(),
        help.isZeroAddress
      );
      assert.equal(allOrganizations.length, 0);
      assert.isUndefined(allOrganizations[0]);
      assert.isDefined(receipt.events.OrganizationRemoved);
      assert.equal(receipt.events.OrganizationRemoved.returnValues.organization, organization.address);
    });

    it('should not destroy the organization contract', async () => {
      await segmentDirectory.methods.remove(organization.address).send({ from: organizationAccount });
      const code = await help.promisify(cb => web3.eth.getCode(organization.address, cb));
      assert.isAtLeast(code.length, 4);
    });

    it('should throw if somebody is removing organization which she does not own', async () => {
      try {
        await organization.transferOwnership(nonOwnerAccount, { from: organizationAccount });
        await segmentDirectory.methods.remove(organization.address).send({ from: organizationAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if organization is not added', async () => {
      try {
        await segmentDirectory.methods.remove(nonOwnerAccount).send({ from: organizationAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if organization is on zero address', async () => {
      try {
        await segmentDirectory.methods.remove(help.zeroAddress).send({ from: organizationAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if organization non-owner initiates the removing', async () => {
      try {
        await segmentDirectory.methods.remove(organization.address).send({ from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });
});

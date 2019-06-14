const { Contracts, ZWeb3 } = require('zos-lib');
const assert = require('chai').assert;
const help = require('./helpers/index.js');
const TestHelper = require('./helpers/zostest');

ZWeb3.initialize(web3.currentProvider);
// workaround for https://github.com/zeppelinos/zos/issues/704
Contracts.setArtifactsDefaults({
  gas: 60000000,
});

const Organization = Contracts.getFromLocal('Organization');
const OrganizationInterface = artifacts.require('OrganizationInterface');
const SegmentDirectory = Contracts.getFromLocal('SegmentDirectory');
const SegmentDirectoryUpgradeabilityTest = Contracts.getFromLocal('SegmentDirectoryUpgradeabilityTest');
const CustomOrganizationTest = artifacts.require('CustomOrganizationTest');
const OrganizationUpgradeabilityTest = Contracts.getFromLocal('OrganizationUpgradeabilityTest');
const AbstractSegmentDirectory = artifacts.require('AbstractSegmentDirectory');

contract('SegmentDirectory', (accounts) => {
  const segmentDirectoryOwner = accounts[1];
  const organizationAccount = accounts[2];
  const nonOwnerAccount = accounts[3];
  const tokenAddress = accounts[4];

  let segmentDirectoryProxy;
  let segmentDirectory;
  let abstractSegmentDirectory;
  let project;

  beforeEach(async () => {
    project = await TestHelper();
    segmentDirectoryProxy = await project.createProxy(SegmentDirectory, {
      from: segmentDirectoryOwner,
      initFunction: 'initialize',
      initArgs: [segmentDirectoryOwner, 'foodtrucks', tokenAddress, project.app.address],
    });
    segmentDirectory = await SegmentDirectory.at(segmentDirectoryProxy.address);
    abstractSegmentDirectory = await AbstractSegmentDirectory.at(segmentDirectoryProxy.address);
  });

  describe('initialize', () => {
    it('should not allow zero address owner', async () => {
      try {
        const segmentDirectory = await SegmentDirectory.new({ from: segmentDirectoryOwner });
        await segmentDirectory.methods.initialize(help.zeroAddress, 'foodtrucks', tokenAddress, project.app.address).send({ from: segmentDirectoryOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should set liftoken and segment', async () => {
      const segmentDirectory = await SegmentDirectory.new({ from: segmentDirectoryOwner });
      await segmentDirectory.methods.initialize(segmentDirectoryOwner, 'foodtrucks', tokenAddress, project.app.address).send({ from: segmentDirectoryOwner });
      assert.equal(await segmentDirectory.methods.getLifToken().call(), tokenAddress);
      assert.equal(await segmentDirectory.methods.getSegment().call(), 'foodtrucks');
    });
  });

  describe('upgradeability', () => {
    it('should upgrade SegmentDirectory and have new functions in directory and Organization contracts', async () => {
      // add old organization
      await segmentDirectory.methods.createAndAdd('orgJsonUri').send({ from: organizationAccount });
      // upgrade directory
      const upgradedDirectory = await SegmentDirectoryUpgradeabilityTest.new({ from: segmentDirectoryOwner });
      await project.proxyAdmin.upgradeProxy(segmentDirectoryProxy.address, upgradedDirectory.address, SegmentDirectoryUpgradeabilityTest);
      const newDirectory = await SegmentDirectoryUpgradeabilityTest.at(segmentDirectoryProxy.address);
      // add new organization
      await newDirectory.methods.createAndAdd('orgJsonUri2').send({ from: organizationAccount });
      const allOrganizations = help.filterZeroAddresses(await newDirectory.methods.getOrganizations().call());
      // test values
      assert.isDefined(await newDirectory.methods.organizations(1).call());
      assert.isDefined(await newDirectory.methods.organizations(2).call());
      assert.isFalse(help.isZeroAddress(allOrganizations[0]));
      assert.isFalse(help.isZeroAddress(allOrganizations[1]));
      assert.equal(await newDirectory.methods.organizationsIndex(allOrganizations[0]).call(), 1);
      assert.equal(await newDirectory.methods.organizationsIndex(allOrganizations[1]).call(), 2);
      assert.equal(await (await Organization.at(allOrganizations[0])).methods.getOrgJsonUri().call(), 'orgJsonUri');
      assert.equal(await (await Organization.at(allOrganizations[1])).methods.getOrgJsonUri().call(), 'orgJsonUri2');
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
      const setValue = await segmentDirectory.methods.getLifToken().call();
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

  describe('setSegment', () => {
    it('should set the segment', async () => {
      await segmentDirectory.methods.setSegment('hotels').send({ from: segmentDirectoryOwner });
      const setValue = await segmentDirectory.methods.getSegment().call();
      assert.equal(setValue, 'hotels');
    });

    it('should throw if non-owner sets segment', async () => {
      try {
        await segmentDirectory.methods.setSegment('hotels').send({ from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if segment is empty', async () => {
      try {
        await segmentDirectory.methods.setSegment('').send({ from: segmentDirectoryOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('getOrganizationsLength', () => {
    it('should count organizations properly', async () => {
      // length is a bignumber
      let length = await abstractSegmentDirectory.getOrganizationsLength();
      // We start with empty address on the zero segmentDirectory
      assert.equal(length, 1);
      await abstractSegmentDirectory.createAndAdd('aaa', { from: organizationAccount });
      length = await abstractSegmentDirectory.getOrganizationsLength();
      assert.equal(length, 2);
      const receipt = await abstractSegmentDirectory.createAndAdd('bbb', { from: organizationAccount });
      length = await abstractSegmentDirectory.getOrganizationsLength();
      assert.equal(length, 3);
      const expectedOrganizationAddress = receipt.logs[0].address;
      await abstractSegmentDirectory.remove(expectedOrganizationAddress, { from: organizationAccount });
      length = await abstractSegmentDirectory.getOrganizationsLength();
      // length counts zero addresses
      assert.equal(length, 3);
    });
  });

  describe('getOrganizations', () => {
    it('should return organizations properly', async () => {
      assert.equal(help.filterZeroAddresses(await abstractSegmentDirectory.getOrganizations()).length, 0);
      const receipt = await abstractSegmentDirectory.createAndAdd('aaa', { from: organizationAccount });
      const expectedOrganizationAddress = receipt.logs[0].address;
      assert.equal(help.filterZeroAddresses(await abstractSegmentDirectory.getOrganizations()).length, 1);
      await abstractSegmentDirectory.createAndAdd('bbb', { from: organizationAccount });
      assert.equal(help.filterZeroAddresses(await abstractSegmentDirectory.getOrganizations()).length, 2);
      await abstractSegmentDirectory.remove(expectedOrganizationAddress, { from: organizationAccount });
      assert.equal(help.filterZeroAddresses(await abstractSegmentDirectory.getOrganizations()).length, 1);
    });
  });

  describe('create', () => {
    it('should create an Organization contract', async () => {
      // First emulate the transaction, then actually run it
      const address = await abstractSegmentDirectory.create.call('orgJsonUri');
      const receipt = await abstractSegmentDirectory.create('orgJsonUri', { from: organizationAccount });
      const organization = await Organization.at(address);
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

    it('should not add the organization into any mapping', async () => {
      await abstractSegmentDirectory.create('orgJsonUri', { from: organizationAccount });
      const orgList = await abstractSegmentDirectory.getOrganizations();
      assert.equal(help.filterZeroAddresses(orgList).length, 0);
    });

    it('should not create an organization with empty orgJsonUri', async () => {
      try {
        await abstractSegmentDirectory.create('', { from: organizationAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('add', () => {
    let organizationProxy;
    let organization;

    beforeEach(async () => {
      organization = await Organization.new('dataUri', { from: organizationAccount });
      organizationProxy = await project.createProxy(Organization, {
        from: segmentDirectoryOwner,
        initFunction: 'initialize',
        initArgs: [organizationAccount, 'orgJsonUri'],
      });
      organization = await Organization.at(organizationProxy.address);
    });

    it('should add the organization to the registry', async () => {
      const receipt = await abstractSegmentDirectory.add(organization.address, { from: organizationAccount });
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'OrganizationAdded');
      assert.equal(receipt.logs[0].args.organization, organization.address);
      assert.equal(receipt.logs[0].args.index, 1);

      const allOrganizations = await help.jsArrayFromSolidityArray(
        abstractSegmentDirectory.organizations,
        await abstractSegmentDirectory.getOrganizationsLength(),
        help.isZeroAddress
      );
      const actualIndexPos = await abstractSegmentDirectory.organizationsIndex(allOrganizations[0]);
      assert.isDefined(allOrganizations[0]);
      assert.isFalse(help.isZeroAddress(allOrganizations[0]));
      assert.equal(actualIndexPos, 1);
    });

    it('should throw if adding an already added organization', async () => {
      await abstractSegmentDirectory.add(organization.address, { from: organizationAccount });
      try {
        await abstractSegmentDirectory.add(organization.address, { from: organizationAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if adding organization on a zero address', async () => {
      try {
        await abstractSegmentDirectory.add(help.zeroAddress, { from: organizationAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if somebody is adding organization which she does not own', async () => {
      try {
        await abstractSegmentDirectory.add(organization.address, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should not add an Organization that does not support OrganizationInterface', async () => {
      try {
        await abstractSegmentDirectory.add(nonOwnerAccount, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should add a custom organization contract', async () => {
      const customOrg = await CustomOrganizationTest.new({ from: organizationAccount });
      const receipt = await abstractSegmentDirectory.add(customOrg.address, { from: organizationAccount });
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'OrganizationAdded');
      assert.equal(receipt.logs[0].args.organization, customOrg.address);
      assert.equal(receipt.logs[0].args.index, 1);

      const allOrganizations = await help.jsArrayFromSolidityArray(
        abstractSegmentDirectory.organizations,
        await abstractSegmentDirectory.getOrganizationsLength(),
        help.isZeroAddress
      );
      const actualIndexPos = await abstractSegmentDirectory.organizationsIndex(allOrganizations[0]);
      const organization = allOrganizations[0];
      assert.isDefined(organization);
      assert.isFalse(help.isZeroAddress(organization));
      assert.equal(actualIndexPos, 1);
      const org = await OrganizationInterface.at(customOrg.address);
      assert.equal(await org.getOrgJsonUri(), 'https://super-sweet-custom-organization.com');
    });
  });

  describe('createAndAdd', () => {
    it('should create and add the organization to the registry', async () => {
      const address = await abstractSegmentDirectory.createAndAdd.call('orgJsonUri');
      const receipt = await abstractSegmentDirectory.createAndAdd('orgJsonUri', { from: organizationAccount });
      const organization = await Organization.at(address);
      assert.equal(receipt.logs.length, 3);
      assert.equal(receipt.logs[0].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[0].args[0], help.zeroAddress);
      assert.equal(receipt.logs[0].args[1], organizationAccount);
      assert.equal(receipt.logs[1].event, 'OrganizationCreated');
      assert.equal(receipt.logs[1].args.organization, organization.address);
      assert.equal(receipt.logs[2].event, 'OrganizationAdded');
      assert.equal(receipt.logs[2].args.organization, organization.address);
      assert.equal(receipt.logs[2].args.index, 1);
      const info = await help.getOrganizationInfo(organization);
      assert.equal(info.owner, organizationAccount);
      assert.equal(info.orgJsonUri, 'orgJsonUri');
      const allOrganizations = await help.jsArrayFromSolidityArray(
        abstractSegmentDirectory.organizations,
        await abstractSegmentDirectory.getOrganizationsLength(),
        help.isZeroAddress
      );
      const actualIndexPos = await abstractSegmentDirectory.organizationsIndex(allOrganizations[0]);
      assert.isDefined(allOrganizations[0]);
      assert.isFalse(help.isZeroAddress(allOrganizations[0]));
      assert.equal(actualIndexPos, 1);
    });
  });

  describe('remove', () => {
    let organization;
    beforeEach(async () => {
      const receipt = await abstractSegmentDirectory.createAndAdd('aaa', { from: organizationAccount });
      organization = await Organization.at(receipt.logs[2].args[0]);
    });

    it('should remove organization from the directory', async () => {
      const receipt = await abstractSegmentDirectory.remove(organization.address, { from: organizationAccount });
      const allOrganizations = await help.jsArrayFromSolidityArray(
        abstractSegmentDirectory.organizations,
        await abstractSegmentDirectory.getOrganizationsLength(),
        help.isZeroAddress
      );
      assert.equal(allOrganizations.length, 0);
      assert.isUndefined(allOrganizations[0]);
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'OrganizationRemoved');
      assert.equal(receipt.logs[0].args[0], organization.address);
    });

    it('should not destroy the organization contract', async () => {
      await abstractSegmentDirectory.remove(organization.address, { from: organizationAccount });
      const code = await help.promisify(cb => web3.eth.getCode(organization.address, cb));
      assert.isAtLeast(code.length, 4);
    });

    it('should throw if somebody is removing organization which she does not own', async () => {
      try {
        await organization.methods.transferOwnership(nonOwnerAccount).send({ from: organizationAccount });
        await abstractSegmentDirectory.remove(organization.address, { from: organizationAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if organization is not added', async () => {
      try {
        await abstractSegmentDirectory.remove(nonOwnerAccount, { from: organizationAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if organization is on zero address', async () => {
      try {
        await abstractSegmentDirectory.remove(help.zeroAddress, { from: organizationAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if organization non-owner initiates the removing', async () => {
      try {
        await abstractSegmentDirectory.remove(organization.address, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });
});

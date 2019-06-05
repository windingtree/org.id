const assert = require('chai').assert;
const help = require('./helpers/index.js');

const OrganizationInterface = artifacts.require('OrganizationInterface');
const Organization = artifacts.require('Organization');
const SegmentDirectory = artifacts.require('SegmentDirectory');
const CustomOrganizationTest = artifacts.require('CustomOrganizationTest');

contract('SegmentDirectory', (accounts) => {
  const segmentDirectoryOwner = accounts[1];
  const organizationAccount = accounts[3];
  const nonOwnerAccount = accounts[4];
  const tokenAddress = accounts[5];

  let testSegmentDirectory;
  let segmentDirectory;

  beforeEach(async () => {
    testSegmentDirectory = await SegmentDirectory.new();
    await testSegmentDirectory.initialize(segmentDirectoryOwner, tokenAddress);
    segmentDirectory = await SegmentDirectory.at(testSegmentDirectory.address);
  });

  describe('initialize', () => {
    it('should not allow zero address owner', async () => {
      try {
        testSegmentDirectory = await SegmentDirectory.new();
        await testSegmentDirectory.initialize(help.zeroAddress, tokenAddress);
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should set liftoken', async () => {
      testSegmentDirectory = await SegmentDirectory.new();
      await testSegmentDirectory.initialize(segmentDirectoryOwner, tokenAddress);
      segmentDirectory = await SegmentDirectory.at(testSegmentDirectory.address);
      assert.equal(await segmentDirectory.LifToken(), tokenAddress);
    });
  });

  describe('transferOwnership', async () => {
    it('should transfer ownership', async () => {
      await segmentDirectory.transferOwnership(nonOwnerAccount, { from: segmentDirectoryOwner });
      assert.equal(await segmentDirectory.owner(), nonOwnerAccount);
      await segmentDirectory.transferOwnership(segmentDirectoryOwner, { from: nonOwnerAccount });
    });

    it('should not transfer ownership when initiated from a non-owner', async () => {
      try {
        await segmentDirectory.transferOwnership(tokenAddress, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should not transfer ownership to zero address', async () => {
      try {
        await segmentDirectory.transferOwnership(help.zeroAddress, { from: segmentDirectoryOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('owner', async () => {
    it('should report current owner', async () => {
      const owner = await segmentDirectory.owner();
      assert.equal(owner, segmentDirectoryOwner);
    });
  });

  describe('setLifToken', () => {
    it('should set the LifToken address', async () => {
      await segmentDirectory.setLifToken(tokenAddress, { from: segmentDirectoryOwner });
      const setValue = await segmentDirectory.LifToken();
      assert.equal(setValue, tokenAddress);
    });

    it('should throw if non-owner sets the LifToken address', async () => {
      try {
        await segmentDirectory.setLifToken(tokenAddress, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('getOrganizationsLength', () => {
    it('should count organizations properly', async () => {
      // length is a bignumber
      let length = await segmentDirectory.getOrganizationsLength();
      // We start with empty address on the zero segmentDirectory
      assert.equal(length.toNumber(), 1);
      await testSegmentDirectory.createAndAdd('aaa', { from: organizationAccount });
      length = await segmentDirectory.getOrganizationsLength();
      assert.equal(length.toNumber(), 2);
      const receipt = await testSegmentDirectory.createAndAdd('bbb', { from: organizationAccount });
      length = await testSegmentDirectory.getOrganizationsLength();
      assert.equal(length.toNumber(), 3);
      const expectedOrganizationAddress = receipt.logs[0].address;
      await testSegmentDirectory.remove(expectedOrganizationAddress, { from: organizationAccount });
      length = await testSegmentDirectory.getOrganizationsLength();
      // length counts zero addresses
      assert.equal(length.toNumber(), 3);
    });
  });

  describe('getOrganizations', () => {
    it('should return organizations properly', async () => {
      assert.equal(help.filterZeroAddresses(await testSegmentDirectory.getOrganizations()).length, 0);
      const receipt = await testSegmentDirectory.createAndAdd('aaa', { from: organizationAccount });
      const expectedOrganizationAddress = receipt.logs[0].address;
      assert.equal(help.filterZeroAddresses(await testSegmentDirectory.getOrganizations()).length, 1);
      await testSegmentDirectory.createAndAdd('bbb', { from: organizationAccount });
      assert.equal(help.filterZeroAddresses(await testSegmentDirectory.getOrganizations()).length, 2);
      await testSegmentDirectory.remove(expectedOrganizationAddress, { from: organizationAccount });
      assert.equal(help.filterZeroAddresses(await testSegmentDirectory.getOrganizations()).length, 1);
    });
  });

  describe('create', () => {
    it('should create an Organization contract', async () => {
      // First emulate the transaction, then actually run it
      const address = await testSegmentDirectory.create.call('dataUri', { from: organizationAccount });
      const receipt = await testSegmentDirectory.create('dataUri', { from: organizationAccount });
      const organization = await Organization.at(address);
      const info = await help.getOrganizationInfo(organization);
      assert.equal(info.owner, organizationAccount);
      assert.equal(info.dataUri, 'dataUri');
      assert.equal(receipt.logs.length, 3);
      assert.equal(receipt.logs[0].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[0].args[0], help.zeroAddress);
      assert.equal(receipt.logs[0].args[1], testSegmentDirectory.address);
      assert.equal(receipt.logs[1].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[1].args[0], testSegmentDirectory.address);
      assert.equal(receipt.logs[1].args[1], organizationAccount);
      assert.equal(receipt.logs[2].event, 'OrganizationCreated');
      assert.equal(receipt.logs[2].args.organization, address);
    });

    it('should not add the organization into any mapping', async () => {
      await testSegmentDirectory.create('dataUri', { from: organizationAccount });
      const orgList = await segmentDirectory.getOrganizations();
      assert.equal(help.filterZeroAddresses(orgList).length, 0);
    });

    it('should not create an organization with empty dataUri', async () => {
      try {
        await testSegmentDirectory.create('', { from: organizationAccount });
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
      const receipt = await testSegmentDirectory.add(organization.address, { from: organizationAccount });
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'OrganizationAdded');
      assert.equal(receipt.logs[0].args.organization, organization.address);
      assert.equal(receipt.logs[0].args.index, 1);

      const allOrganizations = await help.jsArrayFromSolidityArray(
        segmentDirectory.organizations,
        await segmentDirectory.getOrganizationsLength(),
        help.isZeroAddress
      );
      const actualIndexPos = await segmentDirectory.organizationsIndex(allOrganizations[0]);
      assert.isDefined(allOrganizations[0]);
      assert.isFalse(help.isZeroAddress(allOrganizations[0]));
      assert.equal(actualIndexPos, 1);
    });

    it('should throw if adding an already added organization', async () => {
      await testSegmentDirectory.add(organization.address, { from: organizationAccount });
      try {
        await testSegmentDirectory.add(organization.address, { from: organizationAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if adding organization on a zero address', async () => {
      try {
        await testSegmentDirectory.add(help.zeroAddress, { from: organizationAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if somebody is adding organization which she does not own', async () => {
      try {
        await testSegmentDirectory.add(organization.address, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should not add an Organization that does not support OrganizationInterface', async () => {
      try {
        await testSegmentDirectory.add(nonOwnerAccount, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should add a custom organization contract', async () => {
      const customOrg = await CustomOrganizationTest.new({ from: organizationAccount });
      const receipt = await testSegmentDirectory.add(customOrg.address, { from: organizationAccount });
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'OrganizationAdded');
      assert.equal(receipt.logs[0].args.organization, customOrg.address);
      assert.equal(receipt.logs[0].args.index, 1);

      const allOrganizations = await help.jsArrayFromSolidityArray(
        segmentDirectory.organizations,
        await segmentDirectory.getOrganizationsLength(),
        help.isZeroAddress
      );
      const actualIndexPos = await segmentDirectory.organizationsIndex(allOrganizations[0]);
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
      const address = await testSegmentDirectory.createAndAdd.call('dataUri', { from: organizationAccount });
      const receipt = await testSegmentDirectory.createAndAdd('dataUri', { from: organizationAccount });
      const organization = await Organization.at(address);
      assert.equal(receipt.logs.length, 4);
      assert.equal(receipt.logs[0].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[0].args[0], help.zeroAddress);
      assert.equal(receipt.logs[0].args[1], testSegmentDirectory.address);
      assert.equal(receipt.logs[1].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[1].args[0], testSegmentDirectory.address);
      assert.equal(receipt.logs[1].args[1], organizationAccount);
      assert.equal(receipt.logs[2].event, 'OrganizationCreated');
      assert.equal(receipt.logs[2].args.organization, organization.address);
      assert.equal(receipt.logs[3].event, 'OrganizationAdded');
      assert.equal(receipt.logs[3].args.organization, organization.address);
      assert.equal(receipt.logs[3].args.index, 1);
      const info = await help.getOrganizationInfo(organization);
      assert.equal(info.owner, organizationAccount);
      assert.equal(info.dataUri, 'dataUri');
      const allOrganizations = await help.jsArrayFromSolidityArray(
        segmentDirectory.organizations,
        await segmentDirectory.getOrganizationsLength(),
        help.isZeroAddress
      );
      const actualIndexPos = await segmentDirectory.organizationsIndex(allOrganizations[0]);
      assert.isDefined(allOrganizations[0]);
      assert.isFalse(help.isZeroAddress(allOrganizations[0]));
      assert.equal(actualIndexPos, 1);
    });
  });

  describe('remove', () => {
    let organization;
    beforeEach(async () => {
      const receipt = await testSegmentDirectory.createAndAdd('aaa', { from: organizationAccount });
      organization = await Organization.at(receipt.logs[2].args[0]);
    });

    it('should remove organization from the directory', async () => {
      const receipt = await testSegmentDirectory.remove(organization.address, { from: organizationAccount });
      const allOrganizations = await help.jsArrayFromSolidityArray(
        segmentDirectory.organizations,
        await segmentDirectory.getOrganizationsLength(),
        help.isZeroAddress
      );
      assert.equal(allOrganizations.length, 0);
      assert.isUndefined(allOrganizations[0]);
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'OrganizationRemoved');
      assert.equal(receipt.logs[0].args[0], organization.address);
    });

    it('should not destroy the organization contract', async () => {
      await testSegmentDirectory.remove(organization.address, { from: organizationAccount });
      const code = await help.promisify(cb => web3.eth.getCode(organization.address, cb));
      assert.isAtLeast(code.length, 4);
    });

    it('should throw if somebody is removing organization which she does not own', async () => {
      try {
        await organization.transferOwnership(nonOwnerAccount, { from: organizationAccount });
        await testSegmentDirectory.remove(organization.address, { from: organizationAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if organization is not added', async () => {
      try {
        await testSegmentDirectory.remove(nonOwnerAccount, { from: organizationAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if organization is on zero address', async () => {
      try {
        await testSegmentDirectory.remove(help.zeroAddress, { from: organizationAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if organization non-owner initiates the removing', async () => {
      try {
        await testSegmentDirectory.remove(organization.address, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });
});

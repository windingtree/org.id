const { TestHelper } = require('zos');
const { Contracts, ZWeb3 } = require('zos-lib');
const assert = require('chai').assert;
const help = require('./helpers/index.js');

ZWeb3.initialize(web3.currentProvider);
// workaround for https://github.com/zeppelinos/zos/issues/704
Contracts.setArtifactsDefaults({
  gas: 60000000,
});

const Organization = Contracts.getFromLocal('Organization');

const OrganizationInterface = artifacts.require('OrganizationInterface');
const TestSegmentDirectory = artifacts.require('TestSegmentDirectory');
const SegmentDirectory = artifacts.require('SegmentDirectory');
const CustomOrganizationTest = artifacts.require('CustomOrganizationTest');

contract('TestSegmentDirectory', (accounts) => {
  const segmentDirectoryOwner = accounts[1];
  const foodTruckAccount = accounts[3];
  const nonOwnerAccount = accounts[4];
  const tokenAddress = accounts[5];

  let testSegmentDirectory;
  let segmentDirectory;
  let project;

  beforeEach(async () => {
    project = await TestHelper();
    testSegmentDirectory = await TestSegmentDirectory.new();
    await testSegmentDirectory.initialize(segmentDirectoryOwner, tokenAddress, project.app.address);
    segmentDirectory = await SegmentDirectory.at(testSegmentDirectory.address);
  });

  describe('initialize', () => {
    it('should not allow zero address owner', async () => {
      try {
        testSegmentDirectory = await TestSegmentDirectory.new();
        await testSegmentDirectory.initialize(help.zeroAddress, tokenAddress, project.app.address);
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should set liftoken', async () => {
      testSegmentDirectory = await TestSegmentDirectory.new();
      await testSegmentDirectory.initialize(segmentDirectoryOwner, tokenAddress, project.app.address);
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
    it('should count foodTrucks properly', async () => {
      // length is a bignumber
      let length = await segmentDirectory.getOrganizationsLength();
      // We start with empty address on the zero segmentDirectory
      assert.equal(length.toNumber(), 1);
      await testSegmentDirectory.createAndAddFoodTruck('aaa', { from: foodTruckAccount });
      length = await segmentDirectory.getOrganizationsLength();
      assert.equal(length.toNumber(), 2);
      const receipt = await testSegmentDirectory.createAndAddFoodTruck('bbb', { from: foodTruckAccount });
      length = await testSegmentDirectory.getOrganizationsLength();
      assert.equal(length.toNumber(), 3);
      const expectedFoodTruckAddress = receipt.logs[0].address;
      await testSegmentDirectory.removeFoodTruck(expectedFoodTruckAddress, { from: foodTruckAccount });
      length = await testSegmentDirectory.getOrganizationsLength();
      // length counts zero addresses
      assert.equal(length.toNumber(), 3);
    });
  });

  describe('getOrganizations', () => {
    it('should return foodTrucks properly', async () => {
      assert.equal(help.filterZeroAddresses(await testSegmentDirectory.getOrganizations()).length, 0);
      const receipt = await testSegmentDirectory.createAndAddFoodTruck('aaa', { from: foodTruckAccount });
      const expectedFoodTruckAddress = receipt.logs[0].address;
      assert.equal(help.filterZeroAddresses(await testSegmentDirectory.getOrganizations()).length, 1);
      await testSegmentDirectory.createAndAddFoodTruck('bbb', { from: foodTruckAccount });
      assert.equal(help.filterZeroAddresses(await testSegmentDirectory.getOrganizations()).length, 2);
      await testSegmentDirectory.removeFoodTruck(expectedFoodTruckAddress, { from: foodTruckAccount });
      assert.equal(help.filterZeroAddresses(await testSegmentDirectory.getOrganizations()).length, 1);
    });
  });

  describe('createFoodTruck', () => {
    it('should create an Organization contract', async () => {
      // First emulate the transaction, then actually run it
      const address = await testSegmentDirectory.createFoodTruck.call('dataUri', { from: foodTruckAccount });
      const receipt = await testSegmentDirectory.createFoodTruck('dataUri', { from: foodTruckAccount });
      const organization = await Organization.at(address);
      const info = await help.getOrganizationInfo(organization);
      assert.equal(info.owner, foodTruckAccount);
      assert.equal(info.dataUri, 'dataUri');
      assert.equal(receipt.logs.length, 2);
      assert.equal(receipt.logs[0].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[0].args[0], help.zeroAddress);
      assert.equal(receipt.logs[0].args[1], foodTruckAccount);
      assert.equal(receipt.logs[1].event, 'OrganizationCreated');
      assert.equal(receipt.logs[1].args.organization, address);
    });

    it('should not add the organization into any mapping', async () => {
      await testSegmentDirectory.createFoodTruck('dataUri', { from: foodTruckAccount });
      const orgList = await segmentDirectory.getOrganizations();
      assert.equal(help.filterZeroAddresses(orgList).length, 0);
    });

    it('should not create an organization with empty dataUri', async () => {
      try {
        await testSegmentDirectory.createFoodTruck('', { from: foodTruckAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('addFoodTruck', () => {
    let organizationProxy;
    let organization;

    beforeEach(async () => {
      organizationProxy = await project.createProxy(Organization, {
        from: segmentDirectoryOwner,
        initFunction: 'initialize',
        initArgs: [foodTruckAccount, 'dataUri'],
      });
      organization = await Organization.at(organizationProxy.address);
    });

    it('should add the organization to the registry', async () => {
      const receipt = await testSegmentDirectory.addFoodTruck(organization.address, { from: foodTruckAccount });
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'OrganizationAdded');
      assert.equal(receipt.logs[0].args.organization, organization.address);
      assert.equal(receipt.logs[0].args.index, 1);

      const allFoodTrucks = await help.jsArrayFromSolidityArray(
        segmentDirectory.organizations,
        await segmentDirectory.getOrganizationsLength(),
        help.isZeroAddress
      );
      const actualIndexPos = await segmentDirectory.organizationsIndex(allFoodTrucks[0]);
      const foodTruck = allFoodTrucks[0];
      assert.isDefined(foodTruck);
      assert.isFalse(help.isZeroAddress(foodTruck));
      assert.equal(actualIndexPos, 1);
    });

    it('should throw if adding an already added organization', async () => {
      await testSegmentDirectory.addFoodTruck(organization.address, { from: foodTruckAccount });
      try {
        await testSegmentDirectory.addFoodTruck(organization.address, { from: foodTruckAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if adding organization on a zero address', async () => {
      try {
        await testSegmentDirectory.addFoodTruck(help.zeroAddress, { from: foodTruckAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if somebody is adding organization which she does not own', async () => {
      try {
        await testSegmentDirectory.addFoodTruck(organization.address, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should not add a FoodTruck that does not support OrganizationInterface', async () => {
      try {
        await testSegmentDirectory.addFoodTruck(nonOwnerAccount, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should add a custom organization contract', async () => {
      const customOrg = await CustomOrganizationTest.new({ from: foodTruckAccount });
      const receipt = await testSegmentDirectory.addFoodTruck(customOrg.address, { from: foodTruckAccount });
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'OrganizationAdded');
      assert.equal(receipt.logs[0].args.organization, customOrg.address);
      assert.equal(receipt.logs[0].args.index, 1);

      const allFoodTrucks = await help.jsArrayFromSolidityArray(
        segmentDirectory.organizations,
        await segmentDirectory.getOrganizationsLength(),
        help.isZeroAddress
      );
      const actualIndexPos = await segmentDirectory.organizationsIndex(allFoodTrucks[0]);
      const foodTruck = allFoodTrucks[0];
      assert.isDefined(foodTruck);
      assert.isFalse(help.isZeroAddress(foodTruck));
      assert.equal(actualIndexPos, 1);
      const org = await OrganizationInterface.at(customOrg.address);
      assert.equal(await org.getDataUri(), 'https://super-sweet-custom-organization.com');
    });
  });

  describe('createAndAddFoodTruck', () => {
    it('should create and add the organization to the registry', async () => {
      const address = await testSegmentDirectory.createAndAddFoodTruck.call('dataUri', { from: foodTruckAccount });
      const receipt = await testSegmentDirectory.createAndAddFoodTruck('dataUri', { from: foodTruckAccount });
      const organization = await Organization.at(address);
      assert.equal(receipt.logs.length, 3);
      assert.equal(receipt.logs[0].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[0].args[0], help.zeroAddress);
      assert.equal(receipt.logs[0].args[1], foodTruckAccount);
      assert.equal(receipt.logs[1].event, 'OrganizationCreated');
      assert.equal(receipt.logs[1].args.organization, organization.address);
      assert.equal(receipt.logs[2].event, 'OrganizationAdded');
      assert.equal(receipt.logs[2].args.organization, organization.address);
      assert.equal(receipt.logs[2].args.index, 1);
      const info = await help.getOrganizationInfo(organization);
      assert.equal(info.owner, foodTruckAccount);
      assert.equal(info.dataUri, 'dataUri');
      const allFoodTrucks = await help.jsArrayFromSolidityArray(
        segmentDirectory.organizations,
        await segmentDirectory.getOrganizationsLength(),
        help.isZeroAddress
      );
      const actualIndexPos = await segmentDirectory.organizationsIndex(allFoodTrucks[0]);
      const foodTruck = allFoodTrucks[0];
      assert.isDefined(foodTruck);
      assert.isFalse(help.isZeroAddress(foodTruck));
      assert.equal(actualIndexPos, 1);
    });
  });

  describe('removeFoodTruck', () => {
    let organization;
    beforeEach(async () => {
      const receipt = await testSegmentDirectory.createAndAddFoodTruck('aaa', { from: foodTruckAccount });
      organization = await Organization.at(receipt.logs[2].args[0]);
    });

    it('should remove organization from the directory', async () => {
      const receipt = await testSegmentDirectory.removeFoodTruck(organization.address, { from: foodTruckAccount });
      const allFoodTrucks = await help.jsArrayFromSolidityArray(
        segmentDirectory.organizations,
        await segmentDirectory.getOrganizationsLength(),
        help.isZeroAddress
      );
      assert.equal(allFoodTrucks.length, 0);
      const foodTruck = allFoodTrucks[0];
      assert.isUndefined(foodTruck);
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'OrganizationRemoved');
      assert.equal(receipt.logs[0].args[0], organization.address);
    });

    it('should not destroy the organization contract', async () => {
      await testSegmentDirectory.removeFoodTruck(organization.address, { from: foodTruckAccount });
      const code = await help.promisify(cb => web3.eth.getCode(organization.address, cb));
      assert.isAtLeast(code.length, 4);
    });

    it('should throw if somebody is removing organization which she does not own', async () => {
      try {
        await organization.methods.transferOwnership(nonOwnerAccount).send({ from: foodTruckAccount });
        await testSegmentDirectory.removeFoodTruck(organization.address, { from: foodTruckAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if organization is not added', async () => {
      try {
        await testSegmentDirectory.removeFoodTruck(nonOwnerAccount, { from: foodTruckAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if organization is on zero address', async () => {
      try {
        await testSegmentDirectory.removeFoodTruck(help.zeroAddress, { from: foodTruckAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if organization non-owner initiates the removing', async () => {
      try {
        await testSegmentDirectory.removeFoodTruck(organization.address, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });
});

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
const OrganizationUpgradeabilityTest = Contracts.getFromLocal('OrganizationUpgradeabilityTest');

contract('Organization', (accounts) => {
  const organizationUri = 'bzz://something';
  const organizationOwner = accounts[1];
  const proxyOwner = accounts[2];
  const nonOwnerAccount = accounts[3];

  let organizationProxy;
  let organization;
  let project;

  beforeEach(async () => {
    project = await TestHelper();
    organizationProxy = await project.createProxy(Organization, {
      from: proxyOwner,
      initFunction: 'initialize',
      initArgs: [organizationOwner, organizationUri],
    });
    organization = await Organization.at(organizationProxy.address);
  });

  describe('Constructor', () => {
    it('should be initialised with the correct data', async () => {
      const info = await help.getOrganizationInfo(organization);
      // We need callback, because getBlockNumber for some reason cannot be called with await
      const blockNumber = await help.promisify(cb => web3.eth.getBlockNumber(cb));
      assert.isAtMost(info.created, blockNumber);
      assert.equal(info.owner, organizationOwner);
      assert.equal(info.dataUri, organizationUri);
    });

    it('should throw with empty dataUri', async () => {
      try {
        const tProject = await TestHelper();
        await tProject.createProxy(Organization, {
          from: proxyOwner,
          initFunction: 'initialize',
          initArgs: [organizationOwner, ''],
        });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('upgradeability', () => {
    it('should upgrade Organisation and have new functions', async () => {
      const upgradedOrganization = await OrganizationUpgradeabilityTest.new({ from: organizationOwner });
      await project.proxyAdmin.upgradeProxy(organizationProxy.address, upgradedOrganization.address, OrganizationUpgradeabilityTest);
      const newOrganization = await OrganizationUpgradeabilityTest.at(organizationProxy.address);
      assert.equal(await newOrganization.methods.newFunction().call(), 100);
    });
  });

  describe('changeDataUri', () => {
    const newDataUri = 'goo.gl/12345';

    it('should not set empty dataUri', async () => {
      try {
        await organization.methods.changeDataUri('').send({ from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should set dataUri', async () => {
      await organization.methods.changeDataUri(newDataUri).send({ from: organizationOwner });
      const info = await help.getOrganizationInfo(organization);
      assert.equal(info.dataUri, newDataUri);
    });

    it('should throw if not executed by organization owner', async () => {
      try {
        await organization.methods.changeDataUri(newDataUri).send({ from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('transferOwnership', () => {
    it('should transfer contract and emit OwnershipTransferred', async () => {
      const receipt = await organization.methods.transferOwnership(nonOwnerAccount).send({ from: organizationOwner });
      assert.equal(Object.keys(receipt.events).length, 1);
      assert.equal(receipt.events.OwnershipTransferred.returnValues.previousOwner, organizationOwner);
      assert.equal(receipt.events.OwnershipTransferred.returnValues.newOwner, nonOwnerAccount);
      const info = await help.getOrganizationInfo(organization);
      assert.equal(info.owner, nonOwnerAccount);
    });

    it('should throw if transferring to a zero address', async () => {
      try {
        await organization.methods.transferOwnership(help.zeroAddress).send({ from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if not executed from owner address', async () => {
      try {
        await organization.methods.transferOwnership(nonOwnerAccount).send({ from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('addDelegate', async () => {
    it('should add delegate and emit', async () => {
      const receipt = await organization.methods.addDelegate(nonOwnerAccount).send({ from: organizationOwner });
      assert.equal(Object.keys(receipt.events).length, 1);
      assert.equal(receipt.events.DelegateAdded.returnValues.delegate, nonOwnerAccount);
      assert.equal(receipt.events.DelegateAdded.returnValues.index, 1);
      assert.equal(await organization.methods.delegatesIndex(nonOwnerAccount).call(), 1);
      assert.equal(await organization.methods.delegates(1).call(), nonOwnerAccount);
      assert.equal(await organization.methods.isDelegate(nonOwnerAccount).call(), true);
    });

    it('should throw when adding an existing delegate', async () => {
      await organization.methods.addDelegate(nonOwnerAccount).send({ from: organizationOwner });
      try {
        await organization.methods.addDelegate(nonOwnerAccount).send({ from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw when adding a delegate with zero address', async () => {
      try {
        await organization.methods.addDelegate(help.zeroAddress).send({ from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw when adding a delegate by a non-owner', async () => {
      try {
        await organization.methods.addDelegate(nonOwnerAccount).send({ from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('removeDelegate', async () => {
    it('should remove an existing delegate and emit', async () => {
      await organization.methods.addDelegate(nonOwnerAccount).send({ from: organizationOwner });
      const receipt = await organization.methods.removeDelegate(nonOwnerAccount).send({ from: organizationOwner });
      assert.equal(Object.keys(receipt.events).length, 1);
      assert.equal(receipt.events.DelegateRemoved.returnValues.delegate, nonOwnerAccount);
      assert.equal(await organization.methods.isDelegate(nonOwnerAccount).call(), false);
      assert.equal(await organization.methods.delegates(1).call(), help.zeroAddress);
      assert.equal(await organization.methods.delegatesIndex(nonOwnerAccount).call(), 0);
    });

    it('should throw when removing a non-existing delegate', async () => {
      try {
        await organization.methods.removeDelegate(nonOwnerAccount).send({ from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw when removing a zero address', async () => {
      try {
        await organization.methods.removeDelegate(help.zeroAddress).send({ from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('isDelegate', async () => {
    it('should return false for a non-delegate', async () => {
      assert.equal(await organization.methods.isDelegate(nonOwnerAccount).call(), false);
    });

    it('should return true for a delegate', async () => {
      await organization.methods.addDelegate(nonOwnerAccount).send({ from: organizationOwner });
      assert.equal(await organization.methods.isDelegate(nonOwnerAccount).call(), true);
    });
  });
});

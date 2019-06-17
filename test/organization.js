const TestHelper = require('./helpers/zostest');
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
      assert.equal(info.owner, organizationOwner);
      assert.equal(info.orgJsonUri, organizationUri);
    });

    it('should throw with zero owner', async () => {
      try {
        const tProject = await TestHelper();
        await tProject.createProxy(Organization, {
          from: proxyOwner,
          initFunction: 'initialize',
          initArgs: ['0x0000000000000000000000000000000000000000', 'orgJsonUri'],
        });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw with empty orgJsonUri', async () => {
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

  describe('changeOrgJsonUri', () => {
    const newOrgJsonUri = 'goo.gl/12345';
    it('should not set empty orgJsonUri', async () => {
      try {
        await organization.methods.changeOrgJsonUri('').send({ from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should set orgJsonUri', async () => {
      await organization.methods.changeOrgJsonUri(newOrgJsonUri).send({ from: organizationOwner });
      const info = await help.getOrganizationInfo(organization);
      assert.equal(info.orgJsonUri, newOrgJsonUri);
    });

    it('should throw if not executed by organization owner', async () => {
      try {
        await organization.methods.changeOrgJsonUri(newOrgJsonUri).send({ from: nonOwnerAccount });
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

  describe('addAssociatedKey', async () => {
    it('should add associatedKey and emit', async () => {
      const receipt = await organization.methods.addAssociatedKey(nonOwnerAccount).send({ from: organizationOwner });
      assert.equal(Object.keys(receipt.events).length, 1);
      assert.equal(receipt.events.AssociatedKeyAdded.returnValues.associatedKey, nonOwnerAccount);
      assert.equal(receipt.events.AssociatedKeyAdded.returnValues.index, 1);
      assert.equal(await organization.methods.associatedKeysIndex(nonOwnerAccount).call(), 1);
      assert.equal(await organization.methods.associatedKeys(1).call(), nonOwnerAccount);
      assert.equal(await organization.methods.hasAssociatedKey(nonOwnerAccount).call(), true);
    });

    it('should throw when adding an existing associatedKey', async () => {
      await organization.methods.addAssociatedKey(nonOwnerAccount).send({ from: organizationOwner });
      try {
        await organization.methods.addAssociatedKey(nonOwnerAccount).send({ from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw when adding a associatedKey with zero address', async () => {
      try {
        await organization.methods.addAssociatedKey(help.zeroAddress).send({ from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw when adding a associatedKey by a non-owner', async () => {
      try {
        await organization.methods.addAssociatedKey(nonOwnerAccount).send({ from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('removeAssociatedKey', async () => {
    it('should remove an existing associatedKey and emit', async () => {
      await organization.methods.addAssociatedKey(nonOwnerAccount).send({ from: organizationOwner });
      const receipt = await organization.methods.removeAssociatedKey(nonOwnerAccount).send({ from: organizationOwner });
      assert.equal(Object.keys(receipt.events).length, 1);
      assert.equal(receipt.events.AssociatedKeyRemoved.returnValues.associatedKey, nonOwnerAccount);
      assert.equal(await organization.methods.hasAssociatedKey(nonOwnerAccount).call(), false);
      assert.equal(await organization.methods.associatedKeys(1).call(), help.zeroAddress);
      assert.equal(await organization.methods.associatedKeysIndex(nonOwnerAccount).call(), 0);
    });

    it('should throw when removing a non-existing associatedKey', async () => {
      try {
        await organization.methods.removeAssociatedKey(nonOwnerAccount).send({ from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw when removing a zero address', async () => {
      try {
        await organization.methods.removeAssociatedKey(help.zeroAddress).send({ from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('getAssociatedKeys', async () => {
    it('should list associatedKeys', async () => {
      await organization.methods.addAssociatedKey(nonOwnerAccount).send({ from: organizationOwner });
      const r = await organization.methods.getAssociatedKeys().call();
      assert.equal(r.length, 2);
    });
  });

  describe('hasAssociatedKey', async () => {
    it('should return false for a non-associatedKey', async () => {
      assert.equal(await organization.methods.hasAssociatedKey(nonOwnerAccount).call(), false);
    });

    it('should return true for a associatedKey', async () => {
      await organization.methods.addAssociatedKey(nonOwnerAccount).send({ from: organizationOwner });
      assert.equal(await organization.methods.hasAssociatedKey(nonOwnerAccount).call(), true);
    });
  });
});

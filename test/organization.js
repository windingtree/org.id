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
const OrganizationInterface = Contracts.getFromLocal('OrganizationInterface');
const OrganizationUpgradeabilityTest = Contracts.getFromLocal('OrganizationUpgradeabilityTest');

contract('Organization', (accounts) => {
  const organizationUri = 'bzz://something';
  const organizationHash = '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99';
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
      initArgs: [organizationOwner, organizationUri, organizationHash],
    });
    organization = await Organization.at(organizationProxy.address);
  });

  describe('Constructor', () => {
    it('should be initialised with the correct data', async () => {
      const info = await help.getOrganizationInfo(organization);
      // We need callback, because getBlockNumber for some reason cannot be called with await
      assert.equal(info.owner, organizationOwner);
      assert.equal(info.orgJsonUri, organizationUri);
      assert.equal(info.orgJsonHash, organizationHash);
    });

    it('should throw with zero owner', async () => {
      try {
        const tProject = await TestHelper();
        await tProject.createProxy(Organization, {
          from: proxyOwner,
          initFunction: 'initialize',
          initArgs: ['0x0000000000000000000000000000000000000000', organizationUri, organizationHash],
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
          initArgs: [organizationOwner, '', organizationHash],
        });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw with empty orgJsonHash', async () => {
      try {
        const tProject = await TestHelper();
        await tProject.createProxy(Organization, {
          from: proxyOwner,
          initFunction: 'initialize',
          initArgs: [organizationOwner, organizationUri, '0x0000000000000000000000000000000000000000000000000000000000000000'],
        });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('interfaces', () => {
    it('should support IERC165 interface', async () => {
      const orgIface = await OrganizationInterface.at(organization.address);
      assert.equal(await orgIface.methods.supportsInterface('0x01ffc9a7').call(), true);
    });

    it('should support owner interface', async () => {
      const orgIface = await OrganizationInterface.at(organization.address);
      assert.equal(await orgIface.methods.supportsInterface('0x8da5cb5b').call(), true);
    });

    it('should support ORG.JSON related interface', async () => {
      const orgIface = await OrganizationInterface.at(organization.address);
      assert.equal(await orgIface.methods.supportsInterface('0x6f4826be').call(), true);
    });

    it('should support associated keys related interface', async () => {
      const orgIface = await OrganizationInterface.at(organization.address);
      assert.equal(await orgIface.methods.supportsInterface('0xfed71811').call(), true);
    });

    it('should support latest interface', async () => {
      const orgIface = await OrganizationInterface.at(organization.address);
      assert.equal(await orgIface.methods.supportsInterface('0x1c3af5f4').call(), true);
    });

    it('should be possible to call sync interfaces without failure', async () => {
      await organization.methods.setInterfaces().send({ from: organizationOwner });
    });
  });

  describe('upgradeability', () => {
    it('should upgrade Organization and have new functions', async () => {
      const upgradedOrganization = await OrganizationUpgradeabilityTest.new({ from: organizationOwner });
      await project.proxyAdmin.upgradeProxy(organizationProxy.address, upgradedOrganization.address, OrganizationUpgradeabilityTest);
      const newOrganization = await OrganizationUpgradeabilityTest.at(organizationProxy.address);
      assert.equal(await newOrganization.methods.newFunction().call(), 100);
    });

    it('should be possible to setup new interfaces', async () => {
      const upgradedOrganization = await OrganizationUpgradeabilityTest.new({ from: organizationOwner });
      assert.equal(await upgradedOrganization.methods.supportsInterface('0x1b28d63e').call(), false);
      await project.proxyAdmin.upgradeProxy(organizationProxy.address, upgradedOrganization.address, OrganizationUpgradeabilityTest, 'setInterfaces', []);
      const newOrganization = await OrganizationUpgradeabilityTest.at(organizationProxy.address);
      assert.equal(await newOrganization.methods.newFunction().call(), 100);
      const orgIface = await OrganizationInterface.at(newOrganization.address);
      // test newFunction interface got added when setInterfaces was called
      assert.equal(await orgIface.methods.supportsInterface('0x1b28d63e').call(), true);
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
      const receipt = await organization.methods.changeOrgJsonUri(newOrgJsonUri).send({ from: organizationOwner });
      const info = await help.getOrganizationInfo(organization);
      assert.equal(info.orgJsonUri, newOrgJsonUri);
      assert.isDefined(receipt.events.OrgJsonUriChanged);
      assert.equal(receipt.events.OrgJsonUriChanged.returnValues.newOrgJsonUri, newOrgJsonUri);
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

  describe('changeOrgJsonHash', () => {
    const newOrgJsonHash = '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99';
    it('should not set empty orgJsonHash', async () => {
      try {
        await organization.methods.changeOrgJsonHash('0x0').send({ from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should set orgJsonHash', async () => {
      const receipt = await organization.methods.changeOrgJsonHash(newOrgJsonHash).send({ from: organizationOwner });
      const info = await help.getOrganizationInfo(organization);
      assert.equal(info.orgJsonHash, newOrgJsonHash);
      assert.isDefined(receipt.events.OrgJsonHashChanged);
      assert.equal(receipt.events.OrgJsonHashChanged.returnValues.newOrgJsonHash, newOrgJsonHash);
    });

    it('should throw if not executed by organization owner', async () => {
      try {
        await organization.methods.changeOrgJsonHash(newOrgJsonHash).send({ from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('changeOrgJsonUriAndHash', () => {
    const newOrgJsonUri = 'goo.gl/12345';
    const newOrgJsonHash = '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99';

    it('should set orgJsonUri and orgJsonHash', async () => {
      const receipt = await organization.methods.changeOrgJsonUriAndHash(newOrgJsonUri, newOrgJsonHash).send({ from: organizationOwner });
      const info = await help.getOrganizationInfo(organization);
      assert.equal(info.orgJsonUri, newOrgJsonUri);
      assert.equal(info.orgJsonHash, newOrgJsonHash);
      assert.isDefined(receipt.events.OrgJsonHashChanged);
      assert.isDefined(receipt.events.OrgJsonUriChanged);
      assert.equal(receipt.events.OrgJsonHashChanged.returnValues.newOrgJsonHash, newOrgJsonHash);
      assert.equal(receipt.events.OrgJsonUriChanged.returnValues.newOrgJsonUri, newOrgJsonUri);
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

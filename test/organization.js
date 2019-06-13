const assert = require('chai').assert;
const help = require('./helpers/index.js');

const Organization = artifacts.require('Organization');

contract('Organization', (accounts) => {
  const organizationUri = 'bzz://something';
  const organizationOwner = accounts[2];
  const nonOwnerAccount = accounts[3];
  let organization;

  beforeEach(async () => {
    organization = await Organization.new(organizationUri, {
      from: organizationOwner,
    });
  });

  describe('Constructor', () => {
    it('should be initialised with the correct data', async () => {
      const info = await help.getOrganizationInfo(organization);
      // We need callback, because getBlockNumber for some reason cannot be called with await
      const blockNumber = await help.promisify(cb => web3.eth.getBlockNumber(cb));
      assert.isAtMost(info.created, blockNumber);
      assert.equal(info.owner, organizationOwner);
      assert.equal(info.orgJsonUri, organizationUri);
    });

    it('should throw with empty orgJsonUri', async () => {
      try {
        await Organization.new('', { from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('changeOrgJsonUri', () => {
    const newOrgJsonUri = 'goo.gl/12345';

    it('should not set empty orgJsonUri', async () => {
      try {
        await organization.changeOrgJsonUri('', { from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should set orgJsonUri', async () => {
      await organization.changeOrgJsonUri(newOrgJsonUri, { from: organizationOwner });
      const info = await help.getOrganizationInfo(organization);
      assert.equal(info.orgJsonUri, newOrgJsonUri);
    });

    it('should throw if not executed by organization owner', async () => {
      try {
        await organization.changeOrgJsonUri(newOrgJsonUri, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('transferOwnership', () => {
    it('should transfer contract and emit OwnershipTransferred', async () => {
      const receipt = await organization.transferOwnership(nonOwnerAccount, { from: organizationOwner });
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'OwnershipTransferred');
      assert.equal(receipt.logs[0].args.previousOwner, organizationOwner);
      assert.equal(receipt.logs[0].args.newOwner, nonOwnerAccount);
      const info = await help.getOrganizationInfo(organization);
      assert.equal(info.owner, nonOwnerAccount);
    });

    it('should throw if transferring to a zero address', async () => {
      try {
        await organization.transferOwnership(help.zeroAddress, { from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if not executed from owner address', async () => {
      try {
        await organization.transferOwnership(nonOwnerAccount, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('addDelegate', async () => {
    it('should add delegate and emit', async () => {
      const receipt = await organization.addDelegate(nonOwnerAccount, { from: organizationOwner });
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'DelegateAdded');
      assert.equal(receipt.logs[0].args.delegate, nonOwnerAccount);
      assert.equal(receipt.logs[0].args.index, 1);
      assert.equal(await organization.delegatesIndex(nonOwnerAccount), 1);
      assert.equal(await organization.delegates(1), nonOwnerAccount);
      assert.equal(await organization.hasDelegate(nonOwnerAccount), true);
    });

    it('should throw when adding an existing delegate', async () => {
      await organization.addDelegate(nonOwnerAccount, { from: organizationOwner });
      try {
        await organization.addDelegate(nonOwnerAccount, { from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw when adding a delegate with zero address', async () => {
      try {
        await organization.addDelegate(help.zeroAddress, { from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw when adding a delegate by a non-owner', async () => {
      try {
        await organization.addDelegate(nonOwnerAccount, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('removeDelegate', async () => {
    it('should remove an existing delegate and emit', async () => {
      await organization.addDelegate(nonOwnerAccount, { from: organizationOwner });
      const receipt = await organization.removeDelegate(nonOwnerAccount, { from: organizationOwner });
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'DelegateRemoved');
      assert.equal(receipt.logs[0].args.delegate, nonOwnerAccount);
      assert.equal(await organization.hasDelegate(nonOwnerAccount), false);
      assert.equal(await organization.delegates(1), help.zeroAddress);
      assert.equal(await organization.delegatesIndex(nonOwnerAccount), 0);
    });

    it('should throw when removing a non-existing delegate', async () => {
      try {
        await organization.removeDelegate(nonOwnerAccount, { from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw when removing a zero address', async () => {
      try {
        await organization.removeDelegate(help.zeroAddress, { from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('hasDelegate', async () => {
    it('should return false for a non-delegate', async () => {
      assert.equal(await organization.hasDelegate(nonOwnerAccount), false);
    });

    it('should return true for a delegate', async () => {
      await organization.addDelegate(nonOwnerAccount, { from: organizationOwner });
      assert.equal(await organization.hasDelegate(nonOwnerAccount), true);
    });
  });
});

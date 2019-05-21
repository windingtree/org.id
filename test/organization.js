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
      assert.equal(info.manager, organizationOwner);
      assert.equal(info.dataUri, organizationUri);
    });

    it('should throw with empty dataUri', async () => {
      try {
        await Organization.new('', { from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('changeDataUri', () => {
    const newDataUri = 'goo.gl/12345';

    it('should not set empty dataUri', async () => {
      try {
        await organization.changeDataUri('', { from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should set dataUri', async () => {
      await organization.changeDataUri(newDataUri, { from: organizationOwner });
      const info = await help.getOrganizationInfo(organization);
      assert.equal(info.dataUri, newDataUri);
    });

    it('should throw if not executed by organization owner', async () => {
      try {
        await organization.changeDataUri(newDataUri, { from: nonOwnerAccount });
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
      assert.equal(info.manager, nonOwnerAccount);
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

  describe('destroy', () => {
    it('should destroy the contract', async () => {
      await organization.destroy({ from: organizationOwner });
      const code = await help.promisify(cb => web3.eth.getCode(organization.address, cb));
      assert.match(code, /^0x/);
    });

    it('should throw if not executed from owner address', async () => {
      try {
        await organization.destroy({ from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });
});

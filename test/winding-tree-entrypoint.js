const { TestHelper } = require('zos');
const { Contracts, ZWeb3 } = require('zos-lib');
const assert = require('chai').assert;
const help = require('./helpers/index.js');
const web3Utils = require('web3-utils');

ZWeb3.initialize(web3.currentProvider);
// workaround for https://github.com/zeppelinos/zos/issues/704
Contracts.setArtifactsDefaults({
  gas: 60000000,
});

const WindingTreeEntrypoint = Contracts.getFromLocal('WindingTreeEntrypoint');
const WindingTreeEntrypointUpgradeabilityTest = Contracts.getFromLocal('WindingTreeEntrypointUpgradeabilityTest');

contract('WindingTreeEntrypoint', (accounts) => {
  const windingTreeEntrypointOwner = accounts[1];
  const proxyOwner = accounts[2];
  const nonOwnerAccount = accounts[3];

  let windingTreeEntrypointProxy;
  let windingTreeEntrypoint;
  let project;

  beforeEach(async () => {
    project = await TestHelper();
    windingTreeEntrypointProxy = await project.createProxy(WindingTreeEntrypoint, {
      from: proxyOwner,
      initFunction: 'initialize',
      initArgs: [windingTreeEntrypointOwner],
    });
    windingTreeEntrypoint = await WindingTreeEntrypoint.at(windingTreeEntrypointProxy.address);
  });

  describe('upgradeability', () => {
    it('should upgrade WindingTreeEntrypoint and have new functions', async () => {
      await windingTreeEntrypoint.methods.setSegment('hotels', nonOwnerAccount).send({ from: windingTreeEntrypointOwner });
      await windingTreeEntrypoint.methods.setSegment('airlines', proxyOwner).send({ from: windingTreeEntrypointOwner });
      // upgrade
      const upgradedEntrypoint = await WindingTreeEntrypointUpgradeabilityTest.new({ from: windingTreeEntrypointOwner });
      await project.proxyAdmin.upgradeProxy(windingTreeEntrypointProxy.address, upgradedEntrypoint.address, WindingTreeEntrypointUpgradeabilityTest);
      const newEntrypoint = await WindingTreeEntrypointUpgradeabilityTest.at(windingTreeEntrypointProxy.address);
      await newEntrypoint.methods.setSegment('otas', windingTreeEntrypointOwner).send({ from: windingTreeEntrypointOwner });
      // test values
      assert.equal(await newEntrypoint.methods.getSegment('hotels').call(), nonOwnerAccount);
      assert.equal(await newEntrypoint.methods.getSegment('airlines').call(), proxyOwner);
      assert.equal(await newEntrypoint.methods.getSegment('otas').call(), windingTreeEntrypointOwner);
      assert.equal(await newEntrypoint.methods.newFunction().call(), 100);
    });
  });

  describe('initialize', () => {
    it('should not allow zero address owner', async () => {
      try {
        const entrypoint = await WindingTreeEntrypoint.new();
        await entrypoint.methods.initialize(help.zeroAddress).send({ from: windingTreeEntrypointOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('setSegment', () => {
    it('should throw when called with empty segment', async () => {
      try {
        await windingTreeEntrypoint.methods.setSegment('', nonOwnerAccount).send({ from: windingTreeEntrypointOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw when called by non-owner', async () => {
      try {
        await windingTreeEntrypoint.methods.setSegment('hotels', nonOwnerAccount).send({ from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
    
    it('should throw when setting to a zero address', async () => {
      try {
        await windingTreeEntrypoint.methods.setSegment('hotels', help.zeroAddress).send({ from: windingTreeEntrypointOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
    
    it('should set a segment and emit', async () => {
      const rcpt = await windingTreeEntrypoint.methods.setSegment('hotels', nonOwnerAccount).send({ from: windingTreeEntrypointOwner });
      assert.equal(Object.keys(rcpt.events).length, 1);
      assert.isDefined(rcpt.events.SegmentSet);
      assert.equal(rcpt.events.SegmentSet.returnValues.oldAddress, help.zeroAddress);
      assert.equal(rcpt.events.SegmentSet.returnValues.newAddress, nonOwnerAccount);
      assert.equal(rcpt.events.SegmentSet.returnValues.segment, web3Utils.keccak256('hotels'));
      const addr = await windingTreeEntrypoint.methods.getSegment('hotels').call();
      assert.equal(addr, nonOwnerAccount);
      assert.equal(await windingTreeEntrypoint.methods.getSegmentsLength().call(), 2);
      assert.equal(await windingTreeEntrypoint.methods.getSegmentIndex('hotels').call(), 1);
      assert.equal(await windingTreeEntrypoint.methods.getSegmentName(1).call(), 'hotels');
    });
    
    it('should overwrite a segment', async () => {
      await windingTreeEntrypoint.methods.setSegment('hotels', nonOwnerAccount).send({ from: windingTreeEntrypointOwner });
      assert.equal(await windingTreeEntrypoint.methods.getSegment('hotels').call(), nonOwnerAccount);
      assert.equal(await windingTreeEntrypoint.methods.getSegmentsLength().call(), 2);
      await windingTreeEntrypoint.methods.setSegment('hotels', windingTreeEntrypointOwner).send({ from: windingTreeEntrypointOwner });
      assert.equal(await windingTreeEntrypoint.methods.getSegment('hotels').call(), windingTreeEntrypointOwner);
      assert.equal(await windingTreeEntrypoint.methods.getSegmentsLength().call(), 2);
      assert.equal(await windingTreeEntrypoint.methods.getSegmentIndex('hotels').call(), 1);
      assert.equal(await windingTreeEntrypoint.methods.getSegmentName(1).call(), 'hotels');
    });
  });

  describe('removeSegment', () => {
    it('should throw when called by non-owner', async () => {
      try {
        await windingTreeEntrypoint.methods.removeSegment('hotels').send({ from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw when called on an empty segment', async () => {
      try {
        await windingTreeEntrypoint.methods.removeSegment('').send({ from: windingTreeEntrypointOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should set to a zero address and emit', async () => {
      await windingTreeEntrypoint.methods.setSegment('hotels', nonOwnerAccount).send({ from: windingTreeEntrypointOwner });
      assert.equal(await windingTreeEntrypoint.methods.getSegmentsLength().call(), 2);
      assert.equal(await windingTreeEntrypoint.methods.getSegmentIndex('hotels').call(), 1);
      assert.equal(await windingTreeEntrypoint.methods.getSegmentName(1).call(), 'hotels');
      assert.equal(await windingTreeEntrypoint.methods.getSegment('hotels').call(), nonOwnerAccount);
      const rcpt = await windingTreeEntrypoint.methods.removeSegment('hotels').send({ from: windingTreeEntrypointOwner });
      assert.equal(Object.keys(rcpt.events).length, 1);
      assert.isDefined(rcpt.events.SegmentSet);
      assert.equal(rcpt.events.SegmentSet.returnValues.oldAddress, nonOwnerAccount);
      assert.equal(rcpt.events.SegmentSet.returnValues.newAddress, help.zeroAddress);
      assert.equal(rcpt.events.SegmentSet.returnValues.segment, web3Utils.keccak256('hotels'));
      assert.equal(await windingTreeEntrypoint.methods.getSegment('hotels').call(), help.zeroAddress);
      assert.equal(await windingTreeEntrypoint.methods.getSegmentsLength().call(), 2);
      assert.equal(await windingTreeEntrypoint.methods.getSegmentIndex('hotels').call(), 0);
      assert.equal(await windingTreeEntrypoint.methods.getSegmentName(1).call(), '');
    });
  });

  describe('getSegment', () => {
    it('should return zero address for an empty segment', async () => {
      assert.equal(await windingTreeEntrypoint.methods.getSegment('').call(), help.zeroAddress);
    });

    it('should return address for existing segment', async () => {
      await windingTreeEntrypoint.methods.setSegment('hotels', nonOwnerAccount).send({ from: windingTreeEntrypointOwner });
      assert.equal(await windingTreeEntrypoint.methods.getSegment('hotels').call(), nonOwnerAccount);
    });

    it('should return zero address for non-existing segment', async () => {
      assert.equal(await windingTreeEntrypoint.methods.getSegment('airlines').call(), help.zeroAddress);
    });
  });

  describe('getSegmentsLength', () => {
    it('should incerement the counter', async () => {
      assert.equal(await windingTreeEntrypoint.methods.getSegmentsLength().call(), 1);
      await windingTreeEntrypoint.methods.setSegment('hotels', nonOwnerAccount).send({ from: windingTreeEntrypointOwner });
      assert.equal(await windingTreeEntrypoint.methods.getSegmentsLength().call(), 2);
      await windingTreeEntrypoint.methods.setSegment('airlines', nonOwnerAccount).send({ from: windingTreeEntrypointOwner });
      assert.equal(await windingTreeEntrypoint.methods.getSegmentsLength().call(), 3);
    });

    it('should not incerement the counter whenc updating the segment', async () => {
      assert.equal(await windingTreeEntrypoint.methods.getSegmentsLength().call(), 1);
      await windingTreeEntrypoint.methods.setSegment('hotels', nonOwnerAccount).send({ from: windingTreeEntrypointOwner });
      assert.equal(await windingTreeEntrypoint.methods.getSegmentsLength().call(), 2);
      await windingTreeEntrypoint.methods.setSegment('hotels', windingTreeEntrypointOwner).send({ from: windingTreeEntrypointOwner });
      assert.equal(await windingTreeEntrypoint.methods.getSegmentsLength().call(), 2);
    });
  });

  describe('getSegmentIndex', () => {
    it('should return segment index', async () => {
      await windingTreeEntrypoint.methods.setSegment('hotels', nonOwnerAccount).send({ from: windingTreeEntrypointOwner });
      await windingTreeEntrypoint.methods.setSegment('airlines', nonOwnerAccount).send({ from: windingTreeEntrypointOwner });
      assert.equal(await windingTreeEntrypoint.methods.getSegmentIndex('hotels').call(), 1);
      assert.equal(await windingTreeEntrypoint.methods.getSegmentIndex('airlines').call(), 2);
    });

    it('should return 0 for unknown segment', async () => {
      assert.equal(await windingTreeEntrypoint.methods.getSegmentIndex('hotels').call(), 0);
    });
  });

  describe('getSegmentName', () => {
    it('should return segment name', async () => {
      await windingTreeEntrypoint.methods.setSegment('hotels', nonOwnerAccount).send({ from: windingTreeEntrypointOwner });
      await windingTreeEntrypoint.methods.setSegment('airlines', nonOwnerAccount).send({ from: windingTreeEntrypointOwner });
      const hotelIndex = await windingTreeEntrypoint.methods.getSegmentIndex('hotels').call();
      assert.equal(await windingTreeEntrypoint.methods.getSegmentName(hotelIndex).call(), 'hotels');
      const airlinesIndex = await windingTreeEntrypoint.methods.getSegmentIndex('airlines').call();
      assert.equal(await windingTreeEntrypoint.methods.getSegmentName(airlinesIndex).call(), 'airlines');
    });
  });

  describe('transferOwnership', () => {
    it('should transfer ownership', async () => {
      await windingTreeEntrypoint.methods.transferOwnership(nonOwnerAccount).send({ from: windingTreeEntrypointOwner });
      assert.equal(await windingTreeEntrypoint.methods.owner().call(), nonOwnerAccount);
    });

    it('should not transfer ownership when initiated from a non-owner', async () => {
      try {
        await windingTreeEntrypoint.methods.transferOwnership(nonOwnerAccount).send({ from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should not transfer ownership to zero address', async () => {
      try {
        await windingTreeEntrypoint.methods.transferOwnership(help.zeroAddress).send({ from: windingTreeEntrypointOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });
});

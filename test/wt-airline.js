const { TestHelper } = require('zos');
const { Contracts, ZWeb3 } = require('zos-lib');
const assert = require('chai').assert;
const help = require('./helpers/index.js');

ZWeb3.initialize(web3.currentProvider);
// workaround for https://github.com/zeppelinos/zos/issues/704
Contracts.setArtifactsDefaults({
  gas: 60000000,
});

const WTAirlineIndex = Contracts.getFromLocal('WTAirlineIndex');
const WTAirline = Contracts.getFromLocal('Airline');
// eaiser interaction with truffle-contract
const AbstractWTAirline = artifacts.require('AbstractAirline');
const AbstractWTAirlineIndex = artifacts.require('AbstractWTAirlineIndex');

contract('Airline', (accounts) => {
  const airlineUri = 'bzz://something';
  const indexOwner = accounts[1];
  const airlineAccount = accounts[2];
  const nonOwnerAccount = accounts[3];
  const tokenAddress = accounts[5];
  let project;
  let airlineAddress = help.zeroAddress;
  let wtAirlineIndex;
  let wtAirline;

  // Create and register a airline
  beforeEach(async () => {
    project = await TestHelper();
    const airlineIndexProxy = await project.createProxy(WTAirlineIndex, {
      initFunction: 'initialize',
      initArgs: [indexOwner, tokenAddress],
    });
    wtAirlineIndex = await AbstractWTAirlineIndex.at(airlineIndexProxy.address);
    await wtAirlineIndex.registerAirline(airlineUri, { from: airlineAccount });
    let address = await wtAirlineIndex.getAirlinesByManager(airlineAccount);
    airlineAddress = address[0];
    wtAirline = await AbstractWTAirline.at(address[0]);
  });

  describe('Constructor', () => {
    it('should be initialised with the correct data', async () => {
      const info = await help.getAirlineInfo(wtAirline);
      // We need callback, because getBlockNumber for some reason cannot be called with await
      const blockNumber = await help.promisify(cb => web3.eth.getBlockNumber(cb));
      assert.isAtMost(info.created, blockNumber);
      assert.equal(info.manager, airlineAccount);
      assert.equal(info.dataUri, airlineUri);
      assert.equal(info.index, wtAirlineIndex.address);
      // There's an empty address as an initial value, that's why we compare
      assert.equal((await wtAirlineIndex.getAirlines()).length, 2);
    });

    it('should properly setup manager and index references', async () => {
      assert.equal(wtAirlineIndex.address, await wtAirline.index());
      assert.equal(airlineAccount, await wtAirline.manager());
    });

    it('should not be created with zero address for a manager', async () => {
      try {
        await WTAirline.new([help.zeroAddress, 'goo.gl', wtAirlineIndex.address]);
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should not be created with zero address for an index', async () => {
      try {
        await WTAirline.new([airlineAccount, 'goo.gl', help.zeroAddress]);
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('editInfo', () => {
    const newDataUri = 'goo.gl/12345';

    it('should not update airline to an empty dataUri', async () => {
      try {
        const airline = await WTAirline.at(wtAirline.address);
        const data = await airline.methods.editInfo('').encodeABI();
        await wtAirlineIndex.callAirline(airlineAddress, data, { from: airlineAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should update airline\'s dataUri', async () => {
      const airline = await WTAirline.at(wtAirline.address);
      const data = airline.methods.editInfo(newDataUri).encodeABI();
      await wtAirlineIndex.callAirline(airlineAddress, data, { from: airlineAccount });
      const info = await help.getAirlineInfo(wtAirline);
      assert.equal(info.dataUri, newDataUri);
    });

    it('should throw if not executed by airline owner', async () => {
      try {
        const airline = await WTAirline.at(wtAirline.address);
        const data = airline.methods.editInfo(newDataUri).encodeABI();
        await wtAirlineIndex.callAirline(airlineAddress, data, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if not executed from index address', async () => {
      try {
        await wtAirline.editInfo(newDataUri, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('changeManager', () => {
    it('should throw if not executed from index address', async () => {
      try {
        await wtAirline.changeManager(nonOwnerAccount, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should change the airline manager', async () => {
      assert(await wtAirline.manager(), airlineAccount);
      await wtAirlineIndex.transferAirline(airlineAddress, nonOwnerAccount, { from: airlineAccount });
      assert(await wtAirline.manager(), nonOwnerAccount);
    });
  });
});

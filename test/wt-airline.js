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
// eaiser interaction with truffle-contract
const TruffleWTAirline = artifacts.require('Organization');
const AbstractWTAirlineIndex = artifacts.require('AbstractWTAirlineIndex');

contract('Airline', (accounts) => {
  const airlineUri = 'bzz://something';
  const indexOwner = accounts[1];
  const airlineAccount = accounts[2];
  const nonOwnerAccount = accounts[3];
  const tokenAddress = accounts[5];
  let project;
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
    await wtAirlineIndex.createAndRegisterAirline(airlineUri, { from: airlineAccount });
    let address = await wtAirlineIndex.getAirlinesByManager(airlineAccount);
    wtAirline = await TruffleWTAirline.at(address[0]);
  });

  describe('Constructor', () => {
    it('should be initialised with the correct data', async () => {
      const info = await help.getAirlineInfo(wtAirline);
      // We need callback, because getBlockNumber for some reason cannot be called with await
      const blockNumber = await help.promisify(cb => web3.eth.getBlockNumber(cb));
      assert.isAtMost(info.created, blockNumber);
      assert.equal(info.manager, airlineAccount);
      assert.equal(info.dataUri, airlineUri);
      // There's an empty address as an initial value, that's why we compare
      assert.equal((await wtAirlineIndex.getAirlines()).length, 2);
    });

    it('should properly setup manager reference', async () => {
      assert.equal(airlineAccount, await wtAirline.manager());
    });
  });

  describe('changeDataUri', () => {
    const newDataUri = 'goo.gl/12345';

    it('should not update airline to an empty dataUri', async () => {
      try {
        await wtAirline.changeDataUri('', { from: airlineAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should update airline\'s dataUri', async () => {
      await wtAirline.changeDataUri(newDataUri, { from: airlineAccount });
      const info = await help.getAirlineInfo(wtAirline);
      assert.equal(info.dataUri, newDataUri);
    });

    it('should throw if not executed by airline owner', async () => {
      try {
        await wtAirline.changeDataUri(newDataUri, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('transferOwnership', () => {
    it('should throw if not executed from owner address', async () => {
      try {
        await wtAirline.transferOwnership(nonOwnerAccount, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });
});

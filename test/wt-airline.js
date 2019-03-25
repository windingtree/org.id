const assert = require('chai').assert;
const help = require('./helpers/index.js');
const abiDecoder = require('abi-decoder');

const AdminUpgradeabilityProxy = artifacts.require('AdminUpgradeabilityProxy');
const WTAirlineIndex = artifacts.require('WTAirlineIndex.sol');
const WTAirline = artifacts.require('Airline.sol');
const AbstractWTAirline = artifacts.require('AbstractAirline.sol');

abiDecoder.addABI(AbstractWTAirline._json.abi);
abiDecoder.addABI(WTAirlineIndex._json.abi);

contract('Airline', (accounts) => {
  const airlineUri = 'bzz://something';
  const indexOwner = accounts[1];
  const airlineAccount = accounts[2];
  const nonOwnerAccount = accounts[3];
  const tokenAddress = accounts[5];
  let airlineAddress = help.zeroAddress;
  let wtAirlineIndex;
  let wtAirline;

  // Create and register a airline
  beforeEach(async () => {
    const indexDeployed = await WTAirlineIndex.new({ from: indexOwner });
    indexDeployed.web3Instance = new web3.eth.Contract(indexDeployed.abi, indexDeployed.address);
    const initializeData = indexDeployed.web3Instance.methods.initialize(indexOwner, tokenAddress).encodeABI();
    const indexProxy = await AdminUpgradeabilityProxy.new(indexDeployed.address, initializeData, { from: indexOwner });
    wtAirlineIndex = await WTAirlineIndex.at(indexProxy.address);

    await wtAirlineIndex.registerAirline(airlineUri, { from: airlineAccount });
    let address = await wtAirlineIndex.getAirlinesByManager(airlineAccount);
    airlineAddress = address[0];
    wtAirline = await WTAirline.at(address[0]);
    wtAirline.web3Instance = new web3.eth.Contract(wtAirline.abi, wtAirline.address);
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
        await WTAirline.new(help.zeroAddress, 'goo.gl', wtAirlineIndex.address);
        throw new Error('should not have been called');
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should not be created with zero address for an index', async () => {
      try {
        await WTAirline.new(airlineAccount, 'goo.gl', help.zeroAddress);
        throw new Error('should not have been called');
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('editInfo', () => {
    const newDataUri = 'goo.gl/12345';

    it('should not update airline to an empty dataUri', async () => {
      try {
        const data = await wtAirline.web3Instance.methods.editInfo('').encodeABI();
        await wtAirlineIndex.callAirline(airlineAddress, data, { from: airlineAccount });
        throw new Error('should not have been called');
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should update airline\'s dataUri', async () => {
      const data = wtAirline.web3Instance.methods.editInfo(newDataUri).encodeABI();
      await wtAirlineIndex.callAirline(airlineAddress, data, { from: airlineAccount });
      const info = await help.getAirlineInfo(wtAirline);
      assert.equal(info.dataUri, newDataUri);
    });

    it('should throw if not executed by airline owner', async () => {
      try {
        const data = wtAirline.web3Instance.methods.editInfo(newDataUri).encodeABI();
        await wtAirlineIndex.callAirline(airlineAddress, data, { from: nonOwnerAccount });
        throw new Error('should not have been called');
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if not executed from index address', async () => {
      try {
        await wtAirline.editInfo(newDataUri, { from: nonOwnerAccount });
        throw new Error('should not have been called');
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('changeManager', () => {
    it('should throw if not executed from index address', async () => {
      try {
        await wtAirline.changeManager(nonOwnerAccount, { from: nonOwnerAccount });
        throw new Error('should not have been called');
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

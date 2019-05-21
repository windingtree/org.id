const { TestHelper } = require('zos');
const { Contracts, ZWeb3 } = require('zos-lib');
const assert = require('chai').assert;
const help = require('./helpers/index.js');

ZWeb3.initialize(web3.currentProvider);
// workaround for https://github.com/zeppelinos/zos/issues/704
Contracts.setArtifactsDefaults({
  gas: 60000000,
});

const WTHotelIndex = Contracts.getFromLocal('WTHotelIndex');
// eaiser interaction with truffle-contract
const TruffleWTHotel = artifacts.require('Organization');
const AbstractWTHotelIndex = artifacts.require('AbstractWTHotelIndex');

contract('Hotel', (accounts) => {
  const hotelUri = 'bzz://something';
  const indexOwner = accounts[1];
  const hotelAccount = accounts[2];
  const nonOwnerAccount = accounts[3];
  const tokenAddress = accounts[5];
  let project;
  let wtHotelIndex;
  let wtHotel;

  // Create and register a hotel
  beforeEach(async () => {
    project = await TestHelper();
    const hotelIndexProxy = await project.createProxy(WTHotelIndex, {
      initFunction: 'initialize',
      initArgs: [indexOwner, tokenAddress],
    });
    wtHotelIndex = await AbstractWTHotelIndex.at(hotelIndexProxy.address);
    await wtHotelIndex.createAndRegisterHotel(hotelUri, { from: hotelAccount });
    let address = await wtHotelIndex.getHotelsByManager(hotelAccount);
    wtHotel = await TruffleWTHotel.at(address[0]);
  });

  describe('Constructor', () => {
    it('should be initialised with the correct data', async () => {
      const info = await help.getHotelInfo(wtHotel);
      // We need callback, because getBlockNumber for some reason cannot be called with await
      const blockNumber = await help.promisify(cb => web3.eth.getBlockNumber(cb));
      assert.isAtMost(info.created, blockNumber);
      assert.equal(info.manager, hotelAccount);
      assert.equal(info.dataUri, hotelUri);
      assert.equal(info.index, wtHotelIndex.address);
      // There's an empty address as an initial value, that's why we compare
      assert.equal((await wtHotelIndex.getHotels()).length, 2);
    });

    it('should properly setup manager and index references', async () => {
      assert.equal(wtHotelIndex.address, await wtHotel.index());
      assert.equal(hotelAccount, await wtHotel.manager());
    });

    it('should not be created with zero address for a manager', async () => {
      try {
        await TruffleWTHotel.new(help.zeroAddress, 'goo.gl', wtHotelIndex.address);
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should not be created with zero address for an index', async () => {
      try {
        await TruffleWTHotel.new(hotelAccount, 'goo.gl', help.zeroAddress);
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('changeDataUri', () => {
    const newDataUri = 'goo.gl/12345';

    it('should not update hotel to an empty dataUri', async () => {
      try {
        await wtHotel.changeDataUri('', { from: hotelAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should update hotel\'s dataUri', async () => {
      await wtHotel.changeDataUri(newDataUri, { from: hotelAccount });
      const info = await help.getHotelInfo(wtHotel);
      assert.equal(info.dataUri, newDataUri);
    });

    it('should throw if not executed by hotel owner', async () => {
      try {
        await wtHotel.changeDataUri(newDataUri, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('transferOwnership', () => {
    it('should throw if not executed from index address', async () => {
      try {
        await wtHotel.transferOwnership(nonOwnerAccount, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });
});

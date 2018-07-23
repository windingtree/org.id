const assert = require('chai').assert;
const help = require('./helpers/index.js');
const abiDecoder = require('abi-decoder');

const WTIndex = artifacts.require('WTIndex.sol');
const WTHotel = artifacts.require('Hotel.sol');
const AbstractWTHotel = artifacts.require('AbstractHotel.sol');
const AbstractBaseContract = artifacts.require('AbstractBaseContract.sol');

abiDecoder.addABI(AbstractWTHotel._json.abi);
abiDecoder.addABI(WTIndex._json.abi);

contract('Hotel', (accounts) => {
  const hotelUri = 'bzz://something';
  const hotelAccount = accounts[2];
  const nonOwnerAccount = accounts[3];
  let hotelAddress = help.zeroAddress;
  let wtIndex;
  let wtHotel;

  // Create and register a hotel
  beforeEach(async () => {
    wtIndex = await WTIndex.new();
    await wtIndex.registerHotel(hotelUri, { from: hotelAccount });
    let address = await wtIndex.getHotelsByManager(hotelAccount);
    hotelAddress = address[0];
    wtHotel = WTHotel.at(address[0]);
  });

  describe('Constructor', () => {
    it('should be initialised with the correct data', async () => {
      const info = await help.getHotelInfo(wtHotel);
      // We need callback, because getBlockNumber for some reason cannot be called with await
      const blockNumber = await help.promisify(cb => web3.eth.getBlockNumber(cb));
      assert.isAtMost(info.created, blockNumber);
      assert.equal(info.owner, hotelAccount);
      assert.equal(info.dataUri, hotelUri);
      assert.equal(info.index, wtIndex.contract.address);
      // There's an empty address as an initial value, that's why we compare
      assert.equal((await wtIndex.getHotels()).length, 2);
    });

    it('should properly setup owner and index references', async () => {
      assert.equal(wtIndex.contract.address, await wtHotel.index());
      assert.equal(hotelAccount, await wtHotel.owner());
    });

    it('should have the correct version and contract type', async () => {
      let base = await AbstractBaseContract.at(wtHotel.address);
      assert.equal(help.bytes32ToString(await base.version()), help.version);
      assert.equal(help.bytes32ToString(await base.contractType()), 'hotel');
    });

    it('should not be created with zero address for a manager', async () => {
      try {
        await WTHotel.new(help.zeroAddress, 'goo.gl', wtIndex.contract.address);
        throw new Error('should not have been called');
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should not be created with zero address for an index', async () => {
      try {
        await WTHotel.new(hotelAccount, 'goo.gl', help.zeroAddress);
        throw new Error('should not have been called');
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('editInfo', () => {
    const newDataUri = 'goo.gl/12345';

    it('should not update hotel to an empty dataUri', async () => {
      try {
        const data = await wtHotel.contract.editInfo.getData('');
        await wtIndex.callHotel(hotelAddress, data, { from: hotelAccount });
        throw new Error('should not have been called');
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should update hotel\'s dataUri', async () => {
      const data = wtHotel.contract.editInfo.getData(newDataUri);
      await wtIndex.callHotel(hotelAddress, data, { from: hotelAccount });
      const info = await help.getHotelInfo(wtHotel);
      assert.equal(info.dataUri, newDataUri);
    });

    it('should throw if not executed by hotel owner', async () => {
      try {
        const data = wtHotel.contract.editInfo.getData(newDataUri);
        await wtIndex.callHotel(hotelAddress, data, { from: nonOwnerAccount });
        throw new Error('should not have been called');
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if not executed from index address', async () => {
      try {
        await wtHotel.contract.editInfo(newDataUri, { from: nonOwnerAccount });
        throw new Error('should not have been called');
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });
});

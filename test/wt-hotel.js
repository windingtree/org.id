const assert = require('chai').assert;
const help = require('./helpers/index.js');
const abiDecoder = require('abi-decoder');

const WTIndex = artifacts.require('WTIndex.sol');
const WTHotel = artifacts.require('Hotel.sol');
const WTHotelInterface = artifacts.require('Hotel_Interface.sol');
const BaseInterface = artifacts.require('Base_Interface.sol');

abiDecoder.addABI(WTHotelInterface._json.abi);
abiDecoder.addABI(WTIndex._json.abi);

contract('Hotel', (accounts) => {
  const hotelUrl = 'bzz://something';
  const hotelHash = help.hashCustomId('WT Test Hotel');
  const hotelAccount = accounts[2];
  const nonOwnerAccount = accounts[3];
  let wtIndex;
  let wtHotel;

  describe('Constructor', () => {
    // Create and register a hotel
    beforeEach(async () => {
      wtIndex = await WTIndex.new();
      await wtIndex.registerHotel(hotelUrl, hotelHash, { from: hotelAccount });
      let address = await wtIndex.getHotelsByManager(hotelAccount);
      wtHotel = WTHotel.at(address[0]);
    });

    it('should be initialised with the correct data', async () => {
      const info = await help.getHotelInfo(wtHotel);
      assert.equal(info.url, hotelUrl);
      assert.equal(info.customIdHash, hotelHash);
      // We need callback, because getBlockNumber for some reason cannot be called with await
      return web3.eth.getBlockNumber(async (err, value) => {
        assert.isAtMost(info.created, value);
        assert.equal(info.manager, hotelAccount);
        assert.equal((await wtIndex.getHotels()).length, 2);
      });
    });

    it('should be indexed', async () => {
      assert.equal(wtIndex.contract.address, await wtHotel.owner());
      assert.equal(hotelAccount, await wtHotel.manager());
    });

    it('should have the correct version and contract type', async () => {
      let base = await BaseInterface.at(wtHotel.address);
      assert.equal(help.bytes32ToString(await base.version()), help.version);
      assert.equal(help.bytes32ToString(await base.contractType()), 'hotel');
    });
  });

  describe('editInfo', () => {
    const newUrl = 'goo.gl/12345';
    const newHotelHash = help.hashCustomId('hotel-12345');

    it('should not update hotel to an empty url', async () => {
      try {
        const data = await wtHotel.contract.editInfo.getData('', newHotelHash);
        await wtIndex.callHotel(hotelHash, data, { from: hotelAccount });
        throw new Error('should not have been called')
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }      
    });

    it('should update hotel\'s url and custom id hash', async () => {
      const data = wtHotel.contract.editInfo.getData(newUrl, newHotelHash);
      await wtIndex.callHotel(hotelHash, data, { from: hotelAccount });
      const info = await help.getHotelInfo(wtHotel);

      assert.equal(info.url, newUrl);
      assert.equal(info.customIdHash, newHotelHash);
    });

    it('should throw if not executed by owner', async () => {
      try {
        await wtHotel.editInfo(newUrl, newHotelHash, { from: nonOwnerAccount });
        throw new Error('should not have been called')
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });
});

const assert = require('chai').assert;
const help = require('./helpers/index.js');
const abiDecoder = require('abi-decoder');

const WTIndex = artifacts.require('WTIndex.sol');
const WTHotel = artifacts.require('Hotel.sol');
const WTHotelInterface = artifacts.require('Hotel_Interface.sol');
const BaseInterface = artifacts.require('Base_Interface.sol');

abiDecoder.addABI(WTHotelInterface._json.abi);
abiDecoder.addABI(WTIndex._json.abi);

contract('Hotel', function (accounts) {
  const hotelName = 'WTHotel';
  const hotelDescription = 'WT Test Hotel';
  const hotelAccount = accounts[2];
  const nonOwnerAccount = accounts[3];
  let wtIndex;
  let wtHotel;

  // Create and register a hotel
  beforeEach(async function () {
    wtIndex = await WTIndex.new();
    await wtIndex.registerHotel(hotelName, hotelDescription, { from: hotelAccount });
    let address = await wtIndex.getHotelsByManager(hotelAccount);
    wtHotel = WTHotel.at(address[0]);
  });

  describe('Constructor', function () {
    it('should be initialised with the correct data', async function () {
      const info = await help.getHotelInfo(wtHotel);
      assert.equal(info.name, hotelName);
      assert.equal(info.description, hotelDescription);
      assert.isAtMost(info.created, web3.eth.blockNumber);
      assert.equal(info.manager, hotelAccount);

      let base = await BaseInterface.at(wtHotel.address);
      assert.equal(help.bytes32ToString(await base.version()), help.version);
      assert.equal(help.bytes32ToString(await base.contractType()), 'hotel');
      assert.equal((await wtIndex.contract.getHotels()).length, 2);
    });

    it('should be indexed', async function () {
      assert.equal(wtIndex.contract.address, await wtHotel.owner());
      assert.equal(hotelAccount, await wtHotel.manager());
    });
  });

  describe('editInfo', function () {
    const newName = 'Claridges';
    const newDescription = 'Near everything';

    it('should edit the hotel name and description', async function () {
      const data = wtHotel.contract.editInfo.getData(newName, newDescription);
      await wtIndex.callHotel(0, data, { from: hotelAccount });
      const info = await help.getHotelInfo(wtHotel);

      assert.equal(info.name, newName);
      assert.equal(info.description, newDescription);
    });

    it('should throw if not executed by owner', async function () {
      try {
        await wtHotel.editInfo(newName, newDescription, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });
});

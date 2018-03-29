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
  const hotelName = 'WTHotel';
  const hotelDescription = 'WT Test Hotel';
  const hotelAccount = accounts[2];
  const nonOwnerAccount = accounts[3];
  let wtIndex;
  let wtHotel;

  xdescribe('Constructor', () => {
    // Create and register a hotel
    beforeEach(async () => {
      wtIndex = await WTIndex.new();
      await wtIndex.registerHotel(hotelName, hotelDescription, { from: hotelAccount });
      let address = await wtIndex.getHotelsByManager(hotelAccount);
      wtHotel = WTHotel.at(address[0]);
    });

    it('should be initialised with the correct data', async () => {
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

    it('should be indexed', async () => {
      assert.equal(wtIndex.contract.address, await wtHotel.owner());
      assert.equal(hotelAccount, await wtHotel.manager());
    });
  });

  xdescribe('version', () => {
    it('should have the correct version and contract type', async () => {
      let base = await BaseInterface.at(wtHotel.address);
      assert.equal(help.bytes32ToString(await base.version()), help.version);
      assert.equal(help.bytes32ToString(await base.contractType()), 'wtindex');
    });
  });

  xdescribe('editInfo', () => {
    const newName = 'Claridges';
    const newDescription = 'Near everything';

    it('should not update hotel to an empty url', () => {

    });

    it('should not update hotel to an empty custom id hash', () => {

    });

    it('should update hotel\'s url and custom id hash', async () => {
      const data = wtHotel.contract.editInfo.getData(newName, newDescription);
      await wtIndex.callHotel(0, data, { from: hotelAccount });
      const info = await help.getHotelInfo(wtHotel);

      assert.equal(info.name, newName);
      assert.equal(info.description, newDescription);
    });

    it('should throw if not executed by owner', async () => {
      try {
        await wtHotel.editInfo(newName, newDescription, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });
});

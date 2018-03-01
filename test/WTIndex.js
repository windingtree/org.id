const assert = require('chai').assert;
const help = require('./helpers/index.js');

const WTIndex = artifacts.require('./WTIndex.sol');
const WTHotel = artifacts.require('Hotel.sol');
const BaseInterface = artifacts.require('Base_Interface.sol');

contract('WTIndex', function (accounts) {
  const indexOwner = accounts[1];
  const hotelAccount = accounts[2];
  const nonOwnerAccount = accounts[3];

  let index;

  beforeEach(async () => {
    index = await WTIndex.new({ from: indexOwner });
  });

  describe('version', () => {
    it('should have the correct version and contract type', async () => {
      let base = await BaseInterface.at(index.address);
      assert.equal(help.bytes32ToString(await base.version()), help.version);
      assert.equal(help.bytes32ToString(await base.contractType()), 'wtindex');
    });
  });

  describe('setDAO', () => {
    const daoAddress = accounts[4];

    it('should set the DAOs address', async () => {
      await index.setDAO(daoAddress, { from: indexOwner });
      const setValue = await index.DAO();

      assert.equal(setValue, daoAddress);
    });

    it('should throw if non-owner sets the DAO', async () => {
      try {
        await index.setDAO(daoAddress, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('setLifToken', () => {
    const tokenAddress = accounts[5];

    it('should set the LifToken address', async () => {
      await index.setLifToken(tokenAddress, { from: indexOwner });
      const setValue = await index.LifToken();

      assert.equal(setValue, tokenAddress);
    });

    it('should throw if non-owner sets the LifToken address', async () => {
      try {
        await index.setLifToken(tokenAddress, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('registerHotel', () => {
    const expectedIndexPos = 1; // Position of the first hotel

    it('should add a hotel to the registry', async () => {
      await index.registerHotel('name', 'desc', { from: hotelAccount });
      const length = await index.getHotelsLength();

      const allHotels = await help.jsArrayFromSolidityArray(
        index.hotels,
        length,
        help.isZeroAddress
      );

      const hotelsByManager = await index.getHotelsByManager(hotelAccount);
      const actualIndexPos = await index.hotelsIndex(allHotels[0]);

      const hotel = allHotels[0];
      const hotelByManager = hotelsByManager[0];

      assert.isDefined(hotel);
      assert.isDefined(hotelByManager);
      assert.isFalse(help.isZeroAddress(hotel));
      assert.isFalse(help.isZeroAddress(hotelByManager));

      assert.equal(actualIndexPos, expectedIndexPos);
      assert.equal(hotel, hotelsByManager);
    });
  });

  describe('deleteHotel', () => {
    const expectedIndexPos = 0; // Position of the hotel in the managers array

    it('should remove a hotel', async () => {
      await index.registerHotel('name', 'desc', { from: hotelAccount });
      const length = await index.getHotelsLength();

      let allHotels = await help.jsArrayFromSolidityArray(
        index.hotels,
        length,
        help.isZeroAddress
      );
      const hotel = allHotels[0];

      // Verify existence
      assert((await web3.eth.getCode(hotel)) !== '0x0');
      assert.isDefined(hotel);
      assert.isFalse(help.isZeroAddress(hotel));

      // Remove and verify non-existence of hotel
      await index.deleteHotel(expectedIndexPos, { from: hotelAccount });

      allHotels = await help.jsArrayFromSolidityArray(
        index.hotels,
        length,
        help.isZeroAddress
      );

      const hotelsByManager = await index.getHotelsByManager(hotelAccount);
      const hotelDeleted = help.isZeroAddress(hotelsByManager[expectedIndexPos]);

      assert.equal(allHotels.length, 0);
      assert.isTrue(hotelDeleted);
      assert((await web3.eth.getCode(hotel)) === '0x0');
    });

    it('should throw if the hotel is not registered', async () => {
      await index.registerHotel('name', 'desc', { from: hotelAccount });

      try {
        const invalidIndexPos = 1;
        await index.deleteHotel(invalidIndexPos, { from: hotelAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if non-owner removes', async () => {
      await index.registerHotel('name', 'desc', { from: hotelAccount });

      try {
        await index.deleteHotel(expectedIndexPos, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('callHotel', async () => {
    let wtHotel;

    beforeEach(async () => {
      await index.registerHotel('name', 'desc', { from: hotelAccount });
      let address = await index.getHotelsByManager(hotelAccount);
      wtHotel = WTHotel.at(address[0]);
    });

    it('should throw if sender address does not exist in hotelsByManager mapping', async () => {
      const data = wtHotel.contract.editInfo.getData('newName', 'newDesc');
      try {
        await index.callHotel(0, data, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if hotel index does not exist', async () => {
      const data = wtHotel.contract.editInfo.getData('newName', 'newDesc');
      try {
        await index.callHotel(1, data, { from: hotelAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });
});

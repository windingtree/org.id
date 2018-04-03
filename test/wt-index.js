const assert = require('chai').assert;
const help = require('./helpers/index.js');

const WTIndex = artifacts.require('./WTIndex.sol');
const WTHotel = artifacts.require('Hotel.sol');
const BaseInterface = artifacts.require('Base_Interface.sol');

contract('WTIndex', (accounts) => {
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

  describe('hotels', () => {
    describe('registerHotel', () => {
      const expectedIndexPos = 1; // Position of the first hotel

      it('should not register hotel with empty url', async () => {
        try {
          await index.registerHotel('', help.hashCustomId('myid'), { from: hotelAccount });
          throw new Error('should not have been called');
        } catch (e) {
          assert(help.isInvalidOpcodeEx(e));
        }
      });

      it('should add a hotel to the registry', async () => {
        await index.registerHotel('url', help.hashCustomId('myid'), { from: hotelAccount });
        const length = await index.getHotelsLength();

        const allHotels = await help.jsArrayFromSolidityArray(
          index.hotels,
          length,
          help.isZeroAddress
        );

        const hotelsByManager = await index.getHotelsByManager(hotelAccount);
        const actualIndexPos = await index.hotelsIndex(allHotels[0]);
        const hotelByCustomId = await index.getHotel(hotelAccount, help.hashCustomId('myid'));

        const hotel = allHotels[0];
        const hotelByManager = hotelsByManager[0];

        assert.isDefined(hotel);
        assert.isDefined(hotelByManager);
        assert.isDefined(hotelByCustomId);
        assert.isFalse(help.isZeroAddress(hotel));
        assert.isFalse(help.isZeroAddress(hotelByManager));
        assert.isFalse(help.isZeroAddress(hotelByCustomId));

        assert.equal(actualIndexPos, expectedIndexPos);
        assert.equal(hotel, hotelsByManager);
        assert.equal(hotel, hotelByCustomId);

        const hotelInstance = await WTHotel.at(hotel);
        assert.equal(await hotelInstance.customIdHash(), help.hashCustomId('myid'));
      });
    });

    describe('deleteHotel', () => {
      const expectedIndexPos = 0; // Position of the hotel in the managers array

      it('should remove a hotel', async () => {
        const customHash = help.hashCustomId('desc');
        await index.registerHotel('name', customHash, { from: hotelAccount });
        const length = await index.getHotelsLength();

        let allHotels = await help.jsArrayFromSolidityArray(
          index.hotels,
          length,
          help.isZeroAddress
        );

        const hotel = allHotels[0];
        // Verify existence
        assert.isDefined(hotel);
        assert.isFalse(help.isZeroAddress(hotel));

        // Remove and verify non-existence of hotel
        await index.deleteHotel(customHash, { from: hotelAccount });
        allHotels = await help.jsArrayFromSolidityArray(
          index.hotels,
          length,
          help.isZeroAddress
        );
        const hotelsByManager = await index.getHotelsByManager(hotelAccount);
        const hotelDeleted = help.isZeroAddress(hotelsByManager[expectedIndexPos]);

        assert.equal(allHotels.length, 0);
        assert.isTrue(hotelDeleted);
        await WTHotel.at(hotel).then(() => {}).catch((e) => {
          assert.match(e.message, /no code at address/i);
        });
      });

      it('should throw if the hotel is not registered', async () => {
        await index.registerHotel('name', help.hashCustomId('desc'), { from: hotelAccount });

        try {
          await index.deleteHotel('some other hash', { from: hotelAccount });
          assert(false);
        } catch (e) {
          assert(help.isInvalidOpcodeEx(e));
        }
      });

      it('should throw if non-owner removes', async () => {
        await index.registerHotel('name', help.hashCustomId('desc'), { from: hotelAccount });

        try {
          await index.deleteHotel(help.hashCustomId('desc'), { from: nonOwnerAccount });
          assert(false);
        } catch (e) {
          assert(help.isInvalidOpcodeEx(e));
        }
      });
    });

    describe('callHotel', async () => {
      let wtHotel, customHash;

      beforeEach(async () => {
        customHash = help.hashCustomId('desc');
        await index.registerHotel('name', customHash, { from: hotelAccount });
        let address = await index.getHotelsByManager(hotelAccount);
        wtHotel = WTHotel.at(address[0]);
      });

      it('should throw if sender address does not exist in hotelsByManager mapping', async () => {
        const data = wtHotel.contract.editInfo.getData('newName', 'newDesc');
        try {
          await index.callHotel(customHash, data, { from: nonOwnerAccount });
          throw new Error('should not have been called');
        } catch (e) {
          assert(help.isInvalidOpcodeEx(e));
        }
      });

      it('should throw if hotel index does not exist', async () => {
        const data = wtHotel.contract.editInfo.getData('newName', 'newDesc');
        try {
          await index.callHotel('random', data, { from: hotelAccount });
          throw new Error('should not have been called');
        } catch (e) {
          assert(help.isInvalidOpcodeEx(e));
        }
      });
    });
  });

  describe('data getters', () => {
    describe('getHotelsLength', () => {
      it('should count hotels properly', async () => {
        // length is a bignumber
        let length = await index.getHotelsLength();
        // We start with empty address on the zero index
        assert.equal(length.toNumber(), 1);
        await index.registerHotel('aaa', help.hashCustomId('myid'), { from: hotelAccount });
        length = await index.getHotelsLength();
        assert.equal(length.toNumber(), 2);
        await index.registerHotel('bbb', help.hashCustomId('myid2'), { from: hotelAccount });
        length = await index.getHotelsLength();
        assert.equal(length.toNumber(), 3);
        await index.deleteHotel(help.hashCustomId('myid'), { from: hotelAccount });
        length = await index.getHotelsLength();
        // length counts zero addresses
        assert.equal(length.toNumber(), 3);
      });
    });

    describe('getHotels', () => {
      it('should return hotels properly', async () => {
        let hotels = await index.getHotels();
        assert.equal(help.filterZeroAddresses(hotels).length, 0);
        await index.registerHotel('aaa', help.hashCustomId('myid'), { from: hotelAccount });
        hotels = await index.getHotels();
        assert.equal(help.filterZeroAddresses(hotels).length, 1);
        await index.registerHotel('bbb', help.hashCustomId('myid2'), { from: hotelAccount });
        hotels = await index.getHotels();
        assert.equal(help.filterZeroAddresses(hotels).length, 2);
        await index.deleteHotel(help.hashCustomId('myid'), { from: hotelAccount });
        hotels = await index.getHotels();
        assert.equal(help.filterZeroAddresses(hotels).length, 1);
      });
    });

    describe('getHotel', () => {
      it('should return existing hotel', async () => {
        await index.registerHotel('bbb', help.hashCustomId('myid2'), { from: hotelAccount });
        const hotel = await index.getHotel(hotelAccount, help.hashCustomId('myid2'));
        assert.isDefined(hotel);
        assert(!help.isZeroAddress(hotel));
      });

      it('should return empty address for non-existing hotel', async () => {
        const hotel = await index.getHotel(hotelAccount, help.hashCustomId('myid2'));
        assert.isDefined(hotel);
        assert(help.isZeroAddress(hotel));
      });
    });

    describe('getHotelsByManager', () => {
      it('should return list of hotels for existing manager', async () => {
        await index.registerHotel('bbb', help.hashCustomId('myid2'), { from: hotelAccount });
        const hotelList = await index.getHotelsByManager(hotelAccount);
        assert.equal(hotelList.length, 1);
      })

      it('should return empty list for a manager without hotels', async () => {
        const hotelList = await index.getHotelsByManager(hotelAccount);
        assert.equal(hotelList.length, 0);
      })

      it('should return empty list for a non-existing manager', async () => {
        const hotelList = await index.getHotelsByManager(nonOwnerAccount);
        assert.equal(hotelList.length, 0);
      })
    });
  });
});

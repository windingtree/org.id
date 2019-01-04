const assert = require('chai').assert;
const help = require('./helpers/index.js');

const AdminUpgradeabilityProxy = artifacts.require('AdminUpgradeabilityProxy');
const WTIndex = artifacts.require('WTIndex');
const WTHotel = artifacts.require('Hotel');
const AbstractWTIndex = artifacts.require('AbstractWTIndex');
const AbstractBaseContract = artifacts.require('AbstractBaseContract');

contract('WTIndex', (accounts) => {
  const indexOwner = accounts[1];
  const proxyOwner = accounts[2];
  const hotelAccount = accounts[3];
  const nonOwnerAccount = accounts[4];

  let index;

  // Deploy new index but use AbstractWTIndex for contract interaction
  beforeEach(async () => {
    const indexDeployed = await WTIndex.new({ from: indexOwner });
    indexDeployed.web3Instance = new web3.eth.Contract(indexDeployed.abi, indexDeployed.address);
    const initializeData = indexDeployed.web3Instance.methods.initialize(indexOwner).encodeABI();
    const indexProxy = await AdminUpgradeabilityProxy.new(indexDeployed.address, initializeData, {from: proxyOwner});
    index = await AbstractWTIndex.at(indexProxy.address);
  });

  describe('version', () => {
    it('should have the correct version and contract type', async () => {
      assert.equal(help.bytes32ToString(await index.version()), help.version);
      assert.equal(help.bytes32ToString(await index.contractType()), 'wtindex');
    });
  });

  describe('setLifToken', () => {
    const tokenAddress = accounts[5];

    it('should set the LifToken address', async () => {
      const wtIndex = await WTIndex.at(index.address);
      await wtIndex.setLifToken(tokenAddress, {from: indexOwner});
      const setValue = await wtIndex.LifToken();

      assert.equal(setValue, tokenAddress);
    });

    it('should throw if non-owner sets the LifToken address', async () => {
      try {
        await (await WTIndex.at(index.address)).setLifToken(tokenAddress, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('hotels', () => {
    describe('registerHotel', () => {
      const expectedIndexPos = 1; // Position of the first hotel

      it('should not register hotel with empty dataUri', async () => {
        try {
          await index.registerHotel('', { from: hotelAccount });
          throw new Error('should not have been called');
        } catch (e) {
          assert(help.isInvalidOpcodeEx(e));
        }
      });

      it('should put hotel where we expect it to be', async () => {
        const indexNonce = await help.promisify(cb => web3.eth.getTransactionCount(index.address, cb));
        const hotelAddress = help.determineAddress(index.address, indexNonce);
        await index.registerHotel('dataUri', { from: hotelAccount });
        let address = await index.getHotelsByManager(hotelAccount);
        assert.equal(hotelAddress, address[0]);
      });

      it('should return new hotel address', async () => {
        const indexNonce = await help.promisify(cb => web3.eth.getTransactionCount(index.address, cb));
        const hotelAddress = help.determineAddress(index.address, indexNonce);
        // This does not actually create the hotel... but it does spit out the return value
        const result = await index.registerHotel.call('dataUri', { from: hotelAccount });
        assert.equal(result, hotelAddress);
      });

      it('should add a hotel to the registry', async () => {
        await index.registerHotel('dataUri', { from: hotelAccount });
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

        const hotelInstance = await WTHotel.at(hotel);
        assert.equal(await hotelInstance.dataUri(), 'dataUri');
      });
    });

    describe('deleteHotel', () => {
      const expectedIndexPos = 0; // Position of the hotel in the managers array

      it('should remove a hotel', async () => {
        await index.registerHotel('dataUri', { from: hotelAccount });
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
        await index.deleteHotel(hotel, { from: hotelAccount });
        allHotels = await help.jsArrayFromSolidityArray(
          index.hotels,
          length,
          help.isZeroAddress
        );
        const hotelsByManager = await index.getHotelsByManager(hotelAccount);
        const hotelDeleted = help.isZeroAddress(hotelsByManager[expectedIndexPos]);

        assert.equal(allHotels.length, 0);
        assert.isTrue(hotelDeleted);
        const code = await help.promisify(cb => web3.eth.getCode(hotel, cb));
        assert.equal(code, '0x');
      });

      it('should throw if the hotel is not registered', async () => {
        try {
          // Mocking address with existing contract
          await index.deleteHotel(nonOwnerAccount, { from: hotelAccount });
          assert(false);
        } catch (e) {
          assert(help.isInvalidOpcodeEx(e));
        }
      });

      it('should throw if hotel has zero address', async () => {
        try {
          // Mocking address with existing contract
          await index.deleteHotel(help.zeroAddress, { from: hotelAccount });
          assert(false);
        } catch (e) {
          assert(help.isInvalidOpcodeEx(e));
        }
      });

      it('should throw if non-owner removes', async () => {
        await index.registerHotel('name', { from: hotelAccount });
        const hotelsByManager = await index.getHotelsByManager(hotelAccount);
        const hotel = hotelsByManager[0];

        try {
          await index.deleteHotel(hotel, { from: nonOwnerAccount });
          assert(false);
        } catch (e) {
          assert(help.isInvalidOpcodeEx(e));
        }
      });
    });

    describe('callHotel', async () => {
      let wtHotel, hotelAddress;

      beforeEach(async () => {
        await index.registerHotel('dataUri', { from: hotelAccount });
        let address = await index.getHotelsByManager(hotelAccount);
        hotelAddress = address[0];
        wtHotel = await WTHotel.at(address[0]);
        wtHotel.web3Instance = new web3.eth.Contract(wtHotel.abi, wtHotel.address);
      });

      it('should proceed when calling as an owner', async () => {
        const data = wtHotel.web3Instance.methods.editInfo('newDataUri').encodeABI();
        await index.callHotel(hotelAddress, data, { from: hotelAccount });
        assert.equal('newDataUri', await wtHotel.dataUri());
      });

      it('should throw if calling as a non-owner', async () => {
        const data = wtHotel.web3Instance.methods.editInfo('newUri').encodeABI();
        try {
          await index.callHotel(hotelAddress, data, { from: nonOwnerAccount });
          throw new Error('should not have been called');
        } catch (e) {
          assert(help.isInvalidOpcodeEx(e));
        }
      });

      it('should throw if a hotel has zero address', async () => {
        const data = wtHotel.web3Instance.methods.editInfo('newUri').encodeABI();
        try {
          // Mocking address with existing contract
          await index.callHotel(help.zeroAddress, data, { from: hotelAccount });
          assert(false);
        } catch (e) {
          assert(help.isInvalidOpcodeEx(e));
        }
      });

      it('should throw if hotel does not exist', async () => {
        const data = wtHotel.web3Instance.methods.editInfo('newUri').encodeABI();
        try {
          // mocking address with existing account
          await index.callHotel(nonOwnerAccount, data, { from: hotelAccount });
          throw new Error('should not have been called');
        } catch (e) {
          assert(help.isInvalidOpcodeEx(e));
        }
      });
    });
  });

  describe('transferHotel', () => {
    let hotelAddress;

    beforeEach(async () => {
      await index.registerHotel('dataUri', { from: hotelAccount });
      let address = await index.getHotelsByManager(hotelAccount);
      hotelAddress = address[0];
    });

    it('should throw if transferring to a zero address', async () => {
      try {
        await index.transferHotel(hotelAddress, help.zeroAddress, { from: hotelAccount });
        throw new Error('should not have been called');
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if transferring a non-existing hotel', async () => {
      try {
        await index.transferHotel(index.address, nonOwnerAccount, { from: hotelAccount });
        throw new Error('should not have been called');
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if not executed from hotel owner address', async () => {
      try {
        await index.transferHotel(hotelAddress, nonOwnerAccount, { from: nonOwnerAccount });
        throw new Error('should not have been called');
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should change the hotel manager', async () => {
      assert.equal(help.filterZeroAddresses(await index.getHotelsByManager(hotelAccount)).length, 1);
      assert.equal(help.filterZeroAddresses(await index.getHotelsByManager(nonOwnerAccount)).length, 0);
      const originalLength = (await index.getHotelsLength()).toNumber();
      const originalHotels = await index.getHotels();
      await index.transferHotel(hotelAddress, nonOwnerAccount, { from: hotelAccount });
      assert.equal(help.filterZeroAddresses(await index.getHotelsByManager(hotelAccount)).length, 0);
      assert.equal(help.filterZeroAddresses(await index.getHotelsByManager(nonOwnerAccount)).length, 1);
      assert.equal((await index.getHotelsLength()).toNumber(), originalLength);
      assert.deepEqual(await index.getHotels(), originalHotels);
    });

    it('should fire an event', async () => {
      const result = await index.transferHotel(hotelAddress, nonOwnerAccount, { from: hotelAccount });
      assert.equal(result.logs.length, 1);
      assert.equal(result.logs[0].event, 'HotelTransferred');
      assert.equal(result.logs[0].args.previousManager, hotelAccount);
      assert.equal(result.logs[0].args.newManager, nonOwnerAccount);
    });
  });

  describe('data getters', () => {
    describe('getHotelsLength', () => {
      it('should count hotels properly', async () => {
        // length is a bignumber
        let length = await index.getHotelsLength();
        // We start with empty address on the zero index
        assert.equal(length.toNumber(), 1);
        await index.registerHotel('aaa', { from: hotelAccount });
        length = await index.getHotelsLength();
        assert.equal(length.toNumber(), 2);
        const indexNonce = await help.promisify(cb => web3.eth.getTransactionCount(index.address, cb));
        const expectedHotelAddress = help.determineAddress(index.address, indexNonce);
        await index.registerHotel('bbb', { from: hotelAccount });
        length = await index.getHotelsLength();
        assert.equal(length.toNumber(), 3);
        await index.deleteHotel(expectedHotelAddress, { from: hotelAccount });
        length = await index.getHotelsLength();
        // length counts zero addresses
        assert.equal(length.toNumber(), 3);
      });
    });

    describe('getHotels', () => {
      it('should return hotels properly', async () => {
        let hotels = await index.getHotels();
        assert.equal(help.filterZeroAddresses(hotels).length, 0);
        await index.registerHotel('aaa', { from: hotelAccount });
        hotels = await index.getHotels();
        const indexNonce = await help.promisify(cb => web3.eth.getTransactionCount(index.address, cb));
        const expectedHotelAddress = help.determineAddress(index.address, indexNonce);
        assert.equal(help.filterZeroAddresses(hotels).length, 1);
        await index.registerHotel('bbb', { from: hotelAccount });
        hotels = await index.getHotels();
        assert.equal(help.filterZeroAddresses(hotels).length, 2);
        await index.deleteHotel(expectedHotelAddress, { from: hotelAccount });
        hotels = await index.getHotels();
        assert.equal(help.filterZeroAddresses(hotels).length, 1);
      });
    });

    describe('getHotelsByManager', () => {
      it('should return list of hotels for existing manager', async () => {
        await index.registerHotel('bbb', { from: hotelAccount });
        const hotelList = await index.getHotelsByManager(hotelAccount);
        assert.equal(hotelList.length, 1);
      });

      it('should return empty list for a manager without hotels', async () => {
        const hotelList = await index.getHotelsByManager(hotelAccount);
        assert.equal(hotelList.length, 0);
      });

      it('should return empty list for a non-existing manager', async () => {
        const hotelList = await index.getHotelsByManager(nonOwnerAccount);
        assert.equal(hotelList.length, 0);
      });
    });
  });
});

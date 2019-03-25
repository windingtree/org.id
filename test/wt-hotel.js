const assert = require('chai').assert;
const help = require('./helpers/index.js');
const abiDecoder = require('abi-decoder');

const AdminUpgradeabilityProxy = artifacts.require('AdminUpgradeabilityProxy');
const WTHotelIndex = artifacts.require('WTHotelIndex');
const WTHotel = artifacts.require('Hotel');
const AbstractWTHotel = artifacts.require('AbstractHotel');

abiDecoder.addABI(AbstractWTHotel._json.abi);
abiDecoder.addABI(WTHotelIndex._json.abi);

contract('Hotel', (accounts) => {
  const hotelUri = 'bzz://something';
  const indexOwner = accounts[1];
  const hotelAccount = accounts[2];
  const nonOwnerAccount = accounts[3];
  const tokenAddress = accounts[5];
  let hotelAddress = help.zeroAddress;
  let wtHotelIndex;
  let wtHotel;

  // Create and register a hotel
  beforeEach(async () => {
    const indexDeployed = await WTHotelIndex.new({ from: indexOwner });
    indexDeployed.web3Instance = new web3.eth.Contract(indexDeployed.abi, indexDeployed.address);
    const initializeData = indexDeployed.web3Instance.methods.initialize(indexOwner, tokenAddress).encodeABI();
    const indexProxy = await AdminUpgradeabilityProxy.new(indexDeployed.address, initializeData, { from: indexOwner });
    wtHotelIndex = await WTHotelIndex.at(indexProxy.address);

    await wtHotelIndex.registerHotel(hotelUri, { from: hotelAccount });
    let address = await wtHotelIndex.getHotelsByManager(hotelAccount);
    hotelAddress = address[0];
    wtHotel = await WTHotel.at(address[0]);
    wtHotel.web3Instance = new web3.eth.Contract(wtHotel.abi, wtHotel.address);
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
        await WTHotel.new(help.zeroAddress, 'goo.gl', wtHotelIndex.address);
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
        const data = await wtHotel.web3Instance.methods.editInfo('').encodeABI();
        await wtHotelIndex.callHotel(hotelAddress, data, { from: hotelAccount });
        throw new Error('should not have been called');
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should update hotel\'s dataUri', async () => {
      const data = wtHotel.web3Instance.methods.editInfo(newDataUri).encodeABI();
      await wtHotelIndex.callHotel(hotelAddress, data, { from: hotelAccount });
      const info = await help.getHotelInfo(wtHotel);
      assert.equal(info.dataUri, newDataUri);
    });

    it('should throw if not executed by hotel owner', async () => {
      try {
        const data = wtHotel.web3Instance.methods.editInfo(newDataUri).encodeABI();
        await wtHotelIndex.callHotel(hotelAddress, data, { from: nonOwnerAccount });
        throw new Error('should not have been called');
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if not executed from index address', async () => {
      try {
        await wtHotel.editInfo(newDataUri, { from: nonOwnerAccount });
        throw new Error('should not have been called');
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('changeManager', () => {
    it('should throw if not executed from index address', async () => {
      try {
        await wtHotel.changeManager(nonOwnerAccount, { from: nonOwnerAccount });
        throw new Error('should not have been called');
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should change the hotel manager', async () => {
      assert(await wtHotel.manager(), hotelAccount);
      await wtHotelIndex.transferHotel(hotelAddress, nonOwnerAccount, { from: hotelAccount });
      assert(await wtHotel.manager(), nonOwnerAccount);
    });
  });
});

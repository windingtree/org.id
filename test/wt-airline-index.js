const { TestHelper } = require('zos');
const { Contracts, ZWeb3 } = require('zos-lib');
const assert = require('chai').assert;
const help = require('./helpers/index.js');

ZWeb3.initialize(web3.currentProvider);
// workaround for https://github.com/zeppelinos/zos/issues/704
Contracts.setArtifactsDefaults({
  gas: 60000000,
});

const WTAirlineIndex = Contracts.getFromLocal('WTAirlineIndex');
const WTAirlineIndexUpgradeabilityTest = Contracts.getFromLocal('WTAirlineIndexUpgradeabilityTest');
// eaiser interaction with truffle-contract
const WTAirline = artifacts.require('Organization');
const AbstractWTAirlineIndex = artifacts.require('AbstractWTAirlineIndex');
const TruffleWTAirlineIndex = artifacts.require('WTAirlineIndex');
const TruffleWTAirlineIndexUpgradeabilityTest = artifacts.require('WTAirlineIndexUpgradeabilityTest');
const AirlineUpgradeabilityTest = artifacts.require('AirlineUpgradeabilityTest');

contract('WTAirlineIndex', (accounts) => {
  const airlineIndexOwner = accounts[1];
  const proxyOwner = accounts[2];
  const airlineAccount = accounts[3];
  const nonOwnerAccount = accounts[4];
  const tokenAddress = accounts[5];

  let airlineIndexProxy;
  let airlineIndex;
  let project;

  // Deploy new airlineIndex but use AbstractWTAirlineIndex for contract interaction
  beforeEach(async () => {
    project = await TestHelper();
    airlineIndexProxy = await project.createProxy(WTAirlineIndex, {
      from: proxyOwner,
      initFunction: 'initialize',
      initArgs: [airlineIndexOwner, tokenAddress],
    });
    airlineIndex = await AbstractWTAirlineIndex.at(airlineIndexProxy.address);
  });

  it('should set liftoken', async () => {
    // ownership setup is verified in setLifToken tests
    const wtAirlineIndex = await TruffleWTAirlineIndex.at(airlineIndex.address);
    assert.equal(await wtAirlineIndex.LifToken(), tokenAddress);
  });

  describe('transferOwnership', async () => {
    it('should transfer ownership', async () => {
      const wtAirlineIndex = await TruffleWTAirlineIndex.at(airlineIndex.address);
      await wtAirlineIndex.transferOwnership(proxyOwner, { from: airlineIndexOwner });
      // We cannot access _owner directly, it is not public
      try {
        await wtAirlineIndex.setLifToken(tokenAddress, { from: airlineIndexOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
      await wtAirlineIndex.transferOwnership(airlineIndexOwner, { from: proxyOwner });
    });

    it('should not transfer ownership when initiated from a non-owner', async () => {
      try {
        await (await TruffleWTAirlineIndex.at(airlineIndex.address)).transferOwnership(tokenAddress, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('upgradeability', () => {
    it('should upgrade WTAirlineIndex and have new functions in Index and Airline contracts', async () => {
      await airlineIndex.registerAirline('dataUri', { from: airlineAccount });
      // Upgrade proxy with new implementation
      const newIndex = await WTAirlineIndexUpgradeabilityTest.new({ from: airlineIndexOwner });
      await project.proxyAdmin.upgradeProxy(airlineIndexProxy.address, newIndex.address, WTAirlineIndexUpgradeabilityTest);
      airlineIndex = await TruffleWTAirlineIndexUpgradeabilityTest.at(airlineIndexProxy.address);
      await airlineIndex.registerAirline('dataUri2', { from: airlineAccount });
      const length = await airlineIndex.getAirlinesLength();
      const allAirlines = await help.jsArrayFromSolidityArray(
        airlineIndex.airlines,
        length,
        help.isZeroAddress
      );
      const airlinesByManager = await airlineIndex.getAirlinesByManager(airlineAccount);

      assert.isDefined(allAirlines[0]);
      assert.isDefined(airlinesByManager[0]);
      assert.isFalse(help.isZeroAddress(allAirlines[0]));
      assert.isFalse(help.isZeroAddress(airlinesByManager[0]));
      assert.equal(await airlineIndex.airlinesIndex(allAirlines[0]), 1);
      assert.equal(await airlineIndex.airlinesIndex(allAirlines[1]), 2);
      assert.equal(allAirlines[0], airlinesByManager[0]);
      assert.equal(allAirlines[1], airlinesByManager[1]);

      assert.equal(await (await WTAirline.at(allAirlines[0])).dataUri(), 'dataUri');
      assert.equal(await (await WTAirline.at(allAirlines[1])).dataUri(), 'dataUri2');

      assert.equal(await (await AirlineUpgradeabilityTest.at(allAirlines[1])).newFunction(), 100);
      assert.equal(await airlineIndex.newFunction(), 100);
    });
  });

  describe('setLifToken', () => {
    it('should set the LifToken address', async () => {
      const wtAirlineIndex = await TruffleWTAirlineIndex.at(airlineIndex.address);
      await wtAirlineIndex.setLifToken(tokenAddress, { from: airlineIndexOwner });
      const setValue = await wtAirlineIndex.LifToken();
      assert.equal(setValue, tokenAddress);
    });

    it('should throw if non-owner sets the LifToken address', async () => {
      try {
        await (await TruffleWTAirlineIndex.at(airlineIndex.address)).setLifToken(tokenAddress, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('airlines', () => {
    describe('registerAirline', () => {
      const expectedIndexPos = 1; // Position of the first airline

      it('should not register airline with empty dataUri', async () => {
        try {
          await airlineIndex.registerAirline('', { from: airlineAccount });
          assert(false);
        } catch (e) {
          assert(help.isInvalidOpcodeEx(e));
        }
      });

      it('should put airline where we expect it to be', async () => {
        const airlineIndexNonce = await help.promisify(cb => web3.eth.getTransactionCount(airlineIndex.address, cb));
        const airlineAddress = help.determineAddress(airlineIndex.address, airlineIndexNonce);
        await airlineIndex.registerAirline('dataUri', { from: airlineAccount });
        let address = await airlineIndex.getAirlinesByManager(airlineAccount);
        assert.equal(airlineAddress, address[0]);
      });

      it('should return new airline address', async () => {
        const airlineIndexNonce = await help.promisify(cb => web3.eth.getTransactionCount(airlineIndex.address, cb));
        const airlineAddress = help.determineAddress(airlineIndex.address, airlineIndexNonce);
        // This does not actually create the airline... but it does spit out the return value
        const result = await airlineIndex.registerAirline.call('dataUri', { from: airlineAccount });
        assert.equal(result, airlineAddress);
      });

      it('should add an airline to the registry', async () => {
        await airlineIndex.registerAirline('dataUri', { from: airlineAccount });
        const length = await airlineIndex.getAirlinesLength();

        const allAirlines = await help.jsArrayFromSolidityArray(
          airlineIndex.airlines,
          length,
          help.isZeroAddress
        );

        const airlinesByManager = await airlineIndex.getAirlinesByManager(airlineAccount);
        const actualIndexPos = await airlineIndex.airlinesIndex(allAirlines[0]);

        const airline = allAirlines[0];
        const airlineByManager = airlinesByManager[0];

        assert.isDefined(airline);
        assert.isDefined(airlineByManager);
        assert.isFalse(help.isZeroAddress(airline));
        assert.isFalse(help.isZeroAddress(airlineByManager));

        assert.equal(actualIndexPos, expectedIndexPos);
        assert.equal(airline, airlinesByManager);

        const airlineInstance = await WTAirline.at(airline);
        assert.equal(await airlineInstance.dataUri(), 'dataUri');
      });
    });

    describe('deleteAirline', () => {
      const expectedIndexPos = 0; // Position of the airline in the managers array

      it('should remove a airline', async () => {
        await airlineIndex.registerAirline('dataUri', { from: airlineAccount });
        const length = await airlineIndex.getAirlinesLength();

        let allAirlines = await help.jsArrayFromSolidityArray(
          airlineIndex.airlines,
          length,
          help.isZeroAddress
        );

        const airline = allAirlines[0];
        // Verify existence
        assert.isDefined(airline);
        assert.isFalse(help.isZeroAddress(airline));

        // Remove and verify non-existence of airline
        await airlineIndex.deleteAirline(airline, { from: airlineAccount });
        allAirlines = await help.jsArrayFromSolidityArray(
          airlineIndex.airlines,
          length,
          help.isZeroAddress
        );
        const airlinesByManager = await airlineIndex.getAirlinesByManager(airlineAccount);
        const airlineDeleted = help.isZeroAddress(airlinesByManager[expectedIndexPos]);

        assert.equal(allAirlines.length, 0);
        assert.isTrue(airlineDeleted);
        const code = await help.promisify(cb => web3.eth.getCode(airline, cb));
        assert.match(code, /^0x/);
      });

      it('should throw if the airline is not registered', async () => {
        try {
          // Mocking address with existing contract
          await airlineIndex.deleteAirline(nonOwnerAccount, { from: airlineAccount });
          assert(false);
        } catch (e) {
          assert(help.isInvalidOpcodeEx(e));
        }
      });

      it('should throw if airline has zero address', async () => {
        try {
          // Mocking address with existing contract
          await airlineIndex.deleteAirline(help.zeroAddress, { from: airlineAccount });
          assert(false);
        } catch (e) {
          assert(help.isInvalidOpcodeEx(e));
        }
      });

      it('should throw if non-owner removes', async () => {
        await airlineIndex.registerAirline('name', { from: airlineAccount });
        const airlinesByManager = await airlineIndex.getAirlinesByManager(airlineAccount);
        const airline = airlinesByManager[0];

        try {
          await airlineIndex.deleteAirline(airline, { from: nonOwnerAccount });
          assert(false);
        } catch (e) {
          assert(help.isInvalidOpcodeEx(e));
        }
      });
    });

    describe('callAirline', async () => {
      let wtAirline, airlineAddress;

      beforeEach(async () => {
        await airlineIndex.registerAirline('dataUri', { from: airlineAccount });
        let address = await airlineIndex.getAirlinesByManager(airlineAccount);
        airlineAddress = address[0];
        wtAirline = await WTAirline.at(address[0]);
        wtAirline.web3Instance = new web3.eth.Contract(wtAirline.abi, wtAirline.address);
      });

      it('should proceed when calling as an owner', async () => {
        const data = wtAirline.web3Instance.methods.editInfo('newDataUri').encodeABI();
        await airlineIndex.callAirline(airlineAddress, data, { from: airlineAccount });
        assert.equal('newDataUri', await wtAirline.dataUri());
      });

      it('should throw if calling as a non-owner', async () => {
        const data = wtAirline.web3Instance.methods.editInfo('newUri').encodeABI();
        try {
          await airlineIndex.callAirline(airlineAddress, data, { from: nonOwnerAccount });
          assert(false);
        } catch (e) {
          assert(help.isInvalidOpcodeEx(e));
        }
      });

      it('should throw if a airline has zero address', async () => {
        const data = wtAirline.web3Instance.methods.editInfo('newUri').encodeABI();
        try {
          // Mocking address with existing contract
          await airlineIndex.callAirline(help.zeroAddress, data, { from: airlineAccount });
          assert(false);
        } catch (e) {
          assert(help.isInvalidOpcodeEx(e));
        }
      });

      it('should throw if airline does not exist', async () => {
        const data = wtAirline.web3Instance.methods.editInfo('newUri').encodeABI();
        try {
          // mocking address with existing account
          await airlineIndex.callAirline(nonOwnerAccount, data, { from: airlineAccount });
          assert(false);
        } catch (e) {
          assert(help.isInvalidOpcodeEx(e));
        }
      });
    });
  });

  describe('transferAirline', () => {
    let airlineAddress;

    beforeEach(async () => {
      await airlineIndex.registerAirline('dataUri', { from: airlineAccount });
      let address = await airlineIndex.getAirlinesByManager(airlineAccount);
      airlineAddress = address[0];
    });

    it('should throw if transferring to a zero address', async () => {
      try {
        await airlineIndex.transferAirline(airlineAddress, help.zeroAddress, { from: airlineAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if transferring a non-existing airline', async () => {
      try {
        await airlineIndex.transferAirline(airlineIndex.address, nonOwnerAccount, { from: airlineAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if not executed from airline owner address', async () => {
      try {
        await airlineIndex.transferAirline(airlineAddress, nonOwnerAccount, { from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should change the airline manager', async () => {
      assert.equal(help.filterZeroAddresses(await airlineIndex.getAirlinesByManager(airlineAccount)).length, 1);
      assert.equal(help.filterZeroAddresses(await airlineIndex.getAirlinesByManager(nonOwnerAccount)).length, 0);
      const originalLength = (await airlineIndex.getAirlinesLength()).toNumber();
      const originalAirlines = await airlineIndex.getAirlines();
      await airlineIndex.transferAirline(airlineAddress, nonOwnerAccount, { from: airlineAccount });
      assert.equal(help.filterZeroAddresses(await airlineIndex.getAirlinesByManager(airlineAccount)).length, 0);
      assert.equal(help.filterZeroAddresses(await airlineIndex.getAirlinesByManager(nonOwnerAccount)).length, 1);
      assert.equal((await airlineIndex.getAirlinesLength()).toNumber(), originalLength);
      assert.deepEqual(await airlineIndex.getAirlines(), originalAirlines);
    });

    it('should fire an event', async () => {
      const result = await airlineIndex.transferAirline(airlineAddress, nonOwnerAccount, { from: airlineAccount });
      assert.equal(result.logs.length, 1);
      assert.equal(result.logs[0].event, 'OrganizationTransferred');
      assert.equal(result.logs[0].args.previousManager, airlineAccount);
      assert.equal(result.logs[0].args.newManager, nonOwnerAccount);
    });
  });

  describe('data getters', () => {
    describe('getAirlinesLength', () => {
      it('should count airlines properly', async () => {
        // length is a bignumber
        let length = await airlineIndex.getAirlinesLength();
        // We start with empty address on the zero airlineIndex
        assert.equal(length.toNumber(), 1);
        await airlineIndex.registerAirline('aaa', { from: airlineAccount });
        length = await airlineIndex.getAirlinesLength();
        assert.equal(length.toNumber(), 2);
        const airlineIndexNonce = await help.promisify(cb => web3.eth.getTransactionCount(airlineIndex.address, cb));
        const expectedAirlineAddress = help.determineAddress(airlineIndex.address, airlineIndexNonce);
        await airlineIndex.registerAirline('bbb', { from: airlineAccount });
        length = await airlineIndex.getAirlinesLength();
        assert.equal(length.toNumber(), 3);
        await airlineIndex.deleteAirline(expectedAirlineAddress, { from: airlineAccount });
        length = await airlineIndex.getAirlinesLength();
        // length counts zero addresses
        assert.equal(length.toNumber(), 3);
      });
    });

    describe('getAirlines', () => {
      it('should return airlines properly', async () => {
        let airlines = await airlineIndex.getAirlines();
        assert.equal(help.filterZeroAddresses(airlines).length, 0);
        await airlineIndex.registerAirline('aaa', { from: airlineAccount });
        airlines = await airlineIndex.getAirlines();
        const airlineIndexNonce = await help.promisify(cb => web3.eth.getTransactionCount(airlineIndex.address, cb));
        const expectedAirlineAddress = help.determineAddress(airlineIndex.address, airlineIndexNonce);
        assert.equal(help.filterZeroAddresses(airlines).length, 1);
        await airlineIndex.registerAirline('bbb', { from: airlineAccount });
        airlines = await airlineIndex.getAirlines();
        assert.equal(help.filterZeroAddresses(airlines).length, 2);
        await airlineIndex.deleteAirline(expectedAirlineAddress, { from: airlineAccount });
        airlines = await airlineIndex.getAirlines();
        assert.equal(help.filterZeroAddresses(airlines).length, 1);
      });
    });

    describe('getAirlinesByManager', () => {
      it('should return list of airlines for existing manager', async () => {
        await airlineIndex.registerAirline('bbb', { from: airlineAccount });
        const airlineList = await airlineIndex.getAirlinesByManager(airlineAccount);
        assert.equal(airlineList.length, 1);
      });

      it('should return empty list for a manager without airlines', async () => {
        const airlineList = await airlineIndex.getAirlinesByManager(airlineAccount);
        assert.equal(airlineList.length, 0);
      });

      it('should return empty list for a non-existing manager', async () => {
        const airlineList = await airlineIndex.getAirlinesByManager(nonOwnerAccount);
        assert.equal(airlineList.length, 0);
      });
    });
  });
});

const { TestHelper } = require('@openzeppelin/cli');
const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');

const help = require('./helpers/index.js');
const { assertEvent } = require('./helpers/assertions');
const {
  createSubsidiary
} = require('./helpers/orgid-hierarchy');

ZWeb3.initialize(web3.currentProvider);
// workaround for https://github.com/zeppelinos/zos/issues/704
Contracts.setArtifactsDefaults({
  gas: 60000000,
});

const Organization = Contracts.getFromLocal('Organization');
const OrganizationInterface = artifacts.require('OrganizationInterface');
const SegmentDirectory = Contracts.getFromLocal('SegmentDirectory');
const SegmentDirectoryUpgradeabilityTest = Contracts.getFromLocal('SegmentDirectoryUpgradeabilityTest');
const CustomOrganizationTest = artifacts.require('CustomOrganizationTest');

const { assert, should } = require('chai');
should();

const createOrganizationAndAddToDir = async (
  organization,
  organizationOwner,
  subsidiaryDirector,
  directory,
  jsonOrgUri,
  jsonOrgHash,
  txOpts
) => {
  // Subsidiaries are usually added to the directory
  const subsidiaryAddress = await createSubsidiary(
    organization,
    organizationOwner,
    subsidiaryDirector,
    jsonOrgUri,
    jsonOrgHash
  );
  const length = await directory.methods['getOrganizationsLength()']().call();
  const result = await directory.methods['add(address)'](subsidiaryAddress).send(
    {
      from: subsidiaryDirector
    }
  );
  assertEvent(result, 'OrganizationAdded', [
    [
      'organization',
      p => (p).should.equal(subsidiaryAddress)
    ],
    [
      'index',
      p => (p).should.equal(length)
    ]
  ]);
  return subsidiaryAddress;
};

contract('SegmentDirectory', (accounts) => {
  const organizationUri = 'bzz://something';
  const organizationHash = '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99';

  const segmentDirectoryOwner = accounts[1];
  const organizationOwner = accounts[2];
  const nonOwnerAccount = accounts[3];
  const tokenFakeAddress = accounts[4];
  const entityDirectorAccount = accounts[5];
  
  let ensContract;
  let tokenContract;

  let segmentDirectoryProxy;
  let segmentDirectory;
  let projectAppAddress;
  let organization;
  let project;

  before(async () => {
    ensContract = await help.deployEnsRegistry();
    tokenContract = await help.deployLifToken(true);
    await help.setupEnsRegistry(ensContract, tokenContract);
  });

  beforeEach(async () => {
    project = await TestHelper();
    segmentDirectoryProxy = await project.createProxy(SegmentDirectory, {
      from: segmentDirectoryOwner,
      initFunction: 'initialize',
      initArgs: [segmentDirectoryOwner, 'foodtrucks', tokenFakeAddress],
    });
    segmentDirectory = await SegmentDirectory.at(segmentDirectoryProxy.address);

    projectAppAddress = project.app.address;
    const organizationProxy = await project.createProxy(Organization, {
      from: organizationOwner,
      initFunction: 'initialize',
      initArgs: [
        organizationOwner,
        organizationUri,
        organizationHash,
        projectAppAddress,
        help.zeroAddress,
        help.zeroAddress
      ],
    });
    organization = await Organization.at(organizationProxy.address);
  });

  describe('initialize', () => {
    it('should not allow zero address owner', async () => {
      try {
        const segmentDirectory = await SegmentDirectory.new({ from: segmentDirectoryOwner });
        await segmentDirectory.methods.initialize(help.zeroAddress, 'foodtrucks', tokenFakeAddress).send({ from: segmentDirectoryOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should set liftoken and segment', async () => {
      const segmentDirectory = await SegmentDirectory.new({ from: segmentDirectoryOwner });
      await segmentDirectory.methods.initialize(segmentDirectoryOwner, 'foodtrucks', tokenFakeAddress).send({ from: segmentDirectoryOwner });
      assert.equal(await segmentDirectory.methods.getLifToken().call(), tokenFakeAddress);
      assert.equal(await segmentDirectory.methods.getSegment().call(), 'foodtrucks');
    });
  });

  describe('upgradeability', () => {
    it('should upgrade SegmentDirectory and have new functions in directory and Organization contracts', async () => {
      // add old organization
      await createOrganizationAndAddToDir(
        organization,
        organizationOwner,
        entityDirectorAccount,
        segmentDirectory,
        organizationUri,
        organizationHash
      );
      // upgrade directory
      const upgradedDirectory = await SegmentDirectoryUpgradeabilityTest.new({ from: segmentDirectoryOwner });
      await project.proxyAdmin.upgradeProxy(segmentDirectoryProxy.address, upgradedDirectory.address, SegmentDirectoryUpgradeabilityTest);
      const newDirectory = await SegmentDirectoryUpgradeabilityTest.at(segmentDirectoryProxy.address);
      // add new organization
      await createOrganizationAndAddToDir(
        organization,
        organizationOwner,
        entityDirectorAccount,
        newDirectory,
        organizationUri,
        organizationHash
      );
      const allOrganizations = help.filterZeroAddresses(await newDirectory.methods.getOrganizations().call());
      // test values
      assert.isDefined(await newDirectory.methods.organizations(1).call());
      assert.isDefined(await newDirectory.methods.organizations(2).call());
      assert.isFalse(help.isZeroAddress(allOrganizations[0]));
      assert.isFalse(help.isZeroAddress(allOrganizations[1]));
      assert.equal(await newDirectory.methods.organizationsIndex(allOrganizations[0]).call(), 1);
      assert.equal(await newDirectory.methods.organizationsIndex(allOrganizations[1]).call(), 2);
      assert.equal(await (await Organization.at(allOrganizations[0])).methods.getOrgJsonUri().call(), organizationUri);
      assert.equal(await (await Organization.at(allOrganizations[1])).methods.getOrgJsonUri().call(), organizationUri);
      assert.equal(await newDirectory.methods.newFunction().call(), 100);
    });
  });

  describe('resolveLifTokenFromENS', () => {
    it('should set lif token address from ENS', async () => {
      assert.equal(await segmentDirectory.methods.getLifToken().call(), tokenFakeAddress);
      await segmentDirectory.methods.resolveLifTokenFromENS(ensContract.address).send({ from: segmentDirectoryOwner });
      assert.equal(await segmentDirectory.methods.getLifToken().call(), tokenContract.address);
    });

    it('should throw if ENS cannot be read from', async () => {
      try {
        assert.equal(await segmentDirectory.methods.getLifToken().call(), tokenFakeAddress);
        await segmentDirectory.methods.resolveLifTokenFromENS(tokenFakeAddress).send({ from: segmentDirectoryOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if called by non-owner', async () => {
      try {
        assert.equal(await segmentDirectory.methods.getLifToken().call(), tokenFakeAddress);
        await segmentDirectory.methods.resolveLifTokenFromENS(ensContract.address).send({ from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('transferOwnership', async () => {
    it('should transfer ownership', async () => {
      await segmentDirectory.methods.transferOwnership(nonOwnerAccount).send({ from: segmentDirectoryOwner });
      assert.equal(await segmentDirectory.methods.owner().call(), nonOwnerAccount);
      await segmentDirectory.methods.transferOwnership(segmentDirectoryOwner).send({ from: nonOwnerAccount });
    });

    it('should not transfer ownership when initiated from a non-owner', async () => {
      try {
        await segmentDirectory.methods.transferOwnership(tokenFakeAddress).send({ from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should not transfer ownership to zero address', async () => {
      try {
        await segmentDirectory.methods.transferOwnership(help.zeroAddress).send({ from: segmentDirectoryOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('owner', async () => {
    it('should report current owner', async () => {
      const owner = await segmentDirectory.methods.owner().call();
      assert.equal(owner, segmentDirectoryOwner);
    });
  });

  describe('setSegment', () => {
    it('should set the segment', async () => {
      await segmentDirectory.methods.setSegment('hotels').send({ from: segmentDirectoryOwner });
      const setValue = await segmentDirectory.methods.getSegment().call();
      assert.equal(setValue, 'hotels');
    });

    it('should throw if non-owner sets segment', async () => {
      try {
        await segmentDirectory.methods.setSegment('hotels').send({ from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if segment is empty', async () => {
      try {
        await segmentDirectory.methods.setSegment('').send({ from: segmentDirectoryOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('getOrganizationsLength', () => {
    it('should count organizations properly', async () => {
      // length is a bignumber
      let length = await segmentDirectory.methods['getOrganizationsLength()']().call();
      // We start with empty address on the zero segmentDirectory
      assert.equal(length, 1);
      await createOrganizationAndAddToDir(
        organization,
        organizationOwner,
        entityDirectorAccount,
        segmentDirectory,
        organizationUri,
        organizationHash
      );
      length = await segmentDirectory.methods['getOrganizationsLength()']().call();
      assert.equal(length, 2);
      const organizationAddress = await createOrganizationAndAddToDir(
        organization,
        organizationOwner,
        entityDirectorAccount,
        segmentDirectory,
        organizationUri,
        organizationHash
      );
      length = await segmentDirectory.methods['getOrganizationsLength()']().call();
      assert.equal(length, 3);
      await segmentDirectory.methods['remove(address)'](organizationAddress).send({ from: entityDirectorAccount });
      length = await segmentDirectory.methods['getOrganizationsLength()']().call();
      // length counts zero addresses
      assert.equal(length, 3);
    });
  });

  describe('getOrganizations', () => {
    it('should return organizations properly', async () => {
      assert.equal(help.filterZeroAddresses(await segmentDirectory.methods['getOrganizations()']().call()).length, 0);
      const organizationAddress = await createOrganizationAndAddToDir(
        organization,
        organizationOwner,
        entityDirectorAccount,
        segmentDirectory,
        organizationUri,
        organizationHash
      );
      assert.equal(help.filterZeroAddresses(await segmentDirectory.methods['getOrganizations()']().call()).length, 1);
      await createOrganizationAndAddToDir(
        organization,
        organizationOwner,
        entityDirectorAccount,
        segmentDirectory,
        organizationUri,
        organizationHash
      );
      assert.equal(help.filterZeroAddresses(await segmentDirectory.methods['getOrganizations()']().call()).length, 2);
      await segmentDirectory.methods['remove(address)'](organizationAddress).send({ from: entityDirectorAccount });
      assert.equal(help.filterZeroAddresses(await segmentDirectory.methods['getOrganizations()']().call()).length, 1);
    });
  });

  describe('add', () => {
    
    it('should add the organization to the registry', async () => {
      const receipt = await segmentDirectory.methods['add(address)'](organization.address).send({ from: organizationOwner });
      assertEvent(receipt, 'OrganizationAdded', [
        [
          'organization',
          p => (p).should.equal(organization.address)
        ],
        [
          'index',
          p => (p).should.equal('1')
        ]
      ]);
      const allOrganizations = await help.jsArrayFromSolidityArray(
        segmentDirectory.methods['organizations(uint256)'],
        await segmentDirectory.methods['getOrganizationsLength()']().call(),
        help.isZeroAddress,
      );
      const actualIndexPos = await segmentDirectory.methods['organizationsIndex(address)'](allOrganizations[0]).call();
      assert.isDefined(allOrganizations[0]);
      assert.isFalse(help.isZeroAddress(allOrganizations[0]));
      assert.equal(actualIndexPos, 1);
    });

    it('should throw if adding an already added organization', async () => {
      await segmentDirectory.methods['add(address)'](organization.address).send({ from: organizationOwner });
      try {
        await segmentDirectory.methods['add(address)'](organization.address).send({ from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if adding organization on a zero address', async () => {
      try {
        await segmentDirectory.methods['add(address)'](help.zeroAddress).send({ from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if somebody is adding organization which she does not own', async () => {
      try {
        await segmentDirectory.methods['add(address)'](organization.address).send({ from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should not add an Organization that does not support OrganizationInterface', async () => {
      try {
        await segmentDirectory.methods['add(address)'](nonOwnerAccount).send({ from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should add a custom organization contract', async () => {
      const customOrg = await CustomOrganizationTest.new({ from: organizationOwner });
      const receipt = await segmentDirectory.methods['add(address)'](customOrg.address).send({ from: organizationOwner });
      assertEvent(receipt, 'OrganizationAdded', [
        [
          'organization',
          p => (p).should.equal(customOrg.address)
        ],
        [
          'index',
          p => (p).should.equal('1')
        ]
      ]);
      const allOrganizations = await help.jsArrayFromSolidityArray(
        segmentDirectory.methods['organizations(uint256)'],
        await segmentDirectory.methods['getOrganizationsLength()']().call(),
        help.isZeroAddress,
      );
      const actualIndexPos = await segmentDirectory.methods['organizationsIndex(address)'](allOrganizations[0]).call();
      const organization = allOrganizations[0];
      assert.isDefined(organization);
      assert.isFalse(help.isZeroAddress(organization));
      assert.equal(actualIndexPos, 1);
      const org = await OrganizationInterface.at(customOrg.address);
      assert.equal(await org.getOrgJsonUri(), 'https://super-sweet-custom-organization.com');
    });
  });

  describe('remove', () => {
    let subOrganization;

    beforeEach(async () => {
      const organizationAddress = await createOrganizationAndAddToDir(
        organization,
        organizationOwner,
        entityDirectorAccount,
        segmentDirectory,
        organizationUri,
        organizationHash
      );
      subOrganization = await Organization.at(organizationAddress);
    });

    it('should remove organization from the directory', async () => {
      const receipt = await segmentDirectory.methods['remove(address)'](subOrganization.address).send({ from: entityDirectorAccount });
      const allOrganizations = await help.jsArrayFromSolidityArray(
        segmentDirectory.methods['organizations(uint256)'],
        await segmentDirectory.methods['getOrganizationsLength()']().call(),
        help.isZeroAddress,
      );
      assert.equal(allOrganizations.length, 0);
      assert.isUndefined(allOrganizations[0]);
      assertEvent(receipt, 'OrganizationRemoved', [
        [
          'organization',
          p => (p).should.equal(subOrganization.address)
        ]
      ]);
    });

    it('should not destroy the organization contract', async () => {
      await segmentDirectory.methods['remove(address)'](subOrganization.address).send({ from: entityDirectorAccount });
      const code = await help.promisify(cb => web3.eth.getCode(subOrganization.address, cb));
      assert.isAtLeast(code.length, 4);
    });

    it('should throw if somebody is removing organization which she does not own', async () => {
      try {
        await segmentDirectory.methods['remove(address)'](subOrganization.address).send({ from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if organization is not added', async () => {
      try {
        await segmentDirectory.methods['remove(address)'](nonOwnerAccount).send({ from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if organization is on zero address', async () => {
      try {
        await segmentDirectory.methods['remove(address)'](help.zeroAddress).send({ from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if organization non-owner initiates the removing', async () => {
      try {
        await segmentDirectory.methods['remove(address)'](subOrganization.address).send({ from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });
});

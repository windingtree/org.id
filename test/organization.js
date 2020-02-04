const TestHelper = require('./helpers/zostest');
const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');
const help = require('./helpers/index.js');
const { assertRevert } = require('./helpers/assertions');
const {
  createSubsidiary,
  toggleSubsidiary,
  confirmSubsidiaryDirectorOwnership,
  transferSubsidiaryDirectorOwnership,
  changeOrgJsonUri,
  changeOrgJsonHash,
  changeOrgJsonUriAndHash
} = require('./helpers/orgid-hierarchy');

ZWeb3.initialize(web3.currentProvider);
// workaround for https://github.com/zeppelinos/zos/issues/704
Contracts.setArtifactsDefaults({
  gas: 60000000,
});

const Organization = Contracts.getFromLocal('Organization');
const OrganizationInterface = Contracts.getFromLocal('OrganizationInterface');
const OrganizationUpgradeabilityTest = Contracts.getFromLocal('OrganizationUpgradeabilityTest');
const OrganizationFactory = Contracts.getFromLocal('OrganizationFactory');

const { assert, should } = require('chai');
should();

contract('Organization', (accounts) => {
  const organizationUri = 'bzz://something';
  const organizationHash = '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99';
  const organizationOwner = accounts[1];
  const organizationFactoryOwner = accounts[2];
  const proxyOwner = accounts[3];
  const nonOwnerAccount = accounts[4];
  const entityDirectorAccount = accounts[5];
  
  let organizationProxy;
  let organization;
  let organizationFactory;
  let project;

  beforeEach(async () => {
    project = await TestHelper();
    const organizationFactoryProxy = await project.createProxy(OrganizationFactory, {
      from: organizationFactoryOwner,
      initFunction: 'initialize',
      initArgs: [organizationFactoryOwner, project.app.address],
    });
    organizationFactory = await OrganizationFactory.at(organizationFactoryProxy.address);
    organizationProxy = await project.createProxy(Organization, {
      from: proxyOwner,
      initFunction: 'initialize',
      initArgs: [
        organizationOwner,
        organizationUri,
        organizationHash,
        organizationFactory.address,
        help.zeroAddress,
        help.zeroAddress
      ],
    });
    organization = await Organization.at(organizationProxy.address);
  });

  describe('Constructor', () => {
    it('should be initialised with the correct data', async () => {
      const info = await help.getOrganizationInfo(organization);
      // We need callback, because getBlockNumber for some reason cannot be called with await
      assert.equal(info.owner, organizationOwner);
      assert.equal(info.orgJsonUri, organizationUri);
      assert.equal(info.orgJsonHash, organizationHash);
    });

    it('should throw with zero owner', async () => {
      try {
        const tProject = await TestHelper();
        await tProject.createProxy(Organization, {
          from: proxyOwner,
          initFunction: 'initialize',
          initArgs: [
            help.zeroAddress,
            organizationUri,
            organizationHash,
            organizationFactory.address,
            help.zeroAddress,
            help.zeroAddress
          ],
        });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw with empty orgJsonUri', async () => {
      try {
        const tProject = await TestHelper();
        await tProject.createProxy(Organization, {
          from: proxyOwner,
          initFunction: 'initialize',
          initArgs: [
            organizationOwner,
            '',
            organizationHash,
            organizationFactory.address,
            help.zeroAddress,
            help.zeroAddress
          ],
        });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw with empty orgJsonHash', async () => {
      try {
        const tProject = await TestHelper();
        await tProject.createProxy(Organization, {
          from: proxyOwner,
          initFunction: 'initialize',
          initArgs: [
            organizationOwner,
            organizationUri,
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            organizationFactory.address,
            help.zeroAddress,
            help.zeroAddress
          ],
        });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('interfaces', () => {
    it('should support IERC165 interface', async () => {
      const orgIface = await OrganizationInterface.at(organization.address);
      assert.equal(await orgIface.methods.supportsInterface('0x01ffc9a7').call(), true);
    });

    it('should support owner interface', async () => {
      const orgIface = await OrganizationInterface.at(organization.address);
      assert.equal(await orgIface.methods.supportsInterface('0x8da5cb5b').call(), true);
    });

    it('should support ORG.JSON related interface', async () => {
      const orgIface = await OrganizationInterface.at(organization.address);
      assert.equal(await orgIface.methods.supportsInterface('0x6f4826be').call(), true);
    });

    it('should support associated keys related interface', async () => {
      const orgIface = await OrganizationInterface.at(organization.address);
      assert.equal(await orgIface.methods.supportsInterface('0xfed71811').call(), true);
    });

    it('should support latest interface', async () => {
      const orgIface = await OrganizationInterface.at(organization.address);
      assert.equal(await orgIface.methods.supportsInterface('0x1c3af5f4').call(), true);
    });

    it('should be possible to call sync interfaces without failure', async () => {
      await organization.methods.setInterfaces().send({ from: organizationOwner });
    });
  });

  describe('upgradeability', () => {
    it('should upgrade Organization and have new functions', async () => {
      const upgradedOrganization = await OrganizationUpgradeabilityTest.new({ from: organizationOwner });
      await project.proxyAdmin.upgradeProxy(organizationProxy.address, upgradedOrganization.address, OrganizationUpgradeabilityTest);
      const newOrganization = await OrganizationUpgradeabilityTest.at(organizationProxy.address);
      assert.equal(await newOrganization.methods.newFunction().call(), 100);
    });

    it('should be possible to setup new interfaces', async () => {
      const upgradedOrganization = await OrganizationUpgradeabilityTest.new({ from: organizationOwner });
      assert.equal(await upgradedOrganization.methods.supportsInterface('0x1b28d63e').call(), false);
      await project.proxyAdmin.upgradeProxy(organizationProxy.address, upgradedOrganization.address, OrganizationUpgradeabilityTest, 'setInterfaces', []);
      const newOrganization = await OrganizationUpgradeabilityTest.at(organizationProxy.address);
      assert.equal(await newOrganization.methods.newFunction().call(), 100);
      const orgIface = await OrganizationInterface.at(newOrganization.address);
      // test newFunction interface got added when setInterfaces was called
      assert.equal(await orgIface.methods.supportsInterface('0x1b28d63e').call(), true);
    });
  });

  describe('changeOrgJsonUri', () => {
    const newOrgJsonUri = 'goo.gl/12345';
    it('should not set empty orgJsonUri', async () => {
      try {
        await organization.methods.changeOrgJsonUri('').send({ from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should set orgJsonUri', async () => {
      const receipt = await organization.methods.changeOrgJsonUri(newOrgJsonUri).send({ from: organizationOwner });
      const info = await help.getOrganizationInfo(organization);
      assert.equal(info.orgJsonUri, newOrgJsonUri);
      assert.isDefined(receipt.events.OrgJsonUriChanged);
      assert.equal(receipt.events.OrgJsonUriChanged.returnValues.newOrgJsonUri, newOrgJsonUri);
    });

    it('should throw if not executed by organization owner', async () => {
      try {
        await organization.methods.changeOrgJsonUri(newOrgJsonUri).send({ from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('changeOrgJsonHash', () => {
    const newOrgJsonHash = '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99';
    it('should not set empty orgJsonHash', async () => {
      try {
        await organization.methods.changeOrgJsonHash('0x0').send({ from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should set orgJsonHash', async () => {
      const receipt = await organization.methods.changeOrgJsonHash(newOrgJsonHash).send({ from: organizationOwner });
      const info = await help.getOrganizationInfo(organization);
      assert.equal(info.orgJsonHash, newOrgJsonHash);
      assert.isDefined(receipt.events.OrgJsonHashChanged);
      assert.equal(receipt.events.OrgJsonHashChanged.returnValues.newOrgJsonHash, newOrgJsonHash);
    });

    it('should throw if not executed by organization owner', async () => {
      try {
        await organization.methods.changeOrgJsonHash(newOrgJsonHash).send({ from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('changeOrgJsonUriAndHash', () => {
    const newOrgJsonUri = 'goo.gl/12345';
    const newOrgJsonHash = '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99';

    it('should set orgJsonUri and orgJsonHash', async () => {
      const receipt = await organization.methods.changeOrgJsonUriAndHash(newOrgJsonUri, newOrgJsonHash).send({ from: organizationOwner });
      const info = await help.getOrganizationInfo(organization);
      assert.equal(info.orgJsonUri, newOrgJsonUri);
      assert.equal(info.orgJsonHash, newOrgJsonHash);
      assert.isDefined(receipt.events.OrgJsonHashChanged);
      assert.isDefined(receipt.events.OrgJsonUriChanged);
      assert.equal(receipt.events.OrgJsonHashChanged.returnValues.newOrgJsonHash, newOrgJsonHash);
      assert.equal(receipt.events.OrgJsonUriChanged.returnValues.newOrgJsonUri, newOrgJsonUri);
    });
  });

  describe('transferOwnership', () => {
    it('should transfer contract and emit OwnershipTransferred', async () => {
      const receipt = await organization.methods.transferOwnership(nonOwnerAccount).send({ from: organizationOwner });
      assert.equal(Object.keys(receipt.events).length, 1);
      assert.equal(receipt.events.OwnershipTransferred.returnValues.previousOwner, organizationOwner);
      assert.equal(receipt.events.OwnershipTransferred.returnValues.newOwner, nonOwnerAccount);
      const info = await help.getOrganizationInfo(organization);
      assert.equal(info.owner, nonOwnerAccount);
    });

    it('should throw if transferring to a zero address', async () => {
      try {
        await organization.methods.transferOwnership(help.zeroAddress).send({ from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw if not executed from owner address', async () => {
      try {
        await organization.methods.transferOwnership(nonOwnerAccount).send({ from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('addAssociatedKey', async () => {
    it('should add associatedKey and emit', async () => {
      const receipt = await organization.methods.addAssociatedKey(nonOwnerAccount).send({ from: organizationOwner });
      assert.equal(Object.keys(receipt.events).length, 1);
      assert.equal(receipt.events.AssociatedKeyAdded.returnValues.associatedKey, nonOwnerAccount);
      assert.equal(receipt.events.AssociatedKeyAdded.returnValues.index, 1);
      assert.equal(await organization.methods.associatedKeysIndex(nonOwnerAccount).call(), 1);
      assert.equal(await organization.methods.associatedKeys(1).call(), nonOwnerAccount);
      assert.equal(await organization.methods.hasAssociatedKey(nonOwnerAccount).call(), true);
    });

    it('should throw when adding an existing associatedKey', async () => {
      await organization.methods.addAssociatedKey(nonOwnerAccount).send({ from: organizationOwner });
      try {
        await organization.methods.addAssociatedKey(nonOwnerAccount).send({ from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw when adding a associatedKey with zero address', async () => {
      try {
        await organization.methods.addAssociatedKey(help.zeroAddress).send({ from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw when adding a associatedKey by a non-owner', async () => {
      try {
        await organization.methods.addAssociatedKey(nonOwnerAccount).send({ from: nonOwnerAccount });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('removeAssociatedKey', async () => {
    it('should remove an existing associatedKey and emit', async () => {
      await organization.methods.addAssociatedKey(nonOwnerAccount).send({ from: organizationOwner });
      const receipt = await organization.methods.removeAssociatedKey(nonOwnerAccount).send({ from: organizationOwner });
      assert.equal(Object.keys(receipt.events).length, 1);
      assert.equal(receipt.events.AssociatedKeyRemoved.returnValues.associatedKey, nonOwnerAccount);
      assert.equal(await organization.methods.hasAssociatedKey(nonOwnerAccount).call(), false);
      assert.equal(await organization.methods.associatedKeys(1).call(), help.zeroAddress);
      assert.equal(await organization.methods.associatedKeysIndex(nonOwnerAccount).call(), 0);
    });

    it('should throw when removing a non-existing associatedKey', async () => {
      try {
        await organization.methods.removeAssociatedKey(nonOwnerAccount).send({ from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });

    it('should throw when removing a zero address', async () => {
      try {
        await organization.methods.removeAssociatedKey(help.zeroAddress).send({ from: organizationOwner });
        assert(false);
      } catch (e) {
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });

  describe('getAssociatedKeys', async () => {
    it('should list associatedKeys', async () => {
      await organization.methods.addAssociatedKey(nonOwnerAccount).send({ from: organizationOwner });
      const r = await organization.methods.getAssociatedKeys().call();
      assert.equal(r.length, 2);
    });
  });

  describe('hasAssociatedKey', async () => {
    it('should return false for a non-associatedKey', async () => {
      assert.equal(await organization.methods.hasAssociatedKey(nonOwnerAccount).call(), false);
    });

    it('should return true for a associatedKey', async () => {
      await organization.methods.addAssociatedKey(nonOwnerAccount).send({ from: organizationOwner });
      assert.equal(await organization.methods.hasAssociatedKey(nonOwnerAccount).call(), true);
    });
  });

  describe('ORG.ID Hierarchy', () => {
    let subsidiaryAddress;
    let subsidiary;

    beforeEach(async () => {
      subsidiaryAddress = await createSubsidiary(
        organization,
        organizationOwner,
        entityDirectorAccount,
        organizationUri,
        organizationHash
      );
      subsidiary = await Organization.at(subsidiaryAddress);
    });

    describe('createSubsidiary(string,bytes32,address)', () => {

      it('should throw if zero address of the entity director has been provided', async () => {
        await assertRevert(
          organization.methods['createSubsidiary(string,bytes32,address)'](
            organizationUri,
            organizationHash,
            help.zeroAddress
          ).send(
            {
              from: organizationOwner
            }
          ),
          'Organization: Invalid entity director address'
        );
      });

      it('shoudl throw if called by not an organization owner or director', async () => {
        await assertRevert(
          organization.methods['createSubsidiary(string,bytes32,address)'](
            organizationUri,
            organizationHash,
            entityDirectorAccount
          ).send(
            {
              from: nonOwnerAccount
            }
          ),
          'Organization: Only owner or entity director can call this method'
        );
      });

      // @todo Add test-case for 'empty Uri and Hash'

      it('should automatically confirm director ownership if the director is equal to the organization owner', async () => {
        const subsidiaryAddress = await createSubsidiary(
          organization,
          organizationOwner,
          organizationOwner,
          organizationUri,
          organizationHash
        );
        const subsidiaryParams = await organization.methods['getSubsidiary(address)'](subsidiaryAddress).call();
        (subsidiaryParams.confirmed).should.be.true;
      });

      it('should create a new subsidiary', async () => {
        // By owner
        const subsidiaryAddress = await createSubsidiary(
          organization,
          organizationOwner,
          entityDirectorAccount,
          organizationUri,
          organizationHash
        );
        const subsidiary = await Organization.at(subsidiaryAddress);
        
        // By director
        await createSubsidiary(
          subsidiary,
          entityDirectorAccount,
          nonOwnerAccount,
          organizationUri,
          organizationHash
        );
      });
    });

    // @todo Add test cases for the #createSubsidiaryAndAddToDirectory

    describe('toggleSubsidiary(address)', () => {
      
      it('should throw if wrong organization address has been provided', async () => {
        // zero-address
        await assertRevert(
          organization.methods['toggleSubsidiary(address)'](help.zeroAddress).send(
            {
              from: organizationOwner
            }
          ),
          'Organization: Invalid subsidiary address'
        );

        // unknown address
        await assertRevert(
          organization.methods['toggleSubsidiary(address)'](help.notExistedAddress).send(
            {
              from: organizationOwner
            }
          ),
          'Organization: Subsidiary not found'
        );
      });

      it('should toggle subsidiary organization state', async () => {
        await toggleSubsidiary(
          organization,
          organizationOwner,
          subsidiaryAddress
        );
      });
    });

    describe('confirmSubsidiaryDirectorOwnership(address)', () => {
      
      it('should throw if wrong organization address has been provided', async () => {
        // zero-address
        await assertRevert(
          organization.methods['confirmSubsidiaryDirectorOwnership(address)'](help.zeroAddress).send(
            {
              from: entityDirectorAccount
            }
          ),
          'Organization: Invalid subsidiary address'
        );

        // unknown address
        await assertRevert(
          organization.methods['confirmSubsidiaryDirectorOwnership(address)'](help.notExistedAddress).send(
            {
              from: entityDirectorAccount
            }
          ),
          'Organization: Subsidiary not found'
        );
      });

      it('should throw if director trying to confirm not own subsidiary', async () => {
        const anotherSubsidiaryAddress = await createSubsidiary(
          organization,
          organizationOwner,
          nonOwnerAccount,
          organizationUri,
          organizationHash
        );
        await assertRevert(
          organization.methods['confirmSubsidiaryDirectorOwnership(address)'](anotherSubsidiaryAddress).send(
            {
              from: entityDirectorAccount
            }
          ),
          'Organization: Only subsidiary director can call this method'
        );
      });

      it('should throw if called by unknown director address', async () => {
        await assertRevert(
          organization.methods['confirmSubsidiaryDirectorOwnership(address)'](subsidiaryAddress).send(
            {
              from: nonOwnerAccount
            }
          ),
          'Organization: Only subsidiary director can call this method'
        );
      });

      it('should confirm subsidiary director ownership', async () => {
        await confirmSubsidiaryDirectorOwnership(
          organization,
          subsidiaryAddress,
          entityDirectorAccount
        );
      });
    });

    describe('transferOwnership(address)', () => {

      beforeEach(async () => {
        await confirmSubsidiaryDirectorOwnership(
          organization,
          subsidiaryAddress,
          entityDirectorAccount
        );
      });

      it('should throw if called by an entity director', async () => {
        await assertRevert(
          subsidiary.methods['transferOwnership(address)'](nonOwnerAccount).send(
            {
              from: entityDirectorAccount
            }
          ),
          'Organization: Only owner can call this method'
        );
      });
    });

    describe('transferDirectorOwnership(address,address)', () => {

      it('should throw if wrong subsidiary address has been provided', async () => {
        // zero subsidiary address
        await assertRevert(
          organization.methods['transferDirectorOwnership(address,address)'](
            help.zeroAddress,
            nonOwnerAccount
          ).send(
            {
              from: organizationOwner
            }
          ),
          'Organization: Invalid subsidiary address'
        );

        // unknown subsidiary address
        await assertRevert(
          organization.methods['transferDirectorOwnership(address,address)'](
            help.notExistedAddress,
            nonOwnerAccount
          ).send(
            {
              from: organizationOwner
            }
          ),
          'Organization: Subsidiary not found'
        );
      });

      it('should throw if wrong director address has been provided', async () => {
        await assertRevert(
          organization.methods['transferDirectorOwnership(address,address)'](
            subsidiaryAddress,
            help.zeroAddress
          ).send(
            {
              from: organizationOwner
            }
          ),
          'Organization: Invalid subsidiary director address'
        );
      });

      it('should throw if called not by owner', async () => {
        await assertRevert(
          organization.methods['transferDirectorOwnership(address,address)'](
            subsidiaryAddress,
            nonOwnerAccount
          ).send(
            {
              from: nonOwnerAccount
            }
          ),
          'Organization: Only owner can call this method'
        );
      });

      it('should transfer subsidiary ownership', async () => {
        await transferSubsidiaryDirectorOwnership(
          organization.address,
          subsidiaryAddress,
          organizationOwner,
          nonOwnerAccount
        );
      });
    });

    describe('changeEntityDirector(address)', () => {

      it('should throw if called by not a parent entity', async () => {
        await assertRevert(
          organization.methods['changeEntityDirector(address)'](nonOwnerAccount).send(
            {
              from: entityDirectorAccount
            }
          ),
          'Organization: Only owner can call this method'
        );
      });
    });

    describe('ORG.ID changes', () => {
      const newOrgJsonUri = 'goo.gl/12345';
      const newOrgJsonHash = '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99';

      describe('changeOrgJsonUri(string)', () => {
      
        it('should throw if called by not an owner or entity director', async () => {
          await assertRevert(
            subsidiary.methods['changeOrgJsonUri(string)'](newOrgJsonUri).send(
              {
                from: nonOwnerAccount
              }
            ),
            'Organization: Only owner or entity director can call this method'
          );
        });
  
        it('should change OrgJsonUri', async () => {
          await changeOrgJsonUri(
            subsidiary,
            entityDirectorAccount,
            newOrgJsonUri
          );
        });
      });
  
      describe('changeOrgJsonHash(bytes32)', () => {
  
        it('should throw if called by not an owner or entity director', async () => {
          await assertRevert(
            subsidiary.methods['changeOrgJsonHash(bytes32)'](newOrgJsonHash).send(
              {
                from: nonOwnerAccount
              }
            ),
            'Organization: Only owner or entity director can call this method'
          );
        });
  
        it('should change OrgJsonUri', async () => {
          await changeOrgJsonHash(
            subsidiary,
            entityDirectorAccount,
            newOrgJsonHash
          );
        });
      });
  
      describe('changeOrgJsonUriAndHash(string,bytes32)', () => {
  
        it('should throw if called by not an owner or entity director', async () => {
          await assertRevert(
            subsidiary.methods['changeOrgJsonUriAndHash(string,bytes32)'](
              newOrgJsonUri,
              newOrgJsonHash
            ).send(
              {
                from: nonOwnerAccount
              }
            ),
            'Organization: Only owner or entity director can call this method'
          );
        });
  
        it('should change OrgJsonUri', async () => {
          await changeOrgJsonUriAndHash(
            subsidiary,
            entityDirectorAccount,
            newOrgJsonUri,
            newOrgJsonHash
          );
        });
      });
    });

    describe('Subsidiary getters', () => {

      beforeEach(async () => {
        organizationProxy = await project.createProxy(Organization, {
          from: proxyOwner,
          initFunction: 'initialize',
          initArgs: [
            organizationOwner,
            organizationUri,
            organizationHash,
            organizationFactory.address,
            help.zeroAddress,
            help.zeroAddress
          ],
        });
        organization = await Organization.at(organizationProxy.address);
      });

      describe('getSubsidiaries()', () => {

        it('should return an empty array if no subsidiaries has been created', async () => {
          ((await organization.methods['getSubsidiaries()']().call()).length).should.equal(0);
        });

        it('should return an empty array if subsidiary has been created by disabled', async () => {
          // Create a subsidiary
          const subsidiaryAddress = await createSubsidiary(
            organization,
            organizationOwner,
            entityDirectorAccount,
            organizationUri,
            organizationHash
          );
          // Confirm director ownership
          await confirmSubsidiaryDirectorOwnership(
            organization,
            subsidiaryAddress,
            entityDirectorAccount
          );
          // and disable this subsidiary
          await toggleSubsidiary(
            organization,
            organizationOwner,
            subsidiaryAddress
          );
          ((await organization.methods['getSubsidiaries()']().call()).length).should.equal(0);
        });
  
        it('should not return subsidiaries that has not confirmed ownership by the director', async () => {
          await createSubsidiary(
            organization,
            organizationOwner,
            entityDirectorAccount,
            organizationUri,
            organizationHash
          );
          ((await organization.methods['getSubsidiaries()']().call()).length).should.equal(0);
        });
  
        it('should return subsidiaries list', async () => {
          // First subsidiary
          const subsidiaryAddress1 = await createSubsidiary(
            organization,
            organizationOwner,
            entityDirectorAccount,
            organizationUri,
            organizationHash
          );
          await confirmSubsidiaryDirectorOwnership(
            organization,
            subsidiaryAddress1,
            entityDirectorAccount
          );
          // Second subsidiary
          const subsidiaryAddress2 = await createSubsidiary(
            organization,
            organizationOwner,
            entityDirectorAccount,
            organizationUri,
            organizationHash
          );
          await confirmSubsidiaryDirectorOwnership(
            organization,
            subsidiaryAddress2,
            entityDirectorAccount
          );
          // Get subsidiaries
          const subsidiaries = await organization.methods['getSubsidiaries()']().call();
          (subsidiaries.length).should.equal(2);
          (subsidiaries).should.to.be.an('array').that.include(subsidiaryAddress1);
          (subsidiaries).should.to.be.an('array').that.include(subsidiaryAddress2);
        });
      });
  
      describe('getSubsidiary(address)', () => {
        
        beforeEach(async () => {
          subsidiaryAddress = await createSubsidiary(
            organization,
            organizationOwner,
            entityDirectorAccount,
            organizationUri,
            organizationHash
          );
          await confirmSubsidiaryDirectorOwnership(
            organization,
            subsidiaryAddress,
            entityDirectorAccount
          );
          subsidiary = await Organization.at(subsidiaryAddress);
        });
  
        it('should throw if wrong organization address has been provided', async () => {
          // zero-address
          await assertRevert(
            organization.methods['getSubsidiary(address)'](help.zeroAddress).call(),
            'Organization: Invalid subsidiary address'
          );
  
          // unknown address
          await assertRevert(
            organization.methods['getSubsidiary(address)'](help.notExistedAddress).call(),
            'Organization: Subsidiary not found'
          );
        });
  
        it('should return subsidiary organization params', async () => {
          const subsidiaryParams = await organization.methods['getSubsidiary(address)'](subsidiaryAddress).call();
          (subsidiaryParams.id).should.equal(subsidiaryAddress);
          (subsidiaryParams.director).should.equal(entityDirectorAccount);
          (subsidiaryParams.state).should.be.true;
          (subsidiaryParams.confirmed).should.be.true;
        });
      });
  
      describe('parentEntity()', () => {

        beforeEach(async () => {
          subsidiaryAddress = await createSubsidiary(
            organization,
            organizationOwner,
            entityDirectorAccount,
            organizationUri,
            organizationHash
          );
          await confirmSubsidiaryDirectorOwnership(
            organization,
            subsidiaryAddress,
            entityDirectorAccount
          );
          subsidiary = await Organization.at(subsidiaryAddress);
        });
  
        it('should return zero address if entity has no parents', async () => {
          (await organization.methods['parentEntity()']().call()).should.equal(help.zeroAddress);
        });
  
        it('should return parent entity address', async () => {
          (await subsidiary.methods['parentEntity()']().call()).should.equal(organization.address);
        });
      });
  
      describe('entityDirector()', () => {
  
        it('should return zero address if entity has no parents', async () => {
          (await organization.methods['entityDirector()']().call()).should.equal(help.zeroAddress);
        });
  
        it('should return entity director address', async () => {
          (await subsidiary.methods['entityDirector()']().call()).should.equal(entityDirectorAccount);
        });
      });
    });
  });
});

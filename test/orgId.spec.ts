import type { Signer } from 'ethers';
import type { OrgIdCreationResult } from './helpers/setup';
import { ethers, upgrades } from 'hardhat';
import { expect } from 'chai';
import { deployOrgIdContract, createOrgId, createOrgIdWithDelegates } from './helpers/setup';
import { generateSalt, clone } from './helpers/utils';
import { zeroHash, zeroAddress } from './helpers/constants';
import 'mocha';

describe('ORGiD contract', () => {
  const metaName = 'ORGiD';
  let orgId: any;
  let owner1: Signer;
  let owner2: Signer;
  let owner3: Signer;
  let ownerAddress: string;
  let owner2Address: string;
  let owner3Address: string;

  before(async () => {
    orgId = await deployOrgIdContract();
    const signers = await ethers.getSigners();
    owner1 = signers[1];
    owner2 = signers[2];
    owner3 = signers[3];
    ownerAddress = await owner1.getAddress();
    owner2Address = await owner2.getAddress();
    owner3Address = await owner3.getAddress();
  });

  describe('Upgradeability', () => {

    describe('Proxy', () => {

      it('should be deployable', async () => {
        expect(orgId).to.haveOwnProperty('address').which.to.be.a('string');
      });
    });

    describe('Initializable', () => {

      it('should be initialized', async () => {
        expect(await orgId.name()).to.equal(metaName);
        expect(await orgId.symbol()).to.equal(metaName);
      });

      it('should throw on initializer call', async () => {
        await expect(orgId.initialize()).to.revertedWith(
          'Initializable: contract is already initialized'
        );
      });
    });

    describe('Upgrades', () => {

      it('should be upgradeable to the new version', async () => {
        const proxy = await deployOrgIdContract();
        expect(proxy).not.to.haveOwnProperty('version');
        const orgIdV2Factory = await ethers.getContractFactory(
          'OrgIdUpgradeabilityTest'
        );
        const proxyV2 = await upgrades.upgradeProxy(
          proxy.address,
          orgIdV2Factory
        );
        await proxyV2.__OrgIdV2_init();
        await expect(proxyV2.__OrgIdV2_init()).to.revertedWith(
          `ContractAlreadyInitialized("${
            ethers.utils.solidityKeccak256(
              ['string'],
              ['ORGID_V2_DOMAIN']
            )
          }")`
        );
        expect(await proxyV2.version()).to.equal('V2');
      });
    });
  });

  describe('ERC165', () => {

    describe('#supportsInterface(bytes4)', () => {

      it('should support OrgId interface [ @skip-on-coverage ]', async () => {
        expect(await orgId.supportsInterface('0x8bf1ed02')).to.be.true;
      });

      it('should support OrgIdDelegates interface [ @skip-on-coverage ]', async () => {
        expect(await orgId.supportsInterface('0x5deabe77')).to.be.true;
      });

      it('should support ERC165 interface', async () => {
        expect(await orgId.supportsInterface('0x01ffc9a7')).to.be.true;
      });

      it('should support ERC721Metadata interface', async () => {
        expect(await orgId.supportsInterface('0x5b5e139f')).to.be.true;
      });

      it('should support ERC721 interface', async () => {
        expect(await orgId.supportsInterface('0x80ac58cd')).to.be.true;
      });

      it('should support ERC721Enumerable interface', async () => {
        expect(await orgId.supportsInterface('0x780e9d63')).to.be.true;
      });
    });
  });

  describe('OrgIdRegistry', () => {

    describe('#createOrgId(bytes32,string)', () => {

      it('should throw if empty string provided as orgJsonUri', async () => {
        await expect(
          createOrgId(orgId, owner1, generateSalt(), '')
        ).to.revertedWith('OrgJsonUriEmpty()');
      });

      it('should throw if ORGiD already exists', async () => {
        const org = await createOrgId(orgId, owner1);
        await expect(
          createOrgId(orgId, owner1, org.salt, org.orgJsonUri)
        ).to.revertedWith(`OrgIdAlreadyExists("${org.orgId}")`);
      });

      it('should create new ORGiD', async () => {
        await createOrgId(orgId, owner1);
      });
    });

    describe('Existed orgId functions', () => {
      let org: OrgIdCreationResult;

      before(async () => {
        org = await createOrgId(orgId, owner1);
      });

      describe('#setOrgJson(bytes32,string)', () => {

        after(async () => {
          org = await createOrgId(orgId, owner1);
        });

        it('should throw if zero bytes provided as orgId hash', async () => {
          await expect(
            orgId.connect(owner1)['setOrgJson(bytes32,string)'](zeroHash, 'test')
          ).to.revertedWith(`OrgIdNotFound("${zeroHash}")`);
        });

        it('should throw if provided unknown orgId hash', async () => {
          const unknownOrgId = generateSalt();
          await expect(
            orgId.connect(owner1)['setOrgJson(bytes32,string)'](unknownOrgId, 'test')
          ).to.revertedWith(`OrgIdNotFound("${unknownOrgId}")`);
        });

        it('should throw if empty string provided as orgJsonUri', async () => {
          await expect(
            orgId.connect(owner1)['setOrgJson(bytes32,string)'](org.orgId, '')
          ).to.revertedWith('OrgJsonUriEmpty()');
        });

        it('should throw if called not by an ORGiD owner', async () => {
          await expect(
            orgId.connect(owner2)['setOrgJson(bytes32,string)'](org.orgId, 'test')
          ).to.revertedWith('CalledNotByOrgIdOwner()');
        });

        it('should set new orgJsonUri value', async () => {
          const newUri = 'test2';
          await orgId.connect(owner1)['setOrgJson(bytes32,string)'](org.orgId, newUri);
          const { orgJsonUri } = await orgId.getOrgId(org.tokenId);
          expect(orgJsonUri).to.equal(newUri);
        });
      });

      describe('#getTokenId(bytes32)', () => {

        it('should return zero-hash if ORGiD not exists', async () => {
          const result = await orgId.getTokenId(generateSalt());
          expect(result).to.be.equal(0);
        });

        it('should return ORGiD', async () => {
          const result = await orgId.getTokenId(org.orgId);
          expect(result).to.be.equal(org.tokenId);
        });
      });

      describe('#getOrgId(uint256)', () => {

        it('should return zero-valued ORGiD not exists', async () => {
          const result = await orgId.getOrgId(1000);
          expect(result.exists).to.be.false;
          expect(result.orgId).to.be.equal(zeroHash);
          expect(result.orgJsonUri).to.be.equal('');
          expect(result.owner).to.be.equal(zeroAddress);
        });

        it('should return ORGiD', async () => {
          const result = await orgId.getOrgId(org.tokenId);
          expect(result.exists).to.be.true;
          expect(result.orgId).to.be.equal(org.orgId);
          expect(result.orgJsonUri).to.be.equal(org.orgJsonUri);
          expect(result.owner).to.be.equal(org.orgIdOwner);
        });
      });
    });

    describe('#getOrgIds()', () => {
      let orgId: any;

      before(async () => {
        orgId = await deployOrgIdContract();
      });

      it('should return empty array if zero organization registered yet', async () => {
        const result = await orgId['getOrgIds()']();
        expect(result.length).to.equal(0);
      });

      it('should return whole list of registered orgIds', async () => {
        const orgIds = await Promise.all(Array(3).fill('').map(
          _ => createOrgId(orgId, owner1)
        ));
        const result = await orgId['getOrgIds()']();
        expect(result.length).to.equal(3);
        result.forEach((id, i) => {
          expect(id).to.equal(orgIds[i].orgId);
        });
      });
    });

    describe('#getOrgIds(uint256,uint256)', () => {
      let orgId: any;

      before(async () => {
        orgId = await deployOrgIdContract();
      });

      describe('empty contract', () => {

        it('should return empty array if zero organization registered yet', async () => {
          const result = await orgId['getOrgIds(uint256,uint256)'](0, 1);
          expect(result.length).to.equal(0);
        });
      });

      describe('with organizations', () => {
        let orgIds: OrgIdCreationResult[];
        let totalSupply: number;

        before(async () => {
          orgIds = await Promise.all(Array(9).fill('').map(
            _ => createOrgId(orgId, owner1)
          ));
          totalSupply = await orgId.totalSupply();
        });

        it('should return empty array if count equal to zero', async () => {
          const result = await orgId['getOrgIds(uint256,uint256)'](0, 0);
          expect(result.length).to.equal(0);
        });

        it('should return empty array if cursor greater than or equal orgIds count (totalSupply)', async () => {
          let result = await orgId['getOrgIds(uint256,uint256)'](totalSupply, 0);
          expect(result.length).to.equal(0);
          result = await orgId['getOrgIds(uint256,uint256)'](totalSupply + 1, 0);
          expect(result.length).to.equal(0);
        });

        it('should return paginated array of orgIds', async () => {
          const step = 2;
          for (let cursor = 0; cursor < totalSupply; cursor += step) {
            const result = await orgId['getOrgIds(uint256,uint256)'](cursor, step);
            expect(result.length).to.lessThanOrEqual(step);
            result.forEach((id, i) => {
              expect(id).to.equal(orgIds[cursor + i].orgId);
            });
          }
        });
      });
    });
  });

  describe('OrgIdDelegates', () => {
    const delegates = [
      'did1',
      'did2',
      'did3'
    ];
    let orgIdOwner: Signer;
    let orgIdNonOwner: Signer;
    let org: OrgIdCreationResult;

    describe('#addDelegates(bytes32,string[])', () => {

      before(async () => {
        orgIdOwner = owner1;
        orgIdNonOwner = owner2;
        org = await createOrgId(orgId, orgIdOwner);
      });

      it('should throw if ORGiD not exists', async () => {
        const unknownOrgId = generateSalt();
        await expect(
          orgId.connect(orgIdOwner).addDelegates(unknownOrgId, delegates)
        ).to.revertedWith(`OrgIdNotFound("${unknownOrgId}")`);
      });

      it('should throw if called not by an ORGiD owner', async () => {
        await expect(
          orgId.connect(orgIdNonOwner).addDelegates(org.orgId, delegates)
        ).to.revertedWith('CalledNotByOrgIdOwner()');
      });

      it('should throw if empty array provided as dids', async () => {
        await expect(
          orgId.connect(orgIdOwner).addDelegates(org.orgId, [])
        ).to.revertedWith('InvalidDelegatesInput()');
      });

      it('should throw if at least one did is empty string', async () => {
        const brokenDelegates = clone(delegates);
        brokenDelegates[1] = '';
        await expect(
          orgId.connect(orgIdOwner).addDelegates(org.orgId, brokenDelegates)
        ).to.revertedWith('InvalidDelegatesInput()');
      });

      it('should add delegates', async () => {
        const tx = await orgId.connect(orgIdOwner)
          .addDelegates(org.orgId, delegates);
        await expect(tx).to
          .emit(orgId, 'OrgIdDelegatesAdded')
          .withArgs(org.orgId, delegates);
      });
    });

    describe('Remove delegates', () => {

      before(async () => {
        orgIdOwner = owner1;
        orgIdNonOwner = owner2;
        org = await createOrgId(orgId, orgIdOwner);
      });

      describe('#removeDelegates(bytes32,string[])', () => {

        before(async () => {
          const tx = await orgId.connect(orgIdOwner)
            .addDelegates(org.orgId, delegates);
          await tx.wait();
        });

        it('should throw if ORGiD not exists', async () => {
          const unknownOrgId = generateSalt();
          await expect(
            orgId.connect(orgIdOwner)['removeDelegates(bytes32,string[])'](
              unknownOrgId,
              delegates
            )
          ).to.revertedWith(`OrgIdNotFound("${unknownOrgId}")`);
        });

        it('should throw if called not by an ORGiD owner', async () => {
          await expect(
            orgId.connect(orgIdNonOwner)['removeDelegates(bytes32,string[])'](
              org.orgId,
              delegates
            )
          ).to.revertedWith('CalledNotByOrgIdOwner()');
        });

        it('should throw if empty array provided as dids', async () => {
          await expect(
            orgId.connect(orgIdOwner)['removeDelegates(bytes32,string[])'](
              org.orgId,
              []
            )
          ).to.revertedWith('InvalidDelegatesInput()');
        });

        it('should throw if at least one did is empty string', async () => {
          const brokenDelegates = clone(delegates);
          brokenDelegates[1] = '';
          await expect(
            orgId.connect(orgIdOwner)['removeDelegates(bytes32,string[])'](
              org.orgId,
              brokenDelegates
            )
          ).to.revertedWith('InvalidDelegatesInput()');
        });

        it('should remove delegates', async () => {
          const delegates1 = [ delegates[1] ];
          const delegates2 = [ delegates[0], delegates[2] ];
          let tx = await orgId.connect(orgIdOwner)['removeDelegates(bytes32,string[])'](
            org.orgId,
            delegates1
          );
          await expect(tx).to
            .emit(orgId, 'OrgIdDelegatesRemoved')
            .withArgs(org.orgId, delegates1);
          tx = await orgId.connect(orgIdOwner)['removeDelegates(bytes32,string[])'](
            org.orgId,
            delegates2
          );
          await expect(tx).to
            .emit(orgId, 'OrgIdDelegatesRemoved')
            .withArgs(org.orgId, delegates2);
        });
      });

      describe('#removeDelegates(bytes32)', () => {

        before(async () => {
          const tx = await orgId.connect(orgIdOwner)
            .addDelegates(org.orgId, delegates);
          await tx.wait();
        });

        it('should throw if ORGiD not exists', async () => {
          const unknownOrgId = generateSalt();
          await expect(
            orgId.connect(orgIdOwner)['removeDelegates(bytes32)'](
              unknownOrgId
            )
          ).to.revertedWith(`OrgIdNotFound("${unknownOrgId}")`);
        });

        it('should throw if called not by an ORGiD owner', async () => {
          await expect(
            orgId.connect(orgIdNonOwner)['removeDelegates(bytes32)'](
              org.orgId
            )
          ).to.revertedWith('CalledNotByOrgIdOwner()');
        });

        it('should remove all delegates', async () => {
          const tx = await orgId.connect(orgIdOwner)['removeDelegates(bytes32)'](
            org.orgId
          );
          await expect(tx).to
            .emit(orgId, 'OrgIdDelegatesRemoved')
            .withArgs(org.orgId, delegates);
        });
      });
    });

    describe('#getDelegates(bytes32)', () => {
      let emptyOrg: OrgIdCreationResult;

      before(async () => {
        orgIdOwner = owner1;
        org = await createOrgId(orgId, orgIdOwner);
        emptyOrg = await createOrgId(orgId, orgIdOwner);
        const tx = await orgId.connect(orgIdOwner)
          .addDelegates(org.orgId, delegates);
        await tx.wait();
      });

      it('should return empty array if no delegates have been added before', async () => {
        expect(await orgId.getDelegates(emptyOrg.orgId)).to.deep.equal([]);
      });

      it('should return delegates', async () => {
        expect(await orgId.getDelegates(org.orgId)).to.deep.equal(delegates);
      });

      it('should return delegates of updated list', async () => {
        const delegates1 = [ delegates[1] ];
        const delegates2 = [ delegates[0], delegates[2] ];
        let tx = await orgId.connect(orgIdOwner)['removeDelegates(bytes32,string[])'](
          org.orgId,
          delegates1
        );
        expect(await orgId.getDelegates(org.orgId)).to.deep.equal(delegates2);
      });
    });
  });

  describe('OrgIdFeat', () => {
    const delegates = ['did1', 'did2'];

    describe('#createOrgId(bytes32,string,string[])', () => {

      it('should throw if empty string provided as orgJsonUri', async () => {
        await expect(
          createOrgIdWithDelegates(orgId, owner1, generateSalt(), '', delegates)
        ).to.revertedWith('OrgJsonUriEmpty()');
      });

      it('should throw if ORGiD already exists', async () => {
        const org = await createOrgId(orgId, owner1);
        await expect(
          createOrgIdWithDelegates(orgId, owner1, org.salt, org.orgJsonUri, delegates)
        ).to.revertedWith(`OrgIdAlreadyExists("${org.orgId}")`);
      });

      it('should create new ORGiD', async () => {
        await createOrgIdWithDelegates(orgId, owner1, generateSalt(), 'uri1', delegates);
      });
    });

    describe('#setOrgJson(bytes32,string,string[])', () => {
      let org: OrgIdCreationResult;

      before(async () => {
        org = await createOrgId(orgId, owner1);
      });

      it('should throw if zero bytes provided as orgId hash', async () => {
        await expect(
          orgId.connect(owner1)['setOrgJson(bytes32,string,string[])'](zeroHash, 'test', delegates)
        ).to.revertedWith(`OrgIdNotFound("${zeroHash}")`);
      });

      it('should throw if provided unknown orgId hash', async () => {
        const unknownOrgId = generateSalt();
        await expect(
          orgId.connect(owner1)['setOrgJson(bytes32,string,string[])'](unknownOrgId, 'test', delegates)
        ).to.revertedWith(`OrgIdNotFound("${unknownOrgId}")`);
      });

      it('should throw if empty string provided as orgJsonUri', async () => {
        await expect(
          orgId.connect(owner1)['setOrgJson(bytes32,string,string[])'](org.orgId, '', delegates)
        ).to.revertedWith('OrgJsonUriEmpty()');
      });

      it('should throw if called not by an ORGiD owner', async () => {
        await expect(
          orgId.connect(owner2)['setOrgJson(bytes32,string,string[])'](org.orgId, 'test', delegates)
        ).to.revertedWith('CalledNotByOrgIdOwner()');
      });

      it('should set new orgJsonUri value', async () => {
        const newUri = 'test2';
        await orgId.connect(owner1)['setOrgJson(bytes32,string,string[])'](org.orgId, newUri, delegates);
        const { orgJsonUri } = await orgId.getOrgId(org.tokenId);
        expect(orgJsonUri).to.equal(newUri);
      });
    });
  });

  describe('ERC721', () => {

    describe('Metadata', () => {

      describe('#name()', () => {

        it('should return the token name', async () => {
          expect(await orgId.name()).to.equal(metaName);
        });
      });

      describe('#symbol()', () => {

        it('should return the token symbol', async () => {
          expect(await orgId.symbol()).to.equal(metaName);
        });
      });

      describe('#tokenURI(uint256)', () => {
        let org: OrgIdCreationResult;

        before(async () => {
          org = await createOrgId(orgId, owner1);
        });

        it('should throw when unknown tokenId provided', async () => {
          const unknownTokenId = 1000;
          await expect(orgId.tokenURI(unknownTokenId)).to.revertedWith('TokenNotFound');
        });

        it('should return the token URI', async () => {
          expect(await orgId.tokenURI(org.tokenId)).to.equal(org.orgJsonUri);
        });
      });
    });

    describe('Balance', () => {
      let orgId: any;

      before(async () => {
        orgId = await deployOrgIdContract();
      });

      describe('#balanceOf(address)', () => {

        describe('empty contract', () => {

          it('should return zero if an address has no registered orgIds', async () => {
            expect(await orgId.balanceOf(await owner1.getAddress()))
              .to.equal(0);
          });
        });

        describe('with organizations', () => {
          const count = 3;

          before(async () => {
            await Promise.all(Array(count).fill('').map(
              _ => createOrgId(orgId, owner1)
            ));
          });

          it('should return balance of address', async () => {
            expect(await orgId.balanceOf(await owner1.getAddress()))
              .to.equal(count);
          });
        });
      });

      describe('#ownerOf(uint256)', () => {
        let orgId: any;
        let org: OrgIdCreationResult;

        before(async () => {
          orgId = await deployOrgIdContract();
          org = await createOrgId(orgId, owner1);
        });

        it('should throw if token not exists', async () => {
          await expect(orgId.ownerOf(1000))
            .to.revertedWith('ERC721: invalid token ID');
        });

        it('should return balance of token', async () => {
          expect(await orgId.ownerOf(org.tokenId))
            .to.equal(await owner1.getAddress());
        });
      });
    });

    describe('ERC721Enumerable', () => {
      let orgId: any;

      before(async () => {
        orgId = await deployOrgIdContract();
      });

      describe('#totalSupply()', () => {

        describe('empty contract', () => {

          it('should return zero if organization not been registered yet', async () => {
            expect(await orgId.totalSupply()).to.equal(0);
          });
        });

        describe('with organizations', () => {
          const count = 3;

          before(async () => {
            await Promise.all(Array(count).fill('').map(
              _ => createOrgId(orgId, owner1)
            ));
          });

          it('should return total supply', async () => {
            expect(await orgId.totalSupply()).to.equal(count);
          });
        });
      });

      describe('#tokenOfOwnerByIndex(address,index)', () => {
        let org: OrgIdCreationResult;
        let ownerAddress: string;

        before(async () => {
          org = await createOrgId(orgId, owner1);
          ownerAddress = await owner1.getAddress();
        });

        it('should throw if token not owned by address', async () => {
          await expect(orgId.tokenOfOwnerByIndex(ownerAddress, 1000))
            .to.revertedWith('ERC721Enumerable: owner index out of bounds');
        });

        it('should return token id owned by address by token index', async () => {
          const balance = await orgId.balanceOf(ownerAddress);
          expect(await orgId.tokenOfOwnerByIndex(ownerAddress, balance - 1))
            .to.equal(org.tokenId);
        });
      });

      describe('#tokenByIndex(uint256)', () => {
        let org: OrgIdCreationResult;

        before(async () => {
          org = await createOrgId(orgId, owner1);
        });

        it('should throw if token not exists', async () => {
          await expect(orgId.tokenByIndex(1000))
            .to.revertedWith('ERC721Enumerable: global index out of bounds');
        });

        it('should return token id by index', async () => {
          expect(await orgId.tokenByIndex(0))
            .to.equal(1);
        });
      });
    });

    describe('Allowance', () => {
      let org: OrgIdCreationResult;

      before(async () => {
        org = await createOrgId(orgId, owner1);
      });

      describe('#approve(address,uint256)', () => {

        it('should throw if caller equal to the owner', async () => {
          await expect(
            orgId.connect(owner1).approve(ownerAddress, org.tokenId)
          ).to.revertedWith(
            'ERC721: approval to current owner'
          );
        });

        it('should throw if called not by the token owner', async () => {
          await expect(
            orgId.connect(owner2).approve(owner2Address, org.tokenId)
          ).to.revertedWith(
            'ERC721: approve caller is not token owner nor approved for all'
          );
        });

        it('should approve token transfer by the address', async () => {
          await orgId.connect(owner1).approve(owner2Address, org.tokenId);
          expect(await orgId.getApproved(org.tokenId)).to.equal(owner2Address);
        });
      });

      describe('#getApproved(uint256)', () => {

        it('should throw if token not exists', async () => {
          await expect(orgId.getApproved(1000))
            .to.revertedWith('ERC721: invalid token ID');
        });

        it('should return address of approved operator', async () => {
          await orgId.connect(owner1).approve(owner2Address, org.tokenId);
          expect(await orgId.getApproved(org.tokenId)).to.equal(owner2Address);
        });
      });

      describe('#setApprovalForAll(address,bool)', () => {

        it('should throw if caller equal to the owner', async () => {
          await expect(
            orgId.connect(owner1).setApprovalForAll(ownerAddress, true)
          ).to.revertedWith('ERC721: approve to caller');
        });

        it('should set approval for all', async () => {
          await orgId.connect(owner1)
            .setApprovalForAll(owner2Address, true);
          expect(await orgId.isApprovedForAll(ownerAddress, owner2Address))
            .to.be.true;
        });
      });

      describe('#isApprovedForAll(address,address)', () => {

        it('should return false if not approved for operator', async () => {
          expect(await orgId.isApprovedForAll(ownerAddress, zeroAddress))
            .to.be.false;
        });

        it('should return true if approved for operator', async () => {
          await orgId.connect(owner1)
            .setApprovalForAll(owner2Address, true);
          expect(await orgId.isApprovedForAll(ownerAddress, owner2Address))
            .to.be.true;
        });
      });

      describe('#transferFrom(address,address,uint256)', () => {

        it('should throw if called by not approved operator or owner', async () => {
          await expect(orgId.transferFrom(ownerAddress, owner2Address, 1))
            .to.revertedWith('ERC721: caller is not token owner nor approved');
        });

        it('should transfer token to new owner', async () => {
          await orgId.connect(owner1).approve(owner2Address, 1);
          await orgId.connect(owner2).transferFrom(ownerAddress, owner2Address, 1);
        });
      });

      describe('#safeTransferFrom(address,address,uint256)', () => {
        let receiver: any;
        let nonReceiver: any;

        before(async () => {
          const receiverFactory = await ethers.getContractFactory('ERC721Receiver');
          const nonReceiverFactory = await ethers.getContractFactory('NonERC721Receiver');
          receiver = await receiverFactory.deploy();
          nonReceiver = await nonReceiverFactory.deploy();
        });

        it('should throw if called by not approved operator or owner', async () => {
          await expect(
            orgId.connect(owner3)['safeTransferFrom(address,address,uint256)'](
              ownerAddress,
              owner3Address,
              org.tokenId
            )
          ).to.revertedWith('ERC721: caller is not token owner nor approved');
        });

        it('should throw if transferred to the non-ERC721Receiver', async () => {
          await orgId.connect(owner1).approve(nonReceiver.address, org.tokenId);
          await expect(
            orgId.connect(owner1)['safeTransferFrom(address,address,uint256)'](
              ownerAddress,
              nonReceiver.address,
              org.tokenId
            )
          ).to.revertedWith('ERC721: transfer to non ERC721Receiver implementer');
        });

        it('should transfer token to new owner (address and contract)', async () => {
          await orgId.connect(owner1)['safeTransferFrom(address,address,uint256)'](
            ownerAddress,
            owner2Address,
            org.tokenId
          );
          await orgId.connect(owner2).approve(owner3Address, org.tokenId);
          await orgId.connect(owner3)['safeTransferFrom(address,address,uint256)'](
            owner2Address,
            owner3Address,
            org.tokenId
          );
          await orgId.connect(owner3).approve(receiver.address, org.tokenId);
          await orgId.connect(owner3)['safeTransferFrom(address,address,uint256)'](
            owner3Address,
            receiver.address,
            org.tokenId
          );
        });
      });
    });
  });
});

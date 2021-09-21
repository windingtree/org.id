import { ethers, upgrades } from 'hardhat';
import { expect } from 'chai';

describe('ORGiD contract', () => {
  let orgId;

  const deployOrgId = async () => {
    const orgIdFactory = await ethers.getContractFactory('OrgId');
    const orgId = await upgrades.deployProxy(orgIdFactory);
    await orgId.deployed();
    return orgId;
  };

  before(async () => {
    orgId = await deployOrgId();
  });

  describe('Upgradeability', () => {

    describe('Proxy', () => {

      it('should be deployable', async () => {});
    });

    describe('Initializable', () => {

      it('should be initialized', async () => {});

      it('should throw on initializer call', async () => {});
    });

    describe('Upgrades', () => {

      it('should be upgradeable to the new version', async () => {});
    });
  });

  describe('ERC165', () => {

    describe('#supportsInterface(bytes4)', () => {

      it('should support OrgId interface', async () => {});

      it('should support ERC721Metadata interface', async () => {});

      it('should support ERC721 interface', async () => {});

      it('should support IERC721Enumerable interface', async () => {});
    });
  });

  describe('OrgIdRegistry', () => {

    describe('#createOrgId(bytes32,string)', () => {

      it('should throw if empty string provided as orgJsonUri', async () => {});

      it('should create new ORGiD', async () => {});
    });

    describe('#setOrgJson(bytes32,string)', () => {

      it('should throw if zero bytes provided as orgId hash', async () => {});

      it('should throw if empty string provided as orgJsonUri', async () => {});

      it('should throw if called not by an ORGiD owner', async () => {});

      it('should set new orgJsonUri value', async () => {});
    });

    describe('#getOrgJsonUri(bytes32)', () => {

      it('should return empty string if ORGiD not exists', async () => {});

      it('should return orgJsonUri', async () => {});
    });

    describe('#getTokenId(bytes32)', () => {

      it('should return zero is token ton exists', async () => {});

      it('should return token Id', async () => {});
    });

    describe('#getOrgIds()', () => {

      it('should return empty array if zero organization registered yet', async () => {});

      it('should return whole list of registered orgIds', async () => {});
    });

    describe('#getOrgIds(uint256,uint256)', () => {

      it('should return empty array if zero organization registered yet', async () => {});

      it('should return empty array if count equal to zero', async () => {});

      it('should return empty array if cursor greater than orgIds count (totalSupply)', async () => {});

      it('should return paginated array of orgIds', async () => {});
    });
  });

  describe('ERC721', () => {

    describe('Metadata', () => {

      describe('#name()', () => {

        it('should return the token name', async () => {});
      });

      describe('#symbol()', () => {

        it('should return the token symbol', async () => {});
      });

      describe('#tokenURI(uint256)', () => {

        it('should return the token URI', async () => {});
      });
    });

    describe('Balance', () => {

      describe('#balanceOf(address)', () => {

        it('should return zero if an address has no registered orgIds', async () => {});

        it('should return balance of address', async () => {});
      });

      describe('#ownerOf(uint256)', () => {

        it('should return zero if token ton exists', async () => {});

        it('should return balance of token', async () => {});
      });
    });

    describe('ERC721Enumerable', () => {

      describe('#totalSupply()', () => {

        it('should return zero if organization not been registered yet', async () => {});

        it('should return total supply', async () => {});
      });

      describe('#tokenOfOwnerByIndex(address,index)', () => {

        it('should throw if token not owned by address', async () => {});

        it('should return token id owned by address by token index', async () => {});
      });

      describe('#tokenByIndex(uint256)', () => {

        it('should throw if token not exists', async () => {});

        it('should return token id by index', async () => {});
      });
    });

    describe('Allowance', () => {

      describe('#approve(address,uint256)', () => {

        it('should throw if caller equal to the owner', async () => {});

        it('should throw if called not by the token owner', async () => {});

        it('should approve token transfer by the address', async () => {});
      });

      describe('#getApproved(uint256)', () => {

        it('should throw if token not exists', async () => {});

        it('should return address of approved operator', async () => {});
      });

      describe('#setApprovalForAll(address,bool)', () => {

        it('should throw if caller equal to the owner', async () => {});

        it('should set approval for all', async () => {});
      });

      describe('#isApprovedForAll(address,address)', () => {

        it('should return false id token not approved for operator', async () => {});

        it('should return true id token approved for operator', async () => {});
      });

      describe('#transferFrom(address,address,uint256)', () => {

        it('should throw if called by not approved operator or owner', async () => {});

        it('should transfer token to new owner', async () => {});
      });

      describe('#safeTransferFrom(address,address,uint256)', () => {

        it('should throw if called by not approved operator or owner', async () => {});

        it('should throw if transferred to the non-ERC721Receiver', async () => {});

        it('should transfer token to new owner', async () => {});
      });

      describe('#safeTransferFrom(address,address,uint256,bytes)', () => {

        it('should throw if called by not approved operator or owner', async () => {});

        it('should throw if transferred to the non-ERC721Receiver', async () => {});

        it('should transfer token to new owner', async () => {});
      });
    });
  });
});

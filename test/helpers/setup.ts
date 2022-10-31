import type { Contract, Signer } from 'ethers';
import { ethers, upgrades } from 'hardhat';
import { expect } from 'chai';
import { generateSalt, generateOrgId } from './utils';
import { zeroAddress } from '../helpers/constants';

export interface OrgIdCreationResult {
  salt: string;
  orgId: string;
  orgIdOwner: string;
  orgJsonUri: string;
  tokenId: number;
}

// Deploys a new OrgId contract
export const deployOrgIdContract = async (): Promise<Contract> => {
  const orgIdFactory = await ethers.getContractFactory('OrgId');
  const orgId = await upgrades.deployProxy(orgIdFactory);
  await orgId.deployed();
  return orgId;
};

// Create an orgId
export const createOrgId = async (
  contract: Contract,
  from: Signer,
  salt = generateSalt(),
  orgJsonUri = 'test'
): Promise<OrgIdCreationResult> => {
  const orgId = await generateOrgId(salt, from);
  const orgIdOwner = await from.getAddress();

  const contractWithSigner = contract.connect(from);
  const tx = await contractWithSigner['createOrgId(bytes32,string)'](salt, orgJsonUri);
  await tx.wait();

  const tokenId = await contractWithSigner.getTokenId(orgId);
  const { exists } = await contractWithSigner.getOrgId(tokenId);
  expect(exists).to.be.true;

  // OrgIdRegistry events
  expect(tx).to.emit(contract, 'OrgIdCreated').withArgs(
    orgId,
    orgIdOwner
  );
  expect(tx).to.emit(contract, 'OrgJsonUriChanged').withArgs(
    orgId,
    orgJsonUri
  );

  // ERG721 events
  expect(tx).to.emit(contract, 'Transfer').withArgs(
    zeroAddress,
    orgIdOwner,
    tokenId
  );

  return {
    salt,
    orgId,
    orgIdOwner,
    orgJsonUri,
    tokenId
  };
}

// Create an orgId with delegates
export const createOrgIdWithDelegates = async (
  contract: Contract,
  from: Signer,
  salt = generateSalt(),
  orgJsonUri = 'test',
  delegates: string[]
): Promise<OrgIdCreationResult> => {
  const orgId = await generateOrgId(salt, from);
  const orgIdOwner = await from.getAddress();

  const contractWithSigner = contract.connect(from);
  const tx = await contractWithSigner['createOrgId(bytes32,string,string[])'](salt, orgJsonUri, delegates);
  await tx.wait();

  const tokenId = await contractWithSigner.getTokenId(orgId);
  const { exists } = await contractWithSigner.getOrgId(tokenId);
  expect(exists).to.be.true;

  // OrgIdRegistry events
  expect(tx).to.emit(contract, 'OrgIdCreated').withArgs(
    orgId,
    orgIdOwner
  );
  expect(tx).to.emit(contract, 'OrgJsonUriChanged').withArgs(
    orgId,
    orgJsonUri
  );

  // OrgIdDelegates events
  if (delegates.length > 0) {
    expect(tx).to.emit(orgId, 'OrgIdDelegatesAdded')
    .withArgs(orgId, delegates);
  }

  // ERG721 events
  expect(tx).to.emit(contract, 'Transfer').withArgs(
    zeroAddress,
    orgIdOwner,
    tokenId
  );

  return {
    salt,
    orgId,
    orgIdOwner,
    orgJsonUri,
    tokenId
  };
}

import type { Signer } from 'ethers';
import { ethers } from 'hardhat';

// Generates a random salt
export const generateSalt = (): string => ethers.utils.solidityKeccak256(
  [
    'string'
  ],
  [
    Math.random().toString()
  ]
);

// Generate an orgId on the base of salt and address
export const generateOrgId = async (salt: string, sender: Signer): Promise<string> => {
  const address = await sender.getAddress();
  return ethers.utils.solidityKeccak256(
    [
      'address',
      'bytes32'
    ],
    [
      address,
      salt
    ]
  );
}

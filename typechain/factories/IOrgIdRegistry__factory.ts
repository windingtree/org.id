/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IOrgIdRegistry,
  IOrgIdRegistryInterface,
} from "../IOrgIdRegistry";

const _abi = [
  {
    inputs: [],
    name: "CalledNotByOrgIdOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "orgId",
        type: "bytes32",
      },
    ],
    name: "OrgIdAlreadyExists",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "orgId",
        type: "bytes32",
      },
    ],
    name: "OrgIdNotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "OrgJsonUriEmpty",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "TokenNotFound",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "orgId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OrgIdCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "orgId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string",
        name: "orgJsonUri",
        type: "string",
      },
    ],
    name: "OrgJsonUriChanged",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "orgJsonUri",
        type: "string",
      },
    ],
    name: "createOrgId",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "orgId",
        type: "bytes32",
      },
    ],
    name: "getOrgId",
    outputs: [
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "orgJsonUri",
        type: "string",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "cursor",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
    ],
    name: "getOrgIds",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "orgIds",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getOrgIds",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "orgIds",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "orgId",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "orgJsonUri",
        type: "string",
      },
    ],
    name: "setOrgJson",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IOrgIdRegistry__factory {
  static readonly abi = _abi;
  static createInterface(): IOrgIdRegistryInterface {
    return new utils.Interface(_abi) as IOrgIdRegistryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IOrgIdRegistry {
    return new Contract(address, _abi, signerOrProvider) as IOrgIdRegistry;
  }
}

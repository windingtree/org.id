/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IOrgIdDelegates,
  IOrgIdDelegatesInterface,
} from "../IOrgIdDelegates";

const _abi = [
  {
    inputs: [],
    name: "InvalidDelegatesInput",
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
        indexed: false,
        internalType: "string[]",
        name: "delegates",
        type: "string[]",
      },
    ],
    name: "OrgIdDelegatesAdded",
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
        internalType: "string[]",
        name: "delegates",
        type: "string[]",
      },
    ],
    name: "OrgIdDelegatesRemoved",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "orgId",
        type: "bytes32",
      },
      {
        internalType: "string[]",
        name: "dids",
        type: "string[]",
      },
    ],
    name: "addDelegates",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
<<<<<<< HEAD
=======
        name: "c__0x44655cf7",
        type: "bytes32",
      },
    ],
    name: "c_0x44655cf7",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
>>>>>>> develop
        name: "orgId",
        type: "bytes32",
      },
    ],
    name: "getDelegates",
    outputs: [
      {
        internalType: "string[]",
        name: "dids",
        type: "string[]",
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
    ],
    name: "removeDelegates",
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
      {
        internalType: "string[]",
        name: "dids",
        type: "string[]",
      },
    ],
    name: "removeDelegates",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IOrgIdDelegates__factory {
  static readonly abi = _abi;
  static createInterface(): IOrgIdDelegatesInterface {
    return new utils.Interface(_abi) as IOrgIdDelegatesInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IOrgIdDelegates {
    return new Contract(address, _abi, signerOrProvider) as IOrgIdDelegates;
  }
}

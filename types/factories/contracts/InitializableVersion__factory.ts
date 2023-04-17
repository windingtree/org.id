/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  InitializableVersion,
  InitializableVersionInterface,
} from "../../contracts/InitializableVersion";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "versionDomain",
        type: "bytes32",
      },
    ],
    name: "ContractAlreadyInitialized",
    type: "error",
  },
] as const;

export class InitializableVersion__factory {
  static readonly abi = _abi;
  static createInterface(): InitializableVersionInterface {
    return new utils.Interface(_abi) as InitializableVersionInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): InitializableVersion {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as InitializableVersion;
  }
}
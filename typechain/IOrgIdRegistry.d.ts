/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface IOrgIdRegistryInterface extends ethers.utils.Interface {
  functions: {
    "createOrgId(bytes32,string)": FunctionFragment;
    "getOrgIds(uint256,uint256)": FunctionFragment;
    "getOrgJsonUri(bytes32)": FunctionFragment;
    "getTokenId(bytes32)": FunctionFragment;
    "setOrgJson(bytes32,string)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "createOrgId",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getOrgIds",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getOrgJsonUri",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getTokenId",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setOrgJson",
    values: [BytesLike, string]
  ): string;

  decodeFunctionResult(
    functionFragment: "createOrgId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getOrgIds", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getOrgJsonUri",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getTokenId", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setOrgJson", data: BytesLike): Result;

  events: {
    "OrgIdCreated(bytes32,address)": EventFragment;
    "OrgJsonUriChanged(bytes32,string)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OrgIdCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OrgJsonUriChanged"): EventFragment;
}

export type OrgIdCreatedEvent = TypedEvent<
  [string, string] & { orgId: string; owner: string }
>;

export type OrgJsonUriChangedEvent = TypedEvent<
  [string, string] & { orgId: string; orgJsonUri: string }
>;

export class IOrgIdRegistry extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: IOrgIdRegistryInterface;

  functions: {
    createOrgId(
      salt: BytesLike,
      orgJsonUri: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "createOrgId(bytes32,string)"(
      salt: BytesLike,
      orgJsonUri: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "getOrgIds(uint256,uint256)"(
      cursor: BigNumberish,
      count: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string[]] & { orgIds: string[] }>;

    "getOrgIds()"(
      overrides?: CallOverrides
    ): Promise<[string[]] & { orgIds: string[] }>;

    getOrgJsonUri(
      orgId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string] & { orgJsonUri: string }>;

    "getOrgJsonUri(bytes32)"(
      orgId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string] & { orgJsonUri: string }>;

    getTokenId(
      orgId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { tokenId: BigNumber }>;

    "getTokenId(bytes32)"(
      orgId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { tokenId: BigNumber }>;

    setOrgJson(
      orgId: BytesLike,
      orgJsonUri: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "setOrgJson(bytes32,string)"(
      orgId: BytesLike,
      orgJsonUri: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  createOrgId(
    salt: BytesLike,
    orgJsonUri: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "createOrgId(bytes32,string)"(
    salt: BytesLike,
    orgJsonUri: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "getOrgIds(uint256,uint256)"(
    cursor: BigNumberish,
    count: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string[]>;

  "getOrgIds()"(overrides?: CallOverrides): Promise<string[]>;

  getOrgJsonUri(orgId: BytesLike, overrides?: CallOverrides): Promise<string>;

  "getOrgJsonUri(bytes32)"(
    orgId: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  getTokenId(orgId: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

  "getTokenId(bytes32)"(
    orgId: BytesLike,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  setOrgJson(
    orgId: BytesLike,
    orgJsonUri: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "setOrgJson(bytes32,string)"(
    orgId: BytesLike,
    orgJsonUri: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    createOrgId(
      salt: BytesLike,
      orgJsonUri: string,
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { orgId: string; tokenId: BigNumber }>;

    "createOrgId(bytes32,string)"(
      salt: BytesLike,
      orgJsonUri: string,
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { orgId: string; tokenId: BigNumber }>;

    "getOrgIds(uint256,uint256)"(
      cursor: BigNumberish,
      count: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string[]>;

    "getOrgIds()"(overrides?: CallOverrides): Promise<string[]>;

    getOrgJsonUri(orgId: BytesLike, overrides?: CallOverrides): Promise<string>;

    "getOrgJsonUri(bytes32)"(
      orgId: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    getTokenId(orgId: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    "getTokenId(bytes32)"(
      orgId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setOrgJson(
      orgId: BytesLike,
      orgJsonUri: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "setOrgJson(bytes32,string)"(
      orgId: BytesLike,
      orgJsonUri: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "OrgIdCreated(bytes32,address)"(
      orgId?: BytesLike | null,
      owner?: string | null
    ): TypedEventFilter<[string, string], { orgId: string; owner: string }>;

    OrgIdCreated(
      orgId?: BytesLike | null,
      owner?: string | null
    ): TypedEventFilter<[string, string], { orgId: string; owner: string }>;

    "OrgJsonUriChanged(bytes32,string)"(
      orgId?: BytesLike | null,
      orgJsonUri?: null
    ): TypedEventFilter<
      [string, string],
      { orgId: string; orgJsonUri: string }
    >;

    OrgJsonUriChanged(
      orgId?: BytesLike | null,
      orgJsonUri?: null
    ): TypedEventFilter<
      [string, string],
      { orgId: string; orgJsonUri: string }
    >;
  };

  estimateGas: {
    createOrgId(
      salt: BytesLike,
      orgJsonUri: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "createOrgId(bytes32,string)"(
      salt: BytesLike,
      orgJsonUri: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "getOrgIds(uint256,uint256)"(
      cursor: BigNumberish,
      count: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getOrgIds()"(overrides?: CallOverrides): Promise<BigNumber>;

    getOrgJsonUri(
      orgId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getOrgJsonUri(bytes32)"(
      orgId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTokenId(orgId: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    "getTokenId(bytes32)"(
      orgId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setOrgJson(
      orgId: BytesLike,
      orgJsonUri: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "setOrgJson(bytes32,string)"(
      orgId: BytesLike,
      orgJsonUri: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    createOrgId(
      salt: BytesLike,
      orgJsonUri: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "createOrgId(bytes32,string)"(
      salt: BytesLike,
      orgJsonUri: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "getOrgIds(uint256,uint256)"(
      cursor: BigNumberish,
      count: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getOrgIds()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getOrgJsonUri(
      orgId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getOrgJsonUri(bytes32)"(
      orgId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTokenId(
      orgId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getTokenId(bytes32)"(
      orgId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setOrgJson(
      orgId: BytesLike,
      orgJsonUri: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "setOrgJson(bytes32,string)"(
      orgId: BytesLike,
      orgJsonUri: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}

/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export interface IOrgIdRegistryInterface extends utils.Interface {
  functions: {
    "createOrgId(bytes32,string)": FunctionFragment;
    "getOrgId(uint256)": FunctionFragment;
    "getOrgIds(uint256,uint256)": FunctionFragment;
    "getOrgIds()": FunctionFragment;
    "getTokenId(bytes32)": FunctionFragment;
    "setOrgJson(bytes32,string)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "createOrgId"
      | "createOrgId(bytes32,string)"
      | "getOrgId"
      | "getOrgId(uint256)"
      | "getOrgIds(uint256,uint256)"
      | "getOrgIds()"
      | "getTokenId"
      | "getTokenId(bytes32)"
      | "setOrgJson"
      | "setOrgJson(bytes32,string)"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "createOrgId",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "createOrgId(bytes32,string)",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getOrgId",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getOrgId(uint256)",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getOrgIds(uint256,uint256)",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getOrgIds()",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getTokenId",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "getTokenId(bytes32)",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "setOrgJson",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setOrgJson(bytes32,string)",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "createOrgId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createOrgId(bytes32,string)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getOrgId", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getOrgId(uint256)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getOrgIds(uint256,uint256)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getOrgIds()",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getTokenId", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getTokenId(bytes32)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setOrgJson", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setOrgJson(bytes32,string)",
    data: BytesLike
  ): Result;

  events: {
    "OrgIdCreated(bytes32,address)": EventFragment;
    "OrgJsonUriChanged(bytes32,string)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OrgIdCreated"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "OrgIdCreated(bytes32,address)"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OrgJsonUriChanged"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "OrgJsonUriChanged(bytes32,string)"
  ): EventFragment;
}

export interface OrgIdCreatedEventObject {
  orgId: string;
  owner: string;
}
export type OrgIdCreatedEvent = TypedEvent<
  [string, string],
  OrgIdCreatedEventObject
>;

export type OrgIdCreatedEventFilter = TypedEventFilter<OrgIdCreatedEvent>;

export interface OrgJsonUriChangedEventObject {
  orgId: string;
  orgJsonUri: string;
}
export type OrgJsonUriChangedEvent = TypedEvent<
  [string, string],
  OrgJsonUriChangedEventObject
>;

export type OrgJsonUriChangedEventFilter =
  TypedEventFilter<OrgJsonUriChangedEvent>;

export interface IOrgIdRegistry extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IOrgIdRegistryInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    createOrgId(
      salt: PromiseOrValue<BytesLike>,
      orgJsonUri: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    "createOrgId(bytes32,string)"(
      salt: PromiseOrValue<BytesLike>,
      orgJsonUri: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getOrgId(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [boolean, string, string, string] & {
        exists: boolean;
        orgId: string;
        orgJsonUri: string;
        owner: string;
      }
    >;

    "getOrgId(uint256)"(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [boolean, string, string, string] & {
        exists: boolean;
        orgId: string;
        orgJsonUri: string;
        owner: string;
      }
    >;

    "getOrgIds(uint256,uint256)"(
      cursor: PromiseOrValue<BigNumberish>,
      count: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string[]] & { orgIds: string[] }>;

    "getOrgIds()"(
      overrides?: CallOverrides
    ): Promise<[string[]] & { orgIds: string[] }>;

    getTokenId(
      orgId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { tokenId: BigNumber }>;

    "getTokenId(bytes32)"(
      orgId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { tokenId: BigNumber }>;

    setOrgJson(
      orgId: PromiseOrValue<BytesLike>,
      orgJsonUri: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    "setOrgJson(bytes32,string)"(
      orgId: PromiseOrValue<BytesLike>,
      orgJsonUri: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  createOrgId(
    salt: PromiseOrValue<BytesLike>,
    orgJsonUri: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  "createOrgId(bytes32,string)"(
    salt: PromiseOrValue<BytesLike>,
    orgJsonUri: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getOrgId(
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [boolean, string, string, string] & {
      exists: boolean;
      orgId: string;
      orgJsonUri: string;
      owner: string;
    }
  >;

  "getOrgId(uint256)"(
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [boolean, string, string, string] & {
      exists: boolean;
      orgId: string;
      orgJsonUri: string;
      owner: string;
    }
  >;

  "getOrgIds(uint256,uint256)"(
    cursor: PromiseOrValue<BigNumberish>,
    count: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string[]>;

  "getOrgIds()"(overrides?: CallOverrides): Promise<string[]>;

  getTokenId(
    orgId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getTokenId(bytes32)"(
    orgId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  setOrgJson(
    orgId: PromiseOrValue<BytesLike>,
    orgJsonUri: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  "setOrgJson(bytes32,string)"(
    orgId: PromiseOrValue<BytesLike>,
    orgJsonUri: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    createOrgId(
      salt: PromiseOrValue<BytesLike>,
      orgJsonUri: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string>;

    "createOrgId(bytes32,string)"(
      salt: PromiseOrValue<BytesLike>,
      orgJsonUri: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string>;

    getOrgId(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [boolean, string, string, string] & {
        exists: boolean;
        orgId: string;
        orgJsonUri: string;
        owner: string;
      }
    >;

    "getOrgId(uint256)"(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [boolean, string, string, string] & {
        exists: boolean;
        orgId: string;
        orgJsonUri: string;
        owner: string;
      }
    >;

    "getOrgIds(uint256,uint256)"(
      cursor: PromiseOrValue<BigNumberish>,
      count: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string[]>;

    "getOrgIds()"(overrides?: CallOverrides): Promise<string[]>;

    getTokenId(
      orgId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getTokenId(bytes32)"(
      orgId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setOrgJson(
      orgId: PromiseOrValue<BytesLike>,
      orgJsonUri: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    "setOrgJson(bytes32,string)"(
      orgId: PromiseOrValue<BytesLike>,
      orgJsonUri: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "OrgIdCreated(bytes32,address)"(
      orgId?: PromiseOrValue<BytesLike> | null,
      owner?: PromiseOrValue<string> | null
    ): OrgIdCreatedEventFilter;
    OrgIdCreated(
      orgId?: PromiseOrValue<BytesLike> | null,
      owner?: PromiseOrValue<string> | null
    ): OrgIdCreatedEventFilter;

    "OrgJsonUriChanged(bytes32,string)"(
      orgId?: PromiseOrValue<BytesLike> | null,
      orgJsonUri?: null
    ): OrgJsonUriChangedEventFilter;
    OrgJsonUriChanged(
      orgId?: PromiseOrValue<BytesLike> | null,
      orgJsonUri?: null
    ): OrgJsonUriChangedEventFilter;
  };

  estimateGas: {
    createOrgId(
      salt: PromiseOrValue<BytesLike>,
      orgJsonUri: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    "createOrgId(bytes32,string)"(
      salt: PromiseOrValue<BytesLike>,
      orgJsonUri: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getOrgId(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getOrgId(uint256)"(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getOrgIds(uint256,uint256)"(
      cursor: PromiseOrValue<BigNumberish>,
      count: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getOrgIds()"(overrides?: CallOverrides): Promise<BigNumber>;

    getTokenId(
      orgId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getTokenId(bytes32)"(
      orgId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setOrgJson(
      orgId: PromiseOrValue<BytesLike>,
      orgJsonUri: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    "setOrgJson(bytes32,string)"(
      orgId: PromiseOrValue<BytesLike>,
      orgJsonUri: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    createOrgId(
      salt: PromiseOrValue<BytesLike>,
      orgJsonUri: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    "createOrgId(bytes32,string)"(
      salt: PromiseOrValue<BytesLike>,
      orgJsonUri: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getOrgId(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getOrgId(uint256)"(
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getOrgIds(uint256,uint256)"(
      cursor: PromiseOrValue<BigNumberish>,
      count: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getOrgIds()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getTokenId(
      orgId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getTokenId(bytes32)"(
      orgId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setOrgJson(
      orgId: PromiseOrValue<BytesLike>,
      orgJsonUri: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    "setOrgJson(bytes32,string)"(
      orgId: PromiseOrValue<BytesLike>,
      orgJsonUri: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}

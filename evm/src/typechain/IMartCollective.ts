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
} from "./common";

export interface IMartCollectiveInterface extends utils.Interface {
  functions: {
    "createCollection(string,string,string[],string,string,address[],uint256[],uint64)": FunctionFragment;
    "mint(string,address,string)": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setMarketplace(address)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "createCollection"
      | "mint"
      | "owner"
      | "renounceOwnership"
      | "setMarketplace"
      | "transferOwnership"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "createCollection",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>[],
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>[],
      PromiseOrValue<BigNumberish>[],
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "mint",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setMarketplace",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "createCollection",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMarketplace",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "CollectionCreated(address,address,string,string,string[],string,string,address[],uint256[],uint64)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "CollectionCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export interface CollectionCreatedEventObject {
  root: string;
  creator: string;
  name: string;
  category: string;
  tags: string[];
  description: string;
  uri: string;
  payees: string[];
  royalties: BigNumber[];
  maximum: BigNumber;
}
export type CollectionCreatedEvent = TypedEvent<
  [
    string,
    string,
    string,
    string,
    string[],
    string,
    string,
    string[],
    BigNumber[],
    BigNumber
  ],
  CollectionCreatedEventObject
>;

export type CollectionCreatedEventFilter =
  TypedEventFilter<CollectionCreatedEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface IMartCollective extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IMartCollectiveInterface;

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
    createCollection(
      name: PromiseOrValue<string>,
      category: PromiseOrValue<string>,
      tags: PromiseOrValue<string>[],
      description: PromiseOrValue<string>,
      uri: PromiseOrValue<string>,
      payees: PromiseOrValue<string>[],
      royalties: PromiseOrValue<BigNumberish>[],
      maximum: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    mint(
      _collection: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      uri: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setMarketplace(
      _marketplace: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  createCollection(
    name: PromiseOrValue<string>,
    category: PromiseOrValue<string>,
    tags: PromiseOrValue<string>[],
    description: PromiseOrValue<string>,
    uri: PromiseOrValue<string>,
    payees: PromiseOrValue<string>[],
    royalties: PromiseOrValue<BigNumberish>[],
    maximum: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  mint(
    _collection: PromiseOrValue<string>,
    to: PromiseOrValue<string>,
    uri: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setMarketplace(
    _marketplace: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    createCollection(
      name: PromiseOrValue<string>,
      category: PromiseOrValue<string>,
      tags: PromiseOrValue<string>[],
      description: PromiseOrValue<string>,
      uri: PromiseOrValue<string>,
      payees: PromiseOrValue<string>[],
      royalties: PromiseOrValue<BigNumberish>[],
      maximum: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    mint(
      _collection: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      uri: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setMarketplace(
      _marketplace: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "CollectionCreated(address,address,string,string,string[],string,string,address[],uint256[],uint64)"(
      root?: null,
      creator?: null,
      name?: null,
      category?: null,
      tags?: null,
      description?: null,
      uri?: null,
      payees?: null,
      royalties?: null,
      maximum?: null
    ): CollectionCreatedEventFilter;
    CollectionCreated(
      root?: null,
      creator?: null,
      name?: null,
      category?: null,
      tags?: null,
      description?: null,
      uri?: null,
      payees?: null,
      royalties?: null,
      maximum?: null
    ): CollectionCreatedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
  };

  estimateGas: {
    createCollection(
      name: PromiseOrValue<string>,
      category: PromiseOrValue<string>,
      tags: PromiseOrValue<string>[],
      description: PromiseOrValue<string>,
      uri: PromiseOrValue<string>,
      payees: PromiseOrValue<string>[],
      royalties: PromiseOrValue<BigNumberish>[],
      maximum: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    mint(
      _collection: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      uri: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setMarketplace(
      _marketplace: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    createCollection(
      name: PromiseOrValue<string>,
      category: PromiseOrValue<string>,
      tags: PromiseOrValue<string>[],
      description: PromiseOrValue<string>,
      uri: PromiseOrValue<string>,
      payees: PromiseOrValue<string>[],
      royalties: PromiseOrValue<BigNumberish>[],
      maximum: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    mint(
      _collection: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      uri: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setMarketplace(
      _marketplace: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}

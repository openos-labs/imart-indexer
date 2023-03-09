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

export interface CollectiveInterface extends utils.Interface {
  functions: {
    "createCollection(string,string,string[],string,string,address[],uint256[],uint64)": FunctionFragment;
    "createRoot(address,string,string)": FunctionFragment;
    "initialize(address)": FunctionFragment;
    "mint(string,uint256,string)": FunctionFragment;
    "setMarketplace(address)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "createCollection"
      | "createRoot"
      | "initialize"
      | "mint"
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
    functionFragment: "createRoot",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "mint",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>
    ]
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
  decodeFunctionResult(functionFragment: "createRoot", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
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
    "Initialized(uint8)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "CollectionCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
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

export interface InitializedEventObject {
  version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export interface Collective extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: CollectiveInterface;

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

    createRoot(
      _owner: PromiseOrValue<string>,
      _name: PromiseOrValue<string>,
      _symbol: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    initialize(
      owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    mint(
      _collection: PromiseOrValue<string>,
      balance: PromiseOrValue<BigNumberish>,
      uri: PromiseOrValue<string>,
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

  createRoot(
    _owner: PromiseOrValue<string>,
    _name: PromiseOrValue<string>,
    _symbol: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  initialize(
    owner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  mint(
    _collection: PromiseOrValue<string>,
    balance: PromiseOrValue<BigNumberish>,
    uri: PromiseOrValue<string>,
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

    createRoot(
      _owner: PromiseOrValue<string>,
      _name: PromiseOrValue<string>,
      _symbol: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string>;

    initialize(
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    mint(
      _collection: PromiseOrValue<string>,
      balance: PromiseOrValue<BigNumberish>,
      uri: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

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

    "Initialized(uint8)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;
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

    createRoot(
      _owner: PromiseOrValue<string>,
      _name: PromiseOrValue<string>,
      _symbol: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    initialize(
      owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    mint(
      _collection: PromiseOrValue<string>,
      balance: PromiseOrValue<BigNumberish>,
      uri: PromiseOrValue<string>,
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

    createRoot(
      _owner: PromiseOrValue<string>,
      _name: PromiseOrValue<string>,
      _symbol: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    initialize(
      owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    mint(
      _collection: PromiseOrValue<string>,
      balance: PromiseOrValue<BigNumberish>,
      uri: PromiseOrValue<string>,
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

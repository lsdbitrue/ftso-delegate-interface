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
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface IGovernanceVotePowerInterface extends ethers.utils.Interface {
  functions: {
    "delegate(address)": FunctionFragment;
    "undelegate()": FunctionFragment;
    "votePowerOfAt(address,uint256)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "delegate", values: [string]): string;
  encodeFunctionData(
    functionFragment: "undelegate",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "votePowerOfAt",
    values: [string, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "delegate", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "undelegate", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "votePowerOfAt",
    data: BytesLike
  ): Result;

  events: {};
}

export class IGovernanceVotePower extends BaseContract {
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

  interface: IGovernanceVotePowerInterface;

  functions: {
    delegate(
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    undelegate(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    votePowerOfAt(
      _who: string,
      _blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  delegate(
    _to: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  undelegate(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  votePowerOfAt(
    _who: string,
    _blockNumber: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    delegate(_to: string, overrides?: CallOverrides): Promise<void>;

    undelegate(overrides?: CallOverrides): Promise<void>;

    votePowerOfAt(
      _who: string,
      _blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    delegate(
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    undelegate(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    votePowerOfAt(
      _who: string,
      _blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    delegate(
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    undelegate(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    votePowerOfAt(
      _who: string,
      _blockNumber: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}

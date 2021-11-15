/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "IFtsoManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IFtsoManager__factory>;
    getContractFactory(
      name: "IFtsoRewardManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IFtsoRewardManager__factory>;
    getContractFactory(
      name: "IGovernanceVotePower",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IGovernanceVotePower__factory>;
    getContractFactory(
      name: "IIFtsoRewardManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IIFtsoRewardManager__factory>;
    getContractFactory(
      name: "IVPContractEvents",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IVPContractEvents__factory>;
    getContractFactory(
      name: "IVPToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IVPToken__factory>;
    getContractFactory(
      name: "IWNat",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IWNat__factory>;
    getContractFactory(
      name: "SongbirdHelper",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SongbirdHelper__factory>;

    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "IFtsoManager",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IFtsoManager>;
    getContractAt(
      name: "IFtsoRewardManager",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IFtsoRewardManager>;
    getContractAt(
      name: "IGovernanceVotePower",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IGovernanceVotePower>;
    getContractAt(
      name: "IIFtsoRewardManager",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IIFtsoRewardManager>;
    getContractAt(
      name: "IVPContractEvents",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IVPContractEvents>;
    getContractAt(
      name: "IVPToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IVPToken>;
    getContractAt(
      name: "IWNat",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IWNat>;
    getContractAt(
      name: "SongbirdHelper",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SongbirdHelper>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}

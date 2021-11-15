<template>
  <el-container>
    <el-main v-if="disabled">
      <el-alert
        title="Please approve site to access MetaMask and switch network to Songbird network"
        type="warning"
        effect="dark"
      >
      </el-alert>
    </el-main>

    <el-main v-else>
      <el-row> Welcome {{ account }} ! <el-divider></el-divider></el-row>

      <el-row>
        <el-col>
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>Delegation info</span>
                <el-button
                  class="button"
                  type="text"
                  @click="updateDelegateInfo"
                  >Refresh</el-button
                >
              </div>
            </template>

            <div>
              <div>Balance: {{ balance }}</div>
              <div>Wrapped: {{ wrapped }}</div>
              <div>Pending: {{ pendingAmount }}</div>
              <div>Unclaimed: {{ unclaimedAmount }}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row style="margin-top: 15px">
        <el-col>
          <el-button type="info" size="mini" @click="addWSGBToMetamask"
            >Add wSGB to Metamask</el-button
          >
          <el-button
            type="primary"
            size="mini"
            :disabled="Number(balance) === 0"
            @click="deposit"
            >Warp</el-button
          >
          <el-button
            type="primary"
            size="mini"
            :disabled="Number(wrapped) === 0"
            @click="withdraw"
            >Unwrap</el-button
          >
          <el-button
            type="success"
            size="mini"
            :disabled="Number(unclaimedAmount) === 0"
            @click="claimReward"
            >Claim Reward</el-button
          >
          <el-button
            type="success"
            size="mini"
            @click="delegateToBitrue"
            :disabled="!canDelegatedToBitrue"
            >Delegate to Bitrue</el-button
          >
          <el-button
            type="danger"
            size="mini"
            :disabled="delegated.length == 0"
            @click="undelegateAll"
            >Undelegate All</el-button
          >
        </el-col>
      </el-row>

      <el-row style="margin-top: 25px">
        <el-table :data="delegated" border>
          <el-table-column prop="name" label="name" />
          <el-table-column prop="validator" label="validator" />
          <el-table-column prop="percent" label="percent" />
          <el-table-column prop="power" label="power" />
          <el-table-column label="Operations">
            <template #default="scope">
              <el-button
                size="mini"
                type="warning"
                @click="undelegate(scope.row)"
                >Undelegate</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import type { SongbirdHelper } from "../typechain/SongbirdHelper";
import type { IVPToken } from "../typechain/IVPToken";
import type { IFtsoRewardManager } from "../typechain/IFtsoRewardManager";

import helperABI from "../constants/abis/helper.json";
import wsgbABI from "../constants/abis/wsgb.json";
import rewardManagerABI from "../constants/abis/rewardManager.json";
import SongbirdNetwork from "../constants/songbird";
import ValidateInfo from "../constants/validators.json";

import { ethers, BigNumber } from "ethers";
import { defineComponent } from "vue";
import {
  ElMessageBox,
  ElMessage,
  ElLoading,
  ElNotification,
} from "element-plus";

const songbirdDelegators = ValidateInfo.providers.filter(
  (v) => v.chainId === 19
);

const Validators = songbirdDelegators.reduce((p, v) => {
  p.set(v.address, v.name);
  p.set(v.name, v.address);
  return p;
}, new Map<string, string>());

const wsgbAddress = "0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED";
const helperAddress = "0x3519fE5F683E7C3aE0f5a8f722A025943E973201";
const rewardManagerAddress = "0xc5738334b972745067fFa666040fdeADc66Cb925";

interface Delegated {
  validator: string;
  name: string;
  // logo: string;
  percent: string;
  power: string;
}

interface Data {
  provider: ethers.providers.Web3Provider | null;
  helper: SongbirdHelper | null;
  wsgb: IVPToken | null;
  rewardManager: IFtsoRewardManager | null;
  disabled: boolean;
  account: string;
  balance: string;
  wrapped: string;
  pendingAmount: string;
  unclaimedAmount: string;
  unclaimedEpochs: BigNumber[];
  delegated: Delegated[];
  canDelegatedToBitrue: boolean;
}

export default defineComponent({
  name: "Dashboard",
  props: {},
  data() {
    return {
      provider: null,
      helper: null,
      wsgb: null,
      rewardManager: null,
      disabled: true,
      account: "Unknown",
      balance: "loading",
      wrapped: "loading",
      unclaimedAmount: "loading",
      pendingAmount: "loading",
      unclaimedEpochs: [],
      delegated: [],
      canDelegatedToBitrue: true,
    } as Data;
  },
  async mounted() {
    if (!window.ethereum) {
      return;
    }

    try {
      this.account = await this.connectNetwork();
    } catch (err) {
      console.log(err);
      return;
    }

    window.ethereum.on("chainChanged", (chainId: string) => {
      if (chainId !== SongbirdNetwork.chainId) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    });

    window.ethereum.on("accountsChanged", (accounts: Array<string>) => {
      this.resetData();
      this.account = accounts[0];
      this.updateDelegateInfo().catch((err) =>
        ElNotification({
          title: "Failed",
          message: err.message,
          type: "error",
        })
      );
      this.disabled = false;
    });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    this.helper = new ethers.Contract(
      helperAddress,
      helperABI,
      provider.getSigner()
    ) as SongbirdHelper;
    this.wsgb = new ethers.Contract(
      wsgbAddress,
      wsgbABI,
      provider.getSigner()
    ) as IVPToken;
    this.rewardManager = new ethers.Contract(
      rewardManagerAddress,
      rewardManagerABI,
      provider.getSigner()
    ) as IFtsoRewardManager;

    await this.updateDelegateInfo();
    this.disabled = false;
  },
  methods: {
    async connectNetwork() {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // switch network
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x13" }],
        });
      } catch (switchError) {
        if ((switchError as any).code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [SongbirdNetwork],
          });
        } else {
          throw switchError;
        }
      }
      return account;
    },
    async registerMetaMaskEvent() {},
    async updateDelegateInfo() {
      const delegateInfo = await this.helper!.delegateInfo(this.account);
      this.balance = ethers.utils.formatEther(delegateInfo.balance);
      this.wrapped = ethers.utils.formatEther(delegateInfo.wrapped);
      this.unclaimedAmount = ethers.utils.formatEther(
        delegateInfo.unclaimedAmount
      );
      this.pendingAmount = ethers.utils.formatEther(delegateInfo.pendingAmount);
      this.unclaimedEpochs = delegateInfo.unclaimedEpochs;
      const { totalPowers, powers } = await this.helper!.votePowers(
        delegateInfo.delegateAddresses
      );

      const delegated: Array<Delegated> = [];

      for (let i = 0; i < delegateInfo.delegateAddresses.length; i++) {
        const percent = delegateInfo.delegateBips[i]
          .div(100)
          .toNumber()
          .toFixed(2);
        const power = powers[i].mul(100).div(totalPowers).toNumber().toFixed(2);
        const address = delegateInfo.delegateAddresses[i];
        delegated.push({
          validator: address,
          name: Validators.get(address) || "Unknown",
          percent: `${percent}%`,
          power: `${power}%`,
        });
      }

      if (delegated.length > 0) {
        this.canDelegatedToBitrue = false;
      }

      this.delegated = delegated;

      // console.log(delegateInfo);

      ElNotification({
        title: "Info",
        message: "Delegate info has updated",
        type: "success",
      });
    },
    resetData() {
      this.balance = "loading";
      this.wrapped = "loading";
      this.unclaimedAmount = "loading";
      this.pendingAmount = "loading";
    },
    async deposit() {
      try {
        let value: string;
        try {
          const promptInput = await ElMessageBox.prompt(
            "What's amount sWGB do you want to depoist?",
            "Warning",
            {
              confirmButtonText: "Deposit",
              cancelButtonText: "Cancel",
              inputPattern: /^\d+(\.\d+)?$/,
              inputErrorMessage: "Invalid amount",
            }
          );
          value = promptInput.value;
        } catch {
          return;
        }
        const tx = await this.wsgb!.deposit({
          value: ethers.utils.parseEther(value),
        });
        const loading = ElLoading.service({
          lock: true,
          text: "Waiting tx confirmed",
          background: "rgba(0, 0, 0, 0.7)",
        });
        await tx
          .wait()
          .then(() => this.updateDelegateInfo())
          .finally(() => loading.close());
      } catch (error) {
        ElMessage({
          type: "error",
          message: "deposit failed",
        });
        console.log(error);
      }
    },
    async withdraw() {
      try {
        let value: string;
        try {
          const promptInput = await ElMessageBox.prompt(
            "What's amount sWGB do you want to withdraw?",
            "Warning",
            {
              confirmButtonText: "Withdraw",
              cancelButtonText: "Cancel",
              inputPattern: /^\d+(\.\d+)?$/,
              inputErrorMessage: "Invalid amount",
            }
          );
          value = promptInput.value;
        } catch {
          return;
        }
        const tx = await this.wsgb!.withdraw(ethers.utils.parseEther(value));

        const loading = ElLoading.service({
          lock: true,
          text: "Waiting tx confirmed",
          background: "rgba(0, 0, 0, 0.7)",
        });

        await tx
          .wait()
          .then(() => this.updateDelegateInfo())
          .finally(() => loading.close());
      } catch (error) {
        ElMessage({
          type: "error",
          message: "withdraw failed",
        });
        console.log(error);
      }
    },
    async undelegateAll() {
      if (!this.wsgb) {
        return;
      }

      try {
        try {
          await ElMessageBox.confirm("Do you want to undelegate all?");
        } catch {
          return;
        }

        const tx = await this.wsgb.undelegateAll();
        const loading = ElLoading.service({
          lock: true,
          text: "Waiting tx confirmed",
          background: "rgba(0, 0, 0, 0.7)",
        });

        await tx
          .wait()
          .then(() => this.updateDelegateInfo())
          .finally(() => loading.close());
      } catch (error) {
        ElMessage({
          type: "error",
          message: "undelegateAll failed",
        });
        console.log(error);
      }
    },
    async undelegate(data: Delegated) {
      console.log(data);
      ElMessage({
        type: "error",
        message: "STAY TUNED",
      });
    },
    async addWSGBToMetamask() {
      try {
        const success: boolean = await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: wsgbAddress,
              symbol: "WSGB",
              decimals: 18,
              image: "",
            },
          },
        });
        if (!success) {
          throw new Error("Something went wrong.");
        }
      } catch {
        ElMessage({
          type: "error",
          message: "add token failed",
        });
      }
    },
    async claimReward() {
      if (!this.rewardManager) {
        return;
      }

      try {
        const tx = await this.rewardManager.claimReward(
          this.account,
          this.unclaimedEpochs
        );

        const loading = ElLoading.service({
          lock: true,
          text: "Waiting tx confirmed",
          background: "rgba(0, 0, 0, 0.7)",
        });

        await tx
          .wait()
          .then(() => this.updateDelegateInfo())
          .finally(() => loading.close());
      } catch (error) {
        ElMessage({
          type: "error",
          message: "claimReward failed",
        });
        console.log(error);
      }
    },
    async delegateToBitrue() {
      try {
        const bitrue = Validators.get("Bitrue");
        if (!bitrue) {
          throw new Error("No bitrue validator setted");
        }

        console.log("Bitrue address", bitrue);

        const tx = await this.wsgb!.delegate(bitrue, 1e4);
        const loading = ElLoading.service({
          lock: true,
          text: "Waiting tx confirmed",
          background: "rgba(0, 0, 0, 0.7)",
        });
        await tx
          .wait()
          .then(() => this.updateDelegateInfo())
          .finally(() => loading.close());
      } catch (error) {
        ElMessage({
          type: "error",
          message: "delegateToBitrue failed",
        });
        console.log(error);
      }
    },
  },
});
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

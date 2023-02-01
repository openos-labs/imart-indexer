/** @type import('hardhat/config').HardhatUserConfig */
import { task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || "./.env";
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) });

task("accounts", "Hello, world!", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

const { ALCHEMY_API_KEY, TEST_ONLY, INFURA_API_KEY } = process.env;
// const goerliUrl = `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
const goerliUrl = `https://goerli.infura.io/v3/${INFURA_API_KEY}`;

export default {
  defaultNetwork: "localhost",
  networks: {
    hardhat: {},
    goerli: {
      url: goerliUrl,
      accounts: [TEST_ONLY],
    },
  },
  solidity: {
    version: "0.8.17",
    settings: { optimizer: { enabled: true, runs: 200 }, viaIR: true },
  },
};

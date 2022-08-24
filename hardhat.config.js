require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-docgen");
require("@nomiclabs/hardhat-solhint");
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task(
  "accounts",
  "Prints the list of accounts",
  async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
      console.log(account.address);
    }
  }
);
const {
  POLYGON_MUMBAI_RPC_PROVIDER,
  POLYGON_RPC_PROVIDER,
  PRIVATE_KEY,
  COIN_MARKET_CAP_API_KEY,
  POLYGONSCAN_API_KEY,
} = process.env;

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  docgen: {
    pages: "files",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            runs: 200,
            enabled: true,
          },
        },
      },
    ],
  },
  gasReporter: {
    enabled: true,
    currency: "GBP",
    token: "ETH",
    coinmarketcap: COIN_MARKET_CAP_API_KEY,
  },
  networks: {
    hardhat: {
      blockGasLimit: 200000000,
      allowUnlimitedContractSize: true,
      gasPrice: 8e9,
    },
  },
  etherscan: {
    apiKey: POLYGONSCAN_API_KEY,
  },
};

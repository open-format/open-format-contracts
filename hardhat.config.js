require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-docgen");
require("@nomiclabs/hardhat-solhint");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const {
  OWNER_PRIVATE_KEY,
  ADDRESS_1_PRIVATE_KEY,
  ADDRESS_2_PRIVATE_KEY,
  ADDRESS_3_PRIVATE_KEY,
  FEEHANDLER_PRIVATE_KEY,
  POLYGON_MUMBAI_RPC_PROVIDER,
  POLYGON_RPC_PROVIDER,
  POLYGONSCAN_API_KEY
} = process.env;

const accounts = [
  `${OWNER_PRIVATE_KEY}`,
  `${ADDRESS_1_PRIVATE_KEY}`,
  `${ADDRESS_2_PRIVATE_KEY}`,
  `${ADDRESS_3_PRIVATE_KEY}`,
  `${FEEHANDLER_PRIVATE_KEY}`
];

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  docgen: {
    pages: "files"
  },
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            runs: 200,
            enabled: true
          }
        }
      }
    ]
  },
  gasReporter: {
    enabled: false,
    currency: "GBP",
    token: "ETH",
    coinmarketcap: "35a411fc-0de9-44ec-89fb-d8ae25ad2597"
  },
  networks: {
    hardhat: {
      blockGasLimit: 200000000,
      allowUnlimitedContractSize: true,
      gasPrice: 8000000000
    },
    polygon: {
      url: POLYGON_RPC_PROVIDER,
      accounts
    },
    mumbai: {
      url: POLYGON_MUMBAI_RPC_PROVIDER,
      accounts
    }
  },
  etherscan: {
    apiKey: POLYGONSCAN_API_KEY
  }
};

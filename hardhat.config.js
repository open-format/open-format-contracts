require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-docgen");
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
    enabled: false,
    currency: "GBP",
    token: "ETH",
    coinmarketcap: "35a411fc-0de9-44ec-89fb-d8ae25ad2597",
  },
  networks: {
    mumbai: {
      url: "https://polygon-mumbai.infura.io/v3/b4f2a920d0a3498295cde60bd6c07770",
      accounts: [
        "6f7fca2bcff250c9250115b57eeb7b39644ca1ffd72fe3c8914715b0bc5a3db0",
      ],
      gasPrice: 8000000000,
    },
    hardhat: {
      blockGasLimit: 200000000,
      allowUnlimitedContractSize: true,
      gasPrice: 8000000000,
    },
  },
};

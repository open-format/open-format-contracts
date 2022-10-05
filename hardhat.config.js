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
  POLYGON_MUMBAI_RPC_PROVIDER,
  POLYGON_RPC_PROVIDER,
  PRIVATE_KEY,
  COIN_MARKET_CAP_API_KEY,
  POLYGONSCAN_API_KEY
} = process.env;

const token = {
  name: "Penguins",
  symbol: "PENG",
  ipfsUrl:
    "ipfs://bafyreiflupn3zziegi4fm56uhoc3yesv2jiv5ovcj23b2qq3xqcu4kq46m/metadata.json",
  maxSupply: 100,
  mintingPrice: "1000000000000000000"
};

task("deploy-contract", "Deploy Open Format contract").setAction(
  async (taskArgs, hre) => {
    const OpenFormat = await hre.ethers.getContractFactory("OpenFormat");

    const openFormat = await OpenFormat.deploy(
      token.name,
      token.symbol,
      token.ipfsUrl,
      token.maxSupply,
      token.mintingPrice
    );

    await openFormat.deployed();
    console.log("Deployed Contract address: ", openFormat.address);
  }
);

task("verify-contract", "Verify Open Format contract")
  .addParam("address", "The deployed contracts address")
  .setAction(async (taskArgs, hre) => {
    await hre.run("verify:verify", {
      address: taskArgs.address,
      constructorArguments: [
        token.name,
        token.symbol,
        token.ipfsUrl,
        token.maxSupply,
        token.mintingPrice
      ]
    });
  });
  
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
    coinmarketcap: COIN_MARKET_CAP_API_KEY
  },
  networks: {
    hardhat: {
      blockGasLimit: 2e8,
      allowUnlimitedContractSize: true,
      gasPrice: 8e9
    },
    mumbai: {
      url: "https://matic-testnet-archive-rpc.bwarelabs.com/",
      accounts: [`${PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey: POLYGONSCAN_API_KEY
  }
};

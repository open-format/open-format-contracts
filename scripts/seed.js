const hre = require("hardhat");

async function main() {
  const tokens = [
    {
      name: "Penguins",
      symbol: "PENG",
      ipfsUrl:
        "ipfs://bafyreiflupn3zziegi4fm56uhoc3yesv2jiv5ovcj23b2qq3xqcu4kq46m/metadata.json",
      maxSupply: 100,
      mintingPrice: hre.ethers.utils.parseEther("1"),
    },
    // {
    //   name: "Dogs",
    //   symbol: "DOGGO",
    //   ipfsUrl:
    //     "ipfs://bafyreiflupn3zziegi4fm56uhoc3yesv2jiv5ovcj23b2qq3xqcu4kq46m/metadata.json",
    //   maxSupply: 30,
    //   mintingPrice: hre.ethers.utils.parseEther("1"),
    // },
    // {
    //   name: "CAT",
    //   symbol: "Meow",
    //   ipfsUrl:
    //     "ipfs://bafyreiflupn3zziegi4fm56uhoc3yesv2jiv5ovcj23b2qq3xqcu4kq46m/metadata.json",
    //   maxSupply: 100,
    //   mintingPrice: hre.ethers.utils.parseEther("1"),
    // },
  ];

  await Promise.all(
    tokens.map(async (token) => {
      const OpenFormat = await hre.ethers.getContractFactory(
        "OpenFormat"
      );

      const openFormat = await OpenFormat.deploy(
        token.name,
        token.symbol,
        token.ipfsUrl,
        token.maxSupply,
        token.mintingPrice
      );

      await openFormat.deployed();

      console.log("OpenFormat deployed to:", openFormat.address);
    })
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

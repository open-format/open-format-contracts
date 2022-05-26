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

      const allocateTx = await openFormat.allocateShares(
        ["0x2Fd433ebb8Ad414FabD481cc7AD3BCaF9b6b155b"],
        [30]
      );
      const allocateReceipt = await allocateTx.wait();
      console.log(allocateReceipt);
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

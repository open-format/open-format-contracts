const hre = require("hardhat");

async function main() {
  const MintingExtension = await hre.ethers.getContractFactory(
    "MintingExtension"
  );

  const mintingExtension = await MintingExtension.deploy();

  await mintingExtension.deployed();

  console.log(
    "MintingExtension deployed to:",
    mintingExtension.address
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

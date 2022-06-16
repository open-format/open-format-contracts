const hre = require("hardhat");

async function main() {
  const DepositExtension = await hre.ethers.getContractFactory(
    "DepositExtension"
  );

  const depositExtension = await DepositExtension.deploy();

  await depositExtension.deployed();

  console.log(
    "DepositExtension deployed to:",
    depositExtension.address
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

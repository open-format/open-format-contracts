const hre = require("hardhat");
const nftStorage = require("nft.storage");
const fs = require("fs");
const path = require("path");

const storage = new nftStorage.NFTStorage({
  token: process.env.STORAGE_TOKEN
});

const File = nftStorage.File;

const filePath = "scripts/test-assets/testImage.png";
async function fileFromPath(filePath) {
  const content = fs.readFileSync(filePath);
  return new File([content], path.basename(filePath), { type: "image/png" });
}

async function main() {
  [owner, address1, address2, address3, feeHandler] = await ethers.getSigners();

  const ERC20 = await deploy(
    "Token", //contract name
    [] //list of deploy args
  );

  await ERC20.deployed();
  console.log("ERC20 deployed to:", ERC20.address);

  console.log(
    "erc20 balance: ",
    await ERC20.functions.balanceOf(owner.address)
  );

  const metadata = await storage.store({
    name: "My NFT",
    description: "My Test NFT",
    image: await fileFromPath(filePath),
    factory_id: "test",
    release_type: "test"
  });

  console.log(metadata.url);

  let uri = metadata.url;
  const mintingPrice = ethers.utils.parseEther("5");

  let factoryContract;
  let revShare;

  let collaborators = [];
  // 77%, 10%, 3%
  let collaboratorShares = [7700, 1000, 300];
  // 10%
  let holderPct = 1000;

  collaborators = [address1.address, address2.address, address3.address];

  const FactoryContract = await ethers.getContractFactory("OpenFormat");

  factoryContract = await FactoryContract.deploy(
    "My Track",
    "TUNE",
    uri,
    100,
    mintingPrice
  );

  // //set up currency
  let tx = await factoryContract.connect(owner).setCurrency(ERC20.address);
  await tx.wait();

  console.log(await factoryContract.currency());

  const RevShare = await ethers.getContractFactory("RevShareExtension");

  revShare = await RevShare.connect(owner).deploy();

  await factoryContract
    .connect(owner)
    .setApprovedRevShareExtension(
      revShare.address,
      collaborators,
      collaboratorShares,
      holderPct
    );

  factoryContract = await FactoryContract.connect(address1).deploy(
    "My Track",
    "TUNE",
    uri,
    100,
    mintingPrice
  );

  await factoryContract
    .connect(address1)
    .setApprovedRevShareExtension(
      revShare.address,
      collaborators,
      collaboratorShares,
      holderPct
    );

  // //set up currency
  tx = await factoryContract.connect(address1).setCurrency(ERC20.address);
  await tx.wait();

  console.log(await factoryContract.currency());
}

async function deploy(name, args) {
  const Contract = await hre.ethers.getContractFactory(name);
  const contract = await Contract.deploy(...args);
  return contract;
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

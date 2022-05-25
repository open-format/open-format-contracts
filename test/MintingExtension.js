const { expect } = require("chai");
const { ethers } = require("hardhat");
const { beforeEach } = require("mocha");

describe("MintingExtension", function () {
  let factoryContract;
  let mintingExtension;
  let requiredNFT;
  let uri = "ipfs://";
  const maxPerWallet = 10;

  beforeEach(async () => {
    [owner, address1] = await ethers.getSigners();
    const FactoryContract = await ethers.getContractFactory(
      "OpenFormat"
    );

    factoryContract = await FactoryContract.deploy(
      "My Track",
      "TUNE",
      uri,
      100,
      0
    );

    const RequiredNFT = await ethers.getContractFactory("NFT");

    requiredNFT = await RequiredNFT.deploy();

    const MintingExtension = await ethers.getContractFactory(
      "MintingExtension"
    );

    mintingExtension = await MintingExtension.deploy();

    await factoryContract.setApprovedMintingExtension(
      mintingExtension.address
    );

    await mintingExtension.setMaxPerWallet(
      factoryContract.address,
      maxPerWallet
    );
  });

  it("should check the user can't mint more than the maxPerWallet", async () => {
    await mintingExtension.setRequiredToken(
      factoryContract.address,
      requiredNFT.address
    );

    await requiredNFT.safeMint(owner.address);
    // Mint 4 tokens;
    for (let i = 0; i < maxPerWallet; i++) {
      await factoryContract.connect(owner)["mint()"]({ value: 0 });
    }

    await expect(
      factoryContract["mint()"]({ value: 0 })
    ).to.be.revertedWith("You can't own anymore tokens");
  });

  it("should allow you mint", async () => {
    await mintingExtension.setRequiredToken(
      factoryContract.address,
      requiredNFT.address
    );

    await requiredNFT.safeMint(owner.address);

    await factoryContract["mint()"]({ value: 0 });

    const balanceOf = await factoryContract.balanceOf(owner.address);

    expect(balanceOf).to.be.equal(1);
  });
});

const { expect } = require("chai");
const { ethers } = require("hardhat");
const { beforeEach } = require("mocha");

async function balance(address) {
    return await ethers.provider.getBalance(address);
}

describe("Royalties", function() {
  let factoryContract;
  const value = ethers.utils.parseEther("1");
  let uri = "ipfs://";
  const mintingPrice = ethers.utils.parseEther("5");

  const PERCENTAGE_SCALE = 10000;
  let royaltyPct = 5000;
  let royaltyAmount = value.mul(royaltyPct).div(PERCENTAGE_SCALE);

  beforeEach(async () => {
    [
      owner,
      address1,
      address2,
      address3,
      feeHandler
    ] = await ethers.getSigners();

    const FactoryContract = await ethers.getContractFactory("OpenFormat");

    factoryContract = await FactoryContract.deploy(
      "My Track",
      "TUNE",
      uri,
      100,
      mintingPrice
    );
  });

  it("must correctly calculate royalties", async () => {
    await factoryContract.setRoyalties(address1.address, 5000);
    const [_, amount] = await factoryContract.royaltyInfo(0, value);

    expect(amount).to.be.equal(royaltyAmount);
  });

  it("must prevent anyone from setting royalties", async () => {
    await expect(
      factoryContract.connect(address2).setRoyalties(address1.address, 10000)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("must prevent the royalties from being over 100%", async () => {
    await expect(
      factoryContract.setRoyalties(address1.address, 10001)
    ).to.be.revertedWith("ERC2981Royalties: Too high");
  });

  it("must correctly distribute royalties without RoyaltyExtension", async () => {
    // set Royalties percentage to 50%
    await factoryContract.setRoyalties(owner.address, royaltyPct);

    // mint NFT
    await factoryContract.connect(address1)["mint()"]({
      value: mintingPrice
    });

    // Set Token Sale Price
    await factoryContract.connect(address1).setTokenSalePrice(0, value);

    // get owner (royalty recipient) balance before purchase
    const ownerBalance = await balance(owner.address);

    // Buy
    await factoryContract.connect(address2)["buy(uint256)"](0, {
      value: value
    });

    // get owner (royalty recipient) balance after purchase
    const newOwnerBalance = await balance(owner.address);
    expect(newOwnerBalance).to.equal(ownerBalance.add(royaltyAmount));
  });

  it("must not send royalties if not set", async () => {
    // mint NFT
    await factoryContract["mint()"]({
      value: mintingPrice
    });

    // Set Token Sale Price
    await factoryContract.setTokenSalePrice(0, mintingPrice);

    // get owner (royalty recipient) balance before purchase
    const ownerBalance = await balance(owner.address);

    // Buy
    await factoryContract.connect(address2)["buy(uint256)"](0, {
      value: mintingPrice
    });

    // get owner (royalty recipient) balance after purchase
    const newOwnerBalance = await balance(owner.address);

    expect(newOwnerBalance).to.equal(ownerBalance.add(mintingPrice));
  });
});

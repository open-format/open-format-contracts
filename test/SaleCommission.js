const { BigNumber } = require("@ethersproject/bignumber");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { beforeEach } = require("mocha");

async function balance(address) {
  return await ethers.provider.getBalance(address);
}

describe("Sales commission", function() {
  let factoryContract;
  let revShare;
  let uri = "ipfs://";
  const mintingPrice = ethers.utils.parseEther("5");
  let collaborators = [];
  // 77%, 10%, 3%
  let collaboratorShares = [7700, 1000, 300];
  // 10%
  let holderPct = 1000;

  beforeEach(async () => {
    [
      owner,
      address1,
      address2,
      address3,
      feeHandler
    ] = await ethers.getSigners();

    collaborators = [address1.address, address2.address, address3.address];
    const FactoryContract = await ethers.getContractFactory("OpenFormat");

    const RevShare = await ethers.getContractFactory("RevShareExtension");

    revShare = await RevShare.connect(owner).deploy();

    factoryContract = await FactoryContract.deploy(
      "My Track",
      "TUNE",
      uri,
      100,
      mintingPrice
    );

    await factoryContract
      .connect(owner)
      .setApprovedRevShareExtension(
        revShare.address,
        collaborators,
        collaboratorShares,
        holderPct
      );
  });

  it("must allow the owner to set the sales commission", async () => {
    await factoryContract.setPrimaryCommissionPct(250);
    expect(await factoryContract.getPrimaryCommissionPct()).to.be.equal(250);
  });

  it("must prevent from setting a sales commission over 100%", async () => {
    await expect(
      factoryContract.setPrimaryCommissionPct(10001)
    ).to.be.revertedWith("OF:E-006");
  });

  it("shoud prevent anyone to set sales commission", async () => {
    await expect(
      factoryContract
        .connect(address1)
        .setPrimaryCommissionPct(BigNumber.from(5))
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
  it("must mint with a sales commission", async () => {
    const PERCENTAGE_SCALE = 10000;
    const saleCommissionPct = 1000;
    // set Minting Price
    // await factoryContract.setMintingPrice(value);

    // set Sale commission
    await factoryContract.setPrimaryCommissionPct(saleCommissionPct);

    const address2Balance = await balance(address2.address);
    // mint NFT
    await factoryContract
      .connect(address1)
      ["mint(address)"](address2.address, { value: mintingPrice });

    const newAddress2Balance = await balance(address2.address);

    expect(newAddress2Balance).to.be.equal(
      BigNumber.from(address2Balance).add(
        BigNumber.from(mintingPrice)
          .mul(saleCommissionPct)
          .div(PERCENTAGE_SCALE)
      )
    );
  });

  it("must handle secondary marketplace commission", async () => {
    const value = ethers.utils.parseEther("1");
    const PERCENTAGE_SCALE = 10000;
    const saleCommissionPct = 1000;
    const saleCommissionAmount = mintingPrice
      .mul(saleCommissionPct)
      .div(PERCENTAGE_SCALE);
    const address2Balance = await balance(address2.address);

    // set Sale commission
    await factoryContract.setSecondaryCommissionPct(saleCommissionPct);

    // mint NFT
    await factoryContract["mint(address)"](address2.address, {
      value: mintingPrice
    });

    // Set Token Sale Price
    await factoryContract.setTokenSalePrice(0, value);

    // Buy
    await factoryContract
      .connect(address1)
      ["buy(uint256,address)"](0, address2.address, {
        value: value.add(saleCommissionAmount)
      });

    const newAddress2Balance = await balance(address2.address);

    expect(newAddress2Balance).to.be.equal(
      BigNumber.from(address2Balance).add(
        BigNumber.from(value)
          .mul(saleCommissionPct)
          .div(PERCENTAGE_SCALE)
      )
    );
  });
});

const { expect } = require("chai");
const { Contract } = require("ethers");
const { ethers } = require("hardhat");
const { beforeEach } = require("mocha");

describe("Open Format", function() {
  let factoryContract;
  let revShare;
  let uri = "ipfs://";
  const value = ethers.utils.parseEther("1");
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

    await factoryContract.setCurrency(currency);
  });

  it("must add revShare contract as deposit manager", async () => {
    expect(await factoryContract.approvedRevShareExtension()).to.equal(
      revShare.address
    );
  });

  it("must increase totalSupply of tokens", async () => {
    await factoryContract["mint()"]({ value: mintingPrice });
    expect(await factoryContract.totalSupply()).to.equal(1);
  });

  it("must burn token", async () => {
    await factoryContract["mint()"]({ value: mintingPrice });
    const totalSupply = await factoryContract.totalSupply();
    await factoryContract.burn(0);
    const newTotalSupply = await factoryContract.totalSupply();

    expect(newTotalSupply).to.be.not.equal(totalSupply);
    expect(newTotalSupply).to.be.equal(0);
    expect(totalSupply).to.be.equal(1);
  });

  it("must only allow holder or approved to burn", async () => {
    await factoryContract["mint()"]({ value: mintingPrice });

    await expect(factoryContract.connect(address1).burn(0)).to.be.revertedWith(
      "OF:E-010"
    );
  });

  it("must not allow more than the maxSupply of tokens to be minted", async () => {
    await factoryContract.setMaxSupply(2);
    await factoryContract["mint()"]({ value: mintingPrice });
    await factoryContract["mint()"]({ value: mintingPrice });

    await expect(
      factoryContract["mint()"]({ value: mintingPrice })
    ).to.be.revertedWith("OF:E-012");
  });

  it("must allow the owner to update the max supply to tokens to be minted", async () => {
    await factoryContract.setMaxSupply(12);
    expect(await factoryContract.getMaxSupply()).to.be.equal(12);
  });

  it("must not allow anyone to update the max supply to tokens to be minted", async () => {
    await expect(
      factoryContract.connect(address1).setMaxSupply(12)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("must not allow a token to be purchased unless a tokenSalePrice greater than 0 is set", async () => {
    await factoryContract["mint()"]({ value: mintingPrice });

    await factoryContract.connect(address1)["mint()"]({
      value: mintingPrice
    });

    await expect(
      factoryContract.connect(address2)["buy(uint256)"](0, {
        value: value
      })
    ).to.be.revertedWith("OF:E-007");
  });

  it("must set the tokenSalePrice to 0 after being purchased on the secondary market", async () => {
    const SecondaryMarketTokenValue = ethers.utils.parseEther("1");

    await factoryContract["mint()"]({ value: mintingPrice });

    await factoryContract.connect(address1)["mint()"]({
      value: mintingPrice
    });

    await factoryContract.setTokenSalePrice(0, SecondaryMarketTokenValue);

    await factoryContract.connect(address2)["buy(uint256)"](0, {
      value: value
    });

    expect(await factoryContract.getTokenSalePrice(0)).to.eq(0);
  });
});

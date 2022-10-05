const { expect } = require("chai");
const { ethers } = require("hardhat");
const { beforeEach } = require("mocha");

describe("Open Format ERC20", function() {
  let factoryContract;
  let currency;
  let uri = "ipfs://";
  const mintingPrice = ethers.utils.parseEther("5");

  beforeEach(async () => {
    [owner, address1] = await ethers.getSigners();

    const FactoryContract = await ethers.getContractFactory("OpenFormat");

    factoryContract = await FactoryContract.deploy(
      "My Track",
      "TUNE",
      uri,
      100,
      mintingPrice
    );

    const Currency = await ethers.getContractFactory("Token");

    currency = await Currency.connect(address1).deploy();
  });

  it("must set the currency to ERC20 token ", async () => {
    await factoryContract.setCurrency(currency.address);

    expect(await factoryContract.currency()).to.eq(currency.address);
  });

  it("must mint an NFT using ERC20 tokens as the payment currency", async () => {
    const MAX_INT =
      "115792089237316195423570985008687907853269984665640564039457584007913129639935";

    await factoryContract.setCurrency(currency.address);

    //give contract max allowance for token
    await currency
      .connect(address1)
      .functions.approve(factoryContract.address, MAX_INT);

    expect(
      await currency.allowance(address1.address, factoryContract.address)
    ).to.eq(MAX_INT);

    //mint with currency
    tx = await factoryContract
      .connect(address1)
      ["mint()"]({ value: mintingPrice });

    expect(await factoryContract.balanceOf(address1.address)).to.eq(1);
  });

});

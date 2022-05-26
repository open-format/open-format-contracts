const { BigNumber } = require("@ethersproject/bignumber");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { beforeEach } = require("mocha");

describe("DepositExtension", function () {
  let factoryContract;
  let revShare;
  let erc20;
  let uri = "ipfs://";
  const value = ethers.utils.parseEther("1");
  let holderPct = 5000;
  let PERCENTAGE_SCALE = 10000;

  beforeEach(async () => {
    const FactoryContract = await ethers.getContractFactory(
      "OpenFormat"
    );

    const RevShare = await ethers.getContractFactory(
      "DepositExtension"
    );

    revShare = await RevShare.deploy();

    [owner, address1] = await ethers.getSigners();

    factoryContract = await FactoryContract.deploy(
      "My Track",
      "TUNE",
      uri,
      100,
      value
    );

    await factoryContract.setApprovedDepositExtension(
      revShare.address,
      holderPct
    );
  });

  it("should split deposited ERC20 token between NFT holders", async () => {
    // deposit value
    const value = ethers.utils.parseEther("1");

    // Deploy token contract
    const ERC20Token = await ethers.getContractFactory("Token");
    erc20 = await ERC20Token.connect(owner).deploy();

    // mint two tokens
    await factoryContract["mint()"]({ value });
    await factoryContract.connect(address1)["mint()"]({ value });

    // approve
    await erc20
      .connect(owner)
      .approve(factoryContract.address, value);

    // deposit ERC20
    await factoryContract
      .connect(owner)
      ["deposit(address,uint256)"](erc20.address, value);

    const ownerBalance = await revShare[
      "getSingleTokenBalance(address,address,uint256)"
    ](erc20.address, factoryContract.address, 0);
    const address1Balance = await revShare[
      "getSingleTokenBalance(address,address,uint256)"
    ](erc20.address, factoryContract.address, 1);

    const maxSupply = await factoryContract.getMaxSupply();

    const holdersAmount = BigNumber.from(value)
      .mul(holderPct)
      .div(PERCENTAGE_SCALE)
      .div(maxSupply);

    expect(ownerBalance).to.equal(holdersAmount);
    expect(address1Balance).to.equal(holdersAmount);
  });

  it("should split deposited ETH between NFT holders", async () => {
    // deposit value
    const value = ethers.utils.parseEther("1");
    // mint two tokens
    await factoryContract["mint()"]({ value });
    await factoryContract.connect(address1)["mint()"]({ value });

    // deposit ETH
    await factoryContract.connect(address1)["deposit()"]({ value });

    const ownerBalance = await revShare[
      "getSingleTokenBalance(address,uint256)"
    ](factoryContract.address, 0);
    const address1Balance = await revShare[
      "getSingleTokenBalance(address,uint256)"
    ](factoryContract.address, 1);

    const maxSupply = await factoryContract.getMaxSupply();

    const holdersAmount = BigNumber.from(value)
      .mul(holderPct)
      .div(PERCENTAGE_SCALE)
      .div(maxSupply);

    expect(ownerBalance).to.equal(holdersAmount);
    expect(address1Balance).to.equal(holdersAmount);
  });

  it("should send split to owner", async () => {
    // deposit value
    const value = ethers.utils.parseEther("1");

    // mint two tokens
    await factoryContract.connect(owner)["mint()"]({ value });
    await factoryContract.connect(address1)["mint()"]({ value });
    // owner shares

    // owner balance
    const ownerBalance = await owner.getBalance();

    // deposit ETH
    await factoryContract.connect(address1)["deposit()"]({ value });

    const ownerShares = await revShare[
      "getSingleTokenBalance(address,uint256)"
    ](factoryContract.address, 0);

    const withdraw = await factoryContract["withdraw(uint256)"](0);

    // calculate withdraw gas
    const withdrawReceipt = await withdraw.wait();
    const withdrawGas = BigNumber.from(withdrawReceipt.gasUsed).mul(
      withdrawReceipt.effectiveGasPrice
    );

    const newOwnerBalance = await owner.getBalance();

    expect(newOwnerBalance).to.equal(
      BigNumber.from(ownerBalance).add(ownerShares).sub(withdrawGas)
    );
  });

  it("should correctly split multiple deposits", async () => {
    // deposit value
    const value = ethers.utils.parseEther("1");
    // mint one token
    await factoryContract["mint()"]({ value });
    // deposit ETH
    await factoryContract.connect(address1)["deposit()"]({ value });

    // mint another token
    await factoryContract.connect(address1)["mint()"]({ value });

    // deposit more ETH
    await factoryContract.connect(address1)["deposit()"]({ value });

    const newOwnerBalance = await revShare[
      "getSingleTokenBalance(address,uint256)"
    ](factoryContract.address, 0);
    const address1Balance = await revShare[
      "getSingleTokenBalance(address,uint256)"
    ](factoryContract.address, 1);

    const maxSupply = await factoryContract.getMaxSupply();

    const holdersAmount = BigNumber.from(value)
      .mul(holderPct)
      .div(PERCENTAGE_SCALE)
      .div(maxSupply);

    expect(newOwnerBalance).to.equal(
      holdersAmount.add(holdersAmount)
    );

    expect(address1Balance).to.equal(holdersAmount);
  });

  it("Should display total received ETH", async () => {
    // deposit value
    const value = ethers.utils.parseEther("1");
    const value2 = "87654324546789";
    // mint one token
    await factoryContract["mint()"]({ value });
    // deposit ETH
    await factoryContract.connect(address1)["deposit()"]({ value });
    await factoryContract
      .connect(address1)
      ["deposit()"]({ value: value2 });

    const totalReceived =
      await factoryContract.totalDepositedAmount();

    expect(totalReceived).to.equal(BigNumber.from(value).add(value2));
  });
});

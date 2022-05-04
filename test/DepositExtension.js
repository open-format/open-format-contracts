const { BigNumber } = require("@ethersproject/bignumber");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { beforeEach } = require("mocha");

describe("DepositExtension", function () {
  let factoryContract;
  let revShare;
  let erc20;
  let uri = "ipfs://";

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
      uri
    );

    await factoryContract.setApprovedDepositExtension(
      revShare.address
    );
  });

  it("should split deposited ERC20 token between NFT holders", async () => {
    // Deploy token contract
    const ERC20Token = await ethers.getContractFactory("Token");
    erc20 = await ERC20Token.connect(owner).deploy();

    // deposit value
    const value = ethers.utils.parseEther("1");
    // mint two tokens
    await factoryContract["mint()"]();
    await factoryContract.connect(address1)["mint()"]();

    // approve
    await erc20
      .connect(owner)
      .approve(factoryContract.address, value);

    // deposit ETH
    await factoryContract
      .connect(owner)
      ["deposit(address,address,uint256)"](
        revShare.address,
        erc20.address,
        value
      );

    const ownerBalance = await revShare[
      "getSingleTokenBalance(address,address,uint256)"
    ](erc20.address, factoryContract.address, 0);
    const address1Balance = await revShare[
      "getSingleTokenBalance(address,address,uint256)"
    ](erc20.address, factoryContract.address, 1);

    expect(ownerBalance).to.equal(BigNumber.from(value).div(2));
    expect(address1Balance).to.equal(BigNumber.from(value).div(2));
  });

  it("should split deposited ETH between NFT holders", async () => {
    // deposit value
    const value = ethers.utils.parseEther("1");
    // mint two tokens
    await factoryContract["mint()"]();
    await factoryContract.connect(address1)["mint()"]();

    // deposit ETH
    await factoryContract
      .connect(address1)
      ["deposit(address)"](revShare.address, { value });

    const ownerBalance = await revShare[
      "getSingleTokenBalance(address,uint256)"
    ](factoryContract.address, 0);
    const address1Balance = await revShare[
      "getSingleTokenBalance(address,uint256)"
    ](factoryContract.address, 1);

    expect(ownerBalance).to.equal(BigNumber.from(value).div(2));
    expect(address1Balance).to.equal(BigNumber.from(value).div(2));
  });

  it("should send split to owner", async () => {
    // deposit value
    const value = ethers.utils.parseEther("1");

    // mint two tokens
    await factoryContract.connect(owner)["mint()"]();
    await factoryContract.connect(address1)["mint()"]();
    // owner shares

    // owner balance
    const ownerBalance = await owner.getBalance();

    // deposit ETH
    await factoryContract
      .connect(address1)
      ["deposit(address)"](revShare.address, { value });

    const ownerShares = await revShare[
      "getSingleTokenBalance(address,uint256)"
    ](factoryContract.address, 0);

    const withdraw = await factoryContract[
      "withdraw(address,uint256)"
    ](revShare.address, 0);

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
    await factoryContract["mint()"]();
    // deposit ETH
    await factoryContract
      .connect(address1)
      ["deposit(address)"](revShare.address, { value });

    // mint another token
    await factoryContract.connect(address1)["mint()"]();

    // deposit more ETH
    await factoryContract
      .connect(address1)
      ["deposit(address)"](revShare.address, { value });

    const newOwnerBalance = await revShare[
      "getSingleTokenBalance(address,uint256)"
    ](factoryContract.address, 0);
    const address1Balance = await revShare[
      "getSingleTokenBalance(address,uint256)"
    ](factoryContract.address, 1);

    expect(newOwnerBalance).to.equal(
      BigNumber.from(value).add(BigNumber.from(value).div(2))
    );

    expect(address1Balance).to.equal(BigNumber.from(value).div(2));
  });

  it("Should display total received ETH", async () => {
    // deposit value
    const value = ethers.utils.parseEther("1");
    const value2 = "87654324546789";
    // mint one token
    await factoryContract["mint()"]();
    // deposit ETH
    await factoryContract
      .connect(address1)
      ["deposit(address)"](revShare.address, { value });
    await factoryContract
      .connect(address1)
      ["deposit(address)"](revShare.address, { value: value2 });

    const totalReceived =
      await factoryContract.totalDepositedAmount();

    expect(totalReceived).to.equal(BigNumber.from(value).add(value2));
  });

  it("should only let approvedCaller call calculateSplit()", async () => {
    const amount = "1000000000000000000";
    await expect(
      revShare.calculateSplitETH(amount, 5)
    ).to.be.revertedWith(
      "Only approved caller can call this function"
    );
  });

  it("should only let approvedCaller call updateSplitBalance()", async () => {
    const amount = "1000000000000000000";
    await expect(
      revShare.calculateSplitETH(amount, 0)
    ).to.be.revertedWith(
      "Only approved caller can call this function"
    );
  });
});

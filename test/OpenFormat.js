const { BigNumber } = require("@ethersproject/bignumber");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { beforeEach } = require("mocha");

async function balance(address) {
  return await ethers.provider.getBalance(address);
}

describe("Open Format", function () {
  let factoryContract;
  let revShare;
  let uri = "ipfs://";
  const value = ethers.utils.parseEther("1");
  const mintingPrice = ethers.utils.parseEther("5");

  beforeEach(async () => {
    [owner, address1, address2, address3, feeHandler] =
      await ethers.getSigners();
    const FactoryContract = await ethers.getContractFactory(
      "OpenFormat"
    );

    const RevShare = await ethers.getContractFactory(
      "DepositExtension"
    );

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
      .setApprovedDepositExtension(revShare.address);
  });

  it("should add revShare contract as deposit manager", async () => {
    expect(await factoryContract.approvedDepositExtension()).to.equal(
      revShare.address
    );
  });

  it("should increase totalSupply of tokens", async () => {
    await factoryContract["mint()"]({ value: mintingPrice });
    expect(await factoryContract.totalSupply()).to.equal(1);
  });

  it("should burn token", async () => {
    await factoryContract["mint()"]({ value: mintingPrice });
    const totalSupply = await factoryContract.totalSupply();
    await factoryContract.burn(0);
    const newTotalSupply = await factoryContract.totalSupply();

    expect(newTotalSupply).to.be.not.equal(totalSupply);
    expect(newTotalSupply).to.be.equal(0);
    expect(totalSupply).to.be.equal(1);
  });

  it("should only allow holder or approved to burn", async () => {
    await factoryContract["mint()"]({ value: mintingPrice });

    await expect(
      factoryContract.connect(address1).burn(0)
    ).to.be.revertedWith("OF:E-010");
  });

  it("should deposit ETH into contract", async () => {
    const value = ethers.utils.parseEther("1");

    await factoryContract.connect(address1)["deposit()"]({ value });

    const contractBalance = await factoryContract.provider.getBalance(
      factoryContract.address
    );

    expect(contractBalance).to.equal(value);
  });

  it("send correct amount via payment splitter", async () => {
    // send some ETH to contract from address1
    address1.sendTransaction({
      to: factoryContract.address,
      value,
    });

    // mint NFT
    await factoryContract
      .connect(address1)
      ["mint()"]({ value: mintingPrice });

    // deposit some ETH via deposit() function
    await factoryContract.connect(address1)["deposit()"]({ value });

    // released funds into owner account
    const contractBalance = await factoryContract.provider.getBalance(
      factoryContract.address
    );
    await factoryContract
      .connect(address1)
      ["release(address)"](owner.address);

    // check correct amount has been released
    const newContractBalance =
      await factoryContract.provider.getBalance(
        factoryContract.address
      );

    expect(newContractBalance).to.equal(
      BigNumber.from(contractBalance)
        .sub(BigNumber.from(value).div(100).mul(100))
        .sub(mintingPrice)
    );
  });

  it("send correct amount via payment splitter 2", async () => {
    const value2 = ethers.utils.parseEther("4.3564");

    // allocate 40% from owner => address1
    await factoryContract
      .connect(owner)
      .allocateShares([address1.address], [40]);

    // allocate 20% from address1 => address2
    await factoryContract
      .connect(address1)
      .allocateShares([address2.address], [20]);

    // send some ETH directly to the contract
    await address1.sendTransaction({
      to: factoryContract.address,
      value,
    });

    // mint 4 NFTs
    await factoryContract
      .connect(owner)
      ["mint()"]({ value: mintingPrice }); // 1ETH
    await factoryContract
      .connect(address1)
      ["mint()"]({ value: mintingPrice }); // 1ETH
    await factoryContract
      .connect(address1)
      ["mint()"]({ value: mintingPrice }); // 1ETH
    await factoryContract
      .connect(address1)
      ["mint()"]({ value: mintingPrice }); // 1ETH

    // deposit some ETH via deposit() function
    await factoryContract
      .connect(address1)
      ["deposit()"]({ value: value2 });

    const contractBalance = await balance(factoryContract.address);

    // withdraw revShare for token id 2;
    await factoryContract["withdraw(address,uint256)"](
      revShare.address,
      2
    );

    // released funds into owner wallet
    await factoryContract
      .connect(owner)
      ["release(address)"](address1.address);

    // withdraw revShare for token id 0;
    await factoryContract["withdraw(address,uint256)"](
      revShare.address,
      0
    );

    // release funds into address1 wallet
    await factoryContract["release(address)"](owner.address);

    // withdraw revShare for token id 1;
    await factoryContract["withdraw(address,uint256)"](
      revShare.address,
      1
    );

    // check correct amount has been released
    const newContractBalance = await balance(factoryContract.address);

    expect(newContractBalance).to.equal(
      BigNumber.from(contractBalance)
        .sub(BigNumber.from(value).div(100).mul(20))
        .sub(BigNumber.from(value2.div(4)))
        .sub(BigNumber.from(value).div(100).mul(60))
        .sub(BigNumber.from(value2.div(4)))
        .sub(BigNumber.from(value2.div(4)))
        .sub(mintingPrice.mul(4).sub(value.mul(4)))
    );
  });

  describe("PaymentSplitter", function () {
    let factoryContract;
    let revShare;
    let uri = "ipfs://";
    const value = ethers.utils.parseEther("1");
    const value2 = ethers.utils.parseEther("4");
    const mintingPrice = ethers.utils.parseEther("5");

    beforeEach(async () => {
      [owner, address1, address2, address3, feeHandler] =
        await ethers.getSigners();
      const FactoryContract = await ethers.getContractFactory(
        "OpenFormat"
      );

      const RevShare = await ethers.getContractFactory(
        "DepositExtension"
      );

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
        .setApprovedDepositExtension(revShare.address);

      // Deploy token contract
      const ERC20Token = await ethers.getContractFactory("Token");
      erc20 = await ERC20Token.connect(address1).deploy();

      // mint 4 NFTs
      await factoryContract
        .connect(owner)
        ["mint()"]({ value: mintingPrice }); // 1ETH
      await factoryContract
        .connect(address1)
        ["mint()"]({ value: mintingPrice }); // 1ETH
      await factoryContract
        .connect(address1)
        ["mint()"]({ value: mintingPrice }); // 1ETH
      await factoryContract
        .connect(address1)
        ["mint()"]({ value: mintingPrice }); // 1ETH

      // Send ERC20 directly to contract
      await erc20
        .connect(address1)
        .transfer(factoryContract.address, value);

      // approve
      await erc20
        .connect(address1)
        .approve(factoryContract.address, value2);

      // deposit some ETH via deposit() function
      await factoryContract
        .connect(address1)
        ["deposit(address,uint256)"](erc20.address, value2);

      // allocate 50% from owner => address1
      await factoryContract
        .connect(owner)
        .allocateShares([address1.address], [50]);
    });

    it("should increase the ERC20 balance of the contract when depositing", async () => {
      expect(await erc20.balanceOf(factoryContract.address)).to.equal(
        BigNumber.from(value).add(value2)
      );
    });

    it("should withdraw tokens to allocated payees", async () => {
      const address1Balance = await erc20.balanceOf(address1.address);

      // release funds into address1 wallet
      await factoryContract["release(address,address)"](
        erc20.address,
        address1.address
      );

      const newAddress1Balance = await erc20.balanceOf(
        address1.address
      );

      expect(newAddress1Balance).to.be.equal(
        BigNumber.from(address1Balance).add(
          BigNumber.from(value).div(2)
        )
      );
    });

    it("should correctly withdraw ERC20 balance to NFT holders", async () => {
      const contractBalance = await erc20.balanceOf(
        factoryContract.address
      );

      // withdraw revShare for token id 1;
      await factoryContract["withdraw(address,address,uint256)"](
        erc20.address,
        revShare.address,
        0
      );

      // withdraw revShare for token id 1;
      await factoryContract["withdraw(address,address,uint256)"](
        erc20.address,
        revShare.address,
        1
      );
      // withdraw revShare for token id 2;
      await factoryContract["withdraw(address,address,uint256)"](
        erc20.address,
        revShare.address,
        2
      );
      // withdraw revShare for token id 3;
      await factoryContract["withdraw(address,address,uint256)"](
        erc20.address,
        revShare.address,
        3
      );

      // release funds into owner wallet
      await factoryContract["release(address,address)"](
        erc20.address,
        owner.address
      );

      // release funds into address1 wallet
      await factoryContract["release(address,address)"](
        erc20.address,
        address1.address
      );

      const newContractBalance = await erc20.balanceOf(
        factoryContract.address
      );

      expect(newContractBalance).to.be.equal(
        BigNumber.from(contractBalance).sub(value).sub(value2)
      );
    });

    it("should correctly release all ERC20 tokens", async () => {
      const address1Balance = await erc20.balanceOf(address1.address);

      // withdraw revShare for token id 1;
      await factoryContract["withdraw(address,address,uint256)"](
        erc20.address,
        revShare.address,
        1
      );
      // withdraw revShare for token id 2;
      await factoryContract["withdraw(address,address,uint256)"](
        erc20.address,
        revShare.address,
        2
      );
      // withdraw revShare for token id 3;
      await factoryContract["withdraw(address,address,uint256)"](
        erc20.address,
        revShare.address,
        3
      );

      const newAddress1Balance = await erc20.balanceOf(
        address1.address
      );

      expect(newAddress1Balance).to.be.equal(
        BigNumber.from(address1Balance).add(
          BigNumber.from(value2).div(4).mul(3)
        )
      );
    });

    it("should allocate owner shares to other accounts", async () => {
      await factoryContract
        .connect(owner)
        .allocateShares(
          [address1.address, address2.address],
          [30, 10]
        );

      expect(await factoryContract.shares(owner.address)).to.equal(
        10
      );
    });

    it("should prevent over allocation of shares by share number", async () => {
      await expect(
        factoryContract
          .connect(owner)
          .allocateShares([address1.address], [101])
      ).to.be.revertedWith(
        "PaymentSplitter: account does not have enough shares to allocate"
      );
    });
  });

  it("send deposit and withdraw the correct amount of ERC20 tokens", async () => {
    // Deploy token contract
    const ERC20Token = await ethers.getContractFactory("Token");
    erc20 = await ERC20Token.connect(address1).deploy();

    // Deposit values
    const value = ethers.utils.parseEther("1");
    const value2 = ethers.utils.parseEther("4");

    // approve
    await erc20
      .connect(address1)
      .approve(factoryContract.address, value2);

    // allocate 40% from owner => address1
    await factoryContract
      .connect(owner)
      .allocateShares([address1.address], [40]);

    // allocate 20% from address1 => address2
    await factoryContract
      .connect(address1)
      .allocateShares([address2.address], [20]);

    // send some ERC20 directly to the contract
    await erc20
      .connect(address1)
      .transfer(factoryContract.address, value);

    // mint 4 NFTs
    await factoryContract
      .connect(owner)
      ["mint()"]({ value: mintingPrice }); // 1ETH
    await factoryContract
      .connect(address1)
      ["mint()"]({ value: mintingPrice }); // 1ETH
    await factoryContract
      .connect(address1)
      ["mint()"]({ value: mintingPrice }); // 1ETH
    await factoryContract
      .connect(address1)
      ["mint()"]({ value: mintingPrice }); // 1ETH

    // deposit some ETH via deposit() function
    await factoryContract
      .connect(address1)
      ["deposit(address,uint256)"](erc20.address, value2);

    const contractBalance = await erc20.balanceOf(
      factoryContract.address
    );

    // withdraw revShare for token id 2;
    await factoryContract["withdraw(address,address,uint256)"](
      erc20.address,
      revShare.address,
      2
    );

    // released funds into owner wallet
    await factoryContract
      .connect(owner)
      ["release(address,address)"](erc20.address, address1.address);

    // withdraw revShare for token id 0;
    await factoryContract["withdraw(address,address,uint256)"](
      erc20.address,
      revShare.address,
      0
    );

    // release funds into address1 wallet
    await factoryContract["release(address,address)"](
      erc20.address,
      owner.address
    );

    // withdraw revShare for token id 1;
    await factoryContract["withdraw(address,address,uint256)"](
      erc20.address,
      revShare.address,
      1
    );

    // check correct amount has been released
    const newContractBalance = await erc20.balanceOf(
      factoryContract.address
    );

    expect(newContractBalance).to.equal(
      BigNumber.from(contractBalance)
        .sub(BigNumber.from(value).div(100).mul(20))
        .sub(BigNumber.from(value2.div(4)))
        .sub(BigNumber.from(value).div(100).mul(60))
        .sub(BigNumber.from(value2.div(4)))
        .sub(BigNumber.from(value2.div(4)))
    );
  });

  it("should prevent over allocation of shares by allocation", async () => {
    await expect(
      factoryContract
        .connect(owner)
        .allocateShares(
          [address1.address, address2.address],
          [50, 51]
        )
    ).to.be.revertedWith(
      "PaymentSplitter: account does not have enough shares to allocate"
    );
  });

  describe("Sales commission", function () {
    it("should allow the owner to set the sales commission", async () => {
      await factoryContract.setPrimaryCommissionPct(250);
      expect(
        await factoryContract.getPrimaryCommissionPct()
      ).to.be.equal(250);
    });

    it("should prevent from setting a sales commission over 100%", async () => {
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
    it("should mint with a sales commission", async () => {
      const PERCENTAGE_SCALE = 10000;
      const saleCommissionPct = 1000;
      // set Minting Price
      // await factoryContract.setMintingPrice(value);

      // set Sale commission
      await factoryContract.setPrimaryCommissionPct(
        saleCommissionPct
      );

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

    it("should handle secondary marketplace commission", async () => {
      const value = ethers.utils.parseEther("1");
      const PERCENTAGE_SCALE = 10000;
      const saleCommissionPct = 1000;
      const saleCommissionAmount = mintingPrice
        .mul(saleCommissionPct)
        .div(PERCENTAGE_SCALE);
      const address2Balance = await balance(address2.address);

      // set Sale commission
      await factoryContract.setSecondaryCommissionPct(
        saleCommissionPct
      );

      // mint NFT
      await factoryContract["mint(address)"](address2.address, {
        value: mintingPrice,
      });

      // Set Token Sale Price
      await factoryContract.setTokenSalePrice(0, value);

      // Buy
      await factoryContract
        .connect(address1)
        ["buy(uint256,address)"](0, address2.address, {
          value: value.add(saleCommissionAmount),
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
  describe("Royalties", function () {
    let factoryContract;
    const value = ethers.utils.parseEther("1");
    let uri = "ipfs://";

    const PERCENTAGE_SCALE = 10000;
    let royaltyPct = 5000;
    let royaltyAmount = value.mul(royaltyPct).div(PERCENTAGE_SCALE);

    beforeEach(async () => {
      [owner, address1, address2, address3, feeHandler] =
        await ethers.getSigners();

      const FactoryContract = await ethers.getContractFactory(
        "OpenFormat"
      );

      factoryContract = await FactoryContract.deploy(
        "My Track",
        "TUNE",
        uri,
        100,
        mintingPrice
      );
    });

    it("should correctly calculate royalties", async () => {
      await factoryContract.setRoyalties(address1.address, 5000);
      const [_, amount] = await factoryContract.royaltyInfo(0, value);

      expect(amount).to.be.equal(royaltyAmount);
    });

    it("should prevent anyone from setting royalties", async () => {
      await expect(
        factoryContract
          .connect(address2)
          .setRoyalties(address1.address, 10000)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should prevent the royalties from being over 100%", async () => {
      await expect(
        factoryContract.setRoyalties(address1.address, 10001)
      ).to.be.revertedWith("ERC2981Royalties: Too high");
    });

    it("should correctly distribute royalties without RoyaltyExtension", async () => {
      // set Royalties percentage to 50%
      await factoryContract.setRoyalties(owner.address, royaltyPct);

      // mint NFT
      await factoryContract.connect(address1)["mint()"]({
        value: mintingPrice,
      });

      // Set Token Sale Price
      await factoryContract
        .connect(address1)
        .setTokenSalePrice(0, value);

      // get owner (royalty recipient) balance before purchase
      const ownerBalance = await balance(owner.address);

      // Buy
      await factoryContract.connect(address2)["buy(uint256)"](0, {
        value: value,
      });

      // get owner (royalty recipient) balance after purchase
      const newOwnerBalance = await balance(owner.address);
      expect(newOwnerBalance).to.equal(
        ownerBalance.add(royaltyAmount)
      );
    });

    it("should not send royalties if not set", async () => {
      // mint NFT
      await factoryContract["mint()"]({
        value: mintingPrice,
      });

      // Set Token Sale Price
      await factoryContract.setTokenSalePrice(0, mintingPrice);

      // get owner (royalty recipient) balance before purchase
      const ownerBalance = await balance(owner.address);

      // Buy
      await factoryContract.connect(address2)["buy(uint256)"](0, {
        value: mintingPrice,
      });

      // get owner (royalty recipient) balance after purchase
      const newOwnerBalance = await balance(owner.address);

      expect(newOwnerBalance).to.equal(
        ownerBalance.add(mintingPrice)
      );
    });
  });

  describe("deposits", function () {
    let factoryContract;
    let revShare;
    let uri = "ipfs://";
    const value = ethers.utils.parseEther("1");
    const value2 = ethers.utils.parseEther("4");
    const mintingPrice = ethers.utils.parseEther("5");

    beforeEach(async () => {
      [owner, address1, address2, address3, feeHandler] =
        await ethers.getSigners();
      const FactoryContract = await ethers.getContractFactory(
        "OpenFormat"
      );

      const RevShare = await ethers.getContractFactory(
        "DepositExtension"
      );

      revShare = await RevShare.connect(owner).deploy();

      factoryContract = await FactoryContract.deploy(
        "My Track",
        "TUNE",
        uri,
        100,
        mintingPrice
      );

      // Deploy token contract
      const ERC20Token = await ethers.getContractFactory("Token");
      erc20 = await ERC20Token.connect(address1).deploy();

      // mint 4 NFTs
      await factoryContract
        .connect(owner)
        ["mint()"]({ value: mintingPrice }); // 1ETH
      await factoryContract
        .connect(owner)
        ["mint()"]({ value: mintingPrice }); // 1ETH
      await factoryContract
        .connect(owner)
        ["mint()"]({ value: mintingPrice }); // 1ETH
      await factoryContract
        .connect(owner)
        ["mint()"]({ value: mintingPrice }); // 1ETH
    });

    it("should get the single token balance from the deposit extension", async () => {
      await factoryContract
        .connect(owner)
        .setApprovedDepositExtension(revShare.address);

      await factoryContract.connect(address1)["deposit()"]({ value });

      const balance = await factoryContract[
        "getSingleTokenBalance(address,uint256)"
      ](factoryContract.address, 0);

      const totalSupply = await factoryContract.totalSupply();

      expect(balance).to.be.equal(value.div(totalSupply));
    });
    it("should get the single token balance of an ERC20 from the deposit extension", async () => {
      await factoryContract
        .connect(owner)
        .setApprovedDepositExtension(revShare.address);
      // Send ERC20 directly to contract
      await erc20
        .connect(address1)
        .transfer(factoryContract.address, value);

      // approve
      await erc20
        .connect(address1)
        .approve(factoryContract.address, value2);

      // deposit some ETH via deposit() function
      await factoryContract
        .connect(address1)
        ["deposit(address,uint256)"](erc20.address, value2);

      const balance = await factoryContract[
        "getSingleTokenBalance(address,address,uint256)"
      ](erc20.address, factoryContract.address, 0);

      const totalSupply = await factoryContract.totalSupply();

      expect(balance).to.be.equal(value2.div(totalSupply));
    });

    it("should only get the single token balance if the approvedDepositExtension is valid", async () => {
      const getBalance = factoryContract[
        "getSingleTokenBalance(address,uint256)"
      ](factoryContract.address, 0);

      await expect(getBalance).to.be.revertedWith("OF:E-003");
    });
    it("should only get the single token balance (ERC20) if the approvedDepositExtension is valid", async () => {
      const getERC20Balance = factoryContract[
        "getSingleTokenBalance(address,address,uint256)"
      ](erc20.address, factoryContract.address, 0);

      await expect(getERC20Balance).to.be.revertedWith("OF:E-003");
    });
  });
});

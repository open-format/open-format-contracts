const { BigNumber } = require("@ethersproject/bignumber");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { beforeEach } = require("mocha");

async function balance(address) {
  return await ethers.provider.getBalance(address);
}

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
  const PERCENTAGE_SCALE = 10000;

  beforeEach(async () => {
    [
      owner,
      address1,
      address2,
      address3,
      feeHandler,
    ] = await ethers.getSigners();

    collaborators = [
      address1.address,
      address2.address,
      address3.address,
    ];
    const FactoryContract = await ethers.getContractFactory(
      "OpenFormat"
    );

    const RevShare = await ethers.getContractFactory(
      "RevShareExtension"
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
      .setApprovedRevShareExtension(
        revShare.address,
        collaborators,
        collaboratorShares,
        holderPct
      );
  });

  it("must add revShare contract as deposit manager", async () => {
    expect(
      await factoryContract.approvedRevShareExtension()
    ).to.equal(revShare.address);
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

    await expect(
      factoryContract.connect(address1).burn(0)
    ).to.be.revertedWith("OF:E-010");
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

    await expect(factoryContract.connect(address2)["buy(uint256)"](0, {
        value: value
    })).to.be.revertedWith("OF:E-007")
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

  describe("Sales commission", function() {
    it("must allow the owner to set the sales commission", async () => {
      await factoryContract.setPrimaryCommissionPct(250);
      expect(
        await factoryContract.getPrimaryCommissionPct()
      ).to.be.equal(250);
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

    it("must handle secondary marketplace commission", async () => {
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
  describe("Royalties", function() {
    let factoryContract;
    const value = ethers.utils.parseEther("1");
    let uri = "ipfs://";

    const PERCENTAGE_SCALE = 10000;
    let royaltyPct = 5000;
    let royaltyAmount = value.mul(royaltyPct).div(PERCENTAGE_SCALE);

    beforeEach(async () => {
      [
        owner,
        address1,
        address2,
        address3,
        feeHandler,
      ] = await ethers.getSigners();

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

    it("must correctly calculate royalties", async () => {
      await factoryContract.setRoyalties(address1.address, 5000);
      const [_, amount] = await factoryContract.royaltyInfo(0, value);

      expect(amount).to.be.equal(royaltyAmount);
    });

    it("must prevent anyone from setting royalties", async () => {
      await expect(
        factoryContract
          .connect(address2)
          .setRoyalties(address1.address, 10000)
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

    it("must not send royalties if not set", async () => {
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
});

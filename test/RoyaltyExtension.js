const { expect } = require("chai");
const { ethers } = require("hardhat");
const { beforeEach } = require("mocha");
const { BigNumber } = ethers;

async function balance(address) {
  return await ethers.provider.getBalance(address);
}

describe("RoyaltiesExtension", function () {
  let factoryContract;
  let royalties;
  let royaltyPct = 5000;
  let holdersPct = 2000;
  let revShare;
  let uri = "ipfs://";
  const value = ethers.utils.parseEther("1");

  beforeEach(async () => {
    const FactoryContract = await ethers.getContractFactory(
      "OpenFormat"
    );

    const Royalties = await ethers.getContractFactory(
      "RoyaltiesExtension"
    );

    const RevShare = await ethers.getContractFactory(
      "DepositExtension"
    );

    revShare = await RevShare.deploy();

    royalties = await Royalties.deploy(revShare.address);

    [owner, address1, address2] = await ethers.getSigners();

    factoryContract = await FactoryContract.deploy(
      "My Track",
      "TUNE",
      uri,
      100,
      value
    );
  });

  it("should correctly split royalties between deposit() and receive() functions", async () => {
    const PERCENTAGE_SCALE = 10000;
    const royaltyAmount = value.mul(royaltyPct).div(PERCENTAGE_SCALE);

    //set RoyaltyManager
    await factoryContract.setApprovedRoyaltyExtension(
      royalties.address
    );

    // set DepositManager
    await factoryContract.setApprovedDepositExtension(
      revShare.address
    );
    // set RoyaltyManager custom percent
    await factoryContract.setApprovedRoyaltyExtensionCustomPct(
      holdersPct
    );
    // set Royalties percentage to 50%
    await factoryContract.setRoyalties(royalties.address, royaltyPct);

    // mint NFT
    await factoryContract["mint()"]({
      value,
    });
    // mint NFT
    await factoryContract["mint()"]({
      value,
    });

    // Set Token Sale Price
    await factoryContract.setTokenSalePrice(0, value);

    // Buy
    await factoryContract.connect(address1)["buy(uint256)"](0, {
      value: value,
    });

    const maxSupply = await factoryContract.getMaxSupply();
    const totalSupply = await factoryContract.getTotalSupply();

    const holdersAmount = royaltyAmount
      .mul(holdersPct)
      .div(PERCENTAGE_SCALE)
      .div(maxSupply);

    const primaryTokenEarnings = value.mul(totalSupply);

    // Primary Sale = 1ETH
    // Secondary Sale = 1ETH
    // Secondary Royalty = 50% of 1ETH = 0.5ETH
    // Secondary Holders split = 20% of 0.5ETH - 0.1ETH
    // 1ETH (primary) + 0.5ETH (secondary royalty) - 0.1ETH (secondary holders split)  = 1.6ETH;
    // 0.4ETH (Payment Splitter ) + 0.1ETH (NFT Holder RevShare) = 0.5ETH
    expect(
      await ethers.provider.getBalance(factoryContract.address)
    ).to.be.equal(primaryTokenEarnings.add(royaltyAmount));
    expect(
      await revShare["getSingleTokenBalance(address,uint256)"](
        factoryContract.address,
        0
      )
    ).to.be.equal(holdersAmount);
  });

  it("should revert if royaltyManager is not set", async () => {
    await expect(
      factoryContract.setApprovedRoyaltyExtensionCustomPct(holdersPct)
    ).to.be.revertedWith("OF:E-007");
  });

  it("should not use royaltyManager if not set", async () => {
    const PERCENTAGE_SCALE = 10000;
    const royaltyAmount = value.mul(royaltyPct).div(PERCENTAGE_SCALE);

    // set Royalties percentage to 50%
    await factoryContract.setRoyalties(owner.address, royaltyPct);

    // mint NFT
    await factoryContract.connect(address1)["mint()"]({
      value,
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
    expect(newOwnerBalance).to.equal(ownerBalance.add(royaltyAmount));
  });
});

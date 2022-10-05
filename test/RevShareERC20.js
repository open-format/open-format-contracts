const { BigNumber } = require("@ethersproject/bignumber");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { beforeEach } = require("mocha");

async function balance(address) {
  return await ethers.provider.getBalance(address);
}

describe("RevShareExtension", function() {
  let factoryContract;
  let revShare;
  let uri = "ipfs://";
  let PERCENTAGE_SCALE = 10000;
  let collaborators = [];
  let collaboratorShares = [7700, 1000, 300];
  let holderPct = 1000;
  let royaltyPct = 5000;
  let maxSupply;

  const mintPrice = ethers.utils.parseEther("1");
  const value = ethers.utils.parseEther("1");

  beforeEach(async () => {
    const Currency = await ethers.getContractFactory("Token");

    let currency = await Currency.deploy();

    const FactoryContract = await ethers.getContractFactory("OpenFormat");

    const RevShare = await ethers.getContractFactory("RevShareExtension");

    revShare = await RevShare.deploy();

    [
      artist,
      collab1,
      ds,
      minter1,
      minter2,
      feePayer
    ] = await ethers.getSigners();

    collaborators = [artist.address, collab1.address, ds.address];

    factoryContract = await FactoryContract.deploy(
      "My Track",
      "TUNE",
      uri,
      10,
      mintPrice
    );

    await factoryContract.setCurrency(currency.address);

    await factoryContract.setApprovedRevShareExtension(
      revShare.address,
      collaborators,
      collaboratorShares,
      holderPct
    );

    maxSupply = await factoryContract.getMaxSupply();
  });

  it("should set collaborators", async () => {
    const getCollaborators = await revShare.getCollaborators(
      factoryContract.address
    );

    expect(getCollaborators[0]).to.equal(collaborators[0]);
    expect(getCollaborators[1]).to.equal(collaborators[1]);
    expect(getCollaborators[2]).to.equal(collaborators[2]);
  });

  it("should set collaborator shares", async () => {
    const getSingleCollaboratorShare0 = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      collaborators[0]
    );
    const getSingleCollaboratorShare1 = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      collaborators[1]
    );
    const getSingleCollaboratorShare2 = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      collaborators[2]
    );

    expect(getSingleCollaboratorShare0).to.equal(collaboratorShares[0]);
    expect(getSingleCollaboratorShare1).to.equal(collaboratorShares[1]);
    expect(getSingleCollaboratorShare2).to.equal(collaboratorShares[2]);
  });

  it("should split mint revenue between collaborators", async () => {
    const mints = new Array(10).fill("");

    await Promise.all(
      mints.map(async () => await factoryContract["mint()"]({ value }))
    );

    const getArtistShares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      collaborators[0]
    );
    const getCollab1Shares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      collaborators[1]
    );
    const getDSShareShares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      collaborators[2]
    );

    const artistRevShareBalance = await factoryContract.getSingleCollaboratorBalance(
      artist.address
    );
    const collab1RevShareBalance = await factoryContract.getSingleCollaboratorBalance(
      collab1.address
    );
    const dsShareRevShareBalance = await factoryContract.getSingleCollaboratorBalance(
      ds.address
    );

    expect(artistRevShareBalance).to.equal(
      mintPrice
        .mul(getArtistShares.add(holderPct))
        .div(PERCENTAGE_SCALE)
        .mul(mints.length)
    );
    expect(collab1RevShareBalance).to.equal(
      mintPrice
        .mul(getCollab1Shares)
        .div(PERCENTAGE_SCALE)
        .mul(mints.length)
    );
    expect(dsShareRevShareBalance).to.equal(
      mintPrice
        .mul(getDSShareShares)
        .div(PERCENTAGE_SCALE)
        .mul(mints.length)
    );
  });

  it("should split mint revenue & deposit revenue between collaborators", async () => {
    const mints = new Array(10).fill("");

    await Promise.all(
      mints.map(async () => await factoryContract["mint()"]({ value }))
    );

    const maxSupply = await factoryContract.getMaxSupply();
    const totalSupply = await factoryContract.getTotalSupply();

    // deposit 1 ETH
    await artist.sendTransaction({
      to: factoryContract.address,
      value
    });

    const getArtistShares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      collaborators[0]
    );
    const getCollab1Shares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      collaborators[1]
    );
    const getDSShareShares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      collaborators[2]
    );

    const artistRevShareBalance = await factoryContract.getSingleCollaboratorBalance(
      artist.address
    );
    const collab1RevShareBalance = await factoryContract.getSingleCollaboratorBalance(
      collab1.address
    );
    const dsShareRevShareBalance = await factoryContract.getSingleCollaboratorBalance(
      ds.address
    );

    function calculateArtistMintRevenue(shares) {
      return mintPrice
        .mul(shares.add(holderPct))
        .div(PERCENTAGE_SCALE)
        .mul(totalSupply);
    }

    function calculateCollaboratorMintRevenue(shares) {
      return mintPrice
        .mul(shares)
        .div(PERCENTAGE_SCALE)
        .mul(totalSupply);
    }

    function calculateArtistDepositRevenue(shares) {
      const holderAmount = value
        .mul(holderPct)
        .div(PERCENTAGE_SCALE)
        .div(maxSupply);
      const unMintedTokenAmount = maxSupply - totalSupply;
      const remainingFunds = holderAmount.mul(unMintedTokenAmount);

      return value
        .mul(shares)
        .div(PERCENTAGE_SCALE)
        .add(remainingFunds);
    }

    function calculateCollaboratorDepositRevenue(shares) {
      return value.mul(shares).div(PERCENTAGE_SCALE);
    }

    expect(artistRevShareBalance).to.equal(
      calculateArtistMintRevenue(getArtistShares).add(
        calculateArtistDepositRevenue(getArtistShares)
      )
    );
    expect(collab1RevShareBalance).to.equal(
      calculateCollaboratorMintRevenue(getCollab1Shares).add(
        calculateCollaboratorDepositRevenue(getCollab1Shares)
      )
    );
    expect(dsShareRevShareBalance).to.equal(
      calculateCollaboratorMintRevenue(getDSShareShares).add(
        calculateCollaboratorDepositRevenue(getDSShareShares)
      )
    );
  });

  it("should correctly split royalties revenue", async () => {
    // set Royalties percentage to 50%
    await factoryContract.setRoyalties(factoryContract.address, royaltyPct);

    // mint NFT
    await factoryContract.connect(minter1)["mint()"]({
      value: mintPrice
    });

    // Set Token Sale Price
    await factoryContract.connect(minter1).setTokenSalePrice(0, value);

    // Buy
    await factoryContract.connect(minter2)["buy(uint256)"](0, {
      value: value
    });
    const royaltyAmount = value.mul(royaltyPct).div(PERCENTAGE_SCALE);

    const token0Balance = await factoryContract.getSingleTokenBalance(0);

    const artistShares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      collaborators[0]
    );
    const collab1Shares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      collaborators[1]
    );
    const dSShareShares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      collaborators[2]
    );

    const artistRevShareBalance = await factoryContract.getSingleCollaboratorBalance(
      artist.address
    );
    const collab1RevShareBalance = await factoryContract.getSingleCollaboratorBalance(
      collab1.address
    );
    const dsShareRevShareBalance = await factoryContract.getSingleCollaboratorBalance(
      ds.address
    );

    function getTokenValueFromPercentageShare(value) {
      return value
        .mul(holderPct)
        .div(PERCENTAGE_SCALE)
        .div(maxSupply);
    }

    function calculateArtistMintRevenue(shares) {
      return mintPrice
        .mul(shares.add(holderPct))
        .div(PERCENTAGE_SCALE)
        .mul(totalSupply);
    }

    function calculateCollaboratorMintRevenue(shares) {
      return mintPrice
        .mul(shares)
        .div(PERCENTAGE_SCALE)
        .mul(totalSupply);
    }

    function calculateArtistDepositRevenue(shares) {
      const holderAmount = royaltyAmount
        .mul(holderPct)
        .div(PERCENTAGE_SCALE)
        .div(maxSupply);
      const unMintedTokenAmount = maxSupply - totalSupply;
      const remainingFunds = holderAmount.mul(unMintedTokenAmount);

      return royaltyAmount
        .mul(shares)
        .div(PERCENTAGE_SCALE)
        .add(remainingFunds);
    }

    function calculateCollaboratorDepositRevenue(shares) {
      return royaltyAmount.mul(shares).div(PERCENTAGE_SCALE);
    }

    const totalSupply = await factoryContract.totalSupply();

    expect(token0Balance).to.be.equal(
      getTokenValueFromPercentageShare(royaltyAmount)
    );

    expect(artistRevShareBalance).to.be.equal(
      calculateArtistMintRevenue(artistShares).add(
        calculateArtistDepositRevenue(artistShares)
      )
    );

    expect(collab1RevShareBalance).to.be.equal(
      calculateCollaboratorMintRevenue(collab1Shares).add(
        calculateCollaboratorDepositRevenue(collab1Shares)
      )
    );

    expect(dsShareRevShareBalance).to.be.equal(
      calculateCollaboratorMintRevenue(dSShareShares).add(
        calculateCollaboratorDepositRevenue(dSShareShares)
      )
    );
  });
  it("should correct split deposit revenue to NFT holder", async () => {
    await factoryContract["mint()"]({ value });

    const deposits = new Array(10).fill("");

    await Promise.all(
      deposits.map(
        async () =>
          await artist.sendTransaction({
            to: factoryContract.address,
            value
          })
      )
    );

    const token0Balance = await factoryContract.getSingleTokenBalance(0);

    const holderAmount = value
      .mul(holderPct)
      .div(PERCENTAGE_SCALE)
      .div(maxSupply);

    expect(token0Balance).to.equal(holderAmount.mul(deposits.length));
  });

  it.only("should withdraw funds for a token holders", async () => {
    await factoryContract.setCurrency(currency.address);
    
    await currency.mint(minter1);
    await currency.mint(minter2);

    async function getTokenBalance(tokenId) {
      return await factoryContract.getSingleTokenBalance(tokenId);
    }

    await factoryContract.connect(minter1)["mint()"]({ value });
    await factoryContract.connect(minter1)["mint()"]({ value });
    await factoryContract.connect(minter2)["mint()"]({ value });

    await factoryContract.connect(minter1).approve(feePayer.address, 0);
    await factoryContract.connect(minter1).approve(feePayer.address, 1);
    await factoryContract.connect(minter2).approve(feePayer.address, 2);

    await artist.sendTransaction({
      to: factoryContract.address,
      value: value.mul(10)
    });

    const token0Balance = await getTokenBalance(0);
    const token1Balance = await getTokenBalance(1);
    const token2Balance = await getTokenBalance(2);

    const minter1BalanceSnapshot = await balance(minter1.address);
    const minter2BalanceSnapshot = await balance(minter2.address);

    await factoryContract.connect(feePayer)["withdraw(uint256)"](0);
    await factoryContract.connect(feePayer)["withdraw(uint256)"](1);
    await factoryContract.connect(feePayer)["withdraw(uint256)"](2);

    expect(await balance(minter1.address)).to.equal(
      minter1BalanceSnapshot.add(token0Balance).add(token1Balance)
    );
    expect(await balance(minter2.address)).to.equal(
      minter2BalanceSnapshot.add(token2Balance)
    );
  });

  it("should withdraw funds for a collaborator", async () => {
    async function getCollaboratorBalance(collaborator) {
      return await factoryContract.getSingleCollaboratorBalance(
        collaborator.address
      );
    }

    await artist.sendTransaction({
      to: factoryContract.address,
      value: value.mul(1)
    });

    const artistRevShareBalance = await getCollaboratorBalance(artist);
    const collab1RevShareBalance = await getCollaboratorBalance(collab1);
    const dsRevShareBalance = await getCollaboratorBalance(ds);

    const artistBalanceSnapshot = await balance(artist.address);
    const collab1BalanceSnapshot = await balance(collab1.address);
    const dsBalanceSnapshot = await balance(ds.address);

    await factoryContract
      .connect(feePayer)
      ["withdraw(address)"](artist.address);
    await factoryContract
      .connect(feePayer)
      ["withdraw(address)"](collab1.address);
    await factoryContract.connect(feePayer)["withdraw(address)"](ds.address);

    expect(await balance(artist.address)).to.equal(
      artistBalanceSnapshot.add(artistRevShareBalance)
    );
    expect(await balance(collab1.address)).to.equal(
      collab1BalanceSnapshot.add(collab1RevShareBalance)
    );
    expect(await balance(ds.address)).to.equal(
      dsBalanceSnapshot.add(dsRevShareBalance)
    );
  });

  it("should only allow token holder or approved withdraw funds for a token", async () => {
    async function getTokenBalance(tokenId) {
      return await factoryContract.getSingleTokenBalance(tokenId);
    }

    await factoryContract.connect(minter1)["mint()"]({ value });

    await artist.sendTransaction({
      to: factoryContract.address,
      value: value.mul(10)
    });

    await expect(
      factoryContract.connect(feePayer)["withdraw(uint256)"](0)
    ).to.be.revertedWith("OF:E-010");
  });

  it("should allow collaborators to allocate shares", async () => {
    await factoryContract.allocateShares(
      [minter1.address, minter2.address],
      [1000, 1000]
    );

    const artistShares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      artist.address
    );
    const getMinter1Shares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      minter1.address
    );
    const getMinter2Shares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      minter2.address
    );

    expect(artistShares).to.equal(
      BigNumber.from(collaboratorShares[0]).sub(2000)
    );
    expect(getMinter1Shares).to.equal(1000);
    expect(getMinter2Shares).to.equal(1000);
  });

  it("should not allow over allocation of collaborators shares", async () => {
    // 77% - 22% + 2%
    await expect(
      factoryContract.allocateShares([minter1.address], [7701])
    ).to.be.revertedWith(
      "RevShare: account does not have enough shares to allocate"
    );

    await expect(
      factoryContract.allocateShares(
        [minter1.address, minter2.address],
        [7700, 1]
      )
    ).to.be.revertedWith(
      "RevShare: account does not have enough shares to allocate"
    );
  });

  it("should correctly split deposit revenue after allocating shares", async () => {
    const totalSupply = await factoryContract.totalSupply();

    await factoryContract.allocateShares([minter1.address], [1234]);

    await artist.sendTransaction({
      to: factoryContract.address,
      value
    });

    const artistRevShareBalance = await factoryContract.getSingleCollaboratorBalance(
      artist.address
    );
    const minter1RevShareBalance = await factoryContract.getSingleCollaboratorBalance(
      minter1.address
    );

    const artistShares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      collaborators[0]
    );
    const minter1Shares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      minter1.address
    );

    function calculateArtistDepositRevenue(shares) {
      const holderAmount = value
        .mul(holderPct)
        .div(PERCENTAGE_SCALE)
        .div(maxSupply);
      const unMintedTokenAmount = maxSupply - totalSupply;
      const remainingFunds = holderAmount.mul(unMintedTokenAmount);

      return value
        .mul(shares)
        .div(PERCENTAGE_SCALE)
        .add(remainingFunds);
    }

    function calculateCollaboratorDepositRevenue(shares) {
      return value.mul(shares).div(PERCENTAGE_SCALE);
    }

    expect(artistRevShareBalance).to.equal(
      calculateArtistDepositRevenue(artistShares)
    );

    expect(minter1RevShareBalance).to.equal(
      calculateCollaboratorDepositRevenue(minter1Shares)
    );
  });
});

describe("RevShareExtension without NFT share", function() {
  let factoryContract;
  let revShare;
  let uri = "ipfs://";
  let PERCENTAGE_SCALE = 10000;
  let collaborators = [];
  let collaboratorShares = [8700, 1000, 300];
  let holderPct = 0;
  let royaltyPct = 5000;
  let maxSupply;

  const mintPrice = ethers.utils.parseEther("1");
  const value = ethers.utils.parseEther("1");

  beforeEach(async () => {
    const FactoryContract = await ethers.getContractFactory("OpenFormat");

    const RevShare = await ethers.getContractFactory("RevShareExtension");

    revShare = await RevShare.deploy();

    [
      artist,
      collab1,
      ds,
      minter1,
      minter2,
      feePayer
    ] = await ethers.getSigners();

    collaborators = [artist.address, collab1.address, ds.address];

    factoryContract = await FactoryContract.deploy(
      "My Track",
      "TUNE",
      uri,
      10,
      mintPrice
    );

    await factoryContract.setApprovedRevShareExtension(
      revShare.address,
      collaborators,
      collaboratorShares,
      holderPct
    );

    maxSupply = await factoryContract.getMaxSupply();
  });

  it("should set collaborators", async () => {
    const getCollaborators = await revShare.getCollaborators(
      factoryContract.address
    );

    expect(getCollaborators[0]).to.equal(collaborators[0]);
    expect(getCollaborators[1]).to.equal(collaborators[1]);
    expect(getCollaborators[2]).to.equal(collaborators[2]);
  });

  it("should set collaborator shares", async () => {
    const getSingleCollaboratorShare0 = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      collaborators[0]
    );
    const getSingleCollaboratorShare1 = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      collaborators[1]
    );
    const getSingleCollaboratorShare2 = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      collaborators[2]
    );

    expect(getSingleCollaboratorShare0).to.equal(collaboratorShares[0]);
    expect(getSingleCollaboratorShare1).to.equal(collaboratorShares[1]);
    expect(getSingleCollaboratorShare2).to.equal(collaboratorShares[2]);
  });

  it("should split mint revenue between collaborators", async () => {
    const mints = new Array(10).fill("");

    await Promise.all(
      mints.map(async () => await factoryContract["mint()"]({ value }))
    );

    const getArtistShares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      collaborators[0]
    );
    const getCollab1Shares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      collaborators[1]
    );
    const getDSShareShares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      collaborators[2]
    );

    const artistRevShareBalance = await factoryContract.getSingleCollaboratorBalance(
      artist.address
    );
    const collab1RevShareBalance = await factoryContract.getSingleCollaboratorBalance(
      collab1.address
    );
    const dsShareRevShareBalance = await factoryContract.getSingleCollaboratorBalance(
      ds.address
    );

    expect(artistRevShareBalance).to.equal(
      mintPrice
        .mul(getArtistShares)
        .div(PERCENTAGE_SCALE)
        .mul(mints.length)
    );
    expect(collab1RevShareBalance).to.equal(
      mintPrice
        .mul(getCollab1Shares)
        .div(PERCENTAGE_SCALE)
        .mul(mints.length)
    );
    expect(dsShareRevShareBalance).to.equal(
      mintPrice
        .mul(getDSShareShares)
        .div(PERCENTAGE_SCALE)
        .mul(mints.length)
    );
  });

  it("should split mint revenue & deposit revenue between collaborators", async () => {
    const mints = new Array(10).fill("");

    await Promise.all(
      mints.map(async () => await factoryContract["mint()"]({ value }))
    );

    const maxSupply = await factoryContract.getMaxSupply();
    const totalSupply = await factoryContract.getTotalSupply();

    // deposit 1 ETH
    await artist.sendTransaction({
      to: factoryContract.address,
      value
    });

    const getArtistShares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      collaborators[0]
    );
    const getCollab1Shares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      collaborators[1]
    );
    const getDSShareShares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      collaborators[2]
    );

    const artistRevShareBalance = await factoryContract.getSingleCollaboratorBalance(
      artist.address
    );
    const collab1RevShareBalance = await factoryContract.getSingleCollaboratorBalance(
      collab1.address
    );
    const dsShareRevShareBalance = await factoryContract.getSingleCollaboratorBalance(
      ds.address
    );

    function calculateArtistMintRevenue(shares) {
      return mintPrice
        .mul(shares.add(holderPct))
        .div(PERCENTAGE_SCALE)
        .mul(totalSupply);
    }

    function calculateCollaboratorMintRevenue(shares) {
      return mintPrice
        .mul(shares)
        .div(PERCENTAGE_SCALE)
        .mul(totalSupply);
    }

    function calculateArtistDepositRevenue(shares) {
      const holderAmount = value
        .mul(holderPct)
        .div(PERCENTAGE_SCALE)
        .div(maxSupply);
      const unMintedTokenAmount = maxSupply - totalSupply;
      const remainingFunds = holderAmount.mul(unMintedTokenAmount);

      return value
        .mul(shares)
        .div(PERCENTAGE_SCALE)
        .add(remainingFunds);
    }

    function calculateCollaboratorDepositRevenue(shares) {
      return value.mul(shares).div(PERCENTAGE_SCALE);
    }

    expect(artistRevShareBalance).to.equal(
      calculateArtistMintRevenue(getArtistShares).add(
        calculateArtistDepositRevenue(getArtistShares)
      )
    );
    expect(collab1RevShareBalance).to.equal(
      calculateCollaboratorMintRevenue(getCollab1Shares).add(
        calculateCollaboratorDepositRevenue(getCollab1Shares)
      )
    );
    expect(dsShareRevShareBalance).to.equal(
      calculateCollaboratorMintRevenue(getDSShareShares).add(
        calculateCollaboratorDepositRevenue(getDSShareShares)
      )
    );
  });

  it("should correctly split royalties revenue", async () => {
    // set Royalties percentage to 50%
    await factoryContract.setRoyalties(factoryContract.address, royaltyPct);

    // mint NFT
    await factoryContract.connect(minter1)["mint()"]({
      value: mintPrice
    });

    // Set Token Sale Price
    await factoryContract.connect(minter1).setTokenSalePrice(0, value);

    // Buy
    await factoryContract.connect(minter2)["buy(uint256)"](0, {
      value: value
    });
    const royaltyAmount = value.mul(royaltyPct).div(PERCENTAGE_SCALE);

    const token0Balance = await factoryContract.getSingleTokenBalance(0);

    const artistShares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      collaborators[0]
    );
    const collab1Shares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      collaborators[1]
    );
    const dSShareShares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      collaborators[2]
    );

    const artistRevShareBalance = await factoryContract.getSingleCollaboratorBalance(
      artist.address
    );
    const collab1RevShareBalance = await factoryContract.getSingleCollaboratorBalance(
      collab1.address
    );
    const dsShareRevShareBalance = await factoryContract.getSingleCollaboratorBalance(
      ds.address
    );

    function getTokenValueFromPercentageShare(value) {
      return value
        .mul(holderPct)
        .div(PERCENTAGE_SCALE)
        .div(maxSupply);
    }

    function calculateArtistMintRevenue(shares) {
      return mintPrice
        .mul(shares.add(holderPct))
        .div(PERCENTAGE_SCALE)
        .mul(totalSupply);
    }

    function calculateCollaboratorMintRevenue(shares) {
      return mintPrice
        .mul(shares)
        .div(PERCENTAGE_SCALE)
        .mul(totalSupply);
    }

    function calculateArtistDepositRevenue(shares) {
      const holderAmount = royaltyAmount
        .mul(holderPct)
        .div(PERCENTAGE_SCALE)
        .div(maxSupply);
      const unMintedTokenAmount = maxSupply - totalSupply;
      const remainingFunds = holderAmount.mul(unMintedTokenAmount);

      return royaltyAmount
        .mul(shares)
        .div(PERCENTAGE_SCALE)
        .add(remainingFunds);
    }

    function calculateCollaboratorDepositRevenue(shares) {
      return royaltyAmount.mul(shares).div(PERCENTAGE_SCALE);
    }

    const totalSupply = await factoryContract.totalSupply();

    expect(token0Balance).to.be.equal(
      getTokenValueFromPercentageShare(royaltyAmount)
    );

    expect(artistRevShareBalance).to.be.equal(
      calculateArtistMintRevenue(artistShares).add(
        calculateArtistDepositRevenue(artistShares)
      )
    );

    expect(collab1RevShareBalance).to.be.equal(
      calculateCollaboratorMintRevenue(collab1Shares).add(
        calculateCollaboratorDepositRevenue(collab1Shares)
      )
    );

    expect(dsShareRevShareBalance).to.be.equal(
      calculateCollaboratorMintRevenue(dSShareShares).add(
        calculateCollaboratorDepositRevenue(dSShareShares)
      )
    );
  });
  it("should correct split deposit revenue to NFT holder", async () => {
    await factoryContract["mint()"]({ value });

    const deposits = new Array(10).fill("");

    await Promise.all(
      deposits.map(
        async () =>
          await artist.sendTransaction({
            to: factoryContract.address,
            value
          })
      )
    );

    const token0Balance = await factoryContract.getSingleTokenBalance(0);

    const holderAmount = value
      .mul(holderPct)
      .div(PERCENTAGE_SCALE)
      .div(maxSupply);

    expect(token0Balance).to.equal(holderAmount.mul(deposits.length));
  });

  it("should not withdraw funds for a token holders", async () => {
    async function getTokenBalance(tokenId) {
      return await factoryContract.getSingleTokenBalance(tokenId);
    }

    await factoryContract.connect(minter1)["mint()"]({ value });
    await factoryContract.connect(minter1)["mint()"]({ value });
    await factoryContract.connect(minter2)["mint()"]({ value });

    await factoryContract.connect(minter1).approve(feePayer.address, 0);
    await factoryContract.connect(minter1).approve(feePayer.address, 1);
    await factoryContract.connect(minter2).approve(feePayer.address, 2);

    await artist.sendTransaction({
      to: factoryContract.address,
      value: value.mul(10)
    });

    const token0Balance = await getTokenBalance(0);
    const token1Balance = await getTokenBalance(1);
    const token2Balance = await getTokenBalance(2);

    const minter1BalanceSnapshot = await balance(minter1.address);
    const minter2BalanceSnapshot = await balance(minter2.address);

    await expect(
      factoryContract.connect(feePayer)["withdraw(uint256)"](0)
    ).to.be.revertedWith("OF:E-011");
  });

  it("should withdraw funds for a collaborator", async () => {
    async function getCollaboratorBalance(collaborator) {
      return await factoryContract.getSingleCollaboratorBalance(
        collaborator.address
      );
    }

    await artist.sendTransaction({
      to: factoryContract.address,
      value: value.mul(1)
    });

    const artistRevShareBalance = await getCollaboratorBalance(artist);
    const collab1RevShareBalance = await getCollaboratorBalance(collab1);
    const dsRevShareBalance = await getCollaboratorBalance(ds);

    const artistBalanceSnapshot = await balance(artist.address);
    const collab1BalanceSnapshot = await balance(collab1.address);
    const dsBalanceSnapshot = await balance(ds.address);

    await factoryContract
      .connect(feePayer)
      ["withdraw(address)"](artist.address);
    await factoryContract
      .connect(feePayer)
      ["withdraw(address)"](collab1.address);
    await factoryContract.connect(feePayer)["withdraw(address)"](ds.address);

    expect(await balance(artist.address)).to.equal(
      artistBalanceSnapshot.add(artistRevShareBalance)
    );
    expect(await balance(collab1.address)).to.equal(
      collab1BalanceSnapshot.add(collab1RevShareBalance)
    );
    expect(await balance(ds.address)).to.equal(
      dsBalanceSnapshot.add(dsRevShareBalance)
    );
  });

  it("should only allow token holder or approved withdraw funds for a token", async () => {
    async function getTokenBalance(tokenId) {
      return await factoryContract.getSingleTokenBalance(tokenId);
    }

    await factoryContract.connect(minter1)["mint()"]({ value });

    await artist.sendTransaction({
      to: factoryContract.address,
      value: value.mul(10)
    });

    await expect(
      factoryContract.connect(feePayer)["withdraw(uint256)"](0)
    ).to.be.revertedWith("OF:E-010");
  });

  it("should allow collaborators to allocate shares", async () => {
    await factoryContract.allocateShares(
      [minter1.address, minter2.address],
      [1000, 1000]
    );

    const artistShares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      artist.address
    );
    const getMinter1Shares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      minter1.address
    );
    const getMinter2Shares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      minter2.address
    );

    expect(artistShares).to.equal(
      BigNumber.from(collaboratorShares[0]).sub(2000)
    );
    expect(getMinter1Shares).to.equal(1000);
    expect(getMinter2Shares).to.equal(1000);
  });

  it("should not allow over allocation of collaborators shares", async () => {
    const artistShares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      artist.address
    );

    // 77% - 22% + 2%
    await expect(
      factoryContract.allocateShares([minter1.address], [8701])
    ).to.be.revertedWith(
      "RevShare: account does not have enough shares to allocate"
    );

    await expect(
      factoryContract.allocateShares(
        [minter1.address, minter2.address],
        [8700, 1]
      )
    ).to.be.revertedWith(
      "RevShare: account does not have enough shares to allocate"
    );
  });

  it("should correctly split deposit revenue after allocating shares", async () => {
    const totalSupply = await factoryContract.totalSupply();

    await factoryContract.allocateShares([minter1.address], [1234]);

    await artist.sendTransaction({
      to: factoryContract.address,
      value
    });

    const artistRevShareBalance = await factoryContract.getSingleCollaboratorBalance(
      artist.address
    );
    const minter1RevShareBalance = await factoryContract.getSingleCollaboratorBalance(
      minter1.address
    );

    const artistShares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      collaborators[0]
    );
    const minter1Shares = await revShare.getSingleCollaboratorShare(
      factoryContract.address,
      minter1.address
    );

    function calculateArtistDepositRevenue(shares) {
      const holderAmount = value
        .mul(holderPct)
        .div(PERCENTAGE_SCALE)
        .div(maxSupply);
      const unMintedTokenAmount = maxSupply - totalSupply;
      const remainingFunds = holderAmount.mul(unMintedTokenAmount);

      return value
        .mul(shares)
        .div(PERCENTAGE_SCALE)
        .add(remainingFunds);
    }

    function calculateCollaboratorDepositRevenue(shares) {
      return value.mul(shares).div(PERCENTAGE_SCALE);
    }

    expect(artistRevShareBalance).to.equal(
      calculateArtistDepositRevenue(artistShares)
    );

    expect(minter1RevShareBalance).to.equal(
      calculateCollaboratorDepositRevenue(minter1Shares)
    );
  });
});

describe("WithoutRevShareExtension", function() {
  let factoryContract;
  let uri = "ipfs://";
  let maxSupply;

  const mintPrice = ethers.utils.parseEther("1");
  const value = ethers.utils.parseEther("1");

  beforeEach(async () => {
    const FactoryContract = await ethers.getContractFactory("OpenFormat");

    [artist, minter1, minter2, feePayer] = await ethers.getSigners();

    factoryContract = await FactoryContract.deploy(
      "My Track",
      "TUNE",
      uri,
      10,
      mintPrice
    );

    maxSupply = await factoryContract.getMaxSupply();
  });

  it("should pay artist minting fee", async () => {
    const artistBalanceSnapshot = await balance(artist.address);
    const mints = new Array(10).fill("");

    await Promise.all(
      mints.map(
        async () => await factoryContract.connect(feePayer)["mint()"]({ value })
      )
    );

    expect(await balance(artist.address)).to.be.equal(
      artistBalanceSnapshot.add(mintPrice.mul(mints.length))
    );
  });

  it("should pay artist deposit amount", async () => {
    const artistBalanceSnapshot = await balance(artist.address);
    await feePayer.sendTransaction({
      to: factoryContract.address,
      value
    });

    expect(await balance(artist.address)).to.be.equal(
      artistBalanceSnapshot.add(value)
    );
  });
  it("should revert on withdraw", async () => {
    await factoryContract["mint()"]({ value });
    await expect(factoryContract["withdraw(uint256)"](0)).to.be.revertedWith(
      "OF:E-003"
    );
  });
});

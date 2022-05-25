// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IOpenFormat is IERC721 {
    event Created(
        address indexed creator,
        string metadataURI,
        string symbol,
        string name,
        uint256 maxSupply,
        uint256 mintingPrice
    );

    event Sold(
        uint256 indexed tokenId,
        address indexed oldOwner,
        address indexed newOwner,
        uint256 salePrice
    );

    event CommissionPaid(
        string indexed commissionType,
        address indexed to,
        uint256 tokenId,
        uint256 amount
    );

    event ERC20TotalDepositedAmountUpdated(
        IERC20 indexed token,
        uint256 indexed amount
    );

    event TokenBalanceWithdrawn(
        uint256 indexed tokenId,
        uint256 indexed amount
    );

    event ERC20TokenBalanceWithdrawn(
        IERC20 token,
        uint256 indexed tokenId,
        uint256 indexed amount
    );

    event PausedStateSet(bool isPaused);
    event SalePriceSet(uint256 indexed tokenId, uint256 salePrice);
    event Minted(uint256 indexed newTokenId, address indexed owner);
    event RoyaltiesSet(address indexed receiver, uint256 indexed percentage);
    event TotalDepositedAmountUpdated(uint256 indexed amount);
    event MintingPriceSet(uint256 indexed amount);
    event MaxSupplySet(uint256 indexed amount);
    event ApprovedDepositExtensionSet(address indexed contractAddress);
    event ApprovedRoyaltyExtensionSet(address indexed contractAddress);
    event ApprovedMintingExtensionSet(address indexed contractAddresss);
    event PrimaryCommissionSet(uint256 indexed amount);
    event SecondaryCommissionSet(uint256 indexed amount);
    event RoyaltyPaid(address indexed recipient, uint256 indexed amount);

    /***********************************|
  |              Public               |
  |__________________________________*/

    function creatorOf(uint256 tokenId) external view returns (address);

    function getTokenSalePrice(uint256 tokenId) external view returns (uint256);

    function buy(uint256 tokenId) external payable returns (bool);

    function buy(uint256 tokenId, address commissionAddress)
        external
        payable
        returns (bool);

    function mint() external payable returns (uint256 newTokenId);

    function mint(address commissionAddress)
        external
        payable
        returns (uint256 newTokenId);

    function burn(uint256 tokenId) external;

    function deposit() external payable;

    function deposit(IERC20 token, uint256 amount) external payable;

    function getMaxSupply() external view returns (uint256);

    function getTotalSupply() external view returns (uint256);

    function getOwner() external view returns (address);

    /***********************************|
  |     Only Token Creator/Owner      |
  |__________________________________*/
    function setTokenSalePrice(uint256 tokenId, uint256 salePrice) external;

    function setMintingPrice(uint256 amount) external;

    function setRoyalties(address royaltyReceiver, uint256 royaltiesPct)
        external;

    function setMaxSupply(uint256 amount) external;
}

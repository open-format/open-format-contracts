// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "../lib/BlackholePrevention.sol";

interface IMusicFactory is IERC721 {
    event ReleaseCreated(
        address indexed creator,
        uint256 indexed royaltiesPercentage,
        uint256 salePrice,
        string metadataURI_,
        uint256 maxSupply,
        string symbol,
        string name
    );
    event PausedStateSet(bool isPaused);
    event SalePriceSet(uint256 indexed tokenId, uint256 salePrice);
    event ReleaseSold(
        uint256 indexed tokenId,
        address indexed oldOwner,
        address indexed newOwner,
        uint256 salePrice
    );
    event ReleaseMinted(
        uint256 indexed newTokenId,
        address indexed creator,
        address indexed receiver
    );

    event RoyaltiesSet(address indexed receiver, uint256 indexed percentage);

    /***********************************|
  |              Public               |
  |__________________________________*/

    function creatorOf(uint256 tokenId) external view returns (address);

    function getTokenSalePrice(uint256 tokenId) external view returns (uint256);

    function buyRelease(uint256 tokenId) external payable returns (bool);

    function mintRelease(address creator, address receiver)
        external
        payable
        returns (uint256 newTokenId);

    /***********************************|
  |     Only Token Creator/Owner      |
  |__________________________________*/
    function setTokenSalePrice(uint256 tokenId, uint256 salePrice) external;
}

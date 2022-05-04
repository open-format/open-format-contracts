// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IFactory is IERC721 {
    event Created(
        address indexed creator,
        string metadataURI_,
        string symbol,
        string name
    );
    event PausedStateSet(bool isPaused);
    event SalePriceSet(uint256 indexed tokenId, uint256 salePrice);
    event Sold(
        uint256 indexed tokenId,
        address indexed oldOwner,
        address indexed newOwner,
        uint256 salePrice
    );
    event Minted(uint256 indexed newTokenId, address indexed owner);

    event RoyaltiesSet(address indexed receiver, uint256 indexed percentage);

    /***********************************|
  |              Public               |
  |__________________________________*/

    function creatorOf(uint256 tokenId) external view returns (address);

    function getTokenSalePrice(uint256 tokenId) external view returns (uint256);

    function buy(uint256 tokenId) external payable returns (bool);

    function mint() external payable returns (uint256 newTokenId);

    /***********************************|
  |     Only Token Creator/Owner      |
  |__________________________________*/
    function setTokenSalePrice(uint256 tokenId, uint256 salePrice) external;

    function setMintingPrice(uint256 _amount) external;

    function setRoyalties(uint256 _royaltiesPct) external;

    function setMaxSupply(uint256 _amount) external;
}

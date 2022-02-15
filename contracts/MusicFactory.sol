//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

import "./lib/BlackholePrevention.sol";
import "./ERC2981.sol";
import "./interfaces/IMusicFactory.sol";

contract MusicFactory is
    IMusicFactory,
    ERC721,
    ERC721URIStorage,
    ERC721Enumerable,
    ERC2981,
    Ownable,
    BlackholePrevention,
    PaymentSplitter
{
    using SafeMath for uint256;
    using Address for address payable;
    using Counters for Counters.Counter;

    Counters.Counter internal _tokenIds;

    mapping(uint256 => address) internal _tokenCreator;
    mapping(uint256 => uint256) internal _tokenSalePrice;

    uint256 public releaseSalePrice;
    uint256 public maxSupply;
    bool internal _paused;
    string public metadataURI;

    /***********************************|
 |          Initialization           |
 |__________________________________*/

    constructor(
        address[] memory payees_,
        uint256[] memory shares_,
        uint256 salePrice_,
        string memory name_,
        string memory symbol_,
        uint256 maxSupply_,
        uint256 royaltiesPercentage_,
        string memory metadataURI_
    ) ERC721(name_, symbol_) PaymentSplitter(payees_, shares_) {
        releaseSalePrice = salePrice_;
        maxSupply = maxSupply_;
        metadataURI = metadataURI_;

        if (royaltiesPercentage_ > 0) {
            _setRoyalties(msg.sender, royaltiesPercentage_);
            emit RoyaltiesSet(msg.sender, royaltiesPercentage_);
        }

        emit ReleaseCreated(
            msg.sender,
            royaltiesPercentage_,
            salePrice_,
            metadataURI_,
            maxSupply_,
            symbol_,
            name_
        );
    }

    /***********************************|
  |              Overrides            |
  |__________________________________*/

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, amount);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, IERC165, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return metadataURI;
    }

    /***********************************|
  |              Public               |
  |__________________________________*/
    function creatorOf(uint256 tokenId)
        external
        view
        virtual
        override
        returns (address)
    {
        return _tokenCreator[tokenId];
    }

    function getTokenSalePrice(uint256 tokenId)
        external
        view
        virtual
        override
        returns (uint256)
    {
        return _tokenSalePrice[tokenId];
    }

    function mintRelease(address creator, address receiver)
        external
        payable
        virtual
        override
        returns (uint256 newTokenId)
    {
        require(msg.value >= releaseSalePrice, "Underpaid");

        newTokenId = _mintRelease(creator, receiver);
    }

    function buyRelease(uint256 tokenId)
        external
        payable
        virtual
        override
        returns (bool)
    {
        return _buyRelease(tokenId);
    }

    /***********************************|
  |    Only Owner/Creator              |
  |__________________________________*/
    function setTokenSalePrice(uint256 tokenId, uint256 _salePrice)
        external
        virtual
        override
        whenNotPaused
        onlyTokenOwnerOrApproved(tokenId)
    {
        _setTokenSalePrice(tokenId, _salePrice);
    }

    function setReleaseSalePrice(uint256 _salePrice)
        external
        virtual
        whenNotPaused
        onlyOwner
    {
        releaseSalePrice = _salePrice;
    }

    /***********************************|
  |         Private Functions         |
  |__________________________________*/
    function _mintRelease(address creator, address receiver)
        internal
        virtual
        returns (uint256 newTokenId)
    {
        _tokenIds.increment();

        newTokenId = _tokenIds.current();
        _safeMint(receiver, newTokenId, "");
        _tokenCreator[newTokenId] = creator;

        _setTokenURI(newTokenId, metadataURI);
        emit ReleaseMinted(newTokenId, creator, receiver);
    }

    function _buyRelease(uint256 tokenId) internal virtual returns (bool) {
        uint256 tokenSalePrice = _tokenSalePrice[tokenId];
        require(tokenSalePrice > 0, "MF: Token not for sale");
        require(msg.value >= tokenSalePrice, "PRT:E-414");

        address oldOwner = ownerOf(tokenId);
        address newOwner = _msgSender();

        (address recipient, uint256 amount) = this.royaltyInfo(
            0,
            tokenSalePrice
        );

        // Transfer Token
        _transfer(oldOwner, newOwner, tokenId);

        // Transfer Royalty
        payable(recipient).sendValue(amount);

        // Transfer Payment
        payable(oldOwner).sendValue(tokenSalePrice.sub(amount));

        emit ReleaseSold(tokenId, oldOwner, newOwner, tokenSalePrice);

        _refundOverpayment(tokenSalePrice);
        return true;
    }

    function _setTokenSalePrice(uint256 tokenId, uint256 _salePrice)
        internal
        virtual
    {
        _tokenSalePrice[tokenId] = _salePrice;
        emit SalePriceSet(tokenId, _salePrice);
    }

    function _refundOverpayment(uint256 threshold) internal virtual {
        uint256 overage = msg.value.sub(threshold);
        if (overage > 0) {
            payable(_msgSender()).sendValue(overage);
        }
    }

    /***********************************|
  |          Only Release Owner/Creator  |
  |            |
  |__________________________________*/

    function setTotalSupply(uint256 amount) external onlyOwner {
        maxSupply = amount;
    }

    function setMetadataURI(string memory _metadataURI) external onlyOwner {
        metadataURI = _metadataURI;
    }

    function withdrawEther(address payable receiver, uint256 amount)
        external
        onlyOwner
    {
        _withdrawEther(receiver, amount);
    }

    function withdrawErc20(
        address payable receiver,
        address tokenAddress,
        uint256 amount
    ) external onlyOwner {
        _withdrawERC20(receiver, tokenAddress, amount);
    }

    function withdrawERC721(
        address payable receiver,
        address tokenAddress,
        uint256 tokenId
    ) external onlyOwner {
        _withdrawERC721(receiver, tokenAddress, tokenId);
    }

    /***********************************|
  |             Modifiers             |
  |__________________________________*/

    modifier whenNotPaused() {
        require(!_paused, "PRT:E-101");
        _;
    }

    modifier onlyTokenOwnerOrApproved(uint256 tokenId) {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "PRT:E-105");
        _;
    }

    modifier onlyTokenCreator(uint256 tokenId) {
        require(_tokenCreator[tokenId] == _msgSender(), "PRT:E-104");
        _;
    }
}

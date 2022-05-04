//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IDepositManager.sol";
import "./PaymentSplitter.sol";

import "./ERC2981.sol";
import "./interfaces/IFactory.sol";
import "./PaymentSplitter.sol";

contract Factory is
    IFactory,
    ERC721,
    ERC721URIStorage,
    ERC721Enumerable,
    ERC2981,
    Ownable,
    PaymentSplitter
{
    address public approvedRevShareContract;

    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    using Address for address payable;
    using Counters for Counters.Counter;

    mapping(uint256 => address) internal _tokenCreator;
    mapping(uint256 => uint256) internal _tokenSalePrice;

    address public contractCreator;

    uint256 public mintingPrice;
    uint256 public maxSupply;

    // Add pause minting functionality
    bool public paused;
    string public metadataURI;

    /***********************************|
 |          Initialization           |
 |__________________________________*/

    constructor(
        string memory name_,
        string memory symbol_,
        string memory metadataURI_
    ) ERC721(name_, symbol_) PaymentSplitter() {
        metadataURI = metadataURI_;

        emit Created(msg.sender, metadataURI_, symbol_, name_);
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

    function mint()
        external
        payable
        virtual
        override
        whenNotPaused
        returns (uint256 newTokenId)
    {
        require(msg.value >= mintingPrice, "WL:E-001");

        newTokenId = _mint();
    }

    function buy(uint256 tokenId)
        external
        payable
        virtual
        override
        whenNotPaused
        returns (bool)
    {
        return _buy(tokenId);
    }

    function deposit(address contractAddress) public payable {
        require(contractAddress == approvedRevShareContract, "Not approved");

        uint256 total = totalSupply();

        IDepositManager(approvedRevShareContract).calculateSplitETH(
            // Deposit amount
            msg.value,
            // token number of NFTs
            total
        );
        _totalDepositedAmount += msg.value;
    }

    function deposit(
        address contractAddress,
        IERC20 token,
        uint256 amount
    ) public payable {
        uint256 allowance = token.allowance(msg.sender, address(this));
        uint256 total = totalSupply();

        require(contractAddress == approvedRevShareContract, "Not approved");
        require(allowance >= amount, "Check the token allowance");

        token.transferFrom(msg.sender, address(this), amount);

        IDepositManager(approvedRevShareContract).calculateSplitERC20(
            token,
            // Deposit amount
            amount,
            // token number of NFTs
            total
        );
        _erc20TotalDeposited[token] += amount;
    }

    function withdraw(address contractAddress, uint256 tokenId)
        public
        payable
        returns (uint256)
    {
        require(contractAddress == approvedRevShareContract, "Not approved");

        address owner = ownerOf(tokenId); // 0
        uint256 amount = IDepositManager(approvedRevShareContract)
            .getSingleTokenBalance(address(this), tokenId);
        payable(owner).sendValue(amount);
        _totalDepositedReleased += amount;
        IDepositManager(approvedRevShareContract).updateSplitBalanceETH(
            0,
            tokenId
        );
        return amount;
    }

    function withdraw(
        IERC20 token,
        address contractAddress,
        uint256 tokenId
    ) public payable returns (uint256) {
        require(contractAddress == approvedRevShareContract, "Not approved");

        address owner = ownerOf(tokenId); // 0
        uint256 amount = IDepositManager(approvedRevShareContract)
            .getSingleTokenBalance(token, address(this), tokenId);
        _erc20TotalDepositedReleased[token] += amount;
        IDepositManager(approvedRevShareContract).updateSplitBalanceERC20(
            token,
            0,
            tokenId
        );
        token.safeTransfer(owner, amount);
        return amount;
    }

    /***********************************|
  |    Only Owner/Creator              |
  |__________________________________*/
    function setMintingPrice(uint256 _amount)
        external
        virtual
        override
        onlyOwner
    {
        mintingPrice = _amount;
    }

    function setRoyalties(uint256 _royaltiesPct)
        external
        virtual
        override
        onlyOwner
    {
        require(_royaltiesPct > 0, "Royalties must be greater than 0");

        _setRoyalties(address(this), _royaltiesPct);
        emit RoyaltiesSet(address(this), _royaltiesPct);
    }

    function setMaxSupply(uint256 _amount) external virtual override onlyOwner {
        maxSupply = _amount;
    }

    function setTokenSalePrice(uint256 tokenId, uint256 _salePrice)
        external
        virtual
        override
        whenNotPaused
        onlyTokenOwnerOrApproved(tokenId)
    {
        _setTokenSalePrice(tokenId, _salePrice);
    }

    function togglePausedState() external virtual onlyOwner {
        paused = !paused;
    }

    function setApprovedRevShareContract(address contractAddress_)
        public
        onlyOwner
    {
        approvedRevShareContract = contractAddress_;
        IDepositManager(contractAddress_).setApprovedCaller();
    }

    /***********************************|
  |         Private Functions         |
  |__________________________________*/
    function _mint() internal virtual returns (uint256 newTokenId) {
        newTokenId = totalSupply();
        _safeMint(msg.sender, newTokenId, "");
        _tokenCreator[newTokenId] = msg.sender;

        _setTokenURI(newTokenId, metadataURI);
        emit Minted(newTokenId, msg.sender);
    }

    function _buy(uint256 tokenId) internal virtual returns (bool) {
        uint256 tokenSalePrice = _tokenSalePrice[tokenId];
        require(tokenSalePrice > 0, "WL:E-002");
        require(msg.value >= tokenSalePrice, "WL:E-003");

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

        emit Sold(tokenId, oldOwner, newOwner, tokenSalePrice);

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

    function _calculatePercentage(uint256 pct, uint256 totalValue)
        internal
        virtual
        returns (uint256 value)
    {
        return (totalValue / 100) * pct;
    }

    /***********************************|
  |          Only  Owner/Creator  |
  |                                     |
  |__________________________________*/

    function setTotalSupply(uint256 amount) external onlyOwner {
        maxSupply = amount;
    }

    function setMetadataURI(string memory _metadataURI) external onlyOwner {
        metadataURI = _metadataURI;
    }

    /***********************************|
  |             Modifiers             |
  |__________________________________*/

    modifier whenNotPaused() {
        require(!paused, "WL:E-004");
        _;
    }

    modifier onlyTokenOwnerOrApproved(uint256 tokenId) {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "WL:E-005");
        _;
    }
}

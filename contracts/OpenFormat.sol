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

import "./ERC2981.sol";
import "./interfaces/IDepositManager.sol";
import "./interfaces/IRoyaltyManager.sol";
import "./interfaces/IOpenFormat.sol";
import "./PaymentSplitter.sol";

contract OpenFormat is
    IOpenFormat,
    ERC721,
    ERC721URIStorage,
    ERC721Enumerable,
    ERC2981,
    Ownable,
    PaymentSplitter
{
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    using Address for address payable;

    mapping(uint256 => address) internal _tokenCreator;
    mapping(uint256 => uint256) internal _tokenSalePrice;

    address public approvedDepositExtension;
    address public approvedRoyaltyExtension;
    address public contractCreator;

    uint256 internal constant PERCENTAGE_SCALE = 1e4; // 10000 100%
    uint256 internal maxSupply;
    uint256 public mintingPrice;
    uint256 public primaryCommissionPct;
    uint256 public secondaryCommissionPct;

    // Add pause minting functionality
    bool public paused;
    string public metadataURI;

    /***********************************|
 |          Initialization           |
 |__________________________________*/

    constructor(
        string memory name_,
        string memory symbol_,
        string memory metadataURI_,
        uint256 maxSupply_,
        uint256 mintingPrice_
    ) ERC721(name_, symbol_) PaymentSplitter() {
        metadataURI = metadataURI_;
        maxSupply = maxSupply_;
        mintingPrice = mintingPrice_;

        emit Created(
            msg.sender,
            metadataURI_,
            symbol_,
            name_,
            maxSupply,
            mintingPrice
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

    function mint()
        external
        payable
        virtual
        override
        whenNotPaused
        returns (uint256 newTokenId)
    {
        require(msg.value >= mintingPrice, "OF:E-001");

        newTokenId = _mint();
    }

    function mint(address commissionAddress)
        external
        payable
        virtual
        override
        whenNotPaused
        returns (uint256 newTokenId)
    {
        require(msg.value >= mintingPrice, "OF:E-001");

        if (primaryCommissionPct > 0) {
            uint256 amount = _calculatePercentage(
                primaryCommissionPct,
                msg.value
            );
            payable(commissionAddress).sendValue(amount);

            emit CommissionPaid(
                "primary",
                commissionAddress,
                totalSupply(),
                msg.value
            );
        }

        newTokenId = _mint();
    }

    function buy(uint256 tokenId)
        external
        payable
        virtual
        override
        returns (bool)
    {
        return _buy(tokenId, msg.value);
    }

    function buy(uint256 tokenId, address commissionAddress)
        external
        payable
        virtual
        override
        returns (bool)
    {
        require(commissionAddress != address(0), "OF:E-002");
        uint256 tokenSalePrice = _tokenSalePrice[tokenId];
        uint256 commissionAmount = _calculatePercentage(
            secondaryCommissionPct,
            tokenSalePrice
        );

        if (secondaryCommissionPct > 0) {
            payable(commissionAddress).sendValue(commissionAmount);

            emit CommissionPaid(
                "secondary",
                commissionAddress,
                tokenId,
                msg.value
            );
        }

        return _buy(tokenId, uint256(msg.value).sub(commissionAmount));
    }

    function deposit() external payable virtual override {
        require(approvedDepositExtension != address(0), "OF:E-003");

        uint256 total = totalSupply();

        IDepositManager(approvedDepositExtension).calculateSplitETH(
            // Deposit amount
            msg.value,
            // token number of NFTs
            total
        );
        _totalDepositedAmount += msg.value;

        emit TotalDepositedAmountUpdated(msg.value);
    }

    function deposit(IERC20 token, uint256 amount)
        external
        payable
        virtual
        override
    {
        uint256 allowance = token.allowance(msg.sender, address(this));
        uint256 total = totalSupply();

        require(approvedDepositExtension != address(0), "OF:E-003");
        require(allowance >= amount, "OF:E-004");

        token.transferFrom(msg.sender, address(this), amount);

        IDepositManager(approvedDepositExtension).calculateSplitERC20(
            token,
            // Deposit amount
            amount,
            // total number of NFTs
            total
        );
        _erc20TotalDeposited[token] += amount;
        emit ERC20TotalDepositedAmountUpdated(token, msg.value);
    }

    function withdraw(uint256 tokenId)
        public
        payable
        onlyTokenOwnerOrApproved(tokenId)
        returns (uint256)
    {
        require(approvedDepositExtension != address(0), "OF:E-003");

        address owner = ownerOf(tokenId); // 0
        uint256 amount = IDepositManager(approvedDepositExtension)
            .getSingleTokenBalance(address(this), tokenId);
        payable(owner).sendValue(amount);
        _totalDepositedReleased += amount;
        IDepositManager(approvedDepositExtension).updateSplitBalanceETH(
            0,
            tokenId
        );

        emit TokenBalanceWithdrawn(tokenId, amount);
        return amount;
    }

    function withdraw(IERC20 token, uint256 tokenId)
        public
        payable
        onlyTokenOwnerOrApproved(tokenId)
        returns (uint256)
    {
        require(approvedDepositExtension != address(0), "OF:E-003");

        address owner = ownerOf(tokenId); // 0
        uint256 amount = IDepositManager(approvedDepositExtension)
            .getSingleTokenBalance(token, address(this), tokenId);
        _erc20TotalDepositedReleased[token] += amount;
        IDepositManager(approvedDepositExtension).updateSplitBalanceERC20(
            token,
            0,
            tokenId
        );
        token.safeTransfer(owner, amount);

        emit ERC20TokenBalanceWithdrawn(token, tokenId, amount);
        return amount;
    }

    function getPrimaryCommissionPct() external view returns (uint256) {
        return primaryCommissionPct;
    }

    function getSecondaryCommissionPct() external view returns (uint256) {
        return secondaryCommissionPct;
    }

    function getMaxSupply() external view override returns (uint256) {
        return maxSupply;
    }

    function getTotalSupply() external view override returns (uint256) {
        return totalSupply();
    }

    function getSingleTokenBalance(address caller, uint256 tokenId)
        external
        view
        returns (uint256)
    {
        require(approvedDepositExtension != address(0), "OF:E-003");
        uint256 balance = IDepositManager(approvedDepositExtension)
            .getSingleTokenBalance(caller, tokenId);

        return balance;
    }

    function getSingleTokenBalance(
        IERC20 token,
        address caller,
        uint256 tokenId
    ) external view returns (uint256) {
        require(approvedDepositExtension != address(0), "OF:E-003");
        uint256 balance = IDepositManager(approvedDepositExtension)
            .getSingleTokenBalance(token, caller, tokenId);

        return balance;
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
        emit MintingPriceSet(_amount);
    }

    function setRoyalties(address royaltyReceiver, uint256 _royaltiesPct)
        external
        virtual
        override
        onlyOwner
    {
        require(_royaltiesPct > 0, "OF:E-004");
        require(royaltyReceiver != address(0), "OF:E-005");

        _setRoyalties(royaltyReceiver, _royaltiesPct);
        emit RoyaltiesSet(address(this), _royaltiesPct);
    }

    function setMaxSupply(uint256 _amount) external virtual override onlyOwner {
        maxSupply = _amount;
        emit MaxSupplySet(_amount);
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
        emit PausedStateSet(!paused);
    }

    function setApprovedDepositExtension(address contractAddress_)
        public
        onlyOwner
    {
        approvedDepositExtension = contractAddress_;
        IDepositManager(contractAddress_).setApprovedCaller();
        emit ApprovedDepositExtensionSet(approvedDepositExtension);
    }

    function setApprovedRoyaltyExtension(address contractAddress_)
        public
        onlyOwner
    {
        approvedRoyaltyExtension = contractAddress_;
        emit ApprovedRoyaltyExtensionSet(approvedRoyaltyExtension);
    }

    function setApprovedRoyaltyExtensionCustomPct(uint256 amount_)
        external
        onlyOwner
    {
        require(amount_ <= PERCENTAGE_SCALE, "OF:E-006");
        require(approvedRoyaltyExtension != address(0), "OF:E-007");
        IRoyaltyManager(approvedRoyaltyExtension).setCustomRoyaltyPct(amount_);
        emit ApprovedRoyaltyExtensionCustomPctSet(amount_);
    }

    function setPrimaryCommissionPct(uint256 amount_) public onlyOwner {
        require(amount_ <= PERCENTAGE_SCALE, "OF:E-006");
        primaryCommissionPct = amount_;
        emit PrimaryCommissionSet(amount_);
    }

    function setSecondaryCommissionPct(uint256 amount_) public onlyOwner {
        require(amount_ <= PERCENTAGE_SCALE, "OF:E-006");
        secondaryCommissionPct = amount_;
        emit SecondaryCommissionSet(amount_);
    }

    function burn(uint256 tokenId)
        external
        virtual
        override
        onlyTokenOwnerOrApproved(tokenId)
        whenNotPaused
    {
        _burn(tokenId);
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

    function _buy(uint256 tokenId, uint256 value)
        internal
        virtual
        returns (bool)
    {
        uint256 tokenSalePrice = _tokenSalePrice[tokenId];
        require(tokenSalePrice > 0, "OF:E-007");
        require(value >= tokenSalePrice, "OF:E-008");

        address oldOwner = ownerOf(tokenId);
        address newOwner = _msgSender();

        (address recipient, uint256 amount) = this.royaltyInfo(
            0,
            tokenSalePrice
        );

        // Transfer Royalty
        if (approvedRoyaltyExtension != address(0)) {
            payable(approvedRoyaltyExtension).sendValue(amount);
        } else if (amount > 0) {
            payable(recipient).sendValue(amount);
            emit RoyaltyPaid(recipient, amount);
        }

        // Transfer Payment
        payable(oldOwner).sendValue(tokenSalePrice.sub(amount));

        emit Sold(tokenId, oldOwner, newOwner, tokenSalePrice);

        _refundOverpayment(tokenSalePrice);

        // Transfer Token
        _transfer(oldOwner, newOwner, tokenId);
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
        // return (totalValue / 100) * pct;
        return totalValue.mul(pct).div(PERCENTAGE_SCALE);
    }

    /***********************************|
  |             Modifiers             |
  |__________________________________*/

    modifier whenNotPaused() {
        require(!paused, "OF:E-009");
        _;
    }

    modifier onlyTokenOwnerOrApproved(uint256 tokenId) {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "OF:E-010");
        _;
    }
}

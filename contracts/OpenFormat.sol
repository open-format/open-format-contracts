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
import "./interfaces/IMintingManager.sol";
import "./interfaces/IOpenFormat.sol";
import "./PaymentSplitter.sol";

/**
 * @title Open Format
 * @dev This is the main contract for the Open Format protocol.
 * NOTE: If this contract is modified and the ABI and bytecode changes
 * it will not be compatible with the Open Format subgraphs.
 */

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
    address public approvedMintingExtension;

    uint256 internal constant PERCENTAGE_SCALE = 1e4; // 10000 100%
    uint256 internal maxSupply;
    uint256 public mintingPrice;
    uint256 public primaryCommissionPct;
    uint256 public secondaryCommissionPct;

    bool public paused;
    bool public shareIncomeWithHolders;

    string public metadataURI;

    /***********************************|
 |          Initialization           |
 |__________________________________*/

    /**
     * @notice Creates an instance of `Open Format`.
     * @param name_ The name of the NFT.
     * @param symbol_ The block indentifier for the NFT e.g TUNE.
     * @param metadataURI_ The URI linking to the metadata of NFT. We highly recommend using IPFS. e.g ipfs://
     * @param maxSupply_ The total amount of NFTs that can be minted.
     * @param mintingPrice_ The mint price (in wei) of each NFT.
     */

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

    /**
     * @notice Getter for the creator of a given token.
     * @param tokenId The ID of the token.
     * @return tokenCreator The address of the token creator.
     */

    function creatorOf(uint256 tokenId)
        external
        view
        virtual
        override
        returns (address)
    {
        return _tokenCreator[tokenId];
    }

    /**
     * @notice Getter the token sale price of a given token.
     * @param tokenId The ID of the token.
     * @return salePrice The sale price (in wei) of the token.
     */

    function getTokenSalePrice(uint256 tokenId)
        external
        view
        virtual
        override
        returns (uint256)
    {
        return _tokenSalePrice[tokenId];
    }

    /**
     * @notice Mints a NFT.
     * @dev This is an overloaded function.
     * @dev An approved minting extension can be used before minting is approved.
     * @return newTokenId The ID of the minted token.
     */

    function mint()
        external
        payable
        virtual
        override
        whenNotPaused
        returns (uint256 newTokenId)
    {
        require(msg.value >= mintingPrice, "OF:E-001");

        if (approvedMintingExtension != address(0)) {
            IMintingManager(approvedMintingExtension).mint(msg.sender);
        }

        newTokenId = _mint();
    }

    /**
     * @notice Mints a NFT with a primary commission.
     * @dev This is an overloaded function.
     * @dev If a primary commission percentage is set, a percentage of the minting cost will go to the commission address.
     * @param commissionAddress The address that receives a percentage of the minting cost.
     * @return newTokenId The ID of the minted token.
     */

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

    /**
     * @notice Facilitates a secondary sale of an NFT.
     * @param tokenId The ID of the token which is being sold.
     * @dev This is an overloaded function.
     * @return bool
     */

    function buy(uint256 tokenId)
        external
        payable
        virtual
        override
        whenNotPaused
        returns (bool)
    {
        return _buy(tokenId, msg.value);
    }

    /**
     * @notice Facilitates a secondary sale of an NFT with a secondary commission.
     * @param tokenId The ID of the token which is being sold.
     * @dev This is an overloaded function.
     * @return bool
     */

    function buy(uint256 tokenId, address commissionAddress)
        external
        payable
        virtual
        override
        whenNotPaused
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

    /**
     * @notice This function handles Ether deposits via the approved deposit extension.
     * @dev This is an overloaded function.
     * @dev An approved deposit extension must be set.
     */

    function deposit() public payable virtual override {
        require(approvedDepositExtension != address(0), "OF:E-003");

        uint256 totalSupply = totalSupply();

        IDepositManager(approvedDepositExtension).calculateSplitETH(
            msg.value,
            totalSupply
        );
        _totalDepositedAmount += msg.value;

        emit TotalDepositedAmountUpdated(msg.value);
    }

    /**
     * @notice This function handles ERC20 token deposits via the approved deposit extension.
     * @param token The contract address of the ERC20 token.
     * @param amount The amount (in wei) of the ERC20 token to deposit.
     * @dev This is an overloaded function.
     * @dev An approved deposit extension must be set.
     */

    function deposit(IERC20 token, uint256 amount)
        external
        payable
        virtual
        override
    {
        uint256 allowance = token.allowance(msg.sender, address(this));
        uint256 totalSupply = totalSupply();

        require(approvedDepositExtension != address(0), "OF:E-003");
        require(allowance >= amount, "OF:E-004");

        token.transferFrom(msg.sender, address(this), amount);

        IDepositManager(approvedDepositExtension).calculateSplitERC20(
            token,
            amount,
            totalSupply
        );
        _erc20TotalDeposited[token] += amount;
        emit ERC20TotalDepositedAmountUpdated(token, msg.value);
    }

    /**
     * @notice This function handles withdrawing the Ether balance of a single token via the approved deposit extension.
     * @param tokenId The ID of the token to withdraw from.
     * @dev This is an overloaded function.
     * @dev An approved deposit extension must be set.
     * @dev This will withdraw the entire balance for the given NFT.
     */

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

    /**
     * @notice This function handles withdrawing ERC20 balances of a single token via the approved deposit extension.
     * @param token The contract address of the ERC20 token.
     * @param tokenId The ID of the token to withdraw from.
     * @dev This is an overloaded function.
     * @dev An approved deposit extension must be set.
     * @dev This will withdraw the entire balance of a single ERC20 token for the given NFT.
     */

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

    /**
     * @notice Getter for the primary commission percent.
     * @return percentage The set primary commission percentage.
     */

    function getPrimaryCommissionPct() external view returns (uint256) {
        return primaryCommissionPct;
    }

    /**
     * @notice Getter for the primary commission percent.
     * @return percentage The set primary commission percentage.
     */

    function getSecondaryCommissionPct() external view returns (uint256) {
        return secondaryCommissionPct;
    }

    /**
     * @notice Getter for the max supply of token that can be minted.
     * @return maxSupply The max supply of tokens.
     */

    function getMaxSupply() external view override returns (uint256) {
        return maxSupply;
    }

    /**
     * @notice Getter for the amount of token that have been minted.
     * @return totalSupply The amount of tokens that have been minted.
     */

    function getTotalSupply() external view override returns (uint256) {
        return totalSupply();
    }

    /**
     * @notice Getter for the owner of the contact.
     * @return owner The address of the contract owner.
     */

    function getOwner() external view override returns (address) {
        return owner();
    }

    /**
     * @notice Getter for the Ether balance of a single token.
     * @dev An approved deposit extension must be set.
     * @param tokenId The token ID.
     * @return tokenBalance The token balance in Ether.
     */

    function getSingleTokenBalance(uint256 tokenId)
        external
        view
        returns (uint256 tokenBalance)
    {
        require(approvedDepositExtension != address(0), "OF:E-003");
        uint256 balance = IDepositManager(approvedDepositExtension)
            .getSingleTokenBalance(address(this), tokenId);

        return balance;
    }

    /**
     * @notice Getter for the ERC20 token balance of a single token.
     * @dev An approved deposit extension must be set.
     * @param token The contract address of the ERC20 token.
     * @param tokenId The token ID.
     * @return tokenBalance The token balance of the given ERC20 token in Ether.
     */

    function getSingleTokenBalance(IERC20 token, uint256 tokenId)
        external
        view
        returns (uint256 tokenBalance)
    {
        require(approvedDepositExtension != address(0), "OF:E-003");
        uint256 balance = IDepositManager(approvedDepositExtension)
            .getSingleTokenBalance(token, address(this), tokenId);

        return balance;
    }

    /***********************************|
  |    Only Owner/Creator              |
  |__________________________________*/
    /**
     * @notice Setter for the minting price.
     * @param amount The amount (in wei) of the new minting price.
     * @dev Set to 0 for minting to be be free.
     * @dev This function can only be called by the owner of the contract.
     */

    function setMintingPrice(uint256 amount)
        external
        virtual
        override
        onlyOwner
    {
        mintingPrice = amount;
        emit MintingPriceSet(amount);
    }

    /**
     * @notice Setter for the royalties using ERC2981.
     * @param royaltyReceiver The address of the royalty receiver.
     * @param royaltiesPct The percentage of the royalties.
     * @dev royaltiesPct e.g 2.5% = 250.
     * @dev This function can only be called by the owner of the contract.
     */

    function setRoyalties(address royaltyReceiver, uint256 royaltiesPct)
        external
        virtual
        override
        onlyOwner
    {
        require(royaltiesPct > 0, "OF:E-004");
        require(royaltyReceiver != address(0), "OF:E-005");

        _setRoyalties(royaltyReceiver, royaltiesPct);
        emit RoyaltiesSet(royaltyReceiver, royaltiesPct);
    }

    /**
     * @notice Setter for the maximum supply of tokens that can be minted.
     * @param amount The total amount of tokens that can be minted.
     * @dev This function can only be called by the owner of the contract.
     */

    function setMaxSupply(uint256 amount) external virtual override onlyOwner {
        maxSupply = amount;
        emit MaxSupplySet(amount);
    }

    /**
     * @notice Setter for the secondary sale price for a given token.
     * @param tokenId The token ID.
     * @param salePrice The new sale price (in wei) of the token.
     * @dev The salePrice must be greater than 0.
     * @dev This function can only be called by the token owner or approved address.
     */

    function setTokenSalePrice(uint256 tokenId, uint256 salePrice)
        external
        virtual
        override
        whenNotPaused
        onlyTokenOwnerOrApproved(tokenId)
    {
        _setTokenSalePrice(tokenId, salePrice);
    }

    /**
     * @notice Toggles the paused state.
     * @dev When paused is true certain functions will be reverted. Use for timed drops, emergencies or damange prevention.
     * @dev This function can only be called by the owner of the contract.
     */

    function togglePausedState() external virtual onlyOwner {
        paused = !paused;
        emit PausedStateSet(!paused);
    }

    /**
     * @notice Setter for the approved deposit extension.
     * @param contractAddress The contract address of the deposit extension.
     * @param holderPct The percentage of a deposit that each token will receive.
     * @dev holderPct e.g 2.5% = 250
     * @dev This function can only be called by the owner of the contract.
     */

    function setApprovedDepositExtension(
        address contractAddress,
        uint256 holderPct
    ) public onlyOwner {
        approvedDepositExtension = contractAddress;
        IDepositManager(contractAddress).setHolderPct(holderPct);
        emit ApprovedDepositExtensionSet(approvedDepositExtension);
    }

    /**
     * @notice Setter for the approved minting extension.
     * @param contractAddress The contract address of the minting extension.
     * @dev This function can only be called by the owner of the contract.
     */

    function setApprovedMintingExtension(address contractAddress)
        external
        onlyOwner
    {
        approvedMintingExtension = contractAddress;

        IMintingManager(contractAddress).setApprovedCaller(owner());
        emit ApprovedMintingExtensionSet(approvedMintingExtension);
    }

    /**
     * @notice Setter for the primary commission for the contract.
     * @param amount The percentage paid to the commission address when mint with commission is called.
     * @dev amount e.g 2.5% = 250
     * @dev This function can only be called by the owner of the contract.
     */

    function setPrimaryCommissionPct(uint256 amount) public onlyOwner {
        require(amount <= PERCENTAGE_SCALE, "OF:E-006");
        primaryCommissionPct = amount;
        emit PrimaryCommissionSet(amount);
    }

    /**
     * @notice Setter for the secondary commission for the contract.
     * @param amount The percentage paid to the commission address when buy with commission is called.
     * @dev amount e.g 2.5% = 250
     * @dev This function can only be called by the owner of the contract.
     */

    function setSecondaryCommissionPct(uint256 amount) public onlyOwner {
        require(amount <= PERCENTAGE_SCALE, "OF:E-006");
        secondaryCommissionPct = amount;
        emit SecondaryCommissionSet(amount);
    }

    /**
     * @notice Setter for sharing income (via the receive) with NFT holders
     * @param state true or false
     * @dev This function can only be called by the owner of the contract.
     */

    function setShareIncomeWithHolders(bool state) public onlyOwner {
        shareIncomeWithHolders = state;
        emit ShareIncomeWithHoldersSet(state);
    }

    /**
     * @notice Burns a token.
     * @param tokenId The token ID that will be burnt.
     * @dev This function can only be called by the token owner or approved address.
     */

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
        if (amount > 0) {
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

    /**
     * @dev The Ether received will be logged with {PaymentReceived} events. Note that these events are not fully
     * reliable: it's possible for a contract to receive Ether without triggering this function. This only affects the
     * reliability of the events, and not the actual splitting of Ether.
     *
     * To learn more about this see the Solidity documentation for
     * https://solidity.readthedocs.io/en/latest/contracts.html#fallback-function[fallback
     * functions].
     */

    receive() external payable {
        if (shareIncomeWithHolders) {
            deposit();
        }
        emit PaymentReceived(_msgSender(), msg.value);
    }
}

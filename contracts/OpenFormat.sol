// SPDX-License-Identifier: Apache-2.0
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
import "./interfaces/IRevShareManager.sol";
import "./interfaces/IMintingManager.sol";
import "./interfaces/IOpenFormat.sol";

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
    Ownable
{
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    using Address for address payable;

    mapping(uint256 => address) internal _tokenCreator;
    mapping(uint256 => uint256) internal _tokenSalePrice;

    address public approvedRevShareExtension;
    address public approvedMintingExtension;

    uint256 internal constant PERCENTAGE_SCALE = 1e4; // 10000 100%
    uint256 internal maxSupply;
    uint256 public mintingPrice;
    uint256 public primaryCommissionPct;
    uint256 public secondaryCommissionPct;

    bool public paused;

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
    ) ERC721(name_, symbol_) {
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
     * @dev An approved revenue share extension can be used after minting to split the msg.value between multiple parties.
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

        if (approvedRevShareExtension != address(0)) {
            IRevShareManager(approvedRevShareExtension).calculateSplitETH(
                msg.value,
                true
            );
        } else {
            payable(owner()).sendValue(msg.value);
        }
    }

    /**
     * @notice Mints a NFT with a primary commission.
     * @dev This is an overloaded function.
     * @dev If a primary commission percentage is set, a percentage of the minting cost will go to the commission address.
     * @dev An approved minting extension can be used before minting is approved.
     * @dev An approved revenue share extension can be used after minting to split the msg.value between multiple parties.
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

        if (approvedMintingExtension != address(0)) {
            IMintingManager(approvedMintingExtension).mint(msg.sender);
        }

        newTokenId = _mint();

        if (approvedRevShareExtension != address(0)) {
            IRevShareManager(approvedRevShareExtension).calculateSplitETH(
                msg.value,
                true
            );
        } else {
            payable(owner()).sendValue(msg.value);
        }
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
     * @notice This function handles Ether deposits via the approved revenue share extension.
     * @param excludedFromSplit This param can be used to conditionally call/ignore code in your revenue share extension depending on source of the value.
     * @dev This is an overloaded function.
     * @dev An approved revenue share extension must be set.
     */

    function calculateRevShares(bool excludedFromSplit)
        public
        payable
        virtual
        override
        whenRevShare
    {
        IRevShareManager(approvedRevShareExtension).calculateSplitETH(
            msg.value,
            excludedFromSplit
        );

        emit TotalDepositedAmountUpdated(msg.value);
    }

    /**
     * @notice This function handles withdrawing the Ether balance of a single token via the approved revenue share extension.
     * @param tokenId The ID of the token to withdraw from.
     * @dev This is an overloaded function.
     * @dev An approved revenue share extension must be set.
     * @dev This will withdraw the entire balance for the given NFT.
     */

    function withdraw(uint256 tokenId)
        public
        payable
        onlyTokenOwnerOrApproved(tokenId)
        whenRevShare
        returns (uint256)
    {
        address owner = ownerOf(tokenId);
        uint256 amount = IRevShareManager(approvedRevShareExtension)
            .getSingleTokenBalance(address(this), tokenId);
        payable(owner).sendValue(amount);
        IRevShareManager(approvedRevShareExtension).updateHolderBalanceETH(
            0,
            tokenId
        );

        emit TokenBalanceWithdrawn(tokenId, amount);
        return amount;
    }

    /**
     * @notice This function handles withdrawing the Ether balance of a single collaborator via the approved revenue share extension.
     * @param collaborator The address of the collaborator
     * @dev This is an overloaded function.
     * @dev An approved revenue share extension must be set.
     * @dev This will withdraw the entire balance for the given NFT.
     */

    function withdraw(address collaborator)
        public
        payable
        whenRevShare
        returns (uint256)
    {
        uint256 amount = IRevShareManager(approvedRevShareExtension)
            .getSingleCollaboratorBalance(address(this), collaborator);

        payable(collaborator).sendValue(amount);
        IRevShareManager(approvedRevShareExtension)
            .updateCollaboratorBalanceETH(0, collaborator);

        emit CollaboratorBalanceWithdrawn(collaborator, amount);
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
     * @dev An approved revenue share extension must be set.
     * @param tokenId The token ID.
     * @return tokenBalance The token balance in Ether.
     */

    function getSingleTokenBalance(uint256 tokenId)
        external
        view
        whenRevShare
        returns (uint256 tokenBalance)
    {
        uint256 balance = IRevShareManager(approvedRevShareExtension)
            .getSingleTokenBalance(address(this), tokenId);

        return balance;
    }

    /**
     * @notice Getter for the Ether balance of a single collaborator.
     * @dev An approved revenue share extension must be set.
     * @param collaborator The address of the collaborator.
     * @return tokenBalance The token balance in Ether.
     */

    function getSingleCollaboratorBalance(address collaborator)
        external
        view
        whenRevShare
        returns (uint256 tokenBalance)
    {
        uint256 balance = IRevShareManager(approvedRevShareExtension)
            .getSingleCollaboratorBalance(address(this), collaborator);

        return balance;
    }

    function allocateShares(
        address[] calldata accounts_,
        uint256[] calldata shares_
    ) external whenRevShare {
        IRevShareManager(approvedRevShareExtension).allocateShares(
            msg.sender,
            accounts_,
            shares_
        );

        emit SharesAllocated(accounts_, shares_);
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
     * @notice Setter for the approved revenue share extension.
     * @param contractAddress The contract address of the revenue share extension.
     * @param collaborators an array of collaborator addresses.
     * @param shares an array of shares assigned to each collaborator.
     * @param holderPct The percentage of a deposit that each token will receive.
     * @dev holderPct/percentages e.g 2.5% = 250
     * @dev This function can only be called by the owner of the contract.
     */

    function setApprovedRevShareExtension(
        address contractAddress,
        address[] calldata collaborators,
        uint256[] calldata shares,
        uint256 holderPct
    ) public onlyOwner {
        approvedRevShareExtension = contractAddress;
        IRevShareManager(contractAddress).setupRevShare(
            collaborators,
            shares,
            holderPct
        );

        emit ApprovedRevShareExtensionSet(
            approvedRevShareExtension,
            collaborators,
            shares,
            holderPct
        );
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

    modifier whenRevShare() {
        require(approvedRevShareExtension != address(0), "OF:E-003");
        _;
    }

    receive() external payable {
        if (approvedRevShareExtension != address(0)) {
            calculateRevShares(false);
        } else {
            payable(owner()).sendValue(msg.value);
        }
        emit PaymentReceived(_msgSender(), msg.value);
    }
}

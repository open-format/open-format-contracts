// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IMintingManager.sol";
import "../interfaces/IOpenFormat.sol";
import "hardhat/console.sol";

/**
 * @dev This minting extension checks if the sender owns another NFT.
 * if they don't the transaction will fail.
 */

contract MintingExtension is IMintingManager {
    using SafeMath for uint256;

    mapping(address => address) public _approvedCallers;
    mapping(address => IERC721) public requiredToken;
    mapping(address => uint256) public maxPerWallet;

    /**
     * @dev set an approved caller. This function is called in OpenFormat.sol when an approvedMintingExtension is set.
     * @param owner The address of the owner of OpenFormat NFT
     */

    function setApprovedCaller(address owner) external virtual override {
        _approvedCallers[msg.sender] = owner;
    }

    /**
     * @dev set the maximum amount of OpenFormat NFTs that can be minted per address
     * @param nftAddress The address of the OpenFormat NFT
     * @param amount The maximum amount of OpenFormat NFTs that can be minted per address
     */

    function setMaxPerWallet(address nftAddress, uint256 amount)
        external
        onlyApprovedCaller(nftAddress)
    {
        maxPerWallet[nftAddress] = amount;
    }

    /**
     * @dev set which NFT is required to be held before minting
     * @param nftAddress The address of the OpenFormat NFT
     * @param token The address of the NFT that is required to be held by the minter
     */

    function setRequiredToken(address nftAddress, IERC721 token)
        external
        onlyApprovedCaller(nftAddress)
    {
        requiredToken[nftAddress] = token;
    }

    /**
     * @dev The function called by OpenFormat.sol to perform the necessary checks before minting
     * @param minter The address of the user trying to mint the OpenFormat NFT
     */

    function mint(address minter)
        external
        view
        virtual
        override
        onlyApprovedCaller(msg.sender)
    {
        require(
            address(requiredToken[msg.sender]) != address(0),
            "Required token not set"
        );
        require(
            requiredToken[msg.sender].balanceOf(minter) > 0,
            "You must own the required token to mint"
        );

        require(
            IERC721(msg.sender).balanceOf(minter) < maxPerWallet[msg.sender],
            "You can't own anymore tokens"
        );
    }

    /**
     * @dev this modifier checks the caller is approved to call the function.
     * @param nftAddress The address of a OpenFormat NFT
     */

    modifier onlyApprovedCaller(address nftAddress) {
        require(
            _approvedCallers[nftAddress] == IOpenFormat(nftAddress).getOwner(),
            "ME:E-001"
        );
        _;
    }
}

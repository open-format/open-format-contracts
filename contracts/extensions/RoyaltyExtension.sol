// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "../interfaces/IOpenFormat.sol";
import "../interfaces/IRoyaltyManager.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract RoyaltiesExtension is IRoyaltyManager {
    using SafeMath for uint256;
    using Address for address payable;

    address internal approvedDepositExtension;
    uint256 internal constant PERCENTAGE_SCALE = 1e4; // 10000 100%
    mapping(address => uint256) public customRoyaltyPcts;

    constructor(address approvedDepositExtension_) {
        approvedDepositExtension = approvedDepositExtension_;
    }

    function setCustomRoyaltyPct(uint256 amount_) external virtual override {
        customRoyaltyPcts[msg.sender] = amount_;
    }

    receive() external payable {
        require(customRoyaltyPcts[msg.sender] > 0, "RE:E-001");

        uint256 maxSupply = IOpenFormat(msg.sender).getMaxSupply();
        uint256 totalSupply = IOpenFormat(msg.sender).getTotalSupply();

        // Total Custom Amount / maxSupply * totalSupply();
        // e.g. msg.value = 1 ETH / customRoyaltyPct = 50% / maxSupply = 100 / totalSupply = 10;
        // 50% of 1ETH = 0.5ETH
        // 0.5ETH / 100 * 10 = 0.05ETH per NFT Holder;

        uint256 amount = uint256(msg.value)
            .mul(customRoyaltyPcts[msg.sender])
            .div(PERCENTAGE_SCALE)
            .div(maxSupply)
            .mul(totalSupply);

        // SEND FUNDS TO NFT HOLDERS
        IOpenFormat(msg.sender).deposit{value: amount}(
            approvedDepositExtension
        );

        // SEND FUNDS TO COLLABORATORS SPLITS
        payable(msg.sender).sendValue(msg.value.sub(amount));
    }
}

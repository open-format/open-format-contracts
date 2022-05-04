// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "../interfaces/IOpenFormat.sol";
import "../interfaces/IRoyaltyManager.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

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

        uint256 amount = uint256(msg.value)
            .mul(customRoyaltyPcts[msg.sender])
            .div(PERCENTAGE_SCALE);
        IOpenFormat(msg.sender).deposit{value: amount}(
            approvedDepositExtension
        );

        payable(msg.sender).sendValue(msg.value.sub(amount));
    }
}

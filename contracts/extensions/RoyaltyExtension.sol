// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "../interfaces/IOpenFormat.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract RoyaltiesExtension {
    using SafeMath for uint256;
    using Address for address payable;

    address internal approvedRoyaltyExtension;

    constructor(address approvedRoyaltyExtension_) {
        approvedRoyaltyExtension = approvedRoyaltyExtension_;
    }

    receive() external payable {
        IOpenFormat(msg.sender).deposit{value: msg.value}();
    }
}

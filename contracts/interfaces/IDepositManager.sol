// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IDepositManager {
    function calculateSplit(uint256 amount, uint256 totalSupply) external;

    function updateSplitBalance(uint256 amount, uint256 tokenId) external;

    function setApprovedCaller() external;

    function getTotalReceived(address) external view returns (uint256);

    function getSingleTokenBalance(address caller, uint256 tokenId)
        external
        view
        returns (uint256);
}

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IDepositManager {
    function calculateSplitETH(uint256 amount, uint256 totalSupply) external;

    function calculateSplitERC20(
        IERC20 token,
        uint256 amount,
        uint256 totalSupply
    ) external;

    function updateSplitBalanceETH(uint256 amount, uint256 tokenId) external;

    function updateSplitBalanceERC20(
        IERC20 token,
        uint256 amount,
        uint256 tokenId
    ) external;

    function setApprovedCaller() external;

    function getTotalReceived(address) external view returns (uint256);

    function getTotalReceived(IERC20, address) external view returns (uint256);

    function getSingleTokenBalance(address caller, uint256 tokenId)
        external
        view
        returns (uint256);

    function getSingleTokenBalance(
        IERC20,
        address caller,
        uint256 tokenId
    ) external view returns (uint256);
}

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DepositExtension {
    using SafeMath for uint256;

    mapping(address => mapping(uint256 => uint256)) public balances;
    mapping(address => mapping(IERC20 => mapping(uint256 => uint256))) erc20Balances;
    mapping(address => uint256) public totalReceived;
    mapping(address => mapping(IERC20 => uint256)) public erc20TotalReceived;
    mapping(address => bool) public _approvedCallers;

    function setApprovedCaller() public {
        _approvedCallers[msg.sender] = true;
    }

    function calculateSplitETH(
        // Amount to split
        uint256 amount,
        // Amount of NFT tokens
        uint256 totalSupply
    ) external onlyApprovedCaller {
        for (uint256 i = 0; i < totalSupply; ) {
            uint256 currentBalance = balances[msg.sender][i];
            updateSplitBalanceETH(
                currentBalance.add(amount.div(totalSupply)),
                i
            );
            unchecked {
                i++;
            }
        }
    }

    function calculateSplitERC20(
        IERC20 token,
        // Amount to split
        uint256 amount,
        // Amount of NFT tokens
        uint256 totalSupply
    ) external onlyApprovedCaller {
        for (uint256 i = 0; i < totalSupply; ) {
            uint256 currentBalance = erc20Balances[msg.sender][token][i];
            updateSplitBalanceERC20(
                token,
                currentBalance.add(amount.div(totalSupply)),
                i
            );
            unchecked {
                i++;
            }
        }
    }

    function updateSplitBalanceETH(uint256 amount, uint256 tokenId)
        public
        onlyApprovedCaller
    {
        balances[msg.sender][tokenId] = amount;
    }

    function updateSplitBalanceERC20(
        IERC20 token,
        uint256 amount,
        uint256 tokenId
    ) public onlyApprovedCaller {
        erc20Balances[msg.sender][token][tokenId] = amount;
    }

    function getTotalReceived() external view returns (uint256) {
        return totalReceived[msg.sender];
    }

    function getTotalReceived(IERC20 token) external view returns (uint256) {
        return erc20TotalReceived[msg.sender][token];
    }

    function getSingleTokenBalance(address caller, uint256 tokenId)
        external
        view
        returns (uint256)
    {
        return balances[caller][tokenId];
    }

    function getSingleTokenBalance(
        IERC20 token,
        address caller,
        uint256 tokenId
    ) external view returns (uint256) {
        return erc20Balances[caller][token][tokenId];
    }

    modifier onlyApprovedCaller() {
        require(
            _approvedCallers[msg.sender],
            "Only approved caller can call this function"
        );
        _;
    }
}

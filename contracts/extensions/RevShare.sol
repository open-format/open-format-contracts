// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract RevShare {
    using SafeMath for uint256;

    // NFT Contract Address => tokenId => amount of ETH
    mapping(address => mapping(uint256 => uint256)) public balances;
    mapping(address => uint256) public totalReceived;
    mapping(address => bool) public _approvedCallers;

    function setApprovedCaller() public {
        _approvedCallers[msg.sender] = true;
    }

    function calculateSplit(
        // Amount to split
        uint256 amount,
        // Amount of NFT tokens
        uint256 totalSupply
    ) external onlyApprovedCaller {
        for (uint256 i = 0; i < totalSupply; ) {
            uint256 currentBalance = balances[msg.sender][i];
            updateSplitBalance(currentBalance.add(amount.div(totalSupply)), i);
            unchecked {
                i++;
            }
        }
    }

    function updateSplitBalance(uint256 amount, uint256 tokenId)
        public
        onlyApprovedCaller
    {
        balances[msg.sender][tokenId] = amount;
    }

    function getTotalReceived() external view returns (uint256) {
        return totalReceived[msg.sender];
    }

    function getSingleTokenBalance(address caller, uint256 tokenId)
        external
        view
        returns (uint256)
    {
        return balances[caller][tokenId];
    }

    modifier onlyApprovedCaller() {
        require(
            _approvedCallers[msg.sender],
            "Only approved caller can call this function"
        );
        _;
    }
}

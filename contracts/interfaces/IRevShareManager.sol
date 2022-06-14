// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

interface IRevShareManager {
    function calculateSplitETH(uint256 amount, bool excludedFromSplit) external;

    function getSingleTokenBalance(address nftAddress, uint256 tokenId)
        external
        view
        returns (uint256);

    function getSingleCollaboratorBalance(
        address nftAddress,
        address collaborator
    ) external view returns (uint256);

    function updateHolderBalanceETH(uint256 amount, uint256 tokenId) external;

    function updateCollaboratorBalanceETH(uint256 amount, address collaborator)
        external;

    function setupRevShare(
        address[] calldata collaborators_,
        uint256[] calldata percentages_,
        uint256 holderPct_
    ) external;

    function allocateShares(
        address nftAddress,
        address[] calldata accounts_,
        uint256[] calldata shares_
    ) external;
}

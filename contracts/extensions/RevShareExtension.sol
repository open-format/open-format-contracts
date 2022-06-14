//SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IOpenFormat.sol";
import "../interfaces/IRevShareManager.sol";

contract RevShareExtension {
    using SafeMath for uint256;

    mapping(address => address[]) public collaborators;
    mapping(address => mapping(address => uint256)) public collaboratorBalances;
    mapping(address => mapping(address => uint256)) public collaboratorShares;

    mapping(address => mapping(uint256 => uint256)) public holdersBalances;
    mapping(address => uint256) holdersPct;

    uint256 internal constant PERCENTAGE_SCALE = 1e4; // 10000 100%

    function setupRevShare(
        address[] calldata collaborators_,
        uint256[] calldata shares_,
        uint256 holderPct_
    ) external {
        require(
            getSum(shares_).add(holderPct_) <= PERCENTAGE_SCALE,
            "RevShare: Total amount of shares + holderPct can't exceed 10000"
        );

        if (holderPct_ > 0) {
            holdersPct[msg.sender] = holderPct_;
        }

        for (uint256 i = 0; i < collaborators_.length; ) {
            collaborators[msg.sender].push(collaborators_[i]);

            collaboratorShares[msg.sender][collaborators_[i]] = shares_[i];

            unchecked {
                i++;
            }
        }
    }

    function getCollaborators(address nftAddress)
        external
        view
        returns (address[] memory)
    {
        return collaborators[nftAddress];
    }

    function getSingleCollaboratorShare(
        address nftAddress,
        address collaborator
    ) external view returns (uint256) {
        return collaboratorShares[nftAddress][collaborator];
    }

    function calculateSplitETH(uint256 amount, bool excludedFromSplit)
        external
    {
        uint256 runningTotal = 0;

        if (holdersPct[msg.sender] > 0 && !excludedFromSplit) {
            uint256 maxSupply = IOpenFormat(msg.sender).getMaxSupply();
            uint256 totalSupply = IOpenFormat(msg.sender).getTotalSupply();

            uint256 holderAmount = amount
                .mul(holdersPct[msg.sender])
                .div(PERCENTAGE_SCALE)
                .div(maxSupply);

            for (uint256 i = 0; i < totalSupply; ) {
                uint256 currentBalance = holdersBalances[msg.sender][i];
                updateHolderBalanceETH(currentBalance.add(holderAmount), i);
                runningTotal += holderAmount;

                unchecked {
                    i++;
                }
            }
        }

        for (uint256 i = 0; i < collaborators[msg.sender].length; ) {
            uint256 currentBalance = collaboratorBalances[msg.sender][
                collaborators[msg.sender][i]
            ];

            uint256 collaboratorAmount = amount
                .mul(
                    collaboratorShares[msg.sender][collaborators[msg.sender][i]]
                )
                .div(PERCENTAGE_SCALE);

            updateCollaboratorBalanceETH(
                currentBalance.add(collaboratorAmount),
                collaborators[msg.sender][i]
            );

            runningTotal += collaboratorAmount;

            unchecked {
                i++;
            }
        }

        uint256 remainingFunds = amount.sub(runningTotal);

        if (remainingFunds > 0) {
            uint256 currentBalance = collaboratorBalances[msg.sender][
                collaborators[msg.sender][0]
            ];

            updateCollaboratorBalanceETH(
                currentBalance.add(remainingFunds),
                collaborators[msg.sender][0]
            );
        }
    }

    /**
     * @dev Allocate a portion of your shares to a new or existing payee.
     * @param collaborator The address of the collaborator who is allocating funds.
     * @param accounts_ The address of the payee to add.
     * @param shares_ The number of shares owned by the payee.
     */

    function allocateShares(
        address collaborator,
        address[] calldata accounts_,
        uint256[] calldata shares_
    ) external {
        require(
            accounts_.length == shares_.length,
            "RevShare: payees and shares length mismatch"
        );
        require(accounts_.length > 0, "RevShare: no payees");
        for (uint256 i = 0; i < accounts_.length; ) {
            require(
                collaboratorShares[msg.sender][collaborator] >= shares_[i],
                "RevShare: account does not have enough shares to allocate"
            );

            collaboratorShares[msg.sender][collaborator] =
                collaboratorShares[msg.sender][collaborator] -
                shares_[i];

            _allocateShares(msg.sender, accounts_[i], shares_[i]);

            unchecked {
                i++;
            }
        }
    }

    function _allocateShares(
        address nftAddress,
        address account,
        uint256 shares_
    ) private {
        collaboratorShares[nftAddress][account] =
            collaboratorShares[nftAddress][account] +
            shares_;

        if (!addressExistsInArray(collaborators[msg.sender], account)) {
            collaborators[msg.sender].push(account);
        }
    }

    function updateHolderBalanceETH(uint256 amount, uint256 tokenId) public {
        holdersBalances[msg.sender][tokenId] = amount;
    }

    function updateCollaboratorBalanceETH(uint256 amount, address collaborator)
        public
    {
        collaboratorBalances[msg.sender][collaborator] = amount;
    }

    function getSingleTokenBalance(address nftAddress, uint256 tokenId)
        external
        view
        returns (uint256)
    {
        return holdersBalances[nftAddress][tokenId];
    }

    function getSingleCollaboratorBalance(
        address nftAddress,
        address collaborator
    ) external view returns (uint256) {
        return collaboratorBalances[nftAddress][collaborator];
    }

    function getSum(uint256[] calldata arr) private pure returns (uint256) {
        uint256 i;
        uint256 sum = 0;

        for (i = 0; i < arr.length; ) {
            sum = sum + arr[i];

            unchecked {
                i++;
            }
        }
        return sum;
    }

    function addressExistsInArray(
        address[] memory addressArray,
        address lookupAddress
    ) internal pure returns (bool) {
        for (uint256 i = 0; i < addressArray.length; ) {
            if (addressArray[i] == lookupAddress) {
                return true;
            }
            unchecked {
                i++;
            }
        }

        return false;
    }
}

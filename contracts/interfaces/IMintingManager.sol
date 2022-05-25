// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

interface IMintingManager {
    function mint(address minter) external;

    function setApprovedCaller(address owner) external;
}

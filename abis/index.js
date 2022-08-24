module.exports = {
  _format: "hh-sol-artifact-1",
  contractName: "OpenFormat",
  sourceName: "contracts/OpenFormat.sol",
  abi: [
    {
      inputs: [
        {
          internalType: "string",
          name: "name_",
          type: "string",
        },
        {
          internalType: "string",
          name: "symbol_",
          type: "string",
        },
        {
          internalType: "string",
          name: "metadataURI_",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "maxSupply_",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "mintingPrice_",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "approved",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "ApprovalForAll",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "contractAddress",
          type: "address",
        },
      ],
      name: "ApprovedDepositExtensionSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "contractAddresss",
          type: "address",
        },
      ],
      name: "ApprovedMintingExtensionSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "approvedRevShareExtension",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address[]",
          name: "collaborators",
          type: "address[]",
        },
        {
          indexed: false,
          internalType: "uint256[]",
          name: "percentages",
          type: "uint256[]",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "holderPct",
          type: "uint256",
        },
      ],
      name: "ApprovedRevShareExtensionSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "contractAddress",
          type: "address",
        },
      ],
      name: "ApprovedRoyaltyExtensionSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "collaborator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "CollaboratorBalanceWithdrawn",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "string",
          name: "commissionType",
          type: "string",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "CommissionPaid",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "creator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "metadataURI",
          type: "string",
        },
        {
          indexed: false,
          internalType: "string",
          name: "symbol",
          type: "string",
        },
        {
          indexed: false,
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "maxSupply",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "mintingPrice",
          type: "uint256",
        },
      ],
      name: "Created",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "contract IERC20",
          name: "token",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "ERC20TokenBalanceWithdrawn",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "contract IERC20",
          name: "token",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "ERC20TotalDepositedAmountUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "MaxSupplySet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "newTokenId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "Minted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "MintingPriceSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "bool",
          name: "isPaused",
          type: "bool",
        },
      ],
      name: "PausedStateSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "sender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "PaymentReceived",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "PrimaryCommissionSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "receiver",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "percentage",
          type: "uint256",
        },
      ],
      name: "RoyaltiesSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "recipient",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "RoyaltyPaid",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "salePrice",
          type: "uint256",
        },
      ],
      name: "SalePriceSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "SecondaryCommissionSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "bool",
          name: "state",
          type: "bool",
        },
      ],
      name: "ShareIncomeWithHoldersSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address[]",
          name: "accounts",
          type: "address[]",
        },
        {
          indexed: false,
          internalType: "uint256[]",
          name: "shares",
          type: "uint256[]",
        },
      ],
      name: "SharesAllocated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "oldOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "salePrice",
          type: "uint256",
        },
      ],
      name: "Sold",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "TokenBalanceWithdrawn",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "TotalDepositedAmountUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address[]",
          name: "accounts_",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "shares_",
          type: "uint256[]",
        },
      ],
      name: "allocateShares",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "approvedMintingExtension",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "approvedRevShareExtension",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "burn",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "commissionAddress",
          type: "address",
        },
      ],
      name: "buy",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "buy",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bool",
          name: "excludedFromSplit",
          type: "bool",
        },
      ],
      name: "calculateRevShares",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "creatorOf",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "getApproved",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getMaxSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getOwner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getPrimaryCommissionPct",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getSecondaryCommissionPct",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "collaborator",
          type: "address",
        },
      ],
      name: "getSingleCollaboratorBalance",
      outputs: [
        {
          internalType: "uint256",
          name: "tokenBalance",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "getSingleTokenBalance",
      outputs: [
        {
          internalType: "uint256",
          name: "tokenBalance",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "getTokenSalePrice",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getTotalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
      ],
      name: "isApprovedForAll",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "metadataURI",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "mint",
      outputs: [
        {
          internalType: "uint256",
          name: "newTokenId",
          type: "uint256",
        },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "commissionAddress",
          type: "address",
        },
      ],
      name: "mint",
      outputs: [
        {
          internalType: "uint256",
          name: "newTokenId",
          type: "uint256",
        },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "mintingPrice",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ownerOf",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "paused",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "primaryCommissionPct",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "royaltyInfo",
      outputs: [
        {
          internalType: "address",
          name: "receiver",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "royaltyAmount",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "_data",
          type: "bytes",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "secondaryCommissionPct",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "contractAddress",
          type: "address",
        },
      ],
      name: "setApprovedMintingExtension",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "contractAddress",
          type: "address",
        },
        {
          internalType: "address[]",
          name: "collaborators",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "shares",
          type: "uint256[]",
        },
        {
          internalType: "uint256",
          name: "holderPct",
          type: "uint256",
        },
      ],
      name: "setApprovedRevShareExtension",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "setMaxSupply",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "setMintingPrice",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "setPrimaryCommissionPct",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "royaltyReceiver",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "royaltiesPct",
          type: "uint256",
        },
      ],
      name: "setRoyalties",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "setSecondaryCommissionPct",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "salePrice",
          type: "uint256",
        },
      ],
      name: "setTokenSalePrice",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4",
        },
      ],
      name: "supportsInterface",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "togglePausedState",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "index",
          type: "uint256",
        },
      ],
      name: "tokenByIndex",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "index",
          type: "uint256",
        },
      ],
      name: "tokenOfOwnerByIndex",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "tokenURI",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "withdraw",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "collaborator",
          type: "address",
        },
      ],
      name: "withdraw",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      stateMutability: "payable",
      type: "receive",
    },
  ],
  bytecode:
    "0x60806040523480156200001157600080fd5b50604051620041f5380380620041f583398101604081905262000034916200027a565b8451859085906200004d90600090602085019062000145565b5080516200006390600190602084019062000145565b505050620000806200007a620000ef60201b60201c565b620000f3565b82516200009590601690602086019062000145565b506011829055601281905560405133907fc1d48f1736a531302a78b74590d0777fc17b24d24429d1e262591b9c4a10e55890620000dc90869088908a908890889062000348565b60405180910390a2505050505062000422565b3390565b600c80546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b8280546200015390620003cf565b90600052602060002090601f016020900481019282620001775760008555620001c2565b82601f106200019257805160ff1916838001178555620001c2565b82800160010185558215620001c2579182015b82811115620001c2578251825591602001919060010190620001a5565b50620001d0929150620001d4565b5090565b5b80821115620001d05760008155600101620001d5565b600082601f830112620001fc578081fd5b81516001600160401b03808211156200021957620002196200040c565b604051601f8301601f19908116603f011681019082821181831017156200024457620002446200040c565b816040528381528660208588010111156200025d578485fd5b620002708460208301602089016200039c565b9695505050505050565b600080600080600060a0868803121562000292578081fd5b85516001600160401b0380821115620002a9578283fd5b620002b789838a01620001eb565b96506020880151915080821115620002cd578283fd5b620002db89838a01620001eb565b95506040880151915080821115620002f1578283fd5b506200030088828901620001eb565b606088015160809098015196999598509695949350505050565b60008151808452620003348160208601602086016200039c565b601f01601f19169290920160200192915050565b60a0815260006200035d60a08301886200031a565b82810360208401526200037181886200031a565b905082810360408401526200038781876200031a565b60608401959095525050608001529392505050565b60005b83811015620003b95781810151838201526020016200039f565b83811115620003c9576000848401525b50505050565b600181811c90821680620003e457607f821691505b602082108114156200040657634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b613dc380620004326000396000f3fe6080604052600436106103395760003560e01c80636a627842116101ab5780639cd56df7116100f7578063c87b56dd11610095578063e985e9c51161006f578063e985e9c514610993578063edd0c44f146109dc578063f2fde38b146109fc578063fdf8967314610a1c57600080fd5b8063c87b56dd1461094b578063d684beff1461096b578063d96a094a1461098057600080fd5b8063b88d4fde116100d1578063b88d4fde146108e3578063bea38b3a14610903578063c20cbb5014610923578063c4e41b221461093657600080fd5b80639cd56df714610883578063a22cb465146108a3578063a2606334146108c357600080fd5b8063814a76fe11610164578063893d20e81161013e578063893d20e81461081b5780638c7ea24b146108305780638da5cb5b1461085057806395d89b411461086e57600080fd5b8063814a76fe146107c65780638417b47f146107e65780638859e91f1461080657600080fd5b80636a6278421461072b5780636f8b44b01461073e57806370a082311461075e578063715018a61461077e5780637a2ad1a6146107935780637deb6025146107b357600080fd5b80632e1a7d4d116102855780634f6ccce71161022357806359aa03aa116101fd57806359aa03aa146106bb5780635c975abb146106db57806363167ced146106f55780636352211e1461070b57600080fd5b80634f6ccce71461065257806351cff8d914610672578063589a17431461068557600080fd5b806342842e0e1161025f57806342842e0e146105e757806342966c681461060757806347d91e03146106275780634c0f38c21461063d57600080fd5b80632e1a7d4d1461059e5780632f745c59146105b157806335db70b5146105d157600080fd5b80631249c58b116102f257806318fbcdb3116102cc57806318fbcdb31461050a57806323b872dd1461051f57806327ec10a91461053f5780632a55205a1461055f57600080fd5b80631249c58b146104c057806318160ddd146104c857806318eef395146104dd57600080fd5b806301ffc9a7146103cc57806303ee438c1461040157806306fdde0314610423578063081812fc14610438578063095ea7b314610470578063116688641461049257600080fd5b366103c757600f546001600160a01b03161561035e576103596000610a3c565b610383565b61038334610374600c546001600160a01b031690565b6001600160a01b031690610b00565b7f6ef95f06320e7a25a04a175ca677b7052bdd97131872c2192525a629f51be77033604080516001600160a01b0390921682523460208301520160405180910390a1005b600080fd5b3480156103d857600080fd5b506103ec6103e7366004613895565b610c1e565b60405190151581526020015b60405180910390f35b34801561040d57600080fd5b50610416610c2f565b6040516103f89190613b42565b34801561042f57600080fd5b50610416610cbd565b34801561044457600080fd5b506104586104533660046138cd565b610d4f565b6040516001600160a01b0390911681526020016103f8565b34801561047c57600080fd5b5061049061048b3660046137ba565b610de4565b005b34801561049e57600080fd5b506104b26104ad3660046138cd565b610ef5565b6040519081526020016103f8565b6104b2610fad565b3480156104d457600080fd5b506009546104b2565b3480156104e957600080fd5b506104b26104f83660046138cd565b6000908152600e602052604090205490565b34801561051657600080fd5b506014546104b2565b34801561052b57600080fd5b5061049061053a3660046135e5565b611159565b34801561054b57600080fd5b5061049061055a366004613591565b61118b565b34801561056b57600080fd5b5061057f61057a366004613921565b61127f565b604080516001600160a01b0390931683526020830191909152016103f8565b6104b26105ac3660046138cd565b6112d4565b3480156105bd57600080fd5b506104b26105cc3660046137ba565b6114a3565b3480156105dd57600080fd5b506104b260125481565b3480156105f357600080fd5b506104906106023660046135e5565b611539565b34801561061357600080fd5b506104906106223660046138cd565b611554565b34801561063357600080fd5b506104b260145481565b34801561064957600080fd5b506011546104b2565b34801561065e57600080fd5b506104b261066d3660046138cd565b6115aa565b6104b2610680366004613591565b61164b565b34801561069157600080fd5b506104586106a03660046138cd565b6000908152600d60205260409020546001600160a01b031690565b3480156106c757600080fd5b506104906106d6366004613812565b6117f9565b3480156106e757600080fd5b506015546103ec9060ff1681565b34801561070157600080fd5b506104b260135481565b34801561071757600080fd5b506104586107263660046138cd565b6118ce565b6104b2610739366004613591565b611945565b34801561074a57600080fd5b506104906107593660046138cd565b611b83565b34801561076a57600080fd5b506104b2610779366004613591565b611be0565b34801561078a57600080fd5b50610490611c67565b34801561079f57600080fd5b50601054610458906001600160a01b031681565b6103ec6107c13660046138fd565b611c9d565b3480156107d257600080fd5b506104906107e1366004613921565b611dbd565b3480156107f257600080fd5b506104906108013660046138cd565b611e10565b34801561081257600080fd5b506013546104b2565b34801561082757600080fd5b50610458611e6d565b34801561083c57600080fd5b5061049061084b3660046137ba565b611e86565b34801561085c57600080fd5b50600c546001600160a01b0316610458565b34801561087a57600080fd5b50610416611f70565b34801561088f57600080fd5b50600f54610458906001600160a01b031681565b3480156108af57600080fd5b506104906108be366004613786565b611f7f565b3480156108cf57600080fd5b506104906108de3660046138cd565b611f8a565b3480156108ef57600080fd5b506104906108fe366004613625565b612024565b34801561090f57600080fd5b506104b261091e366004613591565b61205c565b61049061093136600461387b565b610a3c565b34801561094257600080fd5b506104b26120c0565b34801561095757600080fd5b506104166109663660046138cd565b6120cb565b34801561097757600080fd5b506104906121dc565b6103ec61098e3660046138cd565b612252565b34801561099f57600080fd5b506103ec6109ae3660046135ad565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b3480156109e857600080fd5b506104906109f73660046136fe565b612282565b348015610a0857600080fd5b50610490610a17366004613591565b61237c565b348015610a2857600080fd5b50610490610a373660046138cd565b612417565b600f546001600160a01b0316610a6d5760405162461bcd60e51b8152600401610a6490613c71565b60405180910390fd5b600f54604051631ab16f5960e11b815234600482015282151560248201526001600160a01b0390911690633562deb290604401600060405180830381600087803b158015610aba57600080fd5b505af1158015610ace573d6000803e3d6000fd5b50506040513492507f3903d05344bfbe173a5084aa4d3a99187eff3f7bfb3db786c814e7eddd9b3cd59150600090a250565b80471015610b505760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a20696e73756666696369656e742062616c616e63650000006044820152606401610a64565b6000826001600160a01b03168260405160006040518083038185875af1925050503d8060008114610b9d576040519150601f19603f3d011682016040523d82523d6000602084013e610ba2565b606091505b5050905080610c195760405162461bcd60e51b815260206004820152603a60248201527f416464726573733a20756e61626c6520746f2073656e642076616c75652c207260448201527f6563697069656e74206d617920686176652072657665727465640000000000006064820152608401610a64565b505050565b6000610c29826124b1565b92915050565b60168054610c3c90613d01565b80601f0160208091040260200160405190810160405280929190818152602001828054610c6890613d01565b8015610cb55780601f10610c8a57610100808354040283529160200191610cb5565b820191906000526020600020905b815481529060010190602001808311610c9857829003601f168201915b505050505081565b606060008054610ccc90613d01565b80601f0160208091040260200160405190810160405280929190818152602001828054610cf890613d01565b8015610d455780601f10610d1a57610100808354040283529160200191610d45565b820191906000526020600020905b815481529060010190602001808311610d2857829003601f168201915b5050505050905090565b6000818152600260205260408120546001600160a01b0316610dc85760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610a64565b506000908152600460205260409020546001600160a01b031690565b6000610def826118ce565b9050806001600160a01b0316836001600160a01b03161415610e5d5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610a64565b336001600160a01b0382161480610e795750610e7981336109ae565b610eeb5760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c00000000000000006064820152608401610a64565b610c1983836124d6565b600f546000906001600160a01b0316610f205760405162461bcd60e51b8152600401610a6490613c71565b600f546040516321c754a560e11b8152306004820152602481018490526000916001600160a01b03169063438ea94a906044015b60206040518083038186803b158015610f6c57600080fd5b505afa158015610f80573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610fa491906138e5565b9150505b919050565b60155460009060ff1615610fd35760405162461bcd60e51b8152600401610a6490613ba7565b6012543410156110105760405162461bcd60e51b81526020600482015260086024820152674f463a452d30303160c01b6044820152606401610a64565b6011546009541061104e5760405162461bcd60e51b815260206004820152600860248201526727a31d229698189960c11b6044820152606401610a64565b6010546001600160a01b0316156110bd576010546040516335313c2160e11b81523360048201526001600160a01b0390911690636a62784290602401600060405180830381600087803b1580156110a457600080fd5b505af11580156110b8573d6000803e3d6000fd5b505050505b6110c5612544565b600f549091506001600160a01b03161561114057600f54604051631ab16f5960e11b8152346004820152600160248201526001600160a01b0390911690633562deb290604401600060405180830381600087803b15801561112557600080fd5b505af1158015611139573d6000803e3d6000fd5b5050505090565b61115634610374600c546001600160a01b031690565b90565b611164335b8261264f565b6111805760405162461bcd60e51b8152600401610a6490613c20565b610c19838383612746565b600c546001600160a01b031633146111b55760405162461bcd60e51b8152600401610a6490613beb565b601080546001600160a01b0383166001600160a01b031990911681179091556368a540c76111eb600c546001600160a01b031690565b6040516001600160e01b031960e084901b1681526001600160a01b039091166004820152602401600060405180830381600087803b15801561122c57600080fd5b505af1158015611240573d6000803e3d6000fd5b50506010546040516001600160a01b0390911692507f1e22c56232a0d367cb86087b57c1fc49b4bdcff57db9930fd4bda0d0d2ad15b99150600090a250565b60408051808201909152600b546001600160a01b038116808352600160a01b90910462ffffff16602083018190529091600091612710906112c09086613ccb565b6112ca9190613cab565b9150509250929050565b6000816112e03361115e565b6112fc5760405162461bcd60e51b8152600401610a6490613bc9565b600f546001600160a01b03166113245760405162461bcd60e51b8152600401610a6490613c71565b600061132f846118ce565b600f546040516321c754a560e11b8152306004820152602481018790529192506000916001600160a01b039091169063438ea94a9060440160206040518083038186803b15801561137f57600080fd5b505afa158015611393573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113b791906138e5565b9050600081116113f45760405162461bcd60e51b81526020600482015260086024820152674f463a452d30313160c01b6044820152606401610a64565b6114076001600160a01b03831682610b00565b600f54604051634d9ae53160e11b815260006004820152602481018790526001600160a01b0390911690639b35ca6290604401600060405180830381600087803b15801561145457600080fd5b505af1158015611468573d6000803e3d6000fd5b50506040518392508791507fd2e9df57c00b23ba7ee3ed404df528700b0f0990b7292602d48fb3b9764e507690600090a39250505b50919050565b60006114ae83611be0565b82106115105760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201526a74206f6620626f756e647360a81b6064820152608401610a64565b506001600160a01b03919091166000908152600760209081526040808320938352929052205490565b610c1983838360405180602001604052806000815250612024565b8061155e3361115e565b61157a5760405162461bcd60e51b8152600401610a6490613bc9565b60155460ff161561159d5760405162461bcd60e51b8152600401610a6490613ba7565b6115a6826128f1565b5050565b60006115b560095490565b82106116185760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201526b7574206f6620626f756e647360a01b6064820152608401610a64565b6009828154811061163957634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050919050565b600f546000906001600160a01b03166116765760405162461bcd60e51b8152600401610a6490613c71565b600f54604051635fbb1c3160e01b81523060048201526001600160a01b0384811660248301526000921690635fbb1c319060440160206040518083038186803b1580156116c257600080fd5b505afa1580156116d6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906116fa91906138e5565b9050600081116117375760405162461bcd60e51b81526020600482015260086024820152674f463a452d30313160c01b6044820152606401610a64565b61174a6001600160a01b03841682610b00565b600f5460405163c16243c960e01b8152600060048201526001600160a01b0385811660248301529091169063c16243c990604401600060405180830381600087803b15801561179857600080fd5b505af11580156117ac573d6000803e3d6000fd5b5050604080516001600160a01b0387168152602081018590527fba347b3845385dc3000e48c0bd524930cecda649991c5efdefe1ee9a33a6dbeb935001905060405180910390a192915050565b600f546001600160a01b03166118215760405162461bcd60e51b8152600401610a6490613c71565b600f54604051639c8219b760e01b81526001600160a01b0390911690639c8219b7906118599033908890889088908890600401613a46565b600060405180830381600087803b15801561187357600080fd5b505af1158015611887573d6000803e3d6000fd5b505050507f9a453ad60f0e55d9836e14139af1a81069f3252da7d07013308769211aff35ca848484846040516118c09493929190613ad6565b60405180910390a150505050565b6000818152600260205260408120546001600160a01b031680610c295760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610a64565b60155460009060ff161561196b5760405162461bcd60e51b8152600401610a6490613ba7565b6012543410156119a85760405162461bcd60e51b81526020600482015260086024820152674f463a452d30303160c01b6044820152606401610a64565b601154600954106119e65760405162461bcd60e51b815260206004820152600860248201526727a31d229698189960c11b6044820152606401610a64565b60135415611a795760006119fc601354346128fa565b9050611a116001600160a01b03841682610b00565b604051667072696d61727960c81b81526001600160a01b0384169060070160405180910390207f522c39d7156b7dd9419c7853d069ac52655fb23c5ec017f319477ad7bef213aa611a6160095490565b604080519182523460208301520160405180910390a3505b6010546001600160a01b031615611ae8576010546040516335313c2160e11b81523360048201526001600160a01b0390911690636a62784290602401600060405180830381600087803b158015611acf57600080fd5b505af1158015611ae3573d6000803e3d6000fd5b505050505b611af0612544565b600f549091506001600160a01b031615611b6d57600f54604051631ab16f5960e11b8152346004820152600160248201526001600160a01b0390911690633562deb290604401600060405180830381600087803b158015611b5057600080fd5b505af1158015611b64573d6000803e3d6000fd5b50505050919050565b610fa834610374600c546001600160a01b031690565b600c546001600160a01b03163314611bad5760405162461bcd60e51b8152600401610a6490613beb565b601181905560405181907facc639f1ff310faf48650d02a82bd24c924e45a5050fc931245096ac57c309d990600090a250565b60006001600160a01b038216611c4b5760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401610a64565b506001600160a01b031660009081526003602052604090205490565b600c546001600160a01b03163314611c915760405162461bcd60e51b8152600401610a6490613beb565b611c9b6000612919565b565b60155460009060ff1615611cc35760405162461bcd60e51b8152600401610a6490613ba7565b6001600160a01b038216611d045760405162461bcd60e51b815260206004820152600860248201526727a31d229698181960c11b6044820152606401610a64565b6000838152600e6020526040812054601454909190611d2390836128fa565b60145490915015611da157611d416001600160a01b03851682610b00565b604051687365636f6e6461727960b81b81526001600160a01b0385169060090160408051918290038220888352346020840152917f522c39d7156b7dd9419c7853d069ac52655fb23c5ec017f319477ad7bef213aa910160405180910390a35b611db485611daf348461296b565b612977565b95945050505050565b60155460ff1615611de05760405162461bcd60e51b8152600401610a6490613ba7565b81611dea3361115e565b611e065760405162461bcd60e51b8152600401610a6490613bc9565b610c198383612b67565b600c546001600160a01b03163314611e3a5760405162461bcd60e51b8152600401610a6490613beb565b601281905560405181907f02dd4e125a287edc7a6a887552dc7be35f4fdabe8afd6ae78f98b448d4e1a86690600090a250565b6000611e81600c546001600160a01b031690565b905090565b600c546001600160a01b03163314611eb05760405162461bcd60e51b8152600401610a6490613beb565b60008111611eeb5760405162461bcd60e51b815260206004820152600860248201526713d18e914b4c0c0d60c21b6044820152606401610a64565b6001600160a01b038216611f2c5760405162461bcd60e51b81526020600482015260086024820152674f463a452d30303560c01b6044820152606401610a64565b611f368282612bb8565b60405181906001600160a01b038416907f908669f35f6fb3977a956ba70597841fe541d1e8491ca3c025161e258d3bfdb690600090a35050565b606060018054610ccc90613d01565b6115a6338383612c54565b600c546001600160a01b03163314611fb45760405162461bcd60e51b8152600401610a6490613beb565b612710811115611ff15760405162461bcd60e51b815260206004820152600860248201526727a31d229698181b60c11b6044820152606401610a64565b601481905560405181907f905c2604b04c9fa2b09e05ab34ccae93abf21f5edd19a139c406fe9398f752a090600090a250565b61202e338361264f565b61204a5760405162461bcd60e51b8152600401610a6490613c20565b61205684848484612d23565b50505050565b600f546000906001600160a01b03166120875760405162461bcd60e51b8152600401610a6490613c71565b600f54604051635fbb1c3160e01b81523060048201526001600160a01b0384811660248301526000921690635fbb1c3190604401610f54565b6000611e8160095490565b6000818152600260205260409020546060906001600160a01b031661214a5760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b6064820152608401610a64565b6016805461215790613d01565b80601f016020809104026020016040519081016040528092919081815260200182805461218390613d01565b80156121d05780601f106121a5576101008083540402835291602001916121d0565b820191906000526020600020905b8154815290600101906020018083116121b357829003601f168201915b50505050509050919050565b600c546001600160a01b031633146122065760405162461bcd60e51b8152600401610a6490613beb565b6015805460ff8082161560ff19909216821790925560405191161581527fa9bfed3d98385b3777389e321dbde773cf7d335fa604fefbae3dca93564f55869060200160405180910390a1565b60155460009060ff16156122785760405162461bcd60e51b8152600401610a6490613ba7565b610c298234612977565b600c546001600160a01b031633146122ac5760405162461bcd60e51b8152600401610a6490613beb565b600f80546001600160a01b0319166001600160a01b038816908117909155604051639987f61b60e01b8152639987f61b906122f39088908890889088908890600401613b08565b600060405180830381600087803b15801561230d57600080fd5b505af1158015612321573d6000803e3d6000fd5b5050600f546040517fe7777c62b331e30e218564c936029d29f53e1b3c48775f4a3f4413e301f9a25f935061236c92506001600160a01b039091169088908890889088908890613a8a565b60405180910390a1505050505050565b600c546001600160a01b031633146123a65760405162461bcd60e51b8152600401610a6490613beb565b6001600160a01b03811661240b5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610a64565b61241481612919565b50565b600c546001600160a01b031633146124415760405162461bcd60e51b8152600401610a6490613beb565b61271081111561247e5760405162461bcd60e51b815260206004820152600860248201526727a31d229698181b60c11b6044820152606401610a64565b601381905560405181907fb27a19d53c022a09a344f42378e7d232d66b643564218cbfc93c98c93a2bc7af90600090a250565b60006001600160e01b0319821663780e9d6360e01b1480610c295750610c2982612d56565b600081815260046020526040902080546001600160a01b0319166001600160a01b038416908117909155819061250b826118ce565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b600061254f60095490565b905061256b338260405180602001604052806000815250612da6565b6000818152600d6020526040902080546001600160a01b031916331790556016805461261f91839161259c90613d01565b80601f01602080910402602001604051908101604052809291908181526020018280546125c890613d01565b80156126155780601f106125ea57610100808354040283529160200191612615565b820191906000526020600020905b8154815290600101906020018083116125f857829003601f168201915b5050505050612dd9565b604051339082907fb9203d657e9c0ec8274c818292ab0f58b04e1970050716891770eb1bab5d655e90600090a390565b6000818152600260205260408120546001600160a01b03166126c85760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610a64565b60006126d3836118ce565b9050806001600160a01b0316846001600160a01b0316148061270e5750836001600160a01b031661270384610d4f565b6001600160a01b0316145b8061273e57506001600160a01b0380821660009081526005602090815260408083209388168352929052205460ff165b949350505050565b826001600160a01b0316612759826118ce565b6001600160a01b0316146127c15760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b6064820152608401610a64565b6001600160a01b0382166128235760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610a64565b61282e838383612e73565b6128396000826124d6565b6001600160a01b0383166000908152600360205260408120805460019290612862908490613cea565b90915550506001600160a01b0382166000908152600360205260408120805460019290612890908490613c93565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b61241481612e7e565b600061291261271061290c8486612ebe565b90612eca565b9392505050565b600c80546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b60006129128284613cea565b6000828152600e6020526040812054806129be5760405162461bcd60e51b81526020600482015260086024820152674f463a452d30303760c01b6044820152606401610a64565b808310156129f95760405162461bcd60e51b815260206004820152600860248201526709e8c748a5a6060760c31b6044820152606401610a64565b6000612a04856118ce565b905060003360405163152a902d60e11b81526000600482018190526024820186905291925081903090632a55205a90604401604080518083038186803b158015612a4d57600080fd5b505afa158015612a61573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612a8591906137e5565b90925090508015612ada57612aa36001600160a01b03831682610b00565b60405181906001600160a01b038416907fbc86de696edc3350c664d50abf25f24e7e1251f1469ad925b25fe36927270d4390600090a35b612af7612ae7868361296b565b6001600160a01b03861690610b00565b826001600160a01b0316846001600160a01b0316897f23f50d55776d8003622a982ade45a6c7f083116c8dbbcd980f59942f440badb188604051612b3d91815260200190565b60405180910390a4612b4e85612ed6565b612b5984848a612746565b506001979650505050505050565b6000828152600e6020526040908190208290555182907fe23ea816dce6d7f5c0b85cbd597e7c3b97b2453791152c0b94e5e5c5f314d2f090612bac9084815260200190565b60405180910390a25050565b612710811115612c0a5760405162461bcd60e51b815260206004820152601a60248201527f45524332393831526f79616c746965733a20546f6f20686967680000000000006044820152606401610a64565b604080518082019091526001600160a01b0390921680835262ffffff9091166020909201829052600b8054600160a01b9093026001600160b81b0319909316909117919091179055565b816001600160a01b0316836001600160a01b03161415612cb65760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610a64565b6001600160a01b03838116600081815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b612d2e848484612746565b612d3a84848484612ef4565b6120565760405162461bcd60e51b8152600401610a6490613b55565b60006001600160e01b031982166380ac58cd60e01b1480612d8757506001600160e01b03198216635b5e139f60e01b145b80610c2957506301ffc9a760e01b6001600160e01b0319831614610c29565b612db08383613001565b612dbd6000848484612ef4565b610c195760405162461bcd60e51b8152600401610a6490613b55565b6000828152600260205260409020546001600160a01b0316612e545760405162461bcd60e51b815260206004820152602e60248201527f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60448201526d32bc34b9ba32b73a103a37b5b2b760911b6064820152608401610a64565b60008281526006602090815260409091208251610c1992840190613468565b610c1983838361314f565b612e8781613207565b60008181526006602052604090208054612ea090613d01565b159050612414576000818152600660205260408120612414916134ec565b60006129128284613ccb565b60006129128284613cab565b6000612ee2348361296b565b905080156115a6576115a68133610374565b60006001600160a01b0384163b15612ff657604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290612f38903390899088908890600401613a09565b602060405180830381600087803b158015612f5257600080fd5b505af1925050508015612f82575060408051601f3d908101601f19168201909252612f7f918101906138b1565b60015b612fdc573d808015612fb0576040519150601f19603f3d011682016040523d82523d6000602084013e612fb5565b606091505b508051612fd45760405162461bcd60e51b8152600401610a6490613b55565b805181602001fd5b6001600160e01b031916630a85bd0160e11b14905061273e565b506001949350505050565b6001600160a01b0382166130575760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610a64565b6000818152600260205260409020546001600160a01b0316156130bc5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610a64565b6130c860008383612e73565b6001600160a01b03821660009081526003602052604081208054600192906130f1908490613c93565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b6001600160a01b0383166131aa576131a581600980546000838152600a60205260408120829055600182018355919091527f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7af0155565b6131cd565b816001600160a01b0316836001600160a01b0316146131cd576131cd83826132ae565b6001600160a01b0382166131e457610c198161334b565b826001600160a01b0316826001600160a01b031614610c1957610c198282613424565b6000613212826118ce565b905061322081600084612e73565b61322b6000836124d6565b6001600160a01b0381166000908152600360205260408120805460019290613254908490613cea565b909155505060008281526002602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b600060016132bb84611be0565b6132c59190613cea565b600083815260086020526040902054909150808214613318576001600160a01b03841660009081526007602090815260408083208584528252808320548484528184208190558352600890915290208190555b5060009182526008602090815260408084208490556001600160a01b039094168352600781528383209183525290812055565b60095460009061335d90600190613cea565b6000838152600a60205260408120546009805493945090928490811061339357634e487b7160e01b600052603260045260246000fd5b9060005260206000200154905080600983815481106133c257634e487b7160e01b600052603260045260246000fd5b6000918252602080832090910192909255828152600a9091526040808220849055858252812055600980548061340857634e487b7160e01b600052603160045260246000fd5b6001900381819060005260206000200160009055905550505050565b600061342f83611be0565b6001600160a01b039093166000908152600760209081526040808320868452825280832085905593825260089052919091209190915550565b82805461347490613d01565b90600052602060002090601f01602090048101928261349657600085556134dc565b82601f106134af57805160ff19168380011785556134dc565b828001600101855582156134dc579182015b828111156134dc5782518255916020019190600101906134c1565b506134e8929150613522565b5090565b5080546134f890613d01565b6000825580601f10613508575050565b601f01602090049060005260206000209081019061241491905b5b808211156134e85760008155600101613523565b60008083601f840112613548578081fd5b50813567ffffffffffffffff81111561355f578182fd5b6020830191508360208260051b850101111561357a57600080fd5b9250929050565b80358015158114610fa857600080fd5b6000602082840312156135a2578081fd5b813561291281613d62565b600080604083850312156135bf578081fd5b82356135ca81613d62565b915060208301356135da81613d62565b809150509250929050565b6000806000606084860312156135f9578081fd5b833561360481613d62565b9250602084013561361481613d62565b929592945050506040919091013590565b6000806000806080858703121561363a578081fd5b843561364581613d62565b9350602085013561365581613d62565b925060408501359150606085013567ffffffffffffffff80821115613678578283fd5b818701915087601f83011261368b578283fd5b81358181111561369d5761369d613d4c565b604051601f8201601f19908116603f011681019083821181831017156136c5576136c5613d4c565b816040528281528a60208487010111156136dd578586fd5b82602086016020830137918201602001949094529598949750929550505050565b60008060008060008060808789031215613716578182fd5b863561372181613d62565b9550602087013567ffffffffffffffff8082111561373d578384fd5b6137498a838b01613537565b90975095506040890135915080821115613761578384fd5b5061376e89828a01613537565b979a9699509497949695606090950135949350505050565b60008060408385031215613798578182fd5b82356137a381613d62565b91506137b160208401613581565b90509250929050565b600080604083850312156137cc578182fd5b82356137d781613d62565b946020939093013593505050565b600080604083850312156137f7578182fd5b825161380281613d62565b6020939093015192949293505050565b60008060008060408587031215613827578384fd5b843567ffffffffffffffff8082111561383e578586fd5b61384a88838901613537565b90965094506020870135915080821115613862578384fd5b5061386f87828801613537565b95989497509550505050565b60006020828403121561388c578081fd5b61291282613581565b6000602082840312156138a6578081fd5b813561291281613d77565b6000602082840312156138c2578081fd5b815161291281613d77565b6000602082840312156138de578081fd5b5035919050565b6000602082840312156138f6578081fd5b5051919050565b6000806040838503121561390f578182fd5b8235915060208301356135da81613d62565b60008060408385031215613933578182fd5b50508035926020909101359150565b81835260006020808501945082825b8581101561397f57813561396481613d62565b6001600160a01b031687529582019590820190600101613951565b509495945050505050565b81835260006001600160fb1b038311156139a2578081fd5b8260051b80836020870137939093016020019283525090919050565b60008151808452815b818110156139e3576020818501810151868301820152016139c7565b818111156139f45782602083870101525b50601f01601f19169290920160200192915050565b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090613a3c908301846139be565b9695505050505050565b6001600160a01b0386168152606060208201819052600090613a6b9083018688613942565b8281036040840152613a7e81858761398a565b98975050505050505050565b6001600160a01b0387168152608060208201819052600090613aaf9083018789613942565b8281036040840152613ac281868861398a565b915050826060830152979650505050505050565b604081526000613aea604083018688613942565b8281036020840152613afd81858761398a565b979650505050505050565b606081526000613b1c606083018789613942565b8281036020840152613b2f81868861398a565b9150508260408301529695505050505050565b60208152600061291260208301846139be565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b6020808252600890820152674f463a452d30303960c01b604082015260600190565b60208082526008908201526704f463a452d3031360c41b604082015260600190565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b60208082526031908201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f6040820152701ddb995c881b9bdc88185c1c1c9bdd9959607a1b606082015260800190565b6020808252600890820152674f463a452d30303360c01b604082015260600190565b60008219821115613ca657613ca6613d36565b500190565b600082613cc657634e487b7160e01b81526012600452602481fd5b500490565b6000816000190483118215151615613ce557613ce5613d36565b500290565b600082821015613cfc57613cfc613d36565b500390565b600181811c90821680613d1557607f821691505b6020821081141561149d57634e487b7160e01b600052602260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160a01b038116811461241457600080fd5b6001600160e01b03198116811461241457600080fdfea2646970667358221220eab7c8710dcceef1c19a8329fa4810b58c62ef80744f7fc9bb0f94f23760c3e864736f6c63430008040033",
  deployedBytecode:
    "0x6080604052600436106103395760003560e01c80636a627842116101ab5780639cd56df7116100f7578063c87b56dd11610095578063e985e9c51161006f578063e985e9c514610993578063edd0c44f146109dc578063f2fde38b146109fc578063fdf8967314610a1c57600080fd5b8063c87b56dd1461094b578063d684beff1461096b578063d96a094a1461098057600080fd5b8063b88d4fde116100d1578063b88d4fde146108e3578063bea38b3a14610903578063c20cbb5014610923578063c4e41b221461093657600080fd5b80639cd56df714610883578063a22cb465146108a3578063a2606334146108c357600080fd5b8063814a76fe11610164578063893d20e81161013e578063893d20e81461081b5780638c7ea24b146108305780638da5cb5b1461085057806395d89b411461086e57600080fd5b8063814a76fe146107c65780638417b47f146107e65780638859e91f1461080657600080fd5b80636a6278421461072b5780636f8b44b01461073e57806370a082311461075e578063715018a61461077e5780637a2ad1a6146107935780637deb6025146107b357600080fd5b80632e1a7d4d116102855780634f6ccce71161022357806359aa03aa116101fd57806359aa03aa146106bb5780635c975abb146106db57806363167ced146106f55780636352211e1461070b57600080fd5b80634f6ccce71461065257806351cff8d914610672578063589a17431461068557600080fd5b806342842e0e1161025f57806342842e0e146105e757806342966c681461060757806347d91e03146106275780634c0f38c21461063d57600080fd5b80632e1a7d4d1461059e5780632f745c59146105b157806335db70b5146105d157600080fd5b80631249c58b116102f257806318fbcdb3116102cc57806318fbcdb31461050a57806323b872dd1461051f57806327ec10a91461053f5780632a55205a1461055f57600080fd5b80631249c58b146104c057806318160ddd146104c857806318eef395146104dd57600080fd5b806301ffc9a7146103cc57806303ee438c1461040157806306fdde0314610423578063081812fc14610438578063095ea7b314610470578063116688641461049257600080fd5b366103c757600f546001600160a01b03161561035e576103596000610a3c565b610383565b61038334610374600c546001600160a01b031690565b6001600160a01b031690610b00565b7f6ef95f06320e7a25a04a175ca677b7052bdd97131872c2192525a629f51be77033604080516001600160a01b0390921682523460208301520160405180910390a1005b600080fd5b3480156103d857600080fd5b506103ec6103e7366004613895565b610c1e565b60405190151581526020015b60405180910390f35b34801561040d57600080fd5b50610416610c2f565b6040516103f89190613b42565b34801561042f57600080fd5b50610416610cbd565b34801561044457600080fd5b506104586104533660046138cd565b610d4f565b6040516001600160a01b0390911681526020016103f8565b34801561047c57600080fd5b5061049061048b3660046137ba565b610de4565b005b34801561049e57600080fd5b506104b26104ad3660046138cd565b610ef5565b6040519081526020016103f8565b6104b2610fad565b3480156104d457600080fd5b506009546104b2565b3480156104e957600080fd5b506104b26104f83660046138cd565b6000908152600e602052604090205490565b34801561051657600080fd5b506014546104b2565b34801561052b57600080fd5b5061049061053a3660046135e5565b611159565b34801561054b57600080fd5b5061049061055a366004613591565b61118b565b34801561056b57600080fd5b5061057f61057a366004613921565b61127f565b604080516001600160a01b0390931683526020830191909152016103f8565b6104b26105ac3660046138cd565b6112d4565b3480156105bd57600080fd5b506104b26105cc3660046137ba565b6114a3565b3480156105dd57600080fd5b506104b260125481565b3480156105f357600080fd5b506104906106023660046135e5565b611539565b34801561061357600080fd5b506104906106223660046138cd565b611554565b34801561063357600080fd5b506104b260145481565b34801561064957600080fd5b506011546104b2565b34801561065e57600080fd5b506104b261066d3660046138cd565b6115aa565b6104b2610680366004613591565b61164b565b34801561069157600080fd5b506104586106a03660046138cd565b6000908152600d60205260409020546001600160a01b031690565b3480156106c757600080fd5b506104906106d6366004613812565b6117f9565b3480156106e757600080fd5b506015546103ec9060ff1681565b34801561070157600080fd5b506104b260135481565b34801561071757600080fd5b506104586107263660046138cd565b6118ce565b6104b2610739366004613591565b611945565b34801561074a57600080fd5b506104906107593660046138cd565b611b83565b34801561076a57600080fd5b506104b2610779366004613591565b611be0565b34801561078a57600080fd5b50610490611c67565b34801561079f57600080fd5b50601054610458906001600160a01b031681565b6103ec6107c13660046138fd565b611c9d565b3480156107d257600080fd5b506104906107e1366004613921565b611dbd565b3480156107f257600080fd5b506104906108013660046138cd565b611e10565b34801561081257600080fd5b506013546104b2565b34801561082757600080fd5b50610458611e6d565b34801561083c57600080fd5b5061049061084b3660046137ba565b611e86565b34801561085c57600080fd5b50600c546001600160a01b0316610458565b34801561087a57600080fd5b50610416611f70565b34801561088f57600080fd5b50600f54610458906001600160a01b031681565b3480156108af57600080fd5b506104906108be366004613786565b611f7f565b3480156108cf57600080fd5b506104906108de3660046138cd565b611f8a565b3480156108ef57600080fd5b506104906108fe366004613625565b612024565b34801561090f57600080fd5b506104b261091e366004613591565b61205c565b61049061093136600461387b565b610a3c565b34801561094257600080fd5b506104b26120c0565b34801561095757600080fd5b506104166109663660046138cd565b6120cb565b34801561097757600080fd5b506104906121dc565b6103ec61098e3660046138cd565b612252565b34801561099f57600080fd5b506103ec6109ae3660046135ad565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b3480156109e857600080fd5b506104906109f73660046136fe565b612282565b348015610a0857600080fd5b50610490610a17366004613591565b61237c565b348015610a2857600080fd5b50610490610a373660046138cd565b612417565b600f546001600160a01b0316610a6d5760405162461bcd60e51b8152600401610a6490613c71565b60405180910390fd5b600f54604051631ab16f5960e11b815234600482015282151560248201526001600160a01b0390911690633562deb290604401600060405180830381600087803b158015610aba57600080fd5b505af1158015610ace573d6000803e3d6000fd5b50506040513492507f3903d05344bfbe173a5084aa4d3a99187eff3f7bfb3db786c814e7eddd9b3cd59150600090a250565b80471015610b505760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a20696e73756666696369656e742062616c616e63650000006044820152606401610a64565b6000826001600160a01b03168260405160006040518083038185875af1925050503d8060008114610b9d576040519150601f19603f3d011682016040523d82523d6000602084013e610ba2565b606091505b5050905080610c195760405162461bcd60e51b815260206004820152603a60248201527f416464726573733a20756e61626c6520746f2073656e642076616c75652c207260448201527f6563697069656e74206d617920686176652072657665727465640000000000006064820152608401610a64565b505050565b6000610c29826124b1565b92915050565b60168054610c3c90613d01565b80601f0160208091040260200160405190810160405280929190818152602001828054610c6890613d01565b8015610cb55780601f10610c8a57610100808354040283529160200191610cb5565b820191906000526020600020905b815481529060010190602001808311610c9857829003601f168201915b505050505081565b606060008054610ccc90613d01565b80601f0160208091040260200160405190810160405280929190818152602001828054610cf890613d01565b8015610d455780601f10610d1a57610100808354040283529160200191610d45565b820191906000526020600020905b815481529060010190602001808311610d2857829003601f168201915b5050505050905090565b6000818152600260205260408120546001600160a01b0316610dc85760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610a64565b506000908152600460205260409020546001600160a01b031690565b6000610def826118ce565b9050806001600160a01b0316836001600160a01b03161415610e5d5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610a64565b336001600160a01b0382161480610e795750610e7981336109ae565b610eeb5760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c00000000000000006064820152608401610a64565b610c1983836124d6565b600f546000906001600160a01b0316610f205760405162461bcd60e51b8152600401610a6490613c71565b600f546040516321c754a560e11b8152306004820152602481018490526000916001600160a01b03169063438ea94a906044015b60206040518083038186803b158015610f6c57600080fd5b505afa158015610f80573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610fa491906138e5565b9150505b919050565b60155460009060ff1615610fd35760405162461bcd60e51b8152600401610a6490613ba7565b6012543410156110105760405162461bcd60e51b81526020600482015260086024820152674f463a452d30303160c01b6044820152606401610a64565b6011546009541061104e5760405162461bcd60e51b815260206004820152600860248201526727a31d229698189960c11b6044820152606401610a64565b6010546001600160a01b0316156110bd576010546040516335313c2160e11b81523360048201526001600160a01b0390911690636a62784290602401600060405180830381600087803b1580156110a457600080fd5b505af11580156110b8573d6000803e3d6000fd5b505050505b6110c5612544565b600f549091506001600160a01b03161561114057600f54604051631ab16f5960e11b8152346004820152600160248201526001600160a01b0390911690633562deb290604401600060405180830381600087803b15801561112557600080fd5b505af1158015611139573d6000803e3d6000fd5b5050505090565b61115634610374600c546001600160a01b031690565b90565b611164335b8261264f565b6111805760405162461bcd60e51b8152600401610a6490613c20565b610c19838383612746565b600c546001600160a01b031633146111b55760405162461bcd60e51b8152600401610a6490613beb565b601080546001600160a01b0383166001600160a01b031990911681179091556368a540c76111eb600c546001600160a01b031690565b6040516001600160e01b031960e084901b1681526001600160a01b039091166004820152602401600060405180830381600087803b15801561122c57600080fd5b505af1158015611240573d6000803e3d6000fd5b50506010546040516001600160a01b0390911692507f1e22c56232a0d367cb86087b57c1fc49b4bdcff57db9930fd4bda0d0d2ad15b99150600090a250565b60408051808201909152600b546001600160a01b038116808352600160a01b90910462ffffff16602083018190529091600091612710906112c09086613ccb565b6112ca9190613cab565b9150509250929050565b6000816112e03361115e565b6112fc5760405162461bcd60e51b8152600401610a6490613bc9565b600f546001600160a01b03166113245760405162461bcd60e51b8152600401610a6490613c71565b600061132f846118ce565b600f546040516321c754a560e11b8152306004820152602481018790529192506000916001600160a01b039091169063438ea94a9060440160206040518083038186803b15801561137f57600080fd5b505afa158015611393573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113b791906138e5565b9050600081116113f45760405162461bcd60e51b81526020600482015260086024820152674f463a452d30313160c01b6044820152606401610a64565b6114076001600160a01b03831682610b00565b600f54604051634d9ae53160e11b815260006004820152602481018790526001600160a01b0390911690639b35ca6290604401600060405180830381600087803b15801561145457600080fd5b505af1158015611468573d6000803e3d6000fd5b50506040518392508791507fd2e9df57c00b23ba7ee3ed404df528700b0f0990b7292602d48fb3b9764e507690600090a39250505b50919050565b60006114ae83611be0565b82106115105760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201526a74206f6620626f756e647360a81b6064820152608401610a64565b506001600160a01b03919091166000908152600760209081526040808320938352929052205490565b610c1983838360405180602001604052806000815250612024565b8061155e3361115e565b61157a5760405162461bcd60e51b8152600401610a6490613bc9565b60155460ff161561159d5760405162461bcd60e51b8152600401610a6490613ba7565b6115a6826128f1565b5050565b60006115b560095490565b82106116185760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201526b7574206f6620626f756e647360a01b6064820152608401610a64565b6009828154811061163957634e487b7160e01b600052603260045260246000fd5b90600052602060002001549050919050565b600f546000906001600160a01b03166116765760405162461bcd60e51b8152600401610a6490613c71565b600f54604051635fbb1c3160e01b81523060048201526001600160a01b0384811660248301526000921690635fbb1c319060440160206040518083038186803b1580156116c257600080fd5b505afa1580156116d6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906116fa91906138e5565b9050600081116117375760405162461bcd60e51b81526020600482015260086024820152674f463a452d30313160c01b6044820152606401610a64565b61174a6001600160a01b03841682610b00565b600f5460405163c16243c960e01b8152600060048201526001600160a01b0385811660248301529091169063c16243c990604401600060405180830381600087803b15801561179857600080fd5b505af11580156117ac573d6000803e3d6000fd5b5050604080516001600160a01b0387168152602081018590527fba347b3845385dc3000e48c0bd524930cecda649991c5efdefe1ee9a33a6dbeb935001905060405180910390a192915050565b600f546001600160a01b03166118215760405162461bcd60e51b8152600401610a6490613c71565b600f54604051639c8219b760e01b81526001600160a01b0390911690639c8219b7906118599033908890889088908890600401613a46565b600060405180830381600087803b15801561187357600080fd5b505af1158015611887573d6000803e3d6000fd5b505050507f9a453ad60f0e55d9836e14139af1a81069f3252da7d07013308769211aff35ca848484846040516118c09493929190613ad6565b60405180910390a150505050565b6000818152600260205260408120546001600160a01b031680610c295760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610a64565b60155460009060ff161561196b5760405162461bcd60e51b8152600401610a6490613ba7565b6012543410156119a85760405162461bcd60e51b81526020600482015260086024820152674f463a452d30303160c01b6044820152606401610a64565b601154600954106119e65760405162461bcd60e51b815260206004820152600860248201526727a31d229698189960c11b6044820152606401610a64565b60135415611a795760006119fc601354346128fa565b9050611a116001600160a01b03841682610b00565b604051667072696d61727960c81b81526001600160a01b0384169060070160405180910390207f522c39d7156b7dd9419c7853d069ac52655fb23c5ec017f319477ad7bef213aa611a6160095490565b604080519182523460208301520160405180910390a3505b6010546001600160a01b031615611ae8576010546040516335313c2160e11b81523360048201526001600160a01b0390911690636a62784290602401600060405180830381600087803b158015611acf57600080fd5b505af1158015611ae3573d6000803e3d6000fd5b505050505b611af0612544565b600f549091506001600160a01b031615611b6d57600f54604051631ab16f5960e11b8152346004820152600160248201526001600160a01b0390911690633562deb290604401600060405180830381600087803b158015611b5057600080fd5b505af1158015611b64573d6000803e3d6000fd5b50505050919050565b610fa834610374600c546001600160a01b031690565b600c546001600160a01b03163314611bad5760405162461bcd60e51b8152600401610a6490613beb565b601181905560405181907facc639f1ff310faf48650d02a82bd24c924e45a5050fc931245096ac57c309d990600090a250565b60006001600160a01b038216611c4b5760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401610a64565b506001600160a01b031660009081526003602052604090205490565b600c546001600160a01b03163314611c915760405162461bcd60e51b8152600401610a6490613beb565b611c9b6000612919565b565b60155460009060ff1615611cc35760405162461bcd60e51b8152600401610a6490613ba7565b6001600160a01b038216611d045760405162461bcd60e51b815260206004820152600860248201526727a31d229698181960c11b6044820152606401610a64565b6000838152600e6020526040812054601454909190611d2390836128fa565b60145490915015611da157611d416001600160a01b03851682610b00565b604051687365636f6e6461727960b81b81526001600160a01b0385169060090160408051918290038220888352346020840152917f522c39d7156b7dd9419c7853d069ac52655fb23c5ec017f319477ad7bef213aa910160405180910390a35b611db485611daf348461296b565b612977565b95945050505050565b60155460ff1615611de05760405162461bcd60e51b8152600401610a6490613ba7565b81611dea3361115e565b611e065760405162461bcd60e51b8152600401610a6490613bc9565b610c198383612b67565b600c546001600160a01b03163314611e3a5760405162461bcd60e51b8152600401610a6490613beb565b601281905560405181907f02dd4e125a287edc7a6a887552dc7be35f4fdabe8afd6ae78f98b448d4e1a86690600090a250565b6000611e81600c546001600160a01b031690565b905090565b600c546001600160a01b03163314611eb05760405162461bcd60e51b8152600401610a6490613beb565b60008111611eeb5760405162461bcd60e51b815260206004820152600860248201526713d18e914b4c0c0d60c21b6044820152606401610a64565b6001600160a01b038216611f2c5760405162461bcd60e51b81526020600482015260086024820152674f463a452d30303560c01b6044820152606401610a64565b611f368282612bb8565b60405181906001600160a01b038416907f908669f35f6fb3977a956ba70597841fe541d1e8491ca3c025161e258d3bfdb690600090a35050565b606060018054610ccc90613d01565b6115a6338383612c54565b600c546001600160a01b03163314611fb45760405162461bcd60e51b8152600401610a6490613beb565b612710811115611ff15760405162461bcd60e51b815260206004820152600860248201526727a31d229698181b60c11b6044820152606401610a64565b601481905560405181907f905c2604b04c9fa2b09e05ab34ccae93abf21f5edd19a139c406fe9398f752a090600090a250565b61202e338361264f565b61204a5760405162461bcd60e51b8152600401610a6490613c20565b61205684848484612d23565b50505050565b600f546000906001600160a01b03166120875760405162461bcd60e51b8152600401610a6490613c71565b600f54604051635fbb1c3160e01b81523060048201526001600160a01b0384811660248301526000921690635fbb1c3190604401610f54565b6000611e8160095490565b6000818152600260205260409020546060906001600160a01b031661214a5760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b6064820152608401610a64565b6016805461215790613d01565b80601f016020809104026020016040519081016040528092919081815260200182805461218390613d01565b80156121d05780601f106121a5576101008083540402835291602001916121d0565b820191906000526020600020905b8154815290600101906020018083116121b357829003601f168201915b50505050509050919050565b600c546001600160a01b031633146122065760405162461bcd60e51b8152600401610a6490613beb565b6015805460ff8082161560ff19909216821790925560405191161581527fa9bfed3d98385b3777389e321dbde773cf7d335fa604fefbae3dca93564f55869060200160405180910390a1565b60155460009060ff16156122785760405162461bcd60e51b8152600401610a6490613ba7565b610c298234612977565b600c546001600160a01b031633146122ac5760405162461bcd60e51b8152600401610a6490613beb565b600f80546001600160a01b0319166001600160a01b038816908117909155604051639987f61b60e01b8152639987f61b906122f39088908890889088908890600401613b08565b600060405180830381600087803b15801561230d57600080fd5b505af1158015612321573d6000803e3d6000fd5b5050600f546040517fe7777c62b331e30e218564c936029d29f53e1b3c48775f4a3f4413e301f9a25f935061236c92506001600160a01b039091169088908890889088908890613a8a565b60405180910390a1505050505050565b600c546001600160a01b031633146123a65760405162461bcd60e51b8152600401610a6490613beb565b6001600160a01b03811661240b5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610a64565b61241481612919565b50565b600c546001600160a01b031633146124415760405162461bcd60e51b8152600401610a6490613beb565b61271081111561247e5760405162461bcd60e51b815260206004820152600860248201526727a31d229698181b60c11b6044820152606401610a64565b601381905560405181907fb27a19d53c022a09a344f42378e7d232d66b643564218cbfc93c98c93a2bc7af90600090a250565b60006001600160e01b0319821663780e9d6360e01b1480610c295750610c2982612d56565b600081815260046020526040902080546001600160a01b0319166001600160a01b038416908117909155819061250b826118ce565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b600061254f60095490565b905061256b338260405180602001604052806000815250612da6565b6000818152600d6020526040902080546001600160a01b031916331790556016805461261f91839161259c90613d01565b80601f01602080910402602001604051908101604052809291908181526020018280546125c890613d01565b80156126155780601f106125ea57610100808354040283529160200191612615565b820191906000526020600020905b8154815290600101906020018083116125f857829003601f168201915b5050505050612dd9565b604051339082907fb9203d657e9c0ec8274c818292ab0f58b04e1970050716891770eb1bab5d655e90600090a390565b6000818152600260205260408120546001600160a01b03166126c85760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610a64565b60006126d3836118ce565b9050806001600160a01b0316846001600160a01b0316148061270e5750836001600160a01b031661270384610d4f565b6001600160a01b0316145b8061273e57506001600160a01b0380821660009081526005602090815260408083209388168352929052205460ff165b949350505050565b826001600160a01b0316612759826118ce565b6001600160a01b0316146127c15760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b6064820152608401610a64565b6001600160a01b0382166128235760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610a64565b61282e838383612e73565b6128396000826124d6565b6001600160a01b0383166000908152600360205260408120805460019290612862908490613cea565b90915550506001600160a01b0382166000908152600360205260408120805460019290612890908490613c93565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b61241481612e7e565b600061291261271061290c8486612ebe565b90612eca565b9392505050565b600c80546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b60006129128284613cea565b6000828152600e6020526040812054806129be5760405162461bcd60e51b81526020600482015260086024820152674f463a452d30303760c01b6044820152606401610a64565b808310156129f95760405162461bcd60e51b815260206004820152600860248201526709e8c748a5a6060760c31b6044820152606401610a64565b6000612a04856118ce565b905060003360405163152a902d60e11b81526000600482018190526024820186905291925081903090632a55205a90604401604080518083038186803b158015612a4d57600080fd5b505afa158015612a61573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612a8591906137e5565b90925090508015612ada57612aa36001600160a01b03831682610b00565b60405181906001600160a01b038416907fbc86de696edc3350c664d50abf25f24e7e1251f1469ad925b25fe36927270d4390600090a35b612af7612ae7868361296b565b6001600160a01b03861690610b00565b826001600160a01b0316846001600160a01b0316897f23f50d55776d8003622a982ade45a6c7f083116c8dbbcd980f59942f440badb188604051612b3d91815260200190565b60405180910390a4612b4e85612ed6565b612b5984848a612746565b506001979650505050505050565b6000828152600e6020526040908190208290555182907fe23ea816dce6d7f5c0b85cbd597e7c3b97b2453791152c0b94e5e5c5f314d2f090612bac9084815260200190565b60405180910390a25050565b612710811115612c0a5760405162461bcd60e51b815260206004820152601a60248201527f45524332393831526f79616c746965733a20546f6f20686967680000000000006044820152606401610a64565b604080518082019091526001600160a01b0390921680835262ffffff9091166020909201829052600b8054600160a01b9093026001600160b81b0319909316909117919091179055565b816001600160a01b0316836001600160a01b03161415612cb65760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610a64565b6001600160a01b03838116600081815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b612d2e848484612746565b612d3a84848484612ef4565b6120565760405162461bcd60e51b8152600401610a6490613b55565b60006001600160e01b031982166380ac58cd60e01b1480612d8757506001600160e01b03198216635b5e139f60e01b145b80610c2957506301ffc9a760e01b6001600160e01b0319831614610c29565b612db08383613001565b612dbd6000848484612ef4565b610c195760405162461bcd60e51b8152600401610a6490613b55565b6000828152600260205260409020546001600160a01b0316612e545760405162461bcd60e51b815260206004820152602e60248201527f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60448201526d32bc34b9ba32b73a103a37b5b2b760911b6064820152608401610a64565b60008281526006602090815260409091208251610c1992840190613468565b610c1983838361314f565b612e8781613207565b60008181526006602052604090208054612ea090613d01565b159050612414576000818152600660205260408120612414916134ec565b60006129128284613ccb565b60006129128284613cab565b6000612ee2348361296b565b905080156115a6576115a68133610374565b60006001600160a01b0384163b15612ff657604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290612f38903390899088908890600401613a09565b602060405180830381600087803b158015612f5257600080fd5b505af1925050508015612f82575060408051601f3d908101601f19168201909252612f7f918101906138b1565b60015b612fdc573d808015612fb0576040519150601f19603f3d011682016040523d82523d6000602084013e612fb5565b606091505b508051612fd45760405162461bcd60e51b8152600401610a6490613b55565b805181602001fd5b6001600160e01b031916630a85bd0160e11b14905061273e565b506001949350505050565b6001600160a01b0382166130575760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610a64565b6000818152600260205260409020546001600160a01b0316156130bc5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610a64565b6130c860008383612e73565b6001600160a01b03821660009081526003602052604081208054600192906130f1908490613c93565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b6001600160a01b0383166131aa576131a581600980546000838152600a60205260408120829055600182018355919091527f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7af0155565b6131cd565b816001600160a01b0316836001600160a01b0316146131cd576131cd83826132ae565b6001600160a01b0382166131e457610c198161334b565b826001600160a01b0316826001600160a01b031614610c1957610c198282613424565b6000613212826118ce565b905061322081600084612e73565b61322b6000836124d6565b6001600160a01b0381166000908152600360205260408120805460019290613254908490613cea565b909155505060008281526002602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b600060016132bb84611be0565b6132c59190613cea565b600083815260086020526040902054909150808214613318576001600160a01b03841660009081526007602090815260408083208584528252808320548484528184208190558352600890915290208190555b5060009182526008602090815260408084208490556001600160a01b039094168352600781528383209183525290812055565b60095460009061335d90600190613cea565b6000838152600a60205260408120546009805493945090928490811061339357634e487b7160e01b600052603260045260246000fd5b9060005260206000200154905080600983815481106133c257634e487b7160e01b600052603260045260246000fd5b6000918252602080832090910192909255828152600a9091526040808220849055858252812055600980548061340857634e487b7160e01b600052603160045260246000fd5b6001900381819060005260206000200160009055905550505050565b600061342f83611be0565b6001600160a01b039093166000908152600760209081526040808320868452825280832085905593825260089052919091209190915550565b82805461347490613d01565b90600052602060002090601f01602090048101928261349657600085556134dc565b82601f106134af57805160ff19168380011785556134dc565b828001600101855582156134dc579182015b828111156134dc5782518255916020019190600101906134c1565b506134e8929150613522565b5090565b5080546134f890613d01565b6000825580601f10613508575050565b601f01602090049060005260206000209081019061241491905b5b808211156134e85760008155600101613523565b60008083601f840112613548578081fd5b50813567ffffffffffffffff81111561355f578182fd5b6020830191508360208260051b850101111561357a57600080fd5b9250929050565b80358015158114610fa857600080fd5b6000602082840312156135a2578081fd5b813561291281613d62565b600080604083850312156135bf578081fd5b82356135ca81613d62565b915060208301356135da81613d62565b809150509250929050565b6000806000606084860312156135f9578081fd5b833561360481613d62565b9250602084013561361481613d62565b929592945050506040919091013590565b6000806000806080858703121561363a578081fd5b843561364581613d62565b9350602085013561365581613d62565b925060408501359150606085013567ffffffffffffffff80821115613678578283fd5b818701915087601f83011261368b578283fd5b81358181111561369d5761369d613d4c565b604051601f8201601f19908116603f011681019083821181831017156136c5576136c5613d4c565b816040528281528a60208487010111156136dd578586fd5b82602086016020830137918201602001949094529598949750929550505050565b60008060008060008060808789031215613716578182fd5b863561372181613d62565b9550602087013567ffffffffffffffff8082111561373d578384fd5b6137498a838b01613537565b90975095506040890135915080821115613761578384fd5b5061376e89828a01613537565b979a9699509497949695606090950135949350505050565b60008060408385031215613798578182fd5b82356137a381613d62565b91506137b160208401613581565b90509250929050565b600080604083850312156137cc578182fd5b82356137d781613d62565b946020939093013593505050565b600080604083850312156137f7578182fd5b825161380281613d62565b6020939093015192949293505050565b60008060008060408587031215613827578384fd5b843567ffffffffffffffff8082111561383e578586fd5b61384a88838901613537565b90965094506020870135915080821115613862578384fd5b5061386f87828801613537565b95989497509550505050565b60006020828403121561388c578081fd5b61291282613581565b6000602082840312156138a6578081fd5b813561291281613d77565b6000602082840312156138c2578081fd5b815161291281613d77565b6000602082840312156138de578081fd5b5035919050565b6000602082840312156138f6578081fd5b5051919050565b6000806040838503121561390f578182fd5b8235915060208301356135da81613d62565b60008060408385031215613933578182fd5b50508035926020909101359150565b81835260006020808501945082825b8581101561397f57813561396481613d62565b6001600160a01b031687529582019590820190600101613951565b509495945050505050565b81835260006001600160fb1b038311156139a2578081fd5b8260051b80836020870137939093016020019283525090919050565b60008151808452815b818110156139e3576020818501810151868301820152016139c7565b818111156139f45782602083870101525b50601f01601f19169290920160200192915050565b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090613a3c908301846139be565b9695505050505050565b6001600160a01b0386168152606060208201819052600090613a6b9083018688613942565b8281036040840152613a7e81858761398a565b98975050505050505050565b6001600160a01b0387168152608060208201819052600090613aaf9083018789613942565b8281036040840152613ac281868861398a565b915050826060830152979650505050505050565b604081526000613aea604083018688613942565b8281036020840152613afd81858761398a565b979650505050505050565b606081526000613b1c606083018789613942565b8281036020840152613b2f81868861398a565b9150508260408301529695505050505050565b60208152600061291260208301846139be565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b6020808252600890820152674f463a452d30303960c01b604082015260600190565b60208082526008908201526704f463a452d3031360c41b604082015260600190565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b60208082526031908201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f6040820152701ddb995c881b9bdc88185c1c1c9bdd9959607a1b606082015260800190565b6020808252600890820152674f463a452d30303360c01b604082015260600190565b60008219821115613ca657613ca6613d36565b500190565b600082613cc657634e487b7160e01b81526012600452602481fd5b500490565b6000816000190483118215151615613ce557613ce5613d36565b500290565b600082821015613cfc57613cfc613d36565b500390565b600181811c90821680613d1557607f821691505b6020821081141561149d57634e487b7160e01b600052602260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160a01b038116811461241457600080fd5b6001600160e01b03198116811461241457600080fdfea2646970667358221220eab7c8710dcceef1c19a8329fa4810b58c62ef80744f7fc9bb0f94f23760c3e864736f6c63430008040033",
  linkReferences: {},
  deployedLinkReferences: {},
};

export const CONTRACT_ADDRESS = "0xF2aA715A7E7Dfd8222fa8fDe7499c5385EA3c4D6";
export const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";
export const TOKEN_ADDRESS = "0xf0fd5781171b286e5F57E6174D849186F7536Ff4";

export const ETH_ABI = [
    {
        "inputs": [],
        "name": "balanceOf",
        "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
]

export const TOKEN_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

export const CONTRACT_ABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "CreatePlayer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "CreateTeam",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "teamId",
          "type": "uint256"
        }
      ],
      "name": "JoinTeam",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "teamCost",
      "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalTeamCount",
      "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalPlayerCount",
      "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentPoolId",
      "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "wallet",
          "type": "address"
        }
      ],
      "name": "GetPlayerByAddress",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "playerId",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "playerWallet",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "points",
              "type": "uint256"
            }
          ],
          "internalType": "struct TeamGame.Player",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
        "inputs": [
            {
            "internalType": "uint256",
            "name": "teamId",
            "type": "uint256"
            }
        ],
        "name": "GetTeamById",
        "outputs": [
            {
            "components": [
                {
                "internalType": "uint256",
                "name": "teamId",
                "type": "uint256"
                },
                {
                "internalType": "string",
                "name": "name",
                "type": "string"
                },
                {
                "internalType": "address",
                "name": "captain",
                "type": "address"
                },
                {
                "internalType": "uint256[]",
                "name": "players",
                "type": "uint256[]"
                },
                {
                "internalType": "uint16",
                "name": "teamSize",
                "type": "uint16"
                },
                {
                "internalType": "uint16",
                "name": "playerCount",
                "type": "uint16"
                }
            ],
            "internalType": "struct TeamGame.Team",
            "name": "",
            "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "type": "error",
        "name": "NameAlreadyInUse",
        "inputs": [{"internalType": "string", "name": "name", "type": "string"}]
      },
      {
        "type": "error",
        "name": "NameTooLong",
        "inputs": [
          {"internalType": "string", "name": "name", "type": "string"},
          {"internalType": "uint8", "name": "maxLength", "type": "uint8"}
        ]
      },
      {
        "type": "error",
        "name": "NameTooShort",
        "inputs": [
          {"internalType": "string", "name": "name", "type": "string"},
          {"internalType": "uint8", "name": "minLength", "type": "uint8"}
        ]
      },
      {
        "type": "error",
        "name": "WalletAlreadyInUse",
        "inputs": [{"internalType": "address", "name": "wallet", "type": "address"}]
      },
      {
        "type": "error",
        "name": "PlayerAddressNotExists",
        "inputs": [{"internalType": "address", "name": "wallet", "type": "address"}]
      },
      {
        "type": "error",
        "name": "PlayerIdNotExists",
        "inputs": [{"internalType": "address", "name": "wallet", "type": "address"}]
      },
      {
        "type": "error",
        "name": "IdNotForThisAddress",
        "inputs": [
          {"internalType": "address", "name": "addr", "type": "address"},
          {"internalType": "uint256", "name": "id", "type": "uint256"}
        ]
      },
      {
        "type": "error",
        "name": "TeamDoesNotExist",
        "inputs": [{"internalType": "uint256", "name": "id", "type": "uint256"}]
      },
      {
        "type": "error",
        "name": "TeamNameDoesNotExist",
        "inputs": [{"internalType": "string", "name": "name", "type": "string"}]
      },
      {
        "type": "error",
        "name": "TeamIsFull",
        "inputs": [{"internalType": "uint256", "name": "maxPlayers", "type": "uint256"}]
      },
      {
        "type": "error",
        "name": "NotEnoughFunds",
        "inputs": [
          {"internalType": "address", "name": "buyer", "type": "address"},
          {"internalType": "uint256", "name": "balance", "type": "uint256"}
        ]
      },
      {
        "type": "error",
        "name": "AllowanceTooSmall",
        "inputs": [
          {"internalType": "address", "name": "buyer", "type": "address"},
          {"internalType": "uint256", "name": "allowance", "type": "uint256"}
        ]
      },
      {
        "type": "error",
        "name": "TransferFundsFailed",
        "inputs": []
      }    
  ];

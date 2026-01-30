export const COINFLIP_ABI = [
  {
    inputs: [{ internalType: "address", name: "_house", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { stateMutability: "payable", type: "receive" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "player", type: "address" },
      { indexed: false, internalType: "uint256", name: "wager", type: "uint256" },
      { indexed: false, internalType: "uint8", name: "guess", type: "uint8" },
      { indexed: false, internalType: "uint8", name: "result", type: "uint8" },
      { indexed: false, internalType: "bool", name: "won", type: "bool" },
    ],
    name: "Played",
    type: "event",
  },
  {
    inputs: [],
    name: "house",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_house", type: "address" }],
    name: "setHouse",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint8", name: "guess", type: "uint8" }],
    name: "play",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;
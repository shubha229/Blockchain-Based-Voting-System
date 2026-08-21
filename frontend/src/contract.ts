export const CONTRACT_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const CONTRACT_ABI = [
  // =====================================================
  // ADMIN
  // =====================================================

  {
    inputs: [],
    name: "admin",
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

  // =====================================================
  // ELECTION COUNT
  // =====================================================

  {
    inputs: [],
    name: "electionCount",
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

  // =====================================================
  // CURRENT ELECTION ID
  // =====================================================

  {
    inputs: [],
    name: "currentElectionId",
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

  // =====================================================
  // CREATE ELECTION
  // =====================================================

  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "createElection",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },

  // =====================================================
  // GET CURRENT ELECTION
  // =====================================================

  {
    inputs: [],
    name: "getCurrentElection",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "status",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "candidateCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },

  // =====================================================
  // GET ELECTION
  // =====================================================

  {
    inputs: [
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
    ],
    name: "getElection",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "status",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "candidateCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },

  // =====================================================
  // REGISTER VOTER
  // =====================================================

  {
    inputs: [
      {
        internalType: "address",
        name: "_voter",
        type: "address",
      },
    ],
    name: "registerVoter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },

  // =====================================================
  // IS REGISTERED
  // =====================================================

  {
    inputs: [
      {
        internalType: "address",
        name: "_voter",
        type: "address",
      },
    ],
    name: "isRegisteredVoter",
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

  // =====================================================
  // ADD CANDIDATE
  // =====================================================

  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_party",
        type: "string",
      },
    ],
    name: "addCandidate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },

  // =====================================================
  // GET CANDIDATE COUNT
  // =====================================================

  {
    inputs: [],
    name: "getCandidateCount",
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

  // =====================================================
  // GET CANDIDATE
  // =====================================================

  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "getCandidate",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "party",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "voteCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },

  // =====================================================
  // START
  // =====================================================

  {
    inputs: [],
    name: "startElection",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },

  // =====================================================
  // END
  // =====================================================

  {
    inputs: [],
    name: "endElection",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },

  // =====================================================
  // STATUS
  // =====================================================

  {
    inputs: [],
    name: "getElectionStatus",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },

  // =====================================================
  // VOTE
  // =====================================================

  {
    inputs: [
      {
        internalType: "uint256",
        name: "_candidateId",
        type: "uint256",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },

  // =====================================================
  // HAS VOTED
  // =====================================================

  {
    inputs: [
      {
        internalType: "address",
        name: "_voter",
        type: "address",
      },
    ],
    name: "hasVoted",
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

  // =====================================================
  // VOTER CHOICE
  // =====================================================

  {
    inputs: [
      {
        internalType: "address",
        name: "_voter",
        type: "address",
      },
    ],
    name: "getVoterChoice",
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
] as const;
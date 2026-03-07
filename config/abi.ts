export const AEGISOE_ABI = [
  // ── Core Write Functions ─────────────────────────────────
  {
    name: "recordIncident",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "secretId", type: "bytes32" },
      { name: "incidentCommitment", type: "bytes32" },
      { name: "riskLevel", type: "uint8" },
      { name: "repoName", type: "bytes32" },
    ],
    outputs: [],
  },
  {
    name: "recordRotation",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "secretId", type: "bytes32" },
      { name: "oldCommitment", type: "bytes32" },
      { name: "newCommitment", type: "bytes32" },
    ],
    outputs: [],
  },

  // ── Paginated Read Functions ─────────────────────────────
  {
    name: "getIncidentHistory",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "secretId", type: "bytes32" },
      { name: "offset", type: "uint256" },
      { name: "limit", type: "uint256" },
    ],
    outputs: [
      {
        name: "results",
        type: "tuple[]",
        components: [
          { name: "operator", type: "address" },
          { name: "incidentCommitment", type: "bytes32" },
          { name: "repoName", type: "bytes32" },
          { name: "timestamp", type: "uint48" },
          { name: "riskLevel", type: "uint8" },
          { name: "rotated", type: "bool" },
        ],
      },
    ],
  },
  {
    name: "getRotationHistory",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "secretId", type: "bytes32" },
      { name: "offset", type: "uint256" },
      { name: "limit", type: "uint256" },
    ],
    outputs: [
      {
        name: "results",
        type: "tuple[]",
        components: [
          { name: "operator", type: "address" },
          { name: "oldCommitment", type: "bytes32" },
          { name: "newCommitment", type: "bytes32" },
          { name: "timestamp", type: "uint48" },
        ],
      },
    ],
  },

  // ── Point Getters ────────────────────────────────────────
  {
    name: "getIncident",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "secretId", type: "bytes32" },
      { name: "index", type: "uint256" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "operator", type: "address" },
          { name: "incidentCommitment", type: "bytes32" },
          { name: "repoName", type: "bytes32" },
          { name: "timestamp", type: "uint48" },
          { name: "riskLevel", type: "uint8" },
          { name: "rotated", type: "bool" },
        ],
      },
    ],
  },
  {
    name: "getRotation",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "secretId", type: "bytes32" },
      { name: "index", type: "uint256" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "operator", type: "address" },
          { name: "oldCommitment", type: "bytes32" },
          { name: "newCommitment", type: "bytes32" },
          { name: "timestamp", type: "uint48" },
        ],
      },
    ],
  },

  // ── Count Functions ──────────────────────────────────────
  {
    name: "getIncidentCount",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "secretId", type: "bytes32" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "getRotationCount",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "secretId", type: "bytes32" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "isLatestIncidentRotated",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "secretId", type: "bytes32" }],
    outputs: [{ name: "", type: "bool" }],
  },

  // ── Admin Read Functions ─────────────────────────────────
  {
    name: "owner",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    name: "authorizedOperators",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },

  // ── Events ───────────────────────────────────────────────
  {
    name: "IncidentRecorded",
    type: "event",
    inputs: [
      { name: "secretId", type: "bytes32", indexed: true },
      { name: "operator", type: "address", indexed: true },
      { name: "incidentCommitment", type: "bytes32", indexed: false },
      { name: "riskLevel", type: "uint8", indexed: false },
      { name: "repoName", type: "bytes32", indexed: false },
      { name: "timestamp", type: "uint48", indexed: false },
    ],
  },
  {
    name: "SecretRotated",
    type: "event",
    inputs: [
      { name: "secretId", type: "bytes32", indexed: true },
      { name: "operator", type: "address", indexed: true },
      { name: "oldCommitment", type: "bytes32", indexed: false },
      { name: "newCommitment", type: "bytes32", indexed: false },
      { name: "timestamp", type: "uint48", indexed: false },
    ],
  },
] as const;

# AEGISOE Frontend

Web dashboard for the AEGISOE Confidential Security Automation Network.
Reads on-chain incident and rotation proofs from the AegisoeRegistry smart contract on Sepolia, and displays real-time backend webhook data from Railway.

**Chainlink Hackathon 2026 — Privacy Track**

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.1.6 | React framework (App Router) |
| React | 19 | UI library |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling (dark theme, orange accent) |
| wagmi | 3 | Ethereum React hooks |
| viem | 2 | Ethereum client (Sepolia reads + event logs) |
| Framer Motion | 12 | Animations |
| ethers | 6 | bytes32 decoding utilities |
| pnpm | — | Package manager |

---

## Pages

| Route | Page | Description |
|---|---|---|
| `/` | Dashboard | Stats overview, recent incidents from backend, on-chain activity feed |
| `/proof` | Proof Verifier | Query on-chain incident + rotation history by `secretId` (bytes32) |
| `/logs` | Incident Log | All on-chain `IncidentRecorded` + `SecretRotated` events with filters |

---

## Architecture

### Parent-Child Component Pattern

Pages (parents) own all logic — hooks, state, data fetching. Child components are purely presentational, receiving props only.

```
Page (Parent — "use client")
├── manages all state
├── calls all hooks
├── computes derived data
└── passes props to Children (no hooks, just render)
```

### Data Sources

| Source | URL | Data |
|---|---|---|
| Smart Contract | `0xf497...Da71` (Sepolia) | On-chain incidents, rotations, events |
| Backend API | `aegisoebe-production.up.railway.app` | `/incidents`, `/health` |
| Etherscan | `sepolia.etherscan.io` | Transaction links |

### On-Chain Data Types

The frontend decodes these SC types:

| SC Type | Frontend Decode |
|---|---|
| `bytes32 repoName` | UTF-8 string (zero-padded) |
| `uint8 riskLevel` | Enum: NONE=0, MEDIUM=1, HIGH=2, CRITICAL=3 |
| `uint48 timestamp` | JS Date via `new Date(Number(ts) * 1000)` |
| `bytes32 secretId` | Hex display with copy + Etherscan link |

---

## Project Structure

```
my-app/
├── app/
│   ├── layout.tsx              # Root layout + Web3Provider + Sidebar
│   ├── globals.css             # Dark theme (orange + black/grey, no gradients)
│   ├── page.tsx                # Dashboard (parent)
│   ├── proof/page.tsx          # Proof Verifier (parent)
│   └── logs/page.tsx           # Incident Log (parent)
│
├── components/
│   ├── providers/
│   │   └── Web3Provider.tsx    # wagmi + react-query provider
│   │
│   ├── layout/
│   │   ├── Sidebar.tsx         # Navigation + logo + network badge
│   │   └── PageContainer.tsx   # Page wrapper with framer motion transition
│   │
│   ├── ui/
│   │   ├── Badge.tsx           # Risk level + status badges
│   │   ├── Card.tsx            # Animated card container
│   │   ├── Pagination.tsx      # Shared pagination (same on all pages)
│   │   ├── HashDisplay.tsx     # Monospace hash + copy + etherscan link
│   │   ├── Skeleton.tsx        # Loading placeholder
│   │   └── EmptyState.tsx      # Empty data placeholder
│   │
│   ├── dashboard/
│   │   ├── StatsGrid.tsx       # 4 stat cards (incidents, rotations, pending, backend)
│   │   ├── RecentIncidents.tsx # Latest incidents from backend API
│   │   └── ActivityFeed.tsx    # On-chain event timeline
│   │
│   ├── incidents/
│   │   ├── IncidentTable.tsx   # Incident history table
│   │   └── IncidentRow.tsx     # Single incident row
│   │
│   ├── rotations/
│   │   ├── RotationTable.tsx   # Rotation history table
│   │   └── RotationRow.tsx     # Single rotation row
│   │
│   └── proof/
│       ├── SecretIdInput.tsx   # bytes32 input with validation
│       └── ProofResult.tsx     # Combined incident + rotation display
│
├── config/
│   ├── abi.ts                  # Full ABI from deployed AegisoeRegistry.sol
│   ├── constants.ts            # Contract address, backend URL, chain config
│   └── wagmi.ts                # wagmi config (Sepolia transport)
│
├── hooks/
│   ├── useIncidents.ts         # SC getIncidentHistory (paginated)
│   ├── useRotations.ts         # SC getRotationHistory (paginated)
│   ├── useIncidentCount.ts     # SC getIncidentCount + getRotationCount
│   ├── useContractEvents.ts    # SC event logs (IncidentRecorded + SecretRotated)
│   └── useBackendApi.ts        # Backend /incidents + /health (polling 15s)
│
├── lib/
│   ├── decode.ts               # bytes32 → string, riskLevel → label, timestamp → date
│   └── format.ts               # truncateAddress, truncateHash, etherscanUrl
│
└── types/
    └── index.ts                # IncidentRecord, RotationRecord, ContractEvent
```

---

## Smart Contract Integration

**Contract:** `0xf497C0B1D82d6fc1deaFe63a2DB7dBe81d87Da71` (Sepolia)
**Operator:** `0x6b75074B52d17A1FD101ED984605e3EF2EAB5e57`

### Read Functions Used

```
getIncidentHistory(bytes32, uint256 offset, uint256 limit) → IncidentRecord[]
getRotationHistory(bytes32, uint256 offset, uint256 limit) → RotationRecord[]
getIncidentCount(bytes32) → uint256
getRotationCount(bytes32) → uint256
isLatestIncidentRotated(bytes32) → bool
```

### Events Listened

```
IncidentRecorded(bytes32 indexed secretId, address indexed operator, ...)
SecretRotated(bytes32 indexed secretId, address indexed operator, ...)
```

---

## UI Design

- **Style:** Railway-inspired (CLI + web dashboard)
- **Colors:** Orange (`#f97316`) accent on black/grey (`#09090b`) background
- **No gradients** — all flat solid colors
- **Font:** Geist Sans + Geist Mono (monospace for hashes/addresses)
- **Animations:** Framer Motion (page transitions, staggered rows, card scale)
- **Pagination:** One shared component, identical across all pages

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

---

## Connected Services

| Service | URL |
|---|---|
| Backend (Railway) | `https://aegisoebe-production.up.railway.app` |
| Smart Contract (Sepolia) | `https://sepolia.etherscan.io/address/0xf497C0B1D82d6fc1deaFe63a2DB7dBe81d87Da71` |
| CRE Workflow | [github.com/Aegisoe/CRE](https://github.com/Aegisoe/CRE) |
| Backend Source | [github.com/Aegisoe/Backend](https://github.com/Aegisoe/Backend) |
| Smart Contract Source | [github.com/Aegisoe/SmartContract](https://github.com/Aegisoe/SmartContract) |

---

*Built for Chainlink Hackathon 2026 — Privacy Track*

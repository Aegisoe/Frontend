export enum RiskLevel {
  NONE = 0,
  MEDIUM = 1,
  HIGH = 2,
  CRITICAL = 3,
}

export interface IncidentRecord {
  operator: `0x${string}`;
  incidentCommitment: `0x${string}`;
  repoName: `0x${string}`;
  timestamp: bigint;
  riskLevel: number;
  rotated: boolean;
}

export interface RotationRecord {
  operator: `0x${string}`;
  oldCommitment: `0x${string}`;
  newCommitment: `0x${string}`;
  timestamp: bigint;
}

export interface BackendIncident {
  id: string;
  repo: string;
  commitSha: string;
  secretType: string;
  status: "detected" | "rotating" | "rotated" | "skipped";
  riskLevel?: string;
  detectedAt: string;
  creTriggered: boolean;
  secretId?: `0x${string}`;
  incidentCommitment?: `0x${string}`;
  newCommitment?: `0x${string}`;
  processedAt?: string;
}

export interface BackendResponse {
  total: number;
  incidents: BackendIncident[];
}

export interface ContractEvent {
  type: "incident" | "rotation";
  secretId: `0x${string}`;
  operator: `0x${string}`;
  timestamp: bigint;
  blockNumber: bigint;
  transactionHash: `0x${string}`;
  // Incident-specific
  incidentCommitment?: `0x${string}`;
  riskLevel?: number;
  repoName?: `0x${string}`;
  // Rotation-specific
  oldCommitment?: `0x${string}`;
  newCommitment?: `0x${string}`;
}

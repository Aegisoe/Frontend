"use client";

import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { CONTRACT_ADDRESS } from "@/config/constants";
import type { ContractEvent } from "@/types";

const INCIDENT_EVENT = parseAbiItem(
  "event IncidentRecorded(bytes32 indexed secretId, address indexed operator, bytes32 incidentCommitment, uint8 riskLevel, bytes32 repoName, uint48 timestamp)"
);

const ROTATION_EVENT = parseAbiItem(
  "event SecretRotated(bytes32 indexed secretId, address indexed operator, bytes32 oldCommitment, bytes32 newCommitment, uint48 timestamp)"
);

export function useContractEvents(fromBlock?: bigint) {
  const publicClient = usePublicClient();
  const [events, setEvents] = useState<ContractEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!publicClient) return;

    async function fetchEvents() {
      setIsLoading(true);
      try {
        const startBlock = fromBlock ?? BigInt(0);

        const [incidentLogs, rotationLogs] = await Promise.all([
          publicClient!.getLogs({
            address: CONTRACT_ADDRESS,
            event: INCIDENT_EVENT,
            fromBlock: startBlock,
            toBlock: "latest",
          }),
          publicClient!.getLogs({
            address: CONTRACT_ADDRESS,
            event: ROTATION_EVENT,
            fromBlock: startBlock,
            toBlock: "latest",
          }),
        ]);

        const incidentEvents: ContractEvent[] = incidentLogs.map((log) => ({
          type: "incident" as const,
          secretId: log.args.secretId!,
          operator: log.args.operator!,
          timestamp: BigInt(log.args.timestamp ?? 0),
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
          incidentCommitment: log.args.incidentCommitment,
          riskLevel: log.args.riskLevel,
          repoName: log.args.repoName,
        }));

        const rotationEvents: ContractEvent[] = rotationLogs.map((log) => ({
          type: "rotation" as const,
          secretId: log.args.secretId!,
          operator: log.args.operator!,
          timestamp: BigInt(log.args.timestamp ?? 0),
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
          oldCommitment: log.args.oldCommitment,
          newCommitment: log.args.newCommitment,
        }));

        const all = [...incidentEvents, ...rotationEvents].sort(
          (a, b) => Number(b.blockNumber - a.blockNumber)
        );

        setEvents(all);
      } catch (err) {
        console.error("Failed to fetch contract events:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, [publicClient, fromBlock]);

  return { events, isLoading };
}

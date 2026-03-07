"use client";

import { useReadContract } from "wagmi";
import { AEGISOE_ABI } from "@/config/abi";
import { CONTRACT_ADDRESS } from "@/config/constants";

export function useIncidentCount(secretId: `0x${string}` | undefined) {
  const incidentCount = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AEGISOE_ABI,
    functionName: "getIncidentCount",
    args: secretId ? [secretId] : undefined,
    query: { enabled: !!secretId },
  });

  const rotationCount = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AEGISOE_ABI,
    functionName: "getRotationCount",
    args: secretId ? [secretId] : undefined,
    query: { enabled: !!secretId },
  });

  const isLatestRotated = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AEGISOE_ABI,
    functionName: "isLatestIncidentRotated",
    args: secretId ? [secretId] : undefined,
    query: { enabled: !!secretId },
  });

  return {
    incidentCount: incidentCount.data as bigint | undefined,
    rotationCount: rotationCount.data as bigint | undefined,
    isLatestRotated: isLatestRotated.data as boolean | undefined,
    isLoading: incidentCount.isLoading || rotationCount.isLoading || isLatestRotated.isLoading,
  };
}

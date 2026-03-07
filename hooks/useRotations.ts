"use client";

import { useReadContract } from "wagmi";
import { AEGISOE_ABI } from "@/config/abi";
import { CONTRACT_ADDRESS, PAGE_SIZE } from "@/config/constants";

export function useRotations(secretId: `0x${string}` | undefined, page: number = 1) {
  const offset = BigInt((page - 1) * PAGE_SIZE);

  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AEGISOE_ABI,
    functionName: "getRotationHistory",
    args: secretId ? [secretId, offset, BigInt(PAGE_SIZE)] : undefined,
    query: {
      enabled: !!secretId,
    },
  });
}

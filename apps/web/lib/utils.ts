import { dummyProof } from "@/app/constants/dummyProof";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { GameRecordProof, GameRecordPublicOutput } from "zknoid-chain";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function walletInstalled() {
  return typeof mina !== 'undefined';
}

export async function mockGameRecordProof(
  publicOutput: GameRecordPublicOutput
): Promise<GameRecordProof> {
  return new GameRecordProof({
      proof: dummyProof,
      maxProofsVerified: 2,
      publicInput: undefined,
      publicOutput,
  });
}

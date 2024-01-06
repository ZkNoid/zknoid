import { dummyProof } from '@/app/constants/dummyProof';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GameRecordProof, GameRecordPublicOutput } from 'zknoid-chain';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function walletInstalled() {
  return typeof mina !== 'undefined';
}

export async function mockProof<O, P>(
  publicOutput: O,
  ProofType: new ({
    proof,
    publicInput,
    publicOutput,
    maxProofsVerified,
  }: {
    proof: unknown;
    publicInput: any;
    publicOutput: any;
    maxProofsVerified: 0 | 2 | 1;
  }) => P,
): Promise<P> {
  return new ProofType({
    proof: dummyProof,
    maxProofsVerified: 2,
    publicInput: undefined,
    publicOutput,
  });
}

import { dummyProofBase64 } from '@/app/constants/dummyProofBase64';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GameRecordProof } from 'zknoid-chain';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function walletInstalled() {
  return typeof mina !== 'undefined';
}

const dummy = GameRecordProof.fromJSON({
  publicInput: [],
  publicOutput: [''],
  maxProofsVerified: 2,
  proof: dummyProofBase64
})

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
    proof: dummy.proof,
    maxProofsVerified: 2,
    publicInput: undefined,
    publicOutput,
  });
}

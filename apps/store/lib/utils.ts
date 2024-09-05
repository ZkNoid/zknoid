import { type RuntimeModulesRecord } from '@proto-kit/module';
import { GameRecordProof } from 'zknoid-chain-dev';
import { client } from 'zknoid-chain-dev';
// import { ModulesConfig } from '@proto-kit/common';
import { PublicKey } from 'o1js';

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
  }) => P
): Promise<P> {
  const dummy = await GameRecordProof.dummy([], [''], 2);
  
  return new ProofType({
    proof: dummy.proof,
    maxProofsVerified: 2,
    publicInput: undefined,
    publicOutput,
  });
}

export function buildClient<
  RuntimeModules extends RuntimeModulesRecord = RuntimeModulesRecord,
>(modules: RuntimeModules) {
  return client;
}

export const formatPubkey = (pubkey: PublicKey | undefined) =>
  pubkey
    ? pubkey.toBase58().slice(0, 5) + '...' + pubkey.toBase58().slice(-5)
    : 'None';

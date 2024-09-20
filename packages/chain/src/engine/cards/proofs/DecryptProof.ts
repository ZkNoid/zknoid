import {
  Experimental,
  Group,
  Int64,
  PrivateKey,
  Provable,
  Struct,
  UInt64,
  ZkProgram,
} from 'o1js';
import { decryptOne } from '../../ElGamal';

export function getDecryptProof() {
  class DecryptProofPublicInput extends Struct({
    m0: Group,
  }) {}

  class DecryptProofPublicOutput extends Struct({
    decryptedPart: Group,
  }) {}

  const proveDecrypt = async (
    publicInput: DecryptProofPublicInput,
    pk: PrivateKey,
  ): Promise<DecryptProofPublicOutput> => {
    let decryptedPart = decryptOne(pk, publicInput.m0);

    return new DecryptProofPublicOutput({
      decryptedPart,
    });
  };

  const DecryptProgramm = ZkProgram({
    publicInput: DecryptProofPublicInput,
    publicOutput: DecryptProofPublicOutput,
    name: 'decrypt',
    methods: {
      decrypt: {
        privateInputs: [PrivateKey],
        method: proveDecrypt,
      },
    },
  });

  class DecryptProof extends ZkProgram.Proof(DecryptProgramm) {}

  return {
    DecryptProofPublicInput,
    DecryptProofPublicOutput,
    proveDecrypt,
    DecryptProgramm,
    DecryptProof,
  };
}

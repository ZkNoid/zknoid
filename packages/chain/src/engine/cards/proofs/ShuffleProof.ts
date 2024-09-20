import {
  Experimental,
  Field,
  FlexibleProvable,
  FlexibleProvablePure,
  Group,
  InferProvable,
  Provable,
  ProvableExtended,
  PublicKey,
  Struct,
  UInt64,
  ZkProgram,
} from 'o1js';
import { encrypt } from '../../ElGamal';
import { IEncrypedCard } from '../interfaces/IEncryptedCard';
import { IEncryptedDeck } from '../interfaces/IEncryptedDeck';

export function createShuffleProof<
  EC extends IEncrypedCard<any>,
  ED extends IEncryptedDeck<EC>,
>(
  encryptedDeck: FlexibleProvablePure<ED>,
  initialEnctyptedDeck: ED,
  cardType: new (args: { value: Group[]; numOfEncryption: UInt64 }) => EC,
  PMType: FlexibleProvablePure<any>,
  deckSize: number,
) {
  class ShuffleProofPublicInput extends Struct({
    initialDeck: encryptedDeck,
    agrigatedPubKey: PublicKey,
  }) {}

  class ShuffleProofPublicOutput extends Struct({
    newDeck: encryptedDeck,
  }) {}

  const shuffle = async (
    publiciInput: ShuffleProofPublicInput,
    permutation: typeof PMType, // ?
    noise: Field[],
  ): Promise<ShuffleProofPublicOutput> => {
    let newDeck = initialEnctyptedDeck;

    // We assume that numOfEncryption equals on each card during shuffle phaze
    let initialNumOfEncryption =
      publiciInput.initialDeck.cards[0].numOfEncryption;

    for (let i = 0; i < newDeck.cards.length; i++) {
      newDeck.cards[i] = new cardType({
        value: encrypt(
          publiciInput.agrigatedPubKey,
          publiciInput.initialDeck.cards[i].value as [Group, Group, Group], // fix as issue
          noise[i],
        ),
        numOfEncryption: initialNumOfEncryption.add(1),
      });
    }

    newDeck = newDeck.applyPermutation(permutation);

    return new ShuffleProofPublicOutput({
      newDeck,
    });
  };

  const Shuffle = ZkProgram({
    publicInput: ShuffleProofPublicInput,
    publicOutput: ShuffleProofPublicOutput,
    name: 'some-name',
    methods: {
      shuffle: {
        privateInputs: [PMType, Provable.Array(Field, deckSize)],
        method: shuffle,
      },
    },
  });

  class ShuffleProof extends ZkProgram.Proof(Shuffle) {}

  return {
    ShuffleProofPublicInput,
    ShuffleProofPublicOutput,
    Shuffle,
    ShuffleProof,
    shuffle,
    initialEnctyptedDeck,
  };
}

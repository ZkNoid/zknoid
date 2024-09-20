import {
  Bool,
  Experimental,
  Field,
  Group,
  PrivateKey,
  Provable,
  PublicKey,
  Struct,
  UInt64,
  ZkProgram,
} from 'o1js';
import { EncryptedCardBase } from '../EncryptedCardBase';
import { ICard } from '../interfaces/ICard';
import { toEncryptedCardHelper } from '../CardBase';
import { IEncrypedCard } from '../interfaces/IEncryptedCard';
import { EncryptedDeckBase } from '../DeckBase';
import { convertToMessage, decryptOne, encrypt } from '../../ElGamal';
import { getPermutationMatrix } from '../Permutation';
import { createShuffleProof } from '../proofs/ShuffleProof';
import { getDecryptProof } from '../proofs/DecryptProof';

const DECK32_MAX_COLOR = 4;
const DECK32_MAX_VALUE = 15;
const DECK32_MIN_VALUE = 6;
const DECK32_SIZE = (DECK32_MAX_VALUE - DECK32_MIN_VALUE) * DECK32_MAX_COLOR;

export class Deck32Card
  extends Struct({
    value: UInt64, // TODO check value \in [2, 14]
    color: UInt64, // TODO check value \in [0, 3]
  })
  implements ICard<Deck32EncryptedCard>
{
  toEncryptedCard(): Deck32EncryptedCard {
    return toEncryptedCardHelper(Deck32EncryptedCard, this.getIndex());
  }

  getIndex(): UInt64 {
    return this.value.mul(DECK32_MAX_COLOR).add(this.color);
  }

  toString(): string {
    return `Value: ${this.value.toString()}. Color: ${this.color.toString()}`;
  }
}

// This is how it suppose to be done. But currently there is some porblems with types
export class Deck32EncryptedCard
  extends EncryptedCardBase
  implements IEncrypedCard<Deck32Card>
{
  toCard(): Deck32Card {
    this.numOfEncryption.assertEquals(UInt64.zero);

    let groupVal = this.value[1].sub(this.value[2]);
    let curV = Group.generator;
    let value = UInt64.zero;
    let color = UInt64.zero;
    let result = new Deck32Card({
      value: UInt64.zero,
      color: UInt64.zero,
    });
    let found = false;
    for (let i = 0; i < DECK32_MAX_VALUE * DECK32_MAX_COLOR; i++) {
      result = Provable.if<Deck32Card>(
        curV.equals(groupVal),
        Deck32Card,
        new Deck32Card({
          value,
          color,
        }),
        result,
      );

      curV = curV.add(Group.generator);
      color = color.add(1);
      value = value.add(color.divMod(DECK32_MAX_COLOR).quotient);
      color = color.divMod(DECK32_MAX_COLOR).rest;
    }

    return result;
  }
}

// This is how it should be implemented. But again some problems with types
export class Deck32EncryptedDeck extends EncryptedDeckBase(
  Deck32EncryptedCard,
  Deck32EncryptedCard,
  DECK32_SIZE,
).EncryptedDeckBase {}

export class Deck32PermutationMatrix extends getPermutationMatrix(
  DECK32_SIZE,
) {}

//////////////////////////////////////// Shuffle /////////////////////////////////////////

export const initialEnctyptedDeck = new Deck32EncryptedDeck({
  cards: [...Array(DECK32_SIZE).keys()].map((value) => {
    return new Deck32EncryptedCard({
      value: convertToMessage(value),
      numOfEncryption: UInt64.zero,
    });
  }),
});

export const {
  ShuffleProofPublicInput: Deck32ShuffleProofPublicInput,
  ShuffleProofPublicOutput: Deck32ShuffleProofPublicOutput,
  Shuffle: Deck32Shuffle,
  ShuffleProof: Deck32ShuffleProof,
  initialEnctyptedDeck: initialEnctyptedDeck32,
  shuffle: deck32Shuffle,
} = createShuffleProof(
  Deck32EncryptedDeck,
  initialEnctyptedDeck,
  Deck32EncryptedCard as any,
  Deck32PermutationMatrix,
  DECK32_SIZE,
); // #TODO remove any

export const {
  DecryptProofPublicInput: Deck32DecryptProofPublicInput,
  DecryptProofPublicOutput: Deck32DecryptProofPublicOutput,
  proveDecrypt: proveDeck32Decrypt,
  DecryptProgramm: Deck32DecryptProgram,
  DecryptProof: Deck32DecryptProof,
} = getDecryptProof();

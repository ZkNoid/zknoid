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

const POKER_MAX_COLOR = 4;
const POKER_MAX_VALUE = 15;
const POKER_MIN_VALUE = 2;
const POKER_DECK_SIZE = (POKER_MAX_VALUE - POKER_MIN_VALUE) * POKER_MAX_COLOR;

export class PokerCard
  extends Struct({
    value: UInt64, // TODO check value \in [2, 14]
    color: UInt64, // TODO check value \in [0, 3]
  })
  implements ICard<PokerEncryptedCard>
{
  toEncryptedCard(): PokerEncryptedCard {
    return toEncryptedCardHelper(PokerEncryptedCard, this.getIndex());
  }

  getIndex(): UInt64 {
    return this.value.mul(POKER_MAX_COLOR).add(this.color);
  }

  toString(): string {
    return `Value: ${this.value.toString()}. Color: ${this.color.toString()}`;
  }
}

// This is how it suppose to be done. But currently there is some porblems with types
export class PokerEncryptedCard
  extends EncryptedCardBase
  implements IEncrypedCard<PokerCard>
{
  toCard(): PokerCard {
    this.numOfEncryption.assertEquals(UInt64.zero);

    let groupVal = this.value[1].sub(this.value[2]);
    let curV = Group.generator;
    let value = UInt64.zero;
    let color = UInt64.zero;
    let result = new PokerCard({
      value: UInt64.zero,
      color: UInt64.zero,
    });
    let found = false;
    for (let i = 0; i < POKER_MAX_VALUE * POKER_MAX_COLOR; i++) {
      result = Provable.if<PokerCard>(
        curV.equals(groupVal),
        PokerCard,
        new PokerCard({
          value,
          color,
        }),
        result,
      );

      curV = curV.add(Group.generator);
      color = color.add(1);
      value = value.add(color.divMod(POKER_MAX_COLOR).quotient);
      color = color.divMod(POKER_MAX_COLOR).rest;
    }

    return result;
  }
}

// This is how it should be implemented. But again some problems with types
export class PokerEncryptedDeck extends EncryptedDeckBase<
  PokerCard,
  PokerEncryptedCard
>(PokerEncryptedCard, PokerEncryptedCard, POKER_DECK_SIZE).EncryptedDeckBase {}

export class PokerPermutationMatrix extends getPermutationMatrix(
  POKER_DECK_SIZE,
) {}

//////////////////////////////////////// Shuffle /////////////////////////////////////////

export const pokerInitialEnctyptedDeck = new PokerEncryptedDeck({
  cards: [...Array(POKER_MAX_VALUE - POKER_MIN_VALUE).keys()].flatMap(
    (value) => {
      return [...Array(POKER_MAX_COLOR).keys()].map((color) => {
        return new PokerCard({
          value: UInt64.from(value + POKER_MIN_VALUE),
          color: UInt64.from(color),
        }).toEncryptedCard();
      });
    },
  ),
});

export const {
  ShuffleProofPublicInput: PokerShuffleProofPublicInput,
  ShuffleProofPublicOutput: PokerShuffleProofPublicOutput,
  Shuffle: PokerShuffle,
  ShuffleProof: PokerShuffleProof,
  // initialEnctyptedDeck: initialEnctyptedPokerDeck,
  shuffle: pokerShuffle,
} = createShuffleProof(
  PokerEncryptedDeck as any,
  pokerInitialEnctyptedDeck,
  PokerEncryptedCard as any,
  PokerPermutationMatrix,
  POKER_DECK_SIZE,
); // #TODO remove any

export const {
  DecryptProofPublicInput: PokerDecryptProofPublicInput,
  DecryptProofPublicOutput: PokerDecryptProofPublicOutput,
  proveDecrypt: provePokerDecrypt,
  DecryptProgramm: PokerDecryptProgram,
  DecryptProof: PokerDecryptProof,
} = getDecryptProof();

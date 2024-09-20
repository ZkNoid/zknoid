import { Bool, FlexibleProvablePure, Provable, Struct } from 'o1js';
import { IEncrypedCard } from './interfaces/IEncryptedCard';
import { getPermutationMatrix } from './Permutation';

export function EncryptedDeckBase<C, EC extends IEncrypedCard<C>>(
  ecType: {
    fromJSONString(v: string): EC;
    zero(): EC;
  },
  card: FlexibleProvablePure<EC>,
  deckSize: number,
) {
  class PermutationMatrix extends getPermutationMatrix(deckSize) {}

  class EncryptedDeckBase extends Struct({
    cards: Provable.Array(card, deckSize),
  }) {
    static fromJSONString(data: string) {
      let cards: EC[] = [];
      let cardsJSONs = JSON.parse(data);
      for (let i = 0; i < deckSize; i++) {
        cards.push(ecType.fromJSONString(cardsJSONs[i]) as EC);
      }

      return new EncryptedDeckBase({
        cards,
      });
    }

    equals(ed: EncryptedDeckBase): Bool {
      let res = new Bool(true);
      for (let i = 0; i < this.cards.length; i++) {
        res = res.and(this.cards[i].equals(ed.cards[i]));
      }

      return res;
    }

    toJSONString(): string {
      let cardsJSONs = [];
      for (let i = 0; i < this.cards.length; i++) {
        cardsJSONs.push(this.cards[i].toJSONString());
      }

      return JSON.stringify(cardsJSONs);
    }

    applyPermutation(permutation: PermutationMatrix): EncryptedDeckBase {
      if (deckSize != permutation.getSize()) {
        throw Error(
          `deckSize is not equal to permutation size ${deckSize} != ${permutation.getSize()}`,
        );
      }

      let final = EncryptedDeckBase.fromJSONString(this.toJSONString()); // Is it proper copy for proof?

      for (let i = 0; i < permutation.getSize(); i++) {
        let res = ecType.zero();

        for (let j = 0; j < permutation.getSize(); j++) {
          res = res.add(this.cards[j].mul(permutation.getValue(i, j))) as EC;
        }

        final.cards[i] = res;
      }

      return final;
    }
  }

  return {
    PermutationMatrix,
    EncryptedDeckBase,
  };
}

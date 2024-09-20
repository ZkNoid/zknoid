import { IEncrypedCard } from './IEncryptedCard';

export interface IEncryptedDeck<EC extends IEncrypedCard<any>> {
  cards: EC[];
  applyPermutation: (permutation: any) => this;
}

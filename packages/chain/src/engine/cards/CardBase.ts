import { Group, Struct, UInt64 } from 'o1js';
import { ICard } from './interfaces/ICard';

export function toEncryptedCardHelper<EC>(
  type: new (value: any) => EC,
  index: UInt64,
): EC {
  return new type({
    value: [Group.zero, Group.generator.scale(index.add(1).value), Group.zero],
    numOfEncryption: UInt64.zero,
  });
}

// Idealy user would inherit from this and Struct, but ts ineritance from two class is pain in the ass
export abstract class CardBase<EC> implements ICard<EC> {
  abstract getIndex(): UInt64;
  abstract toEncryptedCard(): EC;

  toEncryptedCardHelper(type: new (value: any) => EC): EC {
    return new type({
      value: [
        Group.zero,
        Group.generator.scale(this.getIndex().add(1).value),
        Group.zero,
      ],
      numOfEncryption: UInt64.zero,
    });
  }
}

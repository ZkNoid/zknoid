import { UInt64 } from 'o1js';

export interface ICard<EC> {
  getIndex(): UInt64;
  toEncryptedCard(): EC;
}

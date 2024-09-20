import { Bool, Group, UInt64 } from 'o1js';

export interface IEncrypedCard<C> {
  equals(other: ThisType<this>): Bool;
  toCard(): C;
  add(ec: ThisType<this>): ThisType<this>;
  mul(ec: ThisType<this>): ThisType<this>;
  addDecryption(decPart: Group): void;
  numOfEncryption: UInt64;
  toJSONString(): string;
  value: Group[];
}

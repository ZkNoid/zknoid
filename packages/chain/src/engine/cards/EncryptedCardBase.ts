import { Bool, Group, PrivateKey, Provable, Struct, UInt64 } from 'o1js';
import { decryptOne } from '../ElGamal';

export class EncryptedCardBase extends Struct({
  value: Provable.Array(Group, 3),
  numOfEncryption: UInt64,
}) {
  static zero<T extends EncryptedCardBase>(): T {
    return <T>new EncryptedCardBase({
      value: [Group.zero, Group.zero, Group.zero],
      numOfEncryption: UInt64.zero,
    });
  }
  static fromJSONString<T extends EncryptedCardBase>(data: string): T {
    let { v1, v2, v3, numOfEncryption } = JSON.parse(data);

    return <T>new EncryptedCardBase({
      value: [Group.fromJSON(v1), Group.fromJSON(v2), Group.fromJSON(v3)],
      numOfEncryption: UInt64.fromJSON(numOfEncryption),
    });
  }

  // !Equals do not check this.value[2]!
  equals(ec: EncryptedCardBase): Bool {
    return this.value[0]
      .equals(ec.value[0])
      .and(this.value[1].equals(ec.value[1]))
      .and(this.numOfEncryption.equals(ec.numOfEncryption));
  }

  toJSONString(): string {
    let v1 = this.value[0].toJSON();
    let v2 = this.value[1].toJSON();
    let v3 = this.value[2].toJSON();
    let numOfEncryption = this.numOfEncryption.toJSON();

    return JSON.stringify({ v1, v2, v3, numOfEncryption });
  }

  copy(): EncryptedCardBase {
    return EncryptedCardBase.fromJSONString(this.toJSONString());
  }

  // Used for permutation. Do not make sense otherwise. num can be only 0 or 1
  mul(num: UInt64): EncryptedCardBase {
    num.assertLessThan(UInt64.from(2));
    return Provable.if(
      num.equals(UInt64.zero),
      EncryptedCardBase,
      EncryptedCardBase.zero(),
      this,
    ) as EncryptedCardBase;
  }

  // Used for permutation. Do not make sense otherwise
  add(ec: EncryptedCardBase): EncryptedCardBase {
    return new EncryptedCardBase({
      value: [
        this.value[0].add(ec.value[0]),
        this.value[1].add(ec.value[1]),
        this.value[2].add(ec.value[2]),
      ],
      numOfEncryption: this.numOfEncryption.add(ec.numOfEncryption),
    });
  }

  addDecryption(decPart: Group): void {
    this.value[2] = this.value[2].add(decPart);
    let subValue = Provable.if(
      // UInt64 shoud be replaced by Protokit UInt64, but for now we have this workaround
      this.numOfEncryption.greaterThan(UInt64.zero),
      UInt64.from(1),
      UInt64.zero,
    );
    this.numOfEncryption = this.numOfEncryption.sub(subValue);
  }

  // No checking, that the private key is valid. So it should be made outside
  decrypt(sk: PrivateKey) {
    this.value[2] = this.value[2].add(decryptOne(sk, this.value[0]));
    this.numOfEncryption = this.numOfEncryption.sub(UInt64.from(1));
  }

  toCard() {}
}

import {
  Bool,
  Field,
  Gadgets,
  Int64,
  Poseidon,
  Provable,
  Sign,
  Struct,
  UInt8,
} from 'o1js';

const shift64divisor = `0b` + `1${'0'.repeat(64)}`;

const bitsToInt64 = (bits: Bool[], maxValue: number): Int64 => {
  if (bits.length > 64) {
    throw Error(`Wrong bits length. Expected  <= 64, got ${bits.length}`);
  }
  let result = Int64.from(0);
  result.magnitude.value = Field.fromBits(bits.slice(1, 64));
  result = result.modV2(maxValue);
  result.sgn.value = Field.fromBits(bits.slice(0, 1));

  return result;
};

// TODO: Optimize
// Now only 64 fits of 256 bits of field used. So can be 4x optimized
// Think how to use Sponge here
export class RandomGenerator extends Struct({
  seed: Field,
  source: Field,
  curValue: Field,
}) {
  static from(seed: Field): RandomGenerator {
    const source = Poseidon.hash([seed]);

    return new RandomGenerator({
      seed,
      source,
      curValue: source,
    });
  }

  getNumber(maxValue: number): Int64 {
    this.source = Poseidon.hash([this.source]);
    this.curValue = this.source;

    return bitsToInt64(this.curValue.toBits().slice(0, 64), maxValue);
  }

  // Get 4 number
  getNumbers(maxValues: number[]): [Int64, Int64, Int64, Int64] {
    this.source = Poseidon.hash([this.source]);
    this.curValue = this.source;
    const result: [Int64, Int64, Int64, Int64] = [
      Int64.from(0),
      Int64.from(0),
      Int64.from(0),
      Int64.from(0),
    ];

    let bits = this.curValue.toBits();

    for (let i = 0; i < 4; i++) {
      result[i] = bitsToInt64(bits.slice(i * 64, (i + 1) * 64), maxValues[i]);
    }

    return result;
  }
}

import { Provable, Struct, UInt64 } from 'o1js';

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const permutateArray = <T>(array: T[]): T[] => {
  /// Copy array
  let rest = array.slice();
  let res: T[] = [];

  while (rest.length > 0) {
    let randomIndex = getRandomInt(rest.length);
    res.push(rest.splice(randomIndex, 1)[0]);
  }

  return res;
};

export function getPermutationMatrix(size: number) {
  return class PermutationMatrix extends Struct({
    value: Provable.Array(Provable.Array(UInt64, size), size),
  }) {
    static getZeroMatrix(): PermutationMatrix {
      return new PermutationMatrix({
        value: [...Array(size).keys()].map((i) => {
          let row = new Array(size).fill(UInt64.zero);
          row[i] = UInt64.one;
          return row;
        }),
      });
    }

    static getRandomMatrix(): PermutationMatrix {
      let initital = PermutationMatrix.getZeroMatrix();
      return new PermutationMatrix({ value: permutateArray(initital.value) });
    }

    // Not provable. Should not be used inside circuits
    swap(i: number, j: number): PermutationMatrix {
      [this.value[i], this.value[j]] = [this.value[j], this.value[i]];
      return this;
    }

    getSize(): number {
      return size;
    }

    getValue(i: number, j: number): UInt64 {
      return this.value[i][j];
    }

    toString(): string {
      return this.value
        .map((row) => row.map((value) => +value.toString()))
        .reduce((prev, cur) => prev + '\n' + cur.toString(), '');
    }
  };
}

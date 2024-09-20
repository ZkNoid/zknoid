import { UInt64 } from 'o1js';

export interface IPermutationMatrix {
  // getZeroMatrix(): ThisType<this>;
  // getRandomMatrix(): ThisType<this>;
  getValue(i: number, j: number): UInt64;
  getSize(): number;
}

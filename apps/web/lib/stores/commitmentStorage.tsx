import { Field, PrivateKey, PublicKey, UInt32, UInt64 } from 'o1js';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SessionKeyStorageState {
  commitment: string;
  value: string;
  getCommitment: () => Field;
  commit: (value: number) => Field;
}

export const useCommitmentStore = create<
  SessionKeyStorageState,
  [['zustand/persist', never]]
>(
  persist(
    (set, get) => ({
      commitment: "0",
      value: "0",
      getCommitment() {
        return Field.from(this.commitment);
      },
      commit(value: number) {
        const generatedCommitment = Field.random().div(10).mul(10).add(value);
        set({
          commitment: generatedCommitment.toString(),
          value: value.toString()
        });

        return generatedCommitment;
      },
    }),
    {
      name: 'commitmentStorage',
    }
  )
);

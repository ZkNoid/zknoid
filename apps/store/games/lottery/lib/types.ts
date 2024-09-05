export interface ILotteryTicket {
  amount: bigint;
  numbers: number[];
  owner: string;
  claimed: boolean;
  funds: bigint;
  hash: string;
}

export interface ILotteryRound {
  id: number;
  bank: bigint;
  tickets: ILotteryTicket[];
  winningCombination: number[] | undefined;
}

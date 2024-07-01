import PreviousRoundItem from './ui/PreviousRoundItem';
import { TICKET_PRICE } from 'l1-lottery-contracts';
import { useWorkerClientStore } from '@/lib/stores/workerClient';
import { useChainStore } from '@/lib/stores/minaChain';
import { useNetworkStore } from '@/lib/stores/network';

export default function PreviousRounds({
  page,
  setPage,
  ROUNDS_PER_PAGE,
  roundInfos,
  roundId,
}: {
  page: number;
  setPage: (page: number) => void;
  ROUNDS_PER_PAGE: number;
  roundInfos: {
    id: number;
    bank: bigint;
    tickets: {
      amount: bigint;
      numbers: number[];
      owner: string;
      claimed: boolean;
    }[];
    winningCombination: number[] | undefined;
  }[];
  roundId: number;
}) {
  const workerClientStore = useWorkerClientStore();
  const lotteryStore = useWorkerClientStore();
  const chainStore = useChainStore();
  const networkStore = useNetworkStore();

  return (
    <div className="">
      <div className="mb-[1.33vw] text-[2.13vw]">Previous Lotteries</div>
      <div className={'flex w-full flex-row gap-[1.042vw]'}>
        <button
          className={
            'flex h-[4vw] w-[4vw] items-center justify-center rounded-[0.521vw] border border-left-accent hover:opacity-80 disabled:opacity-60'
          }
          onClick={() => setPage(page + 1)}
          disabled={
            page + 1 > roundInfos.length / ROUNDS_PER_PAGE ||
            workerClientStore.status !== 'Lottery initialized'
          }
        >
          <svg
            width="1.458vw"
            height="2.552vw"
            viewBox="0 0 28 49"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M26 46L4 24L26 2" stroke="#D2FF00" strokeWidth="5" />
          </svg>
        </button>
        <div className={'grid w-full grid-cols-2 gap-[1.042vw]'}>
          {roundInfos.map((round, index) => (
            <PreviousRoundItem
              key={index}
              round={{
                id: round.id,
                combination: round.winningCombination as [
                  number,
                  number,
                  number,
                  number,
                  number,
                  number,
                ],
                bank: Number(
                  round.tickets.map((x) => x.amount).reduce((x, y) => x + y) *
                    TICKET_PRICE.toBigInt()
                ),
                ticketsAmount: Number(
                  round.tickets.map((x) => x.amount).reduce((x, y) => x + y)
                ),
                date: {
                  start: new Date(
                    Date.now() -
                      (Number(
                        chainStore.block?.slotSinceGenesis! -
                          lotteryStore.lotteryState?.startBlock!
                      ) -
                        roundId * 480) *
                        3 *
                        60 *
                        1000
                  ),
                  end: new Date(
                    Date.now() -
                      (Number(
                        chainStore.block?.slotSinceGenesis! -
                          lotteryStore.lotteryState?.startBlock!
                      ) -
                        (roundId + 1) * 480) *
                        3 *
                        60 *
                        1000
                  ),
                },
                tickets: round.tickets
                  .filter((x) => x.owner == networkStore.address)
                  .map((x) => ({
                    numbers: x.numbers as [
                      number,
                      number,
                      number,
                      number,
                      number,
                      number,
                    ],
                    amount: Number(x.amount),
                    funds: Number(x.amount),
                    claimed: x.claimed,
                  })),
              }}
            />
          ))}
        </div>
        <button
          className={
            'flex h-[4vw] w-[4vw] items-center justify-center rounded-[0.521vw] border border-left-accent hover:opacity-80 disabled:opacity-60'
          }
          onClick={() => setPage(page - 1)}
          disabled={
            page - 1 < 0 || workerClientStore.status !== 'Lottery initialized'
          }
        >
          <svg
            width="1.458vw"
            height="2.552vw"
            viewBox="0 0 28 49"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.94922 2.68262L23.9492 24.6826L1.94922 46.6826"
              stroke="#D2FF00"
              strokeWidth="5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

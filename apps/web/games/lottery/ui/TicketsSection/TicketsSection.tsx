import { cn } from '@/lib/helpers';
import TicketCard from './ui/TicketCard';
import BuyInfoCard from './ui/BuyInfoCard';
import { useEffect, useState } from 'react';
import GetMoreTicketsButton from './ui/GetMoreTicketsButton';
import OwnedTickets from './OwnedTickets';
import PreviousRound from './PreviousRound';
import { useLotteryStore } from '@/lib/stores/lotteryStore';
import { useWorkerClientStore } from '@/lib/stores/workerClient';
import { BLOCK_PER_ROUND, TICKET_PRICE } from 'l1-lottery-contracts/build/src/constants';
import { useChainStore } from '@/lib/stores/minaChain';

export default function TicketsSection() {
  const ROUNDS_PER_PAGE = 2;
  const lotteryStore = useWorkerClientStore();

  const [ticketNumberInput, setTicketNumber] = useState('');
  const [ticketAmount, setTicketsAmount] = useState(0);
  const [ticketFinalized, setTicketFinalized] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);

  const roundsToShow = Array.from({length: ROUNDS_PER_PAGE}, (_, i) => 
    lotteryStore.lotteryRoundId - i - page * ROUNDS_PER_PAGE
  ).filter(x => x >= 0);

  const [roundInfos, setRoundInfos] = useState<{
    id: number;
    bank: bigint;
    tickets: {
        amount: bigint;
        numbers: number[];
        owner: string;
    }[];
    winningCombination: number[];
}[] | undefined>(undefined);

  useEffect(() => {
    if (!lotteryStore.offchainStateReady) return;
    (async () => {
      console.log('TIckets fetching')
      const roundInfos = await lotteryStore.getRoundsInfo(
        roundsToShow
      );
      console.log('Fetched round infos', roundInfos, Object.values(roundInfos));

      console.log('Round infos', Object.values(roundInfos));
      setRoundInfos(Object.values(roundInfos));  
    })();
  }, [page, lotteryStore.offchainStateReady]);

  // const pagesAmount = Math.ceil(previousRounds.length / ROUNDS_LIMIT);

  // const renderRounds = previousRounds.slice(
  //   (page - 1) * ROUNDS_LIMIT,
  //   page * ROUNDS_LIMIT
  // );

  const workerClientStore = useWorkerClientStore();
  const chainStore = useChainStore();

  const roundId = workerClientStore.lotteryState
    ? Math.floor(
        Number(
          chainStore.block?.slotSinceGenesis! - workerClientStore.lotteryState.startBlock
        ) / BLOCK_PER_ROUND
      )
    : 0;

  return (
    <div
      className={cn(
        'relative rounded-[0.67vw] border border-left-accent',
        'flex flex-col gap-[6vw] px-[2vw] py-[2.67vw]'
      )}
    >
      <div className="">
        <div className="grid grid-cols-2 gap-[2vw]">
          {workerClientStore.lotteryState && <OwnedTickets roundId={roundId} />}
          <div className={'flex flex-col'}>
            <div className="mb-[1.33vw] text-[2.13vw]">Buy tickets</div>
            <div className={'flex flex-row gap-[1.33vw]'}>
              <TicketCard
                symbols={ticketNumberInput}
                amount={ticketAmount}
                finalized={ticketFinalized}
                setFinalized={setTicketFinalized}
                setSymbols={setTicketNumber}
                setTicketsAmount={setTicketsAmount}
              />
              <div className={'flex flex-col gap-[1.33vw]'}>
                <BuyInfoCard
                  buttonActive={ticketAmount > 0}
                  ticketsInfo={[
                    {
                      amount: ticketAmount,
                      numbers: [...ticketNumberInput].map((x) => Number(x)),
                    },
                  ]}
                />
                <GetMoreTicketsButton />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <div className="mb-[1.33vw] text-[2.13vw]">Previous Lotteries</div>
        <div className={'flex w-full flex-row gap-[1.042vw]'}>
          <button
            className={
              'flex h-[4vw] w-[4vw] items-center justify-center rounded-[0.521vw] border border-left-accent hover:opacity-80 disabled:opacity-60'
            }
            onClick={() => setPage((prevState) => prevState - 1)}
            disabled={page - 1 < 1}
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
            {roundInfos?.map((round, index) => (
              <PreviousRound key={index} round={{
                id: round.id,
                combination: undefined, //  round.winningCombination as [number, number, number, number, number, number], TODO
                bank: Number(round.tickets.map(x => x.amount).reduce((x, y) => x + y) * TICKET_PRICE.toBigInt()),
                ticketsAmount: Number(round.tickets.map(x => x.amount).reduce((x, y) => x + y)),
                date: {
                  start: new Date(
                    Date.now() - (Number(chainStore.block?.slotSinceGenesis! - lotteryStore.lotteryState?.startBlock!) - roundId * 480) * 3 * 60 * 1000),
                  end: new Date(
                    Date.now() - (Number(chainStore.block?.slotSinceGenesis! - lotteryStore.lotteryState?.startBlock!) - (roundId + 1) * 480) * 3 * 60 * 1000),
                }
              }} />
            ))}
          </div>
          <button
            className={
              'flex h-[4vw] w-[4vw] items-center justify-center rounded-[0.521vw] border border-left-accent hover:opacity-80 disabled:opacity-60'
            }
            onClick={() => setPage((prevState) => prevState + 1)}
            disabled={page + 1 > lotteryStore.lotteryRoundId}
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
    </div>
  );
}

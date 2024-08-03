import { Pages } from '@/games/lottery/Lottery';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/helpers';
import { AnimatePresence, useScroll } from 'framer-motion';
import CustomScrollbar from '@/components/shared/CustomScrollbar';
import { useWorkerClientStore } from '@/lib/stores/workerClient';
import { useNetworkStore } from '@/lib/stores/network';
import { formatUnits } from '@/lib/unit';
import { useChainStore } from '@/lib/stores/minaChain';
import { api } from '@/trpc/react';
import { RoundsDropdown } from './ui/RoundsDropdown';
import { TicketItem } from './ui/TicketItem';
import { ILotteryRound } from '@/games/lottery/lib/types';

const CheckboxButton = ({
  text,
  isActive,
  setIsActive,
}: {
  text: string;
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
}) => {
  return (
    <button
      className={
        'flex flex-row items-center justify-center gap-[0.26vw] hover:opacity-80'
      }
      onClick={() => setIsActive(!isActive)}
    >
      <div
        className={cn(
          'flex h-[0.938vw] w-[0.938vw] flex-col items-center justify-center rounded-[0.104vw] border',
          {
            'border-foreground': !isActive,
            'border-left-accent bg-left-accent': isActive,
          }
        )}
      >
        <svg
          width="0.625vw"
          height="0.417vw"
          viewBox="0 0 14 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn('h-[0.417vw] w-[0.625vw]', { 'opacity-0': !isActive })}
        >
          <path d="M1 4L5.5 8.5L13 1" stroke="#252525" />
        </svg>
      </div>
      <span className={'font-plexsans text-[0.833vw] text-foreground'}>
        {text}
      </span>
    </button>
  );
};

export default function TicketsStorage({
  setPage,
}: {
  setPage: (page: Pages) => void;
}) {
  const PAGINATION_LIMIT = 10;
  const lotteryStore = useWorkerClientStore();
  const networkStore = useNetworkStore();
  const chainStore = useChainStore();

  const [onlyLoosing, setOnlyLoosing] = useState<boolean>(false);
  const [onlyClaimable, setOnlyClaimable] = useState<boolean>(false);
  const [currentRoundId, setCurrentRoundId] = useState<number | undefined>(
    undefined
  );
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [containerHeight, setContainerHeight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [roundInfos, setRoundInfos] = useState<ILotteryRound[]>([]);
  const [roundIds, setRoundsIds] = useState<
    { id: number; hasClaim: boolean }[]
  >([]);

  // fetch for rounds ids
  const getRoundQueryIDS = api.lotteryBackend.getRoundInfos.useQuery(
    {
      roundIds: [...Array(lotteryStore.lotteryRoundId)].map((_, i) => i),
    },
    {
      refetchInterval: 5000,
    }
  );

  useEffect(() => {
    if (!getRoundQueryIDS.data || !chainStore.block?.slotSinceGenesis) return;

    const roundInfos = getRoundQueryIDS.data!;
    setRoundsIds(
      Object.values(roundInfos).map((item) => ({
        id: item.id,
        hasClaim: !!item.tickets.find(
          (ticket) => ticket.owner === networkStore.address && ticket.funds
        ),
      }))
    );
  }, [getRoundQueryIDS.data]);

  const roundsToShow =
    currentRoundId !== undefined
      ? [currentRoundId]
      : [...Array(lotteryStore.lotteryRoundId)].map((_, i) => i);

  // fetch for rounds
  const getRoundQuery = api.lotteryBackend.getRoundInfos.useQuery(
    {
      roundIds: roundsToShow,
    },
    {
      refetchInterval: 5000,
    }
  );

  useEffect(() => {
    if (!getRoundQuery.data || !chainStore.block?.slotSinceGenesis) return;
    const roundInfos = getRoundQuery.data!;
    setRoundInfos(
      Object.values(roundInfos).filter((round) => round.winningCombination)
    );
  }, [currentRoundId, getRoundQuery.data]);

  const filterRound = (round: ILotteryRound) => {
    round.tickets = round.tickets.filter((ticket) =>
      !onlyClaimable && !onlyLoosing
        ? ticket.owner === networkStore.address
        : onlyClaimable
          ? ticket.owner === networkStore.address &&
            !!ticket.funds &&
            !ticket.claimed
          : ticket.owner === networkStore.address && !ticket.funds
    );
    return round;
  };

  const [renderRounds, setRenderRounds] = useState<typeof roundInfos | []>([]);

  useEffect(() => {
    const rounds = roundInfos
      .slice(
        (currentPage - 1) * PAGINATION_LIMIT,
        currentPage * PAGINATION_LIMIT
      )
      .map((round) => filterRound(round))
      .filter((round) => round.tickets.length != 0);
    setRenderRounds(rounds);
  }, [roundInfos, onlyLoosing, onlyClaimable, currentPage]);

  useEffect(() => {
    const refObj = containerRef.current;

    const scrollHandler = () => {
      if (
        // @ts-ignore
        refObj?.scrollHeight - refObj?.scrollTop === refObj?.clientHeight &&
        renderRounds.length < roundInfos.length
      ) {
        setCurrentPage((prevState) => prevState + 1);
      }
    };
    refObj?.addEventListener('scroll', scrollHandler);
    return () => {
      refObj?.removeEventListener('scroll', scrollHandler);
    };
  });

  useEffect(() => {
    const refObj = containerRef.current;
    const resizeHandler = () => {
      if (containerHeight != refObj?.clientHeight) {
        // @ts-ignore
        setContainerHeight(refObj?.clientHeight);
      }
    };
    resizeHandler();
    refObj?.addEventListener('resize', resizeHandler);
    return () => {
      refObj?.removeEventListener('resize', resizeHandler);
    };
  });
  const { scrollYProgress } = useScroll({ container: containerRef });

  return (
    <div
      className={
        'relative flex flex-col rounded-[0.67vw] border border-left-accent bg-bg-grey px-[2vw] py-[2.67vw]'
      }
    >
      <span
        className={
          'mb-[1.042vw] max-w-[85%] font-museo text-[1.667vw] font-bold text-foreground'
        }
      >
        Tickets storage
      </span>
      <div
        className={
          'mb-[1.563vw] flex w-full max-w-[85%] flex-row justify-between'
        }
      >
        <button
          className={
            'flex h-[1.354vw] w-[3.802vw] flex-row items-center justify-center rounded-[0.144vw] border border-foreground hover:opacity-80'
          }
          onClick={() => setPage(Pages.Main)}
        >
          <svg
            width="0.378vw"
            height="0.781vw"
            viewBox="0 0 9 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={'mr-[0.26vw] h-[0.781vw] w-[0.378vw]'}
          >
            <path d="M8.36328 0.5L1.10522 8L8.36328 15.5" stroke="#F9F8F4" />
          </svg>
          <span
            className={
              'pt-px font-museo text-[0.729vw] font-medium text-foreground'
            }
          >
            Back
          </span>
        </button>
        <div className={'flex flex-row items-center gap-[2.344vw]'}>
          <CheckboxButton
            text={'Only losing'}
            isActive={onlyLoosing}
            setIsActive={setOnlyLoosing}
          />
          <CheckboxButton
            text={'Only claimable'}
            isActive={onlyClaimable}
            setIsActive={setOnlyClaimable}
          />
          <RoundsDropdown
            currentRoundId={currentRoundId}
            setCurrentRoundId={setCurrentRoundId}
            rounds={roundIds}
          />
        </div>
      </div>

      <div className={'flex w-full max-w-[85%] flex-col  gap-0'}>
        <div
          className={cn('grid w-full grid-cols-6 pb-[0.781vw]', {
            'pr-[1.875vw]': containerHeight == 400,
          })}
        >
          <span
            className={
              'pr-[50%] text-left font-plexsans text-[0.833vw] font-medium text-foreground'
            }
          >
            Round
          </span>
          <span
            className={
              'pr-[50%] text-center font-plexsans text-[0.833vw] font-medium  text-foreground'
            }
          >
            Win combination
          </span>
          <span
            className={
              'text-center font-plexsans text-[0.833vw] font-medium text-foreground'
            }
          >
            Ticket Number
          </span>
          <span
            className={
              'text-center font-plexsans text-[0.833vw] font-medium text-foreground'
            }
          >
            Quantity
          </span>
          <span
            className={
              'text-center font-plexsans text-[0.833vw] font-medium text-foreground'
            }
          >
            Accessible rewards
          </span>
        </div>
        <div className={'flex w-full flex-row gap-[1.042vw]'}>
          <div
            ref={containerRef}
            className={
              'flex max-h-[400px] w-full flex-col gap-0 overflow-y-scroll no-scrollbar'
            }
          >
            {renderRounds.length != 0 ? (
              renderRounds.map((round, roundIndex) =>
                round.tickets.map((ticket, ticketIndex) => (
                  <TicketItem
                    key={ticketIndex}
                    roundId={round.id}
                    winCombination={round.winningCombination || []}
                    ticketNumbers={ticket.numbers.map(
                      (number, numberIndex) => ({
                        number: number,
                        win: round.winningCombination
                          ? number == round.winningCombination[numberIndex]
                          : false,
                      })
                    )}
                    combination={ticket.numbers}
                    quantity={ticket.amount}
                    hasReward={ticket.funds > 0}
                    reward={Number(formatUnits(ticket.funds)).toFixed(2)}
                    claimed={ticket.claimed}
                    hash={ticket.hash}
                  />
                ))
              )
            ) : (
              <div
                className={
                  'flex w-full items-center justify-center border-y border-foreground py-[1.42vw]'
                }
              >
                <span
                  className={'font-plexsans text-[0.833vw] text-foreground'}
                >
                  No result
                </span>
              </div>
            )}
          </div>
          <AnimatePresence initial={false} mode={'wait'}>
            {containerHeight === 400 && (
              <CustomScrollbar scrollYProgress={scrollYProgress} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

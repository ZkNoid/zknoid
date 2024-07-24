import { Pages } from '@/games/lottery/Lottery';
import { useEffect, useRef, useState } from 'react';
import { cn, sendTransaction } from '@/lib/helpers';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import CustomScrollbar from '@/components/shared/CustomScrollbar';
import { useWorkerClientStore } from '@/lib/stores/workerClient';
import { useNetworkStore } from '@/lib/stores/network';
import { formatUnits } from '@/lib/unit';
import { useChainStore } from '@/lib/stores/minaChain';
import { useNotificationStore } from '@/components/shared/Notification/lib/notificationStore';
import { api } from '@/trpc/react';

const RoundsDropdown = ({
  currentRoundId,
  setCurrentRoundId,
  rounds,
}: {
  currentRoundId: number | undefined;
  setCurrentRoundId: (roundId: number) => void;
  rounds: { id: number; hasClaim: boolean }[];
}) => {
  const [expanded, setIsExpanded] = useState<boolean>(false);
  return (
    <motion.div
      className={'relative flex min-w-[10.417vw] flex-col'}
      animate={expanded ? 'open' : 'closed'}
    >
      <motion.div
        className={cn(
          'group flex w-full cursor-pointer flex-row items-center justify-between rounded-[0.26vw] border border-foreground px-[0.26vw] py-[0.104vw] hover:border-left-accent hover:opacity-80',
          {
            'rounded-b-none': expanded,
          }
        )}
        onClick={() => setIsExpanded(!expanded)}
      >
        <span
          className={
            'font-plexsans text-[0.833vw] text-foreground group-hover:text-left-accent'
          }
        >
          {currentRoundId ? `Lottery round ${currentRoundId}` : 'Choose round'}
        </span>
        <motion.svg
          width="0.833vw"
          height="0.521vw"
          viewBox="0 0 16 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={'h-[0.521vw] w-[0.833vw]'}
          variants={{
            open: { rotate: 180 },
            closed: { rotate: 0 },
          }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
        >
          <motion.path
            d="M15 1.2447L8 8.75586L1 1.2447"
            stroke="#F9F8F4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={'group-hover:stroke-left-accent'}
          />
        </motion.svg>
      </motion.div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
            className="absolute top-full flex max-h-[15.625vw] w-full flex-col items-center overflow-hidden overflow-y-scroll rounded-b border border-t-0 border-foreground bg-bg-grey px-[0.521vw]"
          >
            {rounds.map((item, index) => (
              <div
                key={index}
                className={
                  'group flex w-full cursor-pointer flex-row justify-between border-t border-foreground py-[0.521vw] first:border-t-0'
                }
                onClick={() => {
                  if (item.id != currentRoundId) {
                    setCurrentRoundId(item.id);
                    setIsExpanded(false);
                  }
                }}
              >
                <span
                  className={
                    'font-plexsans text-[0.833vw] text-foreground group-hover:text-left-accent'
                  }
                >
                  Lottery round {item.id}
                </span>
                {item.hasClaim && (
                  <div
                    className={
                      'flex flex-col items-center justify-center rounded-[5.208vw] bg-left-accent'
                    }
                  >
                    <span
                      className={
                        'px-[0.26vw] py-[0.104vw] font-museo text-[0.625vw] font-medium text-bg-dark'
                      }
                    >
                      Claim
                    </span>
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

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

const TicketItem = ({
  roundId,
  winCombination,
  ticketNumbers,
  combination,
  quantity,
  reward,
  // chosen,
  // setChosen,
  claimed,
}: {
  roundId: number;
  winCombination: number[];
  ticketNumbers: { number: number; win: boolean }[];
  combination: number[];
  quantity: bigint;
  reward: string;
  // chosen: boolean;
  // setChosen: (chosen: boolean) => void;
  claimed: boolean;
}) => {
  const workerStore = useWorkerClientStore();
  const networkStore = useNetworkStore();
  const chainStore = useChainStore();
  const notificationStore = useNotificationStore();
  const getRoundQuery = api.lotteryBackend.getRoundInfo.useQuery({
    roundId,
  });
  const claimTicket = async (numbers: number[], amount: number) => {
    let txJson = await workerStore.getReward(
      networkStore.address!,
      networkStore.minaNetwork!.networkID,
      roundId,
      numbers,
      amount
    );

    console.log('txJson', txJson);
    await sendTransaction(txJson)
      .then(() => {
        notificationStore.create({
          type: 'success',
          message: 'Transaction sent',
          isDismissible: true,
          dismissAfterDelay: true,
        });
      })
      .catch((error) => {
        console.log('Error while sending transaction', error);
        notificationStore.create({
          type: 'error',
          message: 'Error while sending transaction',
          isDismissible: true,
          dismissAfterDelay: true,
          dismissDelay: 10000,
        });
      });
  };

  return (
    <div
      className={
        'grid w-full grid-cols-7 grid-rows-1 border-t border-foreground py-[0.521vw] last:border-b hover:bg-[#464646]'
      }
    >
      <div className={'flex w-full items-center justify-center pr-[40%]'}>
        <span className={'font-plexsans text-[0.833vw] text-foreground'}>
          {roundId}
        </span>
      </div>
      <div
        className={
          'flex flex-row items-center justify-center gap-[0.781vw]  pr-[40%]'
        }
      >
        {winCombination.map((item, index) => (
          <span
            className={'font-plexsans text-[0.833vw] text-foreground'}
            key={index}
          >
            {item}
          </span>
        ))}
      </div>
      <div className={'flex flex-row items-center justify-center gap-[0.26vw]'}>
        {ticketNumbers.map((item, index) => (
          <div
            key={index}
            className={cn(
              'flex h-[1.354vw] w-[1.354vw] items-center justify-center rounded-[0.104vw] border border-foreground font-plexsans text-[0.833vw] text-foreground',
              {
                'border-left-accent bg-left-accent text-bg-dark': item.win,
              }
            )}
          >
            {item.number}
          </div>
        ))}
      </div>
      <div className={'flex w-full items-center justify-center'}>
        <span className={'font-plexsans text-[0.833vw] text-foreground'}>
          {quantity}
        </span>
      </div>
      <div className={'flex w-full items-center justify-center'}>
        <span className={'font-plexsans text-[0.833vw] text-foreground'}>
          {reward} MINA
        </span>
      </div>
      {/*<div />*/}
      {/*<div className={'flex w-full items-center justify-center'}>*/}
      {/*  <button*/}
      {/*    className={cn(*/}
      {/*      'flex h-[0.938vw] w-[0.938vw] cursor-pointer flex-col items-center justify-center rounded-[0.104vw] border hover:opacity-80',*/}
      {/*      {*/}
      {/*        'border-foreground': !chosen,*/}
      {/*        'border-left-accent bg-left-accent': chosen,*/}
      {/*      }*/}
      {/*    )}*/}
      {/*    onClick={() => setChosen(true)}*/}
      {/*  >*/}
      {/*    <svg*/}
      {/*      width="0.625vw"*/}
      {/*      height="0.417vw"*/}
      {/*      viewBox="0 0 14 10"*/}
      {/*      fill="none"*/}
      {/*      xmlns="http://www.w3.org/2000/svg"*/}
      {/*      className={cn('h-[0.417vw] w-[0.625vw]', { 'opacity-0': !chosen })}*/}
      {/*    >*/}
      {/*      <path d="M1 4L5.5 8.5L13 1" stroke="#252525" />*/}
      {/*    </svg>*/}
      {/*  </button>*/}
      {/*</div>*/}
      {!!reward && !claimed && (
        <div className={'col-span-2 flex w-full items-center justify-center'}>
          <button
            className={
              'w-1/2 rounded-[0.26vw] bg-left-accent px-[1.51vw] py-[0.26vw] font-museo text-[0.833vw] font-medium text-bg-dark hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60'
            }
            onClick={() => claimTicket(combination, Number(quantity))}
            disabled={claimed || !reward || !workerStore.lotteryCompiled}
          >
            Claim
          </button>
        </div>
      )}
    </div>
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

  const [roundInfos, setRoundInfos] = useState<
    {
      id: number;
      bank: bigint;
      tickets: {
        amount: bigint;
        numbers: number[];
        owner: string;
        claimed: boolean;
        funds: bigint;
      }[];
      winningCombination: number[] | undefined;
    }[]
  >([]);
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

  const roundsToShow = currentRoundId
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

    console.log('Tickets fetching', roundsToShow);
    const roundInfos = getRoundQuery.data!;
    console.log('Fetched round infos', roundInfos);
    console.log('Fetched round infos2', Object.values(roundInfos));

    console.log('Round infos', Object.values(roundInfos));
    setRoundInfos(Object.values(roundInfos));
  }, [currentRoundId, getRoundQuery.data]);

  const renderRounds = roundInfos.slice(
    (currentPage - 1) * PAGINATION_LIMIT,
    currentPage * PAGINATION_LIMIT
  );

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
        <div className={'grid w-full grid-cols-7 pb-[0.781vw] pr-[1.875vw]'}>
          <span
            className={
              'pr-[40%] text-center font-plexsans text-[0.833vw] font-medium text-foreground'
            }
          >
            Round
          </span>
          <span
            className={
              'pr-[40%] text-center font-plexsans text-[0.833vw] font-medium  text-foreground'
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
          {/*<span*/}
          {/*  className={*/}
          {/*    'text-center font-plexsans text-[0.833vw] font-medium text-foreground'*/}
          {/*  }*/}
          {/*>*/}
          {/*  Chosen*/}
          {/*</span>*/}
        </div>
        <div className={'flex w-full flex-row gap-[1.042vw]'}>
          <div
            ref={containerRef}
            className={
              'flex max-h-[400px] w-full flex-col gap-0 overflow-y-scroll no-scrollbar'
            }
          >
            {renderRounds
              .filter(
                (filterRound) =>
                  filterRound.winningCombination &&
                  filterRound.tickets.length != 0
              )
              .map((round, roundIndex) =>
                round.tickets
                  .filter(
                    (filterTicket) =>
                      filterTicket.owner === networkStore.address &&
                      filterTicket.funds
                  )
                  .map((ticket, ticketIndex) => (
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
                      reward={Number(formatUnits(ticket.funds)).toFixed(2)}
                      // chosen={false}
                      // setChosen={() => {}}
                      claimed={ticket.claimed}
                    />
                  ))
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

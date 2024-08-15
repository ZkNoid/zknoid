import { cn, formatAddress } from '@/lib/helpers';
import { useRoundTimer } from '@/games/lottery/features/useRoundTimer';
import { useWorkerClientStore } from '@/lib/stores/workerClient';
import { DateTime } from 'luxon';
import BouncyLoader from '@/components/shared/BouncyLoader';
import Skeleton from '@/components/shared/Skeleton';
import { formatUnits } from '@/lib/unit';
import { Currency } from '@/constants/currency';
import { Pages } from '@/games/lottery/Lottery';
import { api } from '@/trpc/react';
import { useEffect, useState } from 'react';

export default function CenterConsole({
  roundToShow,
  roundEndsIn,
  roundInfo,
  setPage,
}: {
  roundToShow: number;
  roundEndsIn: DateTime;
  roundInfo:
    | {
        id: number;
        bank: bigint;
        tickets: {
          amount: bigint;
          numbers: number[];
          owner: string;
          funds: bigint | undefined;
        }[];
        winningCombination: number[] | undefined;
      }
    | undefined;
  setPage: (page: Pages) => void;
}) {
  const roundTimer = useRoundTimer(roundEndsIn);
  const lotteryStore = useWorkerClientStore();

  const [userAddresses, setUserAddresses] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<
    { userAddress: string; name: string | undefined }[]
  >([]);

  const getAccountsQuery = api.accounts.getAccounts.useQuery({
    userAddresses: userAddresses,
  });

  useEffect(() => {
    if (getAccountsQuery.data) {
      if (getAccountsQuery.data.accounts) {
        // @ts-ignore
        setAccounts(getAccountsQuery.data.accounts);
      }
    }
  }, [getAccountsQuery.data]);

  const leaderboard = roundInfo?.tickets
    .filter((ticket) => !!ticket.funds)
    .sort((a, b) => (b.funds! > a.funds! ? 1 : -1))
    .slice(0, 3)
    .map((ticket) => ({
      owner: ticket.owner,
      funds: ticket.funds,
    }));

  useEffect(() => {
    if (leaderboard && leaderboard.length != 0) {
      setUserAddresses(leaderboard.map((item) => item.owner));
    }
  }, [leaderboard?.length]);

  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 mx-auto h-[13vw] w-[19.4vw]">
      <div
        className={cn('mt-[1vw] flex h-full w-[17.969vw] flex-col', {
          'items-center justify-center':
            roundToShow == lotteryStore.lotteryRoundId ||
            (roundToShow != lotteryStore.lotteryRoundId &&
              !roundInfo?.winningCombination),
        })}
      >
        <div
          className={
            'w-full text-center font-museo text-[1.45vw] font-bold uppercase'
          }
        >
          {roundToShow != lotteryStore.lotteryRoundId
            ? `Round ${roundToShow} finished`
            : `Lottery Round ${roundToShow}`}
        </div>
        <div
          className={cn('flex h-full flex-row gap-[0.781vw]', {
            'mt-[0.938vw]':
              roundToShow == lotteryStore.lotteryRoundId ||
              (roundToShow != lotteryStore.lotteryRoundId &&
                !roundInfo?.winningCombination),
            'w-full':
              roundInfo?.winningCombination &&
              roundToShow != lotteryStore.lotteryRoundId,
          })}
        >
          {roundToShow == lotteryStore.lotteryRoundId ? (
            <>
              <div className={'flex flex-col gap-0'}>
                <div className="flex h-[5.469vw] w-[5.469vw] items-center justify-center rounded-[0.67vw] bg-white text-center font-museo text-[4.219vw] font-bold text-bg-dark">
                  {!!roundTimer.startsIn.hours
                    ? roundTimer.startsIn.hours < 10
                      ? '0' + roundTimer.startsIn.hours
                      : roundTimer.startsIn.hours
                    : '00'}
                </div>
                <span className={'text-center font-plexsans text-[0.625vw]'}>
                  Hours
                </span>
              </div>
              <div className={'flex flex-col gap-0'}>
                <div className="flex h-[5.469vw] w-[5.469vw] items-center justify-center rounded-[0.67vw] bg-white text-center font-museo text-[4.219vw] font-bold text-bg-dark">
                  {!!roundTimer.startsIn.minutes
                    ? roundTimer.startsIn.minutes < 10
                      ? '0' + roundTimer.startsIn.minutes
                      : roundTimer.startsIn.minutes
                    : '00'}
                </div>
                <span className={'text-center font-plexsans text-[0.625vw]'}>
                  Minutes
                </span>
              </div>
              <div className={'flex flex-col gap-0'}>
                <div className="flex h-[5.469vw] w-[5.469vw] items-center justify-center rounded-[0.67vw] bg-white text-center font-museo text-[4.219vw] font-bold text-bg-dark">
                  {!!roundTimer.startsIn.seconds
                    ? Math.trunc(roundTimer.startsIn.seconds) < 10
                      ? '0' + Math.trunc(roundTimer.startsIn.seconds)
                      : Math.trunc(roundTimer.startsIn.seconds)
                    : '00'}
                </div>
                <span className={'text-center font-plexsans text-[0.625vw]'}>
                  Seconds
                </span>
              </div>
            </>
          ) : roundInfo?.winningCombination ? (
            <div
              className={cn('flex w-full flex-col items-center gap-[0.26vw]', {
                'justify-start': roundInfo.tickets.length != 0,
                'justify-center': roundInfo.tickets.length == 0,
              })}
            >
              <span className={'font-museo text-[1.042vw] font-bold'}>
                {roundInfo.tickets.length != 0
                  ? 'Top 3 winners in this round'
                  : 'This round has no tickets'}
              </span>
              {roundInfo.tickets.length != 0 && (
                <>
                  {leaderboard ? (
                    <>
                      {leaderboard.map((item, index) => (
                        <div
                          key={index}
                          className={
                            'flex w-full flex-row items-center justify-start gap-[0.625vw] rounded-[0.26vw] bg-[#252525]'
                          }
                        >
                          {index == 0 ? (
                            <svg
                              width="1.25vw"
                              height="1.25vw"
                              viewBox="0 0 18 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className={'h-[1.25vw] w-[1.25vw]'}
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M1.00292 0C0.475775 0 0.0429182 0.437143 0.0429182 0.977143V5.94C0.0429182 6.28286 0.224632 6.60857 0.518632 6.78L3.16463 8.34686C2.16916 9.18478 1.36978 10.231 0.822973 11.4117C0.77263 11.5205 0.724541 11.63 0.678721 11.7405C0.242188 12.7386 0 13.8412 0 15.0003C0 15.0244 0.000104565 15.0484 0.000313266 15.0725C1.24227e-05 15.1083 -7.18317e-05 15.1441 6.09178e-05 15.18C6.09178e-05 20.0511 3.85292 24 8.60577 24C13.3586 24 17.2115 20.0511 17.2115 15.18C17.2164 13.8861 16.9388 12.6067 16.3979 11.4312C15.8571 10.2557 15.0662 9.21241 14.0803 8.37429L16.7203 6.78C17.0075 6.60857 17.1858 6.28286 17.1858 5.94V0.977143C17.1858 0.437143 16.7623 0 16.2455 0H1.00292ZM13.4572 0.857143V7.89429C12.7709 7.4124 12.017 7.03487 11.2201 6.774V0.857143H13.4572ZM6.0772 0.857143V6.74657C5.28534 6.99634 4.53446 7.36109 3.84863 7.82914V0.857143H6.0772ZM5.84201 19.7145H11.41V18.5899H9.29801V10.0322H8.09115L5.77344 12.2814L6.59629 13.1317L7.50144 12.2402C7.75744 11.9842 7.91287 11.8014 7.96772 11.6917H7.99515L7.98144 12.2814V18.5899H5.84201V19.7145Z"
                                fill="#D2FF00"
                              />
                            </svg>
                          ) : index == 1 ? (
                            <svg
                              width="1.25vw"
                              height="1.25vw"
                              viewBox="0 0 18 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className={'h-[1.25vw] w-[1.25vw]'}
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M1.00292 0C0.475775 0 0.0429182 0.437143 0.0429182 0.977143V5.94C0.0429182 6.28286 0.224632 6.60857 0.518632 6.78L3.16463 8.34686C2.16916 9.18478 1.36978 10.231 0.822973 11.4117C0.77263 11.5205 0.724541 11.63 0.678721 11.7405C0.242188 12.7386 0 13.8412 0 15.0003C0 15.0244 0.000104565 15.0484 0.000313266 15.0725C1.24227e-05 15.1083 -7.18317e-05 15.1441 6.09178e-05 15.18C6.09178e-05 20.0511 3.85292 24 8.60577 24C13.3586 24 17.2115 20.0511 17.2115 15.18C17.2164 13.8861 16.9388 12.6067 16.3979 11.4312C15.8571 10.2557 15.0662 9.21241 14.0803 8.37429L16.7203 6.78C17.0075 6.60857 17.1858 6.28286 17.1858 5.94V0.977143C17.1858 0.437143 16.7623 0 16.2455 0H1.00292ZM13.4572 0.857143V7.89429C12.7709 7.4124 12.017 7.03487 11.2201 6.774V0.857143H13.4572ZM6.0772 0.857143V6.74657C5.28534 6.99634 4.53446 7.36109 3.84863 7.82914V0.857143H6.0772ZM4.95703 18.9735C4.95703 19.1472 4.97989 19.394 5.0256 19.714H11.581V17.3003H10.3879V18.5895H6.43817C6.43817 18.2786 6.52503 17.9815 6.69875 17.698C6.87246 17.4146 7.09646 17.1632 7.37075 16.9438C7.65417 16.7152 7.96503 16.4912 8.30332 16.2718C8.6416 16.0432 8.97989 15.8055 9.31817 15.5586C9.6656 15.3118 9.97646 15.0558 10.2507 14.7906C10.5342 14.5163 10.7627 14.1963 10.9365 13.8306C11.1102 13.4649 11.197 13.0718 11.197 12.6512C11.197 11.8192 10.909 11.1472 10.333 10.6352C9.76617 10.1232 9.03475 9.86719 8.13875 9.86719C7.34332 9.86719 6.66675 10.082 6.10903 10.5118C5.89875 10.6672 5.70217 10.85 5.51932 11.0603C5.35475 11.2523 5.20389 11.4672 5.06675 11.7049L6.02675 12.3632L6.24617 12.034C6.41075 11.8055 6.64846 11.5952 6.95932 11.4032C7.2976 11.1838 7.65417 11.074 8.02903 11.074C8.55017 11.074 8.97075 11.2249 9.29075 11.5266C9.61075 11.8192 9.77075 12.2123 9.77075 12.706C9.77075 13.026 9.67932 13.3323 9.49646 13.6249C9.32275 13.9083 9.09417 14.1643 8.81075 14.3929C8.52732 14.6215 8.21189 14.85 7.86446 15.0786C7.52617 15.3072 7.18789 15.554 6.8496 15.8192C6.51132 16.0752 6.20046 16.3495 5.91703 16.642C5.6336 16.9255 5.40046 17.2683 5.2176 17.6706C5.04389 18.0729 4.95703 18.5072 4.95703 18.9735Z"
                                fill="#D2FF00"
                              />
                            </svg>
                          ) : (
                            <svg
                              width="1.25vw"
                              height="1.25vw"
                              viewBox="0 0 18 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className={'h-[1.25vw] w-[1.25vw]'}
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M1.00292 0C0.475775 0 0.0429182 0.437143 0.0429182 0.977143V5.94C0.0429182 6.28286 0.224632 6.60857 0.518632 6.78L3.16463 8.34686C2.16916 9.18478 1.36978 10.231 0.822973 11.4117C0.77263 11.5205 0.724541 11.63 0.678721 11.7405C0.242188 12.7386 0 13.8412 0 15.0003C0 15.0244 0.000104565 15.0484 0.000313266 15.0725C1.24227e-05 15.1083 -7.18317e-05 15.1441 6.09178e-05 15.18C6.09178e-05 20.0511 3.85292 24 8.60577 24C13.3586 24 17.2115 20.0511 17.2115 15.18C17.2164 13.8861 16.9388 12.6067 16.3979 11.4312C15.8571 10.2557 15.0662 9.21241 14.0803 8.37429L16.7203 6.78C17.0075 6.60857 17.1858 6.28286 17.1858 5.94V0.977143C17.1858 0.437143 16.7623 0 16.2455 0H1.00292ZM13.4572 0.857143V7.89429C12.7709 7.4124 12.017 7.03487 11.2201 6.774V0.857143H13.4572ZM6.0772 0.857143V6.74657C5.28534 6.99634 4.53446 7.36109 3.84863 7.82914V0.857143H6.0772ZM6.08904 13.2485H7.28218V12.0142H9.98389C10.1027 12.0142 10.2673 12.0005 10.4776 11.9731V12.0005L10.409 12.0416L10.1073 12.3571L7.74846 15.1959L8.06389 15.9091C8.19189 15.8908 8.38389 15.8816 8.63989 15.8816C9.26161 15.8816 9.77361 16.0462 10.1759 16.3754C10.5782 16.6954 10.7793 17.1296 10.7793 17.6782C10.7793 18.2176 10.5828 18.6565 10.1896 18.9948C9.79646 19.3422 9.33018 19.5159 8.79075 19.5159C8.14161 19.5159 7.49704 19.2874 6.85704 18.8302C6.70161 18.7022 6.55989 18.5742 6.43189 18.4462L5.71875 19.4199L5.85589 19.5571C6.66961 20.3434 7.67075 20.7365 8.85932 20.7365C9.83761 20.7365 10.633 20.4348 11.2456 19.8314C11.8673 19.2096 12.1782 18.4736 12.1782 17.6234C12.1782 16.7639 11.8993 16.1102 11.3416 15.6622C10.7747 15.1868 10.1393 14.9171 9.43532 14.8531L11.9999 11.8359V10.8896H6.08904V13.2485Z"
                                fill="#D2FF00"
                              />
                            </svg>
                          )}
                          <span
                            className={
                              'py-[0.25vw] font-museo text-[0.833vw] font-medium text-foreground'
                            }
                          >
                            {accounts.find(
                              (account) => account.userAddress === item.owner
                            )?.name || formatAddress(item.owner)}
                          </span>
                          <span
                            className={
                              'ml-auto py-[0.25vw] font-museo text-[0.833vw] font-medium text-foreground'
                            }
                          >
                            {item.funds
                              ? Number(formatUnits(item.funds)).toFixed(2)
                              : 0}{' '}
                            {Currency.MINA}
                          </span>
                        </div>
                      ))}
                      {leaderboard.length != 3 &&
                        [...Array(3 - leaderboard.length)].map((_, i) => (
                          <div
                            key={i}
                            className={
                              'flex w-full flex-row items-center justify-start gap-[0.625vw] rounded-[0.26vw] bg-[#252525]'
                            }
                          >
                            {i + leaderboard.length == 0 ? (
                              <svg
                                width="1.25vw"
                                height="1.25vw"
                                viewBox="0 0 18 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={'h-[1.25vw] w-[1.25vw]'}
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M1.00292 0C0.475775 0 0.0429182 0.437143 0.0429182 0.977143V5.94C0.0429182 6.28286 0.224632 6.60857 0.518632 6.78L3.16463 8.34686C2.16916 9.18478 1.36978 10.231 0.822973 11.4117C0.77263 11.5205 0.724541 11.63 0.678721 11.7405C0.242188 12.7386 0 13.8412 0 15.0003C0 15.0244 0.000104565 15.0484 0.000313266 15.0725C1.24227e-05 15.1083 -7.18317e-05 15.1441 6.09178e-05 15.18C6.09178e-05 20.0511 3.85292 24 8.60577 24C13.3586 24 17.2115 20.0511 17.2115 15.18C17.2164 13.8861 16.9388 12.6067 16.3979 11.4312C15.8571 10.2557 15.0662 9.21241 14.0803 8.37429L16.7203 6.78C17.0075 6.60857 17.1858 6.28286 17.1858 5.94V0.977143C17.1858 0.437143 16.7623 0 16.2455 0H1.00292ZM13.4572 0.857143V7.89429C12.7709 7.4124 12.017 7.03487 11.2201 6.774V0.857143H13.4572ZM6.0772 0.857143V6.74657C5.28534 6.99634 4.53446 7.36109 3.84863 7.82914V0.857143H6.0772ZM5.84201 19.7145H11.41V18.5899H9.29801V10.0322H8.09115L5.77344 12.2814L6.59629 13.1317L7.50144 12.2402C7.75744 11.9842 7.91287 11.8014 7.96772 11.6917H7.99515L7.98144 12.2814V18.5899H5.84201V19.7145Z"
                                  fill="#D2FF00"
                                />
                              </svg>
                            ) : i + leaderboard.length == 1 ? (
                              <svg
                                width="1.25vw"
                                height="1.25vw"
                                viewBox="0 0 18 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={'h-[1.25vw] w-[1.25vw]'}
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M1.00292 0C0.475775 0 0.0429182 0.437143 0.0429182 0.977143V5.94C0.0429182 6.28286 0.224632 6.60857 0.518632 6.78L3.16463 8.34686C2.16916 9.18478 1.36978 10.231 0.822973 11.4117C0.77263 11.5205 0.724541 11.63 0.678721 11.7405C0.242188 12.7386 0 13.8412 0 15.0003C0 15.0244 0.000104565 15.0484 0.000313266 15.0725C1.24227e-05 15.1083 -7.18317e-05 15.1441 6.09178e-05 15.18C6.09178e-05 20.0511 3.85292 24 8.60577 24C13.3586 24 17.2115 20.0511 17.2115 15.18C17.2164 13.8861 16.9388 12.6067 16.3979 11.4312C15.8571 10.2557 15.0662 9.21241 14.0803 8.37429L16.7203 6.78C17.0075 6.60857 17.1858 6.28286 17.1858 5.94V0.977143C17.1858 0.437143 16.7623 0 16.2455 0H1.00292ZM13.4572 0.857143V7.89429C12.7709 7.4124 12.017 7.03487 11.2201 6.774V0.857143H13.4572ZM6.0772 0.857143V6.74657C5.28534 6.99634 4.53446 7.36109 3.84863 7.82914V0.857143H6.0772ZM4.95703 18.9735C4.95703 19.1472 4.97989 19.394 5.0256 19.714H11.581V17.3003H10.3879V18.5895H6.43817C6.43817 18.2786 6.52503 17.9815 6.69875 17.698C6.87246 17.4146 7.09646 17.1632 7.37075 16.9438C7.65417 16.7152 7.96503 16.4912 8.30332 16.2718C8.6416 16.0432 8.97989 15.8055 9.31817 15.5586C9.6656 15.3118 9.97646 15.0558 10.2507 14.7906C10.5342 14.5163 10.7627 14.1963 10.9365 13.8306C11.1102 13.4649 11.197 13.0718 11.197 12.6512C11.197 11.8192 10.909 11.1472 10.333 10.6352C9.76617 10.1232 9.03475 9.86719 8.13875 9.86719C7.34332 9.86719 6.66675 10.082 6.10903 10.5118C5.89875 10.6672 5.70217 10.85 5.51932 11.0603C5.35475 11.2523 5.20389 11.4672 5.06675 11.7049L6.02675 12.3632L6.24617 12.034C6.41075 11.8055 6.64846 11.5952 6.95932 11.4032C7.2976 11.1838 7.65417 11.074 8.02903 11.074C8.55017 11.074 8.97075 11.2249 9.29075 11.5266C9.61075 11.8192 9.77075 12.2123 9.77075 12.706C9.77075 13.026 9.67932 13.3323 9.49646 13.6249C9.32275 13.9083 9.09417 14.1643 8.81075 14.3929C8.52732 14.6215 8.21189 14.85 7.86446 15.0786C7.52617 15.3072 7.18789 15.554 6.8496 15.8192C6.51132 16.0752 6.20046 16.3495 5.91703 16.642C5.6336 16.9255 5.40046 17.2683 5.2176 17.6706C5.04389 18.0729 4.95703 18.5072 4.95703 18.9735Z"
                                  fill="#D2FF00"
                                />
                              </svg>
                            ) : (
                              <svg
                                width="1.25vw"
                                height="1.25vw"
                                viewBox="0 0 18 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={'h-[1.25vw] w-[1.25vw]'}
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M1.00292 0C0.475775 0 0.0429182 0.437143 0.0429182 0.977143V5.94C0.0429182 6.28286 0.224632 6.60857 0.518632 6.78L3.16463 8.34686C2.16916 9.18478 1.36978 10.231 0.822973 11.4117C0.77263 11.5205 0.724541 11.63 0.678721 11.7405C0.242188 12.7386 0 13.8412 0 15.0003C0 15.0244 0.000104565 15.0484 0.000313266 15.0725C1.24227e-05 15.1083 -7.18317e-05 15.1441 6.09178e-05 15.18C6.09178e-05 20.0511 3.85292 24 8.60577 24C13.3586 24 17.2115 20.0511 17.2115 15.18C17.2164 13.8861 16.9388 12.6067 16.3979 11.4312C15.8571 10.2557 15.0662 9.21241 14.0803 8.37429L16.7203 6.78C17.0075 6.60857 17.1858 6.28286 17.1858 5.94V0.977143C17.1858 0.437143 16.7623 0 16.2455 0H1.00292ZM13.4572 0.857143V7.89429C12.7709 7.4124 12.017 7.03487 11.2201 6.774V0.857143H13.4572ZM6.0772 0.857143V6.74657C5.28534 6.99634 4.53446 7.36109 3.84863 7.82914V0.857143H6.0772ZM6.08904 13.2485H7.28218V12.0142H9.98389C10.1027 12.0142 10.2673 12.0005 10.4776 11.9731V12.0005L10.409 12.0416L10.1073 12.3571L7.74846 15.1959L8.06389 15.9091C8.19189 15.8908 8.38389 15.8816 8.63989 15.8816C9.26161 15.8816 9.77361 16.0462 10.1759 16.3754C10.5782 16.6954 10.7793 17.1296 10.7793 17.6782C10.7793 18.2176 10.5828 18.6565 10.1896 18.9948C9.79646 19.3422 9.33018 19.5159 8.79075 19.5159C8.14161 19.5159 7.49704 19.2874 6.85704 18.8302C6.70161 18.7022 6.55989 18.5742 6.43189 18.4462L5.71875 19.4199L5.85589 19.5571C6.66961 20.3434 7.67075 20.7365 8.85932 20.7365C9.83761 20.7365 10.633 20.4348 11.2456 19.8314C11.8673 19.2096 12.1782 18.4736 12.1782 17.6234C12.1782 16.7639 11.8993 16.1102 11.3416 15.6622C10.7747 15.1868 10.1393 14.9171 9.43532 14.8531L11.9999 11.8359V10.8896H6.08904V13.2485Z"
                                  fill="#D2FF00"
                                />
                              </svg>
                            )}
                            <span
                              className={
                                'py-[0.25vw] font-museo text-[0.833vw] font-medium text-foreground'
                              }
                            >
                              -
                            </span>
                            <span
                              className={
                                'ml-auto py-[0.25vw] font-museo text-[0.833vw] font-medium text-foreground'
                              }
                            >
                              0 {Currency.MINA}
                            </span>
                          </div>
                        ))}
                    </>
                  ) : (
                    <Skeleton
                      isLoading={true}
                      className={'h-[5.7vw] w-full rounded-[0.33vw]'}
                    >
                      <div />
                    </Skeleton>
                  )}
                </>
              )}
            </div>
          ) : (
            <div
              className={
                'flex h-[5.5vw] flex-col items-center justify-center gap-[0.729vw]'
              }
            >
              <BouncyLoader />
              <span className={'font-plexsans text-[0.729vw] font-light'}>
                The process of calculating the winning number...
              </span>
            </div>
          )}
        </div>
        <button
          className={cn(
            'mt-[0.8vw] flex w-full cursor-pointer items-center justify-center rounded-[0.67vw] border-bg-dark px-[1vw] font-museo text-[1.6vw] font-bold uppercase text-bg-dark hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60',
            {
              'bg-right-accent': roundToShow == lotteryStore.lotteryRoundId,
              'bg-left-accent': roundToShow != lotteryStore.lotteryRoundId,
              'mt-[1.6vw]':
                roundToShow != lotteryStore.lotteryRoundId &&
                !roundInfo?.winningCombination,
              'mt-[0.4vw]':
                roundToShow != lotteryStore.lotteryRoundId &&
                roundInfo?.winningCombination,
            }
          )}
          disabled={
            roundToShow != lotteryStore.lotteryRoundId &&
            !roundInfo?.winningCombination
          }
          // onClick={() => {
          //   const element = document.getElementById(
          //     roundToShow != lotteryStore.lotteryRoundId
          //       ? 'previousLotteries'
          //       : 'ticketsToBuy'
          //   );
          //   if (element) {
          //     const offset = element.offsetTop + element.offsetHeight;
          //     window.scrollTo({ top: offset, left: 0, behavior: 'smooth' });
          //   }
          // }}
          onClick={() => {
            if (roundToShow != lotteryStore.lotteryRoundId) {
              setPage(Pages.Storage);
            } else {
              const element = document.getElementById('ticketsToBuy');
              if (element) {
                const offset = element.offsetTop + element.offsetHeight;
                window.scrollTo({
                  top: offset,
                  left: 0,
                  behavior: 'smooth',
                });
              }
            }
          }}
        >
          {roundToShow != lotteryStore.lotteryRoundId
            ? 'Claim rewards'
            : 'Buy Tickets'}
        </button>
      </div>
    </div>
  );
}

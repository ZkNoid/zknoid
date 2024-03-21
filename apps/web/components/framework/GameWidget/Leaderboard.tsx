import { useState } from 'react';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { PublicKey, UInt64 } from 'o1js';

export const Leaderboard = ({
  leaderboard,
}: {
  // leaderboard: { score: UInt64; player: PublicKey }[];
  leaderboard: { score: UInt64; player: string }[];
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const LeaderboardItem = ({
    index,
    address,
    score,
  }: {
    index: number;
    address: string;
    score: number;
  }) => {
    return (
      <div
        className={clsx(
          'flex h-full flex-row items-center justify-between font-plexsans text-header-menu',
          { 'text-left-accent': index === 0 || index === 1 || index === 2 }
        )}
      >
        <span className={'flex flex-row gap-4'}>
          {index === 0 ? (
            <svg
              width="24"
              height="20"
              viewBox="0 0 24 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.2798 8.75798L16.2796 8.75765L13.6596 4.06933C13.9631 3.69513 14.15 3.21613 14.15 2.6875C14.15 1.49037 13.1976 0.5 12 0.5C10.8024 0.5 9.85 1.49037 9.85 2.6875C9.85 3.21613 10.0369 3.69513 10.3404 4.06933L7.7204 8.75765L7.72022 8.75798C7.54995 9.06321 7.17796 9.15476 6.89942 8.98347L6.8991 8.98327L4.74956 7.66363C4.7839 7.51232 4.80344 7.353 4.80344 7.1875C4.80344 5.99037 3.85105 5 2.65344 5C1.45716 5 0.5 5.989 0.5 7.1875C0.5 8.35963 1.41303 9.33355 2.57531 9.37371L4.93056 15.7971L5.05078 16.125H5.4H18.6H18.9492L19.0694 15.7971L21.4247 9.37371C22.587 9.33355 23.5 8.35964 23.5 7.1875C23.5 5.99037 22.5476 5 21.35 5C20.1524 5 19.2 5.99037 19.2 7.1875C19.2 7.35261 19.2186 7.51157 19.2529 7.66392L17.1018 8.98271C17.1017 8.98279 17.1015 8.98287 17.1014 8.98296C16.8186 9.15547 16.4497 9.06266 16.2798 8.75798ZM4.85 16.25C4.26082 16.25 3.8 16.7376 3.8 17.3125V18.4375C3.8 19.0124 4.26082 19.5 4.85 19.5H19.15C19.7392 19.5 20.2 19.0124 20.2 18.4375V17.3125C20.2 16.7376 19.7392 16.25 19.15 16.25H4.85Z"
                stroke="#212121"
                fill="#D2FF00"
              />
            </svg>
          ) : index === 1 || index === 2 ? (
            <svg
              width="24"
              height="20"
              viewBox="0 0 24 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.2798 8.75798L16.2796 8.75765L13.6596 4.06933C13.9631 3.69513 14.15 3.21613 14.15 2.6875C14.15 1.49037 13.1976 0.5 12 0.5C10.8024 0.5 9.85 1.49037 9.85 2.6875C9.85 3.21613 10.0369 3.69513 10.3404 4.06933L7.7204 8.75765L7.72022 8.75798C7.54995 9.06321 7.17796 9.15476 6.89942 8.98347L6.8991 8.98327L4.74956 7.66363C4.7839 7.51232 4.80344 7.353 4.80344 7.1875C4.80344 5.99037 3.85105 5 2.65344 5C1.45716 5 0.5 5.989 0.5 7.1875C0.5 8.35963 1.41303 9.33355 2.57531 9.37371L4.93056 15.7971L5.05078 16.125H5.4H18.6H18.9492L19.0694 15.7971L21.4247 9.37371C22.587 9.33355 23.5 8.35964 23.5 7.1875C23.5 5.99037 22.5476 5 21.35 5C20.1524 5 19.2 5.99037 19.2 7.1875C19.2 7.35261 19.2186 7.51157 19.2529 7.66392L17.1018 8.98271C17.1017 8.98279 17.1015 8.98287 17.1014 8.98296C16.8186 9.15547 16.4497 9.06266 16.2798 8.75798ZM4.85 16.25C4.26082 16.25 3.8 16.7376 3.8 17.3125V18.4375C3.8 19.0124 4.26082 19.5 4.85 19.5H19.15C19.7392 19.5 20.2 19.0124 20.2 18.4375V17.3125C20.2 16.7376 19.7392 16.25 19.15 16.25H4.85Z"
                stroke="#D2FF00"
              />
            </svg>
          ) : (
            <span>[{index + 1}]</span>
          )}
          <span>{address}</span>
        </span>
        <span>{score}</span>
      </div>
    );
  };

  const sortByHighScore = (
    // a: { score: UInt64; player: PublicKey },
    // b: { score: UInt64; player: PublicKey }
    a: { score: UInt64; player: string },
    b: { score: UInt64; player: string }
  ) => {
    return Number(b.score) - Number(a.score);
  };

  return (
    <div className="col-start-1 col-end-2">
      <div className={'relative flex h-full w-full flex-col gap-10'}>
        <div
          className="z-10 px-5 pt-5 text-headline-2 font-bold"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          Leaderboard
        </div>
        <AnimatePresence initial={false} mode={'wait'}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: '100%' }}
              exit={{ height: 0 }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
              className={
                'relative z-10 flex flex-col gap-4 overflow-hidden px-5'
              }
            >
              <div
                className={
                  'flex flex-row justify-between font-plexsans text-header-menu'
                }
              >
                <span className={'uppercase'}>Nickname/address</span>
                <span className={'uppercase'}>Score</span>
              </div>
              <div className={'h-4 w-full bg-left-accent'} />
              {leaderboard.sort(sortByHighScore).map((item, index) => (
                <>
                  <LeaderboardItem
                    key={index}
                    index={index}
                    // address={item.player.toBase58().slice(0, 16) + '...'}
                    address={item.player.slice(0, 16) + '...'}
                    score={Number(item.score)}
                  />
                  <div className={'h-4 w-full bg-left-accent'} />
                </>
              ))}
              <button
                className={
                  'mb-5 w-full rounded-[5px] border border-bg-dark bg-left-accent py-2 text-center text-[20px]/[20px] font-medium text-dark-buttons-text hover:border-left-accent hover:bg-bg-dark hover:text-left-accent'
                }
              >
                Show my place
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className={'absolute left-0 top-0 z-0 h-full w-full'}>
          <svg
            width="349"
            height="712"
            viewBox="0 0 349 712"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className={'h-full w-full'}
          >
            <path
              d="M1 109.208V5C1 2.79086 2.79086 1 5 1H297.502C298.562 1 299.578 1.42075 300.328 2.16982L346.827 48.6107C347.578 49.361 348 50.3792 348 51.4409V707C348 709.209 346.209 711 344 711H4.99999C2.79086 711 1 709.209 1 707V109.208Z"
              fill="#252525"
              stroke="#D2FF00"
              strokeWidth="1"
            />
            <path
              d="M347 0H311.912C310.118 0 309.231 2.17836 310.515 3.43115L345.603 37.6838C346.87 38.9204 349 38.0229 349 36.2527V2C349 0.89543 348.105 0 347 0Z"
              fill="#D2FF00"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M339.557 12.1483L345.924 5.78116L344.51 4.36694L338.143 10.7341L331.776 4.36709L330.361 5.78131L336.728 12.1483L330.368 18.5091L331.782 19.9233L338.143 13.5626L344.503 19.9234L345.918 18.5092L339.557 12.1483Z"
              fill="#252525"
            />
          </svg>
        </div>
        {/*<div className="flex w-full flex-grow rounded-b-[5px] border-x-2 border-b-2 border-left-accent"></div>*/}
      </div>
    </div>
  );
};

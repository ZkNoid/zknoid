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
          'flex flex-row justify-between border-b border-left-accent pb-4 font-plexsans text-header-menu',
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
    <div className="relative col-start-1 col-end-2 flex min-h-[80vh] flex-col gap-10 p-5">
      <div
        className="text-headline-2 font-bold"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        Leaderboard
      </div>
      <AnimatePresence initial={false} mode={'wait'}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
            className={'z-10 flex flex-col gap-4 overflow-hidden'}
          >
            <div
              className={
                'flex flex-row justify-between border-b border-left-accent pb-4 font-plexsans text-header-menu'
              }
            >
              <span className={'uppercase'}>Nickname/address</span>
              <span className={'uppercase'}>Score</span>
            </div>
            {leaderboard.sort(sortByHighScore).map((item, index) => (
              <LeaderboardItem
                key={index}
                index={index}
                // address={item.player.toBase58().slice(0, 16) + '...'}
                address={item.player.slice(0, 16) + '...'}
                score={Number(item.score)}
              />
            ))}
            <button
              className={
                'w-full rounded-[5px] border border-bg-dark bg-left-accent py-2 text-center text-[20px]/[20px] font-medium text-dark-buttons-text hover:border-left-accent hover:bg-bg-dark hover:text-left-accent'
              }
            >
              Show my place
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {/*<div className="absolute left-0 top-0 z-0 flex h-full w-full flex-col">*/}
      {/*  <svg*/}
      {/*    width="700"*/}
      {/*    height="1429"*/}
      {/*    viewBox="0 0 700 1429"*/}
      {/*    fill="none"*/}
      {/*    xmlns="http://www.w3.org/2000/svg"*/}
      {/*  >*/}
      {/*    <path*/}
      {/*      d="M697.999 0H620.587C618.805 0 617.913 2.15429 619.173 3.41422L696.585 80.8265C697.845 82.0864 699.999 81.1941 699.999 79.4123V2C699.999 0.89543 699.104 0 697.999 0Z"*/}
      {/*      fill="#D2FF00"*/}
      {/*    />*/}
      {/*    <path*/}
      {/*      fillRule="evenodd"*/}
      {/*      clipRule="evenodd"*/}
      {/*      d="M681.059 24.9608L693.83 11.8784L690.993 8.97266L678.222 22.0551L665.452 8.9731L662.615 11.8788L675.386 24.9608L662.628 38.0298L665.464 40.9355L678.222 27.8665L690.981 40.936L693.817 38.0302L681.059 24.9608Z"*/}
      {/*      fill="#252525"*/}
      {/*    />*/}
      {/*    <path*/}
      {/*      d="M1 219.042V5C1 2.79086 2.79086 1 5 1H598.789C599.849 1 600.866 1.42074 601.616 2.16982L697.827 98.2616C698.578 99.0119 699 100.03 699 101.092V1423.08C699 1425.29 697.209 1427.08 695 1427.08H4.99999C2.79085 1427.08 1 1425.29 1 1423.08V219.042Z"*/}
      {/*      fill="#252525"*/}
      {/*      stroke="#D2FF00"*/}
      {/*      strokeWidth="2"*/}
      {/*    />*/}
      {/*  </svg>*/}
      {/*</div>*/}
      {/*<div className="flex w-full flex-grow rounded-b-[5px] border-x-2 border-b-2 border-left-accent" />*/}
    </div>
  );
};

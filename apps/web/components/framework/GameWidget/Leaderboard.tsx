import { useState } from 'react';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { PublicKey, UInt64 } from 'o1js';
import { useNetworkStore } from '@/lib/stores/network';
import { formatPubkey } from '@/lib/utils';

export const Leaderboard = ({
  leaderboard,
}: {
  leaderboard: { score: UInt64; player: PublicKey }[];
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isShowMyPlace, setIsShowMyPlace] = useState<boolean>(false);
  const networkStore = useNetworkStore();

  const LeaderboardItem = ({
    index,
    address,
    score,
    highlight,
  }: {
    index: number;
    address: PublicKey | 0;
    score: number;
    highlight?: boolean;
  }) => {
    return (
      <div
        className={clsx('border-b border-left-accent py-4 last:border-t', {
          'h-full': leaderboard.length >= 7 || leaderboard.length === 0,
        })}
      >
        <div
          className={clsx(
            'flex h-full flex-row items-center justify-between font-plexsans text-header-menu',
            {
              'text-left-accent':
                index === 0 || index === 1 || (index === 2 && !highlight),
              'text-right-accent': highlight,
            }
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
            <span>{address === 0 ? 0 : formatPubkey(address)}</span>
          </span>
          <span
            className={clsx({
              'text-left-accent': index === 0 || index === 1 || index === 2,
            })}
          >
            {score}
          </span>
        </div>
      </div>
    );
  };

  const sortByHighScore = (
    a: { score: UInt64; player: PublicKey },
    b: { score: UInt64; player: PublicKey }
  ) => {
    return Number(b.score) - Number(a.score);
  };

  return (
    <motion.div
      variants={{
        fullscreen: {
          gridColumnStart: 1,
          gridColumnEnd: 3,
          gridRowStart: 2,
        },
        windowed: {
          gridColumnStart: 1,
          gridColumnEnd: 2,
          gridRowStart: 1,
        },
      }}
      className="h-full max-w-[800px]"
    >
      <div
        className={clsx(
          'relative flex min-h-[120px] w-full flex-col overflow-hidden'
        )}
      >
        <div
          className="z-10 hidden cursor-pointer px-0 pb-10 pt-5 text-headline-2 font-bold hover:opacity-80 lg:block lg:px-5"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          Leaderboard
        </div>
        <div className="z-10 block px-0 pb-10 pt-5 text-headline-2 font-bold hover:opacity-80 lg:hidden lg:px-5">
          Leaderboard
        </div>
        <AnimatePresence initial={false} mode={'wait'}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
              className={
                'relative z-0 flex flex-col overflow-hidden px-0 lg:px-5'
              }
            >
              <div
                className={
                  'flex flex-row justify-between border-b border-left-accent pb-4 font-plexsans text-header-menu'
                }
              >
                <span className={'uppercase'}>Nickname/address</span>
                <span className={'uppercase'}>Score</span>
              </div>

              {/* {leaderboard.length != 0 ? (
                <> */}
              {leaderboard.toSorted(sortByHighScore).map((item, index) => (
                <LeaderboardItem
                  key={index}
                  index={index}
                  // address={item.player.toBase58().slice(0, 16) + '...'}
                  address={item.player}
                  score={Number(item.score)}
                  highlight={isShowMyPlace}
                />
              ))}
              {/* </>
              ) : ( */}
              {/* <> */}
              {[...Array(10 - leaderboard.length)].map((_, index) => (
                <LeaderboardItem
                  key={index + leaderboard.length}
                  index={index + leaderboard.length}
                  address={0}
                  score={0}
                />
              ))}
              {/* </>
              )} */}
              <div className={'flex-grow pt-4'} />
              {/*{leaderboard.find(*/}
              {/*  (item) => item.player.toBase58() === networkStore.address*/}
              {/*) && (*/}
              {/*  <button*/}
              {/*    className={*/}
              {/*      'mb-5 w-full rounded-[5px] border border-bg-dark bg-left-accent py-2 text-center text-[20px]/[20px] font-medium text-dark-buttons-text hover:border-left-accent hover:bg-bg-dark hover:text-left-accent'*/}
              {/*    }*/}
              {/*    onClick={() => setIsShowMyPlace(!isShowMyPlace)}*/}
              {/*  >*/}
              {/*    Highlight my place*/}
              {/*  </button>*/}
              {/*)}*/}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute left-0 top-0 -z-10 hidden h-auto w-full flex-col lg:block">
          <svg
            width="auto"
            height="auto"
            viewBox="0 0 349 712"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 109.208V5C1 2.79086 2.79086 1 5 1H297.502C298.562 1 299.578 1.42075 300.328 2.16982L346.827 48.6107C347.578 49.361 348 50.3792 348 51.4409V707C348 709.209 346.209 711 344 711H4.99999C2.79086 711 1 709.209 1 707V109.208Z"
              fill="#212121"
              stroke="#D2FF00"
              strokeWidth="2"
            />
            <path
              d="M347 0H311.912C310.118 0 309.231 2.17836 310.515 3.43115L345.603 37.6838C346.87 38.9204 349 38.0229 349 36.2527V2C349 0.89543 348.105 0 347 0Z"
              fill="#D2FF00"
            />
          </svg>
          <motion.div
            className={
              'absolute right-0 top-0 flex flex-col items-center justify-center max-[1850px]:h-[24px] max-[1850px]:w-[24px] min-[1850px]:h-[34px] min-[1850px]:w-[34px]'
            }
            animate={isExpanded ? 'open' : 'close'}
          >
            <motion.div
              variants={{
                open: { rotate: 45, y: 1 },
                close: { rotate: 0 },
              }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
              className={'h-[3px] w-3/4 rotate-45 bg-bg-dark'}
            />
            <motion.div
              variants={{
                open: { rotate: -45, y: -1 },
                close: { rotate: 90 },
              }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
              className={'h-[3px] w-3/4 -rotate-45 bg-bg-dark'}
            />
          </motion.div>
        </div>
        <div className="z-10 hidden w-full flex-grow border-b-2 border-left-accent lg:flex" />
      </div>
    </motion.div>
  );
};

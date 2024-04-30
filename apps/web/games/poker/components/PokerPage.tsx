import PokerCoverSVG from '@/games/poker/assets/game-cover.svg';
import GamePage from '@/components/framework/GamePage';
import { pokerConfig } from '@/games/poker/config';
import { Button } from '@/components/ui/games-store/shared/Button';
import { Currency } from '@/constants/currency';
import Image from 'next/image';
import defaultAvatar from '../assets/avatars/defaultAvatar.svg';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

export const PokerPage = () => {
  const ChatMessage = ({
    time,
    sender,
    message,
  }: {
    time: string;
    sender: string;
    message: string;
  }) => {
    return (
      <div className={'flex flex-row gap-2 font-plexsans text-[16px]/[16px]'}>
        <span className={'font-regular text-foreground'}>{time}</span>
        <span className={'font-medium text-left-accent'}>{sender}:</span>
        <span className={'font-light text-foreground'}>{message}</span>
      </div>
    );
  };

  const LogsMessage = ({
    time,
    player,
    message,
  }: {
    time: string;
    player?: string;
    message: string;
  }) => {
    return (
      <div className={'flex flex-row gap-2 font-plexsans text-[16px]/[16px]'}>
        <span className={'font-regular text-foreground'}>{time}</span>
        <span className={'font-regular text-foreground'}>[System]:</span>
        {player && (
          <>
            <span className={'text-foreground'}>Player</span>
            <span className={'font-medium text-left-accent'}>{player}</span>
          </>
        )}
        <span className={'font-light text-foreground'}>{message}</span>
      </div>
    );
  };

  const PlayerListItem = ({
    id,
    address,
    nickname,
  }: {
    id: number;
    address: string;
    nickname: string;
  }) => {
    return (
      <div
        className={
          'mb-4 flex w-full flex-row justify-between border-t border-foreground pt-4 text-[16px]/[16px] last:border-b last:pb-4'
        }
      >
        <span className={'w-[10%]'}>[{id}]</span>
        <span className={'w-[60%]'}>{address}</span>
        <span className={'w-[30%]'}>{nickname}</span>
      </div>
    );
  };

  const RulesAccordion = ({
    title,
    rules,
    defaultOpen = false,
  }: {
    title: string;
    rules: string;
    defaultOpen?: boolean;
  }) => {
    const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
    return (
      <div
        className={
          'border-t border-t-left-accent py-4 last:border-b last:border-b-left-accent'
        }
      >
        <div
          className={
            'flex cursor-pointer flex-row items-center justify-between font-museo text-[20px]/[20px] text-left-accent hover:opacity-80'
          }
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{title}</span>

          <motion.svg
            width="22"
            height="12"
            viewBox="0 0 22 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
          >
            <path
              d="M1 11L11 1L21 11"
              stroke="#D2FF00"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </div>
        <AnimatePresence initial={false} mode={'wait'}>
          {isOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
              className={
                'text-[16px]-[16px] flex items-center justify-start overflow-hidden pt-2 font-plexsans'
              }
            >
              <div>{rules}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <GamePage
      gameConfig={pokerConfig}
      image={PokerCoverSVG}
      mobileImage={'/image/game-page/game-title-mobile-template.svg'}
      defaultPage={'Game'}
    >
      <div className={'flex flex-col gap-4'}>
        <div className={'flex flex-row items-center justify-between'}>
          <div
            className={
              'flex flex-row gap-2 font-plexsans text-[20px]/[20px] font-medium uppercase text-left-accent'
            }
          >
            <span>Game Status:</span>
            <span>Game started</span>
          </div>
          <Button label={'Leave game'} className={'w-[20%]'} />
        </div>
        <div
          className={
            'flex min-h-[75vh] flex-col items-center justify-center rounded-[5px] border border-left-accent'
          }
        >
          <div className={'flex w-[60vw] flex-row items-end justify-between'}>
            <Image
              src={defaultAvatar}
              alt={'User Avatar'}
              className={
                'h-[90px] w-[90px] rounded-[5px] border border-foreground'
              }
            />
            <Image
              src={defaultAvatar}
              alt={'User Avatar'}
              className={
                'mb-10 h-[90px] w-[90px] rounded-[5px] border border-foreground'
              }
            />
            <Image
              src={defaultAvatar}
              alt={'User Avatar'}
              className={
                'h-[90px] w-[90px] rounded-[5px] border border-foreground'
              }
            />
          </div>
          <div
            className={
              'flex h-[30vh] w-[50vw] flex-col items-center justify-center rounded-full border border-left-accent'
            }
          >
            <div className={'flex w-[90%] flex-row justify-between'}>
              <div className={'flex h-full flex-col'}>
                <span
                  className={
                    'rounded-full bg-left-accent p-2 uppercase text-bg-dark'
                  }
                >
                  150 {Currency.ZNAKES}
                </span>
              </div>
              <div className={'flex flex-row gap-2'}>
                <div
                  className={
                    'h-[150px] w-[120px] rounded-[5px] border border-foreground'
                  }
                />
                <div
                  className={
                    'h-[150px] w-[120px] rounded-[5px] border border-foreground'
                  }
                />
                <div
                  className={
                    'h-[150px] w-[120px] rounded-[5px] border border-foreground'
                  }
                />
                <div
                  className={
                    'h-[150px] w-[120px] rounded-[5px] border border-foreground'
                  }
                />
                <div
                  className={
                    'h-[150px] w-[120px] rounded-[5px] border border-foreground'
                  }
                />
              </div>
            </div>
          </div>
          <div className={'flex w-[60vw] flex-row items-start justify-between'}>
            <Image
              src={defaultAvatar}
              alt={'User Avatar'}
              className={
                'h-[90px] w-[90px] rounded-[5px] border border-foreground'
              }
            />
            <Image
              src={defaultAvatar}
              alt={'User Avatar'}
              className={
                'mt-10 h-[90px] w-[90px] rounded-[5px] border border-foreground'
              }
            />
            <Image
              src={defaultAvatar}
              alt={'User Avatar'}
              className={
                'h-[90px] w-[90px] rounded-[5px] border border-foreground'
              }
            />
          </div>
        </div>
        <div className={'flex flex-row gap-8'}>
          <div className={'flex w-full flex-col gap-0'}>
            <div className={'flex max-w-fit flex-row gap-0'}>
              <span
                className={
                  'rounded-t-[5px] bg-left-accent px-12 py-2 font-plexsans text-[16px]/[16px] font-medium uppercase text-bg-dark'
                }
              >
                Chat
              </span>
              <div
                className={
                  '-ml-0.5 border-[20px] border-solid border-b-left-accent border-l-left-accent border-r-transparent border-t-transparent'
                }
              />
            </div>
            <div
              className={
                'flex flex-col gap-2 rounded-[5px] rounded-tl-none border border-left-accent p-2'
              }
            >
              {[...Array(4)].map((_, index) => (
                <ChatMessage
                  key={index}
                  time={'00:00'}
                  sender={'NeoGar'}
                  message={'Lorem ipsum dolor sit amet, consectetur.'}
                />
              ))}
            </div>
          </div>
          <div className={'flex w-full flex-col gap-0'}>
            <div className={'flex max-w-fit flex-row gap-0'}>
              <span
                className={
                  'rounded-t-[5px] bg-left-accent px-12 py-2 font-plexsans text-[16px]/[16px] font-medium uppercase text-bg-dark'
                }
              >
                Logs
              </span>
              <div
                className={
                  '-ml-0.5 border-[20px] border-solid border-b-left-accent border-l-left-accent border-r-transparent border-t-transparent'
                }
              />
            </div>
            <div
              className={
                'flex flex-col gap-2 rounded-[5px] rounded-tl-none border border-left-accent p-2'
              }
            >
              <LogsMessage
                time={'00:00'}
                player={'NeoGar'}
                message={'Raise bet [15 $znakes]'}
              />
              <LogsMessage time={'00:00'} player={'NeoGar'} message={'Fold'} />
              <LogsMessage
                time={'00:00'}
                player={'NeoGar'}
                message={'Raise bet [25 $znakes]'}
              />
              <LogsMessage
                time={'00:00'}
                player={'NeoGar'}
                message={'Raise bet [30 $znakes]'}
              />
            </div>
          </div>
        </div>
        <div className={'grid w-full grid-cols-3 gap-8'}>
          <div className={'flex flex-col gap-8'}>
            <div className={'flex flex-col gap-4'}>
              <span className={'font-museo text-headline-3 font-bold'}>
                Lobby Information
              </span>
              <div className={'flex flex-col gap-2'}>
                <div
                  className={
                    'flex flex-row justify-between font-plexsans text-[16px]/[16px]'
                  }
                >
                  <span className={'font-medium uppercase text-left-accent'}>
                    Game Name
                  </span>
                  <span className={'w-1/2'}>Poker</span>
                </div>
                <div
                  className={
                    'flex flex-row justify-between font-plexsans text-[16px]/[16px]'
                  }
                >
                  <span className={'font-medium uppercase text-left-accent'}>
                    Participants fee
                  </span>
                  <span className={'w-1/2'}>3 {Currency.ZNAKES}</span>
                </div>
                <div
                  className={
                    'flex flex-row justify-between font-plexsans text-[16px]/[16px]'
                  }
                >
                  <span className={'font-medium uppercase text-left-accent'}>
                    Max Funds
                  </span>
                  <span className={'w-1/2'}>6 {Currency.ZNAKES}</span>
                </div>
              </div>
            </div>
            <div className={'flex flex-col gap-4'}>
              <span className={'font-museo text-headline-3 font-bold'}>
                Players List
              </span>
              <div className={'flex flex-col gap-0'}>
                <div
                  className={
                    'flex w-full flex-row justify-between py-2 text-[16px]/[16px]'
                  }
                >
                  <span className={'w-[10%]'}>Index</span>
                  <span className={'w-[60%]'}>Address</span>
                  <span className={'w-[30%]'}>Nickname</span>
                </div>
                {[...Array(6)].map((_, index) => (
                  <PlayerListItem
                    key={index}
                    id={index + 1}
                    address={'1N4Qbzg6LSXUXyX...'}
                    nickname={'NeoGar'}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className={'flex w-full flex-col'}>
            <span
              className={'h-[54px] pb-4 font-museo text-headline-3 font-bold'}
            >
              Rules
            </span>
            <RulesAccordion
              title={'Game overwiew'}
              rules={
                'Players aim to make the best five-card hand using a combination of their own hole cards and the community cards available to all players. It can be played with 2 to 6 players. The game consists of several rounds of betting, followed by the dealing of community cards.'
              }
              defaultOpen
            />
            <RulesAccordion
              title={'Blinds'}
              rules={
                'Each hand begins with two players posting forced bets called the small blind and the big blind. The player to the left of the dealer posts the small blind, and the player to their left posts the big blind. The blinds ensure there is money in the pot and create action. The size of the blinds is determined by lobby settings.'
              }
              defaultOpen
            />
            <RulesAccordion
              title={'Betting Stage'}
              rules={
                'After the blinds are posted, each player is dealt two private cards (hole cards) face down. The first round of betting begins with the player to the left of the big blind. Players can call (match the current bet), raise (increase the bet), or fold (discard their cards and forfeit the hand). Betting continues clockwise around the table until all players have either folded or called the highest bet.'
              }
              defaultOpen
            />
          </div>
          <div className={'flex w-full flex-col'}>
            <div className={'h-[54px]'} />
            <RulesAccordion
              title={'Opening Stage'}
              rules={
                'After the initial round of betting, the dealer places three community cards face-up on the table. This is called the flop. Another round of betting occurs, starting with the player to the left of the dealer. Following the flop, the dealer places a fourth community card face-up on the table. This is called the turn. Another round of betting occurs, starting with the player to the left of the dealer. Finally, the dealer places a fifth and final community card face-up on the table. This is called the rive. A final round of betting occurs.'
              }
              defaultOpen
            />
            <RulesAccordion
              title={'Determining the Winner'}
              rules={
                'After the final round of betting, if there are two or more players remaining, a showdown occurs. Players reveal their hole cards, and the best five-card hand wins the pot. Players can use any combination of their hole cards and the community cards to form their hand. The player with the highest-ranking hand wins the pot. If two or more players have the same hand, the pot is split evenly among them. The game then moves to the next hand, and the dealer button rotates clockwise to the next player, and the process repeats.'
              }
              defaultOpen
            />
          </div>
        </div>
        <div className={'flex flex-row justify-between'}>
          <div className={'flex flex-row gap-2'}>
            <span
              className={
                'font-plexsans text-[12px]/[12px] uppercase text-left-accent lg:text-buttons-menu'
              }
            >
              Game rating:
            </span>
            <span className={'flex flex-row gap-2 pl-1 pr-6 lg:pl-0 lg:pr-0'}>
              <svg
                width="19"
                height="18"
                viewBox="0 0 19 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={'h-[20px] w-[20px]'}
              >
                <path
                  d="M9.5 0.523438L11.6329 7.08778H18.535L12.9511 11.1448L15.084 17.7091L9.5 13.6521L3.91604 17.7091L6.04892 11.1448L0.464963 7.08778H7.36712L9.5 0.523438Z"
                  fill="#D2FF00"
                />
              </svg>
              <span
                className={
                  'pt-0.5 font-plexsans text-[12px]/[12px] font-normal lg:pt-0 lg:text-buttons-menu'
                }
              >
                5.0
              </span>
            </span>
          </div>
          <div className={'flex flex-row gap-2'}>
            <span
              className={
                'font-plexsans text-[12px]/[12px] uppercase text-left-accent lg:text-buttons-menu'
              }
            >
              Author:
            </span>
            <span
              className={
                'pl-1 font-plexsans text-[12px]/[12px] font-normal lg:pl-0 lg:text-buttons-menu'
              }
            >
              {pokerConfig.author}
            </span>
          </div>
        </div>
      </div>
    </GamePage>
  );
};

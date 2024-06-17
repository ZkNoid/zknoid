import PokerCoverSVG from '@/games/poker/assets/game-cover.svg';
import GamePage from '@/components/framework/GamePage';
import { pokerConfig } from '@/games/poker/config';
import Button from '@/components/shared/Button';
import { Currency } from '@/constants/currency';
import Image from 'next/image';
import defaultAvatar from './assets/avatars/defaultAvatar.svg';
import StatefulModal from '@/components/shared/Modal/StatefulModal';
import ChatMessage from './ui/ChatMessage';
import LogsMessage from './ui/LogsMessage';
import PlayerListItem from './ui/PlayerListItem';
import RulesAccordion from './ui/RulesAccordion';

export const Poker = () => {
  return (
    <GamePage
      gameConfig={pokerConfig}
      image={PokerCoverSVG}
      mobileImage={'/image/game-page/game-title-mobile-template.svg'}
      defaultPage={'Game'}
    >
      <StatefulModal isOpen={true}>
        <div className={'flex flex-col items-center justify-center gap-2'}>
          <svg
            width="161"
            height="161"
            viewBox="0 0 161 161"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M80.442 160.884C124.869 160.884 160.884 124.869 160.884 80.442C160.884 36.0151 124.869 0 80.442 0C36.0151 0 0 36.0151 0 80.442C0 124.869 36.0151 160.884 80.442 160.884Z"
              fill="#212121"
            />
            <path
              d="M80.442 149.22C118.427 149.22 149.22 118.427 149.22 80.442C149.22 42.457 118.427 11.6641 80.442 11.6641C42.457 11.6641 11.6641 42.457 11.6641 80.442C11.6641 118.427 42.457 149.22 80.442 149.22Z"
              stroke="#D2FF00"
              strokeWidth="8"
              strokeMiterlimit="10"
            />
            <path
              d="M52.8568 92.7354C56.0407 92.7354 58.6218 82.6978 58.6218 70.3157C58.6218 57.9337 56.0407 47.8961 52.8568 47.8961C49.6729 47.8961 47.0918 57.9337 47.0918 70.3157C47.0918 82.6978 49.6729 92.7354 52.8568 92.7354Z"
              fill="#D2FF00"
            />
            <path
              d="M103.461 92.7354C106.645 92.7354 109.226 82.6978 109.226 70.3157C109.226 57.9337 106.645 47.8961 103.461 47.8961C100.277 47.8961 97.6963 57.9337 97.6963 70.3157C97.6963 82.6978 100.277 92.7354 103.461 92.7354Z"
              fill="#D2FF00"
            />
            <path
              d="M135.489 76.4906H118.194V82.7178H135.489V76.4906Z"
              fill="#D2FF00"
            />
            <path
              d="M38.7647 76.4906H21.4697V82.7178H38.7647V76.4906Z"
              fill="#D2FF00"
            />
            <path
              d="M108.616 109.029C104.26 111.673 94.0101 117.095 79.8623 117.285C65.4748 117.478 54.9435 112.155 50.5391 109.598"
              stroke="#D2FF00"
              strokeWidth="5"
              strokeMiterlimit="10"
            />
          </svg>
          <span className={'text-headline-1'}>Oops!</span>
          <div
            className={'flex flex-col items-center justify-center gap-2 pt-4'}
          >
            <span className={'text-headline-1'}>
              You find a game that under development!
            </span>
            <span>
              Everything may not work, please just enjoy beautiful interface
            </span>
          </div>
        </div>
      </StatefulModal>
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
          <div className={'w-[20%]'}>
            <Button label={'Leave game'} />
          </div>
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

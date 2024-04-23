import { Popover } from '@/components/ui/games-store/shared/Popover';
import { Currency } from '@/constants/currency';
import { randzuConfig } from '@/games/randzu/config';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/games-store/shared/Button';

export const Lobby = () => {
  enum PlayerStates {
    Waiting,
    Ready,
    Connecting,
  }

  const CreateNewLobby = () => {
    return (
      <div
        className={
          'flex h-full w-full flex-col items-center justify-center gap-2 rounded-[5px] border border-foreground bg-bg-dark p-2'
        }
      >
        <span
          className={
            'text-[20px]/[20px] font-medium uppercase text-left-accent'
          }
        >
          Create new lobby
        </span>
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect y="12.7273" width="28" height="2.54545" fill="#D2FF00" />
          <rect
            x="15.2734"
            width="28"
            height="2.54545"
            transform="rotate(90 15.2734 0)"
            fill="#D2FF00"
          />
        </svg>
        <span
          className={
            'text-center font-plexsans text-[12px]/[12px] text-left-accent'
          }
        >
          If you don&apos;t find any of the existing lobbies to your liking, you
          are always welcome to create your own and invite your friends to join
          you there!
        </span>
      </div>
    );
  };

  const LobbyInformation = () => {
    const PlayersListItem = ({
      index,
      account,
      state,
    }: {
      index: number;
      account: string;
      state: PlayerStates;
    }) => {
      return (
        <div
          className={clsx(
            'my-2 grid grid-cols-5 border-y p-3 text-[16px]/[16px] uppercase',
            { 'text-left-accent': state === PlayerStates.Ready }
          )}
        >
          <span className={'col-start-1 col-end-1'}>[{index}]</span>
          <span className={'col-start-2 col-end-3'}>{account}</span>
          <span className={'col-start-4 col-end-6'}>
            {state === PlayerStates.Waiting && 'Waiting opponent'}
            {state === PlayerStates.Ready && 'Ready to play'}
            {state === PlayerStates.Connecting && 'Connecting...'}
          </span>
        </div>
      );
    };
    return (
      <div
        className={
          'flex h-full flex-col rounded-[5px] border border-foreground bg-[#252525] p-2'
        }
      >
        <div className={'flex flex-col gap-2'}>
          <span className={'text-headline-3 uppercase text-left-accent'}>
            {randzuConfig.name} Lobby
          </span>
          <div
            className={
              'grid grid-cols-4 gap-2 font-plexsans text-[16px]/[16px]'
            }
          >
            <span className={'font-medium uppercase text-left-accent'}>
              Game Name
            </span>
            <span className={'col-start-2 col-end-5'}>{randzuConfig.name}</span>
            <span className={'font-medium uppercase text-left-accent'}>
              Participants fee
            </span>
            <span className={'col-start-2 col-end-5'}>3 {Currency.MINA}</span>
            <span className={'font-medium uppercase text-left-accent'}>
              Max Funds
            </span>
            <span className={'col-start-2 col-end-5'}>6 {Currency.MINA}</span>
          </div>
        </div>
        <div className={'flex-grow'} />
        <div className={'flex flex-col gap-2'}>
          <span className={'text-[16px]/[16px] font-medium uppercase'}>
            Players list
          </span>
          <div
            className={'grid grid-cols-5 px-3 font-plexsans text-[16px]/[16px]'}
          >
            <span className={'col-start-1 col-end-1'}>Index</span>
            <span className={'col-start-2 col-end-3'}>Nickname\Adress</span>
            <span className={'col-start-4 col-end-6'}>Status</span>
          </div>
          <div className={'flex flex-col'}>
            <PlayersListItem
              account={'1N4Qbzg6LSXUXyX...'}
              state={PlayerStates.Waiting}
              index={1}
            />
            <PlayersListItem
              account={'1N4Qbzg6LSXUXyX...'}
              state={PlayerStates.Ready}
              index={2}
            />
            <PlayersListItem
              account={'1N4Qbzg6LSXUXyX...'}
              state={PlayerStates.Waiting}
              index={3}
            />
          </div>
        </div>
        <div className={'flex-grow'} />
        <Button label={'Ready to play'} />
      </div>
    );
  };

  enum LobbyState {
    Information,
    Creation,
  }

  const lobbyState = LobbyState.Information;

  return (
    <>
      <div className={'col-start-4 col-end-6 row-start-1'}>
        {lobbyState == LobbyState.Creation ? (
          <span className={'text-headline-1'}>Lobby creation</span>
        ) : (
          <div className={'flex flex-row gap-1'}>
            <span className={'text-headline-1'}>Lobby Information</span>
            <Popover
              trigger={
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={'hover:opacity-80'}
                >
                  <g opacity="0.5">
                    <circle
                      cx="8"
                      cy="8"
                      r="7"
                      fill="#F9F8F4"
                      stroke="#F9F8F4"
                      strokeWidth="0.500035"
                    />
                    <path
                      d="M7.2446 9.95291V7.68144C8.03117 7.64451 8.64508 7.45983 9.08633 7.12742C9.53717 6.79501 9.76259 6.33795 9.76259 5.75623V5.56233C9.76259 5.09141 9.60911 4.71745 9.30216 4.44044C8.9952 4.1542 8.58273 4.01108 8.06475 4.01108C7.50839 4.01108 7.06235 4.16343 6.72662 4.46814C6.40048 4.77285 6.17986 5.16066 6.06475 5.63158L5 5.24377C5.08633 4.94829 5.21103 4.66667 5.3741 4.39889C5.54676 4.12188 5.75779 3.88181 6.00719 3.67867C6.26619 3.4663 6.56835 3.30009 6.91367 3.18006C7.25899 3.06002 7.65707 3 8.10791 3C9 3 9.70504 3.23546 10.223 3.70637C10.741 4.17729 11 4.8144 11 5.61773C11 6.06094 10.9185 6.44875 10.7554 6.78116C10.6019 7.10434 10.4005 7.38135 10.1511 7.61219C9.90168 7.84303 9.61871 8.0277 9.30216 8.1662C8.98561 8.30471 8.66906 8.40166 8.35252 8.45706V9.95291H7.2446ZM7.80576 13C7.4988 13 7.27338 12.9261 7.1295 12.7784C6.9952 12.6307 6.92806 12.4367 6.92806 12.1967V12.0166C6.92806 11.7765 6.9952 11.5826 7.1295 11.4349C7.27338 11.2872 7.4988 11.2133 7.80576 11.2133C8.11271 11.2133 8.33333 11.2872 8.46763 11.4349C8.61151 11.5826 8.68345 11.7765 8.68345 12.0166V12.1967C8.68345 12.4367 8.61151 12.6307 8.46763 12.7784C8.33333 12.9261 8.11271 13 7.80576 13Z"
                      fill="#252525"
                    />
                  </g>
                </svg>
              }
            >
              <div
                className={
                  'flex min-w-[250px] flex-col items-center justify-center gap-2 font-plexsans'
                }
              >
                <span className={'w-full self-start text-[14px]/[14px]'}>
                  Lobby information
                </span>
                <div
                  className={'w-full text-[12px]/[12px] font-light opacity-70'}
                >
                  When you select the lobby, full information about the upcoming
                  competition will appear here, if you agree to the terms of the
                  game, join and have fun!
                </div>
              </div>
            </Popover>
          </div>
        )}
      </div>
      <div className={'col-start-4 col-end-6 row-start-2 row-end-5'}>
        {lobbyState == LobbyState.Creation && <CreateNewLobby />}
        {lobbyState == LobbyState.Information && <LobbyInformation />}
      </div>
    </>
  );
};

import { clsx } from 'clsx';
import { Button } from '@/components/ui/games-store/shared/Button';
import { ILobby } from '@/lib/types';
import { formatUnits } from '@/lib/unit';

enum PlayerStates {
  Waiting,
  Ready,
  Connecting,
}

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
        'mt-3 grid grid-cols-5 border-t pt-3 text-[16px]/[16px] uppercase last:border-b last:pb-3',
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

export const LobbyInformation = ({
  gameName,
  lobby,
}: {
  gameName: string;
  lobby: ILobby;
}) => {
  return (
    <div
      className={
        'flex h-full w-full flex-col rounded-[5px] border border-foreground bg-[#252525] p-2'
      }
    >
      <div className={'flex flex-col gap-2'}>
        <span className={'text-headline-3 uppercase text-left-accent'}>
          {gameName} Lobby
        </span>
        <div
          className={'grid grid-cols-4 gap-2 font-plexsans text-[16px]/[16px]'}
        >
          <span className={'font-medium uppercase text-left-accent'}>
            Game Name
          </span>
          <span className={'col-start-2 col-end-5'}>{gameName}</span>
          <span className={'font-medium uppercase text-left-accent'}>
            Participants fee
          </span>
          <span className={'col-start-2 col-end-5'}>
            {formatUnits(lobby.reward)} {lobby.currency}
          </span>
          <span className={'font-medium uppercase text-left-accent'}>
            Max Funds
          </span>
          <span className={'col-start-2 col-end-5'}>
            {formatUnits(lobby.fee)} {lobby.currency}
          </span>
        </div>
      </div>
      <div className={'flex-grow'} />
      <div className={'flex flex-col gap-2'}>
        <span className={'text-[16px]/[16px] font-medium uppercase'}>
          Players list
        </span>
        <div className={'grid grid-cols-5 font-plexsans text-[16px]/[16px]'}>
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

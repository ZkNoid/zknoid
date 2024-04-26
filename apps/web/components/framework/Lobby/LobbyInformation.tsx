import { clsx } from 'clsx';
import { Button } from '@/components/ui/games-store/shared/Button';
import { ILobby } from '@/lib/types';
import { formatUnits } from '@/lib/unit';
import { motion } from 'framer-motion';
import { usePvpLobbyStorage } from '@/lib/stores/pvpLobbyStore';

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
  const pvpLobbyStorage = usePvpLobbyStorage();
  return (
    <motion.div
      className={'col-start-4 col-end-6 row-span-4 h-full w-full'}
      initial={'hidden'}
      animate={'visible'}
      exit={'hidden'}
      transition={{ type: 'spring', duration: 0.8, bounce: 0 }}
      variants={{
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
      }}
    >
      <div
        className={
          'flex h-full w-full flex-col rounded-[5px] border border-foreground bg-[#252525] p-2'
        }
      >
        <div className={'flex flex-col gap-2'}>
          <span className={'text-headline-3 uppercase text-left-accent'}>
            {lobby.name}
          </span>
          {pvpLobbyStorage.ownedLobbyId === lobby.id &&
            pvpLobbyStorage.ownedLobbyKey === lobby.accessKey && (
              <span className={'py-2 font-plexsans text-[16px]/[16px]'}>
                Your lobby is create correctly! Now you can share it with you
                friends in any way you like.
              </span>
            )}
          <div
            className={
              'grid grid-cols-4 gap-2 font-plexsans text-[16px]/[16px]'
            }
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
            {lobby.playersAddresses && lobby.playersAddresses.map((player, index) => {
              return <PlayersListItem
                account={player.toBase58()}
                state={PlayerStates.Ready}
                index={index}
              />
            })}
          </div>
        </div>
        <div className={'flex-grow'} />
        {pvpLobbyStorage.connectedLobbyKey === lobby.accessKey ? (
          <Button label={'Ready to play'} />
        ) : (
          <Button
            label={'Connect to lobby'}
            onClick={() => {
              pvpLobbyStorage.setConnectedLobbyId(lobby.id);
              pvpLobbyStorage.setConnectedLobbyKey(lobby.accessKey);
            }}
          />
        )}
      </div>
    </motion.div>
  );
};

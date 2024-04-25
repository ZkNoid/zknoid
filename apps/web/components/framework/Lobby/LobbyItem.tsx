import { usePvpLobbyStorage } from '@/lib/stores/pvpLobbyStore';
import { Currency } from '@/constants/currency';
import { ILobby } from '@/lib/types';
import { formatUnits } from '@/lib/unit';

export const LobbyItem = ({
  id,
  name,
  reward,
  fee,
  maxPlayers,
  players,
  currency,
  accessKey,
}: ILobby) => {
  const pvpLobbyStorage = usePvpLobbyStorage();
  return (
    <div
      className="group grid cursor-pointer grid-cols-4 gap-2 gap-y-2 border-t p-3 uppercase last:border-b hover:bg-[#464646]"
      onClick={() => pvpLobbyStorage.setLastLobbyId(id)}
    >
      <span
        className={
          'flex flex-row items-center gap-2 text-[20px]/[20px] font-medium uppercase text-left-accent'
        }
      >
        <span>[{id}]</span>
        <span>{name}</span>
      </span>
      <div className="max-w-fit rounded-2xl bg-left-accent p-2 text-center font-plexsans text-[14px]/[14px] font-medium uppercase text-bg-dark">
        {formatUnits(reward)} {currency} Max reward
      </div>
      <div className="max-w-fit rounded-2xl border border-foreground p-2 text-center font-plexsans text-[14px]/[14px] font-medium uppercase text-foreground">
        {formatUnits(fee)} {Currency.ZNAKES} Participants fee
      </div>
      <div
        className={
          'col-start-2 col-end-2 row-start-2 flex flex-row gap-2 text-left-accent'
        }
      >
        <span className={'uppercase'}>Max participants:</span>
        <span>{maxPlayers} players</span>
      </div>
      <div className={'col-start-3 col-end-3 row-start-2 flex flex-row gap-2'}>
        <span className={'uppercase'}>Players in Lobby:</span>
        <span>{players} players</span>
      </div>
      <div
        className={
          'invisible col-start-4 col-end-5 row-start-1 row-end-3 flex h-full w-full flex-col items-end justify-center group-hover:visible'
        }
      >
        <svg
          width="50"
          height="33"
          viewBox="0 0 50 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M33.4141 0L49.615 16.201L48.2008 17.6152L48.1923 17.6066L33.6212 32.1776L32.207 30.7634L45.9705 17H0V15H45.5856L31.9998 1.41421L33.4141 0Z"
            fill="#D2FF00"
          />
        </svg>
      </div>
    </div>
  );
};

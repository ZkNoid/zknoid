import { useNetworkStore } from '@/lib/stores/network';
import { formatUnits } from '@/lib/unit';
import { formatPubkey } from '@/lib/utils';
import { api } from '@/trpc/react';
import Link from 'next/link';
import { PublicKey } from 'o1js';
import { ReactNode } from 'react';
import Image from 'next/image';
import znakesImg from '@/public/image/tokens/znakes.svg';

export enum MainButtonState {
  WalletNotInstalled,
  WalletNotConnected,
  NotStarted,
  YourTurn,
  OpponentsTurn,
  OpponentTimeOut,
  TransactionExecution,
  None,
}

type PvPGameViewProps = {
  status: string;
  opponent: PublicKey;
  startPrice: bigint;
  mainButtonState: MainButtonState;
  startGame: () => void;
  queueSize: number;
  gameAuthor: string;
  mainText: string;
  children: ReactNode;
  bottomButtonText: string;
  bottomButtonHandler: () => void;
  competitionName: string;
  gameName: string;
  gameRules: string;
  competitionFunds: bigint;
};
export const PvPGameView = (props: PvPGameViewProps) => {
  const getRatingQuery = api.ratings.getGameRating.useQuery({
    gameId: props.gameName,
  });

  const networkStore = useNetworkStore();

  return (
    <main className="flex grow flex-row items-stretch gap-5 p-5">
      <div className="flex min-h-[500px] basis-1/4 flex-col gap-2">
        <div className="font-plexsans text-[20px]/[20px] font-medium text-left-accent">
          GAME STATUS: {props.status}
        </div>
        <div className="flex flex-col gap-1 py-2">
          <div className="">Your opponent: {formatPubkey(props.opponent)} </div>
          {props.mainButtonState == MainButtonState.YourTurn && (
            <div className="flex cursor-pointer items-center justify-center rounded bg-left-accent py-2 font-plexsans text-[20px]/[20px] font-medium text-black">
              YOUR TURN
            </div>
          )}
          {props.mainButtonState == MainButtonState.OpponentsTurn && (
            <div className="flex cursor-pointer items-center justify-center rounded border border-white py-2 font-plexsans text-[20px]/[20px] font-medium text-white">
              {"OPPONENT'S TURN"}
            </div>
          )}
          {props.mainButtonState == MainButtonState.OpponentTimeOut && (
            <div className="flex cursor-pointer items-center justify-center rounded border border-white py-2 font-plexsans text-[20px]/[20px] font-medium text-white">
              OPPONENT TIMED OUT
            </div>
          )}
          {props.mainButtonState == MainButtonState.TransactionExecution && (
            <div className="flex cursor-pointer items-center justify-center rounded border border-white py-2 font-plexsans text-[20px]/[20px] font-medium text-white">
              Transaction execution
            </div>
          )}

          {props.mainButtonState == MainButtonState.NotStarted && (
            <div
              className="flex cursor-pointer items-center justify-center rounded bg-left-accent py-2 font-plexsans text-[20px]/[20px] font-medium text-black"
              onClick={props.startGame}
            >
              START FOR {formatUnits(props.startPrice)}
              <Image
                src={znakesImg}
                alt={'Znakes token'}
                className={'h-[24px] w-[24px] pl-2'}
              />
            </div>
          )}
          {props.mainButtonState == MainButtonState.WalletNotInstalled && (
            <Link
              href="https://www.aurowallet.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="flex cursor-pointer items-center justify-center rounded bg-left-accent py-2 font-plexsans text-[20px]/[20px] font-medium text-black">
                Install wallet
              </div>
            </Link>
          )}
          {props.mainButtonState == MainButtonState.WalletNotConnected && (
            <div
              className="flex cursor-pointer items-center justify-center rounded bg-left-accent py-2 font-plexsans text-[20px]/[20px] font-medium text-black"
              onClick={() => networkStore.connectWallet(false)}
            >
              Connect wallet
            </div>
          )}
        </div>
        <div className="font-plexsans text-[20px]/[20px] font-medium text-left-accent">
          PLAYERS IN QUEUE: {props.queueSize}
        </div>
        <div className="flex flex-grow flex-col justify-center font-plexsans font-medium">
          <div className="flex flex-row gap-2 text-[16px]/[16px]">
            <div className="text-left-accent">GAME RATING:</div>{' '}
            {(getRatingQuery.data?.rating || 0).toFixed(1)}
            <svg
              width="19"
              height="18"
              viewBox="0 0 19 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.5 0L11.6329 6.56434H18.535L12.9511 10.6213L15.084 17.1857L9.5 13.1287L3.91604 17.1857L6.04892 10.6213L0.464963 6.56434H7.36712L9.5 0Z"
                fill="#D2FF00"
              />
            </svg>
          </div>
          <div className="flex flex-row gap-2">
            <div className="text-left-accent">AUTHOR:</div> {props.gameAuthor}
          </div>
        </div>
      </div>
      <div className="flex h-full flex-grow basis-1/2 flex-col items-center gap-2">
        <div className="py-10 font-museo text-[24px]/[24px]">
          {props.mainText}
        </div>

        {props.children}

        {props.bottomButtonText && (
          <div className="w-[75%]">
            <div
              className="my-5 flex cursor-pointer items-center justify-center rounded bg-left-accent py-3 font-plexsans text-[20px]/[20px] font-medium text-black"
              onClick={() => props.bottomButtonHandler()}
            >
              {props.bottomButtonText}
            </div>
          </div>
        )}
      </div>
      <div className="flex basis-1/4 flex-col gap-2">
        <div className="py-10 font-museo text-[24px]/[24px]">Competition</div>
        <div className="flex w-[75%] flex-row justify-between font-plexsans text-[20px]/[20px] font-medium">
          <div className="text-left-accent">Name:</div>
          <div className="text-white">{props.competitionName}</div>
        </div>
        <div className="flex w-[75%] flex-row justify-between font-plexsans text-[20px]/[20px] font-medium">
          <div className="text-left-accent">Funds:</div>
          <div className="text-white">
            {formatUnits(props.competitionFunds)} $znakes
          </div>
        </div>
        <div className="pt-10 font-museo text-[24px]/[24px]">
          {props.gameName} rules
        </div>
        <div className="text-regular flex flex-col gap-3 whitespace-pre-line py-10 font-plexsans text-[16px]/[20px]">
          {props.gameRules}
        </div>
      </div>
    </main>
  );
};

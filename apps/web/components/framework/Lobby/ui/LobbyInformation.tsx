import { clsx } from 'clsx';
import Button from '@/components/shared/Button';
import BaseModal from '@/components/shared/Modal/BaseModal';
import { ILobby } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import { type RuntimeModulesRecord } from '@proto-kit/module';
import { ZkNoidGameConfig } from '@/lib/createConfig';
import { useNetworkStore } from '@/lib/stores/network';
import { useState } from 'react';
import { formatUnits } from '@/lib/unit';
import { cn, walletInstalled } from '@/lib/helpers';
import { useLobbiesStore } from '@/lib/stores/lobbiesStore';
import { useToasterStore } from '@/lib/stores/toasterStore';
import toast from '@/components/shared/Toast';
import Link from 'next/link';

enum PlayerStates {
  Waiting,
  Ready,
  Connecting,
  EmptySlot,
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
      <span className={'col-start-2 col-end-3'}>
        {state !== PlayerStates.EmptySlot
          ? account.slice(0, 5) + '...' + account.slice(-5)
          : account}
      </span>
      <span className={'col-start-4 col-end-6'}>
        {state === PlayerStates.Waiting && 'Waiting opponent'}
        {state === PlayerStates.Ready && 'Ready to play'}
        {state === PlayerStates.Connecting && 'Connecting...'}
        {state === PlayerStates.EmptySlot && 'Waiting for player...'}
      </span>
    </div>
  );
};

export const LobbyInformation = <RuntimeModules extends RuntimeModulesRecord>({
  gameName,
  lobby,
  config,
  joinLobby,
  leaveLobby,
  ready,
  currentLobbyId,
  selfReady,
  backToJoinedLobby,
}: {
  gameName: string;
  lobby: ILobby;
  config: ZkNoidGameConfig<RuntimeModules>;
  joinLobby: (lobbyId: number) => Promise<void>;
  leaveLobby: () => Promise<void>;
  ready: () => Promise<void>;
  currentLobbyId?: number;
  selfReady: boolean;
  backToJoinedLobby: () => void;
}) => {
  const networkStore = useNetworkStore();
  const lobbiesStore = useLobbiesStore();
  const toasterStore = useToasterStore();
  const [isConnectWalletModal, setIsConnectWalletModal] =
    useState<boolean>(false);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  const shareLink = `https://app.zknoid.io/games/${config.id}/lobby/${lobby.id}?key=${lobby.accessKey}`;
  const shareText = `I'm playing on ZK gaming platform! Here is my ${gameName} lobby link. Let's play together!`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 10000);
  };

  const shareSocials = [
    {
      id: 'twitter',
      image: (
        <svg
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.434 0C18.9962 0 24.3036 5.32779 24.3036 11.9152C24.3036 18.5026 18.9962 23.8304 12.434 23.8304C5.87184 23.8304 0.564453 18.5026 0.564453 11.9152C0.564453 5.32779 5.87184 0 12.434 0ZM10.2636 18.1962C15.5201 18.1962 18.4027 13.8216 18.4027 10.0258V9.6513C18.9623 9.24277 19.454 8.73212 19.8271 8.15339C19.3184 8.37467 18.7588 8.52786 18.1823 8.61297C18.7758 8.25552 19.2336 7.6938 19.4371 7.02996C18.8775 7.35337 18.2671 7.59167 17.6227 7.72784C17.0971 7.16613 16.351 6.8257 15.5371 6.8257C13.9601 6.8257 12.6714 8.11934 12.6714 9.70236C12.6714 9.92364 12.6884 10.1449 12.7562 10.3492C10.3823 10.23 8.26271 9.08958 6.85532 7.35337C6.61793 7.77891 6.46532 8.27254 6.46532 8.80021C6.46532 9.78747 6.97402 10.6726 7.73706 11.1832C7.26228 11.1832 6.82141 11.0471 6.44837 10.8258V10.8598C6.44837 12.2556 7.43184 13.4131 8.7375 13.6854C8.50011 13.7535 8.24576 13.7876 7.99141 13.7876C7.80489 13.7876 7.63532 13.7705 7.4488 13.7365C7.80489 14.877 8.87315 15.711 10.111 15.728C9.1275 16.494 7.88967 16.9536 6.55011 16.9536C6.31271 16.9536 6.09228 16.9536 5.87184 16.9196C7.12663 17.7366 8.63576 18.2132 10.2466 18.2132"
            fill="#F9F8F4"
            className={'group-hover:fill-left-accent'}
          />
        </svg>
      ),
      link: `https://twitter.com/intent/tweet?text=${shareText}\n${shareLink}`,
    },
    {
      id: 'telegram',
      image: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.0004 0C5.44306 0 0.130859 5.33339 0.130859 11.9152C0.130859 18.497 5.44383 23.8304 12.0004 23.8304C18.5578 23.8304 23.87 18.497 23.87 11.9152C23.87 5.33339 18.557 0 12.0004 0ZM17.8303 8.16305L15.8822 17.3785C15.7382 18.0319 15.3507 18.1903 14.8101 17.8828L11.8427 15.6873L10.4114 17.071C10.2537 17.2293 10.1197 17.3639 9.81336 17.3639L10.0239 14.332L15.523 9.34457C15.7627 9.13318 15.4702 9.01326 15.1539 9.22466L8.35762 13.5195L5.42851 12.6016C4.79215 12.4002 4.7776 11.9628 5.56253 11.6554L17.0063 7.22521C17.5378 7.03303 18.0018 7.35512 17.8295 8.16228L17.8303 8.16305Z"
            fill="#F9F8F4"
            className={'group-hover:fill-left-accent'}
          />
        </svg>
      ),
      link: `https://t.me/share?url=${shareLink}&text=${shareText}`,
    },
    // {
    //   id: 'discord',
    //   image: (
    //     <svg
    //       width="24"
    //       height="24"
    //       viewBox="0 0 24 24"
    //       fill="none"
    //       xmlns="http://www.w3.org/2000/svg"
    //       className={'pt-1'}
    //     >
    //       <path
    //         d="M20.348 1.68678C18.8445 0.983196 17.2166 0.472532 15.5209 0.177481C15.5061 0.177004 15.4913 0.179805 15.4776 0.185687C15.4639 0.191569 15.4517 0.200389 15.4418 0.211526C15.2383 0.586013 15.0009 1.07398 14.8427 1.44847C13.0441 1.17611 11.215 1.17611 9.41642 1.44847C9.25815 1.06263 9.02075 0.586013 8.80596 0.211526C8.79466 0.18883 8.76075 0.177481 8.72683 0.177481C7.03113 0.472532 5.41457 0.983196 3.89974 1.68678C3.88844 1.68678 3.87713 1.69813 3.86583 1.70947C0.790962 6.32815 -0.0568871 10.822 0.361385 15.2705C0.361385 15.2931 0.37269 15.3158 0.395299 15.3272C2.43014 16.8251 4.38584 17.733 6.31894 18.3344C6.35285 18.3458 6.38677 18.3344 6.39807 18.3117C6.85026 17.6876 7.25723 17.0294 7.60767 16.3372C7.63028 16.2918 7.60767 16.2464 7.56245 16.235C6.91809 15.9854 6.30764 15.6903 5.70849 15.3499C5.66327 15.3272 5.66327 15.2591 5.69718 15.2251C5.82153 15.1343 5.94589 15.0321 6.07024 14.9414C6.09285 14.9187 6.12676 14.9187 6.14937 14.93C10.0382 16.7117 14.2322 16.7117 18.0758 14.93C18.0984 14.9187 18.1323 14.9187 18.1549 14.9414C18.2793 15.0435 18.4036 15.1343 18.528 15.2364C18.5732 15.2705 18.5732 15.3385 18.5167 15.3612C17.9288 15.713 17.3071 15.9967 16.6627 16.2464C16.6175 16.2577 16.6062 16.3145 16.6175 16.3485C16.9792 17.0408 17.3862 17.6989 17.8271 18.3231C17.861 18.3344 17.8949 18.3458 17.9288 18.3344C19.8732 17.733 21.8289 16.8251 23.8638 15.3272C23.8864 15.3158 23.8977 15.2931 23.8977 15.2705C24.3951 10.1298 23.0724 5.66996 20.3932 1.70947C20.3819 1.69813 20.3706 1.68678 20.348 1.68678ZM8.19551 12.5583C7.03113 12.5583 6.05893 11.4802 6.05893 10.1525C6.05893 8.82473 7.00852 7.74666 8.19551 7.74666C9.39381 7.74666 10.3434 8.83608 10.3321 10.1525C10.3321 11.4802 9.3825 12.5583 8.19551 12.5583ZM16.0749 12.5583C14.9105 12.5583 13.9383 11.4802 13.9383 10.1525C13.9383 8.82473 14.8879 7.74666 16.0749 7.74666C17.2732 7.74666 18.2227 8.83608 18.2114 10.1525C18.2114 11.4802 17.2732 12.5583 16.0749 12.5583Z"
    //         fill="#F9F8F4"
    //         className={'group-hover:fill-left-accent'}
    //       />
    //     </svg>
    //   ),
    //   link: '#',
    // },
    {
      id: 'reddit',
      image: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.5038 13.248C10.5038 12.564 9.93981 12 9.25581 12C8.57181 12 8.00781 12.564 8.00781 13.248C8.00781 13.579 8.1393 13.8964 8.37334 14.1305C8.60739 14.3645 8.92482 14.496 9.25581 14.496C9.5868 14.496 9.90424 14.3645 10.1383 14.1305C10.3723 13.8964 10.5038 13.579 10.5038 13.248ZM14.5118 16.092C13.9718 16.632 12.8198 16.824 12.0038 16.824C11.1878 16.824 10.0358 16.632 9.49581 16.092C9.46662 16.0608 9.43132 16.0358 9.3921 16.0188C9.35288 16.0018 9.31057 15.993 9.26781 15.993C9.22505 15.993 9.18275 16.0018 9.14353 16.0188C9.1043 16.0358 9.069 16.0608 9.03981 16.092C9.00856 16.1212 8.98365 16.1565 8.96662 16.1957C8.94958 16.2349 8.94079 16.2772 8.94079 16.32C8.94079 16.3628 8.94958 16.4051 8.96662 16.4443C8.98365 16.4835 9.00856 16.5188 9.03981 16.548C9.89181 17.4 11.5238 17.472 12.0038 17.472C12.4838 17.472 14.1158 17.4 14.9678 16.548C14.9991 16.5188 15.024 16.4835 15.041 16.4443C15.058 16.4051 15.0668 16.3628 15.0668 16.32C15.0668 16.2772 15.058 16.2349 15.041 16.1957C15.024 16.1565 14.9991 16.1212 14.9678 16.092C14.8478 15.972 14.6438 15.972 14.5118 16.092ZM14.7518 12C14.0678 12 13.5038 12.564 13.5038 13.248C13.5038 13.932 14.0678 14.496 14.7518 14.496C15.4358 14.496 15.9998 13.932 15.9998 13.248C15.9998 12.564 15.4478 12 14.7518 12Z"
            fill="#F9F8F4"
            className={'group-hover:fill-left-accent'}
          />
          <path
            d="M12 0C5.376 0 0 5.376 0 12C0 18.624 5.376 24 12 24C18.624 24 24 18.624 24 12C24 5.376 18.624 0 12 0ZM18.96 13.596C18.984 13.764 18.996 13.944 18.996 14.124C18.996 16.812 15.864 18.996 12 18.996C8.136 18.996 5.004 16.812 5.004 14.124C5.004 13.944 5.016 13.764 5.04 13.596C4.428 13.32 4.008 12.708 4.008 12C4.00622 11.6559 4.10616 11.3189 4.29527 11.0314C4.48438 10.744 4.75422 10.5188 5.07091 10.3841C5.38759 10.2495 5.737 10.2115 6.07523 10.2748C6.41347 10.3381 6.72545 10.4999 6.972 10.74C8.184 9.864 9.864 9.312 11.724 9.252L12.612 5.064C12.624 4.98 12.672 4.908 12.744 4.872C12.816 4.824 12.9 4.812 12.984 4.824L15.888 5.448C15.9865 5.2483 16.1366 5.07858 16.3228 4.95645C16.509 4.83433 16.7245 4.76424 16.9469 4.75347C17.1693 4.74269 17.3905 4.79162 17.5877 4.89517C17.7848 4.99873 17.9506 5.15314 18.068 5.34238C18.1853 5.53163 18.2499 5.74883 18.255 5.97144C18.2601 6.19405 18.2055 6.41398 18.0969 6.6084C17.9884 6.80282 17.8298 6.96465 17.6376 7.07712C17.4454 7.18959 17.2267 7.24859 17.004 7.248C16.332 7.248 15.792 6.72 15.756 6.06L13.152 5.508L12.36 9.252C14.196 9.312 15.84 9.876 17.04 10.74C17.224 10.5643 17.4441 10.431 17.685 10.3493C17.9258 10.2676 18.1817 10.2395 18.4345 10.267C18.6874 10.2945 18.9312 10.3769 19.1489 10.5084C19.3666 10.64 19.5529 10.8175 19.6948 11.0286C19.8367 11.2397 19.9308 11.4793 19.9705 11.7305C20.0101 11.9818 19.9944 12.2386 19.9244 12.4832C19.8544 12.7277 19.7318 12.954 19.5653 13.1462C19.3987 13.3385 19.1921 13.492 18.96 13.596Z"
            fill="#F9F8F4"
            className={'group-hover:fill-left-accent'}
          />
        </svg>
      ),
      link: `https://reddit.com/submit?url=${shareLink}&title=${shareText}`,
    },
    {
      id: 'whatsapp',
      image: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.2007 5.55452C18.6162 -0.00227268 11.2758 -1.64873 5.59895 1.79854C0.0593087 5.2458 -1.72435 12.7578 1.86012 18.2974L2.15168 18.7433L0.951139 23.2368L5.44459 22.0362L5.89051 22.3278C7.82852 23.374 9.93804 23.9742 12.0304 23.9742C14.2771 23.9742 16.5239 23.374 18.4619 22.1734C24.0015 18.5718 25.648 11.2142 22.2007 5.52021V5.55452ZM19.0622 17.114C18.4619 18.0058 17.7073 18.6061 16.6611 18.7605C16.0608 18.7605 15.3062 19.052 12.322 17.8686C9.78369 16.6681 7.67417 14.7129 6.18207 12.4662C5.29024 11.42 4.82717 10.0651 4.68997 8.71022C4.68997 7.50968 5.13588 6.4635 5.89051 5.70887C6.18207 5.41731 6.49078 5.26296 6.78234 5.26296H7.53696C7.82852 5.26296 8.13723 5.26296 8.29159 5.86323C8.58315 6.61785 9.33777 8.41866 9.33777 8.57302C9.49213 8.72737 9.42352 9.87646 8.7375 10.5282C8.36019 10.9569 8.29159 10.9741 8.44594 11.2828C9.04621 12.1746 9.80084 13.0836 10.5383 13.8382C11.4301 14.5929 12.3391 15.1931 13.3853 15.6391C13.6769 15.7934 13.9856 15.7934 14.1399 15.4847C14.2943 15.1931 15.0318 14.4385 15.3405 14.1298C15.632 13.8382 15.7864 13.8382 16.0951 13.9754L18.4962 15.176C18.7877 15.3303 19.0965 15.4676 19.2508 15.6219C19.4052 16.0678 19.4052 16.6681 19.0965 17.114H19.0622Z"
            fill="#F9F8F4"
            className={'group-hover:fill-left-accent'}
          />
        </svg>
      ),
      link: `https://wa.me/?text=${shareLink} \n ${shareText}`,
    },
  ];

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
      {lobbiesStore.currentLobby &&
        lobby.id !== lobbiesStore.currentLobby.id && (
          <div
            className={
              'flex w-full cursor-pointer flex-row items-center gap-2 py-2 hover:opacity-80'
            }
            onClick={backToJoinedLobby}
          >
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width="24"
                height="24"
                rx="4.5"
                fill="#D2FF00"
                stroke="#D2FF00"
              />
              <path d="M16 21L8 12.5L16 4" stroke="#141414" strokeWidth="2" />
            </svg>
            <span
              className={
                'font-plexsans text-[16px]/[16px] font-medium uppercase text-left-accent'
              }
            >
              Back to Joined Lobby
            </span>
          </div>
        )}
      <div
        className={
          'flex h-full w-full flex-col rounded-[5px] border border-foreground bg-[#252525] p-2'
        }
      >
        <div className={'flex flex-col gap-2'}>
          <div className={'flex w-full flex-row justify-between'}>
            <span className={'text-headline-3 uppercase text-left-accent'}>
              {lobby.name}
            </span>
            {lobby.privateLobby && (
              <div className={'flex flex-row items-center gap-2'}>
                <svg
                  width="22"
                  height="19"
                  viewBox="0 0 22 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.8 12.5V11C19.8 9.6 18.4 8.5 17 8.5C15.6 8.5 14.2 9.6 14.2 11V12.5C13.6 12.5 13 13.1 13 13.7V17.2C13 17.9 13.6 18.5 14.2 18.5H19.7C20.4 18.5 21 17.9 21 17.3V13.8C21 13.1 20.4 12.5 19.8 12.5ZM18.5 12.5H15.5V11C15.5 10.2 16.2 9.7 17 9.7C17.8 9.7 18.5 10.2 18.5 11V12.5ZM14 7.5C13.1 8.2 12.5 9.1 12.3 10.2C11.9 10.4 11.5 10.5 11 10.5C9.3 10.5 8 9.2 8 7.5C8 5.8 9.3 4.5 11 4.5C12.7 4.5 14 5.8 14 7.5ZM11 15C6 15 1.7 11.9 0 7.5C1.7 3.1 6 0 11 0C16 0 20.3 3.1 22 7.5C21.8 8 21.5 8.5 21.3 9C20.5 7.5 18.8 6.5 17 6.5C16.6 6.5 16.3 6.6 15.9 6.6C15.5 4.3 13.5 2.5 11 2.5C8.2 2.5 6 4.7 6 7.5C6 10.3 8.2 12.5 11 12.5H11.3C11.1 12.9 11 13.3 11 13.7V15Z"
                    fill="#F9F8F4"
                  />
                </svg>
                <span
                  className={'font-plexsans text-[16px]/[16px] font-medium'}
                >
                  Private lobby
                </span>
              </div>
            )}
          </div>
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
              {formatUnits(lobby.fee)} {lobby.currency}
            </span>
            <span className={'font-medium uppercase text-left-accent'}>
              Max Funds
            </span>
            <span className={'col-start-2 col-end-5'}>
              {formatUnits(lobby.reward)} {lobby.currency}
            </span>
          </div>
        </div>
        {currentLobbyId === lobby.id && (
          <>
            <div className={'flex flex-col gap-2 pb-4 pt-8'}>
              <span className={'font-medium uppercase text-left-accent'}>
                Copy link
              </span>
              <div
                className={
                  'group flex w-full max-w-[80%] cursor-pointer flex-row items-center gap-2'
                }
                onClick={() => {
                  !linkCopied ? copyLink() : undefined;
                }}
              >
                <Button
                  isFilled={false}
                  color={'foreground'}
                  disabled={linkCopied}
                  className={cn({
                    'opacity-60': linkCopied,
                    'group-hover:border-left-accent group-hover:text-left-accent':
                      !linkCopied,
                  })}
                  label={shareLink}
                />
                <AnimatePresence>
                  {linkCopied ? (
                    <div
                      className={
                        'relative flex h-full items-center justify-center rounded-[5px] border border-foreground p-1'
                      }
                    >
                      <motion.svg
                        aria-hidden="true"
                        role="presentation"
                        viewBox="0 0 17 18"
                        className={'h-6 w-6'}
                      >
                        <motion.polyline
                          fill="none"
                          points="1 9 7 14 15 4"
                          stroke="#F9F8F4"
                          strokeDasharray="22"
                          strokeDashoffset="44"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          exit={{ pathLength: 0 }}
                        />
                      </motion.svg>
                    </div>
                  ) : (
                    <div
                      className={
                        'flex h-full items-center justify-center rounded-[5px] border border-foreground p-1 group-hover:border-left-accent group-hover:opacity-80'
                      }
                    >
                      <svg
                        width="20"
                        height="24"
                        viewBox="0 0 20 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={'h-6 w-6'}
                      >
                        <path
                          d="M11 20C12.3256 19.9984 13.5964 19.4711 14.5338 18.5338C15.4711 17.5965 15.9984 16.3256 16 15V6.24302C16.0016 5.71738 15.8988 5.19665 15.6976 4.71104C15.4964 4.22542 15.2008 3.78456 14.828 3.41402L12.586 1.17202C12.2155 0.799191 11.7746 0.50362 11.289 0.302438C10.8034 0.101255 10.2826 -0.00153795 9.757 1.73896e-05H5C3.67441 0.00160525 2.40356 0.528899 1.46622 1.46624C0.528882 2.40358 0.00158786 3.67442 0 5.00002V15C0.00158786 16.3256 0.528882 17.5965 1.46622 18.5338C2.40356 19.4711 3.67441 19.9984 5 20H11ZM2 15V5.00002C2 4.20437 2.31607 3.44131 2.87868 2.8787C3.44129 2.31609 4.20435 2.00002 5 2.00002C5 2.00002 9.919 2.01402 10 2.02402V4.00002C10 4.53045 10.2107 5.03916 10.5858 5.41423C10.9609 5.7893 11.4696 6.00002 12 6.00002H13.976C13.986 6.08102 14 15 14 15C14 15.7957 13.6839 16.5587 13.1213 17.1213C12.5587 17.6839 11.7956 18 11 18H5C4.20435 18 3.44129 17.6839 2.87868 17.1213C2.31607 16.5587 2 15.7957 2 15ZM20 8.00002V19C19.9984 20.3256 19.4711 21.5965 18.5338 22.5338C17.5964 23.4711 16.3256 23.9984 15 24H6C5.73478 24 5.48043 23.8947 5.29289 23.7071C5.10536 23.5196 5 23.2652 5 23C5 22.7348 5.10536 22.4804 5.29289 22.2929C5.48043 22.1054 5.73478 22 6 22H15C15.7956 22 16.5587 21.6839 17.1213 21.1213C17.6839 20.5587 18 19.7957 18 19V8.00002C18 7.7348 18.1054 7.48045 18.2929 7.29291C18.4804 7.10537 18.7348 7.00002 19 7.00002C19.2652 7.00002 19.5196 7.10537 19.7071 7.29291C19.8946 7.48045 20 7.7348 20 8.00002Z"
                          fill="#F9F8F4"
                          className={'group-hover:fill-left-accent'}
                        />
                      </svg>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className={'flex flex-col gap-2 pb-8'}>
              <span className={'font-medium uppercase text-left-accent'}>
                Share invite link in social media
              </span>
              <div
                className={
                  'flex w-full max-w-[80%] flex-row items-center gap-2'
                }
              >
                {shareSocials.map((item, index) => (
                  <Link
                    href={item.link}
                    target={'_blank'}
                    key={index}
                    className={
                      'group cursor-pointer rounded-[5px] border border-foreground p-2 hover:border-left-accent hover:opacity-80'
                    }
                  >
                    {item.image}
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
        <div className={'flex-grow'} />
        <div className={'flex flex-col gap-2 pt-4'}>
          <span className={'text-[16px]/[16px] font-medium uppercase'}>
            Players list
          </span>
          <div className={'grid grid-cols-5 font-plexsans text-[16px]/[16px]'}>
            <span className={'col-start-1 col-end-1'}>Index</span>
            <span className={'col-start-2 col-end-3'}>Nickname\Adress</span>
            <span className={'col-start-4 col-end-6'}>Status</span>
          </div>
          <div className={'flex flex-col'}>
            <>
              {lobby.playersAddresses?.map((player, index) => (
                <PlayersListItem
                  key={player.toBase58()}
                  account={player.toBase58()}
                  state={
                    lobby.playersReady![index]
                      ? PlayerStates.Ready
                      : PlayerStates.Waiting
                  }
                  index={index + 1}
                />
              ))}
              {lobby.playersAddresses !== undefined &&
                lobby.playersAddresses?.length < lobby.maxPlayers &&
                [
                  ...Array(lobby.maxPlayers - lobby.playersAddresses?.length),
                ].map((_, index) => (
                  <PlayersListItem
                    key={index}
                    account={'Empty slot'}
                    state={PlayerStates.EmptySlot}
                    index={
                      lobby.playersAddresses
                        ? index + 1 + lobby.playersAddresses.length
                        : index + 1
                    }
                  />
                ))}
            </>
          </div>
        </div>
        <div className={'flex-grow'} />
        {currentLobbyId == lobby.id ? (
          <div className={'flex flex-row gap-2 pt-2'}>
            <Button
              label={selfReady ? 'Not ready' : 'Ready to play'}
              onClick={ready}
            />
            <Button
              label={'Leave lobby'}
              onClick={() =>
                leaveLobby()
                  .then(() =>
                    toast.success(
                      toasterStore,
                      `Leaved lobby #${lobby.id} '${lobby.name}'`,
                      true
                    )
                  )
                  .catch((error) => {
                    console.log(error);
                    toast.error(
                      toasterStore,
                      `Error while leave lobby #${lobby.id} '${lobby.name}'`
                    );
                  })
              }
              color={'tertiary'}
            />
          </div>
        ) : (
          <Button
            label={'Connect to lobby'}
            onClick={() => {
              if (lobby.maxPlayers === lobby.playersAddresses?.length) return;
              if (networkStore.address)
                joinLobby(lobby.id)
                  .then(() =>
                    toast.success(
                      toasterStore,
                      `Joined lobby #${lobby.id} '${lobby.name}'`,
                      true
                    )
                  )
                  .catch((error) => {
                    console.log(error);
                    toast.error(
                      toasterStore,
                      `Error while join lobby #${lobby.id} '${lobby.name}'`
                    );
                  });
              else setIsConnectWalletModal(true);
            }}
            disabled={lobby.maxPlayers === lobby.playersAddresses?.length}
          />
        )}
      </div>
      <BaseModal
        isDismissible={false}
        isOpen={isConnectWalletModal}
        setIsOpen={setIsConnectWalletModal}
      >
        <div className={'flex flex-col items-start justify-center gap-6'}>
          <span
            className={
              'px-10 text-headline-2 font-medium uppercase text-right-accent'
            }
          >
            Connect wallet to play
          </span>
          <div className={'flex w-full flex-col gap-2'}>
            <span className={'text-headline-2 font-medium text-foreground'}>
              Game Information
            </span>
            <div
              className={
                'flex flex-row justify-between font-plexsans text-[16px]/[16px]'
              }
            >
              <span className={'font-medium uppercase text-left-accent'}>
                Game Name
              </span>
              <span className={'w-full max-w-[60%]'}>{gameName}</span>
            </div>
            <div
              className={
                'flex flex-row justify-between font-plexsans text-[16px]/[16px]'
              }
            >
              <span className={'font-medium uppercase text-left-accent'}>
                Participants fee
              </span>
              <span className={'w-full max-w-[60%]'}>
                {formatUnits(lobby.fee)} {lobby.currency}
              </span>
            </div>
            <div
              className={
                'flex flex-row justify-between font-plexsans text-[16px]/[16px]'
              }
            >
              <span className={'font-medium uppercase text-left-accent'}>
                Max Funds
              </span>
              <span className={'w-full max-w-[60%]'}>
                {formatUnits(lobby.reward)} {lobby.currency}
              </span>
            </div>
          </div>
          {walletInstalled() ? (
            <Button
              label={'Connect wallet'}
              onClick={() => networkStore.connectWallet(false)}
              color={'secondary'}
            />
          ) : (
            <Button
              label={'Install wallet'}
              asLink
              href={'https://www.aurowallet.com/'}
              color={'secondary'}
            />
          )}
        </div>
      </BaseModal>
    </motion.div>
  );
};

import { LobbyWrap } from '@/components/framework/Lobby/LobbyWrap';
import GamePage from '@/components/framework/GamePage';
import { randzuConfig } from '@/games/randzu/config';
import RandzuCoverSVG from '@/games/randzu/assets/game-cover.svg';
import RandzuCoverMobileSVG from '@/games/randzu/assets/game-cover-mobile.svg';
import { FastMatchmaking } from '@/components/framework/Lobby/FastMatchmaking';
import { LobbyList } from '@/components/framework/Lobby/LobbyList';
import { Popover } from '@/components/ui/games-store/shared/Popover';
import { LobbyInformation } from '@/components/framework/Lobby/LobbyInformation';
import { CreateNewLobbyBtn } from '@/components/framework/Lobby/CreateNewLobbyBtn';
import { usePvpLobbyStorage } from '@/lib/stores/pvpLobbyStore';
import { ILobby } from '@/lib/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { CreateNewLobby } from '@/components/framework/Lobby/CreateNewLobby';
import { AnimatePresence, motion } from 'framer-motion';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';
import { ClientAppChain, ProtoUInt64 } from 'zknoid-chain-dev';
import { Bool, CircuitString, PublicKey, UInt64 } from 'o1js';
import { useNetworkStore } from '@/lib/stores/network';
import {
  useObserveRandzuLobbiesStore,
  useRandzuLobbiesStore,
} from '../stores/lobbiesStore';
import { useStore } from 'zustand';
import { useSessionKeyStore } from '@/lib/stores/sessionKeyStorage';
import { Modal } from '@/components/ui/games-store/shared/Modal';
import { Button } from '@/components/ui/games-store/shared/Button';

export default function RandzuLobby({
  params,
}: {
  params: { lobbyId: string };
}) {
  const router = useRouter();
  const lobbiesStore = useRandzuLobbiesStore();
  const pvpLobbyStorage = usePvpLobbyStorage();
  const searchParams = useSearchParams();
  const networkStore = useNetworkStore();
  const [currentLobby, setCurrentLobby] = useState<ILobby | undefined>(
    undefined
  );
  const [isCreationMode, setIsCreationMode] = useState<boolean>(false);
  const [isLobbyNotFoundModalOpen, setIsLobbyNotFoundModalOpen] =
    useState<boolean>(false);

  const client = useContext(AppChainClientContext) as ClientAppChain<
    typeof randzuConfig.runtimeModules,
    any,
    any,
    any
  >;

  const sessionPrivateKey = useStore(useSessionKeyStore, (state) =>
    state.getSessionKey()
  );

  if (!client) {
    throw Error('Context app chain client is not set');
  }

  useObserveRandzuLobbiesStore();

  useEffect(() => {
    const lobbyKey = searchParams.get('key');
    if (lobbyKey && params.lobbyId !== 'undefined') {
      if (
        lobbiesStore.lobbies.find(
          (lobby) =>
            lobby.accessKey === lobbyKey &&
            lobby.id.toString() === params.lobbyId
        )
      ) {
        pvpLobbyStorage.setConnectedLobbyKey(lobbyKey);
        pvpLobbyStorage.setConnectedLobbyId(Number(params.lobbyId));
      } else setIsLobbyNotFoundModalOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (lobbiesStore.activeGameId) {
      console.log(`Active gameId: `, lobbiesStore.activeGameId);
      console.log(`Move to game page`);
      router.push(`/games/randzu/${lobbiesStore.activeGameId}`);
    }
  }, [lobbiesStore.activeGameId]);

  useEffect(() => {
    if (params.lobbyId !== 'undefined') {
      const lobby = lobbiesStore.lobbies.find(
        (lobby) => lobby.id.toString() === params.lobbyId
      );
      if (lobby) setCurrentLobby(lobby);
      else setIsLobbyNotFoundModalOpen(true);
    } else {
      const lobby = lobbiesStore.lobbies.find(
        (lobby) => lobby.id === pvpLobbyStorage.lastLobbyId
      );
      setCurrentLobby(lobby);
    }
  }, [lobbiesStore.lobbies, params.lobbyId, pvpLobbyStorage.lastLobbyId]);

  const createNewLobby = async (
    name: string,
    participationFee: number,
    privateLobby: boolean
  ) => {
    const randzuLobbyManager = await client.runtime.resolve('RandzuLogic');

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      () => {
        randzuLobbyManager.createLobby(
          CircuitString.fromString(name),
          ProtoUInt64.from(participationFee),
          Bool(privateLobby),
          sessionPrivateKey.toPublicKey()
        );
      }
    );

    await tx.sign();
    await tx.send();
  };

  const joinLobby = async (lobbyId: number) => {
    const randzuLobbyManager = await client.runtime.resolve('RandzuLogic');

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      () => {
        randzuLobbyManager.joinLobbyWithSessionKey(
          UInt64.from(lobbyId),
          sessionPrivateKey.toPublicKey()
        );
      }
    );

    await tx.sign();
    await tx.send();
  };

  const ready = async () => {
    const randzuLobbyManager = await client.runtime.resolve('RandzuLogic');

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      () => {
        randzuLobbyManager.ready();
      }
    );

    await tx.sign();
    await tx.send();
  };

  const leaveLobby = async () => {
    const randzuLobbyManager = await client.runtime.resolve('RandzuLogic');

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      () => {
        randzuLobbyManager.leaveLobby();
      }
    );

    await tx.sign();
    await tx.send();
  };

  const register = async (id: number) => {
    const randzuLobbyManager = await client.runtime.resolve('RandzuLogic');

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      () => {
        randzuLobbyManager.registerWithType(
          sessionPrivateKey.toPublicKey(),
          UInt64.from(id),
          UInt64.zero
        );
      }
    );

    await tx.sign();
    await tx.send();
  };

  return (
    <GamePage
      gameConfig={randzuConfig}
      image={RandzuCoverSVG}
      mobileImage={RandzuCoverMobileSVG}
      defaultPage={'Lobby list'}
    >
      <Modal
        trigger={<></>}
        isDismissible={false}
        isOpen={isLobbyNotFoundModalOpen}
        setIsOpen={setIsLobbyNotFoundModalOpen}
      >
        <div
          className={
            'flex min-w-[400px] flex-col items-center justify-center gap-4'
          }
        >
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
              d="M50.5391 116.29C54.8955 113.646 65.1452 108.224 79.293 108.034C93.6805 107.841 104.212 113.164 108.616 115.72"
              stroke="#D2FF00"
              strokeWidth="5"
              strokeMiterlimit="10"
            />
          </svg>
          <span className={'text-headline-1'}>Lobby not found</span>
          <span>Lobby not exist or link is broken</span>
          <Button
            label={'To lobbies'}
            onClick={() => {
              router.push(`/games/${randzuConfig.id}/lobby/undefined`);
            }}
          />
        </div>
      </Modal>
      <LobbyWrap>
        <FastMatchmaking
          options={lobbiesStore.mathcmakingOptions}
          winCoef={1.67}
          register={register}
        />
        <div className={'col-start-4 col-end-6 row-start-1'}>
          {isCreationMode ? (
            <span className={'text-headline-1 '}>Lobby creation</span>
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
                    className={
                      'w-full text-[12px]/[12px] font-light opacity-70'
                    }
                  >
                    When you select the lobby, full information about the
                    upcoming competition will appear here, if you agree to the
                    terms of the game, join and have fun!
                  </div>
                </div>
              </Popover>
            </div>
          )}
        </div>
        <AnimatePresence mode={'wait'} initial={false}>
          {isCreationMode ? (
            <CreateNewLobby
              createLobby={createNewLobby}
              setIsCreationMode={setIsCreationMode}
            />
          ) : currentLobby ? (
            <>
              <LobbyInformation
                lobby={currentLobby}
                gameName={randzuConfig.name}
                joinLobby={joinLobby}
                leaveLobby={leaveLobby}
                ready={ready}
                currentLobbyId={lobbiesStore.currentLobby?.id}
                selfReady={lobbiesStore.selfReady}
              />
              <motion.span
                className={'col-start-4 col-end-6 row-span-1 text-headline-1'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', duration: 0.8, bounce: 0 }}
              >
                Lobby creation
              </motion.span>

              <CreateNewLobbyBtn
                onClick={() => setIsCreationMode(!isCreationMode)}
              />
            </>
          ) : (
            <>
              <motion.span
                className={
                  'col-start-4 col-end-6 row-span-1 row-start-1 text-headline-1'
                }
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', duration: 0.8, bounce: 0 }}
              >
                Lobby creation
              </motion.span>

              <CreateNewLobbyBtn
                onClick={() => setIsCreationMode(!isCreationMode)}
              />
            </>
          )}
        </AnimatePresence>
        <LobbyList lobbys={lobbiesStore.lobbies} />
      </LobbyWrap>
    </GamePage>
  );
}

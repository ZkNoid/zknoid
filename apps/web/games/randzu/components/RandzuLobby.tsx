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
import { Currency } from '@/constants/currency';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { CreateNewLobby } from '@/components/framework/Lobby/CreateNewLobby';
import { AnimatePresence, motion } from 'framer-motion';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';
import { ClientAppChain, ProtoUInt64 } from 'zknoid-chain-dev';
import { CircuitString, PublicKey, UInt64 } from 'o1js';
import { useNetworkStore } from '@/lib/stores/network';
import {
  useObserveRandzuLobbiesStore,
  useRandzuLobbiesStore,
} from '../stores/lobbiesStore';
import { useStore } from 'zustand';
import { useSessionKeyStore } from '@/lib/stores/sessionKeyStorage';

const lobbysOld: ILobby[] = [
  {
    id: 1,
    name: 'Test Lobby',
    reward: 5n * 1000000000n,
    fee: 10n * 1000000000n,
    maxPlayers: 10,
    players: 5,
    currency: Currency.ZNAKES,
    accessKey: 'f4d23bf0-5a83-4468-a974-9eb95c32c3fa',
  },
  {
    id: 2,
    name: 'Test Lobby',
    reward: 4n * 1000000000n,
    fee: 11n * 1000000000n,
    maxPlayers: 10,
    players: 5,
    currency: Currency.ZNAKES,
    accessKey: 'f49e171f-6b2f-4c63-a4f6-917db739d7a9',
  },
  {
    id: 3,
    name: 'Test Lobby',
    reward: 8n * 1000000000n,
    fee: 0n * 1000000000n,
    maxPlayers: 12,
    players: 0,
    currency: Currency.ZNAKES,
    accessKey: '8f007986-d2c3-4b3f-bd37-224679e642ee',
  },
  {
    id: 4,
    name: 'Test Lobby',
    reward: 0n * 1000000000n,
    fee: 0n * 1000000000n,
    maxPlayers: 2,
    players: 0,
    currency: Currency.ZNAKES,
    accessKey: '66f52dfc-7a7c-45ec-a210-0e51ab93b312',
  },
  {
    id: 5,
    name: 'Test Lobby',
    reward: 88n * 1000000000n,
    fee: 10n * 1000000000n,
    maxPlayers: 20,
    players: 19,
    currency: Currency.ZNAKES,
    accessKey: 'e79af9d6-c98e-482e-989b-6f04db407606',
  },
  {
    id: 6,
    name: 'Test Lobby',
    reward: 541n * 1000000000n,
    fee: 0n * 1000000000n,
    maxPlayers: 2,
    players: 0,
    currency: Currency.ZNAKES,
    accessKey: '2a4dcfbb-5c10-4557-aac7-b4511abb8b15',
  },
];

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
    if (
      lobbyKey &&
      lobbiesStore.lobbies.find(
        (lobby) =>
          lobby.accessKey === lobbyKey && lobby.id.toString() === params.lobbyId
      )
    ) {
      pvpLobbyStorage.setConnectedLobbyKey(lobbyKey);
      pvpLobbyStorage.setConnectedLobbyId(Number(params.lobbyId));
    }
  }, [searchParams]);

  useEffect(() => {
    if (lobbiesStore.activeGameId) {
      console.log(`Active gameId: `, lobbiesStore.activeGameId);
      console.log(`Move to game page`);
      router.push(`/games/randzu/${lobbiesStore.activeGameId}`);
    }
  }, [lobbiesStore.activeGameId]);

  // useEffect(() => {
  //   if (
  //     currentLobby &&
  //     params.lobbyId != pvpLobbyStorage.lastLobbyId?.toString()
  //   )
  //     pvpLobbyStorage.setLastLobbyId(currentLobby.id);
  // }, [currentLobby, params.lobbyId]);

  useEffect(() => {
    if (params.lobbyId !== 'undefined') {
      const lobby = lobbiesStore.lobbies.find(
        (lobby) => lobby.id.toString() === params.lobbyId
      );
      setCurrentLobby(lobby);
    } else {
      const lobby = lobbiesStore.lobbies.find(
        (lobby) => lobby.id === pvpLobbyStorage.lastLobbyId
      );
      setCurrentLobby(lobby);
    }
  }, [lobbiesStore.lobbies, params.lobbyId, pvpLobbyStorage.lastLobbyId]);

  const createNewLobby = async (name: string, participationFee: number) => {
    const randzuLobbyManager = await client.runtime.resolve('RandzuLogic');

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      () => {
        randzuLobbyManager.createLobby(
          CircuitString.fromString(name),
          ProtoUInt64.from(participationFee),
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
      <LobbyWrap>
        <FastMatchmaking
          options={lobbiesStore.mathcmakingOptions}
          winCoef={1.67}
          register={register}
        />
        <div className={'col-start-4 col-end-6 row-start-1'}>
          {pvpLobbyStorage.lastLobbyId && (
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
                className={'text-headline-1'}
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
                  ' col-start-4 col-end-6 row-span-1 row-start-1 text-headline-1'
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

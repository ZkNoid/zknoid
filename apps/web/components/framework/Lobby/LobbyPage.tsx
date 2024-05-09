import { LobbyWrap } from '@/components/framework/Lobby/LobbyWrap';
import { FastMatchmaking } from '@/components/framework/Lobby/FastMatchmaking';
import { LobbyList } from '@/components/framework/Lobby/LobbyList';
import { Popover } from '@/components/ui/games-store/shared/Popover';
import { LobbyInformation } from '@/components/framework/Lobby/LobbyInformation';
import { CreateNewLobbyBtn } from '@/components/framework/Lobby/CreateNewLobbyBtn';
import { usePvpLobbyStorage } from '@/lib/stores/pvpLobbyStore';
import { ILobby } from '@/lib/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';
import { CreateNewLobby } from '@/components/framework/Lobby/CreateNewLobby';
import { AnimatePresence, motion } from 'framer-motion';
import AppChainClientContext from '@/lib/contexts/AppChainClientContext';
import { ClientAppChain, MatchMaker, ProtoUInt64 } from 'zknoid-chain-dev';
import { Field, Bool, CircuitString, PublicKey, UInt64 } from 'o1js';
import { useNetworkStore } from '@/lib/stores/network';
import { PendingTransaction, type ModuleQuery } from '@proto-kit/sequencer';
import { useStore } from 'zustand';
import { useSessionKeyStore } from '@/lib/stores/sessionKeyStorage';
import { Modal } from '@/components/ui/games-store/shared/Modal';
import { Button } from '@/components/ui/games-store/shared/Button';
import { useProtokitChainStore } from '@/lib/stores/protokitChain';
import {
  useLobbiesStore,
  useObserveLobbiesStore,
} from '@/lib/stores/lobbiesStore';
import { ZkNoidGameConfig } from '@/lib/createConfig';
import { RuntimeModulesRecord } from '@proto-kit/module';
import { AlreadyInLobbyModal } from '@/components/framework/Lobby/AlreadyInLobbyModal';
import { useAlreadyInLobbyModalStore } from '@/lib/stores/alreadyInLobbyModalStore';
import { api } from '@/trpc/react';
import { getEnvContext } from '@/lib/envContext';

export default function LobbyPage<RuntimeModules extends RuntimeModulesRecord>({
  lobbyId,
  query,
  contractName,
  config, // params,
  rewardCoeff,
}: {
  // params: {
  lobbyId: string;
  query: ModuleQuery<MatchMaker>;
  contractName: string;
  config: ZkNoidGameConfig<RuntimeModules>;
  rewardCoeff?: number;
  // };
}) {
  const params = {
    lobbyId,
    query,
    contractName,
    config,
  };
  const router = useRouter();
  const chainStore = useProtokitChainStore();
  const lobbiesStore = useLobbiesStore();
  const pvpLobbyStorage = usePvpLobbyStorage();
  const alreadyInLobbyModalStore = useAlreadyInLobbyModalStore();
  const searchParams = useSearchParams();
  const networkStore = useNetworkStore();
  const [currentLobby, setCurrentLobby] = useState<ILobby | undefined>(
    undefined
  );
  const [isCreationMode, setIsCreationMode] = useState<boolean>(false);
  const [isLobbyNotFoundModalOpen, setIsLobbyNotFoundModalOpen] =
    useState<boolean>(false);
  const progress = api.progress.setSolvedQuests.useMutation();

  const client = useContext(AppChainClientContext) as ClientAppChain<
    // typeof params.config.runtimeModules,
    any,
    any,
    any,
    any
  >;

  // const query = client.query.runtime[params.contractName];

  const sessionPrivateKey = useStore(useSessionKeyStore, (state) =>
    state.getSessionKey()
  );

  if (!client) {
    throw Error('Context app chain client is not set');
  }

  useObserveLobbiesStore(params.query, rewardCoeff);

  const searchedLobby = useRef(false);
  const waitNewLobby = useRef(false);

  useEffect(() => {
    if (searchedLobby.current) {
      return;
    }

    const lobbyKey = searchParams.get('key');

    if (lobbiesStore.loading) {
      return;
    }

    if (
      lobbyKey &&
      params.lobbyId !== 'undefined' &&
      (lobbiesStore.currentLobby
        ? parseInt(params.lobbyId) !== lobbiesStore.currentLobby.id
        : true)
    ) {
      let lobby = lobbiesStore.lobbies.find((lobby) => {
        return (
          lobby.id === parseInt(params.lobbyId) &&
          (!lobby.privateLobby || lobby.accessKey === parseInt(lobbyKey))
        );
      });
      if (lobby) {
        searchedLobby.current = true;
        setIsLobbyNotFoundModalOpen(false);
        // joinLobby(lobby.id);
        // pvpLobbyStorage.setConnectedLobbyKey(lobby.accessKey.toString());
        // pvpLobbyStorage.setConnectedLobbyId(lobby.id);
        pvpLobbyStorage.setLastLobbyId(lobby.id);
      } else {
        setIsLobbyNotFoundModalOpen(true);
      }
    }
  }, [lobbiesStore.loading]);
  // }, [lobbiesStore.lobbies, params.lobbyId, searchParams]);

  useEffect(() => {
    if (lobbiesStore.activeGameId) {
      console.log(`Active gameId: `, lobbiesStore.activeGameId);
      console.log(`Move to game page`);

      progress.mutate({
        userAddress:
          lobbiesStore.currentLobby!.playersAddresses?.[0]?.toBase58() || '',
        section: 'THIMBLERIG',
        id: 3,
        txHash: '',
        envContext: getEnvContext(),
      });

      router.push(`/games/${params.config.id}/${lobbiesStore.activeGameId}`);
    }
  }, [lobbiesStore.activeGameId]);

  useEffect(() => {
    // if (params.lobbyId !== 'undefined') {
    //   const lobby = lobbiesStore.lobbies.find(
    //     (lobby) => lobby.id.toString() === params.lobbyId
    //   );
    //   if (lobby) setCurrentLobby(lobby);
    // } else {
    const lobby = lobbiesStore.lobbies.find(
      (lobby) => lobby.id === pvpLobbyStorage.lastLobbyId
    );
    setCurrentLobby(lobby);
    // }
  }, [lobbiesStore.lobbies, params.lobbyId, pvpLobbyStorage.lastLobbyId]);

  useEffect(() => {
    // setCurrentLobby(lobbiesStore.currentLobby);
    if (
      (waitNewLobby.current || !pvpLobbyStorage.lastLobbyId) &&
      lobbiesStore.currentLobby?.id
    ) {
      pvpLobbyStorage.setLastLobbyId(lobbiesStore.currentLobby.id);
      waitNewLobby.current = false;
    }
  }, [lobbiesStore.currentLobby?.id]);

  const createNewLobby = async (
    name: string,
    participationFee: number,
    privateLobby: boolean,
    accessKey: number
  ) => {
    const lobbyManager = await client.runtime.resolve(params.contractName);

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      () => {
        lobbyManager.createLobby(
          CircuitString.fromString(name),
          ProtoUInt64.from(participationFee).mul(10 ** 9),
          Bool(privateLobby),
          sessionPrivateKey.toPublicKey(),
          Field.from(accessKey)
        );
      }
    );

    await tx.sign();
    await tx.send();

    if (contractName == 'ThimblerigLogic') {
      await progress.mutateAsync({
        userAddress: networkStore.address!,
        section: 'THIMBLERIG',
        id: 2,
        txHash: JSON.stringify(
          (tx.transaction! as PendingTransaction).toJSON()
        ),
        envContext: getEnvContext(),
      });
    }

    waitNewLobby.current = true;
  };

  const joinLobby = async (lobbyId: number) => {
    if (lobbiesStore.currentLobby) {
      alreadyInLobbyModalStore.setIsOpen(true);
      return;
    }

    const lobbyManager = await client.runtime.resolve(params.contractName);

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      () => {
        lobbyManager.joinLobbyWithSessionKey(
          UInt64.from(lobbyId),
          sessionPrivateKey.toPublicKey()
        );
      }
    );

    await tx.sign();
    await tx.send();
  };

  const ready = async () => {
    const lobbyManager = await client.runtime.resolve(params.contractName);

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      () => {
        lobbyManager.ready();
      }
    );

    await tx.sign();
    await tx.send();
  };

  const leaveLobby = async () => {
    const lobbyManager = await client.runtime.resolve(params.contractName);

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      () => {
        lobbyManager.leaveLobby();
      }
    );

    await tx.sign();
    await tx.send();

    if (alreadyInLobbyModalStore.isOpen) alreadyInLobbyModalStore.close();
  };

  const leaveMatchmaking = async (type: number) => {
    const lobbyManager = await client.runtime.resolve(params.contractName);

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      () => {
        lobbyManager.leaveMathmaking(UInt64.from(type));
      }
    );

    await tx.sign();
    await tx.send();
  };

  const register = async (id: number) => {
    const lobbyManager = await client.runtime.resolve(params.contractName);

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      () => {
        lobbyManager.registerWithType(
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
    <>
      <Modal
        trigger={<></>}
        isDismissible={false}
        isOpen={isLobbyNotFoundModalOpen}
        setIsOpen={setIsLobbyNotFoundModalOpen}
      >
        <div
          className={
            'flex min-w-[400px] flex-col items-center justify-center gap-4 px-16'
          }
        >
          <span className={'text-[100px]/[100px] font-medium text-left-accent'}>
            404
          </span>
          <span className={'text-headline-1 uppercase text-left-accent'}>
            Lobby is not found
          </span>
          <span>
            Maybe the owner of this lobby deleted it or it is outdated
          </span>
          <Button
            label={'To lobbies'}
            asLink
            href={`/games/${params.config.id}/lobby/undefined`}
          />
        </div>
      </Modal>
      <LobbyWrap>
        <FastMatchmaking
          options={lobbiesStore.mathcmakingOptions}
          winCoef={1.67}
          blockNumber={chainStore.block ? +chainStore.block.height : 0}
          register={register}
          leave={leaveMatchmaking}
        />
        <div className={'col-start-4 col-end-6 row-start-1'}>
          {isCreationMode ? (
            <span className={'text-headline-1'}>Lobby creation</span>
          ) : currentLobby ? (
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
          ) : undefined}
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
                config={params.config}
                gameName={params.config.name}
                joinLobby={joinLobby}
                leaveLobby={leaveLobby}
                ready={ready}
                currentLobbyId={lobbiesStore.currentLobby?.id}
                selfReady={lobbiesStore.selfReady}
                backToJoinedLobby={() => {
                  setCurrentLobby(lobbiesStore.currentLobby);
                  pvpLobbyStorage.setLastLobbyId(lobbiesStore.currentLobby!.id);
                }}
              />
              <motion.span
                className={
                  'col-start-4 col-end-6 row-span-1 mt-6 text-headline-1'
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
        {alreadyInLobbyModalStore.isOpen && (
          <AlreadyInLobbyModal
            isOpen={alreadyInLobbyModalStore.isOpen}
            setIsOpen={alreadyInLobbyModalStore.setIsOpen}
            leaveLobby={leaveLobby}
          />
        )}
      </LobbyWrap>
    </>
  );
}

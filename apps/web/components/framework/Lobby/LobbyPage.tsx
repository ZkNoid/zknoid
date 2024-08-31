import { LobbyWrap } from '@/components/framework/Lobby/ui/LobbyWrap';
import { FastMatchmaking } from '@/components/framework/Lobby/ui/FastMatchmaking';
import LobbyList from '@/components/framework/Lobby/LobbyList';
import Popover from '@/components/shared/Popover';
import { LobbyInformation } from '@/components/framework/Lobby/ui/LobbyInformation';
import { CreateNewLobbyBtn } from '@/components/framework/Lobby/ui/CreateNewLobbyBtn';
import { usePvpLobbyStorage } from '@/lib/stores/pvpLobbyStore';
import { ILobby } from '@/lib/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';
import { CreateNewLobby } from '@/components/framework/Lobby/ui/CreateNewLobby';
import { AnimatePresence, motion } from 'framer-motion';
import ZkNoidGameContext from '@/lib/contexts/ZkNoidGameContext';
import { ClientAppChain, MatchMaker, ProtoUInt64 } from 'zknoid-chain-dev';
import { Field, Bool, CircuitString, PublicKey, UInt64 } from 'o1js';
import { useNetworkStore } from '@/lib/stores/network';
import { type PendingTransaction, type ModuleQuery } from '@proto-kit/sequencer';
import { useStore } from 'zustand';
import { useSessionKeyStore } from '@/lib/stores/sessionKeyStorage';
import BaseModal from '@/components/shared/Modal/BaseModal';
import Button from '@/components/shared/Button';
import {
  useLobbiesStore,
  useObserveLobbiesStore,
} from '@/lib/stores/lobbiesStore';
import { ZkNoidGameConfig } from '@/lib/createConfig';
import { RuntimeModulesRecord } from '@proto-kit/module';
import { AlreadyInLobbyModal } from '@/components/framework/Lobby/ui/modals/AlreadyInLobbyModal';
import { useAlreadyInLobbyModalStore } from '@/lib/stores/alreadyInLobbyModalStore';
import { api } from '@/trpc/react';
import { getEnvContext } from '@/lib/envContext';

export default function LobbyPage<RuntimeModules extends RuntimeModulesRecord>({
  lobbyId,
  query,
  contractName,
  config,
  rewardCoeff,
}: {
  lobbyId: string;
  query: ModuleQuery<MatchMaker> | undefined;
  contractName: string;
  config: ZkNoidGameConfig<RuntimeModules>;
  rewardCoeff?: number;
}) {
  const params = {
    lobbyId,
    query,
    contractName,
    config,
  };
  const router = useRouter();
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

  const { client } = useContext(ZkNoidGameContext);

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
        pvpLobbyStorage.setLastLobbyId(lobby.id);
      } else {
        setIsLobbyNotFoundModalOpen(true);
      }
    }
  }, [lobbiesStore.loading]);

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
    const lobby = lobbiesStore.lobbies.find(
      (lobby) => lobby.id === pvpLobbyStorage.lastLobbyId
    );
    setCurrentLobby(lobby);
  }, [lobbiesStore.lobbies, params.lobbyId, pvpLobbyStorage.lastLobbyId]);

  useEffect(() => {
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
      async () => {
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
      throw new Error('Already in lobby');
    }

    const lobbyManager = await client.runtime.resolve(params.contractName);

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      async () => {
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
      async () => {
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
      async () => {
        lobbyManager.leaveLobby();
      }
    );

    await tx.sign();
    await tx.send();

    if (alreadyInLobbyModalStore.isOpen) alreadyInLobbyModalStore.close();
  };

  const leaveMatchmaking = async (type: number) => {
    if (!networkStore.address) {
      return;
    }

    const lobbyManager = await client.runtime.resolve(params.contractName);

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      async () => {
        lobbyManager.leaveMatchmaking(UInt64.from(type));
      }
    );

    await tx.sign();
    await tx.send();
  };

  const register = async (id: number) => {
    if (!networkStore.walletConnected) await networkStore.connectWallet(false);
    if (!networkStore.address) throw Error('Not connected');

    const lobbyManager = await client.runtime.resolve(params.contractName);

    const tx = await client.transaction(
      PublicKey.fromBase58(networkStore.address!),
      async () => {
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
      <BaseModal
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
      </BaseModal>
      <LobbyWrap>
        <FastMatchmaking
          options={lobbiesStore.matchmakingOptions}
          winCoef={1.67}
          register={register}
          leave={leaveMatchmaking}
        />
        <div className={'col-start-4 col-end-6 row-start-1'}>
          {isCreationMode ? (
            <span className={'mt-2 text-headline-1'}>Lobby creation</span>
          ) : currentLobby ? (
            <div className={'flex flex-row gap-1'}>
              <span className={'text-headline-1'}>Lobby Information</span>
              <Popover>
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
        <LobbyList lobbies={lobbiesStore.lobbies} />
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

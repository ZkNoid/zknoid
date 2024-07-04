import GamePage from '@/components/framework/GamePage';
import { lotteryConfig } from './config';
import { useNetworkStore } from '@/lib/stores/network';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import BannerSection from './ui/BannerSection';
import TicketsSection from './ui/TicketsSection';
import { useWorkerClientStore } from '@/lib/stores/workerClient';
import { useChainStore } from '@/lib/stores/minaChain';
import { DateTime, Duration } from 'luxon';
import { NetworkIds, NETWORKS } from '@/app/constants/networks';
import WrongNetworkModal from '@/games/lottery/ui/TicketsSection/ui/WrongNetworkModal';
import { api } from '@/trpc/react';
import { Field, fetchAccount } from 'o1js';
import { LOTTERY_ADDRESS } from '@/app/constants/addresses';
import { BLOCK_PER_ROUND } from 'l1-lottery-contracts';
import StateManager from '@/games/lottery/ui/StateManager';

export default function LotteryComponent({}: {
  params: { competitionId: string };
}) {
  const networkStore = useNetworkStore();
  const [roundEndsIn, setRoundEndsIn] = useState<DateTime>(
    DateTime.fromMillis(0)
  );

  const workerClientStore = useWorkerClientStore();
  const chainStore = useChainStore();
  const events = api.lotteryBackend.getMinaEvents.useQuery({});

  useEffect(() => {
    if (!networkStore.minaNetwork?.networkID) return;

    const lotteryPublicKey58 =
      LOTTERY_ADDRESS[networkStore.minaNetwork?.networkID!];

    (async () => {
      const account = await fetchAccount({ publicKey: lotteryPublicKey58 });

      const onchainState = {
        ticketRoot: account.account?.zkapp?.appState[0]!,
        ticketNullifier: account.account?.zkapp?.appState[1]!,
        bankRoot: account.account?.zkapp?.appState[2]!,
        roundResultRoot: account.account?.zkapp?.appState[3]!,
        startBlock: account.account?.zkapp?.appState[4].toBigInt()!,
      };

      workerClientStore.setOnchainState(onchainState);

      if (chainStore.block?.height) {
        const roundId = Math.floor(
          Number(chainStore.block!.slotSinceGenesis - onchainState.startBlock) /
            BLOCK_PER_ROUND
        );

        workerClientStore.setRoundId(roundId);
      }
    })();
  }, [networkStore.minaNetwork?.networkID, chainStore.block?.height]);

  useEffect(() => {
    console.log(
      workerClientStore.client,
      networkStore.minaNetwork?.networkID,
      chainStore.block?.slotSinceGenesis,
      events.data?.events,
      !workerClientStore.lotteryGame
    );
    if (
      workerClientStore.client &&
      networkStore.minaNetwork?.networkID &&
      chainStore.block?.slotSinceGenesis &&
      events.data?.events &&
      !workerClientStore.lotteryGame
    ) {
      console.log('Starting lottery');
      workerClientStore.startLottery(
        networkStore.minaNetwork?.networkID!,
        Number(chainStore.block?.slotSinceGenesis),
        events.data?.events as unknown as object[]
      );
    }
  }, [
    workerClientStore.client,
    networkStore.minaNetwork?.networkID,
    chainStore.block?.slotSinceGenesis,
    events.data,
    workerClientStore.lotteryGame,
  ]);

  useEffect(() => {
    if (workerClientStore.lotteryGame?.address)
      workerClientStore.updateOnchainState();
  }, [chainStore.block?.height]);
  useEffect(() => {
    if (
      !chainStore.block?.slotSinceGenesis ||
      !workerClientStore.onchainState?.startBlock ||
      !workerClientStore?.lotteryGame
    )
      return;
    workerClientStore.updateOffchainState(
      Number(chainStore.block!.slotSinceGenesis),
      events.data?.events as unknown as object[]
    );
  }, [
    events.data,
    chainStore.block?.slotSinceGenesis,
    workerClientStore.onchainState?.startBlock,
  ]);

  // When onchain state is ready
  useEffect(() => {
    if (!workerClientStore.lotteryRoundId) return;

    const startBlock = workerClientStore.onchainState?.startBlock;
    const blockNum = chainStore.block?.slotSinceGenesis;

    console.log('Lottery state', workerClientStore.onchainState);
    console.log('Round id', workerClientStore.lotteryRoundId);

    blockNum && startBlock
      ? setRoundEndsIn(
          DateTime.now().plus(
            Duration.fromObject({
              second: (480 - (Number(blockNum - startBlock) % 480)) * 3 * 60,
            })
          )
        )
      : 0;
  }, [workerClientStore.onchainState, workerClientStore.lotteryRoundId]);

  // When offchain state is ready
  useEffect(() => {
    if (!workerClientStore.lotteryRoundId) return;
    // (async () => {
    //   console.log(
    //     'Effect fetching',
    //     await workerClientStore.getRoundsInfo([
    //       Number(workerClientStore.lotteryRoundId),
    //     ])
    //   );
    // })();
  }, [workerClientStore.stateM]);

  useEffect(() => {
    if (
      workerClientStore.onchainState &&
      workerClientStore.lotteryRoundId &&
      events.data
    ) {
      console.log('Refetching offchain state');

      const startBlock = Number(workerClientStore.onchainState!.startBlock);
      const roundId = workerClientStore.lotteryRoundId;

      new Promise((resolve) => setTimeout(resolve, 3_000)).then(async () => {
        // workerClientStore?.fetchOffchainState(
        //   startBlock,
        //   workerClientStore.lotteryRoundId,
        //   events.data.events
        // );
      });
    }
  }, [chainStore.block?.height, workerClientStore.lotteryRoundId, events.data]);

  return (
    <GamePage
      gameConfig={lotteryConfig}
      image={undefined}
      mobileImage={undefined}
      defaultPage={'Game'}
      customDesign={true}
    >
      <StateManager />

      <BannerSection
        roundId={workerClientStore.lotteryRoundId}
        roundEndsIn={roundEndsIn}
      />
      <TicketsSection />

      <motion.div
        className={
          'flex grid-cols-4 flex-col-reverse gap-4 pt-10 lg:grid lg:pt-0'
        }
        animate={'windowed'}
      ></motion.div>
      {networkStore.minaNetwork?.networkID !=
        NETWORKS[NetworkIds.MINA_DEVNET].networkID && <WrongNetworkModal />}
    </GamePage>
  );
}

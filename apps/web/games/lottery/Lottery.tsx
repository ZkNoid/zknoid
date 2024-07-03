import GamePage from '@/components/framework/GamePage';
import { lotteryConfig } from './config';
import { useNetworkStore } from '@/lib/stores/network';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import BannerSection from './ui/BannerSection';
import TicketsSection from './ui/TicketsSection';
import { useWorkerClientStore } from '@/lib/stores/workerClient';
import { useChainStore } from '@/lib/stores/minaChain';
import { BLOCK_PER_ROUND } from 'l1-lottery-contracts';
import { DateTime, Duration } from 'luxon';
import { NetworkIds, NETWORKS } from '@/app/constants/networks';
import WrongNetworkModal from '@/games/lottery/ui/TicketsSection/ui/WrongNetworkModal';
import { api } from '@/trpc/react';

export default function Lottery({}: { params: { competitionId: string } }) {
  const networkStore = useNetworkStore();
  const [roundEndsIn, setRoundEndsIn] = useState<DateTime>(
    DateTime.fromMillis(0)
  );

  const workerClientStore = useWorkerClientStore();
  const chainStore = useChainStore();

  useEffect(() => {
    if (
      workerClientStore.client &&
      networkStore.minaNetwork?.networkID &&
      chainStore.block?.slotSinceGenesis
    ) {
      workerClientStore.startLottery(
        networkStore.minaNetwork?.networkID!,
        Number(chainStore.block?.slotSinceGenesis)
      );
    }
  }, [
    workerClientStore.client,
    networkStore.minaNetwork?.networkID,
    chainStore.block?.slotSinceGenesis,
  ]);

  useEffect(() => {
    if (!workerClientStore.lotteryRoundId) return;

    const startBlock = workerClientStore.lotteryState?.startBlock;
    const blockNum = chainStore.block?.slotSinceGenesis;

    console.log('Lottery state', workerClientStore.lotteryState);
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
    (async () => {
      console.log(
        'Effect fetching',
        await workerClientStore.getRoundsInfo([
          Number(workerClientStore.lotteryState!.currentRound),
        ])
      );
    })();
  }, [
    workerClientStore.lotteryState,
    workerClientStore.offchainStateUpdateBlock,
  ]);

  const events = api.lotteryBackend.getMinaEvents.useQuery({});

  useEffect(() => {
    if (workerClientStore.lotteryState && workerClientStore.lotteryRoundId) {
      console.log('Refetching offchain state');

      new Promise((resolve) => setTimeout(resolve, 3_000)).then(() => {
        workerClientStore?.fetchOffchainState(
          Number(workerClientStore.lotteryState!.startBlock),
          workerClientStore.lotteryRoundId
        );
      });
    }
  }, [chainStore.block?.height, workerClientStore.lotteryRoundId]);

  return (
    <GamePage
      gameConfig={lotteryConfig}
      image={undefined}
      mobileImage={undefined}
      defaultPage={'Game'}
      customDesign={true}
    >
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

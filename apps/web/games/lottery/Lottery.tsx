import GamePage from '@/components/framework/GamePage';
import { lotteryConfig } from './config';
import { useNetworkStore } from '@/lib/stores/network';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import BannerSection from './ui/TicketsSection/BannerSection/BannerSection';
import TicketsSection from './ui/TicketsSection/TicketsSection';
import { useWorkerClientStore } from '@/lib/stores/workerClient';
import { useChainStore } from '@/lib/stores/minaChain';
import { BLOCK_PER_ROUND } from 'l1-lottery-contracts/build/src/constants';
import { DateTime, Duration } from 'luxon';
import {NetworkIds, NETWORKS} from "@/app/constants/networks";
import WrongNetworkModal from "@/games/lottery/ui/TicketsSection/ui/WrongNetworkModal";

export default function Lottery({}: { params: { competitionId: string } }) {
  const networkStore = useNetworkStore();
  const [roundId, setRoundId] = useState(0);
  const [roundEndsIn, setRoundEndsIn] = useState<DateTime>(
    DateTime.fromMillis(0)
  );

  const workerClientStore = useWorkerClientStore();
  const chainStore = useChainStore();

  useEffect(() => {
    if (workerClientStore.client && networkStore.minaNetwork?.networkID) {
      workerClientStore.startLottery(
        networkStore.minaNetwork?.networkID!,
        Number(chainStore.block?.slotSinceGenesis)
      );
    }
  }, [workerClientStore.client, networkStore.minaNetwork?.networkID]);

  useEffect(() => {
    if (!workerClientStore.lotteryState) return;

    const startBlock = workerClientStore.lotteryState?.startBlock;
    const blockNum = chainStore.block?.slotSinceGenesis;
    const roundId_ =
      blockNum && startBlock
        ? Math.floor(Number(blockNum - startBlock) / BLOCK_PER_ROUND)
        : 0;

    console.log('Lottery state', workerClientStore.lotteryState);
    console.log('Round id', roundId_);

    setRoundId(roundId_);
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
  }, [workerClientStore.lotteryState]);

  useEffect(() => {
    if (workerClientStore.lotteryState) {
      console.log('Refetching offchain state');

      new Promise( resolve => setTimeout(resolve, 3_000) ).then(() => {
        workerClientStore?.fetchOffchainState(Number(workerClientStore.lotteryState!.startBlock), roundId);
      })
    }
  }, [chainStore.block?.height]);

  return (
    <GamePage
      gameConfig={lotteryConfig}
      image={undefined}
      mobileImage={undefined}
      defaultPage={'Game'}
      customDesign={true}
    >
      <BannerSection roundId={roundId} roundEndsIn={roundEndsIn} />
      <TicketsSection />

      <motion.div
        className={
          'flex grid-cols-4 flex-col-reverse gap-4 pt-10 lg:grid lg:pt-0'
        }
        animate={'windowed'}
      ></motion.div>
      {networkStore.minaNetwork?.networkID != NETWORKS[NetworkIds.MINA_DEVNET].networkID && (
          <WrongNetworkModal/>
      )}
    </GamePage>
  );
}

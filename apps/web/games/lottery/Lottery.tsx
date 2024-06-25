import GamePage from '@/components/framework/GamePage';
import { lotteryConfig } from './config';
import { useNetworkStore } from '@/lib/stores/network';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useToasterStore } from '@/lib/stores/toasterStore';
import { useRateGameStore } from '@/lib/stores/rateGameStore';
import BannerSection from './ui/BannerSection';
import TicketsSection from './ui/TicketsSection/TicketsSection';
import { GameState } from './lib/gameState';
import { useWorkerClientStore } from '@/lib/stores/workerClient';
import { useChainStore } from '@/lib/stores/minaChain';
import { BLOCK_PER_ROUND } from 'l1-lottery-contracts/build/src/constants';
import { DateTime, Duration, Interval } from 'luxon';

export default function Lottery({}: { params: { competitionId: string } }) {
  const networkStore = useNetworkStore();
  const toasterStore = useToasterStore();
  const rateGameStore = useRateGameStore();
  const [gameState, setGameState] = useState(GameState.NotStarted);
  const [isRateGame, setIsRateGame] = useState<boolean>(false);
  const [roundId, setRoundId] = useState(0);
  const [roundEndsIn, setRoundEndsIn] = useState<DateTime>(
    DateTime.fromMillis(0)
  );

  const workerClientStore = useWorkerClientStore();
  const chainStore = useChainStore();

  useEffect(() => {
    if (workerClientStore.client && networkStore.minaNetwork?.networkID) {
      workerClientStore.startLottery(networkStore.minaNetwork?.networkID!);
    }
  }, [workerClientStore.client, networkStore.minaNetwork?.networkID]);

  useEffect(() => {
    const startBlock = workerClientStore.lotteryState?.startBlock;
    const blockNum = chainStore.block?.height;
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
  }, [workerClientStore.lotteryState]);

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
    </GamePage>
  );
}

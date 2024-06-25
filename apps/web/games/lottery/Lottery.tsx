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

export default function Lottery({}: { params: { competitionId: string } }) {
  const networkStore = useNetworkStore();
  const toasterStore = useToasterStore();
  const rateGameStore = useRateGameStore();
  const [gameState, setGameState] = useState(GameState.NotStarted);
  const [isRateGame, setIsRateGame] = useState<boolean>(false);
  const [roundId, setRoundId] = useState(1);
  const workerClientStore = useWorkerClientStore();

  useEffect(() => {
    if (workerClientStore.client) {
      workerClientStore.startLottery();
    }
  }, [workerClientStore.client]);

  return (
    <GamePage
      gameConfig={lotteryConfig}
      image={undefined}
      mobileImage={undefined}
      defaultPage={'Game'}
      customDesign={true}
    >
      <BannerSection />
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

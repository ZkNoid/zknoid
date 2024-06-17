import GamePage from '@/components/framework/GamePage';
import { lotteryConfig } from '../config';
import { useNetworkStore } from '@/lib/stores/network';
import { useState } from 'react';

import { motion } from 'framer-motion';
import { useToasterStore } from '@/lib/stores/toasterStore';
import { useRateGameStore } from '@/lib/stores/rateGameStore';
import BannerSection from './BannerSection';
import TicketsSection from './TicketsSection';

enum GameState {
  WalletNotInstalled,
  WalletNotConnected,
  NotStarted,
  MatchRegistration,
  Matchmaking,
  OpponentTimeout,
  CurrentPlayerHiding,
  WaitingForHiding,
  CurrentPlayerGuessing,
  WaitingForGuessing,
  CurrentPlayerRevealing,
  WaitingForReveal,
  Won,
  Lost,
}

export default function Thimblerig({}: { params: { competitionId: string } }) {
  const networkStore = useNetworkStore();
  const toasterStore = useToasterStore();
  const rateGameStore = useRateGameStore();
  const [gameState, setGameState] = useState(GameState.NotStarted);
  const [isRateGame, setIsRateGame] = useState<boolean>(false);
  const [revealedValue, setRevealedValue] = useState<
    undefined | { choice: 1 | 2 | 3; value: 1 | 2 | 3 }
  >(undefined);
  const [roundId, setRoundId] = useState(1);

  return (
    <GamePage
      gameConfig={lotteryConfig}
      image={undefined}
      mobileImage={undefined}
      defaultPage={'Game'}
      customDesign={true}
    >
      <BannerSection roundId={1}/>
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

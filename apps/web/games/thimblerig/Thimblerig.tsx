import GamePage from '@/components/framework/GamePage';
import { thimblerigConfig } from './config';
import { useNetworkStore } from '@/lib/stores/network';
import { useContext, useEffect, useRef, useState } from 'react';
import ZkNoidGameContext from '@/lib/contexts/ZkNoidGameContext';
import {
  type ClientAppChain,
  MOVE_TIMEOUT_IN_BLOCKS,
  PENDING_BLOCKS_NUM_CONST,
} from 'zknoid-chain-dev';
import { Poseidon, PublicKey, UInt64 } from 'o1js';
import { useStore } from 'zustand';
import { useSessionKeyStore } from '@/lib/stores/sessionKeyStorage';
import { walletInstalled } from '@/lib/helpers';
import {
  useObserveThimblerigMatchQueue,
  useThimblerigMatchQueueStore,
} from './stores/matchQueue';
import { useCommitmentStore } from '@/lib/stores/commitmentStorage';
import { useProtokitChainStore } from '@/lib/stores/protokitChain';
import ThimbleSVG from './assets/thimble.svg';
import ThimbleOpenedCorrectSVG from './assets/thimble_opened_correct.svg';
import BallSVG from './assets/ball.svg';
import BallDashedSVG from './assets/ball-dashed.svg';
import ArrowSVG from './assets/arrow.svg';
import ThimblesMixing from './assets/thimbles_mixing.json';
import ThimblerigBallInsideLifting from './assets/thimblerig_ball_lifting.json';
import ThimblerigGuessedBallInsideLifting from './assets/thimblerig_dashed_ball_lifting.json';
import ThimblerigNoBallInsideLifting from './assets/thimblerig_noball_lifting.json';
import ThimblerigCoverSVG from './assets/game-cover.svg';
import ThimblerigCoverMobileSVG from '@/public/image/game-page/game-title-mobile-template.svg';
import Image from 'next/image';
import Lottie from 'react-lottie';
import { MainButtonState } from '@/components/framework/GamePage/PvPGameView';
import { api } from '@/trpc/react';
import { getEnvContext } from '@/lib/envContext';
import { getRandomEmoji } from '@/lib/emoji';
import { DEFAULT_PARTICIPATION_FEE } from 'zknoid-chain-dev/dist/src/engine/LobbyManager';
import { cn } from '@/lib/helpers';
import AnimatedThimble from './components/AnimatedThimble';
import Button from '@/components/shared/Button';
import GameWidget from '@/components/framework/GameWidget';
import { UnsetCompetitionPopup } from '@/components/framework/GameWidget/ui/popups/UnsetCompetitionPopup';
import { formatUnits } from '@/lib/unit';
import znakesImg from '@/public/image/tokens/znakes.svg';
import { ConnectWallet } from '@/components/framework/GameWidget/ui/popups/ConnectWallet';
import { InstallWallet } from '@/components/framework/GameWidget/ui/popups/InstallWallet';
import { Competition } from '@/components/framework/GameWidget/ui/Competition';
import { Currency } from '@/constants/currency';
import { motion, useAnimationControls } from 'framer-motion';
import { ICompetitionPVP } from '@/lib/types';
import { GameWrap } from '@/components/framework/GamePage/GameWrap';
import { RateGame } from '@/components/framework/GameWidget/ui/popups/RateGame';
import { SadSmileSVG } from '@/components/shared/misc/svg';
import toast from '@/components/shared/Toast';
import { useToasterStore } from '@/lib/stores/toasterStore';
import { useRateGameStore } from '@/lib/stores/rateGameStore';
import { formatPubkey } from '@/lib/utils';
import StatefulModal from '@/components/shared/Modal/StatefulModal';
import { GameState } from './lib/gameState';
import { useStartGame } from './features/startGame';
import {
  useLobbiesStore,
  useObserveLobbiesStore,
} from '@/lib/stores/lobbiesStore';
import { PendingTransaction } from '@proto-kit/sequencer';

export default function Thimblerig({}: { params: { competitionId: string } }) {
  const [gameState, setGameState] = useState(GameState.NotStarted);
  const [isRateGame, setIsRateGame] = useState<boolean>(false);
  const [revealedValue, setRevealedValue] = useState<
    undefined | { choice: 1 | 2 | 3; value: 1 | 2 | 3 }
  >(undefined);
  const [ballDragged, setBallDragged] = useState<boolean>(false);
  const [finalAnimationStep, setFinalAnimationStep] = useState<number>(0);
  const { client } = useContext(ZkNoidGameContext);
  const [loading, setLoading] = useState(false);
  const [pendingChoosing, setPendingChoosing] = useState(false);
  const [thimbleOpened, setThimbleOpened] = useState<undefined | 1 | 2 | 3>(
    undefined
  );
  const thimbleOpenedRef = useRef<undefined | 1 | 2 | 3>(undefined);
  const [thimbleGuessed, setThimbleGuessed] = useState<undefined | 1 | 2 | 3>(
    undefined
  );
  const finalAnimationStepRef = useRef<number>(0);
  const sessionPrivateKey = useStore(useSessionKeyStore, (state) =>
    state.getSessionKey()
  );

  const networkStore = useNetworkStore();
  const toasterStore = useToasterStore();
  const rateGameStore = useRateGameStore();
  const progress = api.progress.setSolvedQuests.useMutation();
  const matchQueue = useThimblerigMatchQueueStore();
  const commitmentStore = useCommitmentStore();
  const protokitChain = useProtokitChainStore();
  useObserveThimblerigMatchQueue();
  const startGame = useStartGame(setGameState);

  const client_ = client as ClientAppChain<typeof thimblerigConfig.runtimeModules, any, any, any>;

  const query = networkStore.protokitClientStarted
    ? client_.query.runtime.ThimblerigLogic
    : undefined;

  useObserveLobbiesStore(query);
  const lobbiesStore = useLobbiesStore();

  console.log('Active lobby', lobbiesStore.activeLobby);

  const restart = () => {
    matchQueue.resetLastGameState();
    setRevealedValue(undefined);
    setGameState(GameState.NotStarted);
  };

  const collectPending = async () => {
    const randzuLogic = client_.runtime.resolve('ThimblerigLogic');

    const tx = await client_.transaction(
      sessionPrivateKey.toPublicKey(),
      async () => {
        randzuLogic.collectPendingBalance();
      }
    );

    console.log('Collect tx', tx);

    tx.transaction = tx.transaction?.sign(sessionPrivateKey);

    console.log('Sending tx', tx);

    await tx.send();

    console.log('Tx sent', tx);
  };

  /**
   *
   * @param id Number 1-3
   */
  const commitThumblerig = async (id: number) => {
    const salt = commitmentStore.commit(id);

    const thimblerigLogic = client_.runtime.resolve('ThimblerigLogic');

    const commitment = Poseidon.hash([...UInt64.from(id).toFields(), salt]);
    const tx = await client_.transaction(
      PublicKey.fromBase58(networkStore.address!),
      async () => {
        thimblerigLogic.commitValue(
          UInt64.from(matchQueue.activeGameId),
          commitment
        );
      }
    );

    await tx.sign();
    await tx.send();
  };

  /**
   *
   * @param choice Number 1-3
   */
  const chooseThumblerig = async (choice: number) => {
    setPendingChoosing(true);
    try {
      const thimblerigLogic = client_.runtime.resolve('ThimblerigLogic');
      const tx = await client_.transaction(
        PublicKey.fromBase58(networkStore.address!),
        async () => {
          thimblerigLogic.chooseThumble(
            UInt64.from(matchQueue.activeGameId),
            UInt64.from(choice)
          );
        }
      );
      await tx.sign();
      await tx.send();

      await progress.mutateAsync({
        userAddress: networkStore.address!,
        section: 'THIMBLERIG',
        id: 0,
        txHash: JSON.stringify(
          (tx.transaction! as PendingTransaction).toJSON()
        ),
        roomId: competition.id.toString(),
        envContext: getEnvContext(),
      });
    } catch {
      setThimbleGuessed(undefined);
      setPendingChoosing(false);
    }
  };

  const revealThumblerig = async () => {
    const thimblerigLogic = client_.runtime.resolve('ThimblerigLogic');
    const commitment = commitmentStore.getCommitment();

    const tx = await client_.transaction(
      PublicKey.fromBase58(networkStore.address!),
      async () => {
        thimblerigLogic.revealCommitment(
          UInt64.from(matchQueue.activeGameId),
          commitment.value,
          commitment.salt
        );
      }
    );

    await tx.sign();
    await tx.send();

    await progress.mutateAsync({
      userAddress: networkStore.address!,
      section: 'THIMBLERIG',
      id: 0,
      txHash: JSON.stringify((tx.transaction! as PendingTransaction).toJSON()),
      roomId: competition.id.toString(),
      envContext: getEnvContext(),
    });
  };

  const proveOpponentTimeout = async () => {
    const thibmerigLogic = client_.runtime.resolve('ThimblerigLogic');

    const tx = await client_.transaction(
      PublicKey.fromBase58(networkStore.address!),
      async () => {
        thibmerigLogic.proveCommitNotRevealed(
          UInt64.from(matchQueue.gameInfo!.gameId)
        );
      }
    );

    await tx.sign();
    await tx.send();
  };

  useEffect(() => {
    if (matchQueue.pendingBalance && !matchQueue.inQueue) {
      console.log('Collecting pending balance', matchQueue.pendingBalance);
      collectPending();
    }

    if (!walletInstalled()) {
      setGameState(GameState.WalletNotInstalled);
    } else if (!networkStore.address) {
      setGameState(GameState.WalletNotConnected);
    } else if (matchQueue.inQueue && !matchQueue.activeGameId) {
      console.log(matchQueue.inQueue, !matchQueue.activeGameId);
      setGameState(GameState.Matchmaking);
    } else if (
      matchQueue.gameInfo &&
      matchQueue.activeGameId &&
      !matchQueue.gameInfo?.isCurrentUserMove &&
      BigInt(protokitChain?.block?.height || 0) -
        matchQueue.gameInfo?.lastMoveBlockHeight >
        MOVE_TIMEOUT_IN_BLOCKS
    ) {
      setGameState(GameState.OpponentTimeout);
    } else if (
      matchQueue.gameInfo?.isCurrentUserMove &&
      !loading &&
      matchQueue.activeGameId &&
      !matchQueue.gameInfo.field.commitedHash.toBigInt() &&
      !matchQueue.gameInfo.field.choice.toBigInt()
    ) {
      setGameState(GameState.CurrentPlayerHiding);
    } else if (
      !matchQueue.gameInfo?.isCurrentUserMove &&
      matchQueue.activeGameId &&
      !loading &&
      !matchQueue.gameInfo?.field.commitedHash.toBigInt() &&
      !matchQueue.gameInfo?.field.choice.toBigInt()
    ) {
      setGameState(GameState.WaitingForHiding);
    } else if (
      matchQueue.gameInfo?.isCurrentUserMove &&
      !loading &&
      matchQueue.gameInfo.field.commitedHash.toBigInt() &&
      !matchQueue.gameInfo.field.choice.toBigInt()
    ) {
      setGameState(GameState.CurrentPlayerGuessing);
    } else if (
      !matchQueue.gameInfo?.isCurrentUserMove &&
      matchQueue.activeGameId &&
      !loading &&
      matchQueue.gameInfo.field.commitedHash.toBigInt() &&
      !matchQueue.gameInfo.field.choice.toBigInt()
    ) {
      thimbleOpenedRef.current = undefined;
      setThimbleOpened(undefined);
      setGameState(GameState.WaitingForGuessing);
    } else if (
      matchQueue.gameInfo?.isCurrentUserMove &&
      !loading &&
      matchQueue.gameInfo.field.commitedHash.toBigInt() &&
      matchQueue.gameInfo.field.choice.toBigInt()
    ) {
      setGameState(GameState.CurrentPlayerRevealing);
    } else if (
      !matchQueue.gameInfo?.isCurrentUserMove &&
      matchQueue.activeGameId &&
      !loading &&
      matchQueue.gameInfo.field.commitedHash.toBigInt() &&
      matchQueue.gameInfo.field.choice.toBigInt()
    ) {
      setGameState(GameState.WaitingForReveal);
    } else {
      if (matchQueue.lastGameState == 'win') {
        console.log(
          'Win, value:',
          Number(matchQueue.gameInfo.field.value.toBigInt())
        );
        console.log(
          'Win, salt:',
          Number(matchQueue.gameInfo.field.choice.toBigInt())
        );

        setRevealedValue({
          value: Number(matchQueue.gameInfo.field.value.toBigInt()) as
            | 1
            | 2
            | 3,
          choice: Number(matchQueue.gameInfo.field.choice.toBigInt()) as
            | 1
            | 2
            | 3,
        });
        setGameState(GameState.Won);
        progress.mutate({
          userAddress: networkStore.address!,
          section: 'THIMBLERIG',
          id: 1,
          txHash: JSON.stringify({
            value: Number(matchQueue.gameInfo.field.value.toBigInt()),
            choice: Number(matchQueue.gameInfo.field.choice.toBigInt()),
          }),
          roomId: competition.id.toString(),
          envContext: getEnvContext(),
        });
      } else if (matchQueue.lastGameState == 'lost') {
        console.log(
          'Lost, value:',
          Number(matchQueue.gameInfo.field.value.toBigInt())
        );
        console.log(
          'Lost, salt:',
          Number(matchQueue.gameInfo.field.choice.toBigInt())
        );

        setRevealedValue({
          value: Number(matchQueue.gameInfo.field.value.toBigInt()) as
            | 1
            | 2
            | 3,
          choice: Number(matchQueue.gameInfo.field.choice.toBigInt()) as
            | 1
            | 2
            | 3,
        });
        setGameState(GameState.Lost);
      } else {
        setGameState(GameState.NotStarted);
      }
    }
  }, [
    matchQueue.activeGameId,
    matchQueue.inQueue,
    matchQueue.lastGameState,
    matchQueue.gameInfo,
  ]);

  const statuses = {
    [GameState.WalletNotInstalled]: 'WALLET NOT INSTALLED',
    [GameState.WalletNotConnected]: 'WALLET NOT CONNECTED',
    [GameState.NotStarted]: 'NOT STARTED',
    [GameState.OpponentTimeout]: 'OPPONENT TIMEOUT',
    [GameState.MatchRegistration]: 'MATCH REGISTRATION',
    [GameState.Matchmaking]: `MATCHMAKING ${
      (protokitChain.block?.height || 0) % PENDING_BLOCKS_NUM_CONST
    }  / ${PENDING_BLOCKS_NUM_CONST} 🔍`,
    [GameState.CurrentPlayerHiding]: `HIDING BALL`,
    [GameState.WaitingForHiding]: `OPPONENT HIDING BALL`,
    [GameState.CurrentPlayerGuessing]: 'YOUR GUESS',
    [GameState.WaitingForGuessing]: 'OPPONENT GUESSES',
    [GameState.CurrentPlayerRevealing]: 'YOUR REVEAL',
    [GameState.WaitingForReveal]: 'OPPONENT REVEAL',
    [GameState.Won]: 'YOU WON',
    [GameState.Lost]: 'YOU LOST',
  } as Record<GameState, string>;

  const mainText = {
    [GameState.OpponentTimeout]: 'Opponent timed out. Prove to win',
    [GameState.CurrentPlayerHiding]: 'Choose thimble to hide ball behind',
    [GameState.WaitingForHiding]:
      'Your opponent hides the ball, wait for your turn',
    [GameState.CurrentPlayerGuessing]:
      'Guess under what thimble ball is hidden by opponent',
    [GameState.WaitingForGuessing]: 'Wait for opponent to guess',
    [GameState.CurrentPlayerRevealing]: 'Revealing position',
    [GameState.WaitingForReveal]:
      'Your opponent reveals position of the ball, wait for your turn',
    [GameState.Won]: `${getRandomEmoji('happy')}You won! Congratulations!`,
    [GameState.Lost]: `${getRandomEmoji('sad')} You've lost...`,
  } as Record<GameState, string>;

  const mainButtonState =
    (
      {
        [GameState.CurrentPlayerHiding]: MainButtonState.YourTurn,
        [GameState.CurrentPlayerGuessing]: MainButtonState.YourTurn,
        [GameState.CurrentPlayerRevealing]: MainButtonState.YourTurn,
        [GameState.WaitingForHiding]: MainButtonState.OpponentsTurn,
        [GameState.WaitingForGuessing]: MainButtonState.OpponentsTurn,
        [GameState.WaitingForReveal]: MainButtonState.OpponentsTurn,
        [GameState.NotStarted]: MainButtonState.NotStarted,
        [GameState.WalletNotInstalled]: MainButtonState.WalletNotInstalled,
        [GameState.WalletNotConnected]: MainButtonState.WalletNotConnected,
      } as Record<GameState, MainButtonState>
    )[gameState] || MainButtonState.None;

  const getThimbleImage = (i: number) => {
    if (gameState == GameState.Won || gameState == GameState.Lost) {
    }

    if (gameState == GameState.CurrentPlayerHiding) {
      if (thimbleOpened == i + 1) {
        return ThimbleOpenedCorrectSVG;
      }
    }

    return ThimbleSVG;
  };

  const getRatingQuery = api.ratings.getGameRating.useQuery({
    gameId: 'thimblerig',
  });

  const competition: ICompetitionPVP = {
    id: 12,
    game: {
      id: thimblerigConfig.id,
      name: thimblerigConfig.name,
      rules: thimblerigConfig.rules,
      rating: getRatingQuery.data?.rating,
      author: thimblerigConfig.author,
    },
    title: lobbiesStore.activeLobby?.name || 'Unknown',
    reward: (lobbiesStore.activeLobby?.reward || 0n) / 2n,
    currency: Currency.MINA,
    startPrice: lobbiesStore.lobbies?.[0]?.fee || 0n,
  };

  const draggableBallControls = useAnimationControls();

  useEffect(() => {
    if (gameState == GameState.Lost || gameState == GameState.Won) {
      setTimeout(() => {
        setIsRateGame(true);
      }, 10000);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState == GameState.Won)
      toast.success(
        toasterStore,
        `You are won! Winnings: ${formatUnits(matchQueue.pendingBalance)} ${Currency.ZNAKES}`,
        true
      );
  }, [gameState]);

  return (
    <GamePage
      gameConfig={thimblerigConfig}
      image={ThimblerigCoverSVG}
      mobileImage={ThimblerigCoverMobileSVG}
      defaultPage={'Game'}
    >
      <motion.div
        className={
          'flex grid-cols-4 flex-col-reverse gap-4 pt-10 lg:grid lg:pt-0'
        }
        animate={'windowed'}
      >
        <div className={'flex flex-col gap-4 lg:hidden'}>
          <span className={'w-full text-headline-2 font-bold'}>Rules</span>
          <span className={'font-plexsans text-buttons-menu font-normal'}>
            {thimblerigConfig.rules}
          </span>
        </div>
        <div className={'hidden h-full w-full flex-col gap-4 lg:flex'}>
          <div
            className={
              'flex w-full gap-2 font-plexsans text-[20px]/[20px] uppercase text-left-accent'
            }
          >
            <span>Game status:</span>
            <span>{statuses[gameState]}</span>
          </div>
          <div
            className={
              'flex w-full gap-2 font-plexsans text-[20px]/[20px] text-foreground'
            }
          >
            <span>Your opponent:</span>
            <span>{formatPubkey(matchQueue.gameInfo?.opponent)}</span>
          </div>
          {mainButtonState == MainButtonState.YourTurn && (
            <Button
              startContent={
                <svg
                  width="26"
                  height="18"
                  viewBox="0 0 26 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1 7L10 16L25 1" stroke="#252525" strokeWidth="2" />
                </svg>
              }
              label={'YOUR TURN'}
              isReadonly
            />
          )}
          {mainButtonState == MainButtonState.OpponentsTurn && (
            <Button
              startContent={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.5134 10.5851L1.476 0L0.00136988 1.41421L11.0387 11.9994L0 22.5858L1.47463 24L12.5134 13.4136L22.5242 23.0143L23.9989 21.6001L13.988 11.9994L23.9975 2.39996L22.5229 0.98575L12.5134 10.5851Z"
                    fill="#F9F8F4"
                  />
                </svg>
              }
              label={"OPPONENT'S TURN"}
              isReadonly
              color={'foreground'}
              isFilled={false}
              isBordered={true}
            />
          )}
          {mainButtonState == MainButtonState.OpponentTimeOut && (
            <Button label={'OPPONENT TIMED OUT'} isReadonly />
          )}
          {mainButtonState == MainButtonState.TransactionExecution && (
            <Button
              startContent={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 12C24 15.1826 22.7357 18.2348 20.4853 20.4853C18.2348 22.7357 15.1826 24 12 24C8.8174 24 5.76515 22.7357 3.51472 20.4853C1.26428 18.2348 0 15.1826 0 12C0 11.633 0.017 11.269 0.049 10.91L2.041 11.091C2.01367 11.3903 2 11.6933 2 12C2 13.9778 2.58649 15.9112 3.6853 17.5557C4.78412 19.2002 6.3459 20.4819 8.17317 21.2388C10.0004 21.9957 12.0111 22.1937 13.9509 21.8079C15.8907 21.422 17.6725 20.4696 19.0711 19.0711C20.4696 17.6725 21.422 15.8907 21.8079 13.9509C22.1937 12.0111 21.9957 10.0004 21.2388 8.17317C20.4819 6.3459 19.2002 4.78412 17.5557 3.6853C15.9112 2.58649 13.9778 2 12 2C11.6933 2 11.3903 2.01367 11.091 2.041L10.91 0.049C11.269 0.017 11.633 0 12 0C15.1815 0.00344108 18.2318 1.26883 20.4815 3.51852C22.7312 5.76821 23.9966 8.81846 24 12ZM5.663 4.263L4.395 2.717C3.78121 3.2216 3.2185 3.78531 2.715 4.4L4.262 5.665C4.68212 5.15305 5.15135 4.68348 5.663 4.263ZM9.142 2.415L8.571 0.5C7.80965 0.726352 7.0727 1.02783 6.371 1.4L7.31 3.166C7.89418 2.85539 8.50789 2.60381 9.142 2.415ZM3.164 7.315L1.4 6.375C1.02801 7.07678 0.726533 7.81372 0.5 8.575L2.417 9.146C2.60454 8.51172 2.85478 7.89769 3.164 7.313V7.315ZM11 6V10.277C10.7004 10.4513 10.4513 10.7004 10.277 11H7V13H10.277C10.4297 13.2652 10.6414 13.4917 10.8958 13.662C11.1501 13.8323 11.4402 13.9417 11.7436 13.9818C12.047 14.0219 12.3556 13.9917 12.6454 13.8934C12.9353 13.7951 13.1986 13.6314 13.415 13.415C13.6314 13.1986 13.7951 12.9353 13.8934 12.6454C13.9917 12.3556 14.0219 12.047 13.9818 11.7436C13.9417 11.4402 13.8323 11.1501 13.662 10.8958C13.4917 10.6414 13.2652 10.4297 13 10.277V6H11Z"
                    fill="#F9F8F4"
                  />
                </svg>
              }
              label={'TRANSACTION EXECUTION'}
              isReadonly
              color={'foreground'}
              isFilled={false}
              isBordered={true}
              className={'border-left-accent'}
            />
          )}
        </div>
        <GameWidget
          author={thimblerigConfig.author}
          isPvp
          playersCount={matchQueue.getQueueLength()}
          gameId="thimblerig"
        >
          {networkStore.address ? (
            <>
              {!competition ? (
                <GameWrap>
                  <UnsetCompetitionPopup gameId={thimblerigConfig.id} />
                </GameWrap>
              ) : (
                <>
                  {isRateGame &&
                    !rateGameStore.ratedGamesIds.includes(
                      thimblerigConfig.id
                    ) && (
                      <StatefulModal isOpen={true} isDismissible={false}>
                        <RateGame
                          gameId={thimblerigConfig.id}
                          onClick={() => setIsRateGame(false)}
                          isModal={true}
                        />
                      </StatefulModal>
                    )}
                  {gameState === GameState.NotStarted && (
                    <GameWrap>
                      <Button
                        label={`START FOR ${formatUnits(
                          competition.startPrice
                        )}`}
                        onClick={startGame}
                        className={'max-w-[40%]'}
                        endContent={
                          <Image
                            src={znakesImg}
                            alt={'Znakes token'}
                            className={'h-[24px] w-[24px] pb-0.5'}
                          />
                        }
                      />
                    </GameWrap>
                  )}
                  {gameState === GameState.OpponentTimeout && (
                    <GameWrap>
                      <div
                        className={
                          'flex max-w-[60%] flex-col items-center justify-center gap-6'
                        }
                      >
                        <SadSmileSVG />
                        <span>Opponent timeout</span>
                        <Button
                          label={'Prove Opponent timeout'}
                          onClick={() =>
                            proveOpponentTimeout()
                              .then(restart)
                              .catch((error) => {
                                console.log(error);
                              })
                          }
                          className={'px-4'}
                        />
                      </div>
                    </GameWrap>
                  )}
                </>
              )}
            </>
          ) : walletInstalled() ? (
            <GameWrap>
              <ConnectWallet
                connectWallet={() => networkStore.connectWallet(false)}
              />
            </GameWrap>
          ) : (
            <GameWrap>
              <InstallWallet />
            </GameWrap>
          )}
          {gameState !== GameState.NotStarted &&
            gameState !== GameState.OpponentTimeout &&
            networkStore.address && (
              <GameWrap noBorder>
                {gameState === GameState.Won && (
                  <div
                    className={
                      'flex h-full w-full flex-col items-center justify-center pb-20'
                    }
                  >
                    <div className={'text-headline-1'}>
                      You won! Congratulations!
                    </div>
                  </div>
                )}
                {gameState == GameState.Lost && (
                  <div
                    className={
                      'flex h-full w-full flex-col items-center justify-center pb-20'
                    }
                  >
                    <div className={'text-headline-1'}>
                      You’ve lost! Please try again
                    </div>
                  </div>
                )}
                <div className="flex">
                  {![
                    GameState.WaitingForHiding,
                    GameState.WaitingForGuessing,
                  ].includes(gameState) &&
                    Array.from({ length: 3 }, (_, i) => {
                      const hidingAnimation =
                        gameState == GameState.CurrentPlayerHiding &&
                        thimbleOpened &&
                        thimbleOpenedRef.current == i + 1;

                      const correctBallAnimation =
                        (gameState == GameState.Won ||
                          gameState == GameState.Lost) &&
                        revealedValue?.value == i + 1;
                      const guessedBallAnimation =
                        (gameState == GameState.Won ||
                          gameState == GameState.Lost) &&
                        finalAnimationStep == 1 &&
                        revealedValue?.choice == i + 1;
                      const isAnimated =
                        hidingAnimation ||
                        correctBallAnimation ||
                        guessedBallAnimation;

                      return (
                        <div
                          key={i}
                          className={cn(
                            'p-5',
                            isAnimated && 'mx-[-20px] mt-[-55px]'
                          )}
                          onDrop={() => {
                            gameState == GameState.CurrentPlayerHiding &&
                              commitThumblerig(i + 1);
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            return false;
                          }}
                          onDragLeave={(e) => {}}
                          onDragEnter={(e) => {
                            if (gameState == GameState.CurrentPlayerHiding) {
                              thimbleOpenedRef.current = (i + 1) as 1 | 2 | 3;
                              setThimbleOpened(thimbleOpenedRef.current);
                            }
                          }}
                          onPointerEnter={() => {
                            if (
                              gameState == GameState.CurrentPlayerGuessing &&
                              thimbleGuessed != i + 1
                            ) {
                              console.log('Revealing', i);
                              setThimbleGuessed((i + 1) as 1 | 2 | 3);
                            }
                          }}
                          onPointerLeave={() => {
                            if (
                              gameState == GameState.CurrentPlayerGuessing &&
                              !pendingChoosing &&
                              thimbleGuessed == i + 1
                            ) {
                              setThimbleGuessed(undefined);
                            }
                          }}
                          onClick={() =>
                            gameState == GameState.CurrentPlayerGuessing &&
                            chooseThumblerig(i + 1)
                          }
                        >
                          {!isAnimated ? (
                            <Image
                              src={getThimbleImage(i)}
                              alt={'Thimble'}
                              className={
                                (gameState == GameState.CurrentPlayerHiding &&
                                  thimbleOpened &&
                                  thimbleOpenedRef.current != i + 1) ||
                                ((gameState ==
                                  GameState.CurrentPlayerGuessing ||
                                  gameState == GameState.WaitingForReveal) &&
                                  thimbleGuessed != undefined &&
                                  thimbleGuessed != i + 1) ||
                                (gameState ==
                                  GameState.CurrentPlayerRevealing &&
                                  Number(commitmentStore.value) != i + 1)
                                  ? 'pointer-events-none opacity-50'
                                  : 'pointer-events-none'
                              }
                            />
                          ) : (
                            <AnimatedThimble
                              animation={
                                correctBallAnimation
                                  ? ThimblerigBallInsideLifting
                                  : guessedBallAnimation
                                    ? ThimblerigGuessedBallInsideLifting
                                    : ThimblerigNoBallInsideLifting
                              }
                              onAnimationEnded={function (): void {
                                if (
                                  gameState == GameState.Won ||
                                  gameState == GameState.Lost
                                ) {
                                  finalAnimationStepRef.current = 1;
                                  setFinalAnimationStep(
                                    finalAnimationStepRef.current
                                  );
                                }
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  {[
                    GameState.WaitingForHiding,
                    GameState.WaitingForGuessing,
                  ].includes(gameState) && (
                    <Lottie
                      options={{
                        animationData: ThimblesMixing,
                        rendererSettings: {
                          className: `z-0 h-full`,
                        },
                      }}
                      speed={0.6}
                      // height={height}
                      // isStopped={!visible && false}
                    ></Lottie>
                  )}
                </div>
                <div className="">
                  {gameState == GameState.CurrentPlayerHiding && (
                    <div className="flex w-1/2 flex-row items-center justify-between gap-1 py-10 font-museo text-[24px]/[24px]">
                      <motion.div
                        className="block min-h-[56px] min-w-[56px] cursor-grab"
                        draggable={true}
                        onDrag={() => {
                          draggableBallControls.stop();
                          setBallDragged(true);
                        }}
                        onDragEnd={() => {
                          draggableBallControls.start('play');
                          setBallDragged(false);
                        }}
                        whileInView={'play'}
                        variants={{
                          play: {
                            scale: 1.2,
                            transition: {
                              repeat: Infinity,
                              repeatType: 'reverse',
                              duration: 0.4,
                            },
                          },
                        }}
                        animate={draggableBallControls}
                      >
                        <Image
                          src={ballDragged ? BallDashedSVG : BallSVG}
                          alt="Ball"
                          className="pr-2"
                        />
                      </motion.div>

                      <div className="font-plex text-[16px]/[16px] uppercase text-left-accent">
                        Drag the ball under one the thimbles and confirm your
                        selection
                      </div>
                      <Image src={ArrowSVG} alt="Arrow" />
                    </div>
                  )}
                  {gameState == GameState.CurrentPlayerGuessing && (
                    <div className="flex w-1/2 flex-row items-center justify-between gap-1 py-10 font-museo text-[24px]/[24px]">
                      <div className="font-plex text-[16px]/[16px] uppercase text-left-accent">
                        Select the thimble under which you think your opponent
                        has hidden the ball
                      </div>
                      <Image src={ArrowSVG} alt="Arrow" />
                    </div>
                  )}
                </div>
                {gameState === GameState.Won && (
                  <div
                    className={
                      'flex h-full w-full flex-col items-center justify-center pt-20'
                    }
                  >
                    <Button label={'Find new game'} onClick={restart} />
                  </div>
                )}
                {gameState == GameState.Lost && (
                  <div
                    className={
                      'flex h-full w-full flex-col items-center justify-center pt-20'
                    }
                  >
                    <Button label={'Restart game'} onClick={restart} />
                  </div>
                )}
                {gameState == GameState.CurrentPlayerRevealing && (
                  <div
                    className={
                      'flex h-full w-full flex-col items-center justify-center pt-20'
                    }
                  >
                    <motion.div
                      animate={{
                        scale: 1.05,
                        transition: {
                          repeat: Infinity,
                          repeatType: 'reverse',
                          duration: 0.6,
                        },
                      }}
                      className={'w-full max-w-[648px]'}
                    >
                      <Button
                        label={'REVEAL POSITION'}
                        onClick={revealThumblerig}
                      />
                    </motion.div>
                  </div>
                )}
              </GameWrap>
            )}
        </GameWidget>
        <div className={'flex flex-col lg:hidden'}>
          {mainButtonState == MainButtonState.YourTurn && (
            <Button
              startContent={
                <svg
                  width="26"
                  height="18"
                  viewBox="0 0 26 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1 7L10 16L25 1" stroke="#252525" strokeWidth="2" />
                </svg>
              }
              className="uppercase"
              label={'YOUR TURN'}
              isReadonly
            />
          )}
          {mainButtonState == MainButtonState.OpponentsTurn && (
            <Button
              startContent={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.5134 10.5851L1.476 0L0.00136988 1.41421L11.0387 11.9994L0 22.5858L1.47463 24L12.5134 13.4136L22.5242 23.0143L23.9989 21.6001L13.988 11.9994L23.9975 2.39996L22.5229 0.98575L12.5134 10.5851Z"
                    fill="#F9F8F4"
                  />
                </svg>
              }
              className="uppercase"
              label={"OPPONENT'S TURN"}
              isReadonly
              color={'foreground'}
              isFilled={false}
              isBordered={true}
            />
          )}
          {mainButtonState == MainButtonState.OpponentTimeOut && (
            <Button
              className="uppercase"
              label={'OPPONENT TIMED OUT'}
              isReadonly
            />
          )}
          {mainButtonState == MainButtonState.TransactionExecution && (
            <Button
              startContent={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 12C24 15.1826 22.7357 18.2348 20.4853 20.4853C18.2348 22.7357 15.1826 24 12 24C8.8174 24 5.76515 22.7357 3.51472 20.4853C1.26428 18.2348 0 15.1826 0 12C0 11.633 0.017 11.269 0.049 10.91L2.041 11.091C2.01367 11.3903 2 11.6933 2 12C2 13.9778 2.58649 15.9112 3.6853 17.5557C4.78412 19.2002 6.3459 20.4819 8.17317 21.2388C10.0004 21.9957 12.0111 22.1937 13.9509 21.8079C15.8907 21.422 17.6725 20.4696 19.0711 19.0711C20.4696 17.6725 21.422 15.8907 21.8079 13.9509C22.1937 12.0111 21.9957 10.0004 21.2388 8.17317C20.4819 6.3459 19.2002 4.78412 17.5557 3.6853C15.9112 2.58649 13.9778 2 12 2C11.6933 2 11.3903 2.01367 11.091 2.041L10.91 0.049C11.269 0.017 11.633 0 12 0C15.1815 0.00344108 18.2318 1.26883 20.4815 3.51852C22.7312 5.76821 23.9966 8.81846 24 12ZM5.663 4.263L4.395 2.717C3.78121 3.2216 3.2185 3.78531 2.715 4.4L4.262 5.665C4.68212 5.15305 5.15135 4.68348 5.663 4.263ZM9.142 2.415L8.571 0.5C7.80965 0.726352 7.0727 1.02783 6.371 1.4L7.31 3.166C7.89418 2.85539 8.50789 2.60381 9.142 2.415ZM3.164 7.315L1.4 6.375C1.02801 7.07678 0.726533 7.81372 0.5 8.575L2.417 9.146C2.60454 8.51172 2.85478 7.89769 3.164 7.313V7.315ZM11 6V10.277C10.7004 10.4513 10.4513 10.7004 10.277 11H7V13H10.277C10.4297 13.2652 10.6414 13.4917 10.8958 13.662C11.1501 13.8323 11.4402 13.9417 11.7436 13.9818C12.047 14.0219 12.3556 13.9917 12.6454 13.8934C12.9353 13.7951 13.1986 13.6314 13.415 13.415C13.6314 13.1986 13.7951 12.9353 13.8934 12.6454C13.9917 12.3556 14.0219 12.047 13.9818 11.7436C13.9417 11.4402 13.8323 11.1501 13.662 10.8958C13.4917 10.6414 13.2652 10.4297 13 10.277V6H11Z"
                    fill="#F9F8F4"
                  />
                </svg>
              }
              className="border-left-accent uppercase"
              label={'TRANSACTION EXECUTION'}
              isReadonly
              color={'foreground'}
              isFilled={false}
              isBordered={true}
            />
          )}
        </div>
        <div
          className={
            'flex flex-row gap-4 font-plexsans text-[14px]/[14px] text-left-accent lg:hidden lg:text-[20px]/[20px]'
          }
        >
          <span className={'uppercase'}>Players in queue: {2}</span>
        </div>
        <div className={'flex h-full w-full flex-col gap-4 lg:hidden'}>
          <span className={'w-full text-headline-2 font-bold'}>Game</span>
          <div
            className={
              'flex w-full gap-2 font-plexsans text-[16px]/[16px] uppercase text-left-accent lg:text-[20px]/[20px]'
            }
          >
            <span>Game status:</span>
            <span>{statuses[gameState]}</span>
          </div>
          <div
            className={
              'flex w-full items-center gap-2 font-plexsans text-[14px]/[14px] text-foreground lg:text-[20px]/[20px]'
            }
          >
            <span>Your opponent:</span>
            <span>{formatPubkey(matchQueue.gameInfo?.opponent)}</span>
          </div>
        </div>
        <Competition
          isPvp
          startGame={restart}
          isRestartBtn={gameState === GameState.OpponentTimeout}
          competition={competition}
        />
      </motion.div>
    </GamePage>
  );
}

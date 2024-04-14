'use client';

import { IGameInfo } from '@/lib/stores/matchQueue';
import { RandzuField } from 'zknoid-chain-dev';

interface IGameViewProps {
  gameInfo: IGameInfo<RandzuField> | undefined;
  onCellClicked: (x: number, y: number) => void;
  loadingElement: { x: number; y: number } | undefined;
  loading: boolean;
}

const CHECKERS_FIELD_SIZE = 8;

export const GameView = (props: IGameViewProps) => {
  const fieldActive =
    props.gameInfo?.isCurrentUserMove && !props.gameInfo?.winner;
  const highlightCells = props.gameInfo?.isCurrentUserMove && !props.loading;
  const displayBall = (i: number, j: number) =>
    props.gameInfo?.isCurrentUserMove &&
    !props.loading &&
    props.gameInfo?.field?.value?.[j]?.[i] == 0;
  const canMove = (i: number, j: number) =>
    !displayBall(i, j) && displayBall(i+1, j);

  const isLoadingBall = (i: number, j: number) =>
    props.loadingElement &&
    props.loadingElement.x == i &&
    props.loadingElement.y == j;
  const isCurrentRedBall = props.gameInfo?.currentUserIndex == 0;
  return (
    <div
      className={`grid grid-cols-8 gap-px rounded-[5px] bg-foreground/50 ${
        fieldActive ? 'border-4 border-left-accent p-0' : 'p-1'
      }`}
    >
      {[...Array(8).keys()]
        .map((i) =>
          props.gameInfo?.opponent == props.gameInfo?.player2
            ? CHECKERS_FIELD_SIZE - 1 - i
            : i
        )
        .map((i) =>
          [...Array(8).keys()].map((j) => (
            <div
              key={`${i}_${j}`}
              className={`
              bg-bg-dark ${highlightCells ? '' : ''} h-14 w-14
              bg-[length:30px_30px] bg-center bg-no-repeat p-5 
              ${
                canMove(i, j) &&
                (isCurrentRedBall
                  ? ' hover:bg-bg-dark/50'
                  : ' hover:bg-bg-dark/50')
              }
              ${
                props.gameInfo?.field?.value?.[j]?.[i] == 1
                  ? "bg-[url('/ball_green.png')]"
                  : ''
              }
              ${
                props.gameInfo?.field?.value?.[j]?.[i] == 2
                  ? "bg-[url('/ball_blue.png')]"
                  : ''
              }
              ${
                isLoadingBall(i, j) &&
                (isCurrentRedBall
                  ? "bg-opacity-50 bg-[url('/ball_green.png')]"
                  : "bg-opacity-50 bg-[url('/ball_blue.png')]")
              }
            `}
              style={{ imageRendering: 'pixelated' }}
              id={`${i}_${j}`}
              onClick={() => props.onCellClicked(i, j)}
            ></div>
          ))
        )}
    </div>
  );
};

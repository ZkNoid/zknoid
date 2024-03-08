'use client';

import { IGameInfo } from '@/lib/stores/matchQueue';
import { RandzuField } from 'zknoid-chain-dev';

interface IGameViewProps {
  gameInfo: IGameInfo<RandzuField> | undefined;
  onCellClicked: (x: number, y: number) => void;
  loadingElement: { x: number; y: number } | undefined;
  loading: boolean;
}

export const GameView = (props: IGameViewProps) => {
  const fieldActive =
    props.gameInfo?.isCurrentUserMove && !props.gameInfo?.winner;
  const highlightCells = props.gameInfo?.isCurrentUserMove && !props.loading;
  const displayBall = (i: number, j: number) =>
    props.gameInfo?.isCurrentUserMove &&
    !props.loading &&
    props.gameInfo?.field?.value?.[j]?.[i] == 0;
  const isLoadingBall = (i: number, j: number) =>
    props.loadingElement &&
    props.loadingElement.x == i &&
    props.loadingElement.y == j;
  const isCurrentRedBall = props.gameInfo?.currentUserIndex == 0;

  return (
    <div
      className={`grid grid-cols-15 gap-1 bg-gray-300 ${
        fieldActive ? 'border-[6px] border-dashed border-green-500 p-0' : 'p-2'
      }`}
    >
      {[...Array(15).keys()].map((i) =>
        [...Array(15).keys()].map((j) => (
          <div
            key={`${i}_${j}`}
            className={`
              bg-gray-100 ${highlightCells ? 'hover:bg-gray-200' : ''} h-7 w-7 
              bg-[length:30px_30px] bg-center bg-no-repeat p-5 
              ${
                displayBall(i, j) &&
                (isCurrentRedBall
                  ? "hover:bg-[url('/ball_red.png')]"
                  : "hover:bg-[url('/ball_blue.png')]")
              }
              ${
                props.gameInfo?.field?.value?.[j]?.[i] == 1
                  ? "bg-[url('/ball_red.png')]"
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
                  ? "bg-opacity-50 bg-[url('/ball_red.png')]"
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

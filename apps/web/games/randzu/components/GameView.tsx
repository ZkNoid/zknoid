'use client';

import { IGameInfo } from '@/games/randzu/stores/matchQueue';

interface IGameViewProps {
  gameInfo: IGameInfo | undefined;
  onCellClicked: (x: number, y: number) => void;
  loadingElement: {x: number, y: number} | undefined;
  loading: boolean;
}

export const GameView = (props: IGameViewProps) => {
  return (
    <div className={`grid grid-cols-15 gap-1 ${
        props.gameInfo?.isCurrentUserMove && 
        !props.gameInfo?.winner && 
        'border-green-500 border-4 border-dashed'
      } bg-gray-300 p-2`}>
      {[...Array(15).keys()].map(i => (
        [...Array(15).keys()].map(j =>
          <div
            className={`
              bg-white ${props.gameInfo?.isCurrentUserMove && !props.loading && 'hover:bg-gray-200'} w-7 h-7 
              bg-[length:30px_30px] bg-no-repeat bg-center p-5 
              ${props.gameInfo?.isCurrentUserMove && 
                props.gameInfo?.field?.[j]?.[i] == 0 && 
                (!props.loading && (props.gameInfo?.currentUserIndex == 0 ? 
                  "hover:bg-[url('/ball_red.png')]" : 
                  "hover:bg-[url('/ball_blue.png')]"))
              }
              ${props.gameInfo?.field?.[j]?.[i] == 1 && "bg-[url('/ball_red.png')]"}
              ${props.gameInfo?.field?.[j]?.[i] == 2 && "bg-[url('/ball_blue.png')]"}
              ${props.loadingElement && props.loadingElement.x == i && props.loadingElement.y == j && (
                props.gameInfo?.currentUserIndex == 0 ? 
                  "bg-[url('/ball_red.png')] bg-opacity-50" : 
                  "bg-[url('/ball_blue.png')] bg-opacity-50"
              )}
            `}
            style={{ imageRendering: 'pixelated' }}
            id={`${i}_${j}`}
            onClick={() => props.onCellClicked(i, j)}
          >
          </div>
        )
      )
      )}
    </div>
  );
};
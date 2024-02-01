'use client';

import { useEffect, useRef, useState } from 'react';
import { IGameInfo, useRandzuMatchQueueStore } from '@/lib/stores/randzu/matchQueue';
import { useClientStore } from '@/lib/stores/client';

interface IGameViewProps {
  gameId: number;
  gameInfo: IGameInfo | undefined;
  debug: boolean;
  onCellClicked: (x: number, y: number) => void;
  loadingElement: {x: number, y: number} | undefined;
}

export const GameView = (props: IGameViewProps) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ctx, setContext] = useState<
    CanvasRenderingContext2D | null | undefined
  >(null);

  const debugMode = props.debug;
  const debugModeRef = useRef(debugMode);

  useEffect(() => {
    debugModeRef.current = debugMode;
  }, [debugMode]);

  useEffect(() => {
    const ctx = canvas!.current?.getContext('2d');
    setContext(ctx);
  }, [canvas]);

  useEffect(() => {
    if (!ctx) return;

  }, [ctx, props.gameInfo]);

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
              bg-white hover:bg-gray-200 w-7 h-7 
              bg-[length:30px_30px] bg-no-repeat bg-center p-5 
              ${props.gameInfo?.isCurrentUserMove && 
                props.gameInfo?.field?.[j]?.[i] == 0 && 
                (props.gameInfo?.currentUserIndex == 0 ? 
                  "hover:bg-[url('/ball_red.png')]" : 
                  "hover:bg-[url('/ball_blue.png')]")
              }
              ${props.gameInfo?.field?.[j]?.[i] == 1 && "bg-[url('/ball_red.png')]"}
              ${props.gameInfo?.field?.[j]?.[i] == 2 && "bg-[url('/ball_blue.png')]"}
              ${props.loadingElement && props.loadingElement.x == i && props.loadingElement.y == j && (
                props.gameInfo?.currentUserIndex == 0 ? 
                  "bg-[url('/ball_red.png')] bg-gray-200" : 
                  "bg-[url('/ball_blue.png')] bg-gray-200"
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

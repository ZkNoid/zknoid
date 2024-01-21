'use client';

import { useEffect, useRef, useState } from 'react';
import { IGameInfo } from '@/lib/stores/randzu/matchQueue';
import { useClientStore } from '@/lib/stores/client';
import { UInt32, UInt64 } from 'o1js';
import { RandzuField } from 'zknoid-chain-dev/dist/MatchMaker';

interface IGameViewProps {
  gameId: number;
  gameInfo: IGameInfo | undefined;
  debug: boolean;
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

  const client = useClientStore();

  const onCellClicked = async (x: number, y: number) => {
    if (!props.gameInfo?.isCurrentUserMove) return;

    const updatedField = props.gameInfo.field;
    updatedField[y][x] = props.gameInfo.currentUserIndex + 1;

    const matchMaker = client.client!.runtime.resolve('MatchMaker');

    const updatedRandzuField = RandzuField.from(updatedField);

    matchMaker.makeMove(UInt64.from(props.gameInfo.gameId), updatedRandzuField, Array(5).fill(UInt32.from(0)));
  }

  return (
    <div className={`grid grid-cols-15 gap-1 ${props.gameInfo?.isCurrentUserMove && 'border-green-500 border-4 border-dashed'} bg-gray-300 p-2`}>
      {[...Array(15).keys()].map(i => (
        [...Array(15).keys()].map(j =>
          <div
            className={`
              bg-white hover:bg-gray-200 w-7 h-7 
              bg-[length:30px_30px] bg-no-repeat bg-center p-5 ${props.gameInfo?.isCurrentUserMove && "hover:bg-[url('/ball_red.png')]"}
            `}
            style={{ imageRendering: 'pixelated' }}
            id={`${i}_${j}`}
            onClick={() => onCellClicked(j, i)}
          >

          </div>
        )
      )
      )}
    </div>
  );
};

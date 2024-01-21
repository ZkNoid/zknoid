'use client';

import { useEffect, useRef, useState } from 'react';
import { IGameInfo } from '@/lib/stores/randzu/matchQueue';

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

  return (
    <div className={`grid grid-cols-15 gap-1 ${props.gameInfo?.isCurrentUserMove && 'border-green-500 border-4 border-dashed'} bg-gray-300 p-2`}>
      {[...Array(15)].map(i => (
        [...Array(15)].map(j =>
          <div className=' bg-white hover:bg-gray-100 w-7 h-7' id={`${i}_${j}`}></div>
        )
      )
      )}
    </div>
  );
};

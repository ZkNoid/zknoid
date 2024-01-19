'use client';
import {
  Brick,
  Bricks,
  Tick,
  loadGameContext,
  BRICK_HALF_WIDTH,
  MAX_BRICKS,
  FIELD_HEIGHT,
  FIELD_WIDTH,
  DEFAULT_BALL_LOCATION_X,
  DEFAULT_BALL_LOCATION_Y,
  TICK_PERIOD,
  DEFAULT_BALL_SPEED_X,
  DEFAULT_BALL_SPEED_Y,
  IntPoint,
  DEFAULT_PLATFORM_SPEED,
  GameContext,
  ACCELERATION,
} from 'zknoid-chain-dev';
import { useEffect, useRef, useState } from 'react';
import { Int64, UInt64, Bool, PublicKey } from 'o1js';
import { Ball, Cart, IBrick } from '@/lib/types';

interface IGameInfo {
  player1: PublicKey,
  player2: PublicKey,
  currentMoveUser: PublicKey,
  field: number[],
}

interface IGameViewProps {
  gameId: number;
  gameInfo: IGameInfo | undefined;
  debug: boolean;
}

interface IContractBrick {
  pos: IntPoint;
  value: UInt64;
}

interface IContractBrickPorted {
  x: number;
  y: number;
  w: number;
  h: number;
  value: number;
}

const BOARD_W = 15;
const BOARD_H = 15;

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
    <div className='grid grid-cols-15 gap-1 bg-gray-300 p-2 '>
      {[...Array(15)].map(i => (
        [...Array(15)].map(j => 
          <div className=' bg-white hover:bg-gray-100 w-7 h-7' id={`${i}_${j}`}></div>
        )
      )
      )}

    </div>
  );
};

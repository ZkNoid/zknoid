'use client';

import { IGameInfo } from '@/lib/stores/matchQueue';
import { UInt32 } from 'o1js';
import { useState } from 'react';
import { CheckersField } from 'zknoid-chain-dev';

interface IGameViewProps {
  gameInfo: IGameInfo<CheckersField> | undefined;
  onMoveChosen: (moveId: number, x: number, y: number) => void;
  loadingElement: { x: number; y: number } | undefined;
  loading: boolean;
}

const CHECKERS_FIELD_SIZE = 8;

interface Moves {
  fromCellX: number;
  fromCellY: number;
  moves: number[];
}

export const GameView = (props: IGameViewProps) => {
  const fieldActive =
    props.gameInfo?.isCurrentUserMove && !props.gameInfo?.winner;
  const highlightCells = props.gameInfo?.isCurrentUserMove && !props.loading;

  const [possibleMoves, setPossibleMoves] = useState<Moves>({
    fromCellX: 0,
    fromCellY: 0,
    moves: [],
  });
  const [moveChoosing, setMoveChoosing] = useState(false);

  const isLoadingBall = (i: number, j: number) =>
    props.loadingElement &&
    props.loadingElement.x == j &&
    props.loadingElement.y == i;
  const isCurrentRedBall = props.gameInfo?.currentUserIndex == 0;
  const isPlayer1 = props.gameInfo?.opponent == props.gameInfo?.player2;

  const getPossibleMoves = (x: number, y: number) => {
    const moves = [];
    if (
      props.gameInfo?.field.value[x][y]
        .equals(UInt32.from(props.gameInfo?.currentUserIndex + 1))
        .not()
        .toBoolean()
    )
      return [];

    if (
      x >= 1 &&
      y < CHECKERS_FIELD_SIZE - 1 &&
      props.gameInfo?.field.value[x - 1][y + (isPlayer1 ? 1 : -1)]
        .equals(UInt32.from(0))
        .toBoolean()
    ) {
      moves.push(0);
    }
    if (
      x < CHECKERS_FIELD_SIZE - 1 &&
      y < CHECKERS_FIELD_SIZE - 1 &&
      props.gameInfo?.field.value[x + 1][y + (isPlayer1 ? 1 : -1)]
        .equals(UInt32.from(0))
        .toBoolean()
    ) {
      moves.push(1);
    }
    if ( x >= 2 && y <= CHECKERS_FIELD_SIZE - 2 && 
      props.gameInfo?.field.value[x - 1][y + (isPlayer1 ? 1 : -1)]
        .equals(UInt32.from(2 - props.gameInfo?.currentUserIndex))
        .toBoolean() &&
      props.gameInfo?.field.value[x - 2][y + (isPlayer1 ? 2 : -2)]
        .equals(UInt32.from(0))
        .toBoolean()
    ) {
      moves.push(2);
    }

    if ( x <= CHECKERS_FIELD_SIZE - 3 && y >= 2 && 
      props.gameInfo?.field.value[x + 1][y + (isPlayer1 ? 1 : -1)]
        .equals(UInt32.from(2 - props.gameInfo?.currentUserIndex))
        .toBoolean() &&
      props.gameInfo?.field.value[x + 2][y + (isPlayer1 ? 2 : -2)]
        .equals(UInt32.from(0))
        .toBoolean()
    ) {
      moves.push(3);
    }

    return moves;
  };
  console.log('Possible moves', possibleMoves);

  return (
    <div
      className={`grid grid-cols-8 gap-px rounded-[5px] bg-foreground/50 ${
        fieldActive ? 'border-4 border-left-accent p-0' : 'p-1'
      }`}
    >
      {[...Array(8).keys()]
        .map((i) => (isPlayer1 ? CHECKERS_FIELD_SIZE - 1 - i : i))
        .map((i) =>
          [...Array(8).keys()].map((j) => (
            <div
              key={`${i}_${j}`} // j = x, i = y
              onPointerEnter={() => {
                if (!moveChoosing && fieldActive) {
                  setPossibleMoves({
                    fromCellX: j,
                    fromCellY: i,
                    moves: getPossibleMoves(j, i),
                  });
                }
              }}
              onClick={() => {
                console.log('MOVE CHOOSING', moveChoosing);
                if (moveChoosing) {
                  if (
                    possibleMoves.moves.includes(1) &&
                    j == possibleMoves.fromCellX + 1 &&
                    i == possibleMoves.fromCellY + (isPlayer1 ? 1 : -1)
                  ) {
                    props.onMoveChosen(
                      1,
                      possibleMoves.fromCellX,
                      possibleMoves.fromCellY
                    );
                  } else if (
                    possibleMoves.moves.includes(0) &&
                    j == possibleMoves.fromCellX - 1 &&
                    i == possibleMoves.fromCellY + (isPlayer1 ? 1 : -1)
                  ) {
                    props.onMoveChosen(
                      0,
                      possibleMoves.fromCellX,
                      possibleMoves.fromCellY
                    );
                  } else if (
                    possibleMoves.moves.includes(2) &&
                    j == possibleMoves.fromCellX - 2 &&
                    i == possibleMoves.fromCellY + (isPlayer1 ? 2 : -2)
                  ) {
                    props.onMoveChosen(
                      2,
                      possibleMoves.fromCellX,
                      possibleMoves.fromCellY
                    );
                  } else if (
                    possibleMoves.moves.includes(3) &&
                    j == possibleMoves.fromCellX + 2 &&
                    i == possibleMoves.fromCellY + (isPlayer1 ? 2 : -2)
                  ) {
                    props.onMoveChosen(
                      3,
                      possibleMoves.fromCellX,
                      possibleMoves.fromCellY
                    );
                  }
                  setMoveChoosing(false);
                  setPossibleMoves({
                    fromCellX: 0,
                    fromCellY: 0,
                    moves: [],
                  });
                } else if (possibleMoves.moves) {
                  setMoveChoosing(true);
                }
              }}
              className={`
              bg-bg-dark ${highlightCells ? '' : ''} h-14 w-14
              bg-[length:30px_30px] bg-center bg-no-repeat p-5 
              ${
                isCurrentRedBall
                  ? ' hover:bg-bg-dark/50'
                  : ' hover:bg-bg-dark/50'
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
              ${
                ((possibleMoves.moves.includes(1) &&
                  j == possibleMoves.fromCellX + 1 &&
                  i == possibleMoves.fromCellY + (isPlayer1 ? 1 : -1)) ||
                  (possibleMoves.moves.includes(0) &&
                    j == possibleMoves.fromCellX - 1 &&
                    i == possibleMoves.fromCellY + (isPlayer1 ? 1 : -1)) ||
                  (possibleMoves.moves.includes(2) &&
                    j == possibleMoves.fromCellX - 2 &&
                    i == possibleMoves.fromCellY + (isPlayer1 ? 2 : -2)) ||
                  (possibleMoves.moves.includes(3) &&
                    j == possibleMoves.fromCellX + 2 &&
                    i == possibleMoves.fromCellY + (isPlayer1 ? 2 : -2))) &&
                'bg-bg-dark/50'
              }
            `}
              style={{ imageRendering: 'pixelated' }}
              id={`${i}_${j}`}
              // onClick={() => props.onCellClicked(i, j)}
            ></div>
          ))
        )}
    </div>
  );
};

'use client';

import { IGameInfo } from '@/lib/stores/matchQueue';
import { Bool, UInt32 } from 'o1js';
import { useEffect, useState } from 'react';
import { CheckersField } from 'zknoid-chain-dev';

interface IGameViewProps {
  gameInfo: IGameInfo<CheckersField> | undefined;
  onMoveChosen: (moveId: number, x: number, y: number) => void;
  loadingElement: { x: number; y: number } | undefined;
  loading: boolean;
}

export const CHECKERS_FIELD_SIZE = 8;

export const MOVE_TOP_LEFT = 0;
export const MOVE_TOP_RIGHT = 1;
export const CAPTURE_TOP_LEFT = 2;
export const CAPTURE_TOP_RIGHT = 3;
export const MOVE_KING_BOTTOM_LEFT = 4;
export const MOVE_KING_BOTTOM_RIGHT = 5;
export const CAPTURE_KING_BOTTOM_LEFT = 6;
export const CAPTURE_KING_BOTTOM_RIGHT = 7;

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
  const [canEat, setCanEat] = useState(false);

  useEffect(() => {
    if (!props.gameInfo?.field) return;

    for (let i = 0; i < CHECKERS_FIELD_SIZE; i++) {
      for (let j = 0; j < CHECKERS_FIELD_SIZE; j++) {
        const moves = getPossibleMoves(i, j);
        if (
          moves.includes(CAPTURE_TOP_LEFT) ||
          moves.includes(CAPTURE_TOP_RIGHT) ||
          moves.includes(CAPTURE_KING_BOTTOM_LEFT) ||
          moves.includes(CAPTURE_KING_BOTTOM_RIGHT)
        ) {
          setCanEat(true);
          return;
        }
      }
    }
    setCanEat(false);
  }, [props.gameInfo?.field]);

  const isCurrentRedBall = props.gameInfo?.currentUserIndex == 0;
  const isPlayer1 = props.gameInfo?.opponent == props.gameInfo?.player2;

  const getPossibleMoves = (x: number, y: number) => {
    const moves = [];

    if (!props.gameInfo) {
      return [];
    }

    const fieldValue = props.gameInfo!.field.value[x][y];
    if (
      Bool.or(
        fieldValue.equals(UInt32.from(props.gameInfo?.currentUserIndex! + 1)),
        fieldValue.equals(UInt32.from(props.gameInfo?.currentUserIndex! + 3))
      )

        .not()
        .toBoolean()
    )
      return [];

    console.log('Passed', isPlayer1);

    if (
      x >= 2 &&
      (isPlayer1 ? y <= CHECKERS_FIELD_SIZE - 3 : y >= 2) &&
      (props.gameInfo?.field.value[x - 1][y + (isPlayer1 ? 1 : -1)]
        .equals(UInt32.from(2 - props.gameInfo?.currentUserIndex))
        .toBoolean() ||
        props.gameInfo?.field.value[x - 1][y + (isPlayer1 ? 1 : -1)]
          .equals(UInt32.from(4 - props.gameInfo?.currentUserIndex))
          .toBoolean()) &&
      props.gameInfo?.field.value[x - 2][y + (isPlayer1 ? 2 : -2)]
        .equals(UInt32.from(0))
        .toBoolean()
    ) {
      moves.push(CAPTURE_TOP_LEFT);
    }

    if (
      x >= 2 &&
      (!isPlayer1 ? y <= CHECKERS_FIELD_SIZE - 3 : y >= 2) &&
      +props.gameInfo.field.value[x][y] ==
        props.gameInfo?.currentUserIndex! + 3 &&
      (props.gameInfo?.field.value[x - 1][y + (isPlayer1 ? -1 : 1)]
        .equals(UInt32.from(2 - props.gameInfo?.currentUserIndex))
        .toBoolean() ||
        props.gameInfo?.field.value[x - 1][y + (isPlayer1 ? -1 : 1)]
          .equals(UInt32.from(4 - props.gameInfo?.currentUserIndex))
          .toBoolean()) &&
      props.gameInfo?.field.value[x - 2][y + (isPlayer1 ? -2 : 2)]
        .equals(UInt32.from(0))
        .toBoolean()
    ) {
      moves.push(CAPTURE_KING_BOTTOM_LEFT);
    }

    if (
      x <= CHECKERS_FIELD_SIZE - 3 &&
      (isPlayer1 ? y <= CHECKERS_FIELD_SIZE - 3 : y >= 2) &&
      (props.gameInfo?.field.value[x + 1][y + (isPlayer1 ? 1 : -1)]
        .equals(UInt32.from(2 - props.gameInfo?.currentUserIndex))
        .toBoolean() ||
        props.gameInfo?.field.value[x + 1][y + (isPlayer1 ? 1 : -1)]
          .equals(UInt32.from(4 - props.gameInfo?.currentUserIndex))
          .toBoolean()) &&
      props.gameInfo?.field.value[x + 2][y + (isPlayer1 ? 2 : -2)]
        .equals(UInt32.from(0))
        .toBoolean()
    ) {
      moves.push(CAPTURE_TOP_RIGHT);
    }

    if (
      x <= CHECKERS_FIELD_SIZE - 3 &&
      (!isPlayer1 ? y <= CHECKERS_FIELD_SIZE - 3 : y >= 2) &&
      +props.gameInfo.field.value[x][y] ==
        props.gameInfo?.currentUserIndex! + 3 &&
      (props.gameInfo?.field.value[x + 1][y + (isPlayer1 ? -1 : 1)]
        .equals(UInt32.from(2 - props.gameInfo?.currentUserIndex))
        .toBoolean() ||
        props.gameInfo?.field.value[x + 1][y + (isPlayer1 ? -1 : 1)]
          .equals(UInt32.from(4 - props.gameInfo?.currentUserIndex))
          .toBoolean()) &&
      props.gameInfo?.field.value[x + 2][y + (isPlayer1 ? -2 : 2)]
        .equals(UInt32.from(0))
        .toBoolean()
    ) {
      moves.push(CAPTURE_KING_BOTTOM_RIGHT);
    }

    const canMove =
      !moves.includes(CAPTURE_TOP_LEFT) &&
      !moves.includes(CAPTURE_TOP_RIGHT) &&
      !moves.includes(CAPTURE_KING_BOTTOM_LEFT) &&
      !moves.includes(CAPTURE_KING_BOTTOM_RIGHT) &&
      !canEat;

    if (
      canMove &&
      x >= 1 &&
      (isPlayer1 ? y < CHECKERS_FIELD_SIZE - 1 : y > 0) &&
      props.gameInfo?.field.value[x - 1][y + (isPlayer1 ? 1 : -1)]
        .equals(UInt32.from(0))
        .toBoolean()
    ) {
      moves.push(MOVE_TOP_LEFT);
    }

    if (
      canMove &&
      x >= 1 &&
      (!isPlayer1 ? y < CHECKERS_FIELD_SIZE - 1 : y > 0) &&
      +props.gameInfo.field.value[x][y] ==
        props.gameInfo?.currentUserIndex! + 3 &&
      props.gameInfo?.field.value[x - 1][y + (isPlayer1 ? -1 : 1)]
        .equals(UInt32.from(0))
        .toBoolean()
    ) {
      moves.push(MOVE_KING_BOTTOM_LEFT);
    }
    if (
      canMove &&
      x < CHECKERS_FIELD_SIZE - 1 &&
      (isPlayer1 ? y < CHECKERS_FIELD_SIZE - 1 : y > 0) &&
      props.gameInfo?.field.value[x + 1][y + (isPlayer1 ? 1 : -1)]
        .equals(UInt32.from(0))
        .toBoolean()
    ) {
      moves.push(MOVE_TOP_RIGHT);
    }
    if (
      canMove &&
      x < CHECKERS_FIELD_SIZE - 1 &&
      (!isPlayer1 ? y < CHECKERS_FIELD_SIZE - 1 : y > 0) &&
      +props.gameInfo.field.value[x][y] ==
        props.gameInfo?.currentUserIndex! + 3 &&
      props.gameInfo?.field.value[x + 1][y + (isPlayer1 ? -1 : 1)]
        .equals(UInt32.from(0))
        .toBoolean()
    ) {
      moves.push(MOVE_KING_BOTTOM_RIGHT);
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
                    possibleMoves.moves.includes(MOVE_TOP_RIGHT) &&
                    j == possibleMoves.fromCellX + 1 &&
                    i == possibleMoves.fromCellY + (isPlayer1 ? 1 : -1)
                  ) {
                    props.onMoveChosen(
                      MOVE_TOP_RIGHT,
                      possibleMoves.fromCellX,
                      possibleMoves.fromCellY
                    );
                  } else if (
                    possibleMoves.moves.includes(MOVE_KING_BOTTOM_RIGHT) &&
                    j == possibleMoves.fromCellX + 1 &&
                    i == possibleMoves.fromCellY + (isPlayer1 ? -1 : 1)
                  ) {
                    props.onMoveChosen(
                      MOVE_KING_BOTTOM_RIGHT,
                      possibleMoves.fromCellX,
                      possibleMoves.fromCellY
                    );
                  } else if (
                    possibleMoves.moves.includes(MOVE_TOP_LEFT) &&
                    j == possibleMoves.fromCellX - 1 &&
                    i == possibleMoves.fromCellY + (isPlayer1 ? 1 : -1)
                  ) {
                    props.onMoveChosen(
                      MOVE_TOP_LEFT,
                      possibleMoves.fromCellX,
                      possibleMoves.fromCellY
                    );
                  } else if (
                    possibleMoves.moves.includes(MOVE_KING_BOTTOM_LEFT) &&
                    j == possibleMoves.fromCellX - 1 &&
                    i == possibleMoves.fromCellY + (isPlayer1 ? -1 : 1)
                  ) {
                    props.onMoveChosen(
                      MOVE_KING_BOTTOM_LEFT,
                      possibleMoves.fromCellX,
                      possibleMoves.fromCellY
                    );
                  } else if (
                    possibleMoves.moves.includes(CAPTURE_TOP_LEFT) &&
                    j == possibleMoves.fromCellX - 2 &&
                    i == possibleMoves.fromCellY + (isPlayer1 ? 2 : -2)
                  ) {
                    props.onMoveChosen(
                      CAPTURE_TOP_LEFT,
                      possibleMoves.fromCellX,
                      possibleMoves.fromCellY
                    );
                  } else if (
                    possibleMoves.moves.includes(CAPTURE_KING_BOTTOM_LEFT) &&
                    j == possibleMoves.fromCellX - 2 &&
                    i == possibleMoves.fromCellY + (isPlayer1 ? -2 : 2)
                  ) {
                    props.onMoveChosen(
                      CAPTURE_KING_BOTTOM_LEFT,
                      possibleMoves.fromCellX,
                      possibleMoves.fromCellY
                    );
                  } else if (
                    possibleMoves.moves.includes(CAPTURE_TOP_RIGHT) &&
                    j == possibleMoves.fromCellX + 2 &&
                    i == possibleMoves.fromCellY + (isPlayer1 ? 2 : -2)
                  ) {
                    props.onMoveChosen(
                      CAPTURE_TOP_RIGHT,
                      possibleMoves.fromCellX,
                      possibleMoves.fromCellY
                    );
                  } else if (
                    possibleMoves.moves.includes(CAPTURE_KING_BOTTOM_RIGHT) &&
                    j == possibleMoves.fromCellX + 2 &&
                    i == possibleMoves.fromCellY + (isPlayer1 ? -2 : 2)
                  ) {
                    props.onMoveChosen(
                      CAPTURE_KING_BOTTOM_RIGHT,
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
              bg-[length:40px_40px] bg-center bg-no-repeat p-5 
              ${
                isCurrentRedBall
                  ? ' hover:bg-bg-dark/50'
                  : ' hover:bg-bg-dark/50'
              }
              ${
                props.gameInfo && +props.gameInfo.field.value[j][i] == 1
                  ? "bg-[url('/ball_green.svg')]"
                  : ''
              }
              ${
                props.gameInfo && +props.gameInfo.field.value[j][i] == 2
                  ? "bg-[url('/ball_blue.svg')]"
                  : ''
              }
              ${
                props.gameInfo && +props.gameInfo.field.value[j][i] == 3
                  ? "bg-[url('/ball_green_adv.svg')]"
                  : ''
              }
              ${
                props.gameInfo && +props.gameInfo.field.value[j][i] == 4
                  ? "bg-[url('/ball_blue_adv.svg')]"
                  : ''
              }
              ${
                ((possibleMoves.moves.includes(MOVE_TOP_RIGHT) &&
                  j == possibleMoves.fromCellX + 1 &&
                  i == possibleMoves.fromCellY + (isPlayer1 ? 1 : -1)) ||
                  (possibleMoves.moves.includes(MOVE_KING_BOTTOM_RIGHT) &&
                    j == possibleMoves.fromCellX + 1 &&
                    i == possibleMoves.fromCellY + (!isPlayer1 ? 1 : -1)) ||
                  (possibleMoves.moves.includes(MOVE_TOP_LEFT) &&
                    j == possibleMoves.fromCellX - 1 &&
                    i == possibleMoves.fromCellY + (isPlayer1 ? 1 : -1)) ||
                  (possibleMoves.moves.includes(MOVE_KING_BOTTOM_LEFT) &&
                    j == possibleMoves.fromCellX - 1 &&
                    i == possibleMoves.fromCellY + (!isPlayer1 ? 1 : -1)) ||
                  (possibleMoves.moves.includes(CAPTURE_TOP_LEFT) &&
                    j == possibleMoves.fromCellX - 2 &&
                    i == possibleMoves.fromCellY + (isPlayer1 ? 2 : -2)) ||
                  (possibleMoves.moves.includes(CAPTURE_KING_BOTTOM_LEFT) &&
                    j == possibleMoves.fromCellX - 2 &&
                    i == possibleMoves.fromCellY + (isPlayer1 ? -2 : 2)) ||
                  (possibleMoves.moves.includes(CAPTURE_TOP_RIGHT) &&
                    j == possibleMoves.fromCellX + 2 &&
                    i == possibleMoves.fromCellY + (isPlayer1 ? 2 : -2)) ||
                  (possibleMoves.moves.includes(CAPTURE_KING_BOTTOM_RIGHT) &&
                    j == possibleMoves.fromCellX + 2 &&
                    i == possibleMoves.fromCellY + (isPlayer1 ? -2 : 2))) &&
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

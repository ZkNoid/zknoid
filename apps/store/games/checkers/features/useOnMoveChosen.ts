import { CheckersField, client } from 'zknoid-chain-dev';
import { Bool, UInt32, UInt64 } from 'o1js';
import {
  CAPTURE_KING_BOTTOM_LEFT,
  CAPTURE_KING_BOTTOM_RIGHT,
  CAPTURE_TOP_LEFT,
  CAPTURE_TOP_RIGHT,
  CHECKERS_FIELD_SIZE,
  MOVE_KING_BOTTOM_LEFT,
  MOVE_KING_BOTTOM_RIGHT,
  MOVE_TOP_LEFT,
  MOVE_TOP_RIGHT,
} from '@/games/checkers/components/GameView';
import { MatchQueueState } from '@/lib/stores/matchQueue';
import { useStore } from 'zustand';
import { useSessionKeyStore } from '@/lib/stores/sessionKeyStorage';

export const useOnMoveChosen = (
  matchQueue: MatchQueueState,
  setLoading: (isLoading: boolean) => void,
  setLoadingElement: (element: { x: number; y: number } | undefined) => void
) => {
  const sessionPrivateKey = useStore(useSessionKeyStore, (state) =>
    state.getSessionKey()
  );
  const isPlayer1 =
    matchQueue.gameInfo?.opponent == matchQueue.gameInfo?.player2;
  return async (moveId: number, x: number, y: number) => {
    if (!matchQueue.gameInfo?.isCurrentUserMove) return;
    console.log('After checks');

    const currentUserId = matchQueue.gameInfo.currentUserIndex + 1;

    const updatedField = (matchQueue.gameInfo.field as CheckersField).value.map(
      (x: UInt32[]) => x.map((x) => Number(x.toBigint()))
    );

    const isKing = updatedField[x][y] > 2n;

    console.log('On move chosen', moveId, x, y);

    console.log('On move chosen', updatedField);

    updatedField[x][y] = 0;

    if (moveId == MOVE_TOP_LEFT) {
      updatedField[x - 1][y + (isPlayer1 ? 1 : -1)] =
        isKing || (isPlayer1 ? y == CHECKERS_FIELD_SIZE - 2 : y == 1)
          ? currentUserId + 2
          : currentUserId;
    } else if (moveId == MOVE_KING_BOTTOM_LEFT) {
      updatedField[x - 1][y + (isPlayer1 ? -1 : 1)] = currentUserId + 2;
    } else if (moveId == MOVE_TOP_RIGHT) {
      updatedField[x + 1][y + (isPlayer1 ? 1 : -1)] =
        isKing || (isPlayer1 ? y == CHECKERS_FIELD_SIZE - 2 : y == 1)
          ? currentUserId + 2
          : currentUserId;
    } else if (moveId == MOVE_KING_BOTTOM_RIGHT) {
      updatedField[x + 1][y + (isPlayer1 ? -1 : 1)] = currentUserId + 2;
    } else if (moveId == CAPTURE_TOP_LEFT) {
      console.log(x, y);
      updatedField[x - 1][y + (isPlayer1 ? 1 : -1)] = 0;
      updatedField[x - 2][y + (isPlayer1 ? 2 : -2)] =
        isKing || (isPlayer1 ? y == CHECKERS_FIELD_SIZE - 3 : y == 2)
          ? currentUserId + 2
          : currentUserId;
    } else if (moveId == CAPTURE_KING_BOTTOM_LEFT) {
      console.log(x, y);
      updatedField[x - 1][y + (isPlayer1 ? -1 : 1)] = 0;
      updatedField[x - 2][y + (isPlayer1 ? -2 : 2)] =
        isKing || (isPlayer1 ? y == CHECKERS_FIELD_SIZE - 3 : y == 2)
          ? currentUserId + 2
          : currentUserId;
    } else if (moveId == CAPTURE_TOP_RIGHT) {
      updatedField[x + 1][y + (isPlayer1 ? 1 : -1)] = 0;
      updatedField[x + 2][y + (isPlayer1 ? 2 : -2)] =
        isKing || (isPlayer1 ? y == CHECKERS_FIELD_SIZE - 3 : y == 2)
          ? currentUserId + 2
          : currentUserId;
    } else if (moveId == CAPTURE_KING_BOTTOM_RIGHT) {
      updatedField[x + 1][y + (isPlayer1 ? -1 : 1)] = 0;
      updatedField[x + 2][y + (isPlayer1 ? -2 : 2)] =
        isKing || (isPlayer1 ? y == CHECKERS_FIELD_SIZE - 3 : y == 2)
          ? currentUserId + 2
          : currentUserId;
    }

    console.log('On move chosen', updatedField);

    const randzuLogic = client.runtime.resolve('CheckersLogic');
    const updatedCheckersField = CheckersField.from(updatedField);

    console.log('Proposed is king', isKing);

    const tx =
      moveId == MOVE_TOP_LEFT ||
      moveId == MOVE_TOP_RIGHT ||
      moveId == MOVE_KING_BOTTOM_LEFT ||
      moveId == MOVE_KING_BOTTOM_RIGHT
        ? await client.transaction(
            sessionPrivateKey.toPublicKey(),
            async () => {
              randzuLogic.makeMoveChecker(
                UInt64.from(matchQueue.gameInfo!.gameId),
                updatedCheckersField,
                UInt64.from(x),
                UInt64.from(y),
                UInt64.from(moveId),
                Bool(isKing)
              );
            }
          )
        : await client.transaction(
            sessionPrivateKey.toPublicKey(),
            async () => {
              randzuLogic.makeMoveCapture(
                UInt64.from(matchQueue.gameInfo!.gameId),
                updatedCheckersField,
                UInt64.from(x),
                UInt64.from(y),
                UInt64.from(moveId),
                Bool(isKing)
              );
            }
          );

    setLoading(true);
    setLoadingElement({
      x,
      y,
    });
    console.log('Sending tx');
    tx.transaction = tx.transaction?.sign(sessionPrivateKey);
    await tx.send();
  };
};

import { state, runtimeMethod, runtimeModule } from '@proto-kit/module';
import { Option } from '@proto-kit/protocol';
import { State, StateMap, assert } from '@proto-kit/protocol';
import {
  PublicKey,
  Struct,
  UInt64,
  Provable,
  Bool,
  UInt32,
  Poseidon,
  Field,
  Int64,
} from 'o1js';
import { MatchMaker } from '../engine/MatchMaker';
import type { QueueListItem } from '../engine/MatchMaker';
import { UInt64 as ProtoUInt64 } from '@proto-kit/library';
import { Lobby } from '../engine/LobbyManager';

const CHECKERS_FIELD_SIZE = 8;

export const MOVE_TOP_LEFT = UInt64.from(0);
export const MOVE_TOP_RIGHT = UInt64.from(1);
export const CAPTURE_TOP_LEFT = UInt64.from(2);
export const CAPTURE_TOP_RIGHT = UInt64.from(3);

export const MOVE_KING_BOTTOM_LEFT = UInt64.from(4);
export const MOVE_KING_BOTTOM_RIGHT = UInt64.from(5);
export const CAPTURE_KING_BOTTOM_LEFT = UInt64.from(6);
export const CAPTURE_KING_BOTTOM_RIGHT = UInt64.from(7);

export class CheckersField extends Struct({
  value: Provable.Array(
    Provable.Array(UInt32, CHECKERS_FIELD_SIZE),
    CHECKERS_FIELD_SIZE,
  ),
}) {
  hash() {
    return Poseidon.hash(this.value.flat().map((x) => x.value));
  }
  static from(value: number[][]) {
    return new CheckersField({
      value: value.map((row) => row.map((x) => UInt32.from(x))),
    });
  }
}

export class GameInfo extends Struct({
  player1: PublicKey,
  player2: PublicKey,
  currentMoveUser: PublicKey,
  lastMoveBlockHeight: UInt64,
  field: CheckersField,
  winner: PublicKey,
}) {}

@runtimeModule()
export class CheckersLogic extends MatchMaker {
  // Game ids start from 1
  @state() public games = StateMap.from<UInt64, GameInfo>(UInt64, GameInfo);
  @state() public gamesNum = State.from<UInt64>(UInt64);

  public override initGame(lobby: Lobby, shouldUpdate: Bool): UInt64 {
    const currentGameId = this.getNextGameId();
    const field = Array.from({ length: CHECKERS_FIELD_SIZE }, () =>
      Array(CHECKERS_FIELD_SIZE)
        .fill(0)
        .map((x) => UInt32.from(x)),
    );

    for (let i = 0; i < CHECKERS_FIELD_SIZE; i++) {
      for (let j = 0; j < CHECKERS_FIELD_SIZE; j++) {
        if ((i + j) % 2 == 0 && i <= 2) {
          field[j][i] = UInt32.from(1);
        }
        if ((i + j) % 2 == 0 && i >= CHECKERS_FIELD_SIZE - 3) {
          field[j][i] = UInt32.from(2);
        }
      }
    }

    // Setting active game if opponent found
    this.games.set(
      Provable.if(shouldUpdate, currentGameId, UInt64.from(0)),
      new GameInfo({
        player1: lobby.players[0],
        player2: lobby.players[1],
        currentMoveUser: lobby.players[0],
        lastMoveBlockHeight: this.network.block.height,
        field: new CheckersField({
          value: field,
        }),
        winner: PublicKey.empty(),
      }),
    );

    this.gameFund.set(
      currentGameId,
      ProtoUInt64.from(lobby.participationFee).mul(2),
    );

    return super.initGame(lobby, shouldUpdate);
  }

  public override getNextGameId(): UInt64 {
    return this.gamesNum.get().orElse(UInt64.from(1));
  }
  public override updateNextGameId(shouldUpdate: Bool): void {
    let curGameId = this.getNextGameId();

    this.gamesNum.set(Provable.if(shouldUpdate, curGameId.add(1), curGameId));
  }

  @runtimeMethod()
  public proveOpponentTimeout(gameId: UInt64): void {
    super.proveOpponentTimeout(gameId, false);
  }

  @runtimeMethod()
  public makeMoveChecker(
    gameId: UInt64,
    newField: CheckersField,
    x: UInt64,
    y: UInt64,
    moveType: UInt64,
    proposedIsKing: Bool,
  ): void {
    const sessionSender = this.sessions.get(this.transaction.sender.value);
    const sender = Provable.if(
      sessionSender.isSome,
      sessionSender.value,
      this.transaction.sender.value,
    );

    const gameOption = this.games.get(gameId);
    const game = gameOption.value;

    const moveFromX = x;
    const moveFromY = y;

    const firstPlayerMove = Provable.if(
      Bool.or(
        moveType.equals(MOVE_KING_BOTTOM_LEFT),
        moveType.equals(MOVE_KING_BOTTOM_RIGHT),
      ),
      game.player1.equals(game.currentMoveUser).not(),
      game.player1.equals(game.currentMoveUser),
    );

    assert(
      moveType
        .equals(MOVE_TOP_LEFT)
        .not()
        .or(moveFromX.greaterThan(UInt64.zero)),
      'ERR1',
    );
    assert(
      moveType
        .equals(MOVE_TOP_RIGHT)
        .not()
        .or(moveFromX.lessThan(UInt64.from(CHECKERS_FIELD_SIZE))),
      'ERR2',
    );
    assert(firstPlayerMove.or(moveFromY.greaterThan(UInt64.zero)), 'ERR3');
    assert(
      firstPlayerMove
        .not()
        .or(moveFromY.lessThan(UInt64.from(CHECKERS_FIELD_SIZE))),
      'ERR4',
    );

    const xSubValue = Provable.if(
      moveFromX.greaterThan(UInt64.zero),
      UInt64.from(1),
      UInt64.zero,
    );
    const ySubValue = Provable.if(
      moveFromY.greaterThan(UInt64.zero),
      UInt64.from(1),
      UInt64.zero,
    );

    let moveToX = Provable.if(
      Bool.or(
        moveType.equals(MOVE_TOP_LEFT),
        moveType.equals(MOVE_KING_BOTTOM_LEFT),
      ),
      moveFromX.sub(xSubValue),
      moveFromX.add(1),
    );
    let moveToY = Provable.if(
      firstPlayerMove,
      moveFromY.add(UInt64.from(1)),
      moveFromY.sub(ySubValue),
    );

    const isKing = Provable.if(
      firstPlayerMove,
      moveToY.equals(UInt64.from(CHECKERS_FIELD_SIZE - 1)),
      moveToY.equals(UInt64.from(0)),
    );

    Provable.asProver(() => {
      console.log(
        'Is king',
        isKing.toBoolean(),
        moveToY,
        Provable.if(
          firstPlayerMove,
          UInt64.from(CHECKERS_FIELD_SIZE - 1),
          UInt64.from(0),
        ).toBigInt(),
      );
    });

    assert(gameOption.isSome, 'Invalid game id');
    assert(game.currentMoveUser.equals(sender), `Not your move`);
    assert(game.winner.equals(PublicKey.empty()), `Game finished`);
    assert(moveType.lessThanOrEqual(UInt64.from(5)), 'Invalid game type');

    const winProposed = Bool(false);

    const currentUserId = Provable.if(
      game.currentMoveUser.equals(game.player1),
      UInt32.from(1),
      UInt32.from(2),
    );

    for (let i = 0; i < CHECKERS_FIELD_SIZE; i++) {
      for (let j = 0; j < CHECKERS_FIELD_SIZE; j++) {
        const isMoveFromCell = Bool.and(
          UInt64.from(i).equals(moveFromX),
          UInt64.from(j).equals(moveFromY),
        );

        const isMoveToCell = Bool.and(
          UInt64.from(i).equals(moveToX),
          UInt64.from(j).equals(moveToY),
        );

        const isNotChanged = isMoveFromCell.not().and(isMoveToCell.not());

        const cellEquals = isNotChanged.and(
          game.field.value[i][j].equals(newField.value[i][j]),
        );
        const moveFromEquals = isMoveFromCell.and(
          newField.value[i][j].equals(UInt32.zero),
        );
        assert(
          moveFromEquals
            .not()
            .or(
              proposedIsKing
                .not()
                .or(game.field.value[i][j].greaterThan(UInt32.from(2))),
            ),
          'King proposed incorrectly',
        );

        const moveToEquals = isMoveToCell.and(
          newField.value[i][j].equals(
            Provable.if(
              isKing.or(proposedIsKing),
              currentUserId.add(2),
              currentUserId,
            ),
          ),
        );

        Provable.asProver(() => {
          console.log(
            'MoveToEquals',
            isKing.toBoolean(),
            game.field.value[i][j].equals(currentUserId.add(2)).toBoolean(),
            newField.value[i][j].toBigint(),
            currentUserId.add(2).toBigint(),
          );
        });

        // Check that player owns moved figure
        assert(
          moveFromEquals
            .not()
            .or(
              game.field.value[i][j]
                .equals(currentUserId)
                .or(game.field.value[i][j].equals(currentUserId.add(2))),
            ),
          'ERR5',
        );

        // Check that on new spot no figures located
        assert(
          moveToEquals.not().or(game.field.value[i][j].equals(UInt32.zero)),
          'ERR6',
        );

        Provable.asProver(() => {
          if (
            gameOption.isSome
              .and(cellEquals.or(moveFromEquals).or(moveToEquals).not())
              .toBoolean()
          ) {
            console.log(isMoveFromCell.toString());
            console.log(isMoveToCell.toString());
            console.log(
              game.field.value[i][j].equals(newField.value[i][j]).toString(),
            );

            console.log(`[${i}: ${j}]`);
            console.log(
              `${game.field.value[i][j].toString()} != ${newField.value[i][
                j
              ].toString()}`,
            );
          }
        });

        // Check that either
        // 1) Cell is not changed
        // 2) Figure moved from that cell
        // 3) Figure moved to that cell
        assert(cellEquals.or(moveFromEquals).or(moveToEquals), 'ERR7');
      }
    }

    Provable.log('AAAAAAAA');

    game.winner = Provable.if(
      winProposed,
      game.currentMoveUser,
      PublicKey.empty(),
    );

    const winnerShare = ProtoUInt64.from(
      Provable.if(winProposed, UInt64.from(1), UInt64.from(0)),
    );

    this.acquireFunds(
      gameId,
      game.winner,
      PublicKey.empty(),
      winnerShare,
      ProtoUInt64.from(0),
      ProtoUInt64.from(1),
    );

    game.field = newField;
    game.currentMoveUser = Provable.if(
      game.currentMoveUser.equals(game.player1),
      game.player2,
      game.player1,
    );
    game.lastMoveBlockHeight = this.network.block.height;
    this.games.set(gameId, game);

    // Removing active game for players if game ended
    this.activeGameId.set(
      Provable.if(winProposed, game.player2, PublicKey.empty()),
      UInt64.from(0),
    );
    this.activeGameId.set(
      Provable.if(winProposed, game.player1, PublicKey.empty()),
      UInt64.from(0),
    );
  }

  private getCaptureCells(
    moveType: UInt64,
    firstPlayerMove: Bool,
    moveFromX: UInt64,
    moveFromY: UInt64,
  ) {
    const xSubValue = Provable.if(
      moveFromX.greaterThan(UInt64.zero),
      UInt64.from(1),
      UInt64.zero,
    );
    const ySubValue = Provable.if(
      moveFromY.greaterThan(UInt64.zero),
      UInt64.from(1),
      UInt64.zero,
    );

    const xSubValue2 = Provable.if(
      moveFromX.greaterThan(UInt64.one),
      UInt64.from(2),
      UInt64.zero,
    );
    const ySubValue2 = Provable.if(
      moveFromY.greaterThan(UInt64.one),
      UInt64.from(2),
      UInt64.zero,
    );

    let capturedCellX = Provable.if(
      Bool.or(
        moveType.equals(CAPTURE_TOP_LEFT),
        moveType.equals(CAPTURE_KING_BOTTOM_LEFT),
      ),
      moveFromX.sub(xSubValue),
      moveFromX.add(1),
    );
    let capturedCellY = Provable.if(
      firstPlayerMove,
      moveFromY.add(UInt64.from(1)),
      moveFromY.sub(ySubValue),
    );

    let moveToX = Provable.if(
      Bool.or(
        moveType.equals(CAPTURE_TOP_LEFT),
        moveType.equals(CAPTURE_KING_BOTTOM_LEFT),
      ),
      moveFromX.sub(xSubValue2),
      moveFromX.add(2),
    );
    let moveToY = Provable.if(
      firstPlayerMove,
      moveFromY.add(UInt64.from(2)),
      moveFromY.sub(ySubValue2),
    );

    return { capturedCellX, capturedCellY, moveToX, moveToY };
  }

  @runtimeMethod()
  public makeMoveCapture(
    gameId: UInt64,
    newField: CheckersField,
    x: UInt64,
    y: UInt64,
    moveType: UInt64,
    proposedIsKing: Bool,
  ): void {
    const sessionSender = this.sessions.get(this.transaction.sender.value);
    const sender = Provable.if(
      sessionSender.isSome,
      sessionSender.value,
      this.transaction.sender.value,
    );

    const gameOption = this.games.get(gameId);
    const game = gameOption.value;

    const moveFromX = x;
    const moveFromY = y;

    const firstPlayerMove = Provable.if(
      Bool.or(
        moveType.equals(CAPTURE_KING_BOTTOM_LEFT),
        moveType.equals(CAPTURE_KING_BOTTOM_RIGHT),
      ),
      game.player1.equals(game.currentMoveUser).not(),
      game.player1.equals(game.currentMoveUser),
    );

    assert(
      moveType
        .equals(CAPTURE_TOP_LEFT)
        .not()
        .or(moveFromX.greaterThan(UInt64.zero)),
    );
    assert(
      moveType
        .equals(CAPTURE_TOP_RIGHT)
        .not()
        .or(moveFromX.lessThan(UInt64.from(CHECKERS_FIELD_SIZE))),
    );
    assert(firstPlayerMove.or(moveFromY.greaterThan(UInt64.zero)));
    assert(
      firstPlayerMove
        .not()
        .or(moveFromY.lessThan(UInt64.from(CHECKERS_FIELD_SIZE))),
    );

    const { capturedCellX, capturedCellY, moveToX, moveToY } =
      this.getCaptureCells(moveType, firstPlayerMove, moveFromX, moveFromY);

    const nextLeftCaptureCandidateCell = this.getCaptureCells(
      CAPTURE_TOP_LEFT,
      firstPlayerMove,
      moveToX,
      moveToY,
    );

    const nextRightCaptureCandidateCell = this.getCaptureCells(
      CAPTURE_TOP_RIGHT,
      firstPlayerMove,
      moveToX,
      moveToY,
    );

    Provable.asProver(() => {
      if (gameOption.isSome.toBoolean()) {
        console.log(
          'Next left cell capture candidate',
          nextLeftCaptureCandidateCell.capturedCellX.toBigInt(),
          nextLeftCaptureCandidateCell.capturedCellY.toBigInt(),
          nextLeftCaptureCandidateCell.moveToX.toBigInt(),
          nextLeftCaptureCandidateCell.moveToY.toBigInt(),
          'Next right cell capture candidate',
          nextRightCaptureCandidateCell.capturedCellX.toBigInt(),
          nextRightCaptureCandidateCell.capturedCellY.toBigInt(),
          nextRightCaptureCandidateCell.moveToX.toBigInt(),
          nextRightCaptureCandidateCell.moveToY.toBigInt(),
          'Is first user',
          firstPlayerMove.toBoolean(),
          'Move from',
          moveFromX.toBigInt(),
          moveFromY.toBigInt(),
          'Move capture',
          capturedCellX.toBigInt(),
          capturedCellX.toBigInt(),
          'Move to',
          moveToX.toBigInt(),
          moveToY.toBigInt(),
        );
      }
    });

    const isKing = Provable.if(
      firstPlayerMove,
      moveToY.equals(UInt64.from(CHECKERS_FIELD_SIZE - 1)),
      moveToY.equals(UInt64.from(0)),
    );

    Provable.asProver(() => {
      if (gameOption.isSome) {
        console.log(
          'Is king',
          isKing,
          moveToY,
          Provable.if(
            firstPlayerMove,
            UInt64.from(CHECKERS_FIELD_SIZE - 1),
            UInt64.from(0),
          ).toBigInt(),
        );
      }
    });

    assert(gameOption.isSome, 'Invalid game id');
    assert(game.currentMoveUser.equals(sender), `Not your move`);
    assert(game.winner.equals(PublicKey.empty()), `Game finished`);
    assert(moveType.lessThanOrEqual(UInt64.from(7)), 'Invalid game type');

    const winProposed = Bool(false);

    let canCaptureNextLeft1 = Bool(false);
    let canCaptureNextLeft2 = Bool(false);

    let canCaptureNextRight1 = Bool(false);
    let canCaptureNextRight2 = Bool(false);

    const currentUserId = Provable.if(
      game.currentMoveUser.equals(game.player1),
      UInt32.from(1),
      UInt32.from(2),
    );
    const opponentUserId = Provable.if(
      game.currentMoveUser.equals(game.player1),
      UInt32.from(2),
      UInt32.from(1),
    );

    for (let i = 0; i < CHECKERS_FIELD_SIZE; i++) {
      for (let j = 0; j < CHECKERS_FIELD_SIZE; j++) {
        const isMoveFromCell = Bool.and(
          UInt64.from(i).equals(moveFromX),
          UInt64.from(j).equals(moveFromY),
        );

        const isCapturedCell = Bool.and(
          UInt64.from(i).equals(capturedCellX),
          UInt64.from(j).equals(capturedCellY),
        );

        const isMoveToCell = Bool.and(
          UInt64.from(i).equals(moveToX),
          UInt64.from(j).equals(moveToY),
        );

        const isNextLeftCaptureCell = Bool.and(
          UInt64.from(i).equals(nextLeftCaptureCandidateCell.capturedCellX),
          UInt64.from(j).equals(nextLeftCaptureCandidateCell.capturedCellY),
        );

        const isNextLeftMoveToCell = Bool.and(
          UInt64.from(i).equals(nextLeftCaptureCandidateCell.moveToX),
          UInt64.from(j).equals(nextLeftCaptureCandidateCell.moveToY),
        );

        canCaptureNextLeft1 = Bool.or(
          canCaptureNextLeft1,
          isNextLeftCaptureCell.and(
            game.field.value[i][j].equals(opponentUserId),
          ),
        );
        canCaptureNextLeft2 = Bool.or(
          canCaptureNextLeft2,
          isNextLeftMoveToCell.and(game.field.value[i][j].equals(UInt32.zero)),
        );

        //

        const isNextRightCaptureCell = Bool.and(
          UInt64.from(i).equals(nextRightCaptureCandidateCell.capturedCellX),
          UInt64.from(j).equals(nextRightCaptureCandidateCell.capturedCellY),
        );

        const isNextRightMoveToCell = Bool.and(
          UInt64.from(i).equals(nextRightCaptureCandidateCell.moveToX),
          UInt64.from(j).equals(nextRightCaptureCandidateCell.moveToY),
        );

        canCaptureNextRight1 = Bool.or(
          canCaptureNextRight1,
          isNextRightCaptureCell.and(
            game.field.value[i][j].equals(opponentUserId),
          ),
        );
        canCaptureNextRight2 = Bool.or(
          canCaptureNextRight2,
          isNextRightMoveToCell.and(game.field.value[i][j].equals(UInt32.zero)),
        );

        const isNotChanged = isMoveFromCell
          .not()
          .and(isMoveToCell.not())
          .and(isCapturedCell.not());

        const cellEquals = isNotChanged.and(
          game.field.value[i][j].equals(newField.value[i][j]),
        );
        const moveFromEquals = isMoveFromCell.and(
          newField.value[i][j].equals(UInt32.zero),
        );
        const capturedCellEquals = isCapturedCell.and(
          newField.value[i][j].equals(UInt32.zero),
        );

        assert(
          moveFromEquals
            .not()
            .or(
              proposedIsKing
                .not()
                .or(game.field.value[i][j].greaterThan(UInt32.from(2))),
            ),
          'King proposed incorrectly',
        );

        const moveToEquals = isMoveToCell.and(
          newField.value[i][j].equals(
            Provable.if(
              isKing.or(proposedIsKing),
              currentUserId.add(2),
              currentUserId,
            ),
          ),
        );

        // Check that player owns moved figure
        assert(
          moveFromEquals
            .not()
            .or(
              game.field.value[i][j]
                .equals(currentUserId)
                .or(game.field.value[i][j].equals(currentUserId.add(2))),
            ),
          'ERR5',
        );

        // Check that on captured position opponent's figure located
        assert(
          capturedCellEquals
            .not()
            .or(Bool.or(game.field.value[i][j].equals(opponentUserId), game.field.value[i][j].equals(opponentUserId.add(2)))),
          'ERR6',
        );

        // Check that on new spot no figures located
        assert(
          moveToEquals.not().or(game.field.value[i][j].equals(UInt32.zero)),
        );

        // Check that either
        // 1) Cell is not changed
        // 2) Figure moved from that cell
        // 3) Figure is captured in that cell
        // 4) Figure moved to that cell
        assert(
          cellEquals.or(moveFromEquals).or(capturedCellEquals).or(moveToEquals),
        );

        Provable.asProver(() => {
          if (
            gameOption.isSome
              .and(
                cellEquals
                  .or(moveFromEquals)
                  .or(moveToEquals)
                  .or(capturedCellEquals)
                  .not(),
              )
              .toBoolean()
          ) {
            console.log(isMoveFromCell.toString());
            console.log(isMoveToCell.toString());
            console.log(
              game.field.value[i][j].equals(newField.value[i][j]).toString(),
            );

            console.log(`[${i}: ${j}]`);
            console.log(
              `${game.field.value[i][j].toString()} != ${newField.value[i][
                j
              ].toString()}`,
            );
          }
        });
      }
    }

    Provable.asProver(() => {
      console.log(
        'Can capture next left',
        canCaptureNextLeft1.toBoolean(),
        canCaptureNextLeft2.toBoolean(),
        'Can capture next right',
        canCaptureNextRight1.toBoolean(),
        canCaptureNextRight2.toBoolean(),
      );
    });

    Provable.log('AAAAAAAA');

    game.winner = Provable.if(
      winProposed,
      game.currentMoveUser,
      PublicKey.empty(),
    );

    const winnerShare = ProtoUInt64.from(
      Provable.if(winProposed, UInt64.from(1), UInt64.from(0)),
    );

    this.acquireFunds(
      gameId,
      game.winner,
      PublicKey.empty(),
      winnerShare,
      ProtoUInt64.from(0),
      ProtoUInt64.from(1),
    );

    game.field = newField;
    game.currentMoveUser = Provable.if(
      Bool.or(
        canCaptureNextLeft1.and(canCaptureNextLeft2),
        canCaptureNextRight1.and(canCaptureNextRight2),
      ),
      game.currentMoveUser,
      Provable.if(
        game.currentMoveUser.equals(game.player1),
        game.player2,
        game.player1,
      ),
    );
    game.lastMoveBlockHeight = this.network.block.height;
    this.games.set(gameId, game);

    // Removing active game for players if game ended
    this.activeGameId.set(
      Provable.if(winProposed, game.player2, PublicKey.empty()),
      UInt64.from(0),
    );
    this.activeGameId.set(
      Provable.if(winProposed, game.player1, PublicKey.empty()),
      UInt64.from(0),
    );
  }
}

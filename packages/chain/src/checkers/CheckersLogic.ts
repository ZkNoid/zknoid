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
    super.proveOpponentTimeout(gameId, true);
  }

  @runtimeMethod()
  public makeMove(
    gameId: UInt64,
    newField: CheckersField,
    x: UInt64,
    y: UInt64,
    moveType: UInt64,
  ): void {
    const sessionSender = this.sessions.get(this.transaction.sender.value);
    const sender = Provable.if(
      sessionSender.isSome,
      sessionSender.value,
      this.transaction.sender.value,
    );

    const moveFromX = x;
    const moveFromY = y;

    let moveToX;
    let moveToY;

    let figureToEatX: Option<UInt64> = Option.from(
      Bool(false),
      UInt64.from(0),
      UInt64,
    );
    let figureToEatY: Option<UInt64> = Option.from(
      Bool(false),
      UInt64.from(0),
      UInt64,
    );

    let captureProposed;

    // if (moveType.equals(MOVE_TOP_LEFT)) {
    //   moveToX = x.sub(1);
    //   moveToY = y.add(1);
    //   captureProposed = Bool(false);
    // } else if (moveType.equals(MOVE_TOP_RIGHT)) {
    //   moveToX = x.add(1);
    //   moveToY = y.add(1);
    //   captureProposed = Bool(false);
    // } else if (moveType.equals(CAPTURE_TOP_RIGHT)) {
    //   moveToX = x.sub(2);
    //   moveToY = x.add(2);
    //   captureProposed = Bool(true);
    // } else {
    //   moveToX = x.add(2);
    //   moveToY = x.add(2);
    //   captureProposed = Bool(true);
    // }

    const game = this.games.get(gameId);
    assert(game.isSome, 'Invalid game id');
    assert(game.value.currentMoveUser.equals(sender), `Not your move`);
    assert(game.value.winner.equals(PublicKey.empty()), `Game finished`);
    assert(moveType.lessThanOrEqual(UInt64.from(5)), 'Invalid game type');

    const winProposed = Bool(false);

    const currentUserId = Provable.if(
      game.value.currentMoveUser.equals(game.value.player1),
      UInt32.from(1),
      UInt32.from(2),
    );

    const addedCellsNum = UInt64.from(0);

    for (let i = 0; i < CHECKERS_FIELD_SIZE; i++) {
      for (let j = 0; j < CHECKERS_FIELD_SIZE; j++) {
        const isMoveFromCell = Bool.and(
          UInt64.from(i).equals(moveFromX),
          UInt64.from(j).equals(moveFromY),
        );
        if (j < CHECKERS_FIELD_SIZE - 1 && i < CHECKERS_FIELD_SIZE - 1) {
          Provable.log(
            moveType.equals(UInt64.from(MOVE_TOP_RIGHT)).not(),
            isMoveFromCell.not(),
          );

          const targetValue = Provable.if(
            game.value.player1.equals(game.value.currentMoveUser), 
            UInt32, 
            game.value.field.value[i + 1][j - 1], 
            game.value.field.value[i + 1][j + 1]
          )

          Provable.log(
            moveType,
            game.value.field.value[i][j].equals(currentUserId),
            targetValue.equals(UInt32.from(0)),
            newField.value[i][j].equals(UInt32.from(0)),
            targetValue.equals(currentUserId),
          );
          assert(
            Bool.or(
              Bool.or(
                moveType.equals(UInt64.from(MOVE_TOP_RIGHT)).not(),
                isMoveFromCell.not(),
              ), // Skip condition
              Bool.and(
                game.value.field.value[i][j].equals(currentUserId),
                Bool.and(
                  game.value.field.value[i + 1][j + 1].equals(UInt32.from(0)),
                  Bool.and(
                    newField.value[i][j].equals(UInt32.from(0)),
                    targetValue.equals(currentUserId),
                  ),
                ),
              ),
            ),
          );
        }
        if (i > 0 && j < CHECKERS_FIELD_SIZE - 1) {
          const targetValue = Provable.if(
            game.value.player1.equals(game.value.currentMoveUser), 
            UInt32, game.value.field.value[i - 1][j - 1], game.value.field.value[i - 1][j + 1]
          )

          assert(
            Bool.or(
              Bool.or(
                moveType.equals(UInt64.from(MOVE_TOP_LEFT)).not(),
                isMoveFromCell.not(),
              ), // Skip condition
              Bool.and(
                game.value.field.value[i][j].equals(currentUserId),
                Bool.and(
                  targetValue.equals(UInt32.from(0)),
                  Bool.and(
                    newField.value[i][j].equals(UInt32.from(0)),
                    targetValue.equals(currentUserId),
                  ),
                ),
              ),
            ),
          );
        }
      }
    }

    Provable.log('AAAAAAAA');

    game.value.winner = Provable.if(
      winProposed,
      game.value.currentMoveUser,
      PublicKey.empty(),
    );

    const winnerShare = ProtoUInt64.from(
      Provable.if(winProposed, UInt64.from(1), UInt64.from(0)),
    );

    this.acquireFunds(
      gameId,
      game.value.winner,
      PublicKey.empty(),
      winnerShare,
      ProtoUInt64.from(0),
      ProtoUInt64.from(1),
    );

    game.value.field = newField;
    game.value.currentMoveUser = Provable.if(
      game.value.currentMoveUser.equals(game.value.player1),
      game.value.player2,
      game.value.player1,
    );
    game.value.lastMoveBlockHeight = this.network.block.height;
    this.games.set(gameId, game.value);

    // Removing active game for players if game ended
    this.activeGameId.set(
      Provable.if(winProposed, game.value.player2, PublicKey.empty()),
      UInt64.from(0),
    );
    this.activeGameId.set(
      Provable.if(winProposed, game.value.player1, PublicKey.empty()),
      UInt64.from(0),
    );
  }
}

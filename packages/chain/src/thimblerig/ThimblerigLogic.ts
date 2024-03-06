import { state, runtimeMethod, runtimeModule } from "@proto-kit/module";
import type { Option } from "@proto-kit/protocol";
import { State, StateMap, assert } from "@proto-kit/protocol";
import {
  PublicKey,
  Struct,
  UInt64,
  Provable,
  Bool,
  Field,
  Poseidon,
} from "o1js";
import { MatchMaker } from "../engine/MatchMaker";
import type { QueueListItem } from "../engine/MatchMaker";

const BLOCK_PRODUCTION_SECONDS = 5;
const MOVE_TIMEOUT_IN_BLOCKS = 60 / BLOCK_PRODUCTION_SECONDS;

export class ThimblerigField extends Struct({
  commitedHash: Field,
  choice: UInt64,
}) {}

export class GameInfo extends Struct({
  player1: PublicKey,
  player2: PublicKey,
  currentMoveUser: PublicKey,
  lastMoveBlockHeight: UInt64,
  thimblerigField: ThimblerigField,
  winner: PublicKey,
}) {}

@runtimeModule()
export class ThimblerigLogic extends MatchMaker {
  // Game ids start from 1
  @state() public games = StateMap.from<UInt64, GameInfo>(UInt64, GameInfo);

  @state() public gamesNum = State.from<UInt64>(UInt64);

  public override initGame(
    opponentReady: Bool,
    opponent: Option<QueueListItem>
  ): UInt64 {
    const currentGameId = this.gamesNum
      .get()
      .orElse(UInt64.from(0))
      .add(UInt64.from(1));
    // Setting active game if opponent found
    this.games.set(
      Provable.if(opponentReady, currentGameId, UInt64.from(0)),
      new GameInfo({
        player1: this.transaction.sender,
        player2: opponent.value.userAddress,
        currentMoveUser: this.transaction.sender,
        lastMoveBlockHeight: this.network.block.height,
        thimblerigField: new ThimblerigField({
          choice: UInt64.from(0),
          commitedHash: Field.from(0),
        }),
        winner: PublicKey.empty(),
      })
    );

    this.gamesNum.set(currentGameId);

    return currentGameId;
  }

  @runtimeMethod()
  public commitValue(gameId: UInt64, commitmentHash: Field): void {
    const sessionSender = this.sessions.get(this.transaction.sender);
    const sender = Provable.if(
      sessionSender.isSome,
      sessionSender.value,
      this.transaction.sender
    );

    const game = this.games.get(gameId);
    assert(game.isSome, "Invalid game id");
    assert(commitmentHash.greaterThan(0), "Invalid commitment");
    assert(game.value.thimblerigField.choice.equals(UInt64.from(0)), "Already chosen");
    assert(game.value.thimblerigField.commitedHash.equals(0), "Already commited");
    assert(
      game.value.player1.equals(sender),
      `Only player1 should commit value`
    );
    assert(game.value.winner.equals(PublicKey.empty()), `Game finished`);

    game.value.thimblerigField.commitedHash = commitmentHash;
    game.value.currentMoveUser = game.value.player2;
    game.value.lastMoveBlockHeight = this.network.block.height;
    this.games.set(gameId, game.value);
  }

  @runtimeMethod()
  public chooseThumble(gameId: UInt64, choice: UInt64): void {
    const sessionSender = this.sessions.get(this.transaction.sender);
    const sender = Provable.if(
      sessionSender.isSome,
      sessionSender.value,
      this.transaction.sender
    );

    const game = this.games.get(gameId);
    assert(game.isSome, "Invalid game id");
    assert(
      Bool.and(
        choice.greaterThanOrEqual(UInt64.from(1)),
        choice.lessThanOrEqual(UInt64.from(3))
      ),
      "Invalid choice"
    );
    assert(game.value.thimblerigField.choice.equals(UInt64.from(0)), "Already chosen");
    assert(game.value.thimblerigField.commitedHash.greaterThan(0), "Not commited");
    assert(
      game.value.player2.equals(sender),
      `Only player2 should make choice`
    );
    assert(game.value.winner.equals(PublicKey.empty()), `Game finished`);

    game.value.thimblerigField.choice = choice;
    game.value.currentMoveUser = game.value.player1;
    game.value.lastMoveBlockHeight = this.network.block.height;
    this.games.set(gameId, game.value);
  }

  @runtimeMethod()
  public revealCommitment(gameId: UInt64, commitmentValue: Field): void {
    const sessionSender = this.sessions.get(this.transaction.sender);
    const sender = Provable.if(
      sessionSender.isSome,
      sessionSender.value,
      this.transaction.sender
    );

    const game = this.games.get(gameId);
    assert(game.isSome, "Invalid game id");
    assert(commitmentValue.greaterThan(0), "Invalid commitment");
    assert(game.value.thimblerigField.choice.equals(UInt64.from(0)), "Already chosen");
    assert(game.value.thimblerigField.commitedHash.equals(0), "Already commited");
    assert(
      game.value.player1.equals(sender),
      `Only player1 should reveal value`
    );
    assert(game.value.winner.equals(PublicKey.empty()), `Game finished`);

    Poseidon.hash([commitmentValue]).assertEquals(
      game.value.thimblerigField.commitedHash,
      "Incorrect reveal"
    );
    game.value.thimblerigField.commitedHash = commitmentValue;
    game.value.currentMoveUser = game.value.player2;
    game.value.lastMoveBlockHeight = this.network.block.height;
    game.value.winner = Provable.if(
      UInt64.from(commitmentValue)
        .mod(UInt64.from(3))
        .equals(game.value.thimblerigField.choice),
      game.value.player1,
      game.value.player2
    );

    this.games.set(gameId, game.value);
  }

  @runtimeMethod()
  public proveCommitNotRevealed(gameId: UInt64): void {
    const sessionSender = this.sessions.get(this.transaction.sender);
    const sender = Provable.if(
      sessionSender.isSome,
      sessionSender.value,
      this.transaction.sender
    );

    const game = this.games.get(gameId);
    assert(game.isSome, "Invalid game id");
    assert(game.value.thimblerigField.choice.equals(UInt64.from(0)), "Already chosen");
    assert(game.value.thimblerigField.commitedHash.equals(0), "Already commited");
    assert(
      game.value.player1.equals(sender),
      `Only player1 should prove value is not revealed`
    );
  }
}

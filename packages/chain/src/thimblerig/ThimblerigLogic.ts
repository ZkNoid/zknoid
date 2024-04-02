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
import { UInt64 as ProtoUInt64 } from '@proto-kit/library';

import { MatchMaker } from "../engine/MatchMaker";

export class RoundIdxUser extends Struct({
  roundId: UInt64,
  userAddress: PublicKey,
}) {}

export class RoundIdxIndex extends Struct({
  roundId: UInt64,
  index: UInt64,
}) {}

export class AddressxAddress extends Struct({
  user1: PublicKey,
  user2: PublicKey,
}) {}

export class QueueListItem extends Struct({
  userAddress: PublicKey,
  registrationTimestamp: UInt64,
}) {}

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
  field: ThimblerigField,
  winner: PublicKey,
}) {}

@runtimeModule()
export class ThimblerigLogic extends MatchMaker {
  // Game ids start from 1
  @state() public games = StateMap.from<UInt64, GameInfo>(UInt64, GameInfo);

  @state() public gamesNum = State.from<UInt64>(UInt64);

  public override initGame(
    opponentReady: Bool,
    player: PublicKey,
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
        player1: this.transaction.sender.value,
        player2: opponent.value.userAddress,
        currentMoveUser: this.transaction.sender.value,
        lastMoveBlockHeight: this.network.block.height,
        field: new ThimblerigField({
          choice: UInt64.from(0),
          commitedHash: Field.from(0),
        }),
        winner: PublicKey.empty(),
      })
    );

    this.gamesNum.set(currentGameId);
    this.gameFund.set(currentGameId, this.getParticipationPrice().mul(2));

    super.initGame(opponentReady, player, opponent);

    return currentGameId;
  }

  @runtimeMethod()
  public commitValue(gameId: UInt64, commitment: Field): void {
    const sessionSender = this.sessions.get(this.transaction.sender.value);
    const sender = Provable.if(
      sessionSender.isSome,
      sessionSender.value,
      this.transaction.sender.value
    );

    const game = this.games.get(gameId);
    assert(game.isSome, "Invalid game id");
    assert(
      game.value.field.choice.equals(UInt64.from(0)),
      "Already chosen"
    );
    assert(
      game.value.field.commitedHash.equals(0),
      "Already commited"
    );
    assert(
      game.value.player1.equals(sender),
      `Only player1 should commit value`
    );
    assert(game.value.winner.equals(PublicKey.empty()), `Game finished`);

    game.value.field.commitedHash = commitment;
    game.value.currentMoveUser = game.value.player2;
    game.value.lastMoveBlockHeight = this.network.block.height;
    this.games.set(gameId, game.value);
  }

  @runtimeMethod()
  public chooseThumble(gameId: UInt64, choice: UInt64): void {
    const sessionSender = this.sessions.get(this.transaction.sender.value);
    const sender = Provable.if(
      sessionSender.isSome,
      sessionSender.value,
      this.transaction.sender.value
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
    assert(
      game.value.field.choice.equals(UInt64.from(0)),
      "Already chosen"
    );
    assert(
      game.value.field.commitedHash.greaterThan(0),
      "Not commited"
    );
    assert(
      game.value.player2.equals(sender),
      `Only player2 should make choice`
    );
    assert(game.value.winner.equals(PublicKey.empty()), `Game finished`);

    game.value.field.choice = choice;
    game.value.currentMoveUser = game.value.player1;
    game.value.lastMoveBlockHeight = this.network.block.height;
    this.games.set(gameId, game.value);
  }

  @runtimeMethod()
  public revealCommitment(gameId: UInt64, value: UInt64, salt: Field): void {
    const sessionSender = this.sessions.get(this.transaction.sender.value);
    const sender = Provable.if(
      sessionSender.isSome,
      sessionSender.value,
      this.transaction.sender.value
    );

    const game = this.games.get(gameId);
    assert(game.isSome, "Invalid game id");
    assert(
      game.value.field.choice.greaterThan(UInt64.from(0)),
      "Not chosen"
    );
    assert(
      game.value.field.commitedHash.greaterThan(0),
      "Not commited"
    );
    assert(
      game.value.player1.equals(sender),
      `Only player1 should reveal value`
    );
    assert(game.value.winner.equals(PublicKey.empty()), `Game finished`);
    assert(
      Poseidon.hash([...value.toFields(), salt]).equals(
        game.value.field.commitedHash
      ),
      "Incorrect reveal"
    );
    assert(value.lessThanOrEqual(UInt64.from(3)), "Invalid value");
    assert(salt.greaterThan(0), "Invalid salt");

    game.value.currentMoveUser = game.value.player2;
    game.value.lastMoveBlockHeight = this.network.block.height;
    game.value.winner = Provable.if(
      value.add(1).equals(game.value.field.choice),
      game.value.player2,
      game.value.player1
    );

    this.games.set(gameId, game.value);

    this.activeGameId.set(game.value.player2, UInt64.from(0));
    this.activeGameId.set(game.value.player1, UInt64.from(0));
  }

  @runtimeMethod()
  public proveCommitNotRevealed(gameId: UInt64): void {
    const sessionSender = this.sessions.get(this.transaction.sender.value);
    const sender = Provable.if(
      sessionSender.isSome,
      sessionSender.value,
      this.transaction.sender.value
    );

    const game = this.games.get(gameId);
    assert(game.isSome, "Invalid game id");
    assert(
      game.value.field.choice.equals(UInt64.from(0)),
      "Already chosen"
    );
    assert(
      game.value.field.commitedHash.equals(0),
      "Already commited"
    );
    assert(
      game.value.player1.equals(sender),
      `Only player1 should prove value is not revealed`
    );
  }

  @runtimeMethod()
  public win(gameId: UInt64): void {
    let game = this.games.get(gameId).value;
    assert(game.winner.equals(PublicKey.empty()).not());
    const looser = Provable.if(game.winner.equals(game.player1), game.player2, game.player1);
    this.getFunds(gameId, game.winner, looser, ProtoUInt64.from(2), ProtoUInt64.from(1));
  }
}

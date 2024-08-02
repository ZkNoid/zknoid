import { state, runtimeMethod, runtimeModule } from '@proto-kit/module';
import type { Option } from '@proto-kit/protocol';
import { State, StateMap, assert } from '@proto-kit/protocol';
import {
  PublicKey,
  Struct,
  UInt64,
  Provable,
  Bool,
  Field,
  Poseidon,
} from 'o1js';
import { UInt64 as ProtoUInt64 } from '@proto-kit/library';

import { MatchMaker } from '../engine/MatchMaker';
import { Lobby } from '../engine/LobbyManager';

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
  salt: Field,
  value: UInt64,
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

  public override async initGame(lobby: Lobby, shouldUpdate: Bool): Promise<UInt64> {
    const currentGameId = lobby.id;

    // Setting active game if opponent found
    await this.games.set(
      Provable.if(shouldUpdate, currentGameId, UInt64.from(0)),
      new GameInfo({
        player1: lobby.players[0],
        player2: lobby.players[1],
        currentMoveUser: lobby.players[0],
        lastMoveBlockHeight: this.network.block.height,
        field: new ThimblerigField({
          choice: UInt64.from(0),
          commitedHash: Field.from(0),
          salt: Field.from(0),
          value: UInt64.from(0),
        }),
        winner: PublicKey.empty(),
      }),
    );

    await this.gameFund.set(
      currentGameId,
      ProtoUInt64.from(lobby.participationFee).mul(2),
    );

    return await super.initGame(lobby, shouldUpdate);
  }

  @runtimeMethod()
  public async commitValue(gameId: UInt64, commitment: Field): Promise<void> {
    const sessionSender = await this.sessions.get(this.transaction.sender.value);
    const sender = Provable.if(
      sessionSender.isSome,
      sessionSender.value,
      this.transaction.sender.value,
    );

    const game = await this.games.get(gameId);
    assert(game.isSome, 'Invalid game id');
    assert(game.value.field.choice.equals(UInt64.from(0)), 'Already chosen');
    assert(game.value.field.commitedHash.equals(0), 'Already commited');
    assert(
      game.value.player1.equals(sender),
      `Only player1 should commit value`,
    );
    assert(game.value.winner.equals(PublicKey.empty()), `Game finished`);

    game.value.field.commitedHash = commitment;
    game.value.currentMoveUser = game.value.player2;
    game.value.lastMoveBlockHeight = this.network.block.height;
    await this.games.set(gameId, game.value);
  }

  @runtimeMethod()
  public async chooseThumble(gameId: UInt64, choice: UInt64): Promise<void> {
    const sessionSender = await this.sessions.get(this.transaction.sender.value);
    const sender = Provable.if(
      sessionSender.isSome,
      sessionSender.value,
      this.transaction.sender.value,
    );

    const game = await this.games.get(gameId);
    assert(game.isSome, 'Invalid game id');
    assert(
      Bool.and(
        choice.greaterThanOrEqual(UInt64.from(1)),
        choice.lessThanOrEqual(UInt64.from(3)),
      ),
      'Invalid choice',
    );
    assert(game.value.field.choice.equals(UInt64.from(0)), 'Already chosen');
    assert(game.value.field.commitedHash.greaterThan(0), 'Not commited');
    assert(
      game.value.player2.equals(sender),
      `Only player2 should make choice`,
    );
    assert(game.value.winner.equals(PublicKey.empty()), `Game finished`);

    game.value.field.choice = choice;
    game.value.currentMoveUser = game.value.player1;
    game.value.lastMoveBlockHeight = this.network.block.height;
    await this.games.set(gameId, game.value);
  }

  @runtimeMethod()
  public async revealCommitment(gameId: UInt64, value: UInt64, salt: Field): Promise<void> {
    const sessionSender = await this.sessions.get(this.transaction.sender.value);
    const sender = Provable.if(
      sessionSender.isSome,
      sessionSender.value,
      this.transaction.sender.value,
    );

    const game = await this.games.get(gameId);
    assert(game.isSome, 'Invalid game id');
    assert(game.value.field.choice.greaterThan(UInt64.from(0)), 'Not chosen');
    assert(game.value.field.commitedHash.greaterThan(0), 'Not commited');
    assert(
      game.value.player1.equals(sender),
      `Only player1 should reveal value`,
    );
    assert(game.value.winner.equals(PublicKey.empty()), `Game finished`);
    assert(
      Poseidon.hash([...value.toFields(), salt]).equals(
        game.value.field.commitedHash,
      ),
      'Incorrect reveal',
    );
    assert(value.lessThanOrEqual(UInt64.from(3)), 'Invalid value');
    assert(salt.greaterThan(0), 'Invalid salt');

    game.value.currentMoveUser = game.value.player2;
    game.value.lastMoveBlockHeight = this.network.block.height;
    game.value.winner = Provable.if(
      value.equals(game.value.field.choice),
      game.value.player2,
      game.value.player1,
    );
    const looser = Provable.if(
      game.value.winner.equals(game.value.player1),
      game.value.player2,
      game.value.player1,
    );

    const hiderWins = game.value.winner.equals(game.value.player1);

    /*
      If hider wins he get 3/4 of bank. Looser gets 1/4 of bank.
      If hider lost he gets nothing, and winner gets all.
      In such case hider win expected value equals 0.
    */
    const winnerPortion = Provable.if<ProtoUInt64>(
      hiderWins,
      ProtoUInt64,
      ProtoUInt64.from(3),
      ProtoUInt64.from(4),
    );
    const looserPortion = Provable.if<ProtoUInt64>(
      hiderWins,
      ProtoUInt64,
      ProtoUInt64.from(1),
      ProtoUInt64.from(0),
    );

    await this.acquireFunds(
      gameId,
      game.value.winner,
      looser,
      ProtoUInt64.from(winnerPortion),
      ProtoUInt64.from(looserPortion),
      ProtoUInt64.from(winnerPortion.add(looserPortion)),
    );

    game.value.field.salt = salt;
    game.value.field.value = value;

    await this.games.set(gameId, game.value);

    await this.activeGameId.set(game.value.player2, UInt64.from(0));
    await this.activeGameId.set(game.value.player1, UInt64.from(0));

    await this._onLobbyEnd(gameId, Bool(true));
  }

  @runtimeMethod()
  public async proveCommitNotRevealed(gameId: UInt64): Promise<void> {
    await super.proveOpponentTimeout(gameId, false);
    const game = await this.games.get(gameId);
    await this.acquireFunds(
      gameId,
      game.value.winner,
      PublicKey.empty(),
      ProtoUInt64.from(1),
      ProtoUInt64.from(0),
      ProtoUInt64.from(1),
    );

    await this._onLobbyEnd(gameId, Bool(true));
  }
}

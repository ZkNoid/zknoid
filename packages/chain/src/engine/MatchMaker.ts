import {
  RuntimeModule,
  runtimeModule,
  state,
  runtimeMethod,
} from '@proto-kit/module';
import type { Option } from '@proto-kit/protocol';
import { Balances, UInt64 as ProtoUInt64 } from '@proto-kit/library';
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
import { inject } from 'tsyringe';
import { ZNAKE_TOKEN_ID } from '../constants';
import { Lobby, LobbyManager } from './LobbyManager';

interface MatchMakerConfig {}

export const DEFAULT_GAME_COST = ProtoUInt64.from(10 ** 9);

export const PENDING_BLOCKS_NUM_CONST = 20;

const BLOCK_PRODUCTION_SECONDS = 5;
export const MOVE_TIMEOUT_IN_BLOCKS = 60 / BLOCK_PRODUCTION_SECONDS;

const PENDING_BLOCKS_NUM = UInt64.from(PENDING_BLOCKS_NUM_CONST);

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

// abstract class

@runtimeModule()
export class MatchMaker extends LobbyManager {
  // Round => pending lobby
  @state() public pendingLobby = StateMap.from<UInt64, Lobby>(UInt64, Lobby);

  // Session => user
  @state() public sessions = StateMap.from<PublicKey, PublicKey>(
    PublicKey,
    PublicKey,
  );
  // mapping(roundId => mapping(registered user address => bool))
  @state() public queueRegisteredRoundUsers = StateMap.from<RoundIdxUser, Bool>(
    RoundIdxUser,
    Bool,
  );
  // mapping(roundId => SessionKey[])
  @state() public queueRoundUsersList = StateMap.from<
    RoundIdxIndex,
    QueueListItem
  >(RoundIdxIndex, QueueListItem);
  @state() public queueLength = StateMap.from<UInt64, UInt64>(UInt64, UInt64);

  // Game ids start from 1
  // abstract games: StateMap<UInt64, any>;
  @state() public games = StateMap.from<UInt64, any>(UInt64, UInt64);

  @state() public gamesNum = State.from<UInt64>(UInt64);

  @runtimeMethod()
  public register(sessionKey: PublicKey, timestamp: UInt64): void {
    const sender = this.transaction.sender.value;
    // If player in game – revert
    assert(
      this.activeGameId
        .get(sender)
        .orElse(UInt64.from(0))
        .equals(UInt64.from(0)),
      'Player already in game',
    );

    this.sessions.set(sessionKey, sender);
    const roundId = this.network.block.height.div(PENDING_BLOCKS_NUM);

    // Join lobby
    let lobby = this.joinPendingLobby(roundId);

    // If lobby is full - run game
    const lobbyReady = lobby.isFull();

    lobby = this.flushPendingLobby(lobby.id, lobbyReady);

    const gameId = this.initGame(lobby, lobbyReady);

    // Array call
    // Assigning new game to player if opponent found
    this.activeGameId.set(
      sender,
      Provable.if(lobbyReady, gameId, UInt64.from(0)),
    );
  }

  private joinPendingLobby(lobbyId: UInt64): Lobby {
    const lobby = this.pendingLobby.get(lobbyId).orElse(Lobby.default(lobbyId));
    this._joinLobby(lobby);
    this.pendingLobby.set(lobbyId, lobby);
    return lobby;
  }

  // Transform pending lobby to active lobby
  // Returns activeLobby
  private flushPendingLobby(pendingLobyId: UInt64, shouldFlush: Bool): Lobby {
    let lobby = this.pendingLobby.get(pendingLobyId).value;

    let activeLobby = this._addLobby(lobby, shouldFlush);

    this.pendingLobby.set(
      pendingLobyId,
      Provable.if(
        shouldFlush,
        Lobby,
        Lobby.default(pendingLobyId),
        lobby,
      ) as Lobby,
    );

    return activeLobby;
  }

  /**
   * Registers user in session queue
   *
   * @param sessionKey - Key of user background session
   * @param timestamp - Current user timestamp from front-end
   */
  /*
  @runtimeMethod()
  public register(sessionKey: PublicKey, timestamp: UInt64): void {
    // If player in game – revert
    assert(
      this.activeGameId
        .get(this.transaction.sender.value)
        .orElse(UInt64.from(0))
        .equals(UInt64.from(0)),
      'Player already in game',
    );

    // Registering player session key
    this.sessions.set(sessionKey, this.transaction.sender.value);
    const roundId = this.network.block.height.div(PENDING_BLOCKS_NUM);

    // User can't re-register in round queue if already registered
    assert(
      this.queueRegisteredRoundUsers
        .get(
          new RoundIdxUser({
            roundId,
            userAddress: this.transaction.sender.value,
          }),
        )
        .isSome.not(),
      'User already in queue',
    );

    /// Call lobby add
    const queueLength = this.queueLength.get(roundId).orElse(UInt64.from(0));

    const opponentReady = queueLength.greaterThan(UInt64.from(0));
    const opponent = this.queueRoundUsersList.get(
      new RoundIdxIndex({
        roundId,
        index: queueLength.sub(
          Provable.if(opponentReady, UInt64.from(1), UInt64.from(0)),
        ),
      }),
    );

    const pendingBalance = ProtoUInt64.from(
      this.pendingBalances.get(this.transaction.sender.value).value,
    );

    const fee = this.getParticipationPrice();

    const amountToTransfer = Provable.if<ProtoUInt64>(
      pendingBalance.greaterThan(fee),
      ProtoUInt64,
      ProtoUInt64.from(0),
      fee,
    );

    // Should be before initGame
    this.pendingBalances.set(
      this.transaction.sender.value,
      pendingBalance.add(amountToTransfer),
    );

    const gameId = this.initGame(
      opponentReady,
      this.transaction.sender.value,
      opponent,
    );

    // Array call
    // Assigning new game to player if opponent found
    this.activeGameId.set(
      this.transaction.sender.value,
      Provable.if(opponentReady, gameId, UInt64.from(0)),
    );

    // Setting that opponent is in game if opponent found
    this.activeGameId.set(
      Provable.if(opponentReady, opponent.value.userAddress, PublicKey.empty()),
      gameId,
    );

    // If opponent not found – adding current user to the list
    this.queueRoundUsersList.set(
      new RoundIdxIndex({ roundId, index: queueLength }),
      new QueueListItem({
        userAddress: Provable.if(
          opponentReady,
          PublicKey.empty(),
          this.transaction.sender.value,
        ),
        registrationTimestamp: timestamp,
      }),
    );

    // If opponent not found – registering current user in the list
    this.queueRegisteredRoundUsers.set(
      new RoundIdxUser({
        roundId,
        userAddress: Provable.if(
          opponentReady,
          PublicKey.empty(),
          this.transaction.sender.value,
        ),
      }),
      Bool(true),
    );

    // If opponent found – removing him from queue
    this.queueRegisteredRoundUsers.set(
      new RoundIdxUser({
        roundId,
        userAddress: Provable.if(
          opponentReady,
          opponent.value.userAddress,
          PublicKey.empty(),
        ),
      }),
      Bool(false),
    );

    // If opponent not found – incrementing queue length. If found – removing opponent by length decreasing
    this.queueLength.set(
      roundId,
      Provable.if(
        opponentReady,
        queueLength.sub(
          Provable.if(opponentReady, UInt64.from(1), UInt64.from(0)),
        ),
        queueLength.add(1),
      ),
    );

    this.balances.transfer(
      ZNAKE_TOKEN_ID,
      this.transaction.sender.value,
      PublicKey.empty(),
      amountToTransfer,
    );
  }
  */

  /**
   * Registers user in session queue
   *
   * @param sessionKey - Key of user background session
   * @param timestamp - Current user timestamp from front-end
   */
  /*
  @runtimeMethod()
  public collectPendingBalance(): void {
    const sender = this.sessions.get(this.transaction.sender.value).value;

    const pendingBalance = ProtoUInt64.from(
      this.pendingBalances.get(sender).value,
    );

    this.balances.mint(ZNAKE_TOKEN_ID, sender, pendingBalance);
    this.pendingBalances.set(sender, ProtoUInt64.from(0));
  }
  */

  @runtimeMethod()
  public proveOpponentTimeout(gameId: UInt64): void {
    const sessionSender = this.sessions.get(this.transaction.sender.value);
    const sender = Provable.if(
      sessionSender.isSome,
      sessionSender.value,
      this.transaction.sender.value,
    );
    const game = this.games.get(gameId);
    const nextUser = Provable.if(
      game.value.currentMoveUser.equals(game.value.player1),
      game.value.player2,
      game.value.player1,
    );
    assert(game.isSome, 'Invalid game id');
    assert(nextUser.equals(sender), `Not your move`);
    assert(game.value.winner.equals(PublicKey.empty()), `Game finished`);

    const isTimeout = this.network.block.height
      .sub(game.value.lastMoveBlockHeight)
      .greaterThan(UInt64.from(MOVE_TIMEOUT_IN_BLOCKS));

    assert(isTimeout, 'Timeout not reached');

    game.value.winner = sender;
    game.value.lastMoveBlockHeight = this.network.block.height;
    this.games.set(gameId, game.value);

    // Removing active game for players if game ended
    this.activeGameId.set(game.value.player1, UInt64.from(0));
    this.activeGameId.set(game.value.player2, UInt64.from(0));
  }

  protected getParticipationPrice() {
    return DEFAULT_GAME_COST;
  }
}

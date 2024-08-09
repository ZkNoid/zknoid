import {
  RuntimeModule,
  runtimeModule,
  state,
  runtimeMethod,
} from '@proto-kit/module';
import { UInt64 as ProtoUInt64 } from '@proto-kit/library';
import { State, StateMap, assert } from '@proto-kit/protocol';
import { PublicKey, Struct, UInt64, Provable, Bool } from 'o1js';
import { Lobby, LobbyManager } from './LobbyManager';

interface MatchMakerConfig {}

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

export class PendingLobbyIndex extends Struct({
  roundId: UInt64,
  type: UInt64,
}) {}

// abstract class

@runtimeModule()
export class MatchMaker extends LobbyManager {
  // Round => pending lobby
  @state() public pendingLobby = StateMap.from<PendingLobbyIndex, Lobby>(
    PendingLobbyIndex,
    Lobby,
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

  @state() public defaultLobbies = StateMap.from<UInt64, Lobby>(UInt64, Lobby);
  @state() public lastDefaultLobby = State.from<UInt64>(UInt64);

  @runtimeMethod()
  public async addDefaultLobby(participationFee: ProtoUInt64): Promise<void> {
    let lobby = Lobby.default(UInt64.zero, Bool(false));
    lobby.participationFee = participationFee;
    const lastLobbyId = (await this.lastDefaultLobby.get()).orElse(UInt64.from(1));
    await this.defaultLobbies.set(lastLobbyId, lobby);
    await this.lastDefaultLobby.set(lastLobbyId.add(1));
  }

  @runtimeMethod()
  public async register(
    sessionKey: PublicKey,
    timestamp: UInt64,
  ): Promise<void> {
    await this.registerWithType(sessionKey, UInt64.from(1), timestamp);
  }

  @runtimeMethod()
  public async registerWithType(
    sessionKey: PublicKey,
    type: UInt64,
    timestamp: UInt64,
  ): Promise<void> {
    const sender = this.transaction.sender.value;
    // If player in game – revert

    Provable.asProver(async () => {
      const gameId = (await this.activeGameId.get(sender)).orElse(UInt64.from(0));
      if (gameId.equals(UInt64.from(0)).not().toBoolean()) {
        console.log(
          `Register failed. Player already in game ${gameId.toString()}`,
        );
      }
    });

    assert(
      (await this.activeGameId
        .get(sender))
        .orElse(UInt64.from(0))
        .equals(UInt64.from(0)),
      'Player already in game',
    );

    await this.sessions.set(sessionKey, sender);
    const roundId = this.network.block.height.div(PENDING_BLOCKS_NUM);
    const pendingLobbyIndex = new PendingLobbyIndex({
      roundId,
      type,
    });

    // Join lobby
    let lobby = await this.joinPendingLobby(pendingLobbyIndex);

    // If lobby is full - run game
    const lobbyReady = lobby.isFull();

    lobby = await this.flushPendingLobby(pendingLobbyIndex, lobbyReady);

    const gameId = await this.initGame(lobby, lobbyReady);
  }

  @runtimeMethod()
  public async leaveMatchmaking(type: UInt64) {
    const sender = this.transaction.sender.value;
    const roundId = this.network.block.height.div(PENDING_BLOCKS_NUM);
    const pendingLobbyIndex = new PendingLobbyIndex({
      roundId,
      type,
    });

    const lobbyOption = await this.pendingLobby.get(pendingLobbyIndex);
    assert(lobbyOption.isSome, 'No such pending lobby');
    const lobby = lobbyOption.value;

    assert(
      (await this.queueRegisteredRoundUsers.get(
        new RoundIdxUser({
          roundId: lobby.id,
          userAddress: sender,
        }),
      )).value,
      'User is not registered for this matchmaking',
    );

    lobby.removePlayer(sender);
    await this.queueRegisteredRoundUsers.set(
      new RoundIdxUser({
        roundId: lobby.id,
        userAddress: sender,
      }),
      Bool(false),
    );
    await this.pendingLobby.set(pendingLobbyIndex, lobby);
  }

  private async joinPendingLobby(lobbyIndex: PendingLobbyIndex): Promise<Lobby> {
    const sender = this.transaction.sender.value;
    const lobby = (await this.pendingLobby
      .get(lobbyIndex))
      .orElse(await this.getDefaultLobby(lobbyIndex.type, lobbyIndex.roundId));

    assert(
      (await this.queueRegisteredRoundUsers
        .get(
          new RoundIdxUser({
            roundId: lobby.id,
            userAddress: sender,
          }),
        )
      ).value.not(),
      'User already in queue',
    );

    await this.queueRegisteredRoundUsers.set(
      new RoundIdxUser({
        roundId: lobby.id,
        userAddress: sender,
      }),
      Bool(true),
    );

    await this._joinLobby(lobby);
    await this.pendingLobby.set(lobbyIndex, lobby);

    return lobby;
  }

  // Transform pending lobby to active lobby
  // Returns activeLobby
  private async flushPendingLobby(
    pendingLobyIndex: PendingLobbyIndex,
    shouldFlush: Bool,
  ): Promise<Lobby> {
    let lobby = (await this.pendingLobby.get(pendingLobyIndex)).value;

    for (const player of lobby.players) {
      await this.queueRegisteredRoundUsers.set(
        new RoundIdxUser({
          roundId: lobby.id,
          userAddress: player,
        }),
        shouldFlush.not(),
      );
    }

    await this.pendingLobby.set(
      pendingLobyIndex,
      Provable.if(
        shouldFlush,
        Lobby,
        await this.getDefaultLobby(pendingLobyIndex.type, lobby.id),
        lobby,
      ) as Lobby,
    );

    let activeLobby = await this._addLobby(lobby, shouldFlush);

    return activeLobby;
  }

  // Gets default lobby with id
  private async getDefaultLobby(type: UInt64, id: UInt64): Promise<Lobby> {
    const customDefaultLobbyOption = await this.defaultLobbies.get(type);
    assert(customDefaultLobbyOption.isSome, 'No such lobby');
    const customDefaultLobby = customDefaultLobbyOption.value;
    customDefaultLobby.id = id;

    return Provable.if<Lobby>(
      type.equals(UInt64.zero),
      Lobby,
      Lobby.default(id, Bool(false)),
      customDefaultLobby,
    );
  }

  protected async proveOpponentTimeout(gameId: UInt64, passTurn: boolean): Promise<void> {
    const sessionSender = await this.sessions.get(this.transaction.sender.value);
    const sender = Provable.if(
      sessionSender.isSome,
      sessionSender.value,
      this.transaction.sender.value,
    );
    const game = await this.games.get(gameId);
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

    if (passTurn) {
      game.value.currentMoveUser = Provable.if(
        game.value.currentMoveUser.equals(game.value.player1),
        game.value.player2,
        game.value.player1,
      );
      game.value.lastMoveBlockHeight = this.network.block.height;
    } else {
      game.value.winner = sender;
      game.value.lastMoveBlockHeight = this.network.block.height;
      // Removing active game for players if game ended
      await this.activeGameId.set(game.value.player1, UInt64.from(0));
      await this.activeGameId.set(game.value.player2, UInt64.from(0));
    }

    await this.games.set(gameId, game.value);
  }

  protected async acquireFunds(
    gameId: UInt64,
    player1: PublicKey,
    player2: PublicKey,
    player1Share: ProtoUInt64,
    player2Share: ProtoUInt64,
    totalShares: ProtoUInt64,
  ) {
    const player1PendingBalance = await this.pendingBalances.get(player1);
    const player2PendingBalance = await this.pendingBalances.get(player2);
    // Provable.log(player1, player2, player1Share, player2Share, totalShares);
    // Provable.log(
    //   ProtoUInt64.from(this.gameFund.get(gameId).value)
    //     .mul(player1Share)
    //     .div(totalShares),
    //   ProtoUInt64.from(this.gameFund.get(gameId).value)
    //     .mul(player2Share)
    //     .div(totalShares),
    // );
    await this.pendingBalances.set(
      player1,
      ProtoUInt64.from(player1PendingBalance.value).add(
        ProtoUInt64.from((await this.gameFund.get(gameId)).value)
          .mul(player1Share)
          .div(totalShares),
      ),
    );

    await this.pendingBalances.set(
      player2,
      ProtoUInt64.from(player2PendingBalance.value).add(
        ProtoUInt64.from((await this.gameFund.get(gameId)).value)
          .mul(player2Share)
          .div(totalShares),
      ),
    );
  }
}

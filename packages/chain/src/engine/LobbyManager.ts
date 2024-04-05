import {
  RuntimeModule,
  runtimeMethod,
  runtimeModule,
  state,
} from '@proto-kit/module';
import { State, StateMap, assert } from '@proto-kit/protocol';
import { Bool, Provable, PublicKey, Struct, UInt64 } from 'o1js';

import { Balances, UInt64 as ProtoUInt64 } from '@proto-kit/library';
import { inject } from 'tsyringe';
import { ZNAKE_TOKEN_ID } from '../..';

const PLAYER_AMOUNT = 2;
const DEFAULT_PARTICIPATION_FEE = ProtoUInt64.from(0);

export class RoundIdxUser extends Struct({
  roundId: UInt64,
  userAddress: PublicKey,
}) {}

export class Lobby extends Struct({
  id: UInt64,
  players: Provable.Array(PublicKey, PLAYER_AMOUNT),
  curAmount: UInt64,
  participationFee: ProtoUInt64,
  started: Bool,
}) {
  static default(id: UInt64): Lobby {
    return new Lobby({
      id,
      players: [...Array(PLAYER_AMOUNT)].map((n) => PublicKey.empty()),
      curAmount: UInt64.zero,
      participationFee: DEFAULT_PARTICIPATION_FEE,
      started: Bool(false),
    });
  }

  isFull(): Bool {
    return this.curAmount.equals(UInt64.from(PLAYER_AMOUNT));
  }

  addPlayer(player: PublicKey): void {
    // #TODO Not fully constrain. Fix
    for (let i = 0; i < PLAYER_AMOUNT; i++) {
      let curI = UInt64.from(i);
      this.players[i] = Provable.if(
        curI.equals(this.curAmount),
        player,
        this.players[i],
      );
    }
  }
}

@runtimeModule()
export class LobbyManager extends RuntimeModule<void> {
  @state() public activeGameId = StateMap.from<PublicKey, UInt64>(
    PublicKey,
    UInt64,
  );
  @state() public activeLobby = StateMap.from<UInt64, Lobby>(UInt64, Lobby);
  @state() public lastLobbyId = State.from<UInt64>(UInt64);

  // Round => pending lobby
  @state() public pendingLobby = StateMap.from<UInt64, Lobby>(UInt64, Lobby);

  @state() public pendingBalances = StateMap.from<PublicKey, ProtoUInt64>(
    PublicKey,
    ProtoUInt64,
  );

  @state() public queueRegisteredRoundUsers = StateMap.from<RoundIdxUser, Bool>(
    RoundIdxUser,
    Bool,
  );

  @state() public gameFund = StateMap.from<UInt64, ProtoUInt64>(
    UInt64,
    ProtoUInt64,
  );

  @state() public gameFinished = StateMap.from<UInt64, Bool>(UInt64, Bool);

  public constructor(@inject('Balances') private balances: Balances) {
    super();
  }

  @runtimeMethod()
  public addLobby(lobby: Lobby): Lobby {
    return this._addLobby(lobby, Bool(true));
  }

  @runtimeMethod()
  public joinLobby(lobbyId: UInt64): void {
    const lobby = this.activeLobby.get(lobbyId).orElse(Lobby.default(lobbyId));
    this._joinLobby(lobby);
    this.activeLobby.set(lobbyId, lobby);
  }

  @runtimeMethod() // Move alll with pending lobby to matchmaker
  public joinPendingLobby(lobbyId: UInt64): Lobby {
    const lobby = this.pendingLobby.get(lobbyId).orElse(Lobby.default(lobbyId));
    this._joinLobby(lobby);
    this.pendingLobby.set(lobbyId, lobby);
    return lobby;
  }

  private _joinLobby(lobby: Lobby): void {
    const sender = this.transaction.sender.value;

    // User can't re-register in round queue if already registered
    assert(
      this.queueRegisteredRoundUsers
        .get(
          new RoundIdxUser({
            roundId: lobby.id,
            userAddress: sender,
          }),
        )
        .isSome.not(),
      'User already in queue',
    );

    this.queueRegisteredRoundUsers.set(
      new RoundIdxUser({
        roundId: lobby.id,
        userAddress: sender,
      }),
      Bool(true),
    );

    lobby.addPlayer(sender);

    const pendingBalance = ProtoUInt64.from(
      this.pendingBalances.get(sender).value,
    );

    const fee = lobby.participationFee;

    const amountToTransfer = Provable.if<ProtoUInt64>(
      pendingBalance.greaterThan(fee),
      ProtoUInt64,
      ProtoUInt64.from(0),
      fee.sub(pendingBalance),
    );

    // Should be before initGame
    this.pendingBalances.set(sender, pendingBalance.add(amountToTransfer));

    this.balances.transfer(
      ZNAKE_TOKEN_ID,
      sender,
      PublicKey.empty(),
      amountToTransfer,
    );
  }

  // Transform pending lobby to active lobby
  // Returns activeLobby
  protected flushPendingLobby(pendingLobyId: UInt64, shouldFlush: Bool): Lobby {
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

  private _addLobby(lobby: Lobby, shouldUpdate: Bool): Lobby {
    const lobbyId = this.lastLobbyId.get().value;
    lobby.id = lobbyId;
    this.activeLobby.set(lobbyId, lobby); // It will be overwriteen later, so dont care about this
    const addValue = Provable.if(shouldUpdate, UInt64.from(1), UInt64.from(0));
    this.lastLobbyId.set(lobbyId.add(addValue));

    return lobby;
  }

  /**
   * Initializes game when opponent is found
   *
   * @param opponentReady - Is opponent found. If not ready, function call should process this case without initialization
   * @param opponent - Opponent if opponent is ready
   * @returns Id of the new game. Will be set for player and opponent
   */
  public initGame(lobby: Lobby, shouldInit: Bool): UInt64 {
    let gameId = this.getNextGameId();

    lobby.players.forEach((player) => {
      // Clear queueRegisteredRoundUsers
      this.queueRegisteredRoundUsers.set(
        new RoundIdxUser({
          roundId: lobby.id,
          userAddress: player,
        }),
        shouldInit.not(),
      );

      // Eat pendingBalances of users
      let curBalance = this.pendingBalances.get(player).value;
      this.pendingBalances.set(
        player,
        Provable.if<ProtoUInt64>(
          shouldInit,
          ProtoUInt64,
          ProtoUInt64.from(0),
          curBalance,
        ),
      );

      // Set active game
      this.activeGameId.set(player, gameId);
    });

    // Set active game for each user

    lobby.started = Bool(true);

    this.activeLobby.set(lobby.id, lobby);

    return UInt64.from(gameId);
  }

  protected getFunds(
    gameId: UInt64,
    player1: PublicKey,
    player2: PublicKey,
    player1Share: ProtoUInt64,
    player2Share: ProtoUInt64,
  ) {
    assert(this.gameFinished.get(gameId).value.not());

    this.gameFinished.set(gameId, Bool(true));

    this.balances.mint(
      ZNAKE_TOKEN_ID,
      player1,
      ProtoUInt64.from(this.gameFund.get(gameId).value)
        .mul(player1Share)
        .div(player1Share.add(player2Share)),
    );
    this.balances.mint(
      ZNAKE_TOKEN_ID,
      player2,
      ProtoUInt64.from(this.gameFund.get(gameId).value)
        .mul(player2Share)
        .div(player1Share.add(player2Share)),
    );
  }

  public getNextGameId(): UInt64 {
    return UInt64.zero;
  }
}

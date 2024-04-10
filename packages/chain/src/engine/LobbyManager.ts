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
import { ZNAKE_TOKEN_ID } from '../constants';

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
    this.curAmount = this.curAmount.add(1);
  }
}

interface LobbyManagerConfig {}

@runtimeModule()
export class LobbyManager extends RuntimeModule<LobbyManagerConfig> {
  @state() public activeGameId = StateMap.from<PublicKey, UInt64>(
    PublicKey,
    UInt64,
  );
  @state() public activeLobby = StateMap.from<UInt64, Lobby>(UInt64, Lobby);
  @state() public lastLobbyId = State.from<UInt64>(UInt64);

  // Session => user
  @state() public sessions = StateMap.from<PublicKey, PublicKey>(
    PublicKey,
    PublicKey,
  );

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
  public createLobby(): Lobby {
    return this._addLobby(Lobby.default(UInt64.zero), Bool(true));
  }

  @runtimeMethod()
  public joinLobby(lobbyId: UInt64): void {
    const lobby = this.activeLobby.get(lobbyId).orElse(Lobby.default(lobbyId));
    this._joinLobby(lobby);
    this.activeLobby.set(lobbyId, lobby);
  }

  protected _joinLobby(lobby: Lobby): void {
    const sender = this.transaction.sender.value;

    lobby.addPlayer(sender);

    const pendingBalance = ProtoUInt64.from(
      this.pendingBalances.get(sender).value,
    );

    const fee = ProtoUInt64.from(lobby.participationFee);

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

  protected _addLobby(lobby: Lobby, shouldUpdate: Bool): Lobby {
    const lobbyId = this.lastLobbyId.get().value;
    lobby.id = lobbyId;
    this.activeLobby.set(lobbyId, lobby); // It will be overwriteen later, so dont care about this
    const addValue = Provable.if(shouldUpdate, UInt64.from(1), UInt64.from(0));
    this.lastLobbyId.set(lobbyId.add(addValue));

    return lobby;
  }

  @runtimeMethod()
  public startGame(lobbyId: UInt64): void {
    let lobby = this.activeLobby.get(lobbyId).value;

    this.initGame(lobby, Bool(true));
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
      this.forEachUserInInitGame(lobby, player, shouldInit);
    });

    // Set active game for each user

    lobby.started = Bool(true);

    this.activeLobby.set(lobby.id, lobby);

    this.updateNextGameId(shouldInit);

    return gameId;
  }

  protected forEachUserInInitGame(
    lobby: Lobby,
    player: PublicKey,
    shouldInit: Bool,
  ): void {
    let gameId = this.getNextGameId();

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
    this.activeGameId.set(player, Provable.if(shouldInit, gameId, UInt64.zero));
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

  @runtimeMethod()
  public collectPendingBalance(): void {
    const sender = this.sessions.get(this.transaction.sender.value).value;

    const pendingBalance = ProtoUInt64.from(
      this.pendingBalances.get(sender).value,
    );

    this.balances.mint(ZNAKE_TOKEN_ID, sender, pendingBalance);
    this.pendingBalances.set(sender, ProtoUInt64.from(0));
  }

  public getNextGameId(): UInt64 {
    return UInt64.zero;
  }

  public updateNextGameId(shouldUpdate: Bool): void {}
}

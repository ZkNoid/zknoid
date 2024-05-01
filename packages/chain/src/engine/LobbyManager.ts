import {
  RuntimeModule,
  runtimeMethod,
  runtimeModule,
  state,
} from '@proto-kit/module';
import { State, StateMap, assert } from '@proto-kit/protocol';
import { Bool, CircuitString, Provable, PublicKey, Struct, UInt64 } from 'o1js';

import { Balances, UInt64 as ProtoUInt64 } from '@proto-kit/library';
import { inject } from 'tsyringe';
import { ZNAKE_TOKEN_ID } from '../constants';

const PLAYER_AMOUNT = 2;
export const DEFAULT_PARTICIPATION_FEE = ProtoUInt64.from(10 ** 9);

export class RoundIdxUser extends Struct({
  roundId: UInt64,
  userAddress: PublicKey,
}) {}

export class Lobby extends Struct({
  id: UInt64,
  name: CircuitString,
  players: Provable.Array(PublicKey, PLAYER_AMOUNT),
  ready: Provable.Array(Bool, PLAYER_AMOUNT),
  readyAmount: UInt64,
  curAmount: UInt64,
  participationFee: ProtoUInt64,
  privateLobby: Bool,
  active: Bool,
  started: Bool,
}) {
  static from(
    name: CircuitString,
    participationFee: ProtoUInt64,
    privateLobby: Bool,
  ): Lobby {
    return new Lobby({
      id: UInt64.zero,
      name,
      players: [...Array(PLAYER_AMOUNT)].map((n) => PublicKey.empty()),
      ready: [...Array(PLAYER_AMOUNT)].map((n) => Bool(false)),
      readyAmount: UInt64.zero,
      curAmount: UInt64.zero,
      participationFee,
      privateLobby,
      active: Bool(true),
      started: Bool(false),
    });
  }

  static inactive(): Lobby {
    let lobby = Lobby.from(
      CircuitString.fromString(''),
      ProtoUInt64.from(0),
      Bool(false),
    );
    lobby.active = Bool(false);
    return lobby;
  }

  static default(id: UInt64, privateLobby: Bool): Lobby {
    return new Lobby({
      id,
      name: CircuitString.fromString('Default'),
      players: [...Array(PLAYER_AMOUNT)].map((n) => PublicKey.empty()),
      ready: [...Array(PLAYER_AMOUNT)].map((n) => Bool(false)),
      readyAmount: UInt64.zero,
      curAmount: UInt64.zero,
      participationFee: DEFAULT_PARTICIPATION_FEE,
      privateLobby,
      active: Bool(true),
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

  removePlayer(player: PublicKey): void {
    let removed = Bool(false);

    for (let i = 0; i < PLAYER_AMOUNT - 1; i++) {
      let curI = UInt64.from(i);

      let found = this.players[i].equals(player);
      removed = removed.or(found);

      this.players[i] = Provable.if(
        removed,
        this.players[i + 1],
        this.players[i],
      );

      this.ready[i] = Provable.if(removed, this.ready[i + 1], this.ready[i]);
    }

    let found = this.players[PLAYER_AMOUNT - 1].equals(player);
    removed = removed.or(found);

    // Last item
    this.players[PLAYER_AMOUNT - 1] = Provable.if(
      removed,
      PublicKey.empty(),
      this.players[PLAYER_AMOUNT - 1],
    );

    this.ready[PLAYER_AMOUNT - 1] = Provable.if(
      removed,
      Bool(false),
      this.ready[PLAYER_AMOUNT - 1],
    );

    let subAmount = Provable.if(removed, UInt64.from(1), UInt64.zero);
    this.curAmount = this.curAmount.sub(subAmount);
    this.readyAmount = this.ready
      .map((elem) => Provable.if(elem, UInt64.from(1), UInt64.zero))
      .reduce((acc, val) => acc.add(val));
  }

  getIndex(player: PublicKey): UInt64 {
    let result = UInt64.from(PLAYER_AMOUNT);
    for (let i = 0; i < PLAYER_AMOUNT; i++) {
      let curI = UInt64.from(i);
      result = Provable.if(this.players[i].equals(player), curI, result);
    }

    return result;
  }

  setReady(index: UInt64): void {
    for (let i = 0; i < PLAYER_AMOUNT; i++) {
      let curI = UInt64.from(i);
      let found = curI.equals(index);
      this.ready[i] = Provable.if(found, this.ready[i].not(), this.ready[i]);

      let addAmount = Provable.if(
        found.and(this.ready[i]),
        UInt64.from(1),
        UInt64.zero,
      );
      let subAmount = Provable.if(
        found.and(this.ready[i].not()),
        UInt64.from(1),
        UInt64.zero,
      );

      this.readyAmount = this.readyAmount.add(addAmount).sub(subAmount);
    }
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
  @state() public currentLobby = StateMap.from<PublicKey, UInt64>(
    PublicKey,
    UInt64,
  );

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
  public createLobby(
    name: CircuitString,
    participationFee: ProtoUInt64,
    privateLobby: Bool,
    creatorSessionKey: PublicKey,
  ): void {
    let lobby = this._addLobby(
      Lobby.from(name, participationFee, privateLobby),
      Bool(true),
    );

    this.joinLobbyWithSessionKey(lobby.id, creatorSessionKey);
  }

  @runtimeMethod()
  public joinLobbyWithSessionKey(lobbyId: UInt64, sessionKey: PublicKey): void {
    this.sessions.set(sessionKey, this.transaction.sender.value);
    this.joinLobby(lobbyId);
  }

  @runtimeMethod()
  public joinLobby(lobbyId: UInt64): void {
    const currentLobby = this.currentLobby.get(
      this.transaction.sender.value,
    ).value;
    assert(currentLobby.equals(UInt64.zero), 'You already in lobby');
    const lobby = this.activeLobby
      .get(lobbyId)
      .orElse(Lobby.default(lobbyId, Bool(false)));
    this._joinLobby(lobby);
    this.currentLobby.set(this.transaction.sender.value, lobbyId);
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

  @runtimeMethod()
  public leaveLobby(): void {
    const sender = this.transaction.sender.value;
    let currentLobbyId = this.currentLobby.get(sender).value;

    let lobby = this.activeLobby.get(currentLobbyId).value;
    lobby.removePlayer(sender);

    this.activeLobby.set(currentLobbyId, lobby);
    this.currentLobby.set(sender, UInt64.zero);
  }

  @runtimeMethod()
  public ready(): void {
    const sender = this.transaction.sender.value;
    let currentLobby = this.currentLobby.get(sender).value;

    let lobby = this.activeLobby.get(currentLobby).value;

    let playerIndex = lobby.getIndex(sender);

    lobby.setReady(playerIndex);

    this.activeLobby.set(currentLobby, lobby);

    const lobbyReady = lobby.readyAmount.equals(UInt64.from(PLAYER_AMOUNT));

    this.initGame(lobby, lobbyReady);
  }

  protected _addLobby(lobby: Lobby, shouldUpdate: Bool): Lobby {
    const lobbyId = this.lastLobbyId.get().orElse(UInt64.from(1));
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

    lobby.started = Provable.if(shouldInit, Bool(true), lobby.started);

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

  protected _onLobbyEnd(lobbyId: UInt64, shouldEnd: Bool): void {
    let lobby = this.activeLobby.get(lobbyId).value;

    for (let i = 0; i < PLAYER_AMOUNT; i++) {
      this.currentLobby.set(
        Provable.if(shouldEnd, lobby.players[i], PublicKey.empty()),
        UInt64.zero,
      );
    }

    this.activeLobby.set(
      Provable.if(shouldEnd, lobbyId, UInt64.zero),
      Lobby.inactive(),
    );
  }
}

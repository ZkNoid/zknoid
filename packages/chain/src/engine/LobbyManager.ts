import {
  RuntimeModule,
  runtimeMethod,
  runtimeModule,
  state,
} from '@proto-kit/module';
import { State, StateMap, assert } from '@proto-kit/protocol';
import {
  Bool,
  CircuitString,
  Field,
  Provable,
  PublicKey,
  Struct,
  UInt64,
} from 'o1js';

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
  accessKey: Field,
  privateLobby: Bool,
  active: Bool,
  started: Bool,
}) {
  static from(
    name: CircuitString,
    participationFee: ProtoUInt64,
    privateLobby: Bool,
    accessKey: Field,
  ): Lobby {
    return new Lobby({
      id: UInt64.zero,
      name,
      players: [...Array(PLAYER_AMOUNT)].map((n) => PublicKey.empty()),
      ready: [...Array(PLAYER_AMOUNT)].map((n) => Bool(false)),
      readyAmount: UInt64.zero,
      curAmount: UInt64.zero,
      participationFee,
      accessKey,
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
      Field.from(0),
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
      accessKey: Field.from(0),
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
  public async createLobby(
    name: CircuitString,
    participationFee: ProtoUInt64,
    privateLobby: Bool,
    creatorSessionKey: PublicKey,
    accessKey: Field,
  ): Promise<void> {
    let lobby = await this._addLobby(
      Lobby.from(name, participationFee, privateLobby, accessKey),
      Bool(true),
    );

    await this.joinLobbyWithSessionKey(lobby.id, creatorSessionKey);
  }

  @runtimeMethod()
  public async joinLobbyWithSessionKey(
    lobbyId: UInt64,
    sessionKey: PublicKey,
  ): Promise<void> {
    await this.sessions.set(sessionKey, this.transaction.sender.value);
    await this.joinLobby(lobbyId);
  }

  @runtimeMethod()
  public async joinLobby(lobbyId: UInt64): Promise<void> {
    const currentLobby = (
      await this.currentLobby.get(this.transaction.sender.value)
    ).value;
    assert(currentLobby.equals(UInt64.zero), 'You already in lobby');
    const lobby = (await this.activeLobby.get(lobbyId)).orElse(
      Lobby.default(lobbyId, Bool(false)),
    );
    await this._joinLobby(lobby);
    await this.currentLobby.set(this.transaction.sender.value, lobbyId);
    await this.activeLobby.set(lobbyId, lobby);
  }

  protected async _joinLobby(lobby: Lobby): Promise<void> {
    const sender = this.transaction.sender.value;

    await lobby.addPlayer(sender);

    const pendingBalance = ProtoUInt64.from(
      (await this.pendingBalances.get(sender)).value,
    );

    const fee = ProtoUInt64.from(lobby.participationFee);

    const amountToTransfer = Provable.if<ProtoUInt64>(
      pendingBalance.greaterThan(fee),
      ProtoUInt64,
      ProtoUInt64.from(0),
      fee.sub(pendingBalance),
    );

    // Should be before initGame
    await this.pendingBalances.set(sender, pendingBalance.add(amountToTransfer));

    await this.balances.transfer(
      ZNAKE_TOKEN_ID,
      sender,
      PublicKey.empty(),
      amountToTransfer,
    );
  }

  @runtimeMethod()
  public async leaveLobby(): Promise<void> {
    const sender = this.transaction.sender.value;
    let currentLobbyId = (await this.currentLobby.get(sender)).value;

    let lobby = (await this.activeLobby.get(currentLobbyId)).value;
    lobby.removePlayer(sender);

    await this.activeLobby.set(currentLobbyId, lobby);
    await this.currentLobby.set(sender, UInt64.zero);
  }

  @runtimeMethod()
  public async ready(): Promise<void> {
    const sender = this.transaction.sender.value;
    let currentLobby = (await this.currentLobby.get(sender)).value;

    let lobby = (await this.activeLobby.get(currentLobby)).value;

    let playerIndex = lobby.getIndex(sender);

    lobby.setReady(playerIndex);

    await this.activeLobby.set(currentLobby, lobby);

    const lobbyReady = lobby.readyAmount.equals(UInt64.from(PLAYER_AMOUNT));

    await this.initGame(lobby, lobbyReady);
  }

  protected async _addLobby(lobby: Lobby, shouldUpdate: Bool): Promise<Lobby> {
    const lobbyId = (await this.lastLobbyId.get()).orElse(UInt64.from(1));
    lobby.id = lobbyId;
    await this.activeLobby.set(lobbyId, lobby); // It will be overwriteen later, so dont care about this
    const addValue = Provable.if(shouldUpdate, UInt64.from(1), UInt64.from(0));
    await this.lastLobbyId.set(lobbyId.add(addValue));

    return lobby;
  }

  @runtimeMethod()
  public async startGame(lobbyId: UInt64): Promise<void> {
    let lobby = (await this.activeLobby.get(lobbyId)).value;

    await this.initGame(lobby, Bool(true));
  }

  /**
   * Initializes game when opponent is found
   *
   * @param opponentReady - Is opponent found. If not ready, function call should process this case without initialization
   * @param opponent - Opponent if opponent is ready
   * @returns Id of the new game. Will be set for player and opponent
   */
  public async initGame(lobby: Lobby, shouldInit: Bool): Promise<UInt64> {
    let gameId = lobby.id;

    for (let player of lobby.players) {
      await this.forEachUserInInitGame(lobby, player, shouldInit);
    }

    // Set active game for each user

    lobby.started = Provable.if(shouldInit, Bool(true), lobby.started);

    await this.activeLobby.set(lobby.id, lobby);

    return gameId;
  }

  protected async forEachUserInInitGame(
    lobby: Lobby,
    player: PublicKey,
    shouldInit: Bool,
  ): Promise<void> {
    // Eat pendingBalances of users
    let curBalance = (await this.pendingBalances.get(player)).value;
    await this.pendingBalances.set(
      player,
      Provable.if<ProtoUInt64>(
        shouldInit,
        ProtoUInt64,
        ProtoUInt64.from(0),
        curBalance,
      ),
    );

    // Set active game
    await this.activeGameId.set(
      player,
      Provable.if(shouldInit, lobby.id, UInt64.zero),
    );
  }

  protected async getFunds(
    gameId: UInt64,
    player1: PublicKey,
    player2: PublicKey,
    player1Share: ProtoUInt64,
    player2Share: ProtoUInt64,
  ) {
    assert((await this.gameFinished.get(gameId)).value.not());

    await this.gameFinished.set(gameId, Bool(true));

    await this.balances.mint(
      ZNAKE_TOKEN_ID,
      player1,
      ProtoUInt64.from((await this.gameFund.get(gameId)).value)
        .mul(player1Share)
        .div(player1Share.add(player2Share)),
    );
    await this.balances.mint(
      ZNAKE_TOKEN_ID,
      player2,
      ProtoUInt64.from((await this.gameFund.get(gameId)).value)
        .mul(player2Share)
        .div(player1Share.add(player2Share)),
    );
  }

  @runtimeMethod()
  public async collectPendingBalance(): Promise<void> {
    const sender = (await this.sessions.get(this.transaction.sender.value)).value;

    const pendingBalance = ProtoUInt64.from(
      (await this.pendingBalances.get(sender)).value,
    );

    await this.balances.mint(ZNAKE_TOKEN_ID, sender, pendingBalance);
    await this.pendingBalances.set(sender, ProtoUInt64.from(0));
  }

  protected async _onLobbyEnd(lobbyId: UInt64, shouldEnd: Bool): Promise<void> {
    let lobby = (await this.activeLobby.get(lobbyId)).value;

    for (let i = 0; i < PLAYER_AMOUNT; i++) {
      await this.currentLobby.set(
        Provable.if(shouldEnd, lobby.players[i], PublicKey.empty()),
        UInt64.zero,
      );
    }

    await this.activeLobby.set(
      Provable.if(shouldEnd, lobbyId, UInt64.zero),
      Lobby.inactive(),
    );
  }
}

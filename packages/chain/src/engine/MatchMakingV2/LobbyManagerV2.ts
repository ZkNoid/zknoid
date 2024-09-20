import { Balances, UInt64 } from '@proto-kit/library';
import {
  RuntimeModule,
  runtimeMethod,
  runtimeModule,
  state,
} from '@proto-kit/module';
import { State, StateMap, assert } from '@proto-kit/protocol';
import { Bool, CircuitString, Field, Provable, PublicKey, Struct } from 'o1js';
import { ZNAKE_TOKEN_ID } from '../../constants';
import { inject } from 'tsyringe';
import { getLobbyV2 } from './LobbyV2';
import { RoundIdxUser } from './Structs';

export interface LobbyManagerConfig {}

export function getLobbyManagerV2(PLAYER_AMOUNT: number) {
  class LobbyV2 extends getLobbyV2(PLAYER_AMOUNT) {}

  @runtimeModule()
  class LobbyManagerV2 extends RuntimeModule<LobbyManagerConfig> {
    @state() public activeGameId = StateMap.from<PublicKey, UInt64>(
      PublicKey,
      UInt64,
    );
    @state() public activeLobby = StateMap.from<UInt64, LobbyV2>(
      UInt64,
      LobbyV2,
    );
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

    @state() public pendingBalances = StateMap.from<PublicKey, UInt64>(
      PublicKey,
      UInt64,
    );

    @state() public queueRegisteredRoundUsers = StateMap.from<
      RoundIdxUser,
      Bool
    >(RoundIdxUser, Bool);

    @state() public gameFund = StateMap.from<UInt64, UInt64>(UInt64, UInt64);

    @state() public gameFinished = StateMap.from<UInt64, Bool>(UInt64, Bool);

    public constructor(@inject('Balances') public balances: Balances) {
      super();
    }

    @runtimeMethod()
    public async createLobby(
      name: CircuitString,
      participationFee: UInt64,
      privateLobby: Bool,
      creatorSessionKey: PublicKey,
      accessKey: Field,
    ): Promise<void> {
      let lobby = await this._addLobby(
        LobbyV2.from(name, participationFee, privateLobby, accessKey),
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
        LobbyV2.default(lobbyId, Bool(false)),
      );
      await this._joinLobby(lobby);
      await this.currentLobby.set(this.transaction.sender.value, lobbyId);
      await this.activeLobby.set(lobbyId, lobby);
    }

    public async _joinLobby(lobby: LobbyV2): Promise<void> {
      const sender = this.transaction.sender.value;

      await lobby.addPlayer(sender);

      const pendingBalance = UInt64.from(
        (await this.pendingBalances.get(sender)).value,
      );

      const fee = UInt64.from(lobby.participationFee);

      const amountToTransfer = Provable.if<UInt64>(
        pendingBalance.greaterThan(fee),
        UInt64,
        UInt64.from(0),
        fee.sub(pendingBalance),
      );

      // Should be before initGame
      await this.pendingBalances.set(
        sender,
        pendingBalance.add(amountToTransfer),
      );

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

    public async _addLobby(
      lobby: LobbyV2,
      shouldUpdate: Bool,
    ): Promise<LobbyV2> {
      const lobbyId = (await this.lastLobbyId.get()).orElse(UInt64.from(1));
      lobby.id = lobbyId;
      await this.activeLobby.set(lobbyId, lobby); // It will be overwriteen later, so dont care about this
      const addValue = Provable.if<UInt64>(
        shouldUpdate,
        UInt64,
        UInt64.from(1),
        UInt64.from(0),
      );
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
    public async initGame(lobby: LobbyV2, shouldInit: Bool): Promise<UInt64> {
      let gameId = lobby.id;

      for (let player of lobby.players) {
        await this.forEachUserInInitGame(lobby, player, shouldInit);
      }

      // Set active game for each user

      lobby.started = Provable.if(shouldInit, Bool(true), lobby.started);

      await this.activeLobby.set(lobby.id, lobby);

      return gameId;
    }

    public async forEachUserInInitGame(
      lobby: LobbyV2,
      player: PublicKey,
      shouldInit: Bool,
    ): Promise<void> {
      // Eat pendingBalances of users
      let curBalance = (await this.pendingBalances.get(player)).value;
      await this.pendingBalances.set(
        player,
        Provable.if<UInt64>(shouldInit, UInt64, UInt64.from(0), curBalance),
      );

      // Set active game
      await this.activeGameId.set(
        player,
        Provable.if<UInt64>(shouldInit, UInt64, lobby.id, UInt64.zero),
      );
    }

    public async getFunds(
      gameId: UInt64,
      player1: PublicKey,
      player2: PublicKey,
      player1Share: UInt64,
      player2Share: UInt64,
    ) {
      assert((await this.gameFinished.get(gameId)).value.not());

      await this.gameFinished.set(gameId, Bool(true));

      await this.balances.mint(
        ZNAKE_TOKEN_ID,
        player1,
        UInt64.from((await this.gameFund.get(gameId)).value)
          .mul(player1Share)
          .div(player1Share.add(player2Share)),
      );
      await this.balances.mint(
        ZNAKE_TOKEN_ID,
        player2,
        UInt64.from((await this.gameFund.get(gameId)).value)
          .mul(player2Share)
          .div(player1Share.add(player2Share)),
      );
    }

    @runtimeMethod()
    public async collectPendingBalance(): Promise<void> {
      const sender = (await this.sessions.get(this.transaction.sender.value))
        .value;

      const pendingBalance = UInt64.from(
        (await this.pendingBalances.get(sender)).value,
      );

      await this.balances.mint(ZNAKE_TOKEN_ID, sender, pendingBalance);
      await this.pendingBalances.set(sender, UInt64.from(0));
    }

    public async _onLobbyEnd(lobbyId: UInt64, shouldEnd: Bool): Promise<void> {
      let lobby = (await this.activeLobby.get(lobbyId)).value;

      for (let i = 0; i < PLAYER_AMOUNT; i++) {
        await this.currentLobby.set(
          Provable.if(shouldEnd, lobby.players[i], PublicKey.empty()),
          UInt64.zero,
        );
      }

      await this.activeLobby.set(
        Provable.if<UInt64>(shouldEnd, UInt64, lobbyId, UInt64.zero),
        LobbyV2.inactive(),
      );
    }
  }

  return {
    LobbyV2Base: LobbyV2,
    LobbyManagerV2Base: LobbyManagerV2,
  };
}

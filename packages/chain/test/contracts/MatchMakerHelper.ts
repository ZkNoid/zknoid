import { runtimeMethod, runtimeModule, state } from '@proto-kit/module';
import { MatchMaker } from '../../src';
import { State, StateMap } from '@proto-kit/protocol';
import { Bool, Provable, PublicKey, Struct, UInt64 } from 'o1js';
import { Lobby } from '../../src/engine/LobbyManager';
import { assert } from 'console';
import { UInt64 as ProtoUInt64 } from '@proto-kit/library';

export class GameInfo extends Struct({
  player1: PublicKey,
  player2: PublicKey,
  winner: PublicKey,
}) {}

export { Lobby };

@runtimeModule()
export class MatchMakerHelper extends MatchMaker {
  // Game ids start from 1
  @state() public games = StateMap.from<UInt64, GameInfo>(UInt64, GameInfo);

  @state() public gamesNum = State.from<UInt64>(UInt64);

  public override async initGame(lobby: Lobby, shouldUpdate: Bool): Promise<UInt64> {
    const currentGameId = await this.getNextGameId();

    // Setting active game if opponent found
    await this.games.set(
      Provable.if(shouldUpdate, currentGameId, UInt64.from(0)),
      new GameInfo({
        player1: lobby.players[0],
        player2: lobby.players[1],
        winner: PublicKey.empty(),
      }),
    );

    await this.gamesNum.set(currentGameId);
    await this.gameFund.set(
      currentGameId,
      ProtoUInt64.from(lobby.participationFee).mul(2),
    );

    return await super.initGame(lobby, shouldUpdate);
  }

  public async getNextGameId(): Promise<UInt64> {
    return (await this.gamesNum.get()).orElse(UInt64.from(1));
  }
  public async updateNextGameId(shouldUpdate: Bool): Promise<void> {
    let curGameId = this.getNextGameId();

    await this.gamesNum.set(Provable.if(shouldUpdate, curGameId.add(1), curGameId));
  }

  @runtimeMethod()
  public async claimWin(gameId: UInt64): Promise<void> {
    const sender = this.transaction.sender.value;
    let game = (await this.games.get(gameId)).value;
    assert(game.player1.equals(sender).or(game.player2.equals(sender)));
    assert(game.winner.equals(PublicKey.empty()));

    game.winner = sender;
    await this.games.set(gameId, game);

    await this.activeGameId.set(game.player1, UInt64.zero);
    await this.activeGameId.set(game.player2, UInt64.zero);
  }

  public override async proveOpponentTimeout(gameId: UInt64): Promise<void> {}
}

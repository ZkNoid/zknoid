import { runtimeMethod, runtimeModule, state } from '@proto-kit/module';
import { MatchMaker } from '../../src';
import { State, StateMap } from '@proto-kit/protocol';
import { Bool, Provable, PublicKey, Struct, UInt64 } from 'o1js';
import { Lobby } from 'src/engine/LobbyManager';
import { assert } from 'console';

export class GameInfo extends Struct({
  player1: PublicKey,
  player2: PublicKey,
  winner: PublicKey,
}) {}

@runtimeModule()
export class MatchMakerHelper extends MatchMaker {
  // Game ids start from 1
  @state() public games = StateMap.from<UInt64, GameInfo>(UInt64, GameInfo);

  @state() public gamesNum = State.from<UInt64>(UInt64);

  public override initGame(lobby: Lobby, shouldUpdate: Bool): UInt64 {
    const currentGameId = this.getNextGameId();

    // Setting active game if opponent found
    this.games.set(
      Provable.if(shouldUpdate, currentGameId, UInt64.from(0)),
      new GameInfo({
        player1: lobby.players[0],
        player2: lobby.players[1],
        winner: PublicKey.empty(),
      }),
    );

    this.gamesNum.set(currentGameId);
    this.gameFund.set(currentGameId, this.getParticipationPrice().mul(2));

    return super.initGame(lobby, shouldUpdate);
  }

  public override getNextGameId(): UInt64 {
    return this.gamesNum.get().orElse(UInt64.from(1));
  }
  public override updateNextGameId(shouldUpdate: Bool): void {
    let curGameId = this.getNextGameId();

    this.gamesNum.set(Provable.if(shouldUpdate, curGameId.add(1), curGameId));
  }

  @runtimeMethod()
  public claimWin(gameId: UInt64): void {
    const sender = this.transaction.sender.value;
    let game = this.games.get(gameId).value;
    assert(game.player1.equals(sender).or(game.player2.equals(sender)));
    assert(game.winner.equals(PublicKey.empty()));

    game.winner = sender;
    this.games.set(gameId, game);

    this.activeGameId.set(game.player1, UInt64.zero);
    this.activeGameId.set(game.player2, UInt64.zero);
  }

  public override proveOpponentTimeout(gameId: UInt64): void {}
}

import {
  RuntimeModule,
  runtimeMethod,
  runtimeModule,
  state,
} from '@proto-kit/module';
import { StateMap } from '@proto-kit/protocol';
import { Group, Provable, PublicKey, Struct, UInt64 } from 'o1js';
import { CardGameBase } from '../../engine/cards/CardGameBase';
import {
  pokerInitialEnctyptedDeck,
  PokerCard,
  PokerDecryptProof,
  PokerEncryptedCard,
  PokerEncryptedDeck,
  PokerShuffleProof,
} from '../../engine/cards/base-decks/PokerDeck';

export const GameStatuses = {
  INIT: UInt64.from(0),
  SETUP: UInt64.from(1),
  REVEAL: UInt64.from(2),
  FINISHED: UInt64.from(3),
};

const MAX_PLAYERS = UInt64.from(2);

export class Game extends Struct({
  id: UInt64,
  status: UInt64,
  agrigatedPublicKey: PublicKey,
  encryptedDeck: PokerEncryptedDeck,
  waitNum: UInt64,
  firstPlayer: PublicKey,
  secondPlayer: PublicKey,
  winner: PublicKey,
}) {
  next(): void {
    this.waitNum = this.waitNum.add(1);
    const allPlayersMoved = this.waitNum.equals(MAX_PLAYERS);
    this.status = Provable.if(allPlayersMoved, this.status.add(1), this.status);
    this.waitNum = Provable.if(allPlayersMoved, UInt64.zero, this.waitNum);
  }
}

class ShuffleProof1 extends PokerShuffleProof {}
class PokerDecryptProof1 extends PokerDecryptProof {}

@runtimeModule()
export class BiggerCard
  extends CardGameBase<PokerCard, PokerEncryptedCard>
  implements RuntimeModule<{}>
{
  @state() public games = StateMap.from<UInt64, Game>(UInt64, Game as any);

  @runtimeMethod()
  public async participate(gameId: UInt64) {
    // Game game from contract
    let game = (await this.games.get(gameId)).value;

    // Check that staus is init
    expect(game.status.equals(GameStatuses.INIT));

    // Add sender private key to agrigated public key
    const sender = this.transaction.sender.value;
    // console.log('Sender ', sender.toBase58());

    let pubKey = Provable.if(
      game.agrigatedPublicKey.isEmpty(),
      sender,
      game.agrigatedPublicKey,
    );
    let intialGroupValue = Provable.if(
      game.agrigatedPublicKey.isEmpty(),
      Group.zero,
      pubKey.toGroup(),
    );

    game.agrigatedPublicKey = PublicKey.fromGroup(
      intialGroupValue.add(sender.toGroup()),
    );

    game.firstPlayer = Provable.if(
      game.waitNum.equals(UInt64.from(0)),
      sender,
      game.firstPlayer,
    );
    game.secondPlayer = Provable.if(
      game.waitNum.equals(UInt64.from(1)),
      sender,
      game.secondPlayer,
    );
    game.id = gameId;

    game.encryptedDeck = pokerInitialEnctyptedDeck;
    // game.encryptedDeck.cards[0].value[1] =
    //   pokerInitialEnctyptedDeck.cards[0].value[1];

    // Provable.asProver(() => {
    //   for (let i = 0; i < game.encryptedDeck.cards.length; i++) {
    //     let elem = game.encryptedDeck.cards[i];
    //     console.log(
    //       `${elem.value[0].x.toString()} ${elem.value[1].x.toString()}`,
    //     );
    //   }
    // });

    game.next();

    await this.games.set(gameId, game);
  }

  @runtimeMethod()
  public async shuffle(gameId: UInt64, shuffleProof: ShuffleProof1) {
    let game = (await this.games.get(gameId)).value;

    expect(game.status.equals(GameStatuses.SETUP));

    // #TODO add checks
    const newEncryptedDeck = this._shuffle(
      shuffleProof,
      game.encryptedDeck,
      game.agrigatedPublicKey,
    );

    game.encryptedDeck = newEncryptedDeck;

    game.next();

    await this.games.set(gameId, game);
  }

  @runtimeMethod()
  public async openCardsFirstTwo(
    gameId: UInt64,
    firstProof: PokerDecryptProof1,
    secodProof: PokerDecryptProof1,
  ) {
    let game = (await this.games.get(gameId)).value;
    expect(game.status.equals(GameStatuses.REVEAL));

    this._decrypt(game.encryptedDeck.cards[0], firstProof);
    this._decrypt(game.encryptedDeck.cards[1], secodProof);

    game.next();

    await this.games.set(gameId, game);
  }

  @runtimeMethod()
  public async pickWinner(gameId: UInt64) {
    let game = (await this.games.get(gameId)).value;
    expect(game.status.equals(GameStatuses.FINISHED));
    const firstCard = game.encryptedDeck.cards[0];
    const secondCard = game.encryptedDeck.cards[1];
    const firstCardDecoded = firstCard.toCard();
    const secondCardDecoded = secondCard.toCard();
    const firstWin = firstCardDecoded.value.greaterThanOrEqual(
      secondCardDecoded.value,
    );
    game.winner = Provable.if(firstWin, game.firstPlayer, game.secondPlayer);
    await this.games.set(gameId, game);
  }
}

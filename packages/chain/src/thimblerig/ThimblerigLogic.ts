import { state, runtimeMethod, runtimeModule } from "@proto-kit/module";
import type { Option } from "@proto-kit/protocol";
import { State, StateMap, assert } from "@proto-kit/protocol";
import {
  PublicKey,
  Struct,
  UInt64,
  Provable,
  Bool,
  Field,
  Poseidon,
} from "o1js";

import { RuntimeModule } from "@proto-kit/module";

interface MatchMakerConfig {}

const PENDING_BLOCKS_NUM = UInt64.from(5);

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

export abstract class MatchMaker extends RuntimeModule<MatchMakerConfig> {
  // Session => user
  @state() public sessions = StateMap.from<PublicKey, PublicKey>(
    PublicKey,
    PublicKey
  );
  // mapping(roundId => mapping(registered user address => bool))
  @state() public queueRegisteredRoundUsers = StateMap.from<RoundIdxUser, Bool>(
    RoundIdxUser,
    Bool
  );
  // mapping(roundId => SessionKey[])
  @state() public queueRoundUsersList = StateMap.from<
    RoundIdxIndex,
    QueueListItem
  >(RoundIdxIndex, QueueListItem);
  @state() public queueLength = StateMap.from<UInt64, UInt64>(UInt64, UInt64);

  @state() public activeGameId = StateMap.from<PublicKey, UInt64>(
    PublicKey,
    UInt64
  );

  // Game ids start from 1
  abstract games: StateMap<UInt64, any>;

  @state() public gamesNum = State.from<UInt64>(UInt64);

  /**
   * Initializes game when opponent is found
   *
   * @param opponentReady - Is opponent found. If not ready, function call should process this case without initialization
   * @param opponent - Opponent if opponent is ready
   * @returns Id of the new game. Will be set for player and opponent
   */
  public initGame(
    opponentReady: Bool,
    opponent: Option<QueueListItem>
  ): UInt64 {
    return UInt64.from(0);
  }

  /**
   * Registers user in session queue
   *
   * @param sessionKey - Key of user background session
   * @param timestamp - Current user timestamp from front-end
   */
  @runtimeMethod()
  public register(sessionKey: PublicKey, timestamp: UInt64): void {
    // If player in game – revert
    assert(
      this.activeGameId
        .get(this.transaction.sender)
        .orElse(UInt64.from(0))
        .equals(UInt64.from(0)),
      "Player already in game"
    );

    // Registering player session key
    this.sessions.set(sessionKey, this.transaction.sender);
    const roundId = this.network.block.height.div(PENDING_BLOCKS_NUM);

    // User can't re-register in round queue if already registered
    assert(
      this.queueRegisteredRoundUsers
        .get(
          new RoundIdxUser({ roundId, userAddress: this.transaction.sender })
        )
        .isSome.not(),
      "User already in queue"
    );

    const queueLength = this.queueLength.get(roundId).orElse(UInt64.from(0));

    const opponentReady = queueLength.greaterThan(UInt64.from(0));
    const opponent = this.queueRoundUsersList.get(
      new RoundIdxIndex({
        roundId,
        index: queueLength.sub(
          Provable.if(opponentReady, UInt64.from(1), UInt64.from(0))
        ),
      })
    );

    const gameId = this.initGame(opponentReady, opponent);

    // Assigning new game to player if opponent found
    this.activeGameId.set(
      this.transaction.sender,
      Provable.if(opponentReady, gameId, UInt64.from(0))
    );

    // Setting that opponent is in game if opponent found
    this.activeGameId.set(
      Provable.if(opponentReady, opponent.value.userAddress, PublicKey.empty()),
      gameId
    );

    // If opponent not found – adding current user to the list
    this.queueRoundUsersList.set(
      new RoundIdxIndex({ roundId, index: queueLength }),
      new QueueListItem({
        userAddress: Provable.if(
          opponentReady,
          PublicKey.empty(),
          this.transaction.sender
        ),
        registrationTimestamp: timestamp,
      })
    );

    // If opponent not found – registering current user in the list
    this.queueRegisteredRoundUsers.set(
      new RoundIdxUser({
        roundId,
        userAddress: Provable.if(
          opponentReady,
          PublicKey.empty(),
          this.transaction.sender
        ),
      }),
      Bool(true)
    );

    // If opponent found – removing him from queue
    this.queueRegisteredRoundUsers.set(
      new RoundIdxUser({
        roundId,
        userAddress: Provable.if(
          opponentReady,
          opponent.value.userAddress,
          PublicKey.empty()
        ),
      }),
      Bool(false)
    );

    // If opponent not found – incrementing queue length. If found – removing opponent by length decreasing
    this.queueLength.set(
      roundId,
      Provable.if(
        opponentReady,
        queueLength.sub(
          Provable.if(opponentReady, UInt64.from(1), UInt64.from(0))
        ),
        queueLength.add(1)
      )
    );
  }
}

const BLOCK_PRODUCTION_SECONDS = 5;
const MOVE_TIMEOUT_IN_BLOCKS = 60 / BLOCK_PRODUCTION_SECONDS;

export class ThimblerigField extends Struct({
  commitedHash: Field,
  choice: UInt64,
}) {}

export class GameInfo extends Struct({
  player1: PublicKey,
  player2: PublicKey,
  currentMoveUser: PublicKey,
  lastMoveBlockHeight: UInt64,
  thimblerigField: ThimblerigField,
  winner: PublicKey,
}) {}

@runtimeModule()
export class ThimblerigLogic extends MatchMaker {
  // Game ids start from 1
  @state() public games = StateMap.from<UInt64, GameInfo>(UInt64, GameInfo);

  @state() public gamesNum = State.from<UInt64>(UInt64);

  public override initGame(
    opponentReady: Bool,
    opponent: Option<QueueListItem>
  ): UInt64 {
    const currentGameId = this.gamesNum
      .get()
      .orElse(UInt64.from(0))
      .add(UInt64.from(1));
    // Setting active game if opponent found
    this.games.set(
      Provable.if(opponentReady, currentGameId, UInt64.from(0)),
      new GameInfo({
        player1: this.transaction.sender,
        player2: opponent.value.userAddress,
        currentMoveUser: this.transaction.sender,
        lastMoveBlockHeight: this.network.block.height,
        thimblerigField: new ThimblerigField({
          choice: UInt64.from(0),
          commitedHash: Field.from(0),
        }),
        winner: PublicKey.empty(),
      })
    );

    this.gamesNum.set(currentGameId);

    return currentGameId;
  }

  @runtimeMethod()
  public commitValue(gameId: UInt64, commitmentHash: Field): void {
    const sessionSender = this.sessions.get(this.transaction.sender);
    const sender = Provable.if(
      sessionSender.isSome,
      sessionSender.value,
      this.transaction.sender
    );

    const game = this.games.get(gameId);
    assert(game.isSome, "Invalid game id");
    assert(commitmentHash.greaterThan(0), "Invalid commitment");
    assert(
      game.value.thimblerigField.choice.equals(UInt64.from(0)),
      "Already chosen"
    );
    assert(
      game.value.thimblerigField.commitedHash.equals(0),
      "Already commited"
    );
    assert(
      game.value.player1.equals(sender),
      `Only player1 should commit value`
    );
    assert(game.value.winner.equals(PublicKey.empty()), `Game finished`);

    game.value.thimblerigField.commitedHash = commitmentHash;
    game.value.currentMoveUser = game.value.player2;
    game.value.lastMoveBlockHeight = this.network.block.height;
    this.games.set(gameId, game.value);
  }

  @runtimeMethod()
  public chooseThumble(gameId: UInt64, choice: UInt64): void {
    const sessionSender = this.sessions.get(this.transaction.sender);
    const sender = Provable.if(
      sessionSender.isSome,
      sessionSender.value,
      this.transaction.sender
    );

    const game = this.games.get(gameId);
    assert(game.isSome, "Invalid game id");
    assert(
      Bool.and(
        choice.greaterThanOrEqual(UInt64.from(1)),
        choice.lessThanOrEqual(UInt64.from(3))
      ),
      "Invalid choice"
    );
    assert(
      game.value.thimblerigField.choice.equals(UInt64.from(0)),
      "Already chosen"
    );
    assert(
      game.value.thimblerigField.commitedHash.greaterThan(0),
      "Not commited"
    );
    assert(
      game.value.player2.equals(sender),
      `Only player2 should make choice`
    );
    assert(game.value.winner.equals(PublicKey.empty()), `Game finished`);

    game.value.thimblerigField.choice = choice;
    game.value.currentMoveUser = game.value.player1;
    game.value.lastMoveBlockHeight = this.network.block.height;
    this.games.set(gameId, game.value);
  }

  @runtimeMethod()
  public revealCommitment(gameId: UInt64, commitmentValue: Field): void {
    const sessionSender = this.sessions.get(this.transaction.sender);
    const sender = Provable.if(
      sessionSender.isSome,
      sessionSender.value,
      this.transaction.sender
    );

    const game = this.games.get(gameId);
    assert(game.isSome, "Invalid game id");
    assert(commitmentValue.greaterThan(0), "Invalid commitment");
    assert(
      game.value.thimblerigField.choice.greaterThan(UInt64.from(0)),
      "Not chosen"
    );
    assert(
      game.value.thimblerigField.commitedHash.greaterThan(0),
      "Not commited"
    );
    assert(
      game.value.player1.equals(sender),
      `Only player1 should reveal value`
    );
    assert(game.value.winner.equals(PublicKey.empty()), `Game finished`);

    assert(
      Poseidon.hash([commitmentValue]).equals(
        game.value.thimblerigField.commitedHash
      ),
      "Incorrect reveal"
    );
    game.value.thimblerigField.commitedHash = commitmentValue;
    game.value.currentMoveUser = game.value.player2;
    game.value.lastMoveBlockHeight = this.network.block.height;
    game.value.winner = Provable.if(
      UInt64.from(commitmentValue.rangeCheckHelper(64))
        .mod(UInt64.from(3))
        .equals(game.value.thimblerigField.choice),
      game.value.player1,
      game.value.player2
    );

    this.games.set(gameId, game.value);
  }

  @runtimeMethod()
  public proveCommitNotRevealed(gameId: UInt64): void {
    const sessionSender = this.sessions.get(this.transaction.sender);
    const sender = Provable.if(
      sessionSender.isSome,
      sessionSender.value,
      this.transaction.sender
    );

    const game = this.games.get(gameId);
    assert(game.isSome, "Invalid game id");
    assert(
      game.value.thimblerigField.choice.equals(UInt64.from(0)),
      "Already chosen"
    );
    assert(
      game.value.thimblerigField.commitedHash.equals(0),
      "Already commited"
    );
    assert(
      game.value.player1.equals(sender),
      `Only player1 should prove value is not revealed`
    );
  }
}

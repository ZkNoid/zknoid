import {
  RuntimeModule,
  runtimeModule,
  state,
  runtimeMethod,
} from "@proto-kit/module";
import { Option, State, StateMap, assert } from "@proto-kit/protocol";
import { PublicKey, Struct, UInt64, Provable, Bool, UInt32, Poseidon, Field } from "o1js";

interface MatchMakerConfig { }

const PENDING_BLOCKS_NUM = UInt64.from(5);
const RANDZU_FIELD_SIZE = 15;
const CELLS_LINE_TO_WIN = 15;

export class RandzuField extends Struct({
  value: Provable.Array(Provable.Array(UInt32, RANDZU_FIELD_SIZE), RANDZU_FIELD_SIZE),
}) {
  static from(value: number[][]) {
    return new RandzuField({ value: value.map((row) => row.map(x => UInt32.from(x))) });
  }

  hash() {
    return Poseidon.hash(this.value.flat().map(x => x.value));
  }
}

export class WinPositions extends Struct({
  value: Provable.Array(UInt32, CELLS_LINE_TO_WIN),
}) { }

export class RoundIdxUser extends Struct({
  roundId: UInt64,
  userAddress: PublicKey
}) { }

export class RoundIdxIndex extends Struct({
  roundId: UInt64,
  index: UInt64
}) { }

export class AddressxAddress extends Struct({
  user1: PublicKey,
  user2: PublicKey
}) { }

export class GameInfo extends Struct({
  player1: PublicKey,
  player2: PublicKey,
  currentMoveUser: PublicKey,
  field: RandzuField,
}) { }

export class QueueListItem extends Struct({
  userAddress: PublicKey,
  registrationTimestamp: UInt64
}) { }

@runtimeModule()
export class MatchMaker extends RuntimeModule<MatchMakerConfig> {
  // Session => user
  @state() public sesions = StateMap.from<PublicKey, PublicKey>(
    PublicKey,
    PublicKey
  );
  // mapping(roundId => mapping(registered user address => bool))
  @state() public queueRegisteredRoundUsers = StateMap.from<RoundIdxUser, Bool>(
    RoundIdxUser,
    Bool
  );
  // mapping(roundId => SessionKey[])
  @state() public queueRoundUsersList = StateMap.from<RoundIdxIndex, QueueListItem>(
    RoundIdxIndex,
    QueueListItem
  );
  @state() public queueLength = StateMap.from<UInt64, UInt64>(
    UInt64,
    UInt64
  );

  @state() public activeGameId = StateMap.from<PublicKey, UInt64>(
    PublicKey,
    UInt64
  );

  // Game ids start from 1
  @state() public games = StateMap.from<UInt64, GameInfo>(
    UInt64,
    GameInfo
  );

  @state() public gamesNum = State.from<UInt64>(UInt64);

  @runtimeMethod()
  public register(sessionKey: PublicKey, timestamp: UInt64): void {
    // If player in game – revert
    assert(this.activeGameId.get(this.transaction.sender).orElse(UInt64.from(0)).equals(UInt64.from(0)), "Player already in game");

    // Registering player session key
    this.sesions.set(sessionKey, this.transaction.sender);
    const roundId = this.network.block.height.div(PENDING_BLOCKS_NUM);

    // User can't re-register in round queue if already registered
    assert(
      this.queueRegisteredRoundUsers.get(new RoundIdxUser({ roundId, userAddress: this.transaction.sender })).isSome.not(),
      "User already in queue"
    );

    const queueLength = this.queueLength.get(roundId).orElse(UInt64.from(0));

    const opponentReady = queueLength.greaterThan(UInt64.from(0));
    const opponent = this.queueRoundUsersList.get(
      new RoundIdxIndex({ roundId, index: queueLength.sub(Provable.if(opponentReady, UInt64.from(1), UInt64.from(0))) })
    );

    const gameId = this.gamesNum.get().orElse(UInt64.from(0)).add(UInt64.from(1));
    // Setting active game if opponent found
    this.games.set(
      Provable.if(
        opponentReady,
        gameId,
        UInt64.from(0)
      ),
      new GameInfo({
        player1: this.transaction.sender,
        player2: opponent.value.userAddress,
        currentMoveUser: this.transaction.sender,
        field: RandzuField.from(Array(RANDZU_FIELD_SIZE).fill(Array(RANDZU_FIELD_SIZE).fill(0)))
      })
    );

    // Assigning new game to player if opponent found
    this.activeGameId.set(this.transaction.sender, Provable.if(opponentReady, gameId, UInt64.from(0)));

    // Setting that opponent is in game if opponent found
    this.activeGameId.set(Provable.if(opponentReady, opponent.value.userAddress, PublicKey.empty()), gameId);

    // If opponent not found – adding current user to the list
    this.queueRoundUsersList.set(
      new RoundIdxIndex({ roundId, index: queueLength }),
      new QueueListItem({ userAddress: Provable.if(opponentReady, PublicKey.empty(), this.transaction.sender), registrationTimestamp: timestamp })
    );

    // If opponent not found – registeting current user in the list
    this.queueRegisteredRoundUsers.set(
      new RoundIdxUser(
        { roundId, userAddress: Provable.if(opponentReady, PublicKey.empty(), this.transaction.sender) }
      ),
      Bool(true)
    );

    // If opponent not found – incrementing queue length. If found – removing opponent by length decreasing 
    this.queueLength.set(roundId, (Provable.if(opponentReady, queueLength.sub(Provable.if(opponentReady, UInt64.from(1), UInt64.from(0))), queueLength.add(1))));
  }

  @runtimeMethod()
  public makeMove(gameId: UInt64, newField: RandzuField, winPositions: WinPositions): void {
    const sessionSender = this.sesions.get(this.transaction.sender);
    const sender = Provable.if(sessionSender.isSome, sessionSender.value, this.transaction.sender);

    const game = this.games.get(gameId);
    assert(game.isSome, "Invalid game id");
    assert(
      game.value.currentMoveUser.equals(sender), 
      `Not your move: ${sender.toBase58()}`
    );

    let addedCellsNum = UInt64.from(0);
    for (let i = 0; i < RANDZU_FIELD_SIZE; i++) {
      for (let j = 0; j < RANDZU_FIELD_SIZE; j++) {
        let currentFieldCell = game.value.field.value[i][j];
        let nextFieldCell = newField.value[i][j];
        assert(Bool.or(currentFieldCell.equals(UInt32.from(0)), currentFieldCell.equals(nextFieldCell)),
          `Modified filled cell at ${i}, ${j}`
        );
        addedCellsNum.add(Provable.if(currentFieldCell.equals(nextFieldCell), UInt64.from(0), UInt64.from(1)));
        assert(addedCellsNum.lessThanOrEqual(UInt64.from(1)), `Not only one cell added. Error at ${i}, ${j}`);
      }
    }

    game.value.field = newField;
    game.value.currentMoveUser = Provable.if(
      game.value.currentMoveUser.equals(game.value.player1), 
      game.value.player2, 
      game.value.player1
    );
    this.games.set(gameId, game.value);
  }
}

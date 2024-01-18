import {
    RuntimeModule,
    runtimeModule,
    state,
    runtimeMethod,
  } from "@proto-kit/module";
  import { State, StateMap, assert } from "@proto-kit/protocol";
  import { PublicKey, Struct, UInt64, Provable, Bool, UInt32 } from "o1js";
  
  interface MatchMakerConfig { }
  
  const PENDING_BLOCKS_NUM = UInt64.from(5);
  const RANDZU_FIELD_SIZE = 15 * 15;

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

  export class RandzuField extends Struct({
    field: Provable.Array(UInt32, RANDZU_FIELD_SIZE),
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

    @state() public inGame = StateMap.from<PublicKey, Bool>(
      PublicKey,
      Bool
    );

    @state() public activeGames = StateMap.from<AddressxAddress, RandzuField>(
      AddressxAddress,
      RandzuField
    );
  
    @runtimeMethod()
    public register(sessionKey: PublicKey, timestamp: UInt64): void {
      // If player in game – revert
      this.inGame.get(this.transaction.sender).orElse(Bool(false)).assertEquals(false);

      // Registering player session key
      this.sesions.set(sessionKey, this.transaction.sender);
      const roundId = this.network.block.height.div(PENDING_BLOCKS_NUM);

      // User can't re-register in round queue if already registered
      this.queueRegisteredRoundUsers.get(new RoundIdxUser({roundId, userAddress: this.transaction.sender})).isSome.not();

      const queueLength = this.queueLength.get(roundId).orElse(UInt64.from(0));

      const opponentReady = queueLength.greaterThan(UInt64.from(0));
      const opponent = this.queueRoundUsersList.get(new RoundIdxIndex({ roundId, index: queueLength.sub(Provable.if(opponentReady, UInt64.from(1), UInt64.from(0))) }));

      // Setting that player is in game
      this.inGame.set(this.transaction.sender, Bool(true));

      // Setting that opponent is in game if opponent found
      this.inGame.set(Provable.if(opponentReady, opponent.value.userAddress, PublicKey.empty()), Bool(true));

      // Setting active game if opponent found
      this.activeGames.set(
        Provable.if(
          opponentReady,
          AddressxAddress,
          new AddressxAddress({ user1: this.transaction.sender, user2: opponent.value.userAddress }), 
          new AddressxAddress({ user1: PublicKey.empty(), user2: PublicKey.empty() })
        ),
        new RandzuField({
          field: Array(RANDZU_FIELD_SIZE)
        })
      );

      // If opponent not found – adding current user to the list
      this.queueRoundUsersList.set(
        new RoundIdxIndex({roundId, index: queueLength}), 
        new QueueListItem({userAddress: Provable.if(opponentReady, PublicKey.empty(), this.transaction.sender), registrationTimestamp: timestamp})
      );

      // If opponent not found – registeting current user in the list
      this.queueRegisteredRoundUsers.set(
        new RoundIdxUser(
          {roundId, userAddress: Provable.if(opponentReady, PublicKey.empty(), this.transaction.sender)}
        ), 
        Bool(true)
      );

      // If opponent not found – incrementing queue length. If found – removing opponent by length decreasing 
      this.queueLength.set(roundId, (Provable.if(opponentReady, queueLength.sub(1), queueLength.add(1))));
    }
  }

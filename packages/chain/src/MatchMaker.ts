import {
    RuntimeModule,
    runtimeModule,
    state,
    runtimeMethod,
  } from "@proto-kit/module";
  import { State, StateMap, assert } from "@proto-kit/protocol";
  import { PublicKey, Struct, UInt64, Provable, Bool } from "o1js";
  
  interface MatchMakerConfig {
  }
  
  const PENDING_BLOCKS_NUM = UInt64.from(5);

  export class RoundIdxUser extends Struct({
    roundId: UInt64,
    userAddress: PublicKey
  }) { }

  export class RoundIdxIndex extends Struct({
    roundId: UInt64,
    index: UInt64
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
    @state() public queueRoundUsersList = StateMap.from<RoundIdxIndex, PublicKey>(
      RoundIdxIndex,
      PublicKey
    );
    @state() public queueLength = StateMap.from<UInt64, UInt64>(
      UInt64,
      UInt64
    );
    @state() public confirmations = StateMap.from<PublicKey, PublicKey>(
      PublicKey,
      PublicKey
    );
  
    @runtimeMethod()
    public register(sessionKey: PublicKey): void {
      this.sesions.set(sessionKey, this.transaction.sender);
      const roundId = this.network.block.height.div(PENDING_BLOCKS_NUM);
      
      const queueLength = this.queueLength.get(roundId).orElse(UInt64.from(0));

      // If already registered place player on 99999999999 place in queue
      const nextIndex = Provable.if(this.queueRegisteredRoundUsers.get(
        new RoundIdxUser({roundId, userAddress: this.transaction.sender})).isSome.not(),
        queueLength, UInt64.from(99999999999)
      );
      const queueLengthDiff = Provable.if(this.queueRegisteredRoundUsers.get(
        new RoundIdxUser({roundId, userAddress: this.transaction.sender})).isSome.not(),
        UInt64.from(1), UInt64.from(0)
      );
      this.queueRoundUsersList.set(new RoundIdxIndex({roundId, index: nextIndex}), sessionKey);
      this.queueRegisteredRoundUsers.set(new RoundIdxUser({roundId, userAddress: this.transaction.sender}), Bool(true));
      this.queueLength.set(roundId, queueLength.add(queueLengthDiff));
    }

    @runtimeMethod()
    public keepSession(): void {
    }

    @runtimeMethod()
    public requestMatch(opponentKey: PublicKey): void {
      this.confirmations.set(this.transaction.sender, opponentKey);
    }

    @runtimeMethod()
    public confirmMatch(opponentKey: PublicKey): void {
      this.confirmations.set(this.transaction.sender, opponentKey);
    }

  }